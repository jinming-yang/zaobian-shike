const GUIDE = {
  home: [['先找一道想吃的菜', '直接搜菜名或食材，比如“鸡蛋”“牛肉”。也可以往下滑，按分类慢慢挑。'], ['收藏常做的菜', '看到喜欢的菜就点爱心，下次可以在“我的”里直接找到。'], ['家里有什么就做什么', '不想买菜时，点“家里有什么”；需要买东西时，就把食材放进采购清单。']],
  detail: [['先看清楚再开做', '这里能看到时间、难度、营养和过敏提示。确认没问题，再点“开始备菜”。']],
  prep: [['先把东西备齐', '先选吃饭人数，用量会自动调整。主要食材和调味料都能单独加入采购清单。'], ['少了食材也没关系', '点“缺少某几样”，勾上家里没有的东西，我们会推荐更适合的菜。']],
  cook: [['跟着当前这一步做', '先看步骤文字。需要下锅时会告诉你先放什么、后放什么，也会标明用小火、中火还是大火。'], ['想同时做另一道菜', '点“同时做另一道菜”去选菜。原来那道菜不会消失，计时也会继续；点右下角“进行中的菜”就能切回来。']],
  complete: [['做好了，开饭吧！', '这里可以看看大概营养，也能把菜谱分享出去。这次做菜会自动记进你的报告。']],
  pantry: [['把家里有的食材加进来', '搜到食材后点一下，再按实际数量调整。然后点“看看能做什么”。调味料不用填。']],
  shopping: [['照着清单买就行', '买到一样就点“我已采购”；不需要了就删除。顶部两个按钮可以一次处理全部。']],
  profile: [['看看最近做了什么', '这里只统计真正完成的菜。营养数字是估算值，不等于你实际吃下去的量。'], ['上次没做完也能接着来', '点未完成记录，可以接着上次做，也可以重新开始。收藏和个人偏好也都在这里。']],
  settings: [['按你的习惯来设置', '可以改份数、过敏原、计时声音和屏幕常亮。想再看教程，也可以在页面底部重新打开。']]
}

// Keep page lifecycle callbacks intact while adding common onboarding and share behavior.
function installPageFeatures() {
  const originalPage = Page
  Page = function (definition) {
    const load = definition.onLoad
    definition.onLoad = function (options) {
      if (load) load.call(this, options)
      const key = definition.tutorialPageKey || this.route.split('/').pop()
      this.setData({ tutorialSteps: GUIDE[key] || [], tutorialKey: key })
      if (key === 'settings') {
        const section = this.data.section || 'general'
        const guides = {
          general: [['常用设置都在这里', '按需要打开或关闭热量、屏幕常亮、声音和震动。想重看教程就点页面底部的按钮。']],
          tags: [['告诉我们你平时怎么吃', '标签可以多选。选好以后，首页会把更合适的菜排在前面；再点一次就是取消。']],
          allergens: [['把不能吃的东西选出来', '选好后，可以直接隐藏相关菜，也可以只显示提醒。下单或开做前，仍要再看一眼食品包装配料表。']]
        }
        this.setData({ tutorialSteps: guides[section], tutorialKey: `settings-${section}` })
      }
      if (['home', 'detail', 'complete'].includes(key) && wx.showShareMenu) {
        wx.showShareMenu({ menus: key === 'complete' ? ['shareAppMessage'] : ['shareAppMessage', 'shareTimeline'] })
      }
    }
    const unload = definition.onUnload
    definition.onUnload = function () {
      this._pageDisposed = true
      if (unload) unload.call(this)
    }
    definition.onShareAppMessage = function () {
      const key = definition.tutorialPageKey || this.route.split('/').pop()
      const recipe = ['detail', 'complete'].includes(key) && this.data.recipe
      return recipe
        ? { title: `${recipe.name}｜跟着灶边食刻简单做菜`, path: `/pages/detail/detail?id=${encodeURIComponent(recipe.id)}`, imageUrl: recipe.image }
        : { title: '灶边食刻｜简单做菜，好好吃饭', path: '/pages/home/home' }
    }
    // A completion share opens the recipe, never fabricates a completed cooking record.
    if ((definition.data || {}).ingredientStars || (definition.data || {}).categories) {
      definition.onShareTimeline = function () {
        const recipe = this.data.recipe
        return recipe ? { title: `${recipe.name}｜灶边食刻`, query: `id=${encodeURIComponent(recipe.id)}`, imageUrl: recipe.image } : { title: '灶边食刻｜简单做菜，好好吃饭' }
      }
    }
    originalPage(definition)
  }
}

module.exports = { installPageFeatures }
