import User from "../models/User.model.js";

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isOwner =
      req.user && req.user.id === user.id;

    if (!user.profilePublic && !isOwner) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      profilePublic: user.profilePublic,
      credibilityScore: user.credibilityScore,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
