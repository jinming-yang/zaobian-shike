const { foods, aliases } = require('../data/nutrition-foods')
const KEYS = ['energy', 'protein', 'fat', 'carbs', 'fiber']
const round = n => Math.round(n * 10) / 10

function ingredientWeight(item) {
  const amount = Number(item.amount)
  if (!Number.isFinite(amount) || amount < 0) return null
  if (['g','ml'].includes(item.unit)) return amount
  const name = item.name.replace(/（.*?）/g,'')
  const specific = {鸡蛋:50,皮蛋:60,番茄:150,土豆:180,洋葱:150,红洋葱:150,青椒:80,彩椒:150,胡萝卜:120,黄瓜:200,柠檬:100,青柠:60,小葱:10,葱:10,鸡中翅:35,广式腊肠:100,大蒜:5,蒜:5,娃娃菜:150,三文鱼排:150}
  return specific[name] ? amount * specific[name] : null
}

function estimateNutrition(recipe, servings = 1) {
  const total = Object.fromEntries(KEYS.map(key => [key,0]))
  const missing = [], assumptions = [], sourceRows = [], missingKeys = new Set()
  recipe.ingredients.main.concat(recipe.ingredients.seasoning).forEach(item => {
    const name = item.name.replace(/（.*?）/g,'')
    const food = foods[aliases[name] || name]
    const weight = ingredientWeight(item)
    if (!food || weight === null) { missing.push(item.name); return }
    const density = food.basis === item.unit || !['g','ml'].includes(item.unit) ? 1 : (food.basis === 'ml' ? 1 / (food.density || 1) : (food.density || 1))
    const ratio = weight * density / 100
    KEYS.forEach(key => {
      if (food[key] === null || food[key] === undefined) missingKeys.add(key)
      else total[key] += food[key] * ratio
    })
    if (!['g','ml'].includes(item.unit)) assumptions.push(`${item.name}约${round(weight / item.amount)}克/${item.unit}`)
    if (food.basis !== item.unit && ['g','ml'].includes(item.unit)) assumptions.push(`${item.name}按密度${food.density || 1}克/毫升换算`)
    sourceRows.push({name:item.name,id:food.id,url:food.source,page:food.page || ''})
  })
  const multiplier = Math.max(1, Number(servings)||1) / Math.max(1,recipe.baseServings||1)
  const values = Object.fromEntries(KEYS.map(key => [key, missingKeys.has(key) ? null : round(total[key]*multiplier)]))
  return {...values, servings:Math.max(1, Number(servings)||1),partial:missing.length>0,available:sourceRows.length>0,missing,assumptions,sourceRows,
    note:missing.length ? `已匹配食材小计；尚未计入：${missing.join('、')}` : '按配方与平均食物成分估算，实际品牌、用量、烹饪损耗及剩余油会改变数值。'}
}

module.exports = { estimateNutrition, ingredientWeight, KEYS }
