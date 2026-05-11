import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    eventType: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["info", "warning", "error"],
      default: "info",
    },
    message: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventLog", eventLogSchema);