import { supabase } from "../config/db.js";


export const updateProfileUser = async (userData) => {
  try {
    const { id, profile_pic, cover_photo, ...otherData } = userData;
    let profilePicUrl = null;
    let coverPhotoUrl = null;

    // Prepare update data
    const updateData = {
      ...otherData,
     
    };

    // Handle profile picture upload
    if (profile_pic) {
      const profilePicPath = `users/${id}/profile-pic.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(profilePicPath, profile_pic.buffer, {
          contentType: profile_pic.mimetype,
          upsert: true,
        });

      if (uploadError) throw new Error('Profile picture upload failed: ' + uploadError.message);
      profilePicUrl = supabase.storage.from('profile-images').getPublicUrl(profilePicPath).data.publicUrl;
      updateData.profile_pic = profilePicUrl;
    }

    // Handle cover photo upload
    if (cover_photo) {
      const coverPhotoPath = `users/${id}/cover-photo.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(coverPhotoPath, cover_photo.buffer, {
          contentType: cover_photo.mimetype,
          upsert: true,
        });

      if (uploadError) throw new Error('Cover photo upload failed: ' + uploadError.message);
      coverPhotoUrl = supabase.storage.from('profile-images').getPublicUrl(coverPhotoPath).data.publicUrl;
      updateData.cover_photo = coverPhotoUrl;
    }

    // Perform the update
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Supabase update error details:', updateError);
      throw new Error('User update failed: ' + updateError.message);
    }

    // Fetch the updated user separately
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.warn('Update succeeded but fetch failed - likely RLS issue');
      // Return at least the data we tried to update
      return { id, ...updateData };
    }

    return updatedUser;
  } catch (error) {
    console.error('Full updateProfileUser error:', {
      message: error.message,
      stack: error.stack,
      originalError: error,
    });
    throw error;
  }
};




export const userProfile = async ({ id }) => {
    try {
     
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        
  


      if (error) {
        throw new Error("Failed to fetch user profile: " + error.message);
      }

      if (!data || data.length === 0) {
        throw new Error("No user found with this ID.");
      }
  
      return data;
    } catch (error) {
      console.error("userProfile error:", error.message);
      throw error;
    }
  };
  