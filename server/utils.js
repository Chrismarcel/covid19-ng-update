const COLOR_BANDS = {
  DEFAULT: { color: '#F88379', text: 'No cases' },
  LESS_THAN_11: { color: '#FF0800', text: '1 - 10' },
  LESS_THAN_51: { color: '#EB8967', text: '11 - 50' },
  LESS_THAN_101: { color: '#E66C41', text: '51 - 100' },
  LESS_THAN_501: { color: '#D0562B', text: '101 - 500' },
  LESS_THAN_1001: { color: '#B31B1B', text: '501 - 1000' },
  LESS_THAN_3001: { color: '#682B16', text: '1001 - 3000' },
  LESS_THAN_5001: { color: '#8A0707', text: '3001 - 5000' },
  GREATER_THAN_5000: { color: '#5B342E', text: '5000+' },
}

const generateChloropheth = (numCases) => {
  // #E45E2F - Base Color used to generate other shades via https://coolors.co

  let color
  switch (true) {
    case numCases < 1:
      color = COLOR_BANDS.DEFAULT.color
      break
    case numCases < 11:
      color = COLOR_BANDS.LESS_THAN_11.color
      break
    case numCases < 51:
      color = COLOR_BANDS.LESS_THAN_51.color
      break
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
      color = COLOR_BANDS.DEFAULT.color
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

const isChildNode = (parentNode, childNode) => {
  if ('contains' in parentNode) {
    return parentNode.contains(childNode)
  } else {
    return parentNode.compareDocumentPosition(childNode) % 16 !== 4
  }
}

module.exports = {
  generateChloropheth,
  slugifyStr,
  trimStr,
  reverseSlug,
  COLOR_BANDS,
  formatNumber,
  isChildNode,
}
