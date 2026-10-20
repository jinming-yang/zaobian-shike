const { getRecipeById } = require('../data/recipes')
const { loadStepImage, getStepImagePath } = require('./step-images')
const { getCookingUrl } = require('./cooking-route')
const { getHeatGuidance, getSequenceGuidance } = require('./cooking-guidance')
const {
  getSettings,
  getSession,
  saveSession,
  addActiveSeconds,
  completeSession,
  restartSession
} = require('./user-store')

const definition = {
  data: {
    recipe: null,
    step: null,
    heatGuidance: null,
    sequenceGuidance: null,
    stepImage: '',
    stepImageLoading: false,
    showExitDialog: false,
    cookingEnded: false,
    stepIndex: 0,
    totalSteps: 0,
    progress: 0,
    isLastStep: false,
    remainingSeconds: 0,
    formattedTime: '00:00',
    timerStatus: 'idle',
    timerButtonText: '开始计时'
  },

  onLoad(options) {
    const recipe = getRecipeById(options.id)
    if (!recipe) {
      wx.navigateBack()
      return
    }
    const expectedPackage = getStepImagePath(recipe.id, 0).split('/')[1]
    if (this.data.imagePackage && this.data.imagePackage !== expectedPackage) {
      wx.redirectTo({url: getCookingUrl(options)})
      return
    }
    this.servings = Number(options.servings || recipe.baseServings)
    this.recipe = recipe
    this.settings = getSettings()
    const existing = getSession(recipe.id)
    const shouldResume = options.resume === '1' && existing
    this.completedSteps = shouldResume ? Number(existing.completedSteps || 0) : 0
    if (!existing) {
      saveSession(recipe.id, { totalSteps: recipe.steps.length, servings: this.servings })
    }
    this.loadStep(shouldResume ? Math.min(Number(existing.currentStep || 0), recipe.steps.length - 1) : 0)
  },

  onShow() {
    if (this.cookingEnded) return
    this.settings = getSettings()
    this.activeSince = Date.now()
    if (this.settings.keepScreenOn && wx.setKeepScreenOn) wx.setKeepScreenOn({ keepScreenOn: true })
    this.restoreTimerFromSession()
    if (this.data.timerStatus === 'running') {
      this.tick()
      if (this.data.timerStatus === 'running') this.beginInterval()
    }
  },

  onHide() {
    this.pauseActivityTracking()
    this.clearTimerInterval()
  },

  onUnload() {
    this.stepImageRequest = (this.stepImageRequest || 0) + 1
    this.pauseActivityTracking()
    this.clearTimerInterval()
    if (wx.setKeepScreenOn) wx.setKeepScreenOn({ keepScreenOn: false })
  },

  loadStep(index) {
    this.clearTimerInterval()
    const step = this.recipe.steps[index]
    const seconds = step.timerSeconds || 0
    const session = getSession(this.recipe.id)
    const savedTimer = session && session.timer && Number(session.timer.stepIndex) === index ? session.timer : null
    const timerStatus = savedTimer ? savedTimer.status : 'idle'
    const remainingSeconds = savedTimer
      ? (timerStatus === 'running' && savedTimer.deadline
        ? Math.max(0, Math.ceil((Number(savedTimer.deadline) - Date.now()) / 1000))
        : Number(savedTimer.remainingSeconds || 0))
      : seconds
    this.deadline = savedTimer && savedTimer.deadline ? Number(savedTimer.deadline) : null
    this.setData({
      recipe: this.recipe,
      step,
      heatGuidance: getHeatGuidance(step),
      sequenceGuidance: getSequenceGuidance(step, this.recipe),
      stepIndex: index,
      totalSteps: this.recipe.steps.length,
      progress: ((index + 1) / this.recipe.steps.length) * 100,
      isLastStep: index === this.recipe.steps.length - 1,
      remainingSeconds,
      formattedTime: this.formatTime(remainingSeconds),
      timerStatus,
      timerButtonText: this.getTimerButtonText(timerStatus)
    })
    saveSession(this.recipe.id, {
      currentStep: index,
      completedSteps: this.completedSteps,
      totalSteps: this.recipe.steps.length,
      servings: this.servings
    })
    this.loadStepPicture()
    if (timerStatus === 'running' && remainingSeconds <= 0) this.finishTimer()
  },

  loadStepPicture() {
    const request = this.stepImageRequest = (this.stepImageRequest || 0) + 1
    const image = this.data.step && this.data.step.image
    this.setData({stepImage: '', stepImageLoading: true})
    // The page and its illustrations are in the same package: no private cross-package asset access.
    const task = this.data.imagePackage && image && image.startsWith('/' + this.data.imagePackage + '/')
      ? Promise.resolve(image) : loadStepImage(image)
    task.then(source => {
      if (this.stepImageRequest !== request) return
      this.setData({stepImage: source, stepImageLoading: false})
    }).catch(() => {
      if (this.stepImageRequest === request) this.setData({stepImage: '', stepImageLoading: false})
    })
  },

  onStepImageError(event) {
    if (this._pageDisposed) return
    if (event.currentTarget.dataset.path !== this.data.stepImage) return
    this.setData({stepImage: '', stepImageLoading: false})
  },

  previewStepImage() {
    const source = this.data.stepImage
    const request = this.stepImageRequest
    if (!source || !wx.previewImage) return
    const show = path => {
      if (this.data.stepImage !== source || this.stepImageRequest !== request) return
      wx.previewImage({current: path, urls: [path], fail: () => wx.showToast({title: '暂时无法放大，请重试', icon: 'none'})})
    }
    if (wx.getImageInfo) {
      wx.getImageInfo({src: source, success: info => show(info.path), fail: () => wx.showToast({title: '暂时无法放大，请重试', icon: 'none'})})
    } else show(source)
  },

  restoreTimerFromSession() {
    if (!this.recipe) return
    const session = getSession(this.recipe.id)
    const timer = session && session.timer
    if (!timer || Number(timer.stepIndex) !== this.data.stepIndex) return
    const remainingSeconds = timer.status === 'running' && timer.deadline
      ? Math.max(0, Math.ceil((Number(timer.deadline) - Date.now()) / 1000))
      : Number(timer.remainingSeconds || 0)
    this.deadline = timer.deadline ? Number(timer.deadline) : null
    this.setData({
      remainingSeconds,
      formattedTime: this.formatTime(remainingSeconds),
      timerStatus: timer.status,
      timerButtonText: this.getTimerButtonText(timer.status)
    })
  },

  getTimerButtonText(status) {
    if (status === 'running') return '暂停计时'
    if (status === 'paused') return '继续计时'
    if (status === 'done') return '计时完成'
    return '开始计时'
  },

  goBack() {
    if (this.leavingCooking) return
    if (this.cookingEnded) { this.exitToHome(); return }
    this.setData({showExitDialog: true})
  },

  continueCooking() {
    this.setData({showExitDialog: false})
  },

  keepProgressAndExit() {
    if (this.leavingCooking || this.cookingEnded || !this.recipe) return
    this.pauseActivityTracking()
    saveSession(this.recipe.id, {
      currentStep: this.data.stepIndex,
      completedSteps: this.completedSteps,
      totalSteps: this.recipe.steps.length,
      servings: this.servings
    })
    this.clearTimerInterval()
    this.setData({showExitDialog: false})
    this.exitToHome()
  },

  endCookingAndExit() {
    if (this.leavingCooking || this.cookingEnded || !this.recipe) return
    this.clearTimerInterval()
    this.deadline = null
    this.pauseActivityTracking()
    restartSession(this.recipe.id)
    const app = getApp()
    if (app && app.globalData && Array.isArray(app.globalData.timerAlertQueue)) {
      app.globalData.timerAlertQueue = app.globalData.timerAlertQueue.filter(alert => alert.recipeId !== this.recipe.id)
    }
    this.cookingEnded = true
    this.setData({showExitDialog: false, cookingEnded: true, timerStatus: 'idle', remainingSeconds: 0, formattedTime: '00:00'})
    this.exitToHome()
  },

  exitToHome() {
    this.leavingCooking = true
    wx.switchTab({url: '/pages/home/home', fail: () => {
      if (this._pageDisposed) return
      this.leavingCooking = false
      if (!this.cookingEnded) {
        this.activeSince = Date.now()
        if (this.data.timerStatus === 'running') this.beginInterval()
      }
      wx.showToast({title: '返回失败，请点击左上角重试', icon: 'none'})
    }})
  },

  noop() {
  },

  toggleTimer() {
    if (this.leavingCooking || this.cookingEnded) return
    if (this.data.timerStatus === 'done') return
    if (this.data.timerStatus === 'running') {
      this.tick()
      if (this.data.timerStatus === 'done') return
      this.clearTimerInterval()
      this.deadline = null
      this.setData({ timerStatus: 'paused', timerButtonText: '继续计时' })
      saveSession(this.recipe.id, {
        timer: { stepIndex: this.data.stepIndex, status: 'paused', deadline: null, remainingSeconds: this.data.remainingSeconds, notified: false }
      })
      return
    }
    this.deadline = Date.now() + this.data.remainingSeconds * 1000
    this.setData({ timerStatus: 'running', timerButtonText: '暂停计时' })
    saveSession(this.recipe.id, {
      timer: { stepIndex: this.data.stepIndex, status: 'running', deadline: this.deadline, remainingSeconds: this.data.remainingSeconds, notified: false }
    })
    this.beginInterval()
  },

  beginInterval() {
    this.clearTimerInterval()
    this.interval = setInterval(() => this.tick(), 250)
  },

  tick() {
    if (!this.deadline) return
    const remainingSeconds = Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000))
    this.setData({ remainingSeconds, formattedTime: this.formatTime(remainingSeconds) })
    if (remainingSeconds === 0) this.finishTimer()
  },

  finishTimer() {
    this.clearTimerInterval()
    this.deadline = null
    this.setData({ timerStatus: 'done', timerButtonText: '计时完成' })
    const app = getApp()
    if (app && app.notifyTimerFinished) app.notifyTimerFinished(this.recipe.id)
  },

  clearTimerInterval() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  },

  pauseActivityTracking() {
    if (!this.activeSince || !this.recipe) return
    const seconds = Math.max(0, Math.round((Date.now() - this.activeSince) / 1000))
    this.activeSince = null
    if (seconds) addActiveSeconds(this.recipe.id, seconds)
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  },

  startAnotherDish() {
    if (this.leavingCooking || this.cookingEnded) return
    this.pauseActivityTracking()
    wx.switchTab({ url: '/pages/home/home' })
  },

  previousStep() {
    if (this.leavingCooking || this.cookingEnded || this.data.stepIndex <= 0) return
    const stepIndex = this.data.stepIndex
    const goPrevious = () => {
      if (this.leavingCooking || this.cookingEnded || this.data.stepIndex !== stepIndex) return
      saveSession(this.recipe.id, { timer: null })
      this.loadStep(stepIndex - 1)
    }
    if (this.data.timerStatus === 'running' || this.data.timerStatus === 'paused') {
      wx.showModal({
        title: '返回上一步',
        content: '返回后将停止本步计时，再次进入本步骤需重新开始计时。是否返回？',
        cancelText: '留在本步',
        confirmText: '返回上步',
        confirmColor: '#31584c',
        success: result => { if (result.confirm) goPrevious() },
        fail: () => wx.showToast({ title: '提示框打开失败，请重试', icon: 'none' })
      })
      return
    }
    goPrevious()
  },

  nextStep() {
    if (this.leavingCooking || this.cookingEnded) return
    const timerStartedButUnfinished = this.data.step.timerSeconds > 0 &&
      this.data.timerStatus !== 'idle' && this.data.timerStatus !== 'done'
    if (timerStartedButUnfinished) {
      wx.showModal({
        title: '计时尚未结束',
        content: '是否确认进入下一步？当前计时将停止。',
        cancelText: '继续计时',
        confirmText: '下一步',
        confirmColor: '#c75534',
        success: result => {
          if (result.confirm) this.advance()
        },
        fail: () => {
          wx.showToast({ title: '提示框打开失败，请重试', icon: 'none' })
        }
      })
      return
    }
    this.advance()
  },

  advance() {
    if (this.leavingCooking || this.cookingEnded) return
    saveSession(this.recipe.id, { timer: null })
    this.completedSteps = Math.max(this.completedSteps, this.data.stepIndex + 1)
    if (this.data.isLastStep) {
      saveSession(this.recipe.id, {
        currentStep: this.data.stepIndex,
        completedSteps: this.recipe.steps.length,
        totalSteps: this.recipe.steps.length,
        servings: this.servings
      })
      this.pauseActivityTracking()
      const session = getSession(this.recipe.id)
      completeSession(this.recipe.id, {
        totalSteps: this.recipe.steps.length,
        servings: this.servings,
        activeSeconds: session ? session.activeSeconds : 0
      })
      wx.redirectTo({
        url: `/pages/complete/complete?id=${this.recipe.id}&servings=${this.servings}`
      })
      return
    }
    this.loadStep(this.data.stepIndex + 1)
  }
}

module.exports = function createCookPage(imagePackage) {
  return {...definition, tutorialPageKey: 'cook', data: {...definition.data, imagePackage: imagePackage || ''}}
}

// The main-package entry shares this module with the cooking subpackages.
module.exports.createCookEntryPage = function createCookEntryPage() {
  return {
    data: {redirecting: true, redirectError: false},
    onLoad(options) {
      if (!getRecipeById(options.id)) { this.goHome(); return }
      this.cookingOptions = options
      this.retryLoad()
    },
    retryLoad() {
      if (this.loading || !this.cookingOptions) return
      this.loading = true
      this.setData({redirectError: false})
      wx.redirectTo({url: getCookingUrl(this.cookingOptions), fail: () => {
        this.loading = false
        if (!this._pageDisposed) this.setData({redirectError: true})
      }})
    },
    goHome() { wx.switchTab({url:'/pages/home/home'}) }
  }
}
