//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    host: 'https://lianku.org.cn',
    banners: [
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
    standRdc:[],
    info:''
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
  formSubmit:function(e){
    var that = this;
    console.log(that.data.currentTab);
    var errMsg = null;
    var flag = true;
    var phoneNumRex = /^1[34578]\d{9}$/;
    var rentData={};
    rentData.sqm = e.detail.value.sqm;
    rentData.contacts = e.detail.value.contacts;
    rentData.tel = e.detail.value.tel;
    rentData.name = e.detail.value.name;
    rentData.areaName = e.detail.value.areaName;
    if (!e.detail.value.sqm) {
      errMsg = "面积输入有误";
      flag = false;
    }
    if (!e.detail.value.contacts) {
      errMsg = "联系人输入有误";
      flag = false;
    }
    if (!e.detail.value.tel || !phoneNumRex.test(e.detail.value.tel)) {
      errMsg = "手机号输入有误";
      flag = false;
    }
    if (that.data.currentTab == 1) {
      rentData.typeCode=0;
      if (!e.detail.value.name) {
        errMsg = "仓库名称输入有误";
        flag = false;
      }
    } else {
      rentData.typeCode = 1;
      if (!e.detail.value.areaName) {
        errMsg = "求租区域输入有误";
        flag = false;
      }
    }
    if (flag) {
      wx.request({
        url: app.host +'/i/ShareRdcController/quickDemand',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: rentData,
        success: function (res) {
          if (res.data.success) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
            that.setData({info:''});
          }
        }
      })
    } else {
      wx.showToast({
        title: errMsg,
        icon: 'none',
        duration: 2000
      })
    }
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
  //跳转到冷库资源
  onTap: function (event) {
    app.stand = 1;
    wx.switchTab({
      url: "/pages/list/list",
      success:function(e){
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  //跳转到热租冷库
  onTapHot: function (event) {
    wx.switchTab({
      url: "/pages/hot/hot",
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中'
    })
   
    wx.setNavigationBarTitle({
      title: '链库-找冷库、上链库',
    })  
  },
  onReady:function(){
    var that = this;
    //获取新库热库数据
    wx.request({
      url: app.host + "/i/ShareRdcController/getColumnRdc",
      data: {
        dataType: 3, typeCode: 1
      },
      success: res => {
        let data = res.data, newRdc = [], hotRdc = [];
        for (let i = 0; i < res.data.length; i++) {
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
        wx.hideLoading();
      }
    })
  }
})
