import { json } from "express";
import { supabase } from "../config/db.js";

export const sendFriendRequestService = async (senderId, receiverId) => {
  const { data: existingRequests, error: checkError } = await supabase
    .from("friends")
    .select("*")
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    );

  if (checkError)
    throw new Error("Checking existing failed: " + checkError.message);
  if (existingRequests.length > 0)
    throw new Error("Already requested or friends");

  const { error: insertError } = await supabase.from("friends").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending",
  });
  if (insertError)
    throw new Error("Sending request failed: " + insertError.message);

  await supabase.from("notifications").insert({
    user_id: receiverId,
    type: "friend_request",
    from_user_id: senderId,
    message: "You received a friend request.",
  });
};

// Accept Friend Request
export const acceptFriendRequestService = async (senderId, receiverId) => {
  const { data, error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending");

  if (error) throw new Error("Failed to accept request: " + error.message);

  

  await supabase.from("notifications").insert({
    user_id: senderId,
    type: "friend_accept",
    from_user_id: receiverId,
    message: "Your friend request was accepted.",
  });

  return data;
};

// Cancel Friend Request
export const cancelFriendRequestService = async (senderId, receiverId) => {
  const { data, error } = await supabase
    .from("friends")
    .delete()
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending");

  if (error) throw new Error("Failed to cancel request: " + error.message);
  return data;
};

// Remove Friend
export const removeFriendService = async (userId, friendId) => {
  const { data, error } = await supabase
    .from("friends")
    .delete()
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`
    )
    .eq("status", "accepted");

  if (error) throw new Error("Failed to remove friend: " + error.message);
  return data;
};

export const getPotentialFriends = async (userId) => {
  try {
    // Step 1: Get all connections related to userId (both sent and received)
    const { data: existingConnections, error: connectionError } = await supabase
      .from("friends")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (connectionError) throw connectionError;

    // Step 2: Create a set of excluded user IDs (self and connected users)
    const connectedUsers = new Set(
      existingConnections.map((c) =>
        c.sender_id === userId ? c.receiver_id : c.sender_id
      )
    );
    connectedUsers.add(userId); // Exclude self

    // Step 3: Fetch all users NOT already connected
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, first_name, profile_pic")
      .not("id", "in", `(${Array.from(connectedUsers).join(",")})`);

    if (userError) throw userError;

    // Step 4: Format the response with user details
    const potentialFriends = users.map((user) => ({
      id: user.id,
      first_name: user.first_name,
      profile_pic: user.profile_pic,
      status: "none", // Default status as 'none' since no request has been sent
    }));

    return potentialFriends;
  } catch (error) {
    throw error;
  }
};

export const getPendingFriendRequests = async (userId) => {
  try {
    // First get all pending requests sent by this user
    const { data: pendingRequests, error: pendingError } = await supabase
      .from("friends")
      .select("receiver_id, status")
      .eq("sender_id", userId)
      .eq("status", "pending");

    if (pendingError) throw pendingError;

    if (!pendingRequests.length) return [];

    // Then get user details for each receiver
    const receiverIds = pendingRequests.map((req) => req.receiver_id);
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, first_name, profile_pic")
      .in("id", receiverIds);

    if (usersError) throw usersError;

    // Combine the data
    const formattedRequests = pendingRequests.map((request) => {
      const user = users.find((u) => u.id === request.receiver_id);
      return {
        id: request.receiver_id,
        first_name: user?.first_name || "Unknown",
        profile_pic: user?.profile_pic || null,
        status: request.status,
      };
    });

    return formattedRequests;
  } catch (error) {
    throw error;
  }
};

export const getReceivedFriendRequests = async (userId) => {
  try {
    const { data: pendingRequests, error } = await supabase
      .from("friends")
      .select(
        "sender_id, status, users!friends_sender_id_fkey(first_name, profile_pic)"
      )
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (error) throw error;

    return pendingRequests.map((request) => ({
      id: request.sender_id,
      first_name: request.users.first_name,
      profile_pic: request.users.profile_pic,
      status: request.status,
    }));
  } catch (error) {
    throw error;
  }
};


export const getFriend = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        sender:users!friends_sender_id_fkey(id, first_name, profile_pic),
        receiver:users!friends_receiver_id_fkey(id, first_name, profile_pic)
      `)
      .or(`and(sender_id.eq.${userId},status.eq.accepted),and(receiver_id.eq.${userId},status.eq.accepted)`);

    if (error) throw new Error("Failed to fetch friends: " + error.message);

    return data.map(friend => {
      // Determine which user is the friend (not the current user)
      const isSender = friend.sender_id === userId;
      const friendData = isSender ? friend.receiver : friend.sender;
      
      return {
        id: friendData.id,
        first_name: friendData.first_name,
        profile_pic: friendData.profile_pic,
        friendship_id: friend.id,
        status: friend.status
      };
    });
  } catch (error) {
    throw error;
  }
};

