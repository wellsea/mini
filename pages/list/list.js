// pages/list/list.js
const app = getApp();
const getList = function (that, stand, areaid, audit, cityid, keyword, managetype, provinceid, sqm, storagetempertype){  
  if (that.data.pageIndex >= that.data.totalPages + 1) {
    that.setData({
      complete: true
    });
    return
  };
  wx.showLoading({
    title: '加载中'
  })
  wx.request({//初始化温度类型
    url: "https://lianku.org.cn/i/rdc/yu_getRdcList",
    data: {
      pageNum: that.data.pageIndex,
      pageSize: 10,
      istemperaturestandard: stand ? stand : '',
      areaid: areaid ? areaid : '',
      audit: audit ? audit : '',
      cityid: cityid ? cityid : '',
      keyword: keyword ? keyword : '',
      managetype: managetype ? managetype : '',
      provinceid: provinceid ? provinceid : '',
      sqm: sqm ? sqm : '',
      storagetempertype: storagetempertype ? storagetempertype : ''
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
    pageIndex:1,
    totalPages:1,
    title: '',
    complete: false,
    province: [{ areaId: '',provinceId:"",provinceName:"全国",provinceOrderId:-1}],
    city: [{ cityID: '', cityName: '不限', provinceID: -1 }],
    area: [{ areaid: '', areaName: '不限', cityid:'', id: -1 }],
    manageTypeList: [{id:'',type:'不限'}],
    tempTypeList: [{ id: '', type: '不限' }],
    sqmList: [{ id: '', type: "不限" }, { id: "<1000", type: "1000㎡以下" }, { id: "1000~3000", type: "1000~3000㎡" }, {id: "3000~6000",type: "3000~6000㎡"},
          { id: "6000~12000", type: "6000~12000㎡" }, { id: "12000~20000", type: "12000~20000㎡" }, {id: ">20000",type: "20000㎡以上"}],
    auditList: [{ "id": "", "name": "不限" },{ "id": "-1,0,1", "name": "未认证" },  { "id": 2, "name": "已认证" }],
    pindex: 0,
    cindex: 0,
    aindex: 0,
    mindex: 0,
    tindex: 0,
    sindex: 0,
    uindex: 0,
    keyword:''
  },
  pickerProvince: function (e) {
    var index = e.detail.value;
    var currentId = this.data.province[index].provinceId;
    this.setData({
      pindex: e.detail.value 
    })
    if (currentId){
      //获取城市列表
      wx.request({
        url: app.host + "/i/city/findCitysByProvinceId",
        data: { provinceID: currentId },
        success: res => {
          let citylist = res.data;
          let list = [{ cityID: '', cityName: '不限', provinceID: -1 }];
          for (var i = 0; i < citylist.length; i++) {
            list.push(citylist[i]);
          }
          this.data.city = [];
          this.setData({
            rdc: [],
            pageIndex: 1,
            totalPages: 1,
            city: list,
            cindex: 0,
            aindex: 0,
            area: [{ areaid: '', areaName: '不限', cityid: '', id: -1 }],
          });
          getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, '', this.data.keyword, this.data.manageTypeList[this.data.mindex].id, currentId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
        }
      })
    }else{
      this.setData({
        rdc: [],
        pageIndex: 1,
        totalPages: 1,
        city: [{ cityID: '', cityName: '不限', provinceID: -1 }],
        area: [{ areaid: '', areaName: '不限', cityid: '', id: -1 }],
        cindex: 0,
        aindex: 0,
      });
      getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, '', this.data.keyword, this.data.manageTypeList[this.data.mindex].id, '', this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
    }
    
  },
  pickerCity: function (e) {
    var index = e.detail.value;
    var currentId = this.data.city[index].cityID;
    this.setData({
      cindex: e.detail.value
    })
    if (currentId) {
      //获取区域列表
      wx.request({
        url: app.host + "/i/city/findAreaByCityId",
        data: { cityId: currentId },
        success: res => {
          let arealist = res.data;
          let list = [{ areaid: "", areaName: '不限', cityid: "", id: -1 }];
          for (var i = 0; i < arealist.length; i++) {
            list.push(arealist[i]);
          }
          this.data.area = [];
          this.setData({
            rdc: [],
            totalPages: 1,
            pageIndex: 1,
            area: list,
            aindex: 0
          });
          getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
        }
      })
    }else{
      this.setData({
        rdc: [],
        totalPages: 1,
        pageIndex: 1,
        area: [{ areaid: "", areaName: '不限', cityid: "", id: -1 }],
        aindex: 0
      });
      getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, '', this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
    }
    
  },
  pickerArea: function (e) {
    var index = e.detail.value;
    var currentId = this.data.area[index].areaid;
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      aindex: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  pickerMan: function (e) {
    var index = e.detail.value;
    var currentId = this.data.manageTypeList[index].id;
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      mindex: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  pickerTemp: function (e) {
    var index = e.detail.value;
    var currentId = this.data.tempTypeList[index].id;
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      tindex: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  pickerSqm: function (e) {
    var index = e.detail.value;
    var currentId = this.data.sqmList[index].id;
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      sindex: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  pickerAudit: function (e) {
    var index = e.detail.value;
    var currentId = this.data.auditList[index].id;
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      uindex: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  search:function(e){
    this.setData({
      rdc: [],
      pageIndex: 1,
      totalPages: 1,
      keyword: e.detail.value
    })
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
   var that = this; 
    wx.setNavigationBarTitle({
      title: '冷库资源'
   })
   wx.showLoading({
     title: '加载中'
   })
    //获取省列表
    wx.request({
      url: app.host+"/i/city/findProvinceList",
      success: res => {
        let prolist = res.data;
        let list = that.data.province;
        for (var i = 0; i < prolist.length; i++) {
          list.push(prolist[i]);
        }
        that.setData({
          province: list
        }); 
      }
    })
    let manlist = [{ id: '', type: '不限' }];
    let templist = [{ id: '', type: '不限' }];
    for (var i = 0; i < app.manageTypeList.data.length; i++) {
      manlist.push(app.manageTypeList.data[i]);
    }
    for (var i = 0; i < app.tempTypeList.data.length; i++) {
      templist.push(app.tempTypeList.data[i]);
    }
    that.setData({
      manageTypeList: manlist,
      tempTypeList: templist
    }); 
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
    //(that, stand, areaid, audit, cityid, keyword, managetype, provinceid, sqm, storagetempertype)
    getList(this, app.stand, '', this.data.auditList[this.data.uindex].id, this.data.city[this.data.cindex].cityID, this.data.keyword, this.data.manageTypeList[this.data.mindex].id, this.data.province[this.data.pindex].provinceId, this.data.sqmList[this.data.sindex].id, this.data.tempTypeList[this.data.tindex].id)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})