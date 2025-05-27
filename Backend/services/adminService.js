import { supabase } from "../config/db.js";

// USERS
export const getAllUsersService = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw new Error("Failed to fetch users: " + error.message);
  return data;
};

export const blockUserService = async (userId) => {
  const { error } = await supabase
    .from("users")
    .update({ is_blocked: true })
    .eq("id", userId);
  if (error) throw new Error("Failed to block user: " + error.message);
  return { userId };
};

export const unblockUserService = async (userId) => {
  const { error } = await supabase
    .from("users")
    .update({ is_blocked: false })
    .eq("id", userId);
  if (error) throw new Error("Failed to unblock user: " + error.message);
  return { userId };
};

// POSTS
export const getAllPostsService = async () => {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) throw new Error("Failed to fetch posts: " + error.message);
  return data;
};

export const deletePostService = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw new Error("Failed to delete post: " + error.message);
};
