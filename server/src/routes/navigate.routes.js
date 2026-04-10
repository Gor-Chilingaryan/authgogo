/**
 * Module: navigate.routes.js
 * Description: Express router for authenticated navigation CRUD, child menu operations, and bulk reorder.
 */
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


//es erkusy arac chi

// Legacy flat-order update (kept for backward compat)
router.patch('/update-order', authMiddleware, updateNaviagtionController)


//es frontum chka
// New: full tree reorder (index + childMenu nesting)
router.patch('/update-tree', authMiddleware, updateTreeController)


export default router
