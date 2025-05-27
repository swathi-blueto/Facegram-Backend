import express from "express";
import {
  createOrGetChat,
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/chatController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();


router.post("/", authenticate, createOrGetChat); 
router.get("/:chatId", authenticate, getMessages); 
router.post("/:chatId/messages", authenticate, sendMessage);
router.delete("/messages/:messageId", authenticate, deleteMessage); 

export default router;