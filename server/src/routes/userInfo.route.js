import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getUserInfoController } from '../controllers/userInfo.controller.js'

const router = express.Router()

router.get('/user-info', authMiddleware, getUserInfoController)

export default router