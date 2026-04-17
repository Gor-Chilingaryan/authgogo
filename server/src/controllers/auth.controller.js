
import { createUserService, loginUserService, forgotPasswordService, newPasswordService, refreshServices } from '../services/auth.services.js'

const isProd = process.env.NODE_ENV === 'production'

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict',
  path: '/',
}

export const loginUserController = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(200).json({ user, accessToken })
  } catch (err) {

    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}

export const registerController = async (req, res) => {
  try {

    const { user, accessToken, refreshToken } = await createUserService(req.body)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.status(201).json({ user, accessToken })
  } catch (err) {

    if (err.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: err.message })
    }

    res.status(500).json({ message: err.message })
  }
}

export const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email)

    res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const newPasswordController = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const result = await newPasswordService(token, password);

    res.cookie('accessToken', result.accessToken, cookieOptions);
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const refreshTokenController = async (req, res) => {
  try {

    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) throw new Error('No refresh token found')

    const { accessToken, refreshToken: newRefreshToken } = await refreshServices(refreshToken)

    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', newRefreshToken, cookieOptions)

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
    })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

export const logoutController = async (_req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
    })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
