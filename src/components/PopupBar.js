import React from 'react'

const PopupBar = ({ popupVisible, className, children }) => {
  return (
    <div className={`panel popup-bar-wrapper ${className}`} data-visible={popupVisible}>
      {children}
    </div>
  )
}

export default PopupBar
