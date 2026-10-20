Component({
  data: {
    selected: 0,
    tabs: [
      { text: '主页', pagePath: '/pages/home/home' },
      { text: '我的', pagePath: '/pages/profile/profile' }
    ]
  },

  methods: {
    switchTab(event) {
      const index = Number(event.currentTarget.dataset.index)
      const tab = this.data.tabs[index]
      if (!tab || index === this.data.selected) return
      this.setData({ selected: index })
      wx.switchTab({ url: tab.pagePath })
    }
  }
})
