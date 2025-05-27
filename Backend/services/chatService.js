// import { supabase } from "../config/db.js";


// // export const createChatIfNotExists = async (user1, user2) => {
// //   const { data: existingChat } = await supabase
// //     .from("chats")
// //     .select("*")
// //     .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
// //     .maybeSingle();

// //   if (existingChat) return existingChat.id;

// //   const { data, error } = await supabase
// //     .from("chats")
// //     .insert({ user1_id: user1, user2_id: user2 })
// //     .select()
// //     .single();

// //   if (error) throw new Error("Failed to create chat: " + error.message);
// //   return data.id;
// // };


// export const createChatIfNotExists = async (user1, user2) => {
//   // First check if they are friends
//   const { data: friendship, error: friendError } = await supabase
//     .from("friends")
//     .select("*")
//     .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2},status.eq.accepted),and(sender_id.eq.${user2},receiver_id.eq.${user1},status.eq.accepted)`)
//     .maybeSingle();

//   if (friendError) throw new Error("Failed to check friendship: " + friendError.message);
//   if (!friendship) throw new Error("You can only chat with friends");

//   // Check for existing chat
//   const { data: existingChat, error: chatError } = await supabase
//     .from("chats")
//     .select("*")
//     .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
//     .maybeSingle();

//   if (chatError) throw new Error("Failed to check existing chats: " + chatError.message);
//   if (existingChat) return existingChat.id;

//   // Create new chat
//   const { data: newChat, error: createError } = await supabase
//     .from("chats")
//     .insert({ user1_id: user1, user2_id: user2 })
//     .select()
//     .single();

//   if (createError) throw new Error("Failed to create chat: " + createError.message);
//   return newChat.id;
// };

// export const saveMessage = async (chatId, senderId, content) => {
//     const { data, error } = await supabase
//       .from("messages")
//       .insert({ chat_id: chatId, sender_id: senderId, content })
//       .select()
//       .single();
  
//     if (error) throw new Error("Failed to save message: " + error.message);
  
    
//     const { data: chat } = await supabase
//       .from("chats")
//       .select("*")
//       .eq("id", chatId)
//       .single();
  
//     const receiverId = chat.user1_id === senderId ? chat.user2_id : chat.user1_id;
  
    
//     await supabase.from("notifications").insert({
//       user_id: receiverId,
//       type: "message",
//       from_user_id: senderId,
//       message: content.slice(0, 50)
//     });
  
//     return data;
// };
  

// // export const fetchMessages = async (chatId) => {
// //   const { data, error } = await supabase
// //     .from("messages")
// //     .select("*")
// //     .eq("chat_id", chatId)
// //     .order("created_at", { ascending: true });

// //   if (error) throw new Error("Failed to fetch messages: " + error.message);
// //   return data;
// // };

// export const fetchMessages = async (chatId, userId) => {
//   console.log("Fetching messages for chatId:", chatId, "and userId:", userId);
//   // Subscribe to new messages
//   const subscription = supabase
//     .from(`messages:chat_id=eq.${chatId}`)
//     .on("INSERT", (payload) => {
//       console.log("New message received:", payload.new);
//       // Handle the new message (e.g., broadcast it to connected clients)
//     })
//     .subscribe();
//   // Fetch existing messages
//   const messages = await supabase
//     .from("messages")
//     .select(`
//       id,
//       chat_id,
//       sender_id,
//       content,
//       created_at
//     `)
//     .eq("chat_id", chatId)
//     .order("created_at", { ascending: true });
//   return messages;
// };


// export const deleteUserMessage = async (messageId, userId) => {
 
//   const { data: message } = await supabase
//     .from("messages")
//     .select("*")
//     .eq("id", messageId)
//     .single();

//   if (!message || message.sender_id !== userId) {
//     throw new Error("You can only delete your own messages.");
//   }

//   const { error } = await supabase
//     .from("messages")
//     .delete()
//     .eq("id", messageId);

//   if (error) throw new Error("Failed to delete message: " + error.message);
// };



// export const subscribeToMessages = (chatId) => {
//   const subscription = supabase
//     .from(`messages:chat_id=eq.${chatId}`)
//     .on('INSERT', (payload) => {
//       console.log('New message received:', payload.new);
//       // Handle the new message (e.g., broadcast it to connected clients)
//     })
//     .subscribe();
//   return subscription;
// };




import { supabase } from "../config/db.js";

export const createChatIfNotExists = async (user1, user2) => {
  // Check if they are friends
  const { data: friendship, error: friendError } = await supabase
    .from("friends")
    .select("*")
    .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2},status.eq.accepted),and(sender_id.eq.${user2},receiver_id.eq.${user1},status.eq.accepted)`)
    .maybeSingle();

  if (friendError) throw new Error("Failed to check friendship: " + friendError.message);
  if (!friendship) throw new Error("You can only chat with friends");

  // Check for existing chat
  const { data: existingChat, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
    .maybeSingle();

  if (chatError) throw new Error("Failed to check existing chats: " + chatError.message);
  if (existingChat) return existingChat.id;

  // Create new chat
  const { data: newChat, error: createError } = await supabase
    .from("chats")
    .insert({ user1_id: user1, user2_id: user2 })
    .select()
    .single();

  if (createError) throw new Error("Failed to create chat: " + createError.message);
  return newChat.id;
};

export const saveMessage = async (chatId, senderId, content) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, sender_id: senderId, content })
    .select()
    .single();

  if (error) throw new Error("Failed to save message: " + error.message);

  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();

  const receiverId = chat.user1_id === senderId ? chat.user2_id : chat.user1_id;

  await supabase.from("notifications").insert({
    user_id: receiverId,
    type: "message",
    from_user_id: senderId,
    message: content.slice(0, 50)
  });

  return data;
};

export const fetchMessages = async (chatId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch messages: " + error.message);
  return data;
};

export const subscribeToMessages = (chatId, onMessageReceived) => {
  const subscription = supabase
    .from(`messages:chat_id=eq.${chatId}`)
    .on('INSERT', (payload) => {
      console.log('New message received:', payload.new);
      onMessageReceived(payload.new); 
    })
    .subscribe();

  return subscription;
};

export const deleteUserMessage = async (messageId, userId) => {
 
  const { data: message } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (!message || message.sender_id !== userId) {
    throw new Error("You can only delete your own messages.");
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) throw new Error("Failed to delete message: " + error.message);
};
