import { supabase } from "../config/db.js";


export const getUserNotifications = async (userId) => {
  console.log(userId)
  const { data, error } = await supabase
    .from("notifications")
    .select(`
      *,
      from_user_id:from_user_id (
        id,
        first_name,
        profile_pic
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
    // console.log(data,"fetch noti")

  if (error) throw new Error("Failed to fetch notifications: " + error.message);
  return data;
};



// export const markNotificationAsRead = async (notificationId, userId) => {
//   const { data, error } = await supabase
//     .from("notifications")
//     .update({ is_read: true })
//     .eq("id", notificationId)
//     .eq("user_id", userId);

//   if (error) throw new Error("Failed to update notification: " + error.message);
//   return data;
// };


export const deleteNotification = async (notificationId, userId) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new Error("Failed to delete notification: " + error.message);
};
