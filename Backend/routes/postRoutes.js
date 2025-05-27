import express from "express";
import { commentPost, createPost, deleteComment, deletePost, editPost, getAllPost, getPostByUserId, likePost,getComments } from "../controllers/postController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authenticate.js";

const router=express.Router();

router.post('/', upload.single('image_file'), (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON data" });
      }
    }
    next();
  }, createPost);
  
router.get("/",getAllPost)
router.get("/:id",getPostByUserId)
router.put("/:id",editPost)
router.delete("/:id",deletePost)
router.patch("/:id/like",authenticate,likePost)
router.patch("/:id/comment",authenticate,commentPost)
router.get("/:id/comment",authenticate,getComments)
router.delete("/comments/:commentId",authenticate,deleteComment)


export default router