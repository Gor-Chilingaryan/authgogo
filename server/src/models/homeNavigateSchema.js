import mongoose from 'mongoose'

const homeNavigateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

const homeNavigateModel = mongoose.model('HomeNavigate', homeNavigateSchema)

export default homeNavigateModel