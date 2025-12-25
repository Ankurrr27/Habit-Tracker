import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔒 NEVER return password by default
    },

    // 🔥 CLOUDINARY AVATAR
    avatar: {
      type: String, // Cloudinary secure_url
      default: "",
    },

    profilePublic: {
      type: Boolean,
      default: false,
    },

    credibilityScore: {
      type: Number,
      default: 0,
    },

    // 🔥 AUTH / SESSION READY
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
