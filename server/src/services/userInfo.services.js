import userModel from "../models/userSchema.js"

export const getUserInfoService = async (userId) => {
  try {
    const user = await userModel.findById(userId)

    if (!user) {
      return {
        status: 404,
        json: { message: "User not found" }
      }
    }

    const userData = user.toObject()

    if (!userData.phone) {
      userData.phone = "Please add your phone number to complete your profile"
    }

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