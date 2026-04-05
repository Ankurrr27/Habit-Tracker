import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import FriendRequest from "../models/friendRequest.model.js";

const emptyExternalProfiles = () => ({
  github: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
  gfg: "",
  codolio: "",
});

const normalizeExternalProfiles = (value) => {
  const source =
    typeof value === "string" ? JSON.parse(value || "{}") : value || {};

  return {
    github: String(source.github || "").trim(),
    leetcode: String(source.leetcode || "").trim(),
    codeforces: String(source.codeforces || "").trim(),
    codechef: String(source.codechef || "").trim(),
    gfg: String(source.gfg || "").trim(),
    codolio: String(source.codolio || "").trim(),
  };
};

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
      email: isOwner ? user.email : undefined,
      avatar: user.avatar,
      profilePublic: user.profilePublic,
      credibilityScore: user.credibilityScore,
      createdAt: user.createdAt,
      externalProfiles: isOwner
        ? user.externalProfiles || emptyExternalProfiles()
        : undefined,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();

    if (!user || !user.profilePublic) {
      return res.status(404).json({ message: "Public profile not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      profilePublic: true,
      credibilityScore: user.credibilityScore,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // We need the current user's following list to know who they follow
    const currentUser = await User.findById(currentUserId, "following").lean();
    const followingIds = new Set(
      (currentUser?.following || []).map((id) => id.toString())
    );

    const users = await User.find(
      {},
      "name username avatar profilePublic credibilityScore"
    ).lean();

    const formatted = users.map((user) => {
      const isSelf = user._id.toString() === currentUserId;
      const isFollowing = followingIds.has(user._id.toString());

      if (!user.profilePublic && !isSelf) {
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          profilePublic: false,
          isFollowing,
          isSelf,
        };
      }

      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        profilePublic: user.profilePublic,
        credibilityScore: user.credibilityScore,
        isFollowing,
        isSelf,
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    if (req.body.profilePublic !== undefined) {
      if (typeof req.body.profilePublic === "boolean") {
        user.profilePublic = req.body.profilePublic;
      } else {
        user.profilePublic = req.body.profilePublic === "true";
      }
    }

    if (req.body.externalProfiles !== undefined) {
      user.externalProfiles = normalizeExternalProfiles(
        req.body.externalProfiles
      );
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
        externalProfiles: user.externalProfiles || emptyExternalProfiles(),
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const users = await User.find(
      {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { username: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      },
      "name username avatar"
    )
      .limit(10)
      .lean();

    res.json(users);
  } catch (err) {
    console.error("SEARCH USERS ERROR:", err);
    res.status(500).json([]);
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUsername = req.params.username;

    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUserId === targetUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow logic
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUser._id },
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $pull: { followers: currentUserId },
      });
      res.json({ message: "Unfollowed successfully", isFollowing: false });
    } else {
      // Follow logic
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUser._id },
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $addToSet: { followers: currentUserId },
      });
      res.json({ message: "Followed successfully", isFollowing: true });
    }
  } catch (err) {
    console.error("TOGGLE FOLLOW ERROR:", err);
    res.status(500).json({ message: "Failed to toggle follow status" });
  }
};
