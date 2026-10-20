const { recipes } = require('../../data/recipes')
const { buildIngredientLibrary, recommendRecipes } = require('../../data/ingredient-matcher')
const { getSettings } = require('../../utils/user-store')
const { ingredientSearchScore } = require('../../utils/ingredient-search')

const ingredientLibrary = buildIngredientLibrary(recipes)

Page({
  data: {
    keyword: '',
    searchMatches: [],
    selectedIngredients: [],
    recommendations: [],
    hasRecommended: false
  },

  onSearchInput(event) {
    const keyword = event.detail.value.trim().toLowerCase()
    const selectedKeys = new Set(this.data.selectedIngredients.map(item => item.key))
    const searchMatches = keyword
      ? ingredientLibrary
        .filter(item => !selectedKeys.has(item.key))
        .map(item => ({ item, score: ingredientSearchScore(item, keyword) }))
        .filter(match => match.score >= 0)
        .sort((a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name, 'zh-CN'))
        .slice(0, 8)
        .map(match => match.item)
      : []
    this.setData({ keyword: event.detail.value, searchMatches })
  },

  clearSearch() {
    this.setData({ keyword: '', searchMatches: [] })
  },

  addIngredient(event) {
    const item = ingredientLibrary.find(ingredient => ingredient.key === event.currentTarget.dataset.key)
    if (!item) return
    const selectedIngredients = this.data.selectedIngredients.concat({ ...item, amount: item.defaultAmount || 1 })
    this.setData({
      selectedIngredients,
      keyword: '',
      searchMatches: [],
      recommendations: [],
      hasRecommended: false
    })
  },

  removeIngredient(event) {
    const key = event.currentTarget.dataset.key
    const selectedIngredients = this.data.selectedIngredients.filter(item => item.key !== key)
    this.setData({ selectedIngredients, recommendations: [], hasRecommended: false })
  },

  changeAmount(event) {
    const key = event.currentTarget.dataset.key
    const value = event.detail.value.replace(/[^0-9.]/g, '')
    const selectedIngredients = this.data.selectedIngredients.map(item => item.key === key ? { ...item, amount: value } : item)
    this.setData({ selectedIngredients, recommendations: [], hasRecommended: false })
  },

  finishAmount(event) {
    const key = event.currentTarget.dataset.key
    const selectedIngredients = this.data.selectedIngredients.map(item => {
      if (item.key !== key) return item
      const amount = Number(item.amount)
      return { ...item, amount: Number.isFinite(amount) && amount >= 1 ? amount : 1 }
    })
    this.setData({ selectedIngredients })
  },

  adjustAmount(event) {
    const key = event.currentTarget.dataset.key
    const direction = Number(event.currentTarget.dataset.direction)
    const selectedIngredients = this.data.selectedIngredients.map(item => {
      if (item.key !== key) return item
      const step = Number(item.amountStep || 1)
      return { ...item, amount: Math.max(1, Number(item.amount || 1) + direction * step) }
    })
    this.setData({ selectedIngredients, recommendations: [], hasRecommended: false })
  },

  findRecipes() {
    if (!this.data.selectedIngredients.length) {
      wx.showToast({ title: '请先添加至少一种食材', icon: 'none' })
      return
    }
    const selectedIngredients = this.data.selectedIngredients.map(item => ({ ...item, amount: Math.max(1, Number(item.amount) || 1) }))
    const settings = getSettings()
    const candidateRecipes = settings.allergyMode === 'hide'
      ? recipes.filter(recipe => !recipe.allergens.some(item => settings.allergens.includes(item)))
      : recipes
    const recommendations = recommendRecipes(candidateRecipes, selectedIngredients).map(recipe => {
      const allergyHits = recipe.allergens.filter(item => settings.allergens.includes(item))
      return { ...recipe, allergyWarning: settings.allergyMode === 'warn' ? allergyHits.join('、') : '', allergyHits }
    })
    this.setData({ selectedIngredients, recommendations, hasRecommended: true }, () => {
      wx.pageScrollTo({ selector: '.recommendations', duration: 300 })
      getApp().loadRecipeImages(recommendations).then(items => {
        if (this.data.hasRecommended) this.setData({ recommendations: items })
      })
    })
  },

  openRecipe(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` })
  }
})
