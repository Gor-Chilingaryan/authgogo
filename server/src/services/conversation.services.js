import Conversation from "../models/Conversation.js";

class ConversationService {

  async create(senderId, receiverId) {

    const existing = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (existing) return existing;

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    return await newConversation.save();
  }


  async getByUserId(userId) {
    return await Conversation.find({
      members: { $in: [userId] },
    }).sort({ updatedAt: -1 });
  }
}

export default new ConversationService();