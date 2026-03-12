import express from 'express'
import { registerController, loginUserController } from '../controllers/user.contoller.js'

//isolated route handler.
const router = express.Router()


router.post('/register', registerController)
router.post('/login', loginUserController)


export default router 
