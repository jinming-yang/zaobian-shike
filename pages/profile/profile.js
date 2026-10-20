const { getRecipeById } = require('../../data/recipes')
const { reportExtras, buildNutrientTrend } = require('../../utils/cooking-report')
const {
  getFavorites,
  getSettings,
  getCookingHistory,
  getCompletedHistory,
  deleteCookingRecord,
  restartSession
} = require('../../utils/user-store')

const NUTRIENT_OPTIONS = [
  { key: 'protein', label: '蛋白质' },
  { key: 'fat', label: '脂肪' },
  { key: 'carbs', label: '碳水' },
  { key: 'fiber', label: '膳食纤维' }
]

function startOfDay(timestamp = Date.now()) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function startOfWeek(timestamp = Date.now()) {
  const date = new Date(timestamp)
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const pad = value => `${value}`.padStart(2, '0')
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

Page({
  data: {
    reportTab: 'daily',
    nutrientOptions: NUTRIENT_OPTIONS,
    trendMetric: 'protein',
    trendLabel: '蛋白质',
    nutritionTrend: [],
    report: { count: 0, minutes: 0, dishes: [] },
    weeklyCount: 0,
    favorites: [],
    history: [],
    tags: [],
    tagSummary: '',
    allergySummary: ''
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.refresh()
  },

  refresh() {
    const settings = getSettings()
    const favorites = getFavorites().map(getRecipeById).filter(recipe => {
      if (!recipe) return false
      return settings.allergyMode !== 'hide' || !recipe.allergens.some(item => settings.allergens.includes(item))
    })
    const history = getCookingHistory().map(record => {
      const recipe = getRecipeById(record.recipeId)
      return recipe ? {
        ...record,
        recipe,
        dateText: formatDate(record.completedAt || record.updatedAt),
        progressText: record.completed ? '已完成' : `完成 ${record.progress}%`
      } : null
    }).filter(Boolean)
    const completed = getCompletedHistory()
    const dailyReport = this.makeReport(completed, startOfDay())
    const weeklyReport = this.makeReport(completed, startOfWeek())
    this.dailyReport = dailyReport
    this.weeklyReport = weeklyReport
    const report = this.data.reportTab === 'daily' ? dailyReport : weeklyReport
    this.setData({
      report,
      nutritionTrend: buildNutrientTrend(report.trend, this.data.trendMetric),
      weeklyCount: weeklyReport.count,
      favorites,
      history,
      tags: settings.tags,
      tagSummary: settings.tags.join(' · '),
      allergySummary: settings.allergens.length
        ? settings.allergens.join('、') + (settings.allergyMode === 'off' ? '' : ` · ${settings.allergyMode === 'hide' ? '自动隐藏' : '标注警示'}`)
        : ''
    })
    this.loadProfileImages(favorites, history, dailyReport, weeklyReport)
  },

  loadProfileImages(favorites, history, dailyReport, weeklyReport) {
    const app = getApp()
    Promise.all([
      app.loadRecipeImages(favorites),
      app.loadRecipeImages(history.map(item => item.recipe)),
      app.loadRecipeImages(dailyReport.dishes),
      app.loadRecipeImages(weeklyReport.dishes)
    ]).then(([favoriteImages, historyRecipes, dailyDishes, weeklyDishes]) => {
      this.dailyReport = { ...dailyReport, dishes: dailyDishes }
      this.weeklyReport = { ...weeklyReport, dishes: weeklyDishes }
      const report = this.data.reportTab === 'daily' ? this.dailyReport : this.weeklyReport
      this.setData({
        favorites: favoriteImages,
        history: history.map((item, index) => ({ ...item, recipe: historyRecipes[index] })),
        report,
        nutritionTrend: buildNutrientTrend(report.trend, this.data.trendMetric)
      })
    })
  },

  makeReport(records, since) {
    const matched = records.filter(record => Number(record.completedAt) >= since)
    return {
      ...reportExtras(records, since),
      count: matched.length,
      minutes: Math.round(matched.reduce((sum, record) => sum + Number(record.activeSeconds || 0), 0) / 60),
      dishes: matched.map(record => {
        const recipe = getRecipeById(record.recipeId)
        return recipe ? { id: record.id, name: recipe.name, image: recipe.image, hdImage: recipe.hdImage, dateText: formatDate(record.completedAt) } : null
      }).filter(Boolean)
    }
  },

  switchReport(event) {
    const reportTab = event.currentTarget.dataset.tab
    const report = reportTab === 'daily' ? this.dailyReport : this.weeklyReport
    this.setData({ reportTab, report, nutritionTrend: buildNutrientTrend(report.trend, this.data.trendMetric) })
  },

  selectNutrient(event) {
    const metric = NUTRIENT_OPTIONS.find(option => option.key === event.currentTarget.dataset.key)
    if (!metric) return
    this.setData({
      trendMetric: metric.key,
      trendLabel: metric.label,
      nutritionTrend: buildNutrientTrend(this.data.report.trend || [], metric.key)
    })
  },

  openSettings() {
    wx.navigateTo({ url: '/pages/settings/settings?section=general' })
  },

  openTags() {
    wx.navigateTo({ url: '/pages/settings/settings?section=tags' })
  },

  openAllergens() {
    wx.navigateTo({ url: '/pages/settings/settings?section=allergens' })
  },

  openFavorite(event) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}` })
  },

  openHistory(event) {
    const record = this.data.history.find(item => item.id === event.currentTarget.dataset.id)
    if (!record) return
    if (record.completed) {
      wx.navigateTo({ url: `/pages/detail/detail?id=${record.recipeId}` })
      return
    }
    wx.showModal({
      title: `继续烹饪${record.recipe.name}？`,
      content: `上次已完成 ${record.progress}%，可以回到第 ${record.currentStep + 1} 步。`,
      cancelText: '从头开始',
      confirmText: '继续',
      success: result => {
        if (result.confirm) {
          wx.navigateTo({ url: `/pages/cook/cook?id=${record.recipeId}&servings=${record.servings || record.recipe.baseServings}&resume=1` })
        } else if (result.cancel) {
          restartSession(record.recipeId)
          wx.navigateTo({ url: `/pages/detail/detail?id=${record.recipeId}` })
        }
      }
    })
  },

  deleteHistory(event) {
    const record = this.data.history.find(item => item.id === event.currentTarget.dataset.id)
    if (!record) return
    wx.showModal({
      title: `删除${record.recipe.name}的记录？`,
      content: record.completed
        ? '删除后，这条记录将不再计入每日和每周报告。'
        : '这道菜的烹饪进度和计时将一并停止并删除。',
      cancelText: '取消',
      confirmText: '删除',
      confirmColor: '#c75534',
      success: result => {
        if (!result.confirm) return
        if (deleteCookingRecord(record.id)) {
          wx.showToast({ title: '已删除', icon: 'none' })
          this.refresh()
        }
      }
    })
  }
})
