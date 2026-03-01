import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import { connectDB } from './lib/db.js';
import cors from "cors"
import { app, server } from "./lib/Socket.js";
import path from 'path';
import session from "express-session";
import passport from "./lib/passport.js";

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "oauth_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
// NOTE: passport.session() is intentionally omitted — this app uses JWT (stateless auth)
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();   // ✅ Wait for DB connection
    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

