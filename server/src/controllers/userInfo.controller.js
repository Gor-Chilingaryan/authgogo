import { getUserInfoService, patchUserInfoService } from '../services/userInfo.services.js'


export const getUserInfoController = async (req, res) => {
  const result = await getUserInfoService(req.user._id)

  res.status(result.status).json(result.json)
}

export const patchUserInfoController = async (req, res) => {
  try {
    const updatedUser = await patchUserInfoService(req.user._id, req.body);

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message === 'UserNotFound') {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(500).json({ message: err.message });
  }
};