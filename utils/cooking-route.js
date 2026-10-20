const { getStepImagePath } = require('./step-images')

function getCookingUrl(options) {
  const image = getStepImagePath(options.id, 0)
  if (!image) return ''
  const packageName = image.split('/')[1]
  const query = ['id', 'servings', 'resume'].filter(key => options[key] !== undefined && options[key] !== null).map(key => `${key}=${encodeURIComponent(options[key])}`).join('&')
  return `/${packageName}/resource?${query}`
}

module.exports = { getCookingUrl }
