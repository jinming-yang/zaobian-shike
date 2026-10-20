Component({
  properties: { steps: { type: Array, value: [], observer: 'refresh' }, pageKey: { type: String, value: '', observer: 'refresh' } },
  data: { visible: false, index: 0, current: [] },
  pageLifetimes: { show() { this.refresh() } },
  methods: {
    refresh() {
      if (!this.properties.pageKey || !this.properties.steps.length) return
      const state = wx.getStorageSync('zaobian_tutorial_v1') || {}
      const visible = !state.skipped && !state[this.properties.pageKey]
      this.setData({ visible, index: 0, current: this.properties.steps[0] })
    },
    next() {
      const index = this.data.index + 1
      if (index < this.properties.steps.length) return this.setData({ index, current: this.properties.steps[index] })
      const state = wx.getStorageSync('zaobian_tutorial_v1') || {}
      state[this.properties.pageKey] = true
      wx.setStorageSync('zaobian_tutorial_v1', state)
      this.setData({ visible: false })
    },
    skip() {
      wx.setStorageSync('zaobian_tutorial_v1', { skipped: true })
      this.setData({ visible: false })
    },
    noop() {}
  }
})
