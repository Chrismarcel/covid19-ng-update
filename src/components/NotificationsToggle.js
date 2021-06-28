import React, { useContext, useState } from 'react'
import { NotificationContext } from './Dashboard'
import { Bell, BellOff } from 'react-feather'
import ToggleSwitch from './ToggleSwitch'

const NotificationsToggle = () => {
  const { alertStatus, handlePermission } = useContext(NotificationContext)
  const [enabledAlert, setEnabledAlert] = useState(alertStatus)

  const requestPermission = () => {
    setEnabledAlert(!enabledAlert)
    if ('Notification' in window) {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          handlePermission(!enabledAlert)
        }
      })
    }
  }

  return (
    <ToggleSwitch
      label="Real time updates"
      toggleOn={enabledAlert}
      ToggleOnIcon={() => <Bell size={16} />}
      ToggleOffIcon={() => <BellOff size={16} />}
      onToggle={requestPermission}
    />
  )
}

export default NotificationsToggle
