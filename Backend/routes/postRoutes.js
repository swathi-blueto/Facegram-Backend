import express from "express";
import { createPost, getAllPost } from "../controllers/postController.js";
import { upload } from "../middleware/upload.js";

const router=express.Router();

router.post('/', upload.single('image_file'), (req, res, next) => {
    // Ensure the body is parsed as JSON if sending mixed content
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
// router.put("/:id")
// router.delete("/:id")
// router.patch("/:id/like")
// router.post("/:id/comment")


export default router