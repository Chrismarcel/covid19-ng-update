import React, { useEffect, useState } from 'react'

const ToggleSwitch = ({ isEnabled, label, ToggleOnIcon, ToggleOffIcon, onToggle }) => {
  const [isToggleOn, setIsToggleOn] = useState(isEnabled)

  useEffect(() => {
    setIsToggleOn(isEnabled)
  }, [isEnabled])

  return (
    <div className="notification-menu-item-wrapper">
      <span className="notification-menu-item-text">{label}</span>
      <label className={`toggle-switch ${isToggleOn ? 'on' : 'off'}`}>
        <input
          type="checkbox"
          onChange={() => {
            onToggle()
            setIsToggleOn(!isToggleOn)
          }}
        />
        <div className="toggle-slider">
          <div className="knob">{isToggleOn ? <ToggleOnIcon /> : <ToggleOffIcon />}</div>
          <span>{isToggleOn ? 'On' : 'Off'}</span>
        </div>
      </label>
    </div>
  )
}

export default ToggleSwitch
