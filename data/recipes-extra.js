const I = '/assets/images/ingredients/'
const D = '/assets/images/dishes/'
const S = '/assets/images/steps/'

const ingredientPictures = {
  chicken: 'chicken-wing.jpg', pork: 'beef-mince.jpg', beef: 'beef-mince.jpg', fish: 'salmon.jpg', shrimp: 'salmon.jpg',
  tofu: 'egg.jpg', rice: 'spaghetti.jpg', noodles: 'spaghetti.jpg', flour: 'cornstarch.jpg', bread: 'spaghetti.jpg',
  tomato: 'tomato.jpg', potato: 'potato.jpg', pepper: 'pepper.jpg', mushroom: 'herbs.jpg', greens: 'broccoli.jpg',
  onion: 'onion.jpg', carrot: 'carrot.jpg', celery: 'celery.jpg', garlic: 'garlic.jpg', ginger: 'ginger.jpg',
  scallion: 'scallion.jpg', herbs: 'herbs.jpg', lemon: 'lemon.jpg', egg: 'egg.jpg', milk: 'milk.jpg',
  butter: 'butter.jpg', oil: 'oil.jpg', salt: 'salt.jpg', sugar: 'sugar.jpg', soy: 'soy-sauce.jpg',
  vinegar: 'vinegar.jpg', wine: 'cooking-wine.jpg', starch: 'cornstarch.jpg', sesame: 'sesame-oil.jpg',
  puree: 'tomato-puree.jpg', cheese: 'parmesan.jpg', spice: 'black-pepper.jpg'
}

const namedPictures = {
  '去骨鸡腿肉': 'chicken.jpg', '鸡胸肉': 'chicken.jpg', '熟花生米': 'peanuts.jpg', '干辣椒': 'dried-chili.jpg',
  '干辣椒（可选）': 'dried-chili.jpg', '嫩豆腐': 'tofu.jpg', '猪肉末': 'pork.jpg', '猪里脊': 'pork.jpg',
  '带皮五花肉': 'pork.jpg', '冷藏熟米饭': 'rice.jpg', '鲜面条': 'noodles.jpg', '扁意面': 'noodles.jpg',
  '普通面粉': 'flour.jpg', '高筋面粉': 'flour.jpg', '面粉': 'flour.jpg', '蘑菇': 'mushroom.jpg',
  '小白菜': 'bok-choy.jpg', '去壳去虾线虾仁': 'shrimp.jpg', '生虾仁': 'shrimp.jpg', '高汤': 'stock.jpg',
  '牛肉高汤': 'stock.jpg', '即发干酵母': 'yeast.jpg', '马苏里拉奶酪': 'mozzarella.jpg',
  '罗马生菜': 'romaine.jpg', '恰巴塔面包': 'ciabatta.jpg', '蛋黄酱': 'mayonnaise.jpg', '鳀鱼柳': 'anchovy.jpg',
  '椰奶': 'coconut-milk.jpg', '泰式绿咖喱酱': 'green-curry-paste.jpg', '咖喱酱': 'green-curry-paste.jpg',
  '四季豆': 'green-beans.jpg', '蜂蜜': 'honey.jpg', '炖煮牛肉块': 'beef-chunks.jpg', '小南瓜': 'butternut.jpg',
  '茄子': 'eggplant.jpg', '西葫芦': 'zucchini.jpg', '菠萝块': 'pineapple.jpg', '笋': 'bamboo-shoots.jpg',
  '笋丝': 'bamboo-shoots.jpg', '水发木耳': 'wood-ear.jpg', '荷兰豆': 'snow-peas.jpg'
}

const m = (name, amount, unit, picture) => ({ name, amount, unit, image: `${I}${namedPictures[name] || ingredientPictures[picture]}` })
const st = (title, text, picture, timerSeconds = 0) => ({ title, text, image: `${S}${picture}`, timerSeconds })
const recipe = (data) => ({ ...data, image: `${D}${data.id}.jpg` })

