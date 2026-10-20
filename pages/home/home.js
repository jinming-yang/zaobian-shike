const { recipes } = require('../../data/recipes')
const { getFavorites, toggleFavorite, getSettings, getSession, restartSession, getShoppingList } = require('../../utils/user-store')
const { recipeMatchesKeyword } = require('../../utils/recipe-search')
const { preferenceForRecipe } = require('../../utils/recommendation')

const categories = ['全部', '人气推荐', '家常菜', '快手菜', '减脂餐', '川菜', '粤菜', '江浙菜', '简便西餐', '东南亚菜', '日式料理', '韩式料理', '印度菜', '墨西哥菜', '汤羹', '烘焙', '甜点']
const IMAGE_BATCH_SIZE = 16

Page({
  data: {
    categories,
    activeCategory: '全部',
    keyword: '',
    recipes: [],
    filteredRecipes: [],
    searchResults: [],
    showSearchResults: false,
    searchPanelHeight: 0,
    shoppingCount: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    this.setData({ shoppingCount: getShoppingList().filter(item => !item.purchased).length })
    this.refreshRecipes()
  },

  refreshRecipes() {
    const settings = getSettings()
    const favorites = new Set(getFavorites())
    const decorated = recipes.map(recipe => {
      const allergyHits = recipe.allergens.filter(item => settings.allergens.includes(item))
      return {
        ...recipe,
        ...preferenceForRecipe(recipe, settings.tags),
        isFavorite: favorites.has(recipe.id),
        allergyHits,
        allergyWarning: allergyHits.join('、')
      }
    }).filter(recipe => settings.allergyMode !== 'hide' || !recipe.allergyHits.length)
      .sort((a,b) => b.recommendationScore - a.recommendationScore)
    this.setData({ recipes: decorated }, () => {
      this.applyFilters()
      this.loadVisibleRecipeImages(true)
    })
  },

  loadVisibleRecipeImages(reset) {
    if (!this.imageLoadingIds) this.imageLoadingIds = new Set()
    const visible = this.data.filteredRecipes || []
    const missing = visible.filter(item => !item.displayImage && !this.imageLoadingIds.has(item.id))
    const batch = missing.slice(0, IMAGE_BATCH_SIZE)
    if (!batch.length) return
    batch.forEach(item => this.imageLoadingIds.add(item.id))
    getApp().loadRecipeImages(batch).then(loaded => {
      const loadedMap = new Map(loaded.map(item => [item.id, item]))
      const recipes = this.data.recipes.map(item => loadedMap.get(item.id) || item)
      loaded.forEach(item => this.imageLoadingIds.delete(item.id))
      this.setData({ recipes }, () => this.applyFilters())
    }).catch(() => {
      batch.forEach(item => this.imageLoadingIds.delete(item.id))
    })
  },

  onReachBottom() {
    this.loadVisibleRecipeImages(false)
  },

  onSearchInput(event) {
    const keyword = event.detail.value
    this.setData({
      keyword,
      showSearchResults: Boolean(keyword.trim())
    }, () => {
      this.applyFilters()
      this.loadSearchResultImages()
    })
  },

  loadSearchResultImages() {
    if (!this.imageLoadingIds) this.imageLoadingIds = new Set()
    const batch = (this.data.searchResults || [])
      .filter(item => !item.displayImage && !this.imageLoadingIds.has(item.id))
      .slice(0, 8)
    if (!batch.length) return
    batch.forEach(item => this.imageLoadingIds.add(item.id))
    getApp().loadRecipeImages(batch).then(loaded => {
      const loadedMap = new Map(loaded.map(item => [item.id, item]))
      const recipes = this.data.recipes.map(item => loadedMap.get(item.id) || item)
      loaded.forEach(item => this.imageLoadingIds.delete(item.id))
      this.setData({ recipes }, () => this.applyFilters())
    }).catch(() => batch.forEach(item => this.imageLoadingIds.delete(item.id)))
  },

  clearSearch() {
    this.setData({ keyword: '', showSearchResults: false }, () => this.applyFilters())
  },

  onSearchFocus() {
    this.setData({ showSearchResults: Boolean(this.data.keyword.trim()) })
  },

  closeSearch() {
    this.setData({ showSearchResults: false })
  },

  openSearchResult(event) {
    this.closeSearch()
    if (wx.hideKeyboard) wx.hideKeyboard()
    this.openRecipe(event)
  },

  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.category, showSearchResults: false }, () => {
      this.applyFilters()
      this.loadVisibleRecipeImages(true)
    })
  },

  applyFilters() {
    const keyword = this.data.keyword
    const category = this.data.activeCategory
    const filteredRecipes = this.data.recipes.filter(recipe => category === '全部' || recipe.categories.includes(category))
    const searchResults = keyword.trim() ? this.data.recipes.filter(recipe => recipeMatchesKeyword(recipe, keyword)) : []
    this.setData({ filteredRecipes, searchResults, searchPanelHeight: Math.min(420, searchResults.length * 112) })
  },

  openRecipe(event) {
    const id = event.currentTarget.dataset.id
    const session = getSession(id)
    const settings = getSettings()
    if (!session || !settings.resumePrompt) {
      wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
      return
    }
    const recipe = recipes.find(item => item.id === id)
    wx.showModal({
      title: `继续烹饪${recipe.name}？`,
      content: `上次已完成 ${Math.round(session.completedSteps / session.totalSteps * 100)}%，可以回到第 ${session.currentStep + 1} 步。`,
      cancelText: '从头开始',
      confirmText: '继续',
      success: result => {
        if (result.confirm) {
          wx.navigateTo({ url: `/pages/cook/cook?id=${id}&servings=${session.servings || recipe.baseServings}&resume=1` })
        } else if (result.cancel) {
          restartSession(id)
          wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
        }
      }
    })
  },

  toggleFavorite(event) {
    const added = toggleFavorite(event.currentTarget.dataset.id)
    wx.showToast({ title: added ? '收藏成功' : '已取消收藏', icon: 'none' })
    this.refreshRecipes()
  },

  openPantry() {
    wx.navigateTo({ url: '/pages/pantry/pantry' })
  },

  openShoppingList() {
    wx.navigateTo({ url: '/pages/shopping/shopping' })
  }
})
