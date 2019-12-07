// miniprogram/pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onAdd(e){
    wx.navigateTo({
      url:'../add/index'
    })
  }
})