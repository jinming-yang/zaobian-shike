// Observable cues are guidance, not a way to measure exact oil temperature.
// Deep-frying needs an oil thermometer; smoke is never the target for beginners.
const overheat = '油一旦冒烟（包括小烟），先关火、让油降温；不要加水，也不要靠近闻。'

function getHeatGuidance(step) {
  const text = `${step.title} ${step.text}`
  if (/空气炸/.test(text)) return null
  if (/烤箱|烤盘|烤皿|烘烤|烤至|烤制/.test(text)) {
    return {
      title: '烤箱按步骤温度预热',
      cues: ['先预热到步骤标出的温度，再放入食材；温度没有达到时不要提前开始计时。', '中途需要查看时尽量快速开关烤箱门，避免温度下降过多。'],
      warning: '烤盘、烤皿和烤箱门都很烫，请使用隔热手套。'
    }
  }
  if (/小火|中小火|极小火/.test(text)) {
    return {
      title: '这一步用小火或中小火',
      cues: ['火焰不要超过锅底，保持轻微冒泡或轻柔滋滋声。', '上色过快、出现焦味时立即再调小或暂时关火。'],
      warning: overheat
    }
  }
  if (/大火|中大火/.test(text)) {
    return {
      title: '这一步用大火或中大火',
      cues: ['食材提前放在手边，下锅后持续翻动，不要离开灶台。', '出现浓烟、焦黑或剧烈飞溅时立即调小火。'],
      warning: overheat
    }
  }
  if (/炸鱼装盘/.test(text) && !/油锅|炸至|炸熟/.test(text)) return null
  if (/冷锅.*葱|慢炸.*葱/.test(text)) {
    return {
      title: '葱油从冷锅冷油开始',
      cues: ['先把沥干的葱段与油一起放进冷锅，再开中小火，不先烧热油。', '葱周围慢慢出现细泡，保持轻柔滋滋声；葱色从绿转浅金，再到金褐就捞出。', '不要等葱段发黑，关火后余温仍会继续上色。'],
      warning: overheat
    }
  }
  if (/炸至|炸熟|炸制|下油锅|复炸|炸鱼|油炸/.test(text)) {
    return {
      title: '炸制油温怎么看',
      cues: ['用可测热油的食品温度计，普通炸制常用约 170–180°C；分阶段炸制需按对应步骤调整，不套用同一温度。', '放入一小块已擦干的食材时，周围应出现连续细泡；立刻剧烈飞溅、表面很快焦黑说明过热。', '没有合适温度计时，不靠冒烟或滴水猜炸油温度。食材擦干，分批轻放，锅内油不超过锅深的三分之一。'],
      warning: overheat
    }
  }
  if (/热油|泼油|淋油/.test(text)) {
    return {
      title: '淋油增香，先看这几点',
      cues: ['用小锅中火温热少量油，油变得流动顺畅、表面出现轻微细纹就先停火，不等冒烟。', '葱蒜先沥干，盛菜容器要耐热且外壁干燥；离开面部，将少量油缓慢淋入。', '淋下去应有短促滋滋声，葱蒜不迅速变黑；不够香可以下次适当调整，别继续烧到冒烟。'],
      warning: overheat
    }
  }
  if (/黄油/.test(text) && /炒|煎|融化/.test(text)) {
    return {
      title: '黄油用小火，不等冒烟',
      cues: ['小火让黄油融化，出现细小白泡时即可按步骤加食材。', '一般煎炒保持淡黄色；开始变深褐、出现黑点或焦苦味时，立即停火降温。'],
      warning: '不粘锅不要长时间空烧；黄油比普通煎炒油更容易焦。'
    }
  }
  if (/炒香|爆香|煸香/.test(text) && /蒜|姜|葱|辣椒|花椒|香料|豆瓣|咖喱/.test(text)) {
    return {
      title: '先炒香，别把配料炒焦',
      cues: ['先用小火至中小火，油铺开后放入已擦干的姜蒜或香料，应有轻柔滋滋声和小泡。', '蒜末边缘刚泛浅金色、香料出香时就加入后续食材；蒜末、辣椒不要炒到深褐或黑色。', '随后再按本菜步骤调大火力，不用从一开始就大火烧油。'],
      warning: overheat
    }
  }
  if (/煎/.test(text)) {
    return {
      title: '煎之前，油热到这样就够',
      cues: ['锅底擦干，中火温热后加油，转动锅身铺开；不粘锅可先加油再温热。', '油流动顺畅、表面出现轻微细纹时，放入已擦干的食材；边缘出现细泡和均匀滋滋声即可。', '明显焦黑或剧烈飞溅时减小火；下锅后不要频繁移动，等底面定型再翻。'],
      warning: overheat
    }
  }
  if (/热锅|热油|烧热|放油|加油/.test(text) || /翻炒|滑炒|煸炒|炒熟|炒软|炒散|炒至|炒热|炒出|合炒|炒香/.test(text)) {
    // Oil mixed into dough, dressings, boiling water, or cooked rice is not heated oil in a pan.
    if (!/炒|锅烧|热锅|锅.*油|油.*锅/.test(text)) return null
    return {
      title: '热锅热油，新手看这几个特征',
      cues: ['锅底先擦干，用中火温热；不粘锅不要长时间空烧，可先放油再加热。', '转动锅身时油很容易铺成薄层，表面有轻微细纹且没有烟，就可以下已沥干的食材。', '下锅应听到稳定滋滋声；一入锅就焦黑或浓烟，说明太热，要减火。油不需要先起泡。'],
      warning: overheat
    }
  }
  if (/蒸锅|上锅蒸|蒸制|蒸熟|加盖蒸|继续蒸|再蒸|隔水.*蒸/.test(text)) {
    return {
      title: '先大火烧开水，再用中火蒸',
      cues: ['先用大火把蒸锅里的水烧开，再放入食材。', '食材入锅后保持中火，让蒸汽持续、稳定地冒出；不要让锅里的水烧干。'],
      warning: '开盖时先关火，锅盖朝远离自己的方向掀开，避免蒸汽烫伤。'
    }
  }
  if (/煮开|烧开|沸水|水沸/.test(text)) {
    return {
      title: '先大火煮开，再按步骤调火',
      cues: ['需要把水或汤烧开时先用大火。', '开始持续冒泡后，普通煮制转中火；需要慢炖或保持微沸时转小火。'],
      warning: '锅内液体不要装得过满，防止沸腾后溢出。'
    }
  }
  if (/炖|焖|煨|熬|收汁/.test(text)) {
    return {
      title: /收汁/.test(text) ? '收汁用中火，越浓越要勤翻' : '煮开后转小火慢炖',
      cues: [/收汁/.test(text) ? '先用中火让水分蒸发，酱汁开始变浓后改中小火并勤翻动。' : '先用大火煮开，再转小火，保持偶尔冒小泡即可。'],
      warning: '看到锅底变干、出现焦味或烟时立即关火，不要继续硬烧。'
    }
  }
  if (/煮|焯|烫/.test(text)) {
    return {
      title: '这一步用中火保持稳定沸腾',
      cues: ['先用大火把水或汤烧开，食材下锅后调到中火。', '保持持续冒泡即可；液体翻滚过猛、快要溢锅时调小火。'],
      warning: '需要长时间煮时留意水量，避免烧干。'
    }
  }
  if (/锅|加热|炒|煎/.test(text)) {
    return {
      title: '没有特别说明时，从中火开始',
      cues: ['先用中火操作，食材上色太快就调小火；出水多、锅里没有滋滋声时再短暂调大。'],
      warning: overheat
    }
  }
  return null
}

