import React, { useState, useEffect } from 'react'
import ToggleSwitch from './ToggleSwitch'
import { MoreVertical } from 'react-feather'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const isChildNode = (parentNode, childNode) => {
    if ('contains' in parentNode) {
      return parentNode.contains(childNode);
    } else {
      return parentNode.compareDocumentPosition(childNode) % 16 !== 4;
    }
  }

  const notificationMenuListener = ({ target }) => {
    const menuWrapper = document.getElementById("notification-menu")
    if (menuOpen && !isChildNode(menuWrapper, target)) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', notificationMenuListener)
    return () => {
      document.removeEventListener('click', notificationMenuListener)
    }
  }, [menuOpen])

  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Covid-19 NG Update</h1>
      <div className="notification-menu-wrapper">
        <button 
          className="menu-trigger" 
          data-menu-open={menuOpen} 
          onClick={() => setMenuOpen(true)}
        >
          <MoreVertical />
        </button>
        <div className="panel notification-menu" id="notification-menu">
          <span>Notifications</span>
          <ToggleSwitch />
        </div>
      </div>
    </header>
  )
}

export default Header
