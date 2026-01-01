import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  count: { type: Number, default: 0 },
});

export default mongoose.model("View", ViewSchema);