module.exports = [
  recipe({
    id: 'kung-pao-chicken', name: '宫保鸡丁', subtitle: '鸡丁、花生与干辣椒的经典川味小炒', categories: ['家常菜', '川菜', '人气推荐'],
    ingredientComplexity: 4, difficulty: 3, cookMinutes: 10, baseServings: 4,
    sourceName: 'The Woks of Life - Kung Pao Chicken', sourceUrl: 'https://thewoksoflife.com/kung-pao-chicken/',
    safetyNote: '鸡肉须完全熟透；处理生鸡肉后清洗双手、刀具和砧板。干辣椒入锅后避免大火久炒，以免呛烟。',
    ingredients: { main: [m('去骨鸡腿肉', 340, 'g', 'chicken'), m('熟花生米', 70, 'g', 'herbs'), m('干辣椒', 8, '个', 'pepper'), m('葱', 2, '根', 'scallion')], seasoning: [m('生抽', 20, 'ml', 'soy'), m('米醋', 15, 'ml', 'vinegar'), m('绍兴酒', 10, 'ml', 'wine'), m('白糖', 12, 'g', 'sugar'), m('玉米淀粉', 8, 'g', 'starch'), m('花椒', 2, 'g', 'spice')] },
    steps: [st('腌制并调汁', '鸡肉切丁，用少量生抽、绍兴酒和淀粉抓匀，腌20分钟；其余生抽、米醋、糖和少量水调成碗汁。', 'brown-beef.jpg', 1200), st('煎炒鸡丁', '锅烧热后放油，鸡丁摊开煎炒至表面变色，先盛出。', 'stir-potato.jpg', 240), st('炒香配料', '小火炒香花椒、干辣椒、姜蒜和葱白，辣椒不要炒黑。', 'heat-wok.jpg', 60), st('合炒收汁', '鸡丁回锅，倒入碗汁翻炒至鸡肉熟透、酱汁包裹均匀，最后拌入花生。', 'stir-potato.jpg', 180)]
  }),
  recipe({
    id: 'mapo-tofu', name: '麻婆豆腐', subtitle: '麻、辣、鲜、香的经典川菜', categories: ['家常菜', '川菜', '人气推荐'],
    ingredientComplexity: 4, difficulty: 3, cookMinutes: 25, baseServings: 4,
    sourceName: 'The Woks of Life - Mapo Tofu', sourceUrl: 'https://thewoksoflife.com/ma-po-tofu-real-deal/',
    safetyNote: '肉末须完全炒熟；豆腐下锅后轻推，避免热汤汁飞溅。',
    ingredients: { main: [m('嫩豆腐', 450, 'g', 'tofu'), m('猪肉末', 225, 'g', 'pork'), m('葱', 2, '根', 'scallion')], seasoning: [m('郫县豆瓣酱', 30, 'g', 'puree'), m('蒜', 3, '瓣', 'garlic'), m('姜', 10, 'g', 'ginger'), m('花椒粉', 2, 'g', 'spice'), m('玉米淀粉', 10, 'g', 'starch'), m('香油', 5, 'ml', 'sesame')] },
    steps: [st('准备豆腐和芡汁', '豆腐切约2厘米方块；淀粉加冷水调匀。', 'add-tomato.jpg'), st('炒熟肉末', '锅中放油，炒香姜蒜，加入猪肉末炒散，直到完全变色熟透。', 'brown-beef.jpg', 300), st('熬出麻辣汤底', '加入豆瓣酱和花椒粉炒出红油，倒入约160毫升清水煮开。', 'cover-simmer.jpg', 180), st('煨豆腐并勾芡', '放入豆腐轻推，小火煨3至5分钟；分次淋入芡汁至汤汁附着，撒葱花。', 'cover-simmer.jpg', 300)]
  }),
  recipe({
    id: 'fish-fragrant-pork', name: '鱼香肉丝', subtitle: '酸甜咸辣平衡的川味肉丝', categories: ['家常菜', '川菜'],
    ingredientComplexity: 5, difficulty: 4, cookMinutes: 12, baseServings: 4,
    sourceName: 'The Woks of Life - Shredded Pork Stir-Fry', sourceUrl: 'https://thewoksoflife.com/shredded-pork-stir-fry/',
    safetyNote: '猪肉须炒至完全熟透；木耳需充分泡发、洗净并加热。',
    ingredients: { main: [m('猪里脊', 300, 'g', 'pork'), m('水发木耳', 80, 'g', 'mushroom'), m('笋', 100, 'g', 'greens'), m('青红椒', 100, 'g', 'pepper')], seasoning: [m('郫县豆瓣酱', 20, 'g', 'puree'), m('生抽', 15, 'ml', 'soy'), m('米醋', 20, 'ml', 'vinegar'), m('白糖', 15, 'g', 'sugar'), m('玉米淀粉', 10, 'g', 'starch')] },
    steps: [st('切丝腌肉', '里脊逆纹切丝，用少量生抽、淀粉和水抓匀；木耳、笋和椒切丝。', 'brown-beef.jpg', 600), st('调鱼香汁', '生抽、米醋、白糖、淀粉和少量水混合，搅匀备用。', 'add-tomato.jpg'), st('滑炒肉丝', '热锅放油，肉丝快速炒散至变色，盛出。', 'stir-potato.jpg', 120), st('合炒收汁', '炒香豆瓣酱和姜蒜，加入配菜炒至断生；肉丝回锅，倒入鱼香汁炒至熟透浓亮。', 'stir-potato.jpg', 240)]
  }),
  recipe({
    id: 'red-braised-pork', name: '红烧肉', subtitle: '浓油赤酱、软糯入味的上海风味', categories: ['家常菜', '江浙菜'],
    ingredientComplexity: 2, difficulty: 3, cookMinutes: 60, baseServings: 6,
    sourceName: 'The Woks of Life - Shanghai-Style Braised Pork Belly', sourceUrl: 'https://thewoksoflife.com/shanghai-style-braised-pork-belly/',
    safetyNote: '炒糖色时温度很高，加入液体要沿锅边缓慢倒入并防止飞溅；猪肉须炖熟。',
    ingredients: { main: [m('带皮五花肉', 680, 'g', 'pork')], seasoning: [m('冰糖', 45, 'g', 'sugar'), m('绍兴酒', 80, 'ml', 'wine'), m('生抽', 30, 'ml', 'soy'), m('老抽', 15, 'ml', 'soy'), m('食用油', 15, 'ml', 'oil')] },
    steps: [st('焯洗五花肉', '五花肉切块，冷水下锅煮开数分钟，捞出洗净并沥干。', 'boil-pasta.jpg', 300), st('炒糖色', '锅中放少量油和冰糖，小火加热至糖融化并呈琥珀色。', 'add-oil.jpg', 180), st('调味炖煮', '放入肉块翻匀，缓慢加入绍兴酒、生抽、老抽和没过肉的热水，煮开后小火加盖。', 'cover-simmer.jpg', 2700), st('开盖收汁', '确认肉已软熟，开盖转中火翻动收汁，至酱汁浓亮但不烧干。', 'cover-simmer.jpg', 600)]
  }),
  recipe({
    id: 'sweet-sour-pork', name: '糖醋里脊', subtitle: '外酥里嫩、酸甜开胃', categories: ['家常菜', '粤菜', '人气推荐'],
    ingredientComplexity: 4, difficulty: 4, cookMinutes: 25, baseServings: 4,
    sourceName: 'The Woks of Life - Sweet and Sour Pork', sourceUrl: 'https://thewoksoflife.com/sweet-and-sour-pork/',
    safetyNote: '油炸时保持食材表面无多余水分，沿锅边轻放，切勿向热油中加水；猪肉须炸熟。',
    ingredients: { main: [m('猪里脊', 450, 'g', 'pork'), m('彩椒', 150, 'g', 'pepper'), m('菠萝块', 150, 'g', 'lemon')], seasoning: [m('番茄酱', 60, 'g', 'puree'), m('米醋', 45, 'ml', 'vinegar'), m('白糖', 45, 'g', 'sugar'), m('玉米淀粉', 70, 'g', 'starch'), m('鸡蛋', 1, '个', 'egg'), m('炸制用油', 700, 'ml', 'oil')] },
    steps: [st('腌肉并调汁', '里脊切块后调味腌30分钟；番茄酱、米醋、糖和少量水调匀。', 'brown-beef.jpg', 1800), st('挂糊', '肉块先裹蛋液，再均匀裹上淀粉，抖掉浮粉。', 'fold-omelette.jpg'), st('分批炸熟', '油加热后分批轻放肉块，炸至表面金黄、中心熟透，捞出沥油。', 'add-oil.jpg', 360), st('炒配菜并裹汁', '少油炒彩椒和菠萝，倒入糖醋汁煮至略稠，关小火后迅速拌入炸肉。', 'stir-potato.jpg', 180)]
  }),
  recipe({
    id: 'egg-fried-rice', name: '蛋炒饭', subtitle: '粒粒分明的经典快手主食', categories: ['家常菜', '快手菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 10, baseServings: 4,
    sourceName: 'The Woks of Life - Egg Fried Rice', sourceUrl: 'https://thewoksoflife.com/egg-fried-rice/',
    safetyNote: '熟米饭应及时冷藏并尽快食用；隔夜饭炒制时须彻底加热至整体冒热气。',
    ingredients: { main: [m('冷藏熟米饭', 750, 'g', 'rice'), m('鸡蛋', 5, '个', 'egg'), m('青豆', 100, 'g', 'greens'), m('洋葱', 0.5, '个', 'onion')], seasoning: [m('食用油', 30, 'ml', 'oil'), m('盐', 3, 'g', 'salt'), m('白胡椒', 1, 'g', 'spice'), m('葱', 2, '根', 'scallion')] },
    steps: [st('打散米饭和鸡蛋', '米饭用饭勺拨散；3个鸡蛋打散，另2个鸡蛋另放一碗打散。', 'fold-omelette.jpg'), st('炒熟第一份鸡蛋', '热锅放油，倒入3个鸡蛋快速炒至刚凝固，盛出。', 'fold-omelette.jpg', 60), st('炒散米饭', '炒香洋葱，加入米饭大火翻炒约2分钟，倒入另一份蛋液让其包裹米粒。', 'stir-potato.jpg', 180), st('加入配料调味', '加入青豆、盐和白胡椒炒至青豆熟、米饭滚烫，再拌回炒蛋和葱花。', 'stir-potato.jpg', 180)]
  }),
  recipe({
    id: 'scallion-oil-noodles', name: '葱油拌面', subtitle: '葱香浓郁的上海风味面食', categories: ['家常菜', '快手菜', '江浙菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 15, baseServings: 4,
    sourceName: 'The Woks of Life - Soy Scallion Noodles', sourceUrl: 'https://thewoksoflife.com/soy-scallion-noodles-cong-ban-mian/',
    safetyNote: '葱洗后务必沥干再入油锅，防止热油飞溅；酱油含盐较高，按口味控制用量。',
    ingredients: { main: [m('鲜面条', 450, 'g', 'noodles'), m('小葱', 225, 'g', 'scallion')], seasoning: [m('食用油', 80, 'ml', 'oil'), m('生抽', 45, 'ml', 'soy'), m('老抽', 45, 'ml', 'soy'), m('白糖', 16, 'g', 'sugar')] },
    steps: [st('切葱并沥干', '小葱洗净彻底擦干，切成长段或细丝。', 'stir-potato.jpg'), st('慢炸葱油', '冷锅放油和葱，中小火慢炸至葱呈金褐色酥脆，捞出葱段。', 'add-oil.jpg', 600), st('熬酱汁并煮面', '葱油中加入生抽、老抽和糖，小火煮约2分钟；另锅将面煮熟。', 'boil-pasta.jpg', 180), st('拌面', '面条沥干，按份加入适量葱油酱汁拌匀，放上酥葱。', 'boil-pasta.jpg')]
  }),
  recipe({
    id: 'cantonese-steamed-fish', name: '粤式清蒸鱼柳', subtitle: '姜葱豉油突出鱼肉鲜味', categories: ['粤菜', '减脂餐', '快手菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 15, baseServings: 2,
    sourceName: 'The Woks of Life - Cantonese Steamed Fish', sourceUrl: 'https://thewoksoflife.com/cantonese-steamed-fish/',
    safetyNote: '鱼肉须蒸至中心不透明且能轻松分层；揭锅盖时先让蒸汽远离面部和双手。',
    ingredients: { main: [m('无刺白肉鱼柳', 280, 'g', 'fish'), m('葱', 2, '根', 'scallion'), m('姜', 30, 'g', 'ginger'), m('香菜', 10, 'g', 'herbs')], seasoning: [m('生抽', 22, 'ml', 'soy'), m('食用油', 30, 'ml', 'oil'), m('白糖', 2, 'g', 'sugar'), m('盐', 1, 'g', 'salt')] },
    steps: [st('准备鱼和料头', '鱼柳擦干放入耐热盘；姜、葱切细丝，香菜切段。', 'sear-wings.jpg'), st('蒸熟鱼柳', '蒸锅水沸后放入鱼盘，加盖蒸4至10分钟，按鱼柳厚度调整。', 'cover-simmer.jpg', 480), st('检查熟度', '用餐刀轻插鱼肉最厚处，应能顺利穿过；鱼肉中心不透明并可轻松分层。', 'sear-wings.jpg'), st('浇姜葱豉油', '倒掉盘中多余水分，将生抽、糖和少量热水煮开，与热油、姜葱香菜一起浇在鱼上。', 'add-oil.jpg', 60)]
  }),
  recipe({
    id: 'hot-sour-soup', name: '酸辣汤', subtitle: '胡椒辛香与米醋酸味层次分明', categories: ['家常菜', '汤羹'],
    ingredientComplexity: 5, difficulty: 3, cookMinutes: 20, baseServings: 6,
    sourceName: 'The Woks of Life - Hot and Sour Soup', sourceUrl: 'https://thewoksoflife.com/hot-sour-soup/',
    safetyNote: '猪肉丝须煮熟；木耳和干香菇应充分泡发、洗净并加热，泡发水不直接使用。',
    ingredients: { main: [m('猪肉丝', 115, 'g', 'pork'), m('嫩豆腐', 225, 'g', 'tofu'), m('水发木耳', 60, 'g', 'mushroom'), m('水发香菇', 60, 'g', 'mushroom'), m('笋丝', 100, 'g', 'greens'), m('鸡蛋', 1, '个', 'egg')], seasoning: [m('高汤', 1400, 'ml', 'celery'), m('生抽', 30, 'ml', 'soy'), m('米醋', 60, 'ml', 'vinegar'), m('白胡椒', 4, 'g', 'spice'), m('玉米淀粉', 35, 'g', 'starch')] },
    steps: [st('处理食材', '干货充分泡发洗净，与豆腐、笋切细丝；肉丝加少量淀粉抓匀。', 'stir-potato.jpg'), st('煮汤底和肉丝', '高汤煮开，放入肉丝拨散，煮至肉丝完全变色。', 'cover-simmer.jpg', 180), st('加入配料并勾芡', '加入木耳、香菇、笋和豆腐煮开，分次加入水淀粉并搅匀。', 'cover-simmer.jpg', 300), st('调酸辣并淋蛋', '加入生抽和白胡椒，淋入蛋液形成蛋花；关火前后加入米醋，尝味调整。', 'fold-omelette.jpg', 90)]
  }),
  recipe({
    id: 'garlic-bok-choy', name: '蒜炒小白菜', subtitle: '清脆鲜绿的五分钟蔬菜', categories: ['家常菜', '快手菜', '减脂餐'],
    ingredientComplexity: 1, difficulty: 1, cookMinutes: 5, baseServings: 4,
    sourceName: 'The Woks of Life - Stir-Fried Bok Choy', sourceUrl: 'https://thewoksoflife.com/stir-fried-bok-choy-recipe/',
    safetyNote: '青菜洗后尽量沥干，放入热油锅时防止水滴引起飞溅。',
    ingredients: { main: [m('小白菜', 700, 'g', 'greens'), m('蒜', 4, '瓣', 'garlic'), m('姜', 8, 'g', 'ginger')], seasoning: [m('食用油', 45, 'ml', 'oil'), m('盐', 3, 'g', 'salt'), m('香油（可选）', 5, 'ml', 'sesame'), m('玉米淀粉', 5, 'g', 'starch')] },
    steps: [st('清洗沥干', '小白菜逐棵洗净，较大的纵向剖开，充分沥干；姜蒜切片。', 'stir-potato.jpg'), st('爆香姜蒜', '锅烧至较热，放油后立即加入姜蒜快速翻动。', 'heat-wok.jpg', 20), st('大火翻炒', '放入小白菜，大火不断翻炒，让菜叶均匀受热。', 'stir-potato.jpg', 120), st('调味出锅', '加盐、白胡椒和少量水淀粉，炒至菜梗刚熟仍清脆，淋香油出锅。', 'stir-potato.jpg', 60)]
  }),
  recipe({
    id: 'beef-vegetable-stir-fry', name: '牛肉炒时蔬', subtitle: '嫩牛肉搭配三种脆嫩蔬菜', categories: ['家常菜', '减脂餐'],
    ingredientComplexity: 4, difficulty: 3, cookMinutes: 10, baseServings: 3,
    sourceName: 'The Woks of Life - Beef Vegetable Stir-Fry', sourceUrl: 'https://thewoksoflife.com/beef-vegetable-stir-fry/',
    safetyNote: '牛肉和蔬菜使用不同砧板更稳妥；牛肉应炒至符合个人所需熟度并遵循当地食品安全建议。',
    ingredients: { main: [m('牛里脊或 flank steak', 340, 'g', 'beef'), m('小白菜', 300, 'g', 'greens'), m('蘑菇', 100, 'g', 'mushroom'), m('荷兰豆', 100, 'g', 'greens')], seasoning: [m('蚝油', 30, 'ml', 'soy'), m('生抽', 15, 'ml', 'soy'), m('绍兴酒', 15, 'ml', 'wine'), m('玉米淀粉', 15, 'g', 'starch'), m('姜蒜', 20, 'g', 'ginger')] },
    steps: [st('切牛肉并腌制', '牛肉逆纹切薄片，加少量水、淀粉、油和蚝油抓匀，腌30分钟。', 'brown-beef.jpg', 1800), st('调汁并煎牛肉', '调好酱汁；热锅少油，将牛肉摊开两面快速煎炒，先盛出。', 'brown-beef.jpg', 120), st('炒蔬菜', '炒香姜蒜和蘑菇，加入小白菜与荷兰豆翻炒至接近断生。', 'stir-potato.jpg', 180), st('合炒勾芡', '倒入酱汁和牛肉快速合炒，需要时加少量水淀粉，至酱汁包裹、牛肉熟透。', 'stir-potato.jpg', 120)]
  }),
  recipe({
    id: 'shrimp-eggs', name: '虾仁炒蛋', subtitle: '鲜嫩虾仁配柔软滑蛋', categories: ['家常菜', '快手菜'],
    ingredientComplexity: 1, difficulty: 2, cookMinutes: 5, baseServings: 4,
    sourceName: 'The Woks of Life - Stir-Fried Shrimp and Eggs', sourceUrl: 'https://thewoksoflife.com/stir-fried-shrimp-eggs/',
    safetyNote: '虾仁须加热至不透明且呈粉红色；鸡蛋须按食用人群需要充分凝固。',
    ingredients: { main: [m('去壳去虾线虾仁', 340, 'g', 'shrimp'), m('鸡蛋', 8, '个', 'egg'), m('葱', 2, '根', 'scallion')], seasoning: [m('食用油', 60, 'ml', 'oil'), m('盐', 4, 'g', 'salt'), m('白胡椒', 1, 'g', 'spice'), m('香油', 5, 'ml', 'sesame')] },
    steps: [st('调好蛋液', '鸡蛋打散，加入盐、白胡椒、香油和葱花。', 'fold-omelette.jpg'), st('快速汆虾仁', '水将沸未沸时放入虾仁，轻煮至刚变粉红，立即捞出沥干。', 'boil-pasta.jpg', 60), st('混合虾仁蛋液', '虾仁加入蛋液拌匀；锅烧热后放油。', 'add-oil.jpg'), st('轻推成滑蛋', '倒入虾仁蛋液，用锅铲从边缘向中间轻推折叠，至虾熟、蛋液达到所需凝固程度。', 'fold-omelette.jpg', 120)]
  }),
  recipe({
    id: 'mushroom-soup', name: '奶油蘑菇汤', subtitle: '顺滑浓郁的经典西式汤品', categories: ['简便西餐', '汤羹'],
    ingredientComplexity: 3, difficulty: 2, cookMinutes: 25, baseServings: 4,
    sourceName: 'Good Food - Mushroom Soup', sourceUrl: 'https://www.bbcgoodfood.com/recipes/mushroom-soup',
    safetyNote: '搅打热汤时不要把料理机装得过满；使用手持搅拌棒时保持刀头完全浸没。',
    ingredients: { main: [m('蘑菇', 500, 'g', 'mushroom'), m('洋葱', 2, '个', 'onion'), m('高汤', 1000, 'ml', 'celery')], seasoning: [m('黄油', 90, 'g', 'butter'), m('蒜', 1, '瓣', 'garlic'), m('面粉', 30, 'g', 'flour'), m('淡奶油', 60, 'ml', 'milk'), m('月桂叶', 1, '片', 'herbs')] },
    steps: [st('炒软洋葱', '黄油融化后加入洋葱和蒜，中小火炒软但不上色。', 'add-oil.jpg', 600), st('炒蘑菇', '加入切片蘑菇，中火炒约3分钟至开始变软。', 'stir-potato.jpg', 180), st('加汤煮熟', '撒入面粉拌匀，逐渐加入高汤和月桂叶，煮开后小火煮10分钟。', 'cover-simmer.jpg', 600), st('搅打并加奶油', '取出月桂叶，将汤搅打顺滑，回锅加淡奶油温热，不要猛烈沸腾。', 'cover-simmer.jpg', 120)]
  }),
  recipe({
    id: 'margherita-pizza', name: '玛格丽特披萨', subtitle: '番茄、奶酪和罗勒的经典组合', categories: ['简便西餐', '烘焙'],
    ingredientComplexity: 3, difficulty: 4, cookMinutes: 10, baseServings: 4,
    sourceName: 'Good Food - Pizza Margherita', sourceUrl: 'https://www.bbcgoodfood.com/recipes/pizza-margherita-4-easy-steps',
    safetyNote: '烤箱和烤盘温度很高，取放披萨时使用隔热手套；奶酪按保存要求冷藏。',
    ingredients: { main: [m('高筋面粉', 300, 'g', 'flour'), m('番茄酱汁', 100, 'ml', 'puree'), m('马苏里拉奶酪', 125, 'g', 'cheese'), m('罗勒叶', 10, 'g', 'herbs')], seasoning: [m('即发干酵母', 7, 'g', 'flour'), m('橄榄油', 15, 'ml', 'oil'), m('盐', 5, 'g', 'salt'), m('蒜', 1, '瓣', 'garlic')] },
    steps: [st('和面揉面', '面粉、酵母和盐混合，加入约200毫升温水与橄榄油，揉约5分钟至光滑。', 'fold-omelette.jpg', 300), st('准备酱汁和饼底', '番茄酱汁拌入蒜和罗勒；面团分两份，擀成约25厘米圆饼。', 'add-tomato.jpg'), st('铺料', '饼底放在烘焙纸上，薄抹番茄酱，放撕碎的马苏里拉和少量帕玛森。', 'add-tomato.jpg'), st('高温烘烤', '烤箱与烤盘预热至240℃，披萨烤8至10分钟，至饼边酥脆、奶酪沸腾。', 'cover-simmer.jpg', 600)]
  }),
  recipe({
    id: 'chicken-caesar', name: '鸡肉凯撒沙拉', subtitle: '烤鸡、脆面包与罗马生菜', categories: ['简便西餐', '减脂餐'],
    ingredientComplexity: 4, difficulty: 2, cookMinutes: 20, baseServings: 4,
    sourceName: 'Good Food - Chicken Caesar Salad', sourceUrl: 'https://www.bbcgoodfood.com/recipes/chicken-caesar-salad',
    safetyNote: '鸡胸最厚处须完全熟透、无粉红生肉；接触生鸡肉的器具不得再接触即食生菜。',
    ingredients: { main: [m('鸡胸肉', 2, '块', 'chicken'), m('罗马生菜', 1, '棵', 'greens'), m('恰巴塔面包', 1, '个', 'bread'), m('帕玛森奶酪', 50, 'g', 'cheese')], seasoning: [m('蛋黄酱', 75, 'g', 'egg'), m('白葡萄酒醋', 15, 'ml', 'vinegar'), m('鳀鱼柳', 2, '条', 'fish'), m('蒜', 1, '瓣', 'garlic'), m('橄榄油', 30, 'ml', 'oil')] },
    steps: [st('烤面包丁', '面包撕块拌少量油，烤至金黄酥脆，取出放凉。', 'cover-simmer.jpg', 600), st('煎熟鸡胸', '鸡胸调味后平底锅每面煎约4分钟，最厚处完全熟透后静置再切片。', 'sear-wings.jpg', 480), st('调凯撒酱', '蒜和鳀鱼压成泥，与蛋黄酱、醋、少量奶酪和水调成可流动酱汁。', 'fold-omelette.jpg'), st('拌匀装盘', '生菜洗净并彻底沥干，和面包丁、酱汁轻拌，放鸡肉片并刨上奶酪。', 'stir-potato.jpg')]
  }),
  recipe({
    id: 'french-crepes', name: '法式薄饼', subtitle: '柔软轻薄、甜咸皆宜的基础可丽饼', categories: ['简便西餐', '快手菜', '甜点'],
    ingredientComplexity: 1, difficulty: 2, cookMinutes: 20, baseServings: 4,
    sourceName: 'Good Food - Easy Pancakes', sourceUrl: 'https://www.bbcgoodfood.com/recipes/easy-pancakes',
    safetyNote: '面糊含生鸡蛋，薄饼两面均须加热；翻饼时让锅柄朝内，避免碰落。',
    ingredients: { main: [m('普通面粉', 100, 'g', 'flour'), m('鸡蛋', 2, '个', 'egg'), m('牛奶', 300, 'ml', 'milk')], seasoning: [m('食用油', 15, 'ml', 'oil'), m('柠檬（可选）', 1, '个', 'lemon'), m('白糖（可选）', 15, 'g', 'sugar')] },
    steps: [st('调面糊', '面粉中间挖窝，加入鸡蛋和少量牛奶搅匀，再逐渐加入其余牛奶至顺滑。', 'fold-omelette.jpg'), st('预热薄油锅', '平底锅中火预热，用厨房纸薄薄擦一层油。', 'add-oil.jpg', 30), st('摊第一面', '倒入一小勺面糊并转锅摊薄，煎约1分钟至边缘翘起、底部金黄。', 'fold-omelette.jpg', 60), st('翻面完成', '翻面再煎约1分钟，重复至面糊用完，可配柠檬和糖。', 'fold-omelette.jpg', 60)]
  }),
  recipe({
    id: 'shakshuka', name: '北非番茄焗蛋', subtitle: '鸡蛋卧在香料番茄酱中的暖锅早餐', categories: ['简便西餐', '快手菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 20, baseServings: 2,
    sourceName: 'Good Food - Shakshuka', sourceUrl: 'https://www.bbcgoodfood.com/recipes/shakshuka',
    safetyNote: '儿童、孕妇、老人或免疫力较弱者食用时，建议将蛋黄和蛋白都加热至完全凝固。',
    ingredients: { main: [m('鸡蛋', 4, '个', 'egg'), m('罐装樱桃番茄', 800, 'g', 'tomato'), m('红洋葱', 2, '个', 'onion'), m('红辣椒', 1, '个', 'pepper')], seasoning: [m('蒜', 1, '瓣', 'garlic'), m('橄榄油', 15, 'ml', 'oil'), m('白糖', 5, 'g', 'sugar'), m('香菜', 15, 'g', 'herbs')] },
    steps: [st('炒香蔬菜', '锅中放油，加入洋葱、辣椒、蒜和香菜梗，中火炒软。', 'stir-potato.jpg', 300), st('熬番茄酱', '加入番茄和糖，煮8至10分钟，至酱汁浓稠。', 'cover-simmer.jpg', 600), st('打入鸡蛋', '在酱汁中挖4个小窝，逐个打入鸡蛋，转小火并加盖。', 'fold-omelette.jpg'), st('焖至所需熟度', '焖6至8分钟，至蛋白凝固；按食用人群需要让蛋黄完全凝固，撒香菜。', 'cover-simmer.jpg', 480)]
  }),
  recipe({
    id: 'thai-green-curry', name: '泰式绿咖喱鸡', subtitle: '椰香、香草与微辣咖喱交融', categories: ['东南亚菜', '人气推荐'],
    ingredientComplexity: 4, difficulty: 2, cookMinutes: 30, baseServings: 6,
    sourceName: 'Good Food - Thai Green Chicken Curry', sourceUrl: 'https://www.bbcgoodfood.com/recipes/thai-green-chicken-curry',
    safetyNote: '鸡肉须完全熟透；咖喱酱和鱼露含盐量差异较大，应先少量加入再调整。',
    ingredients: { main: [m('鸡胸肉', 450, 'g', 'chicken'), m('土豆', 225, 'g', 'potato'), m('四季豆', 100, 'g', 'greens'), m('椰奶', 400, 'ml', 'milk')], seasoning: [m('泰式绿咖喱酱', 45, 'g', 'herbs'), m('鱼露', 15, 'ml', 'soy'), m('蒜', 1, '瓣', 'garlic'), m('罗勒', 15, 'g', 'herbs'), m('白糖', 5, 'g', 'sugar')] },
    steps: [st('预煮土豆和豆角', '土豆入沸水煮5分钟，再加入四季豆煮3分钟，沥干。', 'boil-pasta.jpg', 480), st('炒香咖喱酱', '锅中放油，炒香蒜和绿咖喱酱，加入椰奶、鱼露和糖煮开。', 'add-oil.jpg', 120), st('煮熟鸡肉', '加入鸡肉块，盖盖小火煮约8分钟，确认中心完全熟透。', 'cover-simmer.jpg', 480), st('合煮蔬菜', '放回土豆和四季豆，加入罗勒再煮数分钟，尝味调整后关火。', 'cover-simmer.jpg', 180)]
  }),
  recipe({
    id: 'teriyaki-chicken', name: '日式照烧鸡', subtitle: '甜咸亮泽的快速鸡腿料理', categories: ['日式料理', '快手菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 15, baseServings: 4,
    sourceName: 'Good Food - Easy Teriyaki Chicken', sourceUrl: 'https://www.bbcgoodfood.com/recipes/easy-teriyaki-chicken',
    safetyNote: '鸡腿肉须完全熟透；蜂蜜酱汁易焦，收汁阶段使用中小火并勤翻动。',
    ingredients: { main: [m('去骨鸡腿肉', 6, '块', 'chicken'), m('葱', 2, '根', 'scallion')], seasoning: [m('生抽', 30, 'ml', 'soy'), m('蜂蜜', 50, 'g', 'sugar'), m('米醋', 15, 'ml', 'vinegar'), m('香油', 15, 'ml', 'sesame'), m('姜', 15, 'g', 'ginger'), m('蒜', 2, '瓣', 'garlic')] },
    steps: [st('切鸡肉并备汁', '鸡腿肉切块；生抽、蜂蜜、米醋和100毫升水调匀。', 'brown-beef.jpg'), st('煎炒鸡肉', '锅中放香油，鸡肉中火煎炒约7分钟至表面金黄。', 'sear-wings.jpg', 420), st('加入姜蒜', '加入切碎的姜和蒜继续炒约2分钟，避免炒焦。', 'stir-potato.jpg', 120), st('照烧收汁', '倒入调好的汁，煮2至5分钟至鸡肉熟透、酱汁浓亮，撒芝麻和葱。', 'cover-simmer.jpg', 300)]
  }),
  recipe({
    id: 'butter-chicken', name: '印度黄油鸡', subtitle: '番茄、香料与奶油构成的柔和咖喱', categories: ['印度菜', '人气推荐'],
    ingredientComplexity: 3, difficulty: 2, cookMinutes: 30, baseServings: 4,
    sourceName: 'Good Food - Butter Chicken', sourceUrl: 'https://www.bbcgoodfood.com/recipes/butter-chicken',
    safetyNote: '鸡肉须完全熟透；加入奶油后避免大火久煮，以免油水分离。',
    ingredients: { main: [m('鸡胸肉', 4, '块', 'chicken'), m('番茄泥', 500, 'g', 'puree'), m('洋葱', 1, '个', 'onion')], seasoning: [m('黄油', 25, 'g', 'butter'), m('印度综合香料', 20, 'g', 'spice'), m('蒜', 3, '瓣', 'garlic'), m('姜蓉', 15, 'g', 'ginger'), m('腰果酱', 30, 'g', 'herbs'), m('淡奶油', 50, 'ml', 'milk')] },
    steps: [st('炒软洋葱', '黄油融化后加入洋葱，中火炒约5分钟至变软。', 'add-oil.jpg', 300), st('炒鸡肉和香料', '加入鸡肉块炒至各面变色，再加入香料、蒜和姜炒香。', 'brown-beef.jpg', 360), st('加入番茄炖煮', '倒入番茄泥，煮开后小火煮约20分钟，确认鸡肉完全熟透。', 'cover-simmer.jpg', 1200), st('加入腰果和奶油', '拌入腰果酱与淡奶油，小火温热并调味，撒香菜。', 'cover-simmer.jpg', 120)]
  }),
  recipe({
    id: 'beef-stew', name: '经典炖牛肉', subtitle: '牛肉与根茎蔬菜慢炖成浓郁暖锅', categories: ['简便西餐', '炖菜'],
    ingredientComplexity: 3, difficulty: 3, cookMinutes: 210, baseServings: 5,
    sourceName: 'Good Food - Beef & Vegetable Casserole', sourceUrl: 'https://www.bbcgoodfood.com/recipes/beef-vegetable-casserole',
    safetyNote: '炖锅和烤箱容器长时间保持高温，取放须使用隔热手套；牛肉需炖至熟透软嫩。',
    ingredients: { main: [m('炖煮牛肉块', 850, 'g', 'beef'), m('胡萝卜', 2, '根', 'carrot'), m('西芹', 2, '根', 'celery'), m('洋葱', 1, '个', 'onion')], seasoning: [m('面粉', 25, 'g', 'flour'), m('番茄膏', 30, 'g', 'puree'), m('牛肉高汤', 600, 'ml', 'celery'), m('黄油', 25, 'g', 'butter'), m('月桂叶和百里香', 10, 'g', 'herbs')] },
    steps: [st('预热并切配', '烤箱预热至160℃；蔬菜切块，牛肉擦干。', 'brown-beef.jpg'), st('炒软蔬菜', '厚底耐烤锅中加油和黄油，蔬菜中火炒约10分钟。', 'stir-potato.jpg', 600), st('加入牛肉和汤汁', '拌入面粉、番茄膏和调味汁，逐渐加高汤和水，加入牛肉与香草煮开。', 'cover-simmer.jpg', 300), st('长时间慢炖', '加盖入烤箱约2.5小时，再揭盖烤30至60分钟，至牛肉软嫩、汤汁浓稠。', 'cover-simmer.jpg', 10800)]
  }),
  recipe({
    id: 'garlic-prawn-linguine', name: '蒜香黄油虾意面', subtitle: '十分钟完成的柠檬蒜香海鲜面', categories: ['简便西餐', '快手菜'],
    ingredientComplexity: 2, difficulty: 2, cookMinutes: 10, baseServings: 2,
    sourceName: 'Good Food - Linguine with Garlic Butter Prawns', sourceUrl: 'https://www.bbcgoodfood.com/recipes/linguine-garlic-butter-prawns',
    safetyNote: '生虾须加热至整体不透明并呈粉红色；海鲜过敏者不得食用。',
    ingredients: { main: [m('扁意面', 200, 'g', 'noodles'), m('生虾仁', 175, 'g', 'shrimp')], seasoning: [m('黄油', 50, 'g', 'butter'), m('蒜', 3, '瓣', 'garlic'), m('柠檬', 1, '个', 'lemon'), m('欧芹', 15, 'g', 'herbs'), m('盐', 2, 'g', 'salt')] },
    steps: [st('煮意面', '沸水加盐，按包装时间将扁意面煮至合适口感，留少量面水。', 'boil-pasta.jpg', 600), st('低火炒蒜', '平底锅小火融化黄油，加入蒜末轻炒出香味，不要炒焦。', 'add-oil.jpg', 60), st('炒熟虾仁', '加入生虾仁翻炒，直到由灰变粉红、整体不透明。', 'stir-potato.jpg', 180), st('拌面完成', '加入柠檬皮屑和少量汁，放入面条、欧芹和少量面水拌匀。', 'boil-pasta.jpg', 60)]
  }),
  recipe({
    id: 'vegetable-curry', name: '印度蔬菜咖喱', subtitle: '烤蔬菜与番茄椰奶咖喱', categories: ['印度菜', '减脂餐'],
    ingredientComplexity: 4, difficulty: 2, cookMinutes: 45, baseServings: 8,
    sourceName: 'Good Food - Vegetable Curry for a Crowd', sourceUrl: 'https://www.bbcgoodfood.com/recipes/vegetable-curry-crowd',
    safetyNote: '切南瓜时使用稳固砧板并让刀刃远离手指；烤盘取放须用隔热手套。',
    ingredients: { main: [m('土豆', 1, '个', 'potato'), m('小南瓜', 1, '个', 'carrot'), m('茄子', 1, '个', 'pepper'), m('红椒', 2, '个', 'pepper'), m('西葫芦', 2, '个', 'greens'), m('椰奶', 400, 'ml', 'milk')], seasoning: [m('咖喱酱', 90, 'g', 'herbs'), m('番茄泥', 700, 'g', 'puree'), m('洋葱', 2, '个', 'onion'), m('食用油', 45, 'ml', 'oil'), m('香菜', 20, 'g', 'herbs')] },
    steps: [st('切配并预热', '烤箱预热至200℃；土豆、南瓜和茄子切成大小接近的块。', 'stir-potato.jpg'), st('烤第一批蔬菜', '蔬菜拌一半咖喱酱和油，摊在烤盘上烤约30分钟至变软。', 'cover-simmer.jpg', 1800), st('熬咖喱酱', '锅中炒软洋葱，加入其余咖喱酱、番茄泥和椰奶煮开。', 'cover-simmer.jpg', 600), st('合煮全部蔬菜', '加入烤蔬菜、红椒和西葫芦，小火煮10至15分钟至全部熟透，撒香菜。', 'cover-simmer.jpg', 900)]
  }),
  recipe({
    id: 'aglio-e-olio', name: '蒜香橄榄油意面', subtitle: '用少量材料呈现蒜香与面香', categories: ['简便西餐', '快手菜'],
    ingredientComplexity: 1, difficulty: 2, cookMinutes: 12, baseServings: 2,
    sourceName: 'Good Food - Spaghetti Aglio e Olio', sourceUrl: 'https://www.bbcgoodfood.com/recipes/spaghetti-aglio-e-olio',
    safetyNote: '蒜片只炒至浅金色，颜色过深会发苦；煮面水和锅具温度较高，沥面时防烫。',
    ingredients: { main: [m('意大利面', 200, 'g', 'noodles'), m('蒜', 4, '瓣', 'garlic'), m('欧芹', 15, 'g', 'herbs')], seasoning: [m('橄榄油', 45, 'ml', 'oil'), m('干辣椒（可选）', 1, '个', 'pepper'), m('盐', 2, 'g', 'salt')] },
    steps: [st('煮面', '沸水加盐，按包装时间将意面煮至合适口感，保留一杯面水。', 'boil-pasta.jpg', 600), st('切蒜和香草', '蒜切薄片，欧芹切碎；使用干辣椒时切碎备用。', 'stir-potato.jpg'), st('低火炒香', '冷锅加入橄榄油和蒜片，小火加热；蒜刚呈浅金色时加入辣椒，约1分钟。', 'add-oil.jpg', 60), st('乳化拌面', '放入意面和欧芹，边翻拌边少量加入面水，使油和面水乳化并均匀裹面。', 'boil-pasta.jpg', 120)]
  })
]
