import React, { useState } from 'react'
import ToggleSwitch from './ToggleSwitch'
import { MoreVertical } from 'react-feather'
import FeatherIcon from 'feather-icons-react'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Covid-19 NG Update</h1>
      <div className="menu">
        <button 
          className="menu-trigger" 
          data-menu-open={menuOpen} 
          onClick={() => setMenuOpen(true)}
        >
          <FeatherIcon icon="more-vertical" />
        </button>
        <div className="panel menu-body">
          Notifications
          <ToggleSwitch />
        </div>
      </div>
    </header>
  )
}

export default Header
