const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'详情',
    id:'',
    deadLine:['--', '1个月以下', '1~3个月', '3~6个月', '6~9个月', '1年以上', '两年以上', '三年以上', '五年以上'],
    rdc:{},
    pictures:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    wx.request({//初始化温度类型
      url: app.host + "/i/ShareRdcController/getSEByID.json",
      data: { id: options.id},
      success: res => {
        if (res.data.success){
          let rdc = res.data.entity;
          if (!rdc.orgfiles) {
            rdc.orgfiles = rdc.files ? rdc.files : [];
          }
          rdc.partnerInfoEntity.telephone = rdc.partnerInfoEntity.telephone.substring(0, 3) + '-' + rdc.partnerInfoEntity.telephone.substring(3, 7) + '-' +rdc.partnerInfoEntity.telephone.substring(7, 11);
          that.setData({
            rdc: rdc,
            pictures: rdc.orgfiles,
            title:rdc.title
          })
        }else{
          wx.showToast({
            title: res.data.message,
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