function getSequenceGuidance(step, recipe) {
  const text = `${step.title} ${step.text}`
  if (!/(加入|放入|倒入|下入|回锅|铺入|撒入|淋入)/.test(text)) return null
  if (/混合|调匀|调成|拌匀备用|碗汁/.test(text) && !/回锅|下锅|锅中|锅里/.test(text)) return null
  const candidates = recipe.ingredients.main.concat(recipe.ingredients.seasoning)
    .map(item => item.name.replace(/（可选）/g, ''))
    .filter((name, index, list) => name && list.indexOf(name) === index)
  const actionPattern = /(加入|放入|倒入|下入|铺入|撒入|淋入)/
  const actionParts = step.text.split(/[，；。]/).flatMap(part => {
    const match = part.match(actionPattern)
    if (match) return [part.slice(match.index)]
    if (/回锅|倒回锅/.test(part)) return [part]
    return []
  })
  const actionText = actionParts.join('，')
  const ingredients = candidates
    .filter(name => actionText.includes(name))
    .sort((a, b) => actionText.indexOf(a) - actionText.indexOf(b))
  if (ingredients.length < 2) return null
  return {
    title: '这一锅按这个顺序加',
    order: ingredients.join(' → '),
    note: /先|再|然后|最后|回锅|分次|逐/.test(text)
      ? '照箭头顺序操作，每完成一项再进行下一项。'
      : '按步骤文字出现的顺序加入；每加一种先翻匀，再加下一种。'
  }
}

function getRecipePreparation(recipe) {
  const first = recipe.steps[0].text
  const needProcessing = /大蒜|^蒜$|姜|葱|干辣椒|花椒|香草|罗勒|月桂|百里香|柠檬|青柠|香菜|欧芹|奶酪|黄油|淀粉/
  const items = recipe.ingredients.main.concat(recipe.ingredients.seasoning.filter(item => needProcessing.test(item.name)))
  const seen = new Set()
  return items.filter(item => {if (seen.has(item.name)) return false; seen.add(item.name); return true}).map(item => {
    // Preserve the dish-specific cut/marinade instruction next to the general cleanup guide.
    const clauses = first.split(/[；。]/).filter(Boolean)
    const aliases = {大蒜: '蒜', 小葱: '葱', 猪里脊: '里脊', 鸡腿肉: '鸡', 鸡胸肉: '鸡', 去骨鸡腿肉: '鸡', 胡萝卜: '胡萝卜', 青椒: '青椒'}
    const term = aliases[item.name] || item.name
    const recipeNote = clauses.find(clause => clause.includes(term) && /切|腌|拍|打散|去|泡|沥|擦|洗/.test(clause) && !/煎|炒|炸|蒸|烤|炖|焯|煮|热锅/.test(clause)) || ''
    return { name: item.name, image: item.image, preparation: item.preparation, recipeNote }
  })
}

module.exports = { getHeatGuidance, getSequenceGuidance, getRecipePreparation }
