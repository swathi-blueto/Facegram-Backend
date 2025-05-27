import {
    getAllUsersService,
    blockUserService,
    unblockUserService,
    getAllPostsService,
    deletePostService,
  } from "../services/adminService.js";
  
  export const getAllUsers = async (req, res) => {
    try {
      const users = await getAllUsersService();
      res.status(200).json({ message: "All users fetched", data: users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const blockUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await blockUserService(userId);
      res.status(200).json({ message: "User blocked", data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const unblockUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await unblockUserService(userId);
      res.status(200).json({ message: "User unblocked", data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const getAllPosts = async (req, res) => {
    try {
      const posts = await getAllPostsService();
      res.status(200).json({ message: "All posts fetched", data: posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      await deletePostService(postId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  