import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { useNavigation } from '@features/navigation/hook/useNavigation'
import penIcon from '@assets/icons/pen.svg'
import chevronDown from '@assets/icons/chevron-down.svg?url'

import style from './navigation.module.css'

function NavDropdownLinks({ nodes, onNavigate, depth = 0 }) {
  if (!nodes?.length) return null

  return nodes.map((node) => (
    <React.Fragment key={node._id}>
      <Link
        to={node.path || '#'}
        className={style.dropDownLink}
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        onClick={onNavigate}
      >
        {node.title}
      </Link>
      {node.children?.length > 0 && (
        <NavDropdownLinks
          nodes={node.children}
          onNavigate={onNavigate}
          depth={depth + 1}
        />
      )}
    </React.Fragment>
  ))
}

function NavDropdown({ parent, onNavigate }) {
  const { children } = parent
  if (!children?.length) return null

  return (
    <div className={style.dropDown}>
      <NavDropdownLinks nodes={children} onNavigate={onNavigate} depth={0} />
    </div>
  )
}

function DynamicNavItem({ node, onNavigate }) {
  const hasChildren = node.children?.length > 0

  return (
    <div className={style.navItem}>
      <div className={style.navItemWrapper}>
        <Link
          to={node.path || '#'}
          className={style.navItemLink}
          onClick={onNavigate}
        >
          {node.title}
          {hasChildren && (
            <img
              src={chevronDown}
              alt=''
              className={style.chevron}
              aria-hidden
            />
          )}
        </Link>
        {hasChildren && <NavDropdown parent={node} onNavigate={onNavigate} />}
      </div>
    </div>
  )
}

function Navigation() {
  const { navRoots, error, isLoading, handleEditNavigation } = useNavigation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), [])

  if (isLoading) return <span className={style.loader} />
  if (error) return <div className={style.error}>{error}</div>

  return (
    <div className={style.navigation_container}>
      <button
        type='button'
        className={`${style.burger} ${isMenuOpen ? style.burgerActive : ''}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`${style.navItems_container} ${isMenuOpen ? style.navOpen : ''}`}
      >
        <div className={style.navItem}>
          <Link to='/home' className={style.navItemLink} onClick={closeMenu}>
            Home
          </Link>
        </div>
        <div className={style.navItem}>
          <Link
            to='/messenger'
            className={style.navItemLink}
            onClick={closeMenu}
          >
            Messenger
          </Link>
        </div>

        {navRoots.map((node) => (
          <DynamicNavItem
            key={node._id}
            node={node}
            onNavigate={closeMenu}
          />
        ))}
      </div>

      <button
        type='button'
        className={style.editButton}
        onClick={handleEditNavigation}
        aria-label='Edit navigation'
      >
        <img src={penIcon} alt='' />
      </button>
    </div>
  )
}

export { Navigation }
