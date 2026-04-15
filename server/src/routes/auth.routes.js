/**
 * Module: auth.routes.js
 * Description: Express router mounting public authentication endpoints (register, login, password flows, refresh, logout).
 * Role in request lifecycle: HTTP boundary — maps URLs and verbs to auth controller methods; no business logic here.
 */
import express from 'express'
import { registerController, loginUserController, forgotPasswordController, newPasswordController, refreshTokenController, logoutController } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/registration', registerController)
router.post('/login', loginUserController)
router.post('/logout', logoutController)

router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', newPasswordController)
// router.patch('/new-password', newPasswordController)
router.post('/refresh', refreshTokenController)


export default router
