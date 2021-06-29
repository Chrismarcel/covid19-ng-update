export enum LOCAL_STORAGE_KEYS {
  NOTIFICATION_STATUS = 'allow-notifications',
  SUBSCRIPTION_STATUS = 'subscribed',
  REGISTRATION_TOKEN = 'registration_token',
  ALERT_STATUS = 'alert_status',
  DARK_MODE = 'dark_mode',
}

export enum DATA_KEYS {
  STATES = 'states',
  CONFIRMED_CASES = 'confirmedCases',
  ACTIVE_CASES = 'activeCases',
  DISCHARGED = 'discharged',
  DEATHS = 'death',
}

type CasesRange =
  | 'LESS_THAN_101'
  | 'LESS_THAN_501'
  | 'LESS_THAN_1001'
  | 'LESS_THAN_3001'
  | 'LESS_THAN_5001'
  | 'GREATER_THAN_5000'

type ColorBands = {
  [key in CasesRange]: {
    color: string
    text: string
  }
}

export const COLOR_BANDS: ColorBands = {
  LESS_THAN_101: { color: '#ff6347', text: '1 - 100' },
  LESS_THAN_501: { color: '#f88379', text: '101 - 500' },
  LESS_THAN_1001: { color: '#cd5c5c', text: '501 - 1000' },
  LESS_THAN_3001: { color: '#e34234', text: '1001 - 3000' },
  LESS_THAN_5001: { color: '#ff2400', text: '3001 - 5000' },
  GREATER_THAN_5000: { color: '#8b0000', text: '5000+' },
}
