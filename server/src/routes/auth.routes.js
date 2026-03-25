import express from 'express'
import { registerController, loginUserController, forgotPasswordController, newPasswordController, refreshTokenController, logoutController } from '../controllers/auth.controller.js'


//isolated route handler.
const router = express.Router()


router.post('/registration', registerController)
router.post('/login', loginUserController)
router.post('/forgot-password', forgotPasswordController)
router.patch('/new-password', newPasswordController)
router.post('/refresh', refreshTokenController)
router.post('/logout', logoutController)


export default router 
