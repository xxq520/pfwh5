<template>
  <div class="glode">
    <!--首页头部-->
    <mt-header title="绑定银行卡" ref="header" :fixed="true">
      <mt-button icon="back" slot="left" @click="goBack"></mt-button>
    </mt-header>
    <div class="bank-item">
      <mt-field
        label="开户行："
        class="mint-cellNone"
        placeholder="选择开户行"
        v-model="bank"
        readonly
        @click.native.capture="bankfn()"
      >
        <i class="el-icon-arrow-right"></i>
      </mt-field>

      <mt-field
        v-if="bank && preBank.indexOf(bank) == -1"
        label="选择开户地区："
        placeholder="开户地区"
        v-model.trim="addressStr"
        class="select-area"
        :readonly="true"
        @click.native.capture="showAddress = true"
      ></mt-field>

      <div class="search-zh" v-if="bank && preBank.indexOf(bank) == -1">
        <mt-field
          label="搜索支行："
          placeholder="检索支行的关键字"
          v-model.trim="searchSubBank"
        ></mt-field>
        <span @click="onSubBank">查询</span>
      </div>

      <mt-field
        v-if="bank && preBank.indexOf(bank) == -1"
        label="开户行支行："
        placeholder="选择开户行支行"
        :readonly="true"
        v-model.trim="bankname"
      ></mt-field>

      <mt-field
        label="开户名："
        placeholder="您的银行卡开户名"
        v-model.trim="username"
        @blur.native.capture="userfn"
      ></mt-field>
      <mt-field
        label="银行卡号："
        placeholder="您的银行卡账号"
        v-model.trim="number"
        @blur.native.capture="banknumfn"
        type="number"
      ></mt-field>
      <mt-field
        label="证件号："
        placeholder="开户人身份证号码"
        :attr="{ maxlength: 18,minlength:15 }"
        v-model="idcard"
        @blur.native.capture="idCardblur"
        type="text"
      ></mt-field>
    </div>
    <div class="bank-item">
      <mt-field
        label="手机号码："
        class="mint-cellNone"
        placeholder="银行预留手机号"
        v-model="phone"
        type="number"
      >
        <div class="captbtn captTime imgCodeImgUrl" v-if="picCode.imgCodeImgUrl">
          <img :src="picCode.imgCodeImgUrl" @click="captbtnfn('pic')" alt />
        </div>
        <div class="captbtn" @click="captbtnfn('pic')" v-else>获取图形码</div>
      </mt-field>
      <mt-field
        label="图 形 码："
        placeholder="请输入图形码"
        v-model="picCode.code"
        @blur.native.capture="phoneblur"
        type="tel"
      ></mt-field>
      <mt-field
        label="验证码："
        placeholder="输入手机验证码"
        v-model="captcha"
        type="number"
        @blur.native.capture="captmsgfn"
      >
        <div class="captbtn captTime" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
        <div class="captbtn" @click="captbtnfn('code')" v-else>获取验证码</div>
      </mt-field>
    </div>

    <div class="bank-btn" @click="submit">立即提交</div>

    <!-- 银行列表 -->
    <mt-popup v-model="bankVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="bankslots" value-key="openingBank" @change="bankchange"></mt-picker>
    </mt-popup>

    <!-- 支行检索列表弹框 -->
    <mt-popup v-model="bankVisible2" position="bottom" class="visiblebtn-box">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="bankVisible2 = false">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn2">确定</mt-button>
      </div>
      <mt-picker :slots="branchBankSlots" value-key="bankName" @change="bankchange2"></mt-picker>
    </mt-popup>

    <!-- 开户地区弹框 -->
    <div v-if="showAddress">
        <check-address @bindtap="bindtap"></check-address>
    </div>
  </div>
</template>

