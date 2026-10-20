Component({
  properties: { nutrition: {type:Object,value:null}, title: {type:String,value:'营养成分参考'} },
  methods: { showSources() {
    const n=this.properties.nutrition
    if(!n) return
    const content = (n.sourceRows||[]).map(x=>`${x.name}：${x.id}${x.page ? '，PDF第'+x.page+'页' : ''}\n${x.url}`).join('\n\n')
    wx.showModal({title:'数据来源与用量',content:(content||'暂无匹配来源')+'\n\n'+(n.assumptions||[]).join('；'),showCancel:false})
  } }
})
