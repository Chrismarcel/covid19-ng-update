const generateChloropheth = (numCases) => {
  // #E45E2F - Base Color used to generate other shades via https://coolors.co

  let color
  switch (true) {
    case numCases < 1:
      color = '#FEFDFF'
      break;
    case numCases < 11:
      color = '#F5C4B3'
      break;
    case numCases < 51:
      color = '#F0A78D'
      break;
    case numCases < 101:
      color = '#E87B54'
      break;
    case numCases < 501:
      color = '#E45E2F'
      break;
    case numCases < 1001:
      color = '#BB4D27'
      break;
    case numCases < 5001:
      color = '#923C1E'
      break;
    default:
      color = '#3F1A0D'
      break;
  }

  return color
}

const slugifyKey = (str) => str.toLowerCase().replace(/ /g, '_')

const trimStr = (element) => element.text().trim()

module.exports = {
  generateChloropheth, slugifyKey, trimStr
}
