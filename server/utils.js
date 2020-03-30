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
      color = '#EB8967'
      break;
    case numCases < 101:
      color = '#E66C41'
      break;
    case numCases < 501:
      color = '#D0562B'
      break;
    case numCases < 1001:
      color = '#A64523'
      break;
    case numCases < 5001:
      color = '#923C1E'
      break;
    case numCases > 5001:
      color = '#3F1A0D'
      break;
    default:
      color = '#FEFDFF'
      break;
  }

  return color
}

const slugifyKey = (str) => str.toLowerCase().replace(/ /g, '_')

const reverseSlug = (str) => str.replace(/_/g, ' ')

const trimStr = (element) => element.text().trim()

module.exports = {
  generateChloropheth, 
  slugifyKey, 
  trimStr, 
  reverseSlug
}
