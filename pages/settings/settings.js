const { ALLERGEN_OPTIONS } = require('../../data/recipe-meta')
const { getSettings, saveSettings } = require('../../utils/user-store')

const TAG_OPTIONS = ['减脂', '增重', '宝宝成长', '厨房新手', '快手料理', '一人食', '家常口味', '素食偏好']
const MODE_OPTIONS = [
  { value: 'hide', label: '自动隐藏', note: '菜谱列表不显示命中过敏原的菜' },
  { value: 'warn', label: '标注并警示', note: '保留菜谱，但在列表和详情页醒目标注' },
  { value: 'off', label: '暂不开启', note: '保存过敏原，但不影响菜谱展示' }
]
const SECTION_META = {
  general: { title: '设置', note: '调整显示、烹饪提醒与使用教程。设置保存在当前设备。' },
  tags: { title: '个人标签', note: '选择适合自己的标签，用于调整主页推荐顺序，可多选。' },
  allergens: { title: '忌口与过敏原', note: '选择需避开的配料及展示模式。请同时核对实际食品配料表。' }
}

Page({
  data: {
    section: 'general',
    pageTitle: SECTION_META.general.title,
    pageNote: SECTION_META.general.note,
    settings: getSettings(),
    allergenOptions: [],
    tagOptions: [],
    modeOptions: MODE_OPTIONS
  },

  onLoad(options) {
    const section = ['general', 'tags', 'allergens'].includes(options.section) ? options.section : 'general'
    const meta = SECTION_META[section]
    this.setData({ section, pageTitle: meta.title, pageNote: meta.note })
    wx.setNavigationBarTitle({ title: meta.title })
  },

  onShow() {
    this.renderSettings(getSettings())
  },

  persist(patch) {
    this.renderSettings(saveSettings(patch))
  },

  renderSettings(settings) {
    this.setData({
      settings,
      allergenOptions: ALLERGEN_OPTIONS.map(name => ({ name, active: settings.allergens.includes(name) })),
      tagOptions: TAG_OPTIONS.map(name => ({ name, active: settings.tags.includes(name) }))
    })
  },

  toggleAllergen(event) {
    const value = event.currentTarget.dataset.value
    const current = this.data.settings.allergens
    const allergens = current.includes(value) ? current.filter(item => item !== value) : current.concat(value)
    this.persist({ allergens })
    if (allergens.length && this.data.settings.allergyMode === 'off') {
      wx.showActionSheet({
        itemList: ['自动隐藏相关菜品', '标注并警示相关菜品', '暂不开启'],
        success: result => this.persist({ allergyMode: ['hide', 'warn', 'off'][result.tapIndex] })
      })
    }
  },

  selectAllergyMode(event) {
    this.persist({ allergyMode: event.currentTarget.dataset.value })
  },

  toggleTag(event) {
    const value = event.currentTarget.dataset.value
    if (!TAG_OPTIONS.includes(value)) return
    const current = this.data.settings.tags
    this.persist({ tags: current.includes(value) ? current.filter(item => item !== value) : current.concat(value) })
  },

  adjustServings(event) {
    const calorieServings = Math.min(8, Math.max(1, this.data.settings.calorieServings + Number(event.currentTarget.dataset.delta)))
    this.persist({ calorieServings })
  },

  changeSwitch(event) {
    this.persist({ [event.currentTarget.dataset.key]: event.detail.value })
  },

  replayTutorial() {
    wx.removeStorageSync('zaobian_tutorial_v1')
    wx.showToast({ title: '已重新开启教程', icon: 'none' })
    const tutorial = this.selectComponent('#page-guide')
    if (tutorial) tutorial.refresh()
  }
})
