//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  center:function(){
    wx.navigateTo({
      url: '../center/center',
    })
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
