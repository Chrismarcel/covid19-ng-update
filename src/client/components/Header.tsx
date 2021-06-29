import React, { useState, useEffect } from 'react'
import NotificationsToggle from './NotificationsToggle'
import { Settings } from 'react-feather'
import { isChildNode } from '../../utils'
import DarkModeToggle from './DarkModeToggle'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const notificationMenuListener = ({ target }: { target: EventTarget & HTMLInputElement }) => {
    const menuWrapper = document.getElementById('notification-menu')
    if (menuOpen && !isChildNode(menuWrapper, target)) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', notificationMenuListener as unknown as EventListener)
    return () => {
      document.removeEventListener('click', notificationMenuListener as unknown as EventListener)
    }
  }, [menuOpen])

  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Covid-19 NG Dashboard</h1>
      <div className="notification-menu-wrapper">
        <button
          className="menu-trigger"
          data-menu-open={menuOpen}
          onClick={() => setMenuOpen(true)}>
          <Settings />
        </button>
        <div className="panel notification-menu" id="notification-menu">
          <NotificationsToggle />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
