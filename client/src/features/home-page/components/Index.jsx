
import React from 'react';
import { Link } from 'react-router-dom';
import style from './userInfo.module.css';

import { useUserInfo } from '@features/home-page/hook/useUserInfo';
import InputWithLabel from '@/components/input-label';
import cameraPlusIcon from '@assets/icons/camera-plus.svg';
import { UserAvatarModal } from '@/components/user-avatar-modal';


function UserInfo() {
  const {
    userInfo,
    userInfoData,
    error,
    isModalOpen,
    isLoading,
    preview,
    handleDesableInput,
    handleFileChange,
    handleUploadImage,
    toggleModal,
    disableInput,
    handleChange,
    handleSaveValues,
    handleLogout,
  } = useUserInfo();

  if (isLoading && !userInfo) {
    return (
      <div className={style.loadingContainer}>
        <div className={style.mainSpinner} />
        <p>Loading your profile...</p>
      </div>
    );
  }
  if (error) return <div className={style.error}>Error: {error}</div>;

  if (!userInfo) return null;



  return (
    <div className={style.userInfo_container}>
      {isModalOpen && (
        <UserAvatarModal
          isModalOpen={isModalOpen}
          handleOpenModal={toggleModal}
          preview={preview}
          handleFileChange={handleFileChange}
          handleSubmit={handleUploadImage}
          loading={isLoading}
        />
      )}
      <div className={style.userInfo_avatar_wrapper}>
        <img
          src={userInfo.avatar || '/default_user.png'}
          alt={'avatar'}
          className={style.userInfo_avatar}
        />

        <img
          onClick={() => toggleModal()}
          src={cameraPlusIcon}
          className={style.addAvatarIcon}
          alt='add avatar icon'
        />
      </div>

      <div className={style.userInformation}>
        {userInfoData.map((field) => {
          return (
            <InputWithLabel
              key={field.id}
              id={field.id}
              type={field.type}
              name={field.name}
              groupStyle={style.input_group}
              labelStyle={style.label}
              inputStyle={style.input}
              labelText={field.label}
              value={field.value || ''}
              changeValue={handleChange}
              disabled={disableInput}
              placeholder={field.placeholder || ''}
            />
          );
        })}
      </div>

      {disableInput ? (
        <button className={style.editButton} onClick={handleDesableInput}>
          Edit
        </button>
      ) : (
        <div className={style.button_group}>
          <button className={style.cancelButton} onClick={handleDesableInput}>
            Cancel
          </button>
          <button className={style.saveButton} onClick={handleSaveValues}>
            Save
          </button>
        </div>
      )}

      <Link to='/' onClick={handleLogout} className={style.logoutButton}>
        LOG OUT
      </Link>
    </div>
  );
}

export { UserInfo };
