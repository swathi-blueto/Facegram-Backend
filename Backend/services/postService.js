import { supabase } from "../config/db.js";

export const createPostService = async ({
  user_id,
  content,
  visibility,
  image_file,
}) => {
  try {
    let image_url = null;

    if (image_file) {
      const imagePath = `posts/${user_id}/${Date.now()}-${
        image_file.originalname
      }`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(imagePath, image_file.buffer, {
          contentType: image_file.mimetype,
          upsert: false,
        });

      if (uploadError)
        throw new Error("Image upload failed: " + uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(imagePath);

      image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id,
        content,
        image_url,
        visibility,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      throw new Error("Failed to fetch post: " + error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("No Posts found");
    }

    return data;
  } catch (error) {
    console.error("post error:", error.message);
    throw error;
  }
};
