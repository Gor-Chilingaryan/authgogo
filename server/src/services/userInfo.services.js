/**
 * Module: userInfo.services.js
 * Description: Read and update operations for the authenticated user's profile document.
 * Role in request lifecycle: Service layer — receives `userId` from controllers (`req.user._id`); returns data or throws for controller mapping.
 */
import userModel from '../models/userSchema.js'

/**
 * Loads a single user by id and returns an HTTP-shaped result (no thrown errors for missing user).
 * @param {string|import('mongoose').Types.ObjectId} userId - Mongo `_id` from `req.user` after auth middleware.
 * @returns {Promise<{status: number, json: object}>} `200` + user object, `404` + message, or `500` on unexpected errors.
 * @throws {void} Errors are converted to `{ status: 500 }` responses in the catch block.
 */
export const getUserInfoService = async (userId) => {
  try {
    const user = await userModel.findById(userId)

    if (!user) {
      return {
        status: 404,
        json: { message: 'User not found' }
      }
    }

    const userData = user.toObject()

    return {
      status: 200,
      json: userData
    }
  } catch (err) {
    return {
      status: 500,
      json: { message: err.message }
    }
  }
}

/**
 * Applies `userBody` as an update document with validators; returns the post-update document.
 * @param {string|import('mongoose').Types.ObjectId} userId - Profile owner id.
 * @param {object} userBody - Partial fields from `req.body` (must not include trusted ids from client without allowlisting in production).
 * @returns {Promise<object>} Updated Mongoose document.
 * @throws {Error} `'User not found'` when no document matches `userId` after update.
 * @throws {Error} Mongoose validation errors propagate to the controller as 500.
 */
export const patchUserInfoService = async (userId, userBody) => {
  const user = await userModel.findByIdAndUpdate(userId, userBody, {
    returnDocument: 'after',
    runValidators: true,
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
