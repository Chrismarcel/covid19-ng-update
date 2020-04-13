const COLOR_BANDS = {
  DEFAULT: '#FEFDFF',
  LESS_THAN_11: '#F5C4B3',
  LESS_THAN_51: '#EB8967',
  LESS_THAN_101: '#E66C41',
  LESS_THAN_501: '#D0562B',
  LESS_THAN_1001: '#A64523',
  LESS_THAN_5001: '#682B16',
  GREATER_THAN_5000: '#2A1209'
}

const generateChloropheth = (numCases) => {
  // #E45E2F - Base Color used to generate other shades via https://coolors.co

  let color
  switch (true) {
    case numCases < 1:
      color = COLOR_BANDS.DEFAULT
      break;
    case numCases < 11:
      color = COLOR_BANDS.LESS_THAN_11
      break;
    case numCases < 51:
      color = COLOR_BANDS.LESS_THAN_51
      break;
    case numCases < 101:
      color = COLOR_BANDS.LESS_THAN_101
      break;
    case numCases < 501:
      color = COLOR_BANDS.LESS_THAN_501
      break;
    case numCases < 1001:
      color = COLOR_BANDS.LESS_THAN_1001
      break;
    case numCases < 5001:
      color = COLOR_BANDS.LESS_THAN_5001
      break;
    case numCases > 5000:
      color = COLOR_BANDS.GREATER_THAN_5000
      break;
    default:
      color = COLOR_BANDS.DEFAULT
      break;
  }

  return color
}

const slugifyStr = (str) => str.toLowerCase().replace(/ /g, '_')

const reverseSlug = (str) => str.replace(/_/g, ' ')

const trimStr = (element) => element.text().trim()

const allStates = [
  "abuja_fct",
  "abia",
  "adamawa",
  "akwa_ibom",
  "anambra",
  "bauchi",
  "bayelsa",
  "benue",
  "borno",
  "cross_river",
  "delta",
  "ebonyi",
  "enugu",
  "edo",
  "ekiti",
  "gombe",
  "imo",
  "jigawa",
  "kaduna",
  "kano",
  "katsina",
  "kebbi",
  "kogi",
  "kwara",
  "lagos",
  "nasarawa",
  "niger",
  "ogun",
  "ondo",
  "osun",
  "oyo",
  "plateau",
  "rivers",
  "sokoto",
  "taraba",
  "yobe",
  "zamfara"
]

module.exports = {
  generateChloropheth, 
  slugifyStr, 
  trimStr, 
  reverseSlug,
  COLOR_BANDS,
  allStates
}
