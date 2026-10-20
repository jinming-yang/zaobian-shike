const { recipes, getRecipeById } = require('../../data/recipes')
const { evaluateRecipe } = require('../../data/ingredient-matcher')
const { restartSession, saveSession, addIngredientToShoppingList, addRecipeToShoppingList, getSettings } = require('../../utils/user-store')
const { formatIngredientAmountParts } = require('../../utils/amount')
const { getRecipePreparation } = require('../../utils/cooking-guidance')

Page({
  data: {
    recipe: null,
    servings: 2,
    mainIngredients: [],
    seasoningIngredients: [],
    preparationItems: [],
    preparedCount: 0,
    showMissingPicker: false,
    missingOptions: [],
    shortageRecommendations: [],
    shortageHasRecommended: false
  },

  onLoad(options) {
    const recipe = getRecipeById(options.id)
    if (!recipe) {
      wx.navigateBack()
      return
    }
    this.recipe = recipe
    this.setData({ recipe, servings: recipe.baseServings, preparationItems: getRecipePreparation(recipe).map(item => ({...item, ready: false})), preparedCount: 0 }, () => this.updateAmounts())
  },

  togglePreparation(event) {
    const index = Number(event.currentTarget.dataset.index)
    if (!Number.isInteger(index) || !this.data.preparationItems[index]) return
    const preparationItems = this.data.preparationItems.map((item, i) => i === index ? {...item, ready: !item.ready} : item)
    this.setData({preparationItems, preparedCount: preparationItems.filter(item => item.ready).length})
  },

  changeServings(event) {
    const delta = Number(event.currentTarget.dataset.delta)
    const servings = Math.min(8, Math.max(1, this.data.servings + delta))
    this.setData({ servings }, () => this.updateAmounts())
  },

  updateAmounts() {
    const ratio = this.data.servings / this.recipe.baseServings
    const scale = items => items.map(item => {
      const shoppingAmount = item.amount * ratio
      const amountParts = formatIngredientAmountParts(shoppingAmount, item.unit, item.name)
      return {
        ...item,
        shoppingAmount,
        displayAmount: amountParts.primary,
        amountHint: amountParts.hint
      }
    })
    this.setData({
      mainIngredients: scale(this.recipe.ingredients.main),
      seasoningIngredients: scale(this.recipe.ingredients.seasoning)
    })
  },

  addToShoppingList() {
    addRecipeToShoppingList(this.data.recipe, this.data.servings)
    wx.showToast({ title: '已加入采购清单', icon: 'success' })
  },

  addMainIngredientsToShoppingList() {
    addRecipeToShoppingList(this.data.recipe, this.data.servings, false)
    wx.showToast({ title: '已加入主要食材', icon: 'success' })
  },

  addMainIngredient(event) {
    const item = this.data.mainIngredients[Number(event.currentTarget.dataset.index)]
    if (!item) return
    addIngredientToShoppingList(item, this.data.recipe.name, item.shoppingAmount)
    wx.showToast({ title: '已单独加入', icon: 'success' })
  },

  addSeasoningIngredient(event) {
    const item = this.data.seasoningIngredients[Number(event.currentTarget.dataset.index)]
    if (!item) return
    addIngredientToShoppingList(item, this.data.recipe.name, item.shoppingAmount)
    wx.showToast({ title: '调味料已加入', icon: 'success' })
  },

  openMissingPicker() {
    const missingOptions = this.data.mainIngredients.map((item, index) => ({
      ...item,
      optionKey: `${item.name}__${item.unit}__${index}`,
      isMissing: false
    }))
    this.setData({ showMissingPicker: true, missingOptions })
  },

  closeMissingPicker() {
    this.setData({ showMissingPicker: false })
  },

  noop() {},

  toggleMissingIngredient(event) {
    const optionKey = event.currentTarget.dataset.key
    const missingOptions = this.data.missingOptions.map(item => (
      item.optionKey === optionKey ? { ...item, isMissing: !item.isMissing } : item
    ))
    this.setData({ missingOptions })
  },

  confirmMissingIngredients() {
    const missingOptions = this.data.missingOptions
    if (!missingOptions.some(item => item.isMissing)) {
      wx.showToast({ title: '请勾选缺少的食材', icon: 'none' })
      return
    }
    const availableIngredients = missingOptions
      .filter(item => !item.isMissing)
      .map(item => ({ name: item.name, unit: item.unit, amount: item.shoppingAmount }))
    const settings = getSettings()
    const candidates = recipes.filter(recipe => {
      if (recipe.id === this.data.recipe.id) return false
      return settings.allergyMode !== 'hide' || !recipe.allergens.some(item => settings.allergens.includes(item))
    })
    const evaluated = candidates.map(recipe => evaluateRecipe(recipe, availableIngredients))
    const cookable = evaluated
      .filter(recipe => recipe.canCook)
      .sort((a, b) => a.cookMinutes - b.cookMinutes || a.name.localeCompare(b.name, 'zh-CN'))
    const closest = evaluated
      .filter(recipe => !recipe.canCook)
      .sort((a, b) => a.missing.length - b.missing.length || b.coverage - a.coverage || a.cookMinutes - b.cookMinutes)
    const shortageRecommendations = cookable.slice(0, 2)
    if (shortageRecommendations.length < 2) {
      shortageRecommendations.push(...closest.slice(0, 2 - shortageRecommendations.length))
    }
    const decorated = shortageRecommendations.map(recipe => {
      const allergyHits = recipe.allergens.filter(item => settings.allergens.includes(item))
      return {
        ...recipe,
        suggestionText: recipe.canCook ? '现有主要食材可以完成' : `再添加：${recipe.missingText}`,
        allergyWarning: settings.allergyMode === 'warn' ? allergyHits.join('、') : ''
      }
    })
    this.setData({
      showMissingPicker: false,
      shortageRecommendations: decorated,
      shortageHasRecommended: true
    }, () => {
      wx.pageScrollTo({ selector: '.shortage-results', duration: 300 })
      getApp().loadRecipeImages(decorated).then(items => {
        if (this.data.shortageHasRecommended) this.setData({ shortageRecommendations: items })
      })
    })
  },

  openRecommendedRecipe(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` })
  },

  startCooking() {
    this.beginCooking()
  },

  beginCooking() {
    restartSession(this.data.recipe.id)
    saveSession(this.data.recipe.id, {
      currentStep: 0,
      completedSteps: 0,
      totalSteps: this.data.recipe.steps.length,
      servings: this.data.servings,
      activeSeconds: 0
    })
    wx.navigateTo({ url: `/pages/cook/cook?id=${this.data.recipe.id}&servings=${this.data.servings}` })
  }
})
