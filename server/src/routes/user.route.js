import express from 'express'
import { registerController, loginUserController, forgotPasswordController } from '../controllers/user.contoller.js'

//isolated route handler.
const router = express.Router()


router.post('/registration', registerController)
router.post('/login', loginUserController)
router.post('/forgot-password', forgotPasswordController)


export default router 
