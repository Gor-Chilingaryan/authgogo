import { getIo } from '../socket.js'
import mongoose from 'mongoose'
import {
  getConversationsService,
  getMessagesService,
  sendMessageService,
  markAsReadService,
  searchUsersService,
} from '../services/message.services.js'


export const getConversations = async (req, res) => {
  const result = await getConversationsService(req.user._id)
  res.status(result.status).json(result.json)
}

export const getMessages = async (req, res) => {
  const result = await getMessagesService(req.user._id, req.params.partnerId)
  res.status(result.status).json(result.json)
}

export const sendMessage = async (req, res) => {
  const result = await sendMessageService(
    req.user._id,
    req.params.partnerId,
    req.body.content
  )

  if (result.status === 201) {
    const receiverId = req.params.partnerId.toString()
    const io = getIo()
    io.to(receiverId).emit('receive_message', result.json)
  }

  res.status(result.status).json(result.json)
}


export const markAsRead = async (req, res) => {
  const partnerId = req.params?.partnerId
  const userId = req.user?._id

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (!partnerId) {
    return res.status(400).json({ message: 'partnerId is required' })
  }

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    return res.status(400).json({ message: 'Invalid partnerId' })
  }

  const result = await markAsReadService(userId, partnerId)
  if (result.status === 200) {
    const io = getIo()
    io.to(partnerId.toString()).emit('messages_read', {
      readerId: userId.toString(),
    })
  }


  res.status(result.status).json(result.json)
}

export const searchUsers = async (req, res) => {
  const result = await searchUsersService(req.query.q, req.user._id)
  res.status(result.status).json(result.json)
}
