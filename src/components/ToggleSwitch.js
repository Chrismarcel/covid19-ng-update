import React, { useEffect, useState } from 'react'

const ToggleSwitch = ({ toggleOn, label, ToggleOnIcon, ToggleOffIcon, onToggle }) => {
  const [isToggleOn, setIsToggleOn] = useState(toggleOn)

  useEffect(() => {
    setIsToggleOn(toggleOn)
  }, [toggleOn])

  return (
    <>
      <span>{label}</span>
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
    </>
  )
}

export default ToggleSwitch
