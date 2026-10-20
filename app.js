const { getActiveSessions, getSession, saveSession, getSettings } = require('./utils/user-store')
const { getRecipeById } = require('./data/recipes')
require('./utils/page-features').installPageFeatures()

App({
  globalData: {
    appName: '灶边食刻',
    timerAlertQueue: [],
    timerAlertOpen: false,
    recipeImageLoadFailures: []
  },

  onLaunch() {
    this.imagePackageTasks = {}
    this.recipeImageVerifyTasks = {}
    this.timerAudio = wx.createInnerAudioContext()
    this.timerAudio.src = '/assets/audio/timer.wav'
    this.startTimerMonitor()
  },

  onShow() {
    this.startTimerMonitor()
    this.checkActiveTimers()
  },

  loadRecipeImage(recipe) {
    if (!recipe || !recipe.hdImage || !wx.loadSubpackage) return Promise.resolve(recipe && recipe.image)
    const name = recipe.hdImage.split('/')[1]
    if (!this.imagePackageTasks) this.imagePackageTasks = {}
    if (!this.imagePackageTasks[name]) {
      this.imagePackageTasks[name] = new Promise(resolve => {
        try {
          wx.loadSubpackage({
            name,
            success: () => resolve({ loaded: true }),
            fail: error => resolve({ loaded: false, error })
          })
        } catch (error) {
          resolve({ loaded: false, error })
        }
      })
    }
    return this.imagePackageTasks[name].then(result => {
      if (result.loaded) return this.verifyRecipeImage(recipe.hdImage, recipe.image)
      if (!this.globalData.recipeImageLoadFailures.includes(name)) {
        this.globalData.recipeImageLoadFailures.push(name)
        console.error(`[菜品高清图] 分包 ${name} 加载失败，改用新版缩略图`, result.error || '')
      }
      return recipe.image
    })
  },

  verifyRecipeImage(source, fallback) {
    if (!source || !wx.getImageInfo) return Promise.resolve(source || fallback)
    if (!this.recipeImageVerifyTasks) this.recipeImageVerifyTasks = {}
    if (!this.recipeImageVerifyTasks[source]) {
      this.recipeImageVerifyTasks[source] = new Promise(resolve => {
        wx.getImageInfo({
          src: source,
          success: () => resolve(source),
          fail: error => {
            console.error(`[菜品高清图] ${source} 无法读取，改用新版缩略图`, error || '')
            resolve(fallback)
          }
        })
      })
    }
    return this.recipeImageVerifyTasks[source]
  },

  loadRecipeImages(recipes) {
    const list = Array.isArray(recipes) ? recipes : []
    if (!list.length) return Promise.resolve([])
    const images = new Array(list.length)
    let cursor = 0
    const worker = () => {
      const index = cursor++
      if (index >= list.length) return Promise.resolve()
      return this.loadRecipeImage(list[index])
        .then(image => { images[index] = image || list[index].image })
        .then(worker)
    }
    const workerCount = Math.min(4, list.length)
    return Promise.all(Array.from({ length: workerCount }, worker))
      .then(() => list.map((recipe, index) => ({ ...recipe, displayImage: images[index] || recipe.image })))
  },

  onHide() {
    this.stopTimerMonitor()
  },

  startTimerMonitor() {
    this.stopTimerMonitor()
    this.checkActiveTimers()
    this.timerMonitor = setInterval(() => this.checkActiveTimers(), 500)
  },

  stopTimerMonitor() {
    if (!this.timerMonitor) return
    clearInterval(this.timerMonitor)
    this.timerMonitor = null
  },

  checkActiveTimers() {
    getActiveSessions().forEach(session => {
      const timer = session.timer
      if (!timer || timer.status !== 'running' || !timer.deadline) return
      if (Number(timer.deadline) <= Date.now()) this.notifyTimerFinished(session.recipeId)
    })
  },

  notifyTimerFinished(recipeId) {
    const session = getSession(recipeId)
    const timer = session && session.timer
    if (!timer || timer.notified) return
    saveSession(recipeId, {
      timer: { ...timer, status: 'done', deadline: null, remainingSeconds: 0, notified: true }
    })
    this.globalData.timerAlertQueue.push({ recipeId, stepIndex: Number(timer.stepIndex || 0) })
    this.showNextTimerAlert()
  },

  showNextTimerAlert() {
    if (this.globalData.timerAlertOpen || !this.globalData.timerAlertQueue.length) return
    const alert = this.globalData.timerAlertQueue.shift()
    const recipe = getRecipeById(alert.recipeId)
    if (!recipe) {
      this.showNextTimerAlert()
      return
    }
    const step = recipe.steps[alert.stepIndex]
    const settings = getSettings()
    this.globalData.timerAlertOpen = true
    if (settings.timerSound && this.timerAudio) {
      this.timerAudio.stop()
      this.timerAudio.play()
    }
    if (settings.vibration && wx.vibrateLong) wx.vibrateLong()
    wx.showModal({
      title: `${recipe.name}计时结束`,
      content: step ? `“${step.title}”的计时已完成，可以继续下一步。` : '计时已完成，可以继续烹饪。',
      showCancel: false,
      confirmText: '知道了',
      complete: () => {
        this.globalData.timerAlertOpen = false
        this.showNextTimerAlert()
      }
    })
  }
})
