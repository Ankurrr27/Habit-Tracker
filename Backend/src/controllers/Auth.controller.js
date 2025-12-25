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
      email,
      password: hashedPassword,
      avatar,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
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
        id: user._id,
        name: user.name,
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
        id: user._id,
        name: user.name,
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
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    profilePublic: user.profilePublic,
    credibilityScore: user.credibilityScore,
  });
};