<script type="text/javascript">
let preBank = ['中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '交通银行'];

import { showToast, getPicCode } from "../../../assets/js/common";
import checkAddress from './checkAddress';

export default {
  data() {
    return {
      showAddress: false, //城市弹窗隐藏
      addressStr: '',
      addressList: [],
      searchSubBank: '',
      preBank: preBank, // 五大行不需要填支行
      bankId: "", // 开户行id
      bank: "", // 开户行中文名称
      bankModel: "",
      branchBankModel: '',
      bankname: "", // 支行名称
      username: "", // 开户名
      number: "", // 银行卡号
      idcard: "", // 身份证
      phone: "", // 手机号
      captcha: "", // 手机验证码
      captbtn: false,
      captlist: 59,
      bankVisible: false,
      bankVisible2: false,
      bankslots: [
        {
          flex: 1,
          values: [],
          className: "bankslot",
          textAlign: "center"
        }
      ],
      branchBankSlots: [
        {
          flex: 1,
          values: [],
          className: "bankslot",
          textAlign: "center"
        }
      ],
      picCode: {
        code: "", // 图形验证码
        imgCodeImgUrl: "" // 图形验证码地址
      },
      userid: this.$store.state.userInfo.userId
    };
  },
  components: {
    checkAddress
  },
  mounted() {

    this.$refs.header.$el.style.background =
      "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
    this.$refs.header.$el.style.color = "#fff";
    this.getInfo();
  },
  methods: {
    //获取银行卡列表的信息
    getInfo() {
      axios({
        url: this.blockURL + "/qypfs-user/userBankCard/openingBanks",
        method: "get"
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;

          this.bankslots[0].values = data;
        } else {
          Toast(res.data.message);
        }
      });
    },
    bindtap(e, data) {
      this.showAddress = !this.showAddress;
      let str = "";
      let address = data
      let arr = [];
      Object.keys(address).map((item, index) => {
          str += address[item].value || "";
          if (address[item].value) {
              arr.push(address[item])
          }
      });
      if (!str) return;
      this.addressList = arr;
      this.addressStr = str;
    },
    onSubBank() {
      if (!this.addressList.length) return Toast('请先选择开户地区');
      if (!this.searchSubBank) return Toast('请输入检索关键字');
      let params = {
        cityId: this.addressList[this.addressList.length - 1].id,
        key: this.searchSubBank
      }
      axios.get(this.blockURL+'/qypfs-user/userBankCard/getBranchBankList', { params: params }).then(res => {
        console.log(res, '===getBranchBankList');
        if(res.data.code == 200) {
            this.branchBankSlots[0].values = res.data.data;
            this.bankVisible2 = true;
        } else {
            Toast(res.data.message || '系统错误');
        }
      })
    },
    bankfn() {
      this.bankVisible = true;
    },
    quedingfn() {
      if (this.bankVisible) {
        this.bankVisible = false;
        this.bankId = this.bankModel ? this.bankModel.id : "";
        this.bank = this.bankModel ? this.bankModel.openingBank : "";
        return true;
      }
    },
    quedingfn2() {
      if (this.bankVisible2) {
        this.bankVisible2 = false;
        this.bankname = this.branchBankModel ? this.branchBankModel.bankName : '';
      }
    },
    quxiaofn() {
      if (this.bankVisible) {
        this.bankVisible = false;
        if (this.bankId == "") {
          showToast("开户行必须选择！");
          return false;
        }
      }
    },
    bankchange(picker, values) {
      this.bankModel = values[0];
      return true;
    },
    bankchange2(picker, values) {
      this.branchBankModel = values[0];
      return true;
    },
    userfn() {},
    banknumfn() {},
    phoneblur() {
      let phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      // console.log(this.phone.length)
      if (this.phone.length > 0 && !phonereg.test(this.phone)) {
        showToast("请输入正确的手机号码！", "middle");
        return false;
      }
      return true;
    },
    idCardblur() {
      let idreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (this.idcard.length > 0 && !idreg.test(this.idcard)) {
        showToast("请输入正确的身份证号码！", "middle");
        return false;
      }
      return true;
    },
    captbtnfn(type) {
      let that = this;
      let phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      if (this.phone == "" || !phonereg.test(that.phone)) {
        showToast("请输入正确的手机号码！", "middle");
      } else {
        switch (type) {
          case "pic":
            // 获取图形验证码
            getPicCode(that.phone)
              .then(res => {
                this.$set(this.picCode, "imgCodeImgUrl", res);
              })
              .catch(err => {
                showToast("获取失败，请稍后再试！", "middle");
              });
            break;
          case "code":
            axios({
              url: this.blockURL + "/qypfs-user/currency/sendCode",
              method: "post",
              data: {
                code: that.picCode.code,
                mobile: that.phone,
                state: 2
              }
            }).then(res=>{
                if (res.data.code!=200) {
                    showToast(res.data.message, "middle");
                } else {
                    that.captbtn = true;
                    var timer = setInterval(function() {
                        that.captlist--;
                        if (that.captlist == 0) {
                            that.captbtn = false;
                            that.captlist = 59;
                            clearInterval(timer);
                        }
                    }, 1000);
                }
            }).catch(err=>{
                showToast("网络出错，请稍后再试！", "middle");
            });
            break;
        }
      }
    },
    captmsgfn() {
      if (this.captcha == "") {
        showToast("请输入验证码");
        return false;
      }
    },
    submit() {
      if (this.bank == "") {
        showToast("开户行必须选择");
      } else if (this.preBank.indexOf(this.bank) == -1 && this.bankname == "") {
        showToast("开户行支行不能为空");
      } else if (this.username == "") {
        showToast("开户名不能为空");
      } else if (this.number == "") {
        showToast("银行卡号不能为空");
      } else if (this.idcard == "") {
        showToast("证件号不能为空");
      } else if (this.phone == "") {
        showToast("手机号不能为空");
      } else if (this.picCode.code == "") {
        showToast("图形验证码不能为空");
      } else if (this.captcha == "") {
        showToast("未填写验证码");
      } else {
        let post = {
          name: this.username, // 开户名
          openingBankId: this.bankId, // 开户行id
          subBranch: this.bankname || this.bank, // 支行名称
          cardNumber: this.number, // 银行卡号
          identityCard: this.idcard, // 身份证
          mobileNumber: this.phone, // 手机号
          vcCode: this.captcha, // 手机验证码
          userId: this.userid //用户id
        };

        axios({
          url: this.blockURL + "/qypfs-user/userBankCard/insertCard",
          method: "post",
          data: post
        }).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
             Toast('绑定成功');
             setTimeout(() => {
                  this.$router.go(-1)
             }, 1500);

          }else{
              Toast(res.data.message)
          }
        });
      }
    },
    goBack() {
      try {
        window.action.app_back();
      } catch (err) {
        history.go(-1);
      }
    }
  }
};
</script>

