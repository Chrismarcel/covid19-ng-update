import React, { useState, useEffect } from 'react'
import { toggleNotifications } from './Dashboard'
import FeatherIcon from 'feather-icons-react'

const ToggleSwitch = () => {
  const [alertEnabled, setAlertEnabled] = useState(false)
  const [DOMInit, setDOMInit] = useState(true)

  useEffect(() => {
    if (DOMInit) {
      const alertStatus = localStorage.getItem('subscribed')
      setAlertEnabled(JSON.parse(alertStatus))
    }
    setDOMInit(false)
  }, [alertEnabled])

  return (
    <label className={`toggle-switch ${alertEnabled ? 'on' : 'off'}`}>
      <input 
        type="checkbox"
        onChange={() => {
          const toggleType = alertEnabled ? 'unsubscribe' : 'subscribe'
          setAlertEnabled(!alertEnabled)
          toggleNotifications(toggleType)
        }} 
      />
      <div className="toggle-slider">
        <div className="knob">
          <FeatherIcon
            icon={alertEnabled ? 'bell' : 'bell-off'} 
            size={16} 
          />
        </div>
        <span>{alertEnabled ? 'On' : 'Off'}</span>
      </div>
    </label>
  )
}

export default ToggleSwitch
