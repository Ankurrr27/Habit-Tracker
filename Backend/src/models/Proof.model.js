import mongoose from "mongoose";

const proofSchema = new mongoose.Schema(
  {
    activityLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityLog",
    },

    type: {
      type: String,
      enum: ["github", "link", "manual"],
      required: true,
    },

    value: String, // URL / commit hash / note

    weight: {
      type: Number, // how strong this proof is
      default: 10,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Proof", proofSchema);
