import { supabase } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";


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


// export const getPosts = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("posts")
//       .select(`
//         id, 
//         user_id, 
//         content, 
//         image_url, 
//         created_at, 
//         likes, 
//         comments,
//         users ( first_name, profile_pic )  
//       `);

//     if (error) {
//       throw new Error("Failed to fetch posts: " + error.message);
//     }

//     if (!data || data.length === 0) {
//       throw new Error("No posts found");
//     }

  
//     const formattedData = data.map(post => ({
//       ...post,
//       user_first_name: post.users?.first_name || "Unknown User",  
//       user_profile_pic: post.users?.profile_pic || "",  
//     }));

//     return formattedData;
//   } catch (error) {
//     console.error("Post error:", error.message);
//     throw error;
//   }
// };


export const getPosts = async (currentUserId) => {
  try {
    
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("sender_id, receiver_id, status")
      .or(`and(sender_id.eq.${currentUserId},status.eq.accepted),and(receiver_id.eq.${currentUserId},status.eq.accepted)`);

    if (friendsError) throw new Error(friendsError.message);

   
    const friendIds = friendsData.map(friendship => 
      friendship.sender_id === currentUserId 
        ? friendship.receiver_id 
        : friendship.sender_id
    );

    
    const allUserIds = [...friendIds, currentUserId];

    
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        image_url,
        created_at,
        likes,
        comments,
        users!inner(first_name, profile_pic)
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false });

    if (postsError) throw new Error(postsError.message);

    return posts.map(post => ({
      ...post,
      user_first_name: post.users.first_name,
      user_profile_pic: post.users.profile_pic
    }));

  } catch (error) {
    console.error('Error in getPosts:', error);
    throw error;
  }
};

export const getCommentsService = async (postId) => {
  try {
    
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select(`
        comments
      `)
      .eq('id', postId)
      .single();

    if (postError || !postData) {
      throw new Error("Post not found or failed to fetch comments");
    }

    const comments = postData.comments || [];
    
    
    
    if (comments.length === 0) {
      return [];
    }

    
    const userIds = [...new Set(comments.map(comment => comment.user_id))];
    
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, first_name, profile_pic')
      .in('id', userIds);

    if (usersError) {
      throw new Error("Failed to fetch user details: " + usersError.message);
    }

   
    const commentsWithUserDetails = comments.map(comment => {
      const user = usersData.find(u => u.id === comment.user_id);
      return {
        ...comment,
        user_first_name: user?.first_name || "Unknown",
        user_profile_pic: user?.profile_pic || "",
      };
    });

    

    return commentsWithUserDetails;
  } catch (error) {
    console.error("Error getting comments:", error.message);
    throw error;
  }
};



export const getPostsByUser = async ({ id }) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", id);
    if (error) {
      throw new Error("Failed to fetch post By UserId: " + error.message);
    }

    

    if (!data || data.length === 0) {
      throw new Error("No Posts found for this user");
    }

    return data;
  } catch (error) {
    console.error("post error:", error.message);
    throw error;
  }
};


// export const likeOrUnlikePost = async (postId, userId) => {
//   try {
//     const { data: post, error: fetchError } = await supabase
//       .from("posts")
//       .select("likes, user_id")
//       .eq("id", postId)
//       .single();

//     if (fetchError || !post) {
//       throw new Error("Post not found");
//     }

//     let likesArray = post.likes || [];
//     const postOwnerId = post.user_id;

//     const isLikingOwnPost = postOwnerId === userId;
//     const existingIndex = likesArray.findIndex((like) => like.user_id === userId);

//     if (existingIndex !== -1) {
//       // User is unliking the post
//       likesArray.splice(existingIndex, 1);

//       // Delete the notification if it exists
//       if (!isLikingOwnPost) {
//         const { error: deleteError } = await supabase
//           .from("notifications")
//           .delete()
//           .match({
//             user_id: postOwnerId,
//             from_user_id: userId,
//             type: "like",
//             // related_id: postId, // Uncomment if you use this field
//           });

//         if (deleteError) {
//           console.error("Error deleting like notification:", deleteError.message);
//         }
//       }
//     } else {
//       // User is liking the post
//       likesArray.push({ user_id: userId, liked: true });

//       // Create a notification for the post owner, but only if it's not their own post
//       if (!isLikingOwnPost) {
//         const { error: notificationError } = await supabase
//           .from("notifications")
//           .insert({
//             user_id: postOwnerId,
//             type: "like",
//             from_user_id: userId,
//             // related_id: postId,
//             message: "liked your post.",
//           });

//         if (notificationError) {
//           console.error("Error creating like notification:", notificationError.message);
//         }
//       }
//     }

//     const { error: updateError } = await supabase
//       .from("posts")
//       .update({ likes: likesArray })
//       .eq("id", postId);

//     if (updateError) {
//       throw new Error("Failed to update likes");
//     }

//     return {
//       message: existingIndex !== -1 ? "Post unliked" : "Post liked",
//       likes: likesArray.length,
//     };
//   } catch (error) {
//     console.error("Error in like/unlike:", error.message);
//     throw error;
//   }
// };



// export const commentPosts = async (postId, commentText, userId) => {
//   const newComment = {
//     id: uuidv4(),
//     user_id: userId,
//     text: commentText,
//     createdAt: new Date().toISOString(),
//   };

//   const { data: postData, error: fetchError } = await supabase
//     .from("posts")
//     .select("comments, user_id") // Also select user_id to know who owns the post
//     .eq("id", postId)
//     .single();

//   if (fetchError) throw new Error("Post not found");

//   const postOwnerId = postData.user_id; // The ID of the user who owns the post

//   const updatedComments = [...(postData.comments || []), newComment];

