import crypto from "crypto";
import Team from "../models/team.model.js";
import TeamInvite from "../models/teamInvite.model.js";
import User from "../models/user.model.js";


/* =====================
   INVITE USER (PENDING)
===================== */
export const inviteUser = async (req, res) => {
  try {
    const { teamId, identifier } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isAdmin = team.members?.some(
      (m) =>
        m.user?.toString() === req.user.id &&
        ["owner", "admin"].includes(m.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = await TeamInvite.findOne({
      team: teamId,
      invitedUser: user._id,
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ message: "Already invited" });
    }

    await TeamInvite.create({
      team: teamId,
      invitedUser: user._id,
      invitedBy: req.user.id,
      status: "pending",
    });

    res.json({ message: "Invite sent" });
  } catch (err) {
    console.error("Invite user error:", err);
    res.status(500).json({ message: "Failed to send invite" });
  }
};

/* =====================
   GET MY INVITES
===================== */
export const getMyInvites = async (req, res) => {
  const invites = await TeamInvite.find({
    invitedUser: req.user.id,
    status: "pending",
  })
    .populate("team", "name")
    .populate("invitedBy", "name username");

  res.json(invites);
};



/* =====================
   ACCEPT INVITE
===================== */
export const acceptInvite = async (req, res) => {
  try {
    const invite = await TeamInvite.findById(req.params.inviteId)
      .populate("team");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ message: "Invite already handled" });
    }

    const team = invite.team;
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 🔒 prevent duplicates
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === req.user.id
    );

    if (!alreadyMember) {
      team.members.push({
        user: req.user.id,
        role: "member",
      });
      await team.save();
    }

    invite.status = "accepted";
    await invite.save();

    res.json({
      message: "Joined team",
      teamId: team._id,
    });
  } catch (err) {
    console.error("Accept invite error:", err);
    res.status(500).json({ message: "Failed to accept invite" });
  }
};



/* =====================
   REJECT INVITE
===================== */
export const rejectInvite = async (req, res) => {
  const invite = await TeamInvite.findById(req.params.inviteId);

  if (!invite || invite.invitedUser.toString() !== req.user.id)
    return res.status(404).json({ message: "Invite not found" });

  invite.status = "rejected";
  await invite.save();

  res.json({ message: "Invite rejected" });
};
