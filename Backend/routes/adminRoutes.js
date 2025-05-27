import express from "express";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllPosts,
  deletePost,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);
router.get("/posts", getAllPosts);
router.delete("/posts/:postId", deletePost);

export default router;
