import Team from "../models/team.model.js";

/* =====================
   CREATE TEAM
===================== */
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

/* =====================
   GET MY TEAMS
===================== */
export const getMyTeams = async (req, res) => {
  const teams = await Team.find({
    "members.user": req.user.id,
  })
    .select("name description meetingLink members createdAt")
    .sort({ createdAt: -1 });

  const result = teams.map((team) => {
    const myMember = team.members.find(
      (m) => m.user.toString() === req.user.id
    );

    return {
      _id: team._id,
      name: team.name,
      description: team.description,
      meetingLink: team.meetingLink,
      createdAt: team.createdAt,
      myRole: myMember?.role || "member",
    };
  });

  res.json(result);
};


/* =====================
   GET TEAM BY ID
===================== */
export const getTeamById = async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate("members.user", "name username avatar");

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const myMember = team.members.find(
    (m) => m.user._id.toString() === req.user.id
  );

  if (!myMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    ...team.toObject(),
    myRole: myMember.role, // 🔥 THIS IS THE KEY
  });
};

/* =====================
   UPDATE MEETING LINK
===================== */
export const updateMeetingLink = async (req, res) => {
  const { teamId } = req.params;
  const { meetingLink } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const isAdmin = team.members.some(
    (m) =>
      m.user.toString() === req.user.id &&
      (m.role === "owner" || m.role === "admin")
  );

  if (!isAdmin) {
    return res.status(403).json({ message: "Not allowed" });
  }

  team.meetingLink = meetingLink;
  await team.save();

  res.json({ message: "Meeting link updated", meetingLink });
};
