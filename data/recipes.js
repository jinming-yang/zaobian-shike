const { getRecipeMeta, detectAllergens } = require('./recipe-meta')
const { getStepImagePath } = require('../utils/step-images')
const { decorateIngredient } = require('./ingredient-guide')

const I = '/assets/images/ingredients/'
const D = '/assets/images/dishes/'
const S = '/assets/images/steps/'

const recipes = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    subtitle: '酸甜柔嫩的经典家常菜',
    image: `${D}tomato-egg.jpg`,
    categories: ['家常菜', '快手菜'],
    ingredientComplexity: 1,
    difficulty: 1,
    cookMinutes: 10,
    baseServings: 2,
    sourceName: 'The Woks of Life - Stir-fried Tomato and Egg',
    sourceUrl: 'https://thewoksoflife.com/stir-fried-tomato-and-egg/',
    safetyNote: '鸡蛋应炒至凝固；砧板和刀具在接触生蛋液后及时清洗。',
    ingredients: {
      main: [
        { name: '番茄', amount: 2, unit: '个', image: `${I}tomato.jpg` },
        { name: '鸡蛋', amount: 3, unit: '个', image: `${I}egg.jpg` },
        { name: '小葱', amount: 1, unit: '根', image: `${I}scallion.jpg` }
      ],
      seasoning: [
        { name: '食用油', amount: 20, unit: 'ml', image: `${I}oil.jpg` },
        { name: '盐', amount: 2, unit: 'g', image: `${I}salt.jpg` },
        { name: '白糖（可选）', amount: 3, unit: 'g', image: `${I}sugar.jpg` }
      ]
    },
    steps: [
      { title: '打散鸡蛋', text: '鸡蛋打入碗中，加一小撮盐，充分搅散至蛋清和蛋黄混合均匀。', image: `${S}fold-omelette.jpg`, timerSeconds: 0 },
      { title: '热锅放油', text: '中火把锅烧热，加入约一半食用油，转动锅身让油铺开。', image: `${S}add-oil.jpg`, timerSeconds: 0 },
      { title: '炒熟鸡蛋', text: '倒入蛋液，边缘凝固后从外向内轻推，刚刚凝固时盛出，避免久炒变老。', image: `${S}fold-omelette.jpg`, timerSeconds: 60 },
      { title: '炒出番茄汁', text: '补入余油，放入番茄块和少许盐，中火翻炒至番茄明显出汁。', image: `${S}add-tomato.jpg`, timerSeconds: 180 },
      { title: '合炒完成', text: '鸡蛋倒回锅中，按口味加少量糖，快速翻匀并撒上葱花后关火。', image: `${S}add-tomato.jpg`, timerSeconds: 60 }
    ]
  },
  {
    id: 'potato-pepper',
    name: '青椒土豆丝',
    subtitle: '爽脆清香的快手素菜',
    image: `${D}potato-pepper.jpg`,
    categories: ['家常菜', '快手菜'],
    ingredientComplexity: 2,
    difficulty: 2,
    cookMinutes: 8,
    baseServings: 2,
    sourceName: 'The Woks of Life - Sichuan Stir-fried Potatoes',
    sourceUrl: 'https://thewoksoflife.com/sichuan-stir-fried-potatoes/',
    safetyNote: '土豆发芽、表皮大面积发绿时不要食用；切丝后用清水冲洗表面淀粉。',
    ingredients: {
      main: [
        { name: '土豆', amount: 2, unit: '个', image: `${I}potato.jpg` },
        { name: '青椒', amount: 0.5, unit: '个', image: `${I}pepper.jpg` },
        { name: '大蒜', amount: 2, unit: '瓣', image: `${I}garlic.jpg` }
      ],
      seasoning: [
        { name: '食用油', amount: 15, unit: 'ml', image: `${I}oil.jpg` },
        { name: '米醋', amount: 10, unit: 'ml', image: `${I}vinegar.jpg` },
        { name: '盐', amount: 2, unit: 'g', image: `${I}salt.jpg` }
      ]
    },
    steps: [
      { title: '处理土豆丝', text: '土豆切成粗细均匀的丝，用清水冲洗两遍并沥干；青椒切丝，蒜切片。', image: `${S}stir-potato.jpg`, timerSeconds: 0 },
      { title: '热锅爆香', text: '中大火热锅后放油，加入蒜片快速翻动，闻到香味即可。', image: `${S}add-oil.jpg`, timerSeconds: 30 },
      { title: '快速翻炒', text: '倒入沥干的土豆丝，大火持续翻炒，让土豆丝均匀受热。', image: `${S}stir-potato.jpg`, timerSeconds: 120 },
      { title: '调味出锅', text: '加入青椒丝、盐和米醋，再翻炒至青椒断生、土豆丝爽脆后立即出锅。', image: `${S}stir-potato.jpg`, timerSeconds: 90 }
    ]
  },
  {
    id: 'cola-wings',
    name: '可乐鸡翅',
    subtitle: '咸甜浓郁、适合新手',
    image: `${D}cola-wings.jpg`,
    categories: ['家常菜', '人气推荐'],
    ingredientComplexity: 2,
    difficulty: 2,
    cookMinutes: 28,
    baseServings: 3,
    sourceName: 'Red House Spice - Coca-Cola Chicken Wings',
    sourceUrl: 'https://redhousespice.com/coca-cola-chicken-wings/',
    safetyNote: '鸡翅最厚处必须完全熟透、肉汁清澈且无粉红生肉；生熟用具分开。',
    ingredients: {
      main: [
        { name: '鸡中翅', amount: 8, unit: '只', image: `${I}chicken-wing.jpg` },
        { name: '可乐', amount: 330, unit: 'ml', image: `${I}cola.jpg` },
        { name: '姜', amount: 4, unit: '片', image: `${I}ginger.jpg` },
        { name: '小葱', amount: 2, unit: '根', image: `${I}scallion.jpg` }
      ],
      seasoning: [
        { name: '生抽', amount: 20, unit: 'ml', image: `${I}soy-sauce.jpg` },
        { name: '食用油', amount: 10, unit: 'ml', image: `${I}oil.jpg` },
        { name: '盐', amount: 1, unit: 'g', image: `${I}salt.jpg` }
      ]
    },
    steps: [
      { title: '擦干鸡翅', text: '鸡翅洗净后彻底擦干表面水分，在较厚处浅划两刀，姜切片、葱切段。', image: `${S}sear-wings.jpg`, timerSeconds: 0 },
      { title: '煎至两面上色', text: '锅中放少量油，中火放入鸡翅，先不要频繁翻动，煎至两面金黄。', image: `${S}sear-wings.jpg`, timerSeconds: 480 },
      { title: '加入汤汁', text: '加入姜片、葱段、生抽和可乐，液体接近没过鸡翅即可，煮开后转小火。', image: `${S}cover-simmer.jpg`, timerSeconds: 0 },
      { title: '加盖焖煮', text: '盖上锅盖保持小火焖煮，中途翻面一次，使鸡翅均匀入味。', image: `${S}cover-simmer.jpg`, timerSeconds: 900 },
      { title: '收汁并确认熟度', text: '开盖转中火翻动收汁。切开最厚的一只检查无粉红生肉、肉汁清澈后出锅。', image: `${S}sear-wings.jpg`, timerSeconds: 300 }
    ]
  },
  {
    id: 'french-omelette',
    name: '法式煎蛋',
    subtitle: '柔软细腻的简便西餐',
    image: `${D}french-omelette.jpg`,
    categories: ['简便西餐', '快手菜'],
    ingredientComplexity: 1,
    difficulty: 3,
    cookMinutes: 5,
    baseServings: 1,
    sourceName: 'Good Food - Basic omelette',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/basic-omelette',
    safetyNote: '给儿童、孕妇、老人或免疫力较弱者食用时，建议将蛋液完全加热至凝固。',
    ingredients: {
      main: [
        { name: '鸡蛋', amount: 3, unit: '个', image: `${I}egg.jpg` },
        { name: '新鲜香草（可选）', amount: 5, unit: 'g', image: `${I}herbs.jpg` }
      ],
      seasoning: [
        { name: '无盐黄油', amount: 15, unit: 'g', image: `${I}butter.jpg` },
        { name: '盐', amount: 1, unit: 'g', image: `${I}salt.jpg` },
        { name: '黑胡椒', amount: 0.5, unit: 'g', image: `${I}black-pepper.jpg` }
      ]
    },
    steps: [
      { title: '打散并调味', text: '鸡蛋用叉子打散至蛋清蛋黄融合，加入盐和黑胡椒；香草切碎备用。', image: `${S}fold-omelette.jpg`, timerSeconds: 0 },
      { title: '融化黄油', text: '不粘锅以中小火预热，放入黄油，待黄油融化起泡但尚未焦黄。', image: `${S}add-oil.jpg`, timerSeconds: 30 },
      { title: '推动蛋液', text: '一次倒入蛋液，轻晃锅并用刮刀把凝固的边缘推向中间，让未凝固蛋液流向空处。', image: `${S}fold-omelette.jpg`, timerSeconds: 60 },
      { title: '折叠出锅', text: '表面基本凝固时撒香草，将蛋饼轻轻折叠。需要全熟时再以余温加热片刻。', image: `${S}fold-omelette.jpg`, timerSeconds: 45 }
    ]
  },
  {
    id: 'bolognese',
    name: '经典肉酱意面',
    subtitle: '浓郁番茄牛肉酱裹满面条',
    image: `${D}bolognese.jpg`,
    categories: ['简便西餐', '人气推荐'],
    ingredientComplexity: 4,
    difficulty: 3,
    cookMinutes: 60,
    baseServings: 4,
    sourceName: 'Good Food - Classic spaghetti Bolognese',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/classic-spaghetti-bolognese',
    safetyNote: '牛肉末应均匀变色并充分加热；处理生肉后清洗双手和接触面。',
    ingredients: {
      main: [
        { name: '牛肉末', amount: 400, unit: 'g', image: `${I}beef-mince.jpg` },
        { name: '意大利面', amount: 400, unit: 'g', image: `${I}spaghetti.jpg` },
        { name: '洋葱', amount: 1, unit: '个', image: `${I}onion.jpg` },
        { name: '胡萝卜', amount: 1, unit: '根', image: `${I}carrot.jpg` },
        { name: '西芹', amount: 2, unit: '根', image: `${I}celery.jpg` },
        { name: '番茄泥', amount: 500, unit: 'g', image: `${I}tomato-puree.jpg` }
      ],
      seasoning: [
        { name: '橄榄油', amount: 20, unit: 'ml', image: `${I}oil.jpg` },
        { name: '盐', amount: 4, unit: 'g', image: `${I}salt.jpg` },
        { name: '黑胡椒', amount: 1, unit: 'g', image: `${I}black-pepper.jpg` },
        { name: '帕玛森奶酪（可选）', amount: 40, unit: 'g', image: `${I}parmesan.jpg` }
      ]
    },
    steps: [
      { title: '切碎蔬菜', text: '洋葱、胡萝卜和西芹切成大小接近的小丁，便于同时软化。', image: `${S}brown-beef.jpg`, timerSeconds: 0 },
      { title: '炒软蔬菜', text: '锅中加入橄榄油，以中小火翻炒蔬菜丁至明显变软，不要炒焦。', image: `${S}brown-beef.jpg`, timerSeconds: 600 },
      { title: '煸炒牛肉末', text: '转中大火加入牛肉末，用木铲压散，持续翻炒至均匀变色并略微焦香。', image: `${S}brown-beef.jpg`, timerSeconds: 360 },
      { title: '小火熬肉酱', text: '加入番茄泥、盐和黑胡椒，煮开后转小火，不时搅动，熬至酱汁浓稠。', image: `${S}cover-simmer.jpg`, timerSeconds: 2100 },
      { title: '煮意大利面', text: '另起一锅水煮沸，加盐后放入意面，按包装标示时间煮至合适口感，留半杯面水。', image: `${S}boil-pasta.jpg`, timerSeconds: 600 },
      { title: '拌匀装盘', text: '沥干面条，与肉酱拌匀；太稠时加入少量面水调整，装盘后可撒奶酪。', image: `${S}boil-pasta.jpg`, timerSeconds: 60 }
    ]
  },
  {
    id: 'salmon-veg',
    name: '香煎三文鱼配蔬菜',
    subtitle: '高蛋白的清爽减脂餐',
    image: `${D}salmon-veg.jpg`,
    categories: ['减脂餐', '简便西餐'],
    ingredientComplexity: 3,
    difficulty: 3,
    cookMinutes: 15,
    baseServings: 2,
    sourceName: 'Good Food - How to Cook Salmon',
    sourceUrl: 'https://www.bbcgoodfood.com/howto/guide/how-cook-salmon',
    safetyNote: '鱼肉应加热至中心不透明、能轻松分层；具体熟度同时遵循产品包装与当地食品安全建议。',
    ingredients: {
      main: [
        { name: '三文鱼排', amount: 2, unit: '块', image: `${I}salmon.jpg` },
        { name: '芦笋', amount: 160, unit: 'g', image: `${I}asparagus.jpg` },
        { name: '西兰花', amount: 200, unit: 'g', image: `${I}broccoli.jpg` },
        { name: '柠檬', amount: 0.5, unit: '个', image: `${I}lemon.jpg` }
      ],
      seasoning: [
        { name: '橄榄油', amount: 15, unit: 'ml', image: `${I}oil.jpg` },
        { name: '黄油（可选）', amount: 10, unit: 'g', image: `${I}butter.jpg` },
        { name: '盐', amount: 2, unit: 'g', image: `${I}salt.jpg` },
        { name: '黑胡椒', amount: 1, unit: 'g', image: `${I}black-pepper.jpg` }
      ]
    },
    steps: [
      { title: '擦干并调味', text: '三文鱼表面彻底擦干，两面薄撒盐和黑胡椒；蔬菜洗净沥干。', image: `${S}sear-wings.jpg`, timerSeconds: 0 },
      { title: '先煎鱼皮面', text: '平底锅中火预热后加油，鱼皮朝下放入，用锅铲轻压十秒防止卷曲。', image: `${S}sear-wings.jpg`, timerSeconds: 300 },
      { title: '翻面煎熟', text: '翻面后可加入黄油，将融化黄油淋在鱼肉上，煎至中心不透明并可轻松分层。', image: `${S}sear-wings.jpg`, timerSeconds: 240 },
      { title: '炒熟配菜', text: '取出三文鱼静置。原锅放入芦笋和西兰花，加少量水后翻炒至断生。', image: `${S}stir-potato.jpg`, timerSeconds: 300 },
      { title: '调味装盘', text: '蔬菜加少许盐，和三文鱼一起装盘，食用前挤上柠檬汁。', image: `${S}sear-wings.jpg`, timerSeconds: 0 }
    ]
  }
]

function getRecipeById(id) {
  return allRecipes.find(item => item.id === id)
}

const allRecipes = recipes.concat(require('./recipes-extra'), require('./recipes-library'), require('./recipes-chinese-20')).map((recipe,index) => ({
  ...recipe,
  ingredients: {
    main: recipe.ingredients.main.map(decorateIngredient),
    seasoning: recipe.ingredients.seasoning.map(decorateIngredient)
  },
  image: `/assets/images/dishes/${recipe.id}.jpg`,
  hdImage: `/food-images-${index % 8 + 1}/${recipe.id}.jpg`,
  steps: recipe.steps.map((step, stepIndex) => ({...step, image: getStepImagePath(recipe.id, stepIndex)})),
  ...getRecipeMeta(recipe.id, recipe),
  allergens: detectAllergens(recipe)
}))

module.exports = {
  recipes: allRecipes,
  getRecipeById
}
