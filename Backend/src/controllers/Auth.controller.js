import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../utils/jwt.js";

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 Generate unique username
    const baseUsername = name.toLowerCase().replace(/\s+/g, "_");
    let username = baseUsername;
    let count = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}_${count++}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatar = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        crop: "fill",
      });
      avatar = upload.secure_url;
    }

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier = email OR username

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/**
 * UPDATE PROFILE
 */
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



/**
 * GET CURRENT USER
 */
export const me = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    profilePublic: user.profilePublic,
    credibilityScore: user.credibilityScore,
  });
};