//   const { data, error } = await supabase
//     .from("posts")
//     .update({ comments: updatedComments })
//     .eq("id", postId)
//     .select();

//   if (error) throw new Error("Failed to update comments");

//   // Create a notification for the post owner, but only if it's not their own comment
//   if (postOwnerId !== userId) {
//     const { error: notificationError } = await supabase
//       .from("notifications")
//       .insert({
//         user_id: postOwnerId, // The user who owns the post
//         type: "comment",
//         from_user_id: userId, // The user who commented
        
//         message: "commented on your post.", // Message for the notification
//       });

//     if (notificationError) {
//       console.error("Error creating comment notification:", notificationError.message);
//     }
//   }

//   return data;
// };


export const editingPost = async (id, updatedPost) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update(updatedPost)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error("Failed to update post: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Failed to update post:", error.message);
    throw error;
  }
};

export const deletePostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      throw new Error("Failed to delete post: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Failed to delete Post", error.message);
    throw error;
  }
};


// export const deleteCommentById = async (commentId, userId) => {
//   const { data: posts, error: fetchError } = await supabase
//     .from("posts")
//     .select("id, comments");

//   if (fetchError) throw new Error("Failed to fetch posts");

//   for (const post of posts) {
//     const originalComments = post.comments || [];
//     const commentToDelete = originalComments.find(
//       (comment) => comment.id === commentId && comment.user_id === userId
//     );

//     if (commentToDelete) {
//       const updatedComments = originalComments.filter(
//         (comment) => comment.id !== commentId
//       );

//       // Update the post with the filtered comments
//       const { data, error } = await supabase
//         .from("posts")
//         .update({ comments: updatedComments })
//         .eq("id", post.id)
//         .select();

//       if (error) throw new Error("Failed to delete comment");

//       // Delete the associated notification if it exists
//       // This is fragile since we're matching the exact message string
//       const { error: notificationError } = await supabase
//         .from("notifications")
//         .delete()
//         .match({
//           type: "comment",
//           from_user_id: userId,
//           message: "commented on your post." // Exact message match
//         });

//       if (notificationError) {
//         console.error("Failed to delete comment notification:", notificationError.message);
//       }

//       return data;
//     }
//   }

//   throw new Error("Comment not found or unauthorized");
// };



// MODIFIED LIKE/UNLIKE FUNCTION
export const likeOrUnlikePost = async (postId, userId) => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("likes, user_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) throw new Error("Post not found");

    let likesArray = post.likes || [];
    const postOwnerId = post.user_id;
    const isLikingOwnPost = postOwnerId === userId;
    const existingIndex = likesArray.findIndex((like) => like.user_id === userId);

    if (existingIndex !== -1) {
     
      likesArray.splice(existingIndex, 1);

      if (!isLikingOwnPost) {
        const { error: deleteError } = await supabase
          .from("notifications")
          .delete()
          .match({
            user_id: postOwnerId,
            from_user_id: userId,
            type: "like",
            related_id: postId 
          });

        if (deleteError) console.error("Error deleting like notification:", deleteError.message);
      }
    } else {
      // User is liking the post
      likesArray.push({ user_id: userId, liked: true });

      if (!isLikingOwnPost) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: postOwnerId,
            type: "like",
            from_user_id: userId,
            related_id: postId, 
            message: "liked your post."
          });

        if (notificationError) console.error("Error creating like notification:", notificationError.message);
      }
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: likesArray })
      .eq("id", postId);

    if (updateError) throw new Error("Failed to update likes");

    return {
      message: existingIndex !== -1 ? "Post unliked" : "Post liked",
      likes: likesArray.length,
    };
  } catch (error) {
    console.error("Error in like/unlike:", error.message);
    throw error;
  }
};


export const commentPosts = async (postId, commentText, userId) => {
  const newComment = {
    id: uuidv4(),
    user_id: userId,
    text: commentText,
    createdAt: new Date().toISOString(),
  };

  const { data: postData, error: fetchError } = await supabase
    .from("posts")
    .select("comments, user_id")
    .eq("id", postId)
    .single();

  if (fetchError) throw new Error("Post not found");

  const postOwnerId = postData.user_id;
  const updatedComments = [...(postData.comments || []), newComment];

  const { data, error } = await supabase
    .from("posts")
    .update({ comments: updatedComments })
    .eq("id", postId)
    .select();

    

  if (error) throw new Error("Failed to update comments");
 

  if (postOwnerId !== userId) {
  
    const { data,error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: postOwnerId,
        type: "comment",
        from_user_id: userId,
        related_id: postId, 
        comment_id: newComment.id, 
        message: "commented on your post."
      });

     
    if (notificationError) console.error("Error creating comment notification:", notificationError.message);
  }

  return data;
};

// MODIFIED DELETE COMMENT FUNCTION
export const deleteCommentById = async (commentId, userId) => {
  const { data: posts, error: fetchError } = await supabase
    .from("posts")
    .select("id, comments");

  if (fetchError) throw new Error("Failed to fetch posts");

  for (const post of posts) {
    const originalComments = post.comments || [];
    const commentToDelete = originalComments.find(
      (comment) => comment.id === commentId && comment.user_id === userId
    );

    if (commentToDelete) {
      const updatedComments = originalComments.filter(
        (comment) => comment.id !== commentId
      );

      const { data, error } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", post.id)
        .select();

      if (error) throw new Error("Failed to delete comment");

      // More reliable deletion using comment_id
      const { error: notificationError } = await supabase
        .from("notifications")
        .delete()
        .match({
          type: "comment",
          from_user_id: userId,
          comment_id: commentId // Now we can precisely identify which notification to delete
        });

      if (notificationError) console.error("Failed to delete comment notification:", notificationError.message);

      return data;
    }
  }

  throw new Error("Comment not found or unauthorized");
};
