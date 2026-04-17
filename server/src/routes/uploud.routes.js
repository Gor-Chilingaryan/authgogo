import express from 'express'
import { upload } from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.js'
import User from '../models/userSchema.js'

const router = express.Router()

router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const imageUrl = req.file.path

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: imageUrl },
      { new: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

export default router