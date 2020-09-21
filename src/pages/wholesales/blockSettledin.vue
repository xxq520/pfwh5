<template>
  <div class="uploading">
    <mt-header title="区域批发商入驻">
      <mt-button icon="back" @click="goBack" slot="left"></mt-button>
    </mt-header>
    <!-- 上传所需资料图片 -->
    <div class="upload-cotent">
      <div class="upload-img">
        <h5 class="title">上传法人身份证正面照</h5>
        <div class="img-con">
          <div class="img-box">
            <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading11"></mt-spinner>
            <img :src="img11Url" alt="" v-if="img11.path">
            <img src="http://pfts.520shq.com/Html5/settled/images/default-classify.png" alt="" v-else>
          </div>
          <div class="upload-box">
            <p class="upload-text">1.请上传法人身份证正面照</p>
            <p class="upload-text">2.上传的照片必须清晰</p>
            <div class="upload-btn">
              <input type="file" accept="image/*" @change="choseImg($event,1,'0011')">
              <button>上传</button>
            </div>
          </div>
        </div>
      </div>
      <div class="upload-img">
        <h5 class="title">上传法人身份证反面照</h5>
        <div class="img-con">
          <div class="img-box">
            <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading21"></mt-spinner>
            <img :src="img21Url" alt="" v-if="img21.path">
            <img src="http://pfts.520shq.com/Html5/settled/images/default-classify.png" alt="" v-else>
          </div>
          <div class="upload-box">
            <p class="upload-text">1.请上传法人身份证反面照</p>
            <p class="upload-text">2.上传的照片必须清晰</p>
            <div class="upload-btn">
              <input type="file" accept="image/*" @change="choseImg($event,1,'0021')">
              <button>上传</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传区域批发商入驻所需资料文字 -->
    <div class="user-content">
      <mt-field label="法人姓名:" placeholder="请输入法人姓名" v-model.trim="bankUser"></mt-field>
      <mt-field label="法人身份证号码:" placeholder="请输入法人身份证号码" v-model.trim="bankCard" type="number"></mt-field>
      <mt-field label="法人手机号码:" placeholder="请输入法人手机号码" v-model.trim="reseverPhonw">
      </mt-field>
      <div @click="toggleModalBox(true)">
        <mt-field label="批发区域:" placeholder="请选择代理批发区域" v-model.trim="selectBlock"></mt-field>
      </div>
      <mt-field label="经营类型:" readonly="readonly">
        <span @click="showSelect(1)" class="select-list">{{value}}</span>
      </mt-field>
    </div>
    <!-- 请输入批发区域弹窗 -->
    <div class="windowArea" v-if="modalBox">
      <div class="mask" @click="toggleModalBox(false)"></div>
      <div class="region_box region_box1">
        <p class="title">请选择</p>
        <ul class="region setup1">
          <li
            :class="{'finish':areaType > index}"
            v-for="(item,index) in areaStatus"
            @click="getSubLocation(index)"
            :key="index">
            <i :class="{'last':index == 3}"></i>
            <span>{{ selectLocation[index+1].value || item }}</span>
          </li>
        </ul>

        <div class="Selection">
          <div class="title">
            <p :class="{'isShow':areaType === (index + 1)}"
               v-for="(item,index) in areaStatus"
               :key="index">{{ item }}</p>
          </div>
          <div class="box">
            <ul class="provinceData" :class="{'isShow':areaType === 1}" type="1">
              <li v-for="(province,index) in provinceData"
                  @click="handleSelect(2,province)"
                  :key="index">{{ province.value }}
              </li>
              <li class="current" v-if="!provinceData.length"> 暂不选择</li>
            </ul>
            <ul class="cityData" :class="{'isShow':areaType === 2}" type="2">
              <li v-for="(city,index) in cityData"
                  @click="handleSelect(3,city)"
                  :key="index">{{ city.value }}
              </li>
              <li class="current" v-if="!cityData.length"> 暂不选择</li>
            </ul>
            <ul class="areaData" :class="{'isShow':areaType === 3}" type="3">
              <li v-for="(area,index) in areaData"
                  @click="handleSelect(4,area)"
                  :key="index">{{ area.value }}
              </li>
              <li class="current" v-if="!areaData.length"> 暂不选择</li>
            </ul>
            <ul class="streetData" :class="{'isShow':areaType === 4}" type="4">
              <li v-for="(street,index) in streetData"
                  @click="handleSelect(null,street)"
                  :key="index">{{ street.value }}
              </li>
              <li class="current" v-if="!streetData.length"> 暂不选择</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <button class="btns" @click="submitData">下一步</button>
    <div class="select-box" v-show="isShow">
      <div class="select-con">
        <mt-picker :slots="options" :showToolbar="showToolbar" ref="genderPicker" :value-key="'label'">
          <div class="select-btn">
            <span class="cancle-btn" @click="closeSelect">取消</span>
            <span class="sure-btn" @click="genderConfirm">确定</span>
          </div>
        </mt-picker>
      </div>
    </div>
    <!-- <kf-con></kf-con> -->
  </div>
