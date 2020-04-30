import React, { useContext } from 'react'
import { NotificationContext } from './Dashboard'
import { Bell, BellOff } from 'react-feather'

const ToggleSwitch = () => {
  const { 
    setSubscriptionStatus,
    subscriptionEnabled,
    notificationEnabled,
    subscribeUser,
    unsubscribeUser
  } = useContext(NotificationContext)

  const handleSwitchToggle = () => {
    if (notificationEnabled) {
      if (subscriptionEnabled === true) {
        setSubscriptionStatus(false)
        unsubscribeUser()
      } 
      if (subscriptionEnabled === false) {
        setSubscriptionStatus(true)
        subscribeUser()
      }
    }
  }

  return (
    <label className={`toggle-switch ${subscriptionEnabled ? 'on' : 'off'}`}>
      <input 
        type="checkbox"
        onChange={handleSwitchToggle} 
      />
      <div className="toggle-slider">
        <div className="knob">
          {subscriptionEnabled && <Bell size={16} />}
          {!subscriptionEnabled && <BellOff size={16} />}
        </div>
        <span>{subscriptionEnabled ? 'On' : 'Off'}</span>
      </div>
    </label>
  )
}

export default ToggleSwitch
