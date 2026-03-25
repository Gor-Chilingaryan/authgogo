import mongoose from 'mongoose'

const childMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
})


const navigateSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  },
  childMenu: {
    type: [childMenuSchema],
    default: [],
  }
}, { timestamps: true })

const navigateModel = mongoose.model('Navigate', navigateSchema)

export default navigateModel