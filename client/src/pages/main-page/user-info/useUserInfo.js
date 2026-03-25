import { useEffect, useState } from 'react'
import { getUserInfoRequest, patchUserInfoRequest, logoutUserRequest } from '../../../api/requests/userInfo'
import { useNavigate } from 'react-router-dom'

export const useUserInfo = () => {
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [disableInput, setDisableInput] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true)
        const data = await getUserInfoRequest()
        setUserInfo(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserInfo()
  }, [])

  const handleDesableInput = async () => {
    setDisableInput(!disableInput)
    if (!disableInput) {
      const data = await getUserInfoRequest()
      setUserInfo(data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (avatarUrl) => {
    setUserInfo(prev => ({ ...prev, avatar: avatarUrl }))
  }

  const handleSaveValues = async () => {
    try {
      setIsLoading(true)
      const data = await patchUserInfoRequest(userInfo)
      setUserInfo(data.json)
      setDisableInput(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUserRequest()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('isLogged')
      navigate('/')
    }
  }




  return {
    userInfo,
    setUserInfo,
    isModalOpen,
    setIsModalOpen,
    handleAvatarChange,
    error,
    isLoading,
    disableInput,
    handleDesableInput,
    handleChange,
    handleSaveValues,
    handleLogout,
  }
}