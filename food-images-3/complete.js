const { getRecipeById } = require('../data/recipes')
const { getCompletedHistory, getSettings } = require('../utils/user-store')
const { estimateNutrition } = require('../utils/nutrition')

Page({
  data: {
    recipe: null,
    weeklyCount: 0,
    backButtonTop: 28,
    sparks: Array.from({ length: 18 }, (_, index) => index)
  },

  onLoad(options) {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({ backButtonTop: Number(windowInfo.statusBarHeight || 20) + 8 })
    const recipe = getRecipeById(options.id)
    if (!recipe) {
      wx.switchTab({ url: '/pages/home/home' })
      return
    }
    if (options.hd !== '1') {
      const packageName = recipe.hdImage.split('/')[1]
      wx.redirectTo({
        url: `/${packageName}/complete?id=${encodeURIComponent(recipe.id)}&hd=1`,
        fail: error => {
          console.error('[完成页高清图] 无法进入同包页面，使用主包兼容页', error || '')
          this.initializeComplete(recipe)
        }
      })
      return
    }
    this.initializeComplete(recipe)
  },

  initializeComplete(recipe) {
    const now = new Date()
    const day = now.getDay() || 7
    now.setDate(now.getDate() - day + 1)
    now.setHours(0, 0, 0, 0)
    const weeklyCount = getCompletedHistory().filter(record => Number(record.completedAt) >= now.getTime()).length
    this.setData({ recipe, weeklyCount, nutrition: estimateNutrition(recipe,1), heroImage: recipe.hdImage || recipe.image })
    if (getSettings().vibration) wx.vibrateShort({ type: 'light' })
  },

  exitToHome() {
    wx.switchTab({ url: '/pages/home/home' })
  },

  useFallbackImage() {
    const recipe = this.data.recipe
    if (recipe && this.data.heroImage !== recipe.image) this.setData({ heroImage: recipe.image })
  }
})
