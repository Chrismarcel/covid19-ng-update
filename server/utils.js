const COLOR_BANDS = {
  LESS_THAN_101: { color: '#ff6347', text: '1 - 100' },
  LESS_THAN_501: { color: '#f88379', text: '101 - 500' },
  LESS_THAN_1001: { color: '#cd5c5c', text: '501 - 1000' },
  LESS_THAN_3001: { color: '#e34234', text: '1001 - 3000' },
  LESS_THAN_5001: { color: '#ff2400', text: '3001 - 5000' },
  GREATER_THAN_5000: { color: '#8b0000', text: '5000+' },
}

const generateChloropheth = (numCases) => {
  // #E45E2F - Base Color used to generate other shades via https://coolors.co

  let color
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

const slugifyStr = (str) => str.toLowerCase().replace(/ /g, '_')

const reverseSlug = (str) => str.replace(/_/g, ' ')

const trimStr = (element) => element.text().trim()

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number)
}

const toSentenceCase = (str) => {
  const [firstLetter, ...otherLetters] = str
  return firstLetter.toUpperCase() + otherLetters.join('')
}

const isChildNode = (parentNode, childNode) => {
  if ('contains' in parentNode) {
    return parentNode.contains(childNode)
  } else {
    return parentNode.compareDocumentPosition(childNode) % 16 !== 4
  }
}

const generatePieChartsData = (stats) => {
  const pieChartData = { ...COLOR_BANDS }
  Object.values(pieChartData).forEach((data) => (data.value = 0))
  let total = 0

  Object.values(stats).forEach((stat) => {
    if (stat.confirmedCases < 101) {
      pieChartData.LESS_THAN_101.value += 1
    }
    if (stat.confirmedCases > 100 && stat.confirmedCases < 501) {
      pieChartData.LESS_THAN_501.value += 1
    }
    if (stat.confirmedCases > 500 && stat.confirmedCases < 1001) {
      pieChartData.LESS_THAN_1001.value += 1
    }
    if (stat.confirmedCases > 1000 && stat.confirmedCases < 3001) {
      pieChartData.LESS_THAN_3001.value += 1
    }
    if (stat.confirmedCases > 3000 && stat.confirmedCases < 5001) {
      pieChartData.LESS_THAN_5001.value += 1
    }
    if (stat.confirmedCases > 5000) {
      pieChartData.GREATER_THAN_5000.value += 1
    }

    total++
  })

  return { data: Object.values(pieChartData), total }
}

module.exports = {
  generateChloropheth,
  slugifyStr,
  trimStr,
  reverseSlug,
  COLOR_BANDS,
  formatNumber,
  isChildNode,
  toSentenceCase,
  generatePieChartsData
}
