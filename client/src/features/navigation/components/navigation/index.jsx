import React, { useState } from 'react'; // Добавили useState
import style from './navigation.module.css';
import { Link } from 'react-router-dom';
import { useNavigation } from '@features/navigation/hook/useNavigation';
import penIcon from '@assets/icons/pen.svg';
import chevronDown from '@assets/icons/chevron-down.svg?url';

function Navigation() {
  const { navItems, error, isLoading, handleEditNavigation } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние меню

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  if (isLoading) return <span className={style.loader} />;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.navigation_container}>
      {/* Бургер-кнопка */}
      <div
        className={`${style.burger} ${isMenuOpen ? style.burgerActive : ''}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Контейнер навигации */}
      <div
        className={`${style.navItems_container} ${isMenuOpen ? style.navOpen : ''}`}
      >
        <div className={style.navItem}>
          <Link to={'/home'} className={style.navItemLink} onClick={closeMenu}>
            Home
          </Link>
        </div>
        <div className={style.navItem}>
          <Link
            to={'/messenger'}
            className={style.navItemLink}
            onClick={closeMenu}
          >
            Messenger
          </Link>
        </div>

        {Array.isArray(navItems) &&
          navItems.map((item) => {
            const hasChildren = item.childMenu && item.childMenu.length > 0;
            return (
              <div key={item._id} className={style.navItem}>
                <div className={style.navItemWrapper}>
                  <Link
                    to={item.path}
                    className={style.navItemLink}
                    onClick={closeMenu}
                  >
                    {item.name}
                    {hasChildren && (
                      <img
                        src={chevronDown}
                        alt='Chevron'
                        className={style.chevron}
                      />
                    )}
                  </Link>
                  {hasChildren && (
                    <div className={style.dropDown}>
                      {item.childMenu.map((child) => (
                        <Link
                          to={child.path}
                          className={style.dropDownLink}
                          key={child._id}
                          onClick={closeMenu}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <button className={style.editButton} onClick={handleEditNavigation}>
        <img src={penIcon} alt='Edit icon' />
      </button>
    </div>
  );
}

export { Navigation };
