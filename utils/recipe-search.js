const SYNONYMS = [
  ['西红柿', '番茄'],
  ['鸡蛋', '蛋'],
  ['马铃薯', '土豆'],
  ['洋芋', '土豆'],
  ['花椰菜', '花菜'],
  ['菜花', '花菜'],
  ['番薯', '红薯'],
  ['地瓜', '红薯'],
  ['玉蜀黍', '玉米'],
  ['意大利粉', '意大利面'],
  ['意粉', '意大利面'],
  ['肉馅', '肉末'],
  ['肉糜', '肉末'],
  ['大虾', '虾'],
  ['明虾', '虾'],
  ['青葱', '小葱']
]

function normalizeSearchText(value) {
  let result = `${value || ''}`.trim().toLowerCase()
  SYNONYMS.forEach(([from, to]) => {
    result = result.split(from).join(to)
  })
  return result.replace(/[\s·•，。！？、,.;；:：'"“”‘’()（）\-_/\\]/g, '')
}

function isSubsequence(needle, haystack) {
  if (!needle) return true
  let index = 0
  for (const character of haystack) {
    if (character === needle[index]) index += 1
    if (index === needle.length) return true
  }
  return false
}

function buildRecipeSearchFields(recipe) {
  const ingredients = recipe.ingredients
    ? recipe.ingredients.main.concat(recipe.ingredients.seasoning).map(item => item.name)
    : []
  const aliases = recipe.aliases || []
  return [
    recipe.name,
    recipe.subtitle,
    ...(recipe.categories || []),
    ...ingredients,
    ...aliases
  ].map(normalizeSearchText).filter(Boolean)
}

function recipeMatchesKeyword(recipe, keyword) {
  const queries = `${keyword || ''}`.split(/[\s,，、;；+]+/).map(normalizeSearchText).filter(Boolean)
  if (!queries.length) return true
  const fields = buildRecipeSearchFields(recipe)
  return queries.every(query => fields.some(field => field.includes(query) || (query.length >= 2 && isSubsequence(query, field))))
}

module.exports = {
  normalizeSearchText,
  recipeMatchesKeyword
}
