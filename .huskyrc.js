const tasks = arr => arr.join(' && ')

module.exports = {
  'hooks': {
    'pre-push': tasks([
      'scripts/pre-push.sh',
      '$(npm bin)/eslint ./src** --ext .js,.jsx,.ts,.tsx && $(npm bin)/tsc --skipLibCheck'
    ])
  }
}
