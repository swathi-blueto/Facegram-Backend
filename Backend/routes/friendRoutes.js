import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  removeFriend,
  acceptedFriends,
  getFriends,
  getPendingFriendReq,
  getReceivedFriendReq
} from "../controllers/friendController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/requests/:userId", authenticate, sendFriendRequest);
router.post("/requests/:userId/accept",authenticate, acceptFriendRequest);
router.delete("/requests/:userId/cancel", authenticate, cancelFriendRequest);
router.delete("/:userId", authenticate, removeFriend);
router.get("/potential", authenticate, getFriends);
router.get("/pending-requests", authenticate, getPendingFriendReq);
router.get("/income-requests",authenticate,getReceivedFriendReq)
router.get("/accepted",authenticate,acceptedFriends)

export default router;
