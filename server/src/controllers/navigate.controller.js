import { getAllNavigationService, createNavigationService, deleteNavigationService, updateNavigationService, addChildNavigationService, deleteChildNavigationService } from "../services/navigate.services.js"


export const allNavigationController = async (req, res) => {
  const result = await getAllNavigationService(req.user._id)

  res.status(result.status).json(result.json)
}

export const createNavigationController = async (req, res) => {
  const result = await createNavigationService({ ...req.body, owner: req.user._id })

  res.status(result.status).json(result.json)
}

export const deleteNavigationController = async (req, res) => {
  const result = await deleteNavigationService(req.params.id)

  res.status(result.status).json(result.json)
}

export const updateNaviagtionController = async (req, res) => {
  try {
    const { newOrder } = req.body
    const userId = req.user._id

    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ message: "Order updated successfully" })
    }

    await updateNavigationService(userId, newOrder)

    res.status(200).json({ message: "Navigation updated successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const addChildController = async (req, res) => {
  const { id } = req.params
  const { name, path } = req.body

  const result = await addChildNavigationService(id, { name, path })
  res.status(result.status).json(result.json)

  res.status(result.status).json(result.json)
}

export const deleteChildController = async (req, res) => {
  const { parentId, childId } = req.params
  const result = await deleteChildNavigationService(parentId, childId)

  res.status(result.status).json(result.json)
}