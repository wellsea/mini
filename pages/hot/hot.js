const app = getApp();
const getList = function (that) {
  if (that.data.pageIndex >= that.data.totalPages + 1) {
    that.setData({
      complete: true
    });
    return
  };
  wx.request({//初始化温度类型
    url: "https://lianku.org.cn/i/ShareRdcController/GetSERDCList",
    data: {
      pageNum: that.data.pageIndex,
      pageSize: 10,
      dataType: 3
    },
    success: res => {
      let rdc = res.data.data;
      let list = that.data.rdc;
      for (var i = 0; i < rdc.length; i++) {
        list.push(rdc[i]);
      }
      that.setData({
        rdc: list,
        totalPages: res.data.totalPages
      });
      console.log(that.data.totalPages + '---' + that.data.pageIndex);
      that.data.pageIndex++
      wx.hideLoading();
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rdc: [],
    pageIndex: 1,
    totalPages: 1,
    title: '',
    complete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '热租冷库'
    })
    wx.showLoading({
      title: '加载中'
    })
    const that = this;
    if (app.stand) {
      if (that.data.totalPages)
        that.setData({
          rdc: [],
          pageIndex: 1,
          totalPages: 1
        });
    }
    getList(that, app.stand);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    getList(that, app.stand);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})