import EventLog from "../models/eventLog.model.js";

export const logEvent = async ({
  userId = null,
  eventType,
  message,
  metadata = {},
  level = "info",
}) => {
  try {
    EventLog.create({
      userId,
      eventType,
      message,
      metadata,
      level,
    });
  } catch (error) {
    console.error("Event log failed:", error.message);
  }
};