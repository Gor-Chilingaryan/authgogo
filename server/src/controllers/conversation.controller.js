import ConversationService from "../services/conversation.service.js";

export const createConversationController = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const conversation = await ConversationService.create(senderId, receiverId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Не удалось создать беседу" });
  }
};

export const getAllConversationsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await ConversationService.getByUserId(userId);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Не удалось получить список бесед" });
  }
};