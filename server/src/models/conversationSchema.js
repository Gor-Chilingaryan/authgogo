import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
  memebers: {
    type: Array,
    required: true,
  },
  lstMessage: {
    text: String,
    senderId: String,
    receiverId: String,
  }
}, { timestamps: true })



const MessageSchema = new mongoose.Schema({
  conversationId: {

    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true }

)
const conversationModel = mongoose.model("Conversation", ConversationSchema)



const messageModel = mongoose.model("Message", MessageSchema)
export default { conversationModel, messageModel }