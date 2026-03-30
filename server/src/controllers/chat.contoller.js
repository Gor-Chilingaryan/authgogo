import { sendMessageService, getMessagesService, getConversationsService } from '../services/chat.services.js'

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body
    const senderId = req.user._id

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver ID and text are required' })
    }


    const message = await sendMessageService(senderId, receiverId, text)

    res.status(201).json(message)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getConversation = async (req, res) => {
  try {
    const chats = await getConversationsService(req.user._id)
    res.status(200).json(chats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params
    const messages = await getMessagesService(req.user._id, partnerId)
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}