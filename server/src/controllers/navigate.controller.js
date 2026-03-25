import { getAllNavigationService, createNavigationService, deleteNavigationService } from "../services/navigate.services.js"


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