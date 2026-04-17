import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getUserInfoController, updatehUserInfoController } from '../controllers/userInfo.controller.js'

const router = express.Router()

router.get('/user-info', authMiddleware, getUserInfoController)
router.patch('/user-info/changes', authMiddleware, updatehUserInfoController)

export default router
