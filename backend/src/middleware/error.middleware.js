import { logEvent } from "../services/eventLog.service.js";

const errorHandler = (err, req, res, next) => {
  logEvent({
    eventType: "ERROR",
    level: "error",
    message: err.message,
    metadata: {
      path: req.originalUrl,
      method: req.method,
      userId: req.user?._id || null,
    },
  });

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;