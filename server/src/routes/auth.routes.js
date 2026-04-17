import express from 'express'
import { registerController, loginUserController, forgotPasswordController, newPasswordController, refreshTokenController, logoutController } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/registration', registerController)
router.post('/login', loginUserController)
router.post('/logout', logoutController)

router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', newPasswordController)
router.post('/refresh', refreshTokenController)


export default router
