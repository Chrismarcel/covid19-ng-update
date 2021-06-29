import React, { useContext } from 'react'
import { Sun, Moon } from 'react-feather'
import { ColorSchemeContext } from '../context'
import ToggleSwitch from './ToggleSwitch'
import { LOCAL_STORAGE_KEYS } from '../../constants'

const DarkModeToggle = () => {
  const { darkModeEnabled, setDarkModeEnabled } = useContext(ColorSchemeContext)

  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled)
    localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, `${!darkModeEnabled}`)
  }

  return (
    <ToggleSwitch
      label="Dark mode"
      isEnabled={darkModeEnabled}
      ToggleOnIcon={() => <Moon size={16} />}
      ToggleOffIcon={() => <Sun size={16} />}
      onToggle={toggleDarkMode}
    />
  )
}

export default DarkModeToggle
