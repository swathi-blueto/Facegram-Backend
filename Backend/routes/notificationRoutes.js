import express from "express";
import {
  fetchNotifications,
  deleteNotif,
  markAsRead
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:userId", fetchNotifications);
router.delete("/:id", authenticate, deleteNotif);
router.put("/:id/mark-read", authenticate, markAsRead); 

export default router;