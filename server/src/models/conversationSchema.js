import mongoose from 'mongoose'


const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  lastMessage: {
    text: { type: String, default: '' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false }
  }
}, { timestamps: true })

const conversationModel = mongoose.model('Conversation', conversationSchema)

export default conversationModel 