</template>
<script>
  import Vue from 'vue'
  import {
    showToast
  } from '../../assets/js/common';
  import {
    Indicator
  } from 'mint-ui';
  import kfCon from "@/components/KF53";
  import {get, post} from "../../assets/js/http";

  export default {
    data() {
      return {
        //是否展示区域批发商的选择弹窗
        modalBox: false,
        //区域批发商批发区域初始化
        areaStatus: ['选择省份', '选择城市', '选择县/区', '选择街道/镇'],
        provinceData: [],//省份
        cityData: [],//市区
        areaData: [],//县区
        streetData: [],//街道
        selectLocation: {
          1: '',//province
          2: '',//city
          3: '',//area
          4: '',//street
        },
        selectBlock: '',
        options: [],//经营类型s
        value: '',//当前经营类型
        bankUser: '', //开户户名
        bankCard: '', //银行卡卡号
        slots: [],
        selectIndex: 0, //选择框类别
        showToolbar: true, //显示选择框
        img11: {
          type: '',
          path: '',
          fileSize: ''
        }, //室内照
        img21: {
          type: '',
          path: '',
          fileSize: ''
        },
        img11Url: '',
        img21Url: '',
        legend11: true,
        legend21: true,
        imgloading11: false,
        imgloading21: false,
        isShow: false,
        reseverPhonw: '',//预留手机号
        handler: function (e) {
          e.preventDefault()
        },
      }
    },
    created() {
      this.getGetdictData(428578);
    },
    components: {
      kfCon
    },
    methods: {
      /**
       * 获取经营类型
       * @param seq
       * @returns {Promise<void>}
       */
      async getGetdictData(seq) {
        const res = await get(this.URL + '/WholesaleManage/GetdictData', {seq});
        this.options = res.data.map(item => {
          return {
            label: item.lable,
            id: item.id
          }
        });
        this.options = [{
          values: this.options,
        }]
        this.value = this.options[0].values[0].label;
      },
      //选择批发区域点击按钮
      toggleModalBox(isShow) {
        this.modalBox = isShow;
        this.getAreaData(1);
        this.areaType = 1;
      },
      /**
       * 处理选中地区点击事件
       * @param type
       * @param item 具体地区
       */
      handleSelect(type, item) {
        if (type !== null) {
          //获取后台地区数据
          this.getAreaData(type, item.id);
          //保存已选地区
          this.selectLocation[type - 1] = item;
          //显示下列地区数据
          this.areaType = type;
        } else {
          //保存已选地区
          this.selectLocation[4] = item;
          this.areaType = 4;
          setTimeout(() => {
            this.modalBox = false;
          }, 500)
        }
        //批发区域转换为文字显示在文本框内
        var blockStr = ''
        for (var i in this.selectLocation) {
          blockStr += this.selectLocation[i].value||''
        }
        this.selectBlock = blockStr
      },
      //获取省市区数据接口调用
      async getAreaData(type = 1, pid = 0) {
        const res = await get(`http://nfxts.520shq.com/localQuickPurchase/brandSquare/region?type=${type}&pid=${pid}`)
        // console.log(res);
        if (res.code === 200) {
          switch (type) {
            case 1:
              this.provinceData = res.data;
              break
            case 2:
              this.cityData = res.data;
              break
            case 3:
              this.areaData = res.data;
              break
            case 4:
              this.streetData = res.data;
              break
            default:
              break
          }
        }
      },
      /**
       * 处理上方select点击事件
       * type 0 1 2 3
       */
      getSubLocation(type) {
        switch (type + 1) {
          case 1:
            if (!this.selectLocation[type]) {
              this.getAreaData(type + 1);
            }
            break
          case 2:
            if (!this.selectLocation[type]) {
              showToast('请先选择省份！', 'center')
              return
            }
            break
          case 3:
            if (!this.selectLocation[type]) {
              showToast('请先选择市区！', 'center')
              return
            }
            break
          case 4:
            if (!this.selectLocation[type]) {
              showToast('请先选择县！', 'center')
              return
            }
            break
          default:
            break
        }
        if (type) {
          const id = this.selectLocation[type].id
          this.getAreaData(type + 1, id);
        }
        //显示下列地区数据
        this.areaType = type + 1;
      },
      openPicker() {
        this.$refs.picker.open();
      },
      openPicker2() {
        this.$refs.picker2.open();
      },
      // 返回按钮
      goBack() {
        this.$router.push({
          path: "/wholesale/uploading",
          query: {
            from: from
          }
        });
        this.saveSession();
      },
      closeTouch() {
        document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {
          passive: false
        }); //阻止默认事件
      },
      openTouch() {
        document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {
          passive: false
        }); //打开默认事件
      },
      // 获取本地存储的填写信息
      readSessionData() {
        this.mercialName = this.datas.mercialName;
        if (this.datas.province) {
          this.province = this.datas.province;
        }
        if (this.datas.city) {
          this.city = this.datas.city;
        }
        if (this.datas.area) {
          this.area = this.datas.area;
        }
        this.road = this.datas.road;
        this.houseNo = this.datas.houseNo;
        this.bankUser = this.datas.bankUser;
        this.bankCard = this.datas.bankCard;
        this.bankName = this.datas.bankName;
        this.bankNo = this.datas.bankNo;
        this.addrExt = this.datas.addrExt;
        this.socialCode = this.datas.socialCode;
        this.licenseBegindate = this.datas.licenseBegindate;
        this.licenseDeadline = this.datas.licenseDeadline;
        // 获取本地图片
        let img11Url = sessionStorage.getItem('img11Url');
        let img21Url = sessionStorage.getItem('img21Url');

        let userImgUrl = sessionStorage.getItem('userImgUrl');

        let img11 = sessionStorage.getItem('img11');
        let img21 = sessionStorage.getItem('img21');

        let userImg = sessionStorage.getItem('userImg');
        if (img21Url) {
          this.img21Url = img21Url;
        } else {
          this.getImgList();
        }
        if (img11Url) {
          this.img11Url = img11Url;
        } else {
          this.getImgList();
        }
        if (img21) {
          this.img21 = JSON.parse(img21);
          this.legend21 = false;
        }
        if (img11) {
          this.img11 = JSON.parse(img11);
          this.legend11 = false;
        }
      },
      // 获取服务器返回图片
      getImgList() {
        let imgData = JSON.parse(sessionStorage.getItem('imgData'));
        if (!imgData) {
          return false;
        }
        if (imgData.length == '0') {
          return false;
        }
        for (let i = 0; i < imgData.length; i++) {
          if (imgData[i].imgType == '0021') {
            this.img21.type = imgData[i].imgType;
            this.img21.path = imgData[i].bankImgpath;
            this.img21.fileSize = imgData[i].bankImgfileSize;
            this.img21Url = imgData[i].imgUrl;
            sessionStorage.setItem('img21', JSON.stringify(this.img21));
            sessionStorage.setItem('img21Url', this.img21Url);
            this.legend21 = false;
          }
          if (imgData[i].imgType == '0011') {
            this.img11.type = imgData[i].imgType;
            this.img11.path = imgData[i].bankImgpath;
            this.img11.fileSize = imgData[i].bankImgfileSize;
            this.img11Url = imgData[i].imgUrl;
            sessionStorage.setItem('img11', JSON.stringify(this.img11));
            sessionStorage.setItem('img11Url', this.img11Url);
            this.legend11 = false;
          }
        }
      },
      //显示选择框并且屏幕不能滚动
      showSelect(index) {
        switch (index) {
          case 1:
            this.slots = this.options;
            break;
        }
        this.isShow = true;

        document.body.style.overflow = "hidden";
      },
      //隐藏显示框且屏滚动
      closeSelect() {
        this.isShow = false;
        document.body.style.overflow = "auto";
        if (this.selectIndex == '5') {
          this.areaname = 'areaname';
        }
      },
      genderConfirm() { // 类别选择确定
        let values = this.$refs.genderPicker.getValues()[0];
        this.isShow = false;
        this.value = this.$refs.genderPicker.getValues()[0].label
        document.body.style.overflow = "auto";
      },
      // 判断用户注册类型改变上传图片的标题文字
      changeText() {

        if (this.merType == '00' || this.merType == '01') {
          this.kh = '开户许可证';
          this.cooType = 1;
        } else if (this.merType == '02') {
          this.kh = '银行卡';
          this.cooType = 2;
        }
      },
      // 上传图片
      choseImg(e, type, imgType) {
        let self = this;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          self.base64 = reader.result;
          this.uploadImg(type, imgType);
        }
      },
      uploadImg(type, imgType) {
        if (imgType == '0011') {
          this.imgloading11 = true;
        }
        if (imgType == '0021') {
          this.imgloading21 = true;
        }
        axios.post(this.URL + '/User/UploadImg?seq=' + this.seq + '&imgType=' + imgType, {
          base64Str: this.base64
        })
          .then(res => {
            let result = JSON.parse(res.data.data);
            if (result.Bool) {
              showToast("图片上传成功");
              if (imgType == '0011') {
                this.img11.type = imgType;
                this.img11.path = result.Data.file_path;
                this.img11.fileSize = result.Data.file_size;
                this.legend11 = false;
                this.imgloading11 = false;
                sessionStorage.setItem('img11', JSON.stringify(this.img11));
              } else if (imgType == '0021') {
                this.img21.type = imgType;
                this.img21.path = result.Data.file_path;
                this.img21.fileSize = result.Data.file_size;
                this.legend21 = false;
                this.imgloading21 = false;
                sessionStorage.setItem('img21', JSON.stringify(this.img21));
              }
              if (res.data.imgList.length == '0') {
                return false;
              }
              for (let i = 0; i < res.data.imgList.length; i++) {
                if (res.data.imgList[i].imgType == '0011') {
                  this.img11Url = res.data.imgList[i].imgUrl;
                  sessionStorage.setItem('img11Url', this.img11Url);
                }
                if (res.data.imgList[i].imgType == '0021') {
                  this.img21Url = res.data.imgList[i].imgUrl;
                  sessionStorage.setItem('img21Url', this.img21Url);
                }
              }
            } else {
              showToast("图片上传失败");
              if (imgType == '0011') {
                this.imgloading11 = false;
              }
              if (imgType == '0021') {
                this.imgloading21 = false;
              }
            }
          })
          .catch(res => {
            showToast("图片上传失败");
            if (imgType == '0011') {
              this.imgloading11 = false;
            }
            if (imgType == '0021') {
              this.imgloading21 = false;
            }
          })
      },
      // 保存数据
      saveSession() {
        this.datas.seq = this.seq;
        this.datas.cooType = this.cooType;
        this.datas.mercialName = this.mercialName;
        Vue.set(this.datas, 'merType', this.merType);
        Vue.set(this.datas, "province", this.province);
        Vue.set(this.datas, "city", this.city);
        Vue.set(this.datas, "area", this.area);
        this.datas.reseverPhonw = this.reseverPhonw;
        this.datas.havingFixedBusiAddr = 1;
        this.datas.road = this.road;
        this.datas.houseNo = this.houseNo;
        this.datas.bankUser = this.bankUser;
        this.datas.bankCard = this.bankCard;
        this.datas.bankNo = this.bankNo;
        this.datas.bankName = this.bankName;
        this.datas.addrExt = this.addrExt;
        this.datas.province = this.province;
        this.datas.city = this.city;
        this.datas.area = this.area;
        this.datas.bankAcctType = this.bankType;
        sessionStorage.setItem('sessions', JSON.stringify(this.datas))
      },
      // 提交信息
      submitData() {
        if (this.bankUser == '' || this.bankUser == undefined) {
          showToast('请填写法人姓名');
          return false;
        }
        if (this.bankCard == '' || this.bankCard == undefined) {
          showToast('请填写法人身份证号码');
          return false;
        }
        if (this.reseverPhonw == '' || this.reseverPhonw == undefined) {
          showToast('请填写法人手机号码');
          return false;
        }
        if (this.value == '' || this.value == undefined) {
          showToast('请选择经营类型');
          return false;
        }
        if (this.value == '' || this.value == undefined) {
          showToast('请选择批发区域');
          return false;
        }
        if (this.img5.path == '' || this.img5.path == undefined) {
          showToast('请先上传开户许可证照');
          return false;
        }
        if (this.img9.path == '' || this.img9.path == undefined) {
          showToast('请先上收银台照');
          return false;
        }
        this.saveSession();
        this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img1')));
        this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img2')));
        this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img5')));
        this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img9')));
        this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img10')));
        let model = this.datas;
        Indicator.open('加载中...');
      },
    },
    watch: {
      isShow(val) {
        if (val) {
          this.closeTouch()
        } else {
          this.openTouch()
        }
      }
    }
  }

