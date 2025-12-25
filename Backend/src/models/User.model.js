import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePublic: { type: Boolean, default: false },

    credibilityScore: {
      type: Number,
      default: 0, // cached, recomputed periodically
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
