import express from "express";
import {
  fetchNotifications,
  deleteNotif,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:userId", fetchNotifications);
router.delete("/:id", authenticate,deleteNotif);

export default router;
