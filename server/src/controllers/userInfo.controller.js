/**
 * Module: userInfo.controller.js
 * Description: HTTP handlers for reading and updating the authenticated user's profile document.
 * Role in request lifecycle: Controller layer — uses `req.user` populated by `authMiddleware` (not `req.cookies.userId`).
 */
import { getUserInfoService, patchUserInfoService } from '../services/userInfo.services.js'

/**
 * Returns the full user document for the authenticated subject (including password field unless stripped in service).
 * @param {import('express').Request} req - Authenticated request; `req.user` set by middleware (Mongo user doc).
 * @param {import('express').Response} res - Forwards `status` and `json` from the service (200 or 404, etc.).
 * @returns {Promise<void>}
 * @throws {void}
 */
export const getUserInfoController = async (req, res) => {
  const result = await getUserInfoService(req.user._id)

  res.status(result.status).json(result.json)
}

/**
 * Applies partial updates from the body to the authenticated user's record.
 * @param {import('express').Request} req - Body: partial user fields; identity is `req.user._id` from JWT/cookie auth chain.
 * @param {import('express').Response} res - 200 with updated user, 404 if user vanished, 500 on other errors.
 * @returns {Promise<void>}
 * @throws {void}
 */
export const patchUserInfoController = async (req, res) => {
  try {
    console.log('--------------------------------');
    console.log(req.body);
    console.log('--------------------------------');
    const updatedUser = await patchUserInfoService(req.user._id, req.body)
    
    return res.status(200).json(updatedUser)
  } catch (err) {
    // Service signals missing user after update attempt — 404 Not Found.
    if (err.message === 'UserNotFound') {
      return res.status(404).json({ message: 'User not found' })
    }
    // Validation/DB errors from Mongoose — 500 Internal Server Error.
    return res.status(500).json({ message: err.message })
  }
}
