import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getNavItems,
  createNavItem,
  deleteNavItem,
  updateNaviagtionController,
  updateTreeController,
} from '../controllers/navigate.controller.js'

const router = express.Router()

router.get('/nav-items', authMiddleware, getNavItems)
router.post('/nav-item', authMiddleware, createNavItem)
router.delete('/nav-item/:id', authMiddleware, deleteNavItem)
router.patch('/update-order', authMiddleware, updateNaviagtionController)

router.patch('/update-tree', authMiddleware, updateTreeController)
export default router
