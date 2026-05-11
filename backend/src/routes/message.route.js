import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",protectedRoute,getUsersForSidebar)
router.get("/:id",protectedRoute,getMessages)
router.post("/send/:id",protectedRoute,sendMessage)
router.delete("/delete/:id",protectedRoute,deleteMessage)

export default router;