import express from 'express'

import { allNavigationController, createNavigationController, deleteNavigationController } from '../controllers/navigate.controller.js'

const router = express.Router()

router.get('/home-navigation-all', allNavigationController) //get all navigation
router.post('/home-navigation-create', createNavigationController) //create navigation
router.delete('/home-navigation/:id', deleteNavigationController) //delete navigation

export default router