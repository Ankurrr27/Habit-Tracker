import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import FriendRequest from "../models/friendRequest.model.js";

const emptyExternalProfiles = () => ({
  github: "",
  leetcode: "",
  codeforces: "",
  codechef: "",
});

const normalizeExternalProfiles = (value) => {
  const source =
    typeof value === "string" ? JSON.parse(value || "{}") : value || {};

  return {
    github: String(source.github || "").trim(),
    leetcode: String(source.leetcode || "").trim(),
    codeforces: String(source.codeforces || "").trim(),
    codechef: String(source.codechef || "").trim(),
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

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find(
      {},
      "name username avatar profilePublic credibilityScore"
    ).lean();

    const friendRequests = await FriendRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).lean();

    const friendshipMap = new Map();

    friendRequests.forEach((request) => {
      const otherUserId =
        request.sender.toString() === currentUserId
          ? request.receiver.toString()
          : request.sender.toString();

      if (request.status === "accepted") {
        friendshipMap.set(otherUserId, "friends");
      } else if (request.status === "pending") {
        friendshipMap.set(
          otherUserId,
          request.sender.toString() === currentUserId
            ? "request_sent"
            : "request_received"
        );
      }
    });

    const formatted = users.map((user) => {
      const friendshipStatus =
        user._id.toString() === currentUserId
          ? "self"
          : friendshipMap.get(user._id.toString()) || "none";

      if (!user.profilePublic) {
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          profilePublic: false,
          friendshipStatus,
        };
      }

      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        profilePublic: true,
        credibilityScore: user.credibilityScore,
        friendshipStatus,
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

export const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("sender", "name username avatar credibilityScore")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("GET FRIEND REQUESTS ERROR:", err);
    res.status(500).json([]);
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User is required" });
    }

    if (senderId === userId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ],
    });

    if (existing?.status === "accepted") {
      return res.status(400).json({ message: "Already friends" });
    }

    if (existing?.status === "pending") {
      return res.status(400).json({
        message: "Friend request already pending",
      });
    }

    if (existing?.status === "rejected") {
      existing.sender = senderId;
      existing.receiver = userId;
      existing.status = "pending";
      await existing.save();
      return res.json({ message: "Friend request sent" });
    }

    await FriendRequest.create({
      sender: senderId,
      receiver: userId,
      status: "pending",
    });

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error("SEND FRIEND REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to send friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request || request.receiver.toString() !== req.user.id) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("ACCEPT FRIEND REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to accept request" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request || request.receiver.toString() !== req.user.id) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error("REJECT FRIEND REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
};
