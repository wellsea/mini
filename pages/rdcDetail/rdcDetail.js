const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '详情',
    id: '',
    deadLine: ['--', '1个月以下', '1~3个月', '3~6个月', '6~9个月', '1年以上', '两年以上', '三年以上', '五年以上'],
    rdc: {},
    pictures: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    wx.request({
      url: app.host + "/i/rdc/yu_findRDCDTOByRDCId",
      data: { rdcID: options.id },
      success: res => {
        if (res.data) {
          let rdc = res.data;
          if (!rdc.orginalPics.length) {
            rdc.orginalPics = rdc.storagePics;
          }
          rdc.partnerInfoEntity.telephone = rdc.partnerInfoEntity.telephone.substring(0, 3) + '-' + rdc.partnerInfoEntity.telephone.substring(3, 7) + '-' + rdc.partnerInfoEntity.telephone.substring(7, 11);
          if (rdc.manageType && rdc.manageType != 0) {
            app.manageTypeList.data.map(function (item) {
              if (item.id = rdc.manageType) {
                rdc.manageType = item.type;
                return
              }
            })
          } else {
            rdc.manageType = '--'
          }
          if (rdc.temperType && rdc.temperType != 0) {
            app.tempTypeList.data.map(function (item) {
              if (item.id = rdc.temperType) {
                rdc.temperType = item.type;
                return
              }
            })
          } else {
            rdc.temperType = '--'
          }
          if (rdc.storageType && rdc.storageType != 0) {
            app.storageTypeList.data.map(function (item) {
              if (item.id = rdc.storageType) {
                rdc.storageType = item.type;
                return
              }
            })
          } else {
            rdc.storageType = '--'
          }

          if (rdc.storageRefreg && rdc.storageRefreg != 0) {
            app.storageRefregList.data.map(function (item) {
              if (item.id = rdc.storageRefreg) {
                rdc.storageRefreg = item.type;
                return
              }
            })
          } else {
            rdc.storageRefreg = '--'
          }
          if (rdc.structure && rdc.structure != 0) {
            app.storageStructureList.data.map(function (item) {
              if (item.id = rdc.structure) {
                rdc.structure = item.type;
                return
              }
            })
          } else {
            rdc.structure = '--'
          }
          let pic=[];
          rdc.orginalPics.forEach(function(item,i){
            pic.push(item.location);
          })
          that.setData({
            rdc: rdc,
            pictures: pic,
            title: rdc.name
          })
        } else {
          wx.showToast({
            title: "信息已删除~",
            icon: 'none',
            duration: 4000
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 2000)
        }
      }
    })
  },
  previewImage: function (e) {
    var that = this,
      //获取当前图片的下表
      index = e.currentTarget.dataset.index,
      //数据源
      pictures = this.data.pictures;
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.rdc.partnerInfoEntity.telephone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})