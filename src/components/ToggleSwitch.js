import React, { useContext } from 'react'
import { NotificationContext } from './Dashboard'
import { Bell, BellOff } from 'react-feather'

const ToggleSwitch = () => {
  const { setSubscriptionEnabled, subscriptionEnabled, subscribeUser, unsubscribeUser, requestNotificationPermission } = useContext(
    NotificationContext
  )

  console.log('se', subscriptionEnabled)

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          requestNotificationPermission()
        }
      })
    }
  }

  const handleSwitchToggle = (evt) => {
    if (notificationEnabled) {
      if (subscriptionEnabled) {
        setSubscriptionEnabled(false)
        unsubscribeUser()
      } else {
        setSubscriptionEnabled(true)
        subscribeUser()
      }
    } else {
      requestPermission()
    }
  }

  return (
    <label className={`toggle-switch ${subscriptionEnabled ? 'on' : 'off'}`}>
      <input type="checkbox" onChange={handleSwitchToggle} />
      <div className="toggle-slider">
        <div className="knob">{subscriptionEnabled ? <Bell size={16} /> : <BellOff size={16} />}</div>
        <span>{subscriptionEnabled ? 'On' : 'Off'}</span>
      </div>
    </label>
  )
}

export default ToggleSwitch
