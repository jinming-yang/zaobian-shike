function roundAmount(value, unit) {
  const countUnits = ['个', '只', '块', '根', '瓣', '片', '张', '罐']
  if (countUnits.includes(unit)) return Math.round(value * 2) / 2
  if (value >= 100) return Math.round(value / 5) * 5
  if (value >= 10) return Math.round(value)
  return Math.round(value * 10) / 10
}

function spoonText(value, label) {
  if (value <= 0.15) return `少于1/4${label}`
  if (value <= 0.4) return `约1/3${label}`
  if (value <= 0.65) return `约1/2${label}`
  if (value <= 0.9) return `约3/4${label}`
  const rounded = Math.round(value * 2) / 2
  return `约${rounded}${label}`
}

function formatIngredientAmount(value, unit, name = '') {
  const parts = formatIngredientAmountParts(value, unit, name)
  return parts.hint ? `${parts.primary}（${parts.hint}）` : parts.primary
}

function formatIngredientAmountParts(value, unit, name = '') {
  const rounded = roundAmount(Number(value || 0), unit)
  const base = `${rounded}${unit}`
  if (unit === 'g' && /姜/.test(name)) {
    if (value <= 8) return { primary: base, hint: '约半小块或2片' }
    if (value <= 20) return { primary: base, hint: '约1小块或3–4片' }
    return { primary: base, hint: '约2小块或6–8片' }
  }
  if (unit === 'g' && /盐/.test(name)) return { primary: base, hint: `${spoonText(value / 6, '茶匙')} / ${spoonText(value / 18, '汤匙')}` }
  if (unit === 'g' && /糖|蜂蜜/.test(name)) return { primary: base, hint: spoonText(value / 4, '茶匙') }
  if (unit === 'g' && /黄油/.test(name)) return { primary: base, hint: spoonText(value / 14, '汤匙') }
  if (unit === 'ml' && /油|生抽|老抽|酱油|醋|料酒|绍兴酒|鱼露|香油/.test(name)) return { primary: base, hint: spoonText(value / 15, '汤匙') }
  return { primary: base, hint: '' }
}

module.exports = { formatIngredientAmount, formatIngredientAmountParts }
