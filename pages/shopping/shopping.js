const { getShoppingList, toggleShoppingPurchased, markAllShoppingPurchased, deleteShoppingItem, clearShoppingList } = require('../../utils/user-store')
const { formatIngredientAmount } = require('../../utils/amount')

Page({
  data: { items: [], pendingCount: 0 },
  onShow() { this.refresh() },
  refresh() {
    const items = getShoppingList().map(item => ({
      ...item,
      amountText: formatIngredientAmount(item.amount, item.unit, item.name),
      recipeText: (item.recipeNames || []).join('、')
    }))
    this.setData({ items, pendingCount: items.filter(item => !item.purchased).length })
  },
  togglePurchased(event) { toggleShoppingPurchased(event.currentTarget.dataset.id); this.refresh() },
  deleteItem(event) { deleteShoppingItem(event.currentTarget.dataset.id); this.refresh() },
  purchaseAll() { if (!this.data.items.length) return; markAllShoppingPurchased(); this.refresh(); wx.showToast({ title: '已全部标记', icon: 'none' }) },
  deleteAll() {
    if (!this.data.items.length) return
    wx.showModal({ title: '全部删除？', content: '采购清单中的所有条目都会被移除。', cancelText: '取消', confirmText: '全部删除', confirmColor: '#c75534', success: result => { if (result.confirm) { clearShoppingList(); this.refresh() } } })
  }
})