<style scoped>
.glode {
  min-height: 100vh;
  font-size: 0.65rem;
  padding-bottom: 3.5em;
  margin-top: 1.7rem;
}
.glode /deep/ .select-area .mint-cell-title{
  width: 8em !important;
}
.search-zh{
  position: relative;
  background: #fff;
  border-top: 1px solid #e6e6e6;
}
.search-zh .mint-cell.mint-field{
  width: 85%;
  border: 0 none;
}
.search-zh span{
  display: flex;
  width: 2.5rem;
  height: 60%;
  justify-content: center;
  align-items: center;
  font-size: .667rem;
  color: #666;
  position: absolute;
  z-index: 2;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.bank-item {
  overflow: hidden;
  margin-top: 0.5rem;
}

.mint-cell {
  border-top: 1px solid #e6e6e6;
}

.glode >>> .mint-cell {
  border-bottom: none;
}

.mint-cellNone {
  border-top: none;
}

.glode >>> .mint-field .mint-cell-title {
  width: 7em;
  padding-right: 0.8em;
  text-align: justify;
  text-align-last: justify;
  color: #333;
}

.glode >>> .mint-cell-wrapper {
  font-size: 14px;
  background-image: none;
}

.captbtn {
  display: inline-block;
  padding-left: 0.5rem;
  margin-left: 0.5em;
  line-height: 1.8em;
  border-left: 1px solid #ccc;
  color: #ff0000;
}

.captTime {
  color: #999;
}

.bank-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2.27rem;
  font-size: 0.65rem;
  color: white;
  line-height: 2.27rem;
  text-align: center;
  background: rgba(255, 96, 35, 1);
}

.mint-popup {
  width: 100%;
}
.visiblebtn-box.mint-popup.mint-popup-bottom /deep/ .picker .picker-item{
  font-size: .52rem;
}

.visiblebtn {
  padding: 0.5rem;
  border-bottom: 1px solid #eaeaea;
  overflow: hidden;
}

.visiblebtn .quxiao {
  float: left;
  border: 1px solid #ccc;
}

.visiblebtn .queding {
  float: right;
}

.glode >>> .mint-button--small {
  font-size: 14px;
  padding: 0 8px;
  height: 25px;
}

.glode >>> .mint-button--default {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.imgCodeImgUrl {
}
</style>
