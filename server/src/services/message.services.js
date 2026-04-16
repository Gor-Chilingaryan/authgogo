
import mongoose from 'mongoose'
import messageModel from '../models/messageSchema.js'
import userModel from '../models/userSchema.js'

export const getConversationsService = async (userId) => {
  try {
    const messages = await messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .sort({ createdAt: -1 })

    const partnerIds = new Set()
    const lastMessageMap = {}

    for (const msg of messages) {
      const partnerId =
        msg.sender.toString() === userId.toString()
          ? msg.receiver.toString()
          : msg.sender.toString()

      if (!partnerIds.has(partnerId)) {
        partnerIds.add(partnerId)
        lastMessageMap[partnerId] = msg
      }
    }

    if (partnerIds.size === 0) {
      return { status: 200, json: [] }
    }

    const partners = await userModel
      .find({ _id: { $in: [...partnerIds] } })
      .select('firstName lastName avatar email')

    const partnerObjectIds = [...partnerIds].map(id => new mongoose.Types.ObjectId(id))
    const unreadCounts = await messageModel.aggregate([
      {
        $match: {
          receiver: userId,
          read: false,
          sender: { $in: partnerObjectIds },
        },
      },
      { $group: { _id: '$sender', count: { $sum: 1 } } },
    ])

    const unreadMap = {}
    for (const item of unreadCounts) {
      unreadMap[item._id.toString()] = item.count
    }

    const conversations = partners.map(partner => ({
      user: partner,
      lastMessage: lastMessageMap[partner._id.toString()],
      unreadCount: unreadMap[partner._id.toString()] || 0,
    }))

    conversations.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    )

    return { status: 200, json: conversations }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

export const getMessagesService = async (userId, partnerId) => {
  try {
    const messages = await messageModel
      .find({

        $or: [
          { sender: userId, receiver: partnerId },
          { sender: partnerId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')

    return { status: 200, json: messages }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

export const sendMessageService = async (senderId, receiverId, content) => {
  try {
    if (!content?.trim()) {
      return { status: 400, json: { message: 'Message content is required' } }
    }

    const receiver = await userModel.findById(receiverId)
    if (!receiver) {
      return { status: 404, json: { message: 'Receiver not found' } }
    }

    const message = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    })

    const populated = await message.populate([
      { path: 'sender', select: 'firstName lastName avatar' },
      { path: 'receiver', select: 'firstName lastName avatar' },
    ])

    return { status: 201, json: populated }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

export const markAsReadService = async (userId, partnerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { status: 400, json: { message: 'Invalid user id' } }
    }

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return { status: 400, json: { message: 'Invalid partnerId' } }
    }

    const result = await messageModel.updateMany(
      {
        sender: new mongoose.Types.ObjectId(partnerId),
        receiver: new mongoose.Types.ObjectId(userId),
        read: false,
      },
      { $set: { read: true } }
    )
    const markedCount =
      typeof result?.modifiedCount === 'number'
        ? result.modifiedCount
        : typeof result?.nModified === 'number'
          ? result.nModified
          : 0

    return {
      status: 200,
      json: { message: 'Messages marked as read', markedCount },
    }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}

export const searchUsersService = async (query, currentUserId) => {
  try {
    if (!query?.trim()) {
      return { status: 200, json: [] }
    }

    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')

    const users = await userModel
      .find({
        _id: { $ne: currentUserId },
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
      })
      .select('firstName lastName avatar email')
      .limit(10)

    return { status: 200, json: users }
  } catch (err) {
    console.error(err)
    return { status: 500, json: { message: err.message } }
  }
}
