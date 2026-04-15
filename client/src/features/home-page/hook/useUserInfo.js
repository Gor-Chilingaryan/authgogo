
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUserInfoRequest, patchUserInfoRequest, logoutUserRequest, uploadImageRequest } from '@features/home-page/services/userInfo'


export const useUserInfo = () => {
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [disableInput, setDisableInput] = useState(true)
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


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


  const handleSaveValues = async () => {

    try {
      setIsLoading(true)
      const data = await patchUserInfoRequest(userInfo)
      setUserInfo(data)
      setDisableInput(true)
    } catch (error) {
      setError(error.message)
      console.log(error)
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
      localStorage.removeItem('isLogged')
      navigate('/')
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

    if (isModalOpen) {
      setPreview(null);
      setFile(null);
    }
  };


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUploadImage = async () => {
    setIsLoading(true)
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const response = await uploadImageRequest(formData)
      setUserInfo(prev => ({ ...prev, avatar: response.url }))
      toggleModal()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    userInfo,
    setUserInfo,
    error,
    isModalOpen,
    isUploading,
    preview,
    isLoading,
    disableInput,
    toggleModal,
    handleFileChange,
    handleUploadImage,
    handleDesableInput,
    handleChange,
    handleSaveValues,
    handleLogout,
  }
}