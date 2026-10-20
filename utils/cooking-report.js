const { getRecipeById } = require('../data/recipes')
const { estimateNutrition } = require('./nutrition')
function dayKey(timestamp) {
  const d=new Date(timestamp)
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}
function cookingStreak(records, now=Date.now()) {
  const days=new Set(records.map(r=>dayKey(r.completedAt)))
  const d=new Date(now);d.setHours(0,0,0,0)
  if(!days.has(dayKey(d.getTime())))d.setDate(d.getDate()-1)
  let streak=0
  while(days.has(dayKey(d.getTime()))){streak++;d.setDate(d.getDate()-1)}
  return streak
}
function summarizeNutrition(records) {
  const total={protein:0,fat:0,carbs:0,fiber:0}
  const counts={protein:0,fat:0,carbs:0,fiber:0}
  let partialCount=0
  records.forEach(record=>{
    const recipe=getRecipeById(record.recipeId)
    if(!recipe)return
    const n=record.nutritionPerServing||estimateNutrition(recipe,1)
    if(n.partial)partialCount++
    if(!n.available)return
    Object.keys(total).forEach(k=>{if(n[k]!==null && Number.isFinite(n[k])){total[k]+=n[k];counts[k]++}})
  })
  return {totals:Object.fromEntries(Object.entries(total).map(([k,v])=>[k,counts[k] ? Math.round(v*10)/10 : null])),counts,partialCount}
}
function buildNutrientTrend(days, metric = 'protein') {
  const key = ['protein', 'fat', 'carbs', 'fiber'].includes(metric) ? metric : 'protein'
  const values = days.map(day => Number.isFinite(day[key]) ? Math.max(0, day[key]) : null)
  const max = Math.max(0, ...values.map(value => value === null ? 0 : value))
  return days.map((day, index) => ({
    ...day,
    value: values[index],
    height: max > 0 && values[index] !== null ? Math.round(values[index] / max * 100) : 0
  }))
}
function reportExtras(records, since, now=Date.now()) {
  const matched=records.filter(r=>r.completedAt>=since && r.completedAt<=now)
  const categories={}
  matched.forEach(r=>{
    const recipe=getRecipeById(r.recipeId)
    if(!recipe)return
    const cuisine=recipe.categories.find(c=>['川菜','粤菜','江浙菜','日式料理','韩式料理','东南亚菜','印度菜','墨西哥菜','简便西餐'].includes(c))||'家常菜'
    categories[cuisine]=(categories[cuisine]||0)+1
  })
  const favoriteCuisine=Object.keys(categories).sort((a,b)=>categories[b]-categories[a])[0]
  const days=[]
  const today=new Date(now);today.setHours(0,0,0,0)
  for(let i=6;i>=0;i--){
    const d=new Date(today);d.setDate(d.getDate()-i)
    const daily=records.filter(r=>dayKey(r.completedAt)===dayKey(d.getTime()) && r.completedAt<=now)
    const n=summarizeNutrition(daily)
    days.push({key:dayKey(d.getTime()),label:`${d.getMonth()+1}/${d.getDate()}`,count:daily.length,protein:n.totals.protein,fat:n.totals.fat,carbs:n.totals.carbs,fiber:n.totals.fiber})
  }
  const activeDays=new Set(matched.map(r=>dayKey(r.completedAt))).size
  return {...summarizeNutrition(matched),streak:cookingStreak(records,now),favoriteCuisine:favoriteCuisine||'暂无记录',activeDays,
    review:matched.length ? `本周期做饭${activeDays}天，完成${matched.length}道菜；常做${favoriteCuisine}。` : '完成一道菜后，开始记录你的做饭习惯。',
    trend:buildNutrientTrend(days)}
}
module.exports={dayKey,cookingStreak,summarizeNutrition,reportExtras,buildNutrientTrend}
