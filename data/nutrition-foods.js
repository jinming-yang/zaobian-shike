// Per 100 g edible portion unless basis is ml. Values checked online 2026-10-11.
// ASEANC refers to available carbohydrate; displayed total carbohydrate includes fiber.
const ASEAN = 'https://inmu.mahidol.ac.th/aseanfoods/doc/OnlineASEAN_FCD_V1_2014.pdf'
const rows = [
  ['番茄',23,1,.3,4.6,1.2,'AAD128',42],
  ['鸡蛋',159,13.2,11.1,1.5,0,'AAH12',55],
  ['皮蛋',190,13.2,10.5,10.7,0,'AAH2',55],
  ['西兰花',26,3.4,.1,4.3,2.9,'AAD22',37],
  ['小白菜',18,1.7,.2,3.2,1.7,'AAD23',37],
  ['娃娃菜',16,1.7,.4,2.3,1.7,'AAD25',37],
  ['菜心',20,1.9,.2,3.6,2.1,'AAD56',37],
  ['包菜',25,1.5,.3,5.1,1.9,'AAD26',37],
  ['胡萝卜',35,1.5,.2,8.9,4,'AAD28',37],
  ['黄瓜',21,.8,.1,4.7,1,'AAD45',38],
  ['茄子',32,1.3,.1,6.4,null,'AAD52',38],
  ['豆芽',41,4.3,.2,6.7,2.6,'AAD80',40],
  ['蘑菇',33,4.7,.2,3.2,null,'AAD83',40],
  ['芦笋',21,2.6,.4,3.1,2.8,'AAD4',37],
  ['鸡中翅',223,17.6,17,0,0,'AAF105',47],
  ['嫩豆腐',60,5.5,3.4,1.8,null,'AAC131',36],
  ['熟米饭',129,2.2,.2,30,.6,'AAA63',33],
  ['大米',354,6.8,.7,80.3,.6,'AAA65',33],
  ['通心粉',344,12.1,.6,74.9,4.9,'AAA42',33],
  ['米粉',353,10.5,0,77.7,null,'AAA47',33],
  ['鲜面条',299,12.7,3.3,54.5,null,'AAA53',33],
  ['姜',39,1.2,.8,8.1,2.9,'AAN36',59],
  ['大蒜',51,2.1,.1,10.4,null,'AAN35',59],
  ['洋葱',47,1.6,0,10.9,1.6,'AAN52',59],
  ['牛奶',67,3.3,3.8,4.9,0,'AAJ47',57,'ml'],
  ['酸奶',76,4.8,4.1,5,0,'AAJ35',57],
  ['黄油',760,.7,84.1,0,0,'AAK1',58],
  ['椰奶',184,1.9,19,1.5,.1,'AAK4',58,'ml'],
  ['蛋黄酱',712,1.8,76.7,3.6,0,'AAK9',58],
  ['食用油',817,0,90.8,0,0,'AAK29',58,'ml'],
  ['蜂蜜',285,.2,0,71,0,'AAM9',58],
  ['虾仁',88,20,.9,0,0,'AAG106',52],
  ['金枪鱼罐头',113,26.1,.9,0,0,'AAG241',54]
]
const foods = Object.fromEntries(rows.map(([name,energy,protein,fat,carbs,fiber,id,page,basis]) => [name,{energy,protein,fat,carbs,fiber,id,source:ASEAN,page:page+1,basis:basis||'g'}]))
foods['鸡胸肉'] = {energy:120,protein:22.5,fat:2.6,carbs:0,fiber:0,id:'171077',basis:'g',source:'https://embed.myfooddata.com/nutrition-facts/171077/100g/1'}
foods['牛肉末'] = {energy:247,protein:17.4,fat:19.1,carbs:0,fiber:0,id:'781867',basis:'g',source:'https://tools.myfooddata.com/nutrition-comparison/781867/100g'}
foods['面粉'] = {energy:364,protein:10.3,fat:.98,carbs:76.3,fiber:2.7,id:'168936',basis:'g',source:'https://tools.myfooddata.com/nutrition-comparison/168936/100g/1'}
const aliases = {'冷藏熟米饭':'熟米饭','蒜':'大蒜','姜蓉':'姜','去壳去虾线虾仁':'虾仁','生虾仁':'虾仁','无盐黄油':'黄油','普通面粉':'面粉','红洋葱':'洋葱'}
const extra = [
  ['小葱',32,1.83,.19,7.34,2.6,'170005','https://batchbase.com.au/usda-foods/170005'],
  ['土豆',77,2.05,.09,17.49,2.1,'170026','https://fooddata.the50.store/ingredients/11352-potatoes-flesh-and-skin-raw'],
  ['五花肉',518,9.34,53.01,0,0,'167812','https://whatyoueat.io/foods/167812-pork-belly'],
  ['猪里脊',120,20.65,3.53,0,0,'168312','https://whatyoueat.io/foods/168312-pork-tenderloin'],
  ['去骨鸡腿肉',121,19.66,4.12,0,0,'173627','https://whatyoueat.io/foods/173627-chicken-thigh-dark-meat'],
  ['鸡腿肉',221,16.52,16.61,.25,0,'172385','https://whatyoueat.io/foods/172385-chicken-thigh-meat-and-skin'],
  ['盐',0,0,0,0,0,'173468','https://whatyoueat.io/foods/173468-table-salt'],
  ['白糖',387,0,0,99.98,0,'169655','https://whatyoueat.io/foods/169655-granulated-sugar'],
  ['燕麦片',389,16.89,6.9,66.27,10.6,'169705','https://whatyoueat.io/foods/169705-oats'],
  ['意大利面',371,13.04,1.51,74.67,3.2,'169736','https://whatyoueat.io/foods/169736-enriched-dry-pasta'],
  ['黑胡椒',251,10.39,3.26,63.95,25.3,'170931','https://whatyoueat.io/foods/170931-black-pepper'],
  ['橄榄油',884,0,100,0,0,'171413','https://whatyoueat.io/foods/171413-olive-oil']
]
extra.forEach(([name,energy,protein,fat,carbs,fiber,id,source])=>{foods[name]={energy,protein,fat,carbs,fiber,id,source,basis:'g'}})
foods['橄榄油'].density=.91
Object.assign(aliases,{'葱':'小葱','带皮五花肉':'五花肉','猪肉丝':'猪里脊','扁意面':'意大利面'})
module.exports = { foods, aliases }
