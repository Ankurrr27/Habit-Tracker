import User from "../models/User.model.js";

/**
 * GET /users
 * Everyone visible, data depends on profilePublic
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name username avatar profilePublic credibilityScore"
    ).lean();

    const formatted = users.map((u) => {
      if (!u.profilePublic) {
        return {
          name: u.name,
          username: u.username,
          avatar: u.avatar,
          profilePublic: false,
        };
      }

      return {
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        profilePublic: true,
        credibilityScore: u.credibilityScore,
        // streak will come later from activity logs
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Get users failed:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
