import React, { useContext, useState } from 'react'
import { NotificationContext } from './Dashboard'
import { Bell, BellOff } from 'react-feather'

const ToggleSwitch = () => {
  const { notificationEnabled, handleSubscription, handlePermission } = useContext(NotificationContext)
  const [alertOn, setAlertOn] = useState(notificationEnabled)

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          handlePermission()
        }
      })
    }
  }

  const handleSwitchToggle = (evt) => {
    setAlertOn(evt.target.checked)
    handleSubscription(evt.target.checked)
  }

  return (
    <label className={`toggle-switch ${alertOn ? 'on' : 'off'}`}>
      <input type="checkbox" onChange={handleSwitchToggle} />
      <div className="toggle-slider">
        <div className="knob">{alertOn ? <Bell size={16} /> : <BellOff size={16} />}</div>
        <span>{alertOn ? 'On' : 'Off'}</span>
      </div>
    </label>
  )
}

export default ToggleSwitch
