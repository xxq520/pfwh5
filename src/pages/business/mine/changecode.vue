<template>
  <div class="global">
    <!-- <topnav :top='topnav'></topnav> -->
    <mt-header title="修改密码">
      <mt-button icon="back" slot="left" v-if="fromApp" @click='backPageLogin'></mt-button>
      <router-link :to="path" slot="left" v-else>
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="telwrap">
      <div class="formwrap2">
        <div class="tel">
          <mt-field label='手机号码：' placeholder="请输入手机号" type="tel" v-model="phone" @change="che(phone)"
             :attr="{maxlength:11}">
            <div @click="gettxCode" class="inoutcode">获取图形码</div>
          </mt-field>
        </div>
        <div class="codewrap">
          <div class="code">
            <mt-field label='图形码：' placeholder="请输入图形码" type="text" v-model="txmsg">
              <img :src="imgpath" v-show="txshow">
            </mt-field>
          </div>
        </div>
        <div class="codewrap">
          <div class="code">
            <mt-field label='验证码：' placeholder="请输入验证码" type="number" v-model="code">
              <div class="captTime capbtn" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
              <div class="inoutcode" @click="getcode" v-else>获取验证码</div>
            </mt-field>
          </div>
        </div>
        <div class="ycode">
          <mt-field label='新密码：' placeholder="请输入新密码" :type="isSee ? 'text':'password'" v-model="ycode">
            <span class="see-icons" :class="{see:isSee}" @click="taggle"></span>
          </mt-field>
        </div>
      </div>
      <span id="padd">新密码长度为6-18位</span>
      <div class="btnwrap">
        <mt-button class="btn" type="default" @click="changePwd">确定修改</mt-button>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
  import {
    phoneRuler
  } from '../../../assets/js/common.js'
  import {
    showToast
  } from '../../../assets/js/common.js'
  export default {
    name: 'ChangeCode',
    data() {
      return {
        topnav: {
          title: '修改密码'
        },
        code: '',
        phone: '',
        ycode: '',
        captlist: 60,
        captbtn: false,
        seq: 0,
        isSee: false,
        fromApp: '',
        path: '',
        isRead: false,
        isLogin: false,
        imgpath: '',
        txshow: false,
        txmsg: ''
      }
    },
    created() {
      this.getStorage();
      let fromApp = '';
      let isLogin = '';
      if (this.$route.query.app) {
        fromApp = this.$route.query.app;
      } else if (sessionStorage.getItem('app')) {
        fromApp = sessionStorage.getItem('app');
      }
      if (fromApp) {
        this.fromApp = fromApp;
      }
      if (this.$route.query.from) {
        isLogin = this.$route.query.from;
      }
      if (isLogin == 'login') {
        this.isLogin = isLogin;
      }
    },
    mounted() {
      document.querySelector("body").setAttribute("style", "background-color: #f5f5f5");
    },
    methods: {
      che() {
        var r = this.phone.match(/^[0-9]*$/);
        if (r == null) {
          showToast('请输入正确格式的手机号！', 'bottom')
        }
      },
      //获取图形码
      gettxCode() {

        if (this.phone == '') {
          showToast("请输入有效的手机号码");
          return;
        }

        axios.get(this.URL + '/PersonalCenter/GetGraphicsCode', {
          params: {
            mobile: this.phone
          }
        }).then((res) => {

          this.imgpath = res.data;
          this.txshow = true
        })
      },
      CheckIsAndroid() {
        var browser = {
          versions: function () {
            var u = navigator.userAgent,
              app = navigator.appVersion;
            return { //移动终端浏览器版本信息
              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
              iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
              iPad: u.indexOf('iPad') > -1, //是否iPad
            };
          }(),
        }
        //if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
        //    return false;
        //}
        if (browser.versions.android)
          return true;
        return false;
      },
      // 获取本地缓存
      getStorage() {
        if (sessionStorage.getItem('seq')) {
          this.seq = sessionStorage.getItem('seq');
        } else {
          this.seq = 0;
        }
        let from = this.$route.query.from;
        let userType = sessionStorage.getItem('userType');
        if (!from) {
          this.phone = sessionStorage.getItem('mobile');
          this.path = "/mineindex";
          this.isRead = true;
          if (userType !== '' && (userType == '2' || userType == '3' || userType == '4' || userType == '7')) {
            this.path = '/wholesale/storageSetting';
            this.isRead = true;
          }
        } else {
          this.phone = '';
          this.path = '/login';
          this.isRead = false;
        }

      },
      getcode() {
        let that = this;
        if (!that.phone) {
          showToast('手机号码不能为空');
        } else if (phoneRuler(that.phone) == false) {
          showToast('请输入正确的手机号码');
        } else if (this.txmsg == '') {
          showToast('请输入图形码');
        } else {
          Indicator.open();
          that.captlist = 60;
          that.captbtn = true;
          var timer = setInterval(function () {
            that.captlist--;
            if (that.captlist == 0) {
              that.captbtn = false;
              clearInterval(timer);
            };
          }, 1000);
          axios.get(this.URL + '/PersonalCenter/GetVerificationCode', {
              params: {
                mobile: this.phone,
                verifyCode: this.txmsg,
                smsStr:0
              }
            })
            .then((res) => {
              if (res.data == '200') {

                showToast('短信发送成功');

              } else if (res.data == '100') {
                showToast('手机格式不正确');
              } else if (res.data == '400') {
                showToast('获取失败');
              }
              Indicator.close();
            });
        }
      },
      // 切换显示隐藏密码
      taggle() {
        this.isSee = !this.isSee;
      },
      backPageLogin() {
        if (this.fromApp && this.isLogin == 'login') {
          window.action.backPageLogin();
        } else {
          this.$router.go(-1);
        }
      },
      //修改密码
      changePwd() {
        if (this.phone == '') {
          showToast('请输入有效的手机号码');
          return;
        }
        if (this.code == '') {
          showToast('请输入验证码');
          return;
        }
        if (this.code.length != 4) {
          showToast('请输入4位数验证码');
          return;
        }
        if (this.ycode == '') {
          showToast('请输入新密码');
          return;
        }
        if (this.ycode.length < 6 || this.ycode.length > 18) {
          showToast('请输入6-18位新密码');
          return;
        }
        let params = {
          seq: this.seq,
          pwd: this.ycode,
          yzcode: this.code,
          mobile: this.phone
        };
        axios.post(this.URL + '/User/ModifyUserInfo', params)
          .then((res) => {
            if (res.data) {
              showToast('密码修改成功');
              if (this.fromApp) {
                setTimeout(() => {
                  window.action.backPageLogin();
                }, 2000);
              } else {
                setTimeout(() => {
                  this.$router.push('/login');
                }, 2000);
              }
            } else {
              showToast('密码修改失败');
            }
          });
      }
    }
  }

