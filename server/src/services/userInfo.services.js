import userModel from '../models/userSchema.js'

export const getUserInfoService = async (userId) => {
  try {
    const user = await userModel.findById(userId).select('-password -resetPasswordToken -resetPasswordTokenExpires')

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

export const updatehUserInfoService = async (userId, userBody) => {
  const user = await userModel.findByIdAndUpdate(userId, userBody, {
    returnDocument: 'after',
    runValidators: true,
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
