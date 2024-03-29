import { createContext } from 'react'

type NotificationCtx = {
  alertStatus: boolean
  handlePermission: (isAlertEnabled: boolean) => void
}

export const NotificationContext = createContext<NotificationCtx>({
  alertStatus: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handlePermission: () => {},
})

type ColorSchemeCtx = {
  darkModeEnabled: boolean
  setDarkModeEnabled: (isDarkMode: boolean) => void
}

export const ColorSchemeContext = createContext<ColorSchemeCtx>({
  darkModeEnabled: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDarkModeEnabled: () => {},
})
