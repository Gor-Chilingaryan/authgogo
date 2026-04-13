import React from 'react';
import style from './userAvatar.module.css';

function Avatar({ user, size }) {
  return (
    <img
      src={user?.avatar || '/default_user.png'}
      alt={`${user?.firstName || 'User'}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
}

function UserAvatarModal({
  handleFileChange,
  isLoading,
  preview,
  handleSubmit,
  isModalOpen,
  handleOpenModal,
}) {
  if (!isModalOpen) return null;
  return (
    <div className={style.modalOverlay} onClick={handleOpenModal}>
      {/* stopPropagation предотвращает закрытие при клике внутри окна */}
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={style.closeButton} onClick={handleOpenModal}>
          &times;
        </button>

        <h2 className={style.modalTitle}>Update Avatar</h2>

        <div className={style.previewContainer}>
          <img
            src={preview || '/default_user.png'}
            className={style.previewImage}
            alt='avatar preview'
          />
          {isLoading && (
            <div className={style.loaderOverlay}>
              <div className={style.spinner} />
            </div>
          )}
        </div>

        <div className={style.uploadActions}>
          <label className={style.fileInputLabel}>
            Choose Photo
            <input
              type='file'
              onChange={handleFileChange}
              accept='image/*'
              className={style.hiddenInput}
            />
          </label>

          <button
            className={style.uploadButton}
            onClick={handleSubmit}
            disabled={isLoading || !preview}
          >
            {isLoading ? 'Uploading... ' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { Avatar, UserAvatarModal };
