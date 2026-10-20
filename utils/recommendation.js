function preferenceForRecipe(recipe, tags) {
  if(!recipe || typeof recipe!=='object')return {recommendationScore:0,recommendationReason:''}
  tags=Array.isArray(tags)?tags:[]
  const categories=Array.isArray(recipe.categories)?recipe.categories:[]
  const main=Array.isArray(recipe.ingredients && recipe.ingredients.main)?recipe.ingredients.main:[]
  const seasoning=Array.isArray(recipe.ingredients && recipe.ingredients.seasoning)?recipe.ingredients.seasoning:[]
  let score=0
  const reasons=[]
  if(tags.includes('减脂') && categories.includes('减脂餐')) {score+=3;reasons.push('减脂餐分类 · 留意份量')}
  if(tags.includes('增重') && recipe.caloriesPerServing >= 450) {score+=3;reasons.push('能量充足 · 一人份约'+recipe.caloriesPerServing+'千卡')}
  // This tag only suggests gentle cooking styles, not age-specific infant suitability.
  if(tags.includes('宝宝成长') && recipe.difficulty<=2 && /蒸|汤|炖/.test(recipe.name) && !/辣|咖喱|剁椒|鱼头/.test(recipe.name)) {score+=2;reasons.push('蒸煮类参考 · 按年龄调整盐量与质地')}
  if(tags.includes('厨房新手') && recipe.difficulty<=2 && recipe.cookMinutes<=25) {score+=3;reasons.push('难度较低 · 新手易上手')}
  if(tags.includes('快手料理') && recipe.cookMinutes<=15) {score+=3;reasons.push('快手料理 · 约'+recipe.cookMinutes+'分钟')}
  if(tags.includes('一人食') && recipe.ingredientComplexity<=2 && main.length>0 && main.length<=3) {score+=2;reasons.push('食材较少 · 可调整为1人份')}
  if(tags.includes('家常口味') && categories.includes('家常菜')) {score+=2;reasons.push('家常菜分类 · 日常餐桌参考')}
  const items=main.concat(seasoning)
  const names=items.filter(item=>item && typeof item.name==='string' && item.name.trim()).map(item=>item.name)
  const ingredients=names.join('、')
  const animalIngredients=/肉|鸡(?!蛋)|鸭(?!蛋)|鱼|虾|蟹|贝|排骨|骨汤|牛腩|牛排|腊肠|香肠|培根|火腿|高汤|蚝油|明胶|猪油/
  if(tags.includes('素食偏好') && main.length>0 && names.length===items.length && !animalIngredients.test(ingredients)) {score+=3;reasons.push('无肉鱼虾配方 · 可能含蛋奶，请核对配料')}
  return {recommendationScore:score,recommendationReason:reasons.join('；')}
}
module.exports={preferenceForRecipe}
