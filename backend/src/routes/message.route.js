import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSlidebar, sendMessage, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",protectedRoute,getUsersForSlidebar)
router.get("/:id",protectedRoute,getMessages)
router.post("/send/:id",protectedRoute,sendMessage)
router.delete("/delete/:id",protectedRoute,deleteMessage)

export default router;