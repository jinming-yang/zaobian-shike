const { getRecipeById } = require('../data/recipes')
const { getSettings, getSession, restartSession, isFavorite, toggleFavorite } = require('../utils/user-store')
const { estimateNutrition } = require('../utils/nutrition')

Page({
  data: {
    recipe: null,
    ingredientStars: [],
    difficultyStars: [],
    backButtonTop: 28,
    isFavorite: false,
    showCalories: true,
    calorieServings: 1,
    displayCalories: 0,
    jogMinutes: 0,
    allergyWarning: ''
  },

  onLoad(options) {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const recipe = getRecipeById(options.id)
    if (!recipe) {
      wx.showToast({ title: '菜谱不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    if (options.hd !== '1') {
      const packageName = recipe.hdImage.split('/')[1]
      wx.redirectTo({
        url: `/${packageName}/detail?id=${encodeURIComponent(recipe.id)}&hd=1`,
        fail: error => {
          console.error('[菜品高清图] 无法进入同包详情页，使用主包兼容页', error || '')
          this.initializeRecipe(recipe, windowInfo)
        }
      })
      return
    }
    this.initializeRecipe(recipe, windowInfo)
  },

  initializeRecipe(recipe, windowInfo) {
    wx.setNavigationBarTitle({ title: recipe.name })
    this.setData({
      recipe,
      backButtonTop: windowInfo.statusBarHeight + 8,
      sourceLabel: recipe.sourceUrl ? '已记录公开参考来源' : '家常参考版 · 待补充权威来源',
      ingredientStars: this.makeStars(recipe.ingredientComplexity),
      difficultyStars: this.makeStars(recipe.difficulty)
    })
    this.recipe = recipe
    this.setData({ heroImage: recipe.hdImage || recipe.image })
    this.refreshPersonalized()
  },

  onShow() {
    if (this.recipe) this.refreshPersonalized()
  },

  refreshPersonalized() {
    const settings = getSettings()
    const allergyHits = this.recipe.allergens.filter(item => settings.allergens.includes(item))
    const nutrition = estimateNutrition(this.recipe, settings.calorieServings)
    const displayCalories = Math.round(!nutrition.partial && nutrition.energy !== null ? nutrition.energy : this.recipe.caloriesPerServing * settings.calorieServings)
    this.setData({
      isFavorite: isFavorite(this.recipe.id),
      nutrition,
      calorieSource: !nutrition.partial ? '按当前配方及已匹配食物成分估算' : this.recipe.calorieSource,
      showCalories: settings.showCalories,
      calorieServings: settings.calorieServings,
      displayCalories,
      jogMinutes: Math.max(1, Math.round(displayCalories / 8)),
      allergyWarning: settings.allergyMode === 'warn' ? allergyHits.join('、') : ''
    })
  },

  makeStars(score) {
    return [1, 2, 3, 4, 5].map(value => ({ value, active: value <= score }))
  },

  useFallbackImage() {
    if (this.recipe && this.data.heroImage !== this.recipe.image) this.setData({ heroImage: this.recipe.image })
  },

  goBack() {
    if (getCurrentPages().length > 1) wx.navigateBack()
    else wx.switchTab({ url: '/pages/home/home' })
  },

  startPrep() {
    const session = getSession(this.data.recipe.id)
    const settings = getSettings()
    if (session && settings.resumePrompt) {
      wx.showModal({
        title: '发现未完成的烹饪',
        content: `上次已完成 ${Math.round(session.completedSteps / session.totalSteps * 100)}%，是否继续？`,
        cancelText: '从头开始',
        confirmText: '继续',
        success: result => {
          if (result.confirm) {
            wx.navigateTo({ url: `/pages/cook/cook?id=${this.data.recipe.id}&servings=${session.servings || this.data.recipe.baseServings}&resume=1` })
          } else if (result.cancel) {
            restartSession(this.data.recipe.id)
            wx.navigateTo({ url: `/pages/prep/prep?id=${this.data.recipe.id}` })
          }
        }
      })
      return
    }
    if (session) restartSession(this.data.recipe.id)
    wx.navigateTo({ url: `/pages/prep/prep?id=${this.data.recipe.id}` })
  },

  toggleFavorite() {
    const added = toggleFavorite(this.data.recipe.id)
    this.setData({ isFavorite: added })
    wx.showToast({ title: added ? '收藏成功' : '已取消收藏', icon: 'none' })
  }
})
