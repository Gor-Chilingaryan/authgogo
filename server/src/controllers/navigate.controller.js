/**
 * Module: navigate.controller.js
 * Description: HTTP handlers for user-owned navigation menus.
 */
import {
  getNavItemsService,
  createNavItemService,
  deleteNavItemService,
  updateNavigationService,
  reorderTreeService,
} from '../services/navigate.services.js'

export const getNavItems = async (req, res) => {
  const result = await getNavItemsService(req.user._id)
  res.status(result.status).json(result.json)
}

export const createNavItem = async (req, res) => {
  const result = await createNavItemService({ ...req.body, owner: req.user._id })
  res.status(result.status).json(result.json)
}

export const deleteNavItem = async (req, res) => {
  const result = await deleteNavItemService(req.params.id)
  res.status(result.status).json(result.json)
}

// es erkusy arac chi
export const updateNaviagtionController = async (req, res) => {
  try {
    const { newOrder } = req.body
    const userId = req.user._id

    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: 'newOrder must be an array' })
    }

    await updateNavigationService(userId, newOrder)
    res.status(200).json({ message: 'Navigation updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const updateTreeController = async (req, res) => {
  try {
    const { tree } = req.body
    const userId = req.user._id
    console.log('[NAV_UPDATE_TREE] incoming payload', {
      userId: String(userId),
      treeLength: Array.isArray(tree) ? tree.length : null,
      body: req.body,
    })

    if (!Array.isArray(tree)) {
      return res.status(400).json({ message: 'tree must be an array' })
    }

    const result = await reorderTreeService(userId, tree)
    console.log('[NAV_UPDATE_TREE] db result', result)
    res.status(200).json({ message: 'Navigation tree updated successfully', result })
  } catch (err) {
    console.error('[NAV_UPDATE_TREE] failed', err)
    res.status(500).json({ message: err.message })
  }
}

