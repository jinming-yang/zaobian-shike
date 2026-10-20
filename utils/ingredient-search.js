const { normalizeSearchText } = require('./recipe-search')

// Only genuine ingredient aliases belong here; different cuts and processed foods stay distinct.
const ALIAS_GROUPS = [
  ['番茄', '西红柿'],
  ['土豆', '马铃薯', '洋芋'],
  ['花菜', '菜花', '花椰菜'],
  ['西兰花', '青花菜', '绿花椰菜'],
  ['红薯', '番薯', '地瓜'],
  ['玉米', '玉蜀黍', '苞米'],
  ['小葱', '葱', '青葱', '香葱'],
  ['大蒜', '蒜', '蒜瓣'],
  ['姜', '生姜'],
  ['意大利面', '意粉', '意大利粉'],
  ['猪肉末', '猪肉馅', '猪肉糜'],
  ['牛肉末', '牛肉馅', '牛肉糜']
]

function canonicalIngredientName(name) {
  const value = `${name || ''}`.trim()
  const group = ALIAS_GROUPS.find(aliases => aliases.includes(value))
  return group ? group[0] : value
}

function aliasFields(name) {
  const fields = new Set([name])
  ALIAS_GROUPS.forEach(group => {
    const spelling = group.find(alias => name === alias || (alias.length >= 2 && name.includes(alias)))
    if (spelling) group.forEach(alias => fields.add(name.replace(spelling, alias)))
  })
  return Array.from(fields)
}

function ingredientSearchScore(item, keyword) {
  const query = normalizeSearchText(keyword)
  if (!query) return -1
  const normalize = value => normalizeSearchText(canonicalIngredientName(value))
  const normalizedQuery = normalize(keyword)
  const name = normalize(item.name)
  if (name === normalizedQuery) return 0
  if (name.startsWith(normalizedQuery)) return 1
  if (name.includes(normalizedQuery)) return 2
  const fields = aliasFields(item.name).concat(item.searchText || '')
  if (fields.some(field => normalizeSearchText(field).includes(query))) return 3
  const rawQuery = `${keyword || ''}`.trim().toLowerCase().replace(/\s/g, '')
  if (rawQuery && fields.some(field => `${field}`.toLowerCase().replace(/\s/g, '').includes(rawQuery))) return 3
  return -1
}

module.exports = { canonicalIngredientName, ingredientSearchScore }