</script>
<style>
  body {
    background-color: #f5f5f5;
  }

  .uploading .user-content {
    margin: 0 0 .6667rem 0;
  }

  .uploading .mint-cell {
    /* border-bottom:.0444rem solid #eee; */
  }

  .uploading .mint-cell:last-child {
    border: none;
  }

  .uploading .mint-cell-title {
    width: 140px;
  }

  .uploading .mint-cell-value .mint-field-core {
    text-align: right;
    padding-right: 10px;
    font-size: 0.62rem
  }

  .uploading .upload-cotent {
    background-color: #fff;
  }

  .uploading .upload-img {
    padding: 10px;
    border-top: .0444rem solid #eee;
  }

  .uploading .upload-img:first-child {
    border: 0 none;
  }

  .uploading .upload-img .title {
    font-weight: normal;
    font-size: .6667rem;
    color: #333;
    margin-bottom: 10px;
  }

  .uploading .img-con {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .uploading .img-con img {
    height: 100%;
  }

  .uploading .legend {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    border-width: 1.2rem 1.2rem 0 0;
    border-style: solid;
    border-color: #f23030 transparent transparent transparent;
  }

  .uploading .legend .legend-text {
    position: absolute;
    top: -1.2rem;
    left: 0;
    font-size: .5333rem;
    color: #fff;
  }

  .uploading .img-box {
    position: relative;
    width: 6.6667rem;
    height: 4.4444rem;
    border: .0444rem solid #eee;
    padding: .4444rem;
    overflow: hidden;
  }

  .uploading .upload-box {
    width: 7.3111rem;
  }

  .uploading .upload-text {
    font-size: .5333rem;
    color: #333;
  }

  .uploading .upload-btn {
    position: relative;
  }

  .uploading .upload-btn input {
    position: absolute;
    left: 0;
    top: .8444rem;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .uploading .upload-btn button {
    width: 5.5556rem;
    height: 1.5111rem;
    background-color: #f23030;
    color: #fff;
    font-size: .7111rem;
    border: 0 none;
    border-radius: 5px;
    margin-top: .8444rem;
  }

  .uploading .btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.7778rem;
    background-color: #f23030;
    color: #fff;
    font-size: .7556rem;
    border: 0 none;
  }

  .uploading .select-list {
    position: relative;
    padding: 8px 30px 8px 10px;
    border: .0444rem solid #eee;
    border-radius: 5px;
  }

  .el-checkbox__inner {
    z-index: 0;
  }

  .uploading .select-list:after {
    display: block;
    content: "";
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -10px;
    width: 10px;
    height: 10px;
    border: #ccc solid;
    border-width: 1px 1px 0 0;
    transform: rotate(135deg);
    /* margin-bottom: 10px; */

  }

  .uploading .select-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  .uploading .select-box .select-con {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }

  .uploading .select-box .select-btn {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: .6667rem;
    background-color: #e6e6e6
  }

  .uploading .select-box .sure-btn {
    color: #2696ff;
  }

  .uploading .select-box .cancle-btn {
    color: #4c4c4c;
  }

  .uploading .search-btn {
    border: 0 none;
    background-color: #f23030;
    color: #fff;
    font-size: .6222rem;
  }

  .uploading .imgloading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3)
  }

  .uploading .mint-spinner-snake {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -14px;
    margin-top: -14px;
  }

  /* 账户类型 */
  .radio_btn {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0 10px;
  }

  .radio_btn .mint-radiolist-title {
    width: 40%;
    font-size: 16px;
    margin: 0;
    color: #212121;
  }

  .radio_btn .mint-cell-wrapper {
    padding: 0;
    text-align: right;
  }

  .radio_btn .mint-radiolist-label {
    padding: 0;
  }

  .radio_btn .mint-radio-input:checked + .mint-radio-core {
    background-color: #f23030;
    border-color: #f23030;
  }

  .own {
    padding: 0.4rem;
  }

  .own .ownTime {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  .own .ownTime #zhi {
    font-size: .6667rem;
    margin: .4444rem;
    padding-top: 7px;
  }

  .own .ownTime .numipt {
    border-radius: 5px;
    border: 1px solid #c6c6c6;
    width: 43%;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .1111rem .2222rem;
    margin-top: .444rem;
  }

  .own .ownTime .numipt input {
    width: 90%;
  }

  .own .ownTime .numipt img {
    width: .69rem;
    height: .69rem;
  }

  .own .title {
    font-size: .5778rem;
  }

  .uploading .mint-cell-wrapper {
    border-bottom: 1px solid #f8f8f8
  }

  .windowArea .region_box {
    width: 100%;
    height: 80%;
    position: absolute;
    top: 20%;
    left: 0;
    background-color: #fff;
    border-radius: .4444rem .4444rem 0 0;
    box-sizing: border-box;
    z-index: 999;
  }

  .windowArea .region_box .title {
    height: 1.5333rem;
    line-height: 1.5333rem;
    text-align: center;
    font-size: .5333rem;
    color: #333333;

  }

  .windowArea .region_box ul.region {
    width: 100%;
    padding: 0 .5333rem;
    padding-bottom: .5333rem;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
  }

  .windowArea .region_box ul.region li {
    width: 100%;
    display: -moz-box; /* Firefox */
    display: -ms-flexbox; /* IE10 */
    display: -webkit-box; /* Safari */
    display: -webkit-flex; /* Chrome, WebKit */
    display: box;
    display: flexbox;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 1.7778rem;
    line-height: 1.7778rem;
    color: #ec0746;
  }

  .windowArea .region_box ul.region li i {
    width: .2222rem;
    height: .2222rem;
    border: 1px solid #ec0746;
    border-radius: 50%;
    position: relative;
  }

  .windowArea .region_box ul.region li i::after {
    content: '';
    width: 1px;
    height: 1.5111rem;
    position: absolute;
    top: .2222rem;
    left: 50%;
    background-color: #ec0746;
  }

  .windowArea .region_box ul.region li i.last::after {
    content: "";
    width: 0;
    height: 0;
    background-color: #fff;
  }

  .windowArea .region_box ul.region li span {
    padding-left: 1.0222rem;
    color: #999999;
    font-size: .6222rem;

  }

  .windowArea .region_box ul.region li.act span {
    /*color: #ec0746;*/
    color: #333;

  }

  /* 选择后 */
  .windowArea .region_box ul.region li.finish span {
    color: #333;

  }

  /* 当前状态 */
  .windowArea .region_box ul.region li.finish i,
  .windowArea .region_box ul.region li.act i {
    background-color: #ec0746;
  }

  /* 城市县区街道选择 */
  .windowArea .region_box .Selection {
    background-color: #fbfbfb;
    width: 100%;
    box-sizing: border-box;
    padding: .5778rem 0 0 0;
    height: 14rem;
  }

  .windowArea .region_box .Selection p {
    font-size: .6222rem;
    color: #999999;
    padding: 0 .5333rem .2222rem;
    display: none;
    text-align: left;
  }

  .windowArea .region_box .Selection p.isShow {
    display: block;
  }

  /* 所有ul 可滚动的样式 */
  .windowArea .region_box .Selection .box {
    height: 11rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .windowArea .region_box .Selection ul {
    display: none;
    width: 100%;
    /*overflow: auto;*/
    /*overflow-y:scroll;*/
    padding-bottom: 2rem;
  }

  .windowArea .region_box .Selection ul.isShow {
    display: block;
  }

  .windowArea ul.hidden {
    display: none;
  }

  .windowArea ul.isShow {
    display: block;
  }

  .windowArea .region_box ul.province {

  }

  .windowArea .region_box .Selection ul li {
    height: 1.9556rem;
    line-height: 1.9556rem;
    /* padding-left: 1.3333rem;  */
    position: relative;
    padding: 0 .5333rem 0 1.9556rem;
    font-size: 15px;

  }

  .windowArea ul li span {
    position: absolute;
    left: .5333rem;
    color: #999999;
  }

  /* 选择当前样式 */
  .windowArea .region_box .Selection ul li.current {
    background-color: #fff;

  }

  .windowArea .region_box ul li.current::after {
    content: "";
    width: .6667rem;
    height: .6667rem;
    /*background: url('../img/android/drawable-hdpi/icon.png') no-repeat;*/
    position: absolute;
    top: 50%;
    margin-top: -.3333rem;
    right: .5333rem;
    background-size: 100%;
    background-position: center;
    /* background-color: #e4393c; */
  }

  /* 选择区域模态框 */
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 66;
    /*display: none;*/
  }

</style>
