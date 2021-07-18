import { Stats } from '~/client/components/Dashboard'
import { COLOR_BANDS, ColorBandsMap, CasesRange, DataKey } from '../constants'

export const generateChloropheth = (numCases: number): string => {
  // #E45E2F - Base Color used to generate other shades via https://coolors.co

  let color: string
  switch (true) {
    case numCases < 101:
      color = COLOR_BANDS.LESS_THAN_101.color
      break
    case numCases < 501:
      color = COLOR_BANDS.LESS_THAN_501.color
      break
    case numCases < 1001:
      color = COLOR_BANDS.LESS_THAN_1001.color
      break
    case numCases < 3001:
      color = COLOR_BANDS.LESS_THAN_3001.color
      break
    case numCases < 5001:
      color = COLOR_BANDS.LESS_THAN_5001.color
      break
    case numCases > 5000:
      color = COLOR_BANDS.GREATER_THAN_5000.color
      break
    default:
      color = COLOR_BANDS.LESS_THAN_101.color
      break
  }

  return color
}

export const slugifyStr = (str: string) => str.toLowerCase().replace(/ /g, '_')

export const reverseSlug = (str: string) => str.replace(/_/g, ' ')

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

export const toSentenceCase = (str: string) => {
  const [firstLetter, ...otherLetters] = str
  return firstLetter.toUpperCase() + otherLetters.join('')
}

export const isChildNode = (parentNode: Node | null, childNode: Node): boolean => {
  if (parentNode && 'contains' in parentNode) {
    return parentNode.contains(childNode)
  }
  return false
}

export type PieChartStats = Stats & {
  [key: string]: { total?: number }
}

export type PieChartDataMap = ColorBandsMap & { [key in CasesRange]: { value: number } }

export interface PieChartData {
  data: { value: number; text: string; color: string }[]
  total: number
}

export const generatePieChartsData = ({
  stats,
  dataKey,
}: {
  stats: PieChartStats
  dataKey: DataKey
}): PieChartData => {
  const pieChartData = { ...COLOR_BANDS } as PieChartDataMap
  Object.values(pieChartData).forEach((data) => (data.value = 0))
  let total = 0

  Object.values(stats).forEach((stat) => {
    if (stat[dataKey] < 101) {
      pieChartData.LESS_THAN_101.value += 1
    }
    if (stat[dataKey] > 100 && stat[dataKey] < 501) {
      pieChartData.LESS_THAN_501.value += 1
    }
    if (stat[dataKey] > 500 && stat[dataKey] < 1001) {
      pieChartData.LESS_THAN_1001.value += 1
    }
    if (stat[dataKey] > 1000 && stat[dataKey] < 3001) {
      pieChartData.LESS_THAN_3001.value += 1
    }
    if (stat[dataKey] > 3000 && stat[dataKey] < 5001) {
      pieChartData.LESS_THAN_5001.value += 1
    }
    if (stat[dataKey] > 5000) {
      pieChartData.GREATER_THAN_5000.value += 1
    }

    total++
  })

  return { data: Object.values(pieChartData), total }
}

export const deviceSupportsNotification = () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const notificationAllowed = 'Notification' in window && Notification.permission !== 'denied'
  return !isSafari && notificationAllowed
}
