import ActivityLog from "../models/activityLog.model.js";
import Proof from "../models/proof.model.js";




export const addProof = async (req, res) => {
  try {
    const { logId } = req.params;
    const { type, value } = req.body;

    // basic validation
    if (!type || !value) {
      return res.status(400).json({ message: "Proof type and value required" });
    }

    const log = await ActivityLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: "Activity log not found" });
    }

    // create proof
    await Proof.create({
      activityLog: logId,
      type,
      value,
      weight: 30, // simple rule
    });

    // increase confidence (cap at 100)
    log.confidence = Math.min(log.confidence + 30, 100);
    await log.save();

    res.json({
      message: "Proof added",
      confidence: log.confidence,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

