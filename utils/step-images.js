// Each recipe step has its own reviewed illustration; never reuse a different dish.
function getStepImagePath(recipeId, stepIndex) {
  if (!/^[a-z0-9-]+$/.test(recipeId || '') || !Number.isInteger(stepIndex) || stepIndex < 0) return ''
  const packageNumber = 1 + Array.from(recipeId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 12
  return `/step-images-${packageNumber}/${recipeId}-${stepIndex + 1}.jpg`
}

function loadStepImage(path) {
  if (!path || !wx.loadSubpackage) return Promise.resolve('')
  const app = getApp()
  const name = path.split('/')[1]
  if (!/^step-images-(?:[1-9]|1[0-2])$/.test(name)) return Promise.resolve('')
  if (!app.stepImagePackageTasks) app.stepImagePackageTasks = {}
  if (!app.stepImagePackageTasks[name]) {
    app.stepImagePackageTasks[name] = new Promise(resolve => {
      try {
        wx.loadSubpackage({name, success: () => resolve(true), fail: () => resolve(false)})
      } catch (error) { resolve(false) }
    })
  }
  return app.stepImagePackageTasks[name].then(loaded => {
    // Failed downloads are retryable, not permanently cached for this launch.
    if (!loaded) delete app.stepImagePackageTasks[name]
    return loaded ? path : ''
  })
}

module.exports = { getStepImagePath, loadStepImage }
