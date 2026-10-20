const KEYS = {
  favorites: 'zaobian_favorites_v1',
  settings: 'zaobian_settings_v1',
  sessions: 'zaobian_sessions_v1',
  history: 'zaobian_history_v1',
  shoppingList: 'zaobian_shopping_list_v1'
}

const DEFAULT_SETTINGS = {
  allergens: [],
  allergyMode: 'off',
  tags: [],
  calorieServings: 1,
  showCalories: true,
  keepScreenOn: true,
  timerSound: true,
  vibration: true,
  resumePrompt: true
}

function read(key, fallback) {
  try {
    const value = wx.getStorageSync(key)
    return value === '' || value === undefined || value === null ? fallback : value
  } catch (error) {
    return fallback
  }
}

function write(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    wx.showToast({ title: '本地数据保存失败', icon: 'none' })
  }
  return value
}

function getFavorites() {
  return read(KEYS.favorites, [])
}

function isFavorite(recipeId) {
  return getFavorites().includes(recipeId)
}

function toggleFavorite(recipeId) {
  const favorites = getFavorites()
  const added = !favorites.includes(recipeId)
  const next = added ? favorites.concat(recipeId) : favorites.filter(id => id !== recipeId)
  write(KEYS.favorites, next)
  return added
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) }
}

function saveSettings(patch) {
  return write(KEYS.settings, { ...getSettings(), ...patch })
}

function getSessions() {
  return read(KEYS.sessions, {})
}

function getSession(recipeId) {
  return getSessions()[recipeId] || null
}

function getActiveSessions() {
  return Object.values(getSessions()).sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
}

function saveSession(recipeId, patch) {
  const sessions = getSessions()
  const previous = sessions[recipeId] || {}
  const now = Date.now()
  sessions[recipeId] = {
    recipeId,
    currentStep: 0,
    completedSteps: 0,
    totalSteps: patch.totalSteps || previous.totalSteps || 1,
    servings: patch.servings || previous.servings || 1,
    startedAt: previous.startedAt || now,
    activeSeconds: previous.activeSeconds || 0,
    ...previous,
    ...patch,
    updatedAt: now
  }
  write(KEYS.sessions, sessions)
  return sessions[recipeId]
}

function addActiveSeconds(recipeId, seconds) {
  const session = getSession(recipeId)
  if (!session || seconds <= 0) return session
  return saveSession(recipeId, { activeSeconds: Number(session.activeSeconds || 0) + Math.round(seconds) })
}

function restartSession(recipeId) {
  const sessions = getSessions()
  delete sessions[recipeId]
  write(KEYS.sessions, sessions)
}

function completeSession(recipeId, patch = {}) {
  const sessions = getSessions()
  const current = sessions[recipeId] || { recipeId, startedAt: Date.now(), activeSeconds: 0 }
  const completedAt = Date.now()
  const record = {
    ...current,
    ...patch,
    id: `${recipeId}-${completedAt}`,
    recipeId,
    completed: true,
    completedSteps: patch.totalSteps || current.totalSteps || 1,
    currentStep: Math.max(0, (patch.totalSteps || current.totalSteps || 1) - 1),
    progress: 100,
    completedAt,
    updatedAt: completedAt,
    activeSeconds: Math.max(60, Number(patch.activeSeconds !== undefined ? patch.activeSeconds : (current.activeSeconds || 0)))
  }
  const recipe = require('../data/recipes').getRecipeById(recipeId)
  if (recipe) record.nutritionPerServing = require('./nutrition').estimateNutrition(recipe,1)
  delete sessions[recipeId]
  write(KEYS.sessions, sessions)
  write(KEYS.history, [record].concat(read(KEYS.history, [])).slice(0, 200))
  return record
}

function getCookingHistory() {
  const incomplete = Object.values(getSessions()).map(session => ({
    ...session,
    completed: false,
    id: `active-${session.recipeId}`,
    progress: Math.round((Number(session.completedSteps || 0) / Math.max(1, Number(session.totalSteps || 1))) * 100)
  }))
  return incomplete.concat(read(KEYS.history, [])).sort((a, b) => Number(b.updatedAt || b.completedAt) - Number(a.updatedAt || a.completedAt))
}

function getCompletedHistory() {
  return read(KEYS.history, [])
}

function deleteCookingRecord(recordId) {
  if (`${recordId}`.startsWith('active-')) {
    restartSession(`${recordId}`.slice(7))
    return true
  }
  const history = read(KEYS.history, [])
  const next = history.filter(record => record.id !== recordId)
  if (next.length === history.length) return false
  write(KEYS.history, next)
  return true
}

function getShoppingList() {
  return read(KEYS.shoppingList, [])
}

function addIngredientToShoppingList(item, recipeName, amount = item.amount) {
  const list = getShoppingList().slice()
  const id = `${item.name}__${item.unit}`
  const index = list.findIndex(entry => entry.id === id)
  const addedAmount = Number(amount || 0)
  if (index >= 0) {
    const previous = list[index]
    list[index] = {
      ...previous,
      amount: Number(previous.amount || 0) + addedAmount,
      purchased: false,
      recipeNames: Array.from(new Set((previous.recipeNames || []).concat(recipeName)))
    }
  } else {
    list.push({
      id,
      name: item.name,
      unit: item.unit,
      amount: addedAmount,
      image: item.image,
      purchased: false,
      recipeNames: [recipeName],
      createdAt: Date.now()
    })
  }
  return write(KEYS.shoppingList, list)
}

function addRecipeToShoppingList(recipe, servings, includeSeasoning = true) {
  const ratio = Number(servings || recipe.baseServings) / Number(recipe.baseServings || 1)
  const ingredients = includeSeasoning ? recipe.ingredients.main.concat(recipe.ingredients.seasoning) : recipe.ingredients.main
  ingredients.forEach(item => {
    addIngredientToShoppingList(item, recipe.name, Number(item.amount || 0) * ratio)
  })
  return getShoppingList()
}

function toggleShoppingPurchased(id) {
  return write(KEYS.shoppingList, getShoppingList().map(item => item.id === id ? { ...item, purchased: !item.purchased } : item))
}

function markAllShoppingPurchased() {
  return write(KEYS.shoppingList, getShoppingList().map(item => ({ ...item, purchased: true })))
}

function deleteShoppingItem(id) {
  return write(KEYS.shoppingList, getShoppingList().filter(item => item.id !== id))
}

function clearShoppingList() {
  return write(KEYS.shoppingList, [])
}

module.exports = {
  DEFAULT_SETTINGS,
  getFavorites,
  isFavorite,
  toggleFavorite,
  getSettings,
  saveSettings,
  getSession,
  getActiveSessions,
  saveSession,
  addActiveSeconds,
  restartSession,
  completeSession,
  getCookingHistory,
  getCompletedHistory,
  deleteCookingRecord,
  getShoppingList,
  addIngredientToShoppingList,
  addRecipeToShoppingList,
  toggleShoppingPurchased,
  markAllShoppingPurchased,
  deleteShoppingItem,
  clearShoppingList
}
