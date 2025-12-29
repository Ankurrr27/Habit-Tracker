import User from "../models/user.model.js";

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isOwner = req.user && req.user.id === user.id;

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

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name username avatar profilePublic credibilityScore",
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

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }

    if (req.body.username) {
      const username = req.body.username.toLowerCase().trim();

      if (!/^[a-z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Invalid username format" });
      }

      const exists = await User.findOne({
        username,
        _id: { $ne: user._id },
      });

      if (exists) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = username;
    }

    if (typeof req.body.profilePublic === "boolean") {
      user.profilePublic = req.body.profilePublic;
    }

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        crop: "fill",
      });
      user.avatar = upload.secure_url;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        profilePublic: user.profilePublic,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