</script>

<style>
  .global .formwrap2 {
    margin-top: .3333rem
      /* 15/45 */
    ;
    background: #fff;
    padding: 0 .5rem;
  }

  .formwrap2 .tel {
    height: 2.2222rem
      /* 100/45 */
    ;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .formwrap2 .codewrap .code {
    height: 100%;
  }

  .formwrap2 .mint-field .mint-cell-title {
    width: 80px;
  }

  .formwrap2 .mint-cell {
    height: 100%;
    width: 100%;
    border-bottom: 1px solid #dddddd;
  }

  .formwrap2 .mint-cell:first-child .mint-cell-wrapper {
    padding-left: 0px;
    padding-right: 0px;
  }

  .formwrap2 .inoutcode {
    /* width: 3.7778rem; */
    color: #fff;
    background: #ff5558;
    font-size: .6222rem
      /* 28/45 */
    ;
    border-radius: .1778rem
      /* 8/45 */
      .1778rem
      /* 8/45 */
    ;
    padding: .3333rem
      /* 15/45 */
    ;
  }

  .global .telwrap .btnwrap {
    display: flex;
    justify-content: center
  }

  .global .telwrap .btn {
    width: 14.6667rem
      /* 660/45 */
    ;
    height: 1.7778rem
      /* 80/45 */
    ;
    font-size: .6667rem
      /* 30/45 */
    ;
    background-color: #ff5558;
    border-radius: .2222rem
      /* 10/45 */
    ;
    color: #fff;
    margin-top: 2.4444rem
      /* 110/45 */
    ;
  }

  .telwrap #padd {
    color: #f46868;
    font-size: .5556rem
      /* 25/45 */
    ;
    padding-left: .8889rem
      /* 40/45 */
    ;
    display: block;
    margin-top: .4rem
      /* 18/45 */
    ;
  }

  .global .see-icons {
    display: block;
    width: 1rem;
    height: 1rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('../../../assets/images/nosee-icon.png');
  }

  .global .see {
    background-image: url('../../../assets/images/see-icon.png');
  }

</style>
<style scoped>
  .global>>>.mint-cell:last-child,
  .global>>>.mint-cell-wrapper {
    background-image: none;
  }

</style>
