const { canonicalIngredientName } = require('../utils/ingredient-search')

const NAME_ALIASES = {
  '小葱': '葱',
  '大蒜': '蒜',
  '扁意面': '意大利面',
  '去壳去虾线虾仁': '虾仁',
  '生虾仁': '虾仁',
  '猪肉丝': '猪里脊',
  '青椒': '彩椒',
  '青红椒': '彩椒',
  '红椒': '彩椒'
}

function normalizeName(name) {
  const value = canonicalIngredientName(name)
  return NAME_ALIASES[value] || value
}

function isOptionalIngredient(ingredient) {
  return ingredient.name.includes('可选')
}

function buildIngredientLibrary(recipes) {
  const items = new Map()
  recipes.forEach(recipe => {
    recipe.ingredients.main
      .filter(ingredient => !isOptionalIngredient(ingredient))
      .forEach(ingredient => {
        const key = `${ingredient.name}__${ingredient.unit}`
        if (!items.has(key)) {
          items.set(key, {
            key,
            name: ingredient.name,
            unit: ingredient.unit,
            defaultAmount: defaultAmountFor(ingredient),
            amountStep: amountStepFor(ingredient),
            image: ingredient.image,
            searchText: `${ingredient.name}${normalizeName(ingredient.name)}`.toLowerCase()
          })
        }
      })
  })
  return Array.from(items.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
}

function amountStepFor(ingredient) {
  const amount = Number(ingredient.amount || 0)
  if (ingredient.unit === 'g') return amount <= 10 ? 5 : amount <= 30 ? 10 : 50
  if (ingredient.unit === 'ml') return amount <= 20 ? 10 : 50
  return 1
}

function defaultAmountFor(ingredient) {
  return amountStepFor(ingredient)
}

function formatAmount(value) {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`
}

function selectedAmountFor(selectedIngredients, required) {
  const normalizedRequired = normalizeName(required.name)
  return selectedIngredients
    .filter(item => normalizeName(item.name) === normalizedRequired && item.unit === required.unit)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
}

function evaluateRecipe(recipe, selectedIngredients) {
  const requiredIngredients = recipe.ingredients.main.filter(ingredient => !isOptionalIngredient(ingredient))
  const selectedNames = new Set(selectedIngredients.map(item => normalizeName(item.name)))
  const missing = []
  let satisfiedCount = 0
  let matchedCount = 0

  requiredIngredients.forEach(required => {
    const available = selectedAmountFor(selectedIngredients, required)
    const isPresent = selectedNames.has(normalizeName(required.name))
    if (isPresent) matchedCount += 1
    if (available >= Number(required.amount)) {
      satisfiedCount += 1
      return
    }
    missing.push({
      name: required.name,
      amount: Math.max(0, Number(required.amount) - available),
      unit: required.unit
    })
  })

  const requirementCount = requiredIngredients.length
  const canCook = missing.length === 0
  const coverage = requirementCount ? matchedCount / requirementCount : 0
  return {
    ...recipe,
    canCook,
    missing,
    missingText: missing.map(item => `${item.name} ${formatAmount(item.amount)}${item.unit}`).join('、'),
    coverage,
    matchedCount,
    satisfiedCount,
    requirementCount
  }
}

function recommendRecipes(recipes, selectedIngredients, targetCount = 6) {
  if (!selectedIngredients.length) return []
  const evaluated = recipes.map(recipe => evaluateRecipe(recipe, selectedIngredients))
  return evaluated
    .filter(recipe => recipe.matchedCount > 0)
    .sort((a, b) => {
      return b.matchedCount - a.matchedCount ||
        a.missing.length - b.missing.length ||
        b.satisfiedCount - a.satisfiedCount ||
        b.coverage - a.coverage ||
        a.cookMinutes - b.cookMinutes ||
        a.name.localeCompare(b.name, 'zh-CN')
    })
    .slice(0, targetCount)
}

module.exports = {
  buildIngredientLibrary,
  evaluateRecipe,
  recommendRecipes,
  normalizeName
}
