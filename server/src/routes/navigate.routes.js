import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { allNavigationController, createNavigationController, deleteNavigationController, updateNaviagtionController, addChildController, deleteChildController } from '../controllers/navigate.controller.js'

const router = express.Router()

router.get('/home-navigation-all', authMiddleware, allNavigationController) //get all navigation
router.post('/home-navigation-create', authMiddleware, createNavigationController) //create navigation
router.delete('/home-navigation/:id', authMiddleware, deleteNavigationController) //delete navigation
router.patch('/update-order', authMiddleware, updateNaviagtionController) //update navigation order

router.post('/home-navigation/:id/child', authMiddleware, addChildController)//add child navigation
// Delete child navigation (preferred REST route)
router.delete('/home-navigation/:parentId/child/:childId', authMiddleware, deleteChildController)
// Backward-compatible route (older frontend used POST)
router.post('/home-navigation/:parentId/:childId', authMiddleware, deleteChildController)//delete child navigation

export default router
