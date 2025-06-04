import { response } from "express";
import {
  commentPosts,
  createPostService,
  getPosts,
  getPostsByUser,
  likeOrUnlikePost,
  deletePostById,
  editingPost,
  deleteCommentById,
  getCommentsService
} from "../services/postService.js";
import { createPostSchema } from "../validations/validations.js";

export const createPost = async (req, res) => {
  try {
    const { user_id, content, visibility } = req.body;
    const image_file = req.file;

    const { error } = createPostSchema.validate({
      user_id,
      content,
      visibility,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await createPostService({
      user_id,
      content,
      visibility,
      image_file,
    });

    return res.status(201).json({
      message: "Post created successfully",
      data: response,
    });
  } catch (error) {
    console.error("createPost error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const response = await getPosts(currentUserId);
    
    return res.status(200).json({
      message: "Posts Fetched Successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const id = req.params.id;
   
    const response = await getPostsByUser({ id });
    if (response) {
      return res.status(200).json({
        message: "Posts Fetched Successfully for this User",
        data: response,
      });
    }
    return response;
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const response = await likeOrUnlikePost(postId, userId);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};







export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id; 
    const userId = req.user.id;   
    const { commentText } = req.body;

    // console.log(commentText)

    if (!commentText || typeof commentText !== "string") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const response = await commentPosts(postId, commentText, userId);


    // console.log(response);
    return res.status(200).json({
      message: "Comment added successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    //  console.log(postId)
    const response = await getCommentsService(postId);

   

    // console.log(response)

    if (response) {
      return res.status(200).json({
        message: "Comments fetched successfully",
        data: response,
      });
    }
    return res.status(404).json({ message: "No comments found" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};



export const editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const editedPost = req.body; 

    const response = await editingPost(id, editedPost); 

    return res.status(200).json({
      message: "Post Edited Successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await deletePostById(id);

    if (response && response.length > 0) {
      return res.status(200).json({
        message: "Deleted the Post",
        data: response,
      });
    }
    return response;
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};



export const deleteComment = async (req, res) => {
  try {
   
    const commentId = req.params.commentId;
    const userId = req.user.id;
    

    const response = await deleteCommentById(commentId, userId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
