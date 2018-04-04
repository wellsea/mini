//app.js
const host = 'https://lianku.org.cn';
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.request({//初始化经营类型
      url: this.host + "/i/rdc/findAllManageType",
      success: res => {
        this.manageTypeList = res;
      }
    })
    wx.request({//初始化温度类型
      url: this.host + "/i/rdc/findAllTemperType",
      success: res => {
        this.tempTypeList = res;
      }
    })
    wx.request({//初始化商品存放类型
      url: this.host + "/i/rdc/findAllStorageType",
      success: res => {
        this.storageTypeList = res;
      }
    })
    wx.request({//初始化制冷类型
      url: this.host + "/i/rdc/findAllStorageRefreg",
      success: res => {
        this.storageRefregList = res;
      }
    })
    wx.request({//初始建筑类型
      url: this.host + "/i/rdc/findAllStorageStructureType",
      success: res => {
        this.storageStructureList = res;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  host: 'https://lianku.org.cn',
  manageTypeList: {},
  tempTypeList: {},
  storageTypeList: {},
  storageRefregList: {},
  storageStructureList: {},
  globalData: {
    userInfo: null
  },
  stand:''
})