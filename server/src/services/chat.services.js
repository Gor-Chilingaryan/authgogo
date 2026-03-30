import conversationModel from "../models/conversationSchema.js"
import messageModel from "../models/messageSchema.js"

export const sendMessageService = async (senderId, receiverId, text) => {
  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, receiverId] }
  })

  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, receiverId]
    })
  }

  const newMessage = await messageModel.create({
    conversationId: conversation._id,
    senderId: senderId,
    text: text,
  })

  conversation.lastMessage = {
    text,
    senderId,
    isRead: false
  }
  await conversation.save()

  return newMessage
}

export const getConversationsService = async (userId) => {
  return await conversationModel.find({
    participants: { $in: [userId] }
  })
    .populate('participants', 'firstName lastName email')
    .sort({ updatedAt: -1 })
}


export const getMessagesService = async (userId, partnerId) => {
  const conversation = await conversationModel.findOne({
    participants: { $all: [userId, partnerId] }
  })
  if (!conversation) return []

  return await messageModel.find({ conversationId: conversation._id }).sort({ createdAt: 1 })
}