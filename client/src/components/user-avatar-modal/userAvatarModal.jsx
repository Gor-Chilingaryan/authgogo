/**
 * Avatar selection modal component.
 * Presents predefined avatar options and returns selected avatar URL.
 */
import React from 'react';
import styles from './userAvatarModal.module.css';

const AVATARS = [
  '/user-images/avatar-1.jpeg',
  '/user-images/avatar-2.jpeg',
  '/user-images/avatar-3.jpeg',
  '/user-images/avatar-4.jpeg',
  '/user-images/avatar-5.jpeg',
  '/user-images/avatar-6.jpeg',
  '/user-images/avatar-7.jpeg',
  '/user-images/avatar-8.jpeg',
  '/user-images/avatar-9.jpeg',
  '/user-images/avatar-10.jpeg',
  '/user-images/avatar-11.jpeg',
  '/user-images/avatar-12.jpeg',
];

// ── Small reusable avatar component ──────────────────────────────────────────

/**
 * Renders a circular user avatar image.
 * @param {{user: object, size: number}} props - Avatar props.
 * @returns {JSX.Element} Avatar image.
 */
function Avatar({ user, size }) {
  return (
    <img
      src={user.avatar || '/user-images/default_user.png'}
      alt={`${user.firstName} ${user.lastName}`}
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

/**
 * Displays avatar picker modal when open.
 * @param {{isOpen: boolean, onClose: Function, onSelectAvatar: Function}} props - Modal props.
 * @returns {JSX.Element|null} Modal content or null when closed.
 */
function UserAvatarModal({ isOpen, onClose, onSelectAvatar }) {
  if (!isOpen) return null;

  /**
   * Closes modal when clicking outside content area.
   * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
   * @returns {void}
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Selects avatar and closes modal.
   * @param {string} avatar - Selected avatar URL.
   * @returns {void}
   */
  const handleAvatarClick = (avatar) => {
    onSelectAvatar(avatar);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Select your avatar</h2>
        <div className={styles.avatarGrid}>
          {AVATARS.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              className={styles.avatarIcon}
              onClick={() => handleAvatarClick(avatar)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { UserAvatarModal, Avatar };
