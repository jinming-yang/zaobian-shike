const CALORIE_DATA = {
  'tomato-egg': [210, '按当前食材用量估算'],
  'potato-pepper': [180, '按当前食材用量估算'],
  'cola-wings': [350, '按当前食材用量估算'],
  'french-omelette': [277, 'Good Food 原菜谱营养信息'],
  bolognese: [650, '按当前食材用量估算'],
  'salmon-veg': [450, '按当前食材用量估算'],
  'kung-pao-chicken': [440, 'The Woks of Life 原菜谱营养信息'],
  'mapo-tofu': [335, 'The Woks of Life 原菜谱营养信息'],
  'fish-fragrant-pork': [489, 'The Woks of Life 原菜谱营养信息'],
  'red-braised-pork': [443, 'The Woks of Life 原菜谱营养信息'],
  'sweet-sour-pork': [458, 'The Woks of Life 原菜谱营养信息'],
  'egg-fried-rice': [308, 'The Woks of Life 原菜谱营养信息'],
  'scallion-oil-noodles': [404, 'The Woks of Life 原菜谱营养信息'],
  'cantonese-steamed-fish': [239, 'The Woks of Life 原菜谱营养信息'],
  'hot-sour-soup': [189, 'The Woks of Life 原菜谱营养信息'],
  'garlic-bok-choy': [127, 'The Woks of Life 原菜谱营养信息'],
  'beef-vegetable-stir-fry': [377, 'The Woks of Life 原菜谱营养信息'],
  'shrimp-eggs': [346, 'The Woks of Life 原菜谱营养信息'],
  'mushroom-soup': [309, 'Good Food 原菜谱营养信息'],
  'margherita-pizza': [431, 'Good Food 原菜谱营养信息'],
  'chicken-caesar': [633, 'Good Food 原菜谱营养信息'],
  'french-crepes': [183, 'Good Food 每张61千卡，按每人3张换算'],
  shakshuka: [340, 'Good Food 原菜谱营养信息'],
  'thai-green-curry': [275, 'Good Food 原菜谱营养信息'],
  'teriyaki-chicken': [243, 'Good Food 原菜谱营养信息'],
  'butter-chicken': [358, 'Good Food 原菜谱营养信息'],
  'beef-stew': [483, 'Good Food 原菜谱营养信息'],
  'garlic-prawn-linguine': [547, 'Good Food 原菜谱营养信息'],
  'vegetable-curry': [259, 'Good Food 原菜谱营养信息'],
  'aglio-e-olio': [523, 'Good Food 原菜谱营养信息']
}

const ALLERGEN_RULES = [
  ['花生', ['花生']],
  ['坚果', ['腰果']],
  ['乳制品', ['牛奶', '酸奶', '黄油', '奶油', '奶酪', '帕玛森', '马苏里拉']],
  ['海鲜', ['三文鱼', '鱼柳', '鱼露', '虾', '鳀鱼', '鱼头', '桂鱼', '金枪鱼', '扇贝', '蚝油']],
  ['鸡蛋', ['鸡蛋', '皮蛋', '蛋黄酱']],
  ['大豆', ['豆腐', '豆瓣酱', '生抽', '老抽', '酱油']],
  ['麸质', ['意大利面', '扁意面', '鲜面条', '面粉', '恰巴塔', '面包', '吐司', '汉堡胚', '通心粉', '千层面片']]
]

function detectAllergens(recipe) {
  const ingredientText = recipe.ingredients.main
    .concat(recipe.ingredients.seasoning)
    .map(item => item.name)
    .join('')
  return ALLERGEN_RULES
    .filter(([, keywords]) => keywords.some(keyword => ingredientText.includes(keyword)))
    .map(([name]) => name)
}

function estimateCalories(recipe) {
  const density = name => {
    if (/油|黄油/.test(name)) return 880
    if (/蛋黄酱/.test(name)) return 680
    if (/奶酪|帕玛森/.test(name)) return 390
    if (/面粉|燕麦|意大利面|通心粉|面片|米粉|鲜面条|大米/.test(name)) return 350
    if (/吐司|汉堡胚|墨西哥饼|春卷皮/.test(name)) return 270
    if (/培根|五花肉/.test(name)) return 430
    if (/牛肉末|牛肉|牛腩|羊肉|猪肉|排骨|里脊/.test(name)) return 230
    if (/鸡肉|鸡腿|鸡胸|整鸡/.test(name)) return 180
    if (/鱼|虾|金枪鱼/.test(name)) return 120
    if (/鸡蛋/.test(name)) return 145
    if (/熟米饭/.test(name)) return 130
    if (/鹰嘴豆|红腰豆|红扁豆/.test(name)) return 125
    if (/牛奶|酸奶/.test(name)) return 65
    if (/椰奶/.test(name)) return 180
    if (/糖|蜂蜜/.test(name)) return 400
    if (/土豆|莲藕|玉米|南瓜/.test(name)) return 80
    if (/牛油果/.test(name)) return 160
    if (/豆腐|味噌/.test(name)) return 85
    if (/番茄泥/.test(name)) return 35
    if (/蔬菜|菜|瓜|茄|椒|番茄|洋葱|萝卜|蘑菇|海带|紫菜|豆芽|菠菜|韭菜|罗勒/.test(name)) return 30
    return 15
  }
  const unitWeight = (item) => {
    if (item.unit === 'g' || item.unit === 'ml') return Number(item.amount)
    const weights = { 个: 150, 根: 140, 只: 1500, 张: 20, 片: 25, 罐: 160, 块: 120, 瓣: 5, 份: 100 }
    return Number(item.amount) * (weights[item.unit] || 10)
  }
  const items = recipe.ingredients.main.concat(recipe.ingredients.seasoning)
  const total = items.reduce((sum, item) => sum + density(item.name) * unitWeight(item) / 100, 0)
  return Math.max(50, Math.round(total / Math.max(1, Number(recipe.baseServings || 1))))
}

function getRecipeMeta(id, recipe) {
  const fallback = recipe ? [estimateCalories(recipe), '依据常见食材热量与当前用量估算'] : [null, '暂无可靠估算']
  const [caloriesPerServing, calorieSource] = CALORIE_DATA[id] || fallback
  return { caloriesPerServing, calorieSource }
}

module.exports = {
  ALLERGEN_OPTIONS: ALLERGEN_RULES.map(([name]) => name),
  detectAllergens,
  getRecipeMeta
}
