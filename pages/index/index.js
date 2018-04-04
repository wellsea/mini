//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    host: 'https://lianku.org.cn',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    movies: [
      { url: 'https://img.liankur.com/picture/advert/34/advert34_1522136563772.jpg' },
      { url: 'https://img.liankur.com/picture/advert/33/advert33_1522136536210.jpg' },
      { url: 'https://img.liankur.com/picture/advert/35/advert35_1522136585231.jpg' },
      { url: 'https://img.liankur.com/picture/advert/36/advert36_1522136607750.jpg' }
    ],
    searchArray: ['冷库资源', '热门出租', '达标冷库'],
    index: 0,
    currentTab: 0,
    newRdc:[],
    hotRdc:[],
    standRdc:[]
  },
  //事件处理函数
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  /** 
    * 滑动切换tab 
    */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  onekey:function(e){
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function () {
    var that = this;
     //获取新库热库数据
    wx.request({
      url: app.host+"/i/ShareRdcController/getColumnRdc",
      data: {
        dataType: 3, typeCode: 1
      },
      success: res => {
        let data = res.data, newRdc = [], hotRdc=[];
        for (let i = 0; i < res.data.length;i++){
          if (i < 3) {
            data[i].storageType = app.storageTypeList.data[data[i].codeLave3].type;
            newRdc.push(data[i]);
          } else {
            data[i].buildtype = data[i].buildtype == 2 ? "多层库" : "单层库";
            data[i].storageplatform = data[i].storageplatform == 1 ? "有月台" : "无月台";
            data[i].storagerefreg = data[i].storagerefreg == 0 ? 1 : data[i].storagerefreg
            data[i].storagerefreg = app.storageRefregList[data[i].storagerefreg];
            hotRdc.push(data[i]);
          }
        }
        that.setData({ newRdc: newRdc });
        that.setData({ hotRdc: hotRdc });
      }
    })
    wx.request({
      url: app.host + "/i/rdc/findNewReachStroage",
      success: res => {
        that.setData({ standRdc: res.data });
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.setNavigationBarTitle({
      title: '链库-找冷库、上链库',
    })  
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
