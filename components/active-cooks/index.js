const { getActiveSessions } = require('../../utils/user-store')
const { getRecipeById } = require('../../data/recipes')

Component({
  properties: {
    currentId: { type: String, value: '' },
    bottomOffset: { type: Number, value: 140 }
  },

  data: {
    expanded: false,
    activeCooks: []
  },

  lifetimes: {
    attached() {
      this.refresh()
      this.refreshInterval = setInterval(() => this.refresh(), 1000)
    },
    detached() {
      if (this.refreshInterval) clearInterval(this.refreshInterval)
    }
  },

  pageLifetimes: {
    show() { this.refresh() },
    hide() { this.setData({ expanded: false }) }
  },

  methods: {
    refresh() {
      const activeCooks = getActiveSessions().map(session => {
        const recipe = getRecipeById(session.recipeId)
        if (!recipe) return null
        const timer = session.timer
        const remaining = timer && timer.status === 'running' && timer.deadline
          ? Math.max(0, Math.ceil((Number(timer.deadline) - Date.now()) / 1000))
          : Number(timer && timer.remainingSeconds || 0)
        let statusText = `第 ${Number(session.currentStep || 0) + 1} 步`
        if (timer && timer.status === 'running') statusText = `计时中 ${this.formatTime(remaining)}`
        if (timer && timer.status === 'paused') statusText = `计时暂停 ${this.formatTime(remaining)}`
        if (timer && timer.status === 'done') statusText = '计时完成'
        return { ...session, name: recipe.name, image: recipe.image, statusText }
      }).filter(Boolean)
      this.setData({ activeCooks })
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
      const secs = (seconds % 60).toString().padStart(2, '0')
      return `${mins}:${secs}`
    },

    toggleExpanded() {
      this.setData({ expanded: !this.data.expanded })
    },

    openCook(event) {
      const id = event.currentTarget.dataset.id
      if (id === this.properties.currentId) {
        this.setData({ expanded: false })
        return
      }
      const session = this.data.activeCooks.find(item => item.recipeId === id)
      if (!session) return
      const url = `/pages/cook/cook?id=${id}&servings=${session.servings || 1}&resume=1`
      const pages = getCurrentPages()
      const route = pages.length ? pages[pages.length - 1].route : ''
      if (route === 'pages/home/home' || route === 'pages/profile/profile') wx.navigateTo({ url })
      else wx.redirectTo({ url })
    }
  }
})
