import React, { useContext, useState } from 'react'
import { NotificationContext } from './Dashboard'
import { Bell, BellOff } from 'react-feather'

const ToggleSwitch = () => {
  const { alertStatus, handlePermission } = useContext(NotificationContext)
  const [showAlert, setShowAlert] = useState(alertStatus)

  const requestPermission = () => {
    setShowAlert(!showAlert)
    if ('Notification' in window) {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          handlePermission(!showAlert)
        }
      })
    }
  }

  return (
    <label className={`toggle-switch ${showAlert ? 'on' : 'off'}`}>
      <input type="checkbox" onChange={requestPermission} />
      <div className="toggle-slider">
        <div className="knob">{showAlert ? <Bell size={16} /> : <BellOff size={16} />}</div>
        <span>{showAlert ? 'On' : 'Off'}</span>
      </div>
    </label>
  )
}

export default ToggleSwitch
