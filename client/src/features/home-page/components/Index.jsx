/**
 * User profile page component.
 * Displays profile details, edit controls, avatar selection, and logout action.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import style from './userInfo.module.css';

import { useUserInfo } from '@features/home-page/hook/useUserInfo';
import InputWithLabel from '@components/input-label/InputWithLabel';
import cameraPlusIcon from '@assets/icons/camera-plus.svg';
import {UserAvatarModal} from '@components/user-avatar-modal/userAvatarModal';

/**
 * Renders authenticated user profile form and controls.
 * @returns {JSX.Element|null} Profile UI, loading/error state, or null.
 */
function UserInfo() {
  const {
    userInfo,
    error,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    handleDesableInput,
    handleAvatarChange,
    disableInput,
    handleChange,
    handleSaveValues,
    handleLogout,
  } = useUserInfo();

  if (isLoading) return <span className={style.loader} />;
  if (error) return <div className={style.error}>Error: {error}</div>;
  if (!userInfo) return null;

  const userInfoData = [
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      value: userInfo.firstName,
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      value: userInfo.lastName,
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email',
      value: userInfo.email,
    },
    {
      id: 'phone',
      name: 'phone',
      type: 'number',
      label: 'Phone',
      placeholder: 'Enter your phone number',
      value: userInfo.phone,
    },
  ];

  return (
    <div className={style.userInfo_container}>
      <div className={style.userInfo_avatar_wrapper}>
        <img
          src={userInfo.avatar || '/user-images/default_user.png'}
          alt={'User Avatar'}
          className={style.userInfo_avatar}
        />
        <img
          onClick={() => setIsModalOpen(true)}
          src={cameraPlusIcon}
          className={style.addAvatarIcon}
          alt='add avatar icon'
        />
      </div>
      {isModalOpen && (
        <UserAvatarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectAvatar={(url) => handleAvatarChange(url)}
        />
      )}

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
