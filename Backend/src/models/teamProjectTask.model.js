import mongoose from "mongoose";

const teamProjectTaskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamProject",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeamProjectTask", teamProjectTaskSchema);
