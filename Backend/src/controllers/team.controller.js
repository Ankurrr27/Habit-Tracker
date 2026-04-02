import Team from "../models/team.model.js";
import TeamInvite from "../models/teamInvite.model.js";

export const createTeam = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Team name is required" });
  }

  const team = await Team.create({
    name,
    description,
    owner: req.user.id,
    members: [
      {
        user: req.user.id,
        role: "owner",
      },
    ],
  });

  res.status(201).json(team);
};

export const getMyTeams = async (req, res) => {
  const teams = await Team.find({
    "members.user": req.user.id,
  })
    .select("name description meetingLink members createdAt")
    .sort({ createdAt: -1 });

  const result = teams.map((team) => {
    const myMember = team.members.find(
      (member) => member.user.toString() === req.user.id
    );

    return {
      _id: team._id,
      name: team.name,
      description: team.description,
      meetingLink: team.meetingLink,
      createdAt: team.createdAt,
      membersCount: team.members.length,
      myRole: myMember?.role || "member",
    };
  });

  res.json(result);
};

export const getTeamById = async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId).populate(
    "members.user",
    "name username avatar"
  );

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const myMember = team.members.find(
    (member) => member.user._id.toString() === req.user.id
  );

  if (!myMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    ...team.toObject(),
    myRole: myMember.role,
  });
};

export const updateMeetingLink = async (req, res) => {
  const { teamId } = req.params;
  const { meetingLink } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const isAdmin = team.members.some(
    (member) =>
      member.user.toString() === req.user.id &&
      (member.role === "owner" || member.role === "admin")
  );

  if (!isAdmin) {
    return res.status(403).json({ message: "Not allowed" });
  }

  team.meetingLink = meetingLink?.trim() || "";
  await team.save();

  res.json({ message: "Meeting link updated", meetingLink: team.meetingLink });
};

export const leaveTeam = async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const myMember = team.members.find(
    (member) => member.user.toString() === req.user.id
  );

  if (!myMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (myMember.role === "owner") {
    return res.status(400).json({
      message: "Owners cannot leave the team. Delete it instead.",
    });
  }

  team.members = team.members.filter(
    (member) => member.user.toString() !== req.user.id
  );
  await team.save();

  await TeamInvite.deleteMany({
    team: teamId,
    invitedUser: req.user.id,
    status: "pending",
  });

  res.json({ message: "Left team" });
};

export const deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (team.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: "Only the owner can delete this team" });
  }

  await TeamInvite.deleteMany({ team: teamId });
  await team.deleteOne();

  res.json({ message: "Team deleted" });
};
