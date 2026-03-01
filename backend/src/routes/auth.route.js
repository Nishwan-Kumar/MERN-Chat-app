import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import { googleCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectedRoute,updateProfile)

router.get("/check",protectedRoute,checkAuth)

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;