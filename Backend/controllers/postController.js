import { createPostService, getPosts } from "../services/postService.js";
import { createPostSchema } from "../validations/userValidations.js";

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
    const response = await getPosts();
    if (response) {
      return res.status(200).json({
        message: "Posts Fetched Successfully",
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

export const getPostByUserId = () => {};

export const editPost = () => {};

export const deletePost = () => {};

export const likePost = () => {};

export const commentPost = () => {};
