import {
  createChatIfNotExists,
  saveMessage,
  fetchMessages,
  deleteUserMessage,
} from "../services/chatService.js";

export const createOrGetChat = async (req, res) => {
  try {
    const user1 = req.user.id;
    const { user2 } = req.body;

    if (!user2) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const chatId = await createChatIfNotExists(user1, user2);
    res.status(200).json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const message = await saveMessage(chatId, senderId, content);
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    // console.log(chatId);

    const userId = req.user.id;

    const messages = await fetchMessages(chatId, userId);

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    await deleteUserMessage(messageId, userId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    const statusCode = err.message.includes("own messages") ? 403 : 500;
    res.status(statusCode).json({ error: err.message });
  }
};
