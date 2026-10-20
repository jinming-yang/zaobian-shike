const { getIngredientGuide } = require('../../data/ingredient-guide')

const ILLUSTRATED_SOURCES = {
  番茄: '/assets/stickers/v2/tomato.png',
  鸡蛋: '/assets/stickers/v2/egg.png',
  胡萝卜: '/assets/stickers/v2/carrot.png',
  蘑菇: '/assets/stickers/v2/mushroom.png',
  水发香菇: '/assets/stickers/v2/mushroom.png',
  小白菜: '/assets/stickers/v2/greens.png',
  生菜: '/assets/stickers/v2/greens.png',
  罗马生菜: '/assets/stickers/v2/greens.png',
  菜心: '/assets/stickers/v2/greens.png',
  菠菜: '/assets/stickers/v2/greens.png',
  面包: '/assets/stickers/v2/bread.png',
  吐司: '/assets/stickers/v2/bread.png',
  恰巴塔面包: '/assets/stickers/v2/bread.png',
  罗勒: '/assets/stickers/v2/mint.png',
  罗勒叶: '/assets/stickers/v2/mint.png',
  新鲜香草: '/assets/stickers/v2/mint.png'
}

Component({
  properties: {
    name: { type: String, value: '', observer: 'refreshImage' },
    size: { type: Number, value: 82 }
  },
  data: { source: '', failed: false },
  lifetimes: {
    attached() { this.disposed = false; this.refreshImage() },
    detached() { this.disposed = true }
  },
  methods: {
    refreshImage() {
      const guide = getIngredientGuide(this.properties.name)
      if (this.disposed) return
      const source = ILLUSTRATED_SOURCES[this.properties.name] || (guide ? guide.image : '')
      this.setData({source, failed: !source})
    },
    onImageError(event) {
      if (this.disposed || event.currentTarget.dataset.source !== this.data.source) return
      this.setData({source: '', failed: true})
    },
    retryImage() { if (this.data.failed) this.refreshImage() }
  }
})
