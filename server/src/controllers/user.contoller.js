import { createUserService, loginUserService } from "../services/user.services.js"

export const registerController = async (req, res) => {
  try {
    // create user
    const result = await createUserService(req.body)

    res.status(201).json(result)
  } catch (err) {
    // if user already exists
    if (err.code === "EMAIL_EXISTS") {
      return res.status(409).json({ message: err.message })
    }

    // if other error
    res.status(500).json({ message: err.message })
  }
}

export const loginUserController = async (req, res) => {
  try {
    // login user
    const result = await loginUserService(req.body)

    res.status(200).json(result)

  } catch (err) {
    // if invalid credentials
    if (err.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: err.message })
    }

    // if other error
    res.status(500).json({ message: err.message })
  }
}
