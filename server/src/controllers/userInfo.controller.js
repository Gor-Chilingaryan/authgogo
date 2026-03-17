import { getUserInfoService } from '../services/userInfo.services.js'


export const getUserInfoController = async (req, res) => {
  const result = await getUserInfoService(req.user._id)

  res.status(result.status).json(result.json)
}