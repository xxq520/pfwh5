<template>
  <div class="global">
      <mt-header title="修改密码" ref="header" :fixed='true'>
          <mt-button icon="back" slot="left" @click="goBack"></mt-button>
      </mt-header>
    <div class="telwrap">
      <div class="formwrap2">
        <div class="tel">
          <mt-field label='手机号码：'  readonly="readonly" placeholder="请输入手机号" type="tel" v-model="phone" @change="che(phone)"
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
  } from '../../assets/js/common.js'
  import {
    showToast
  } from '../../assets/js/common.js'
  export default {
    name: 'ChangeCode',
    data() {
      return {
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
        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
        this.$refs.header.$el.style.color = "#fff"
    },
    methods: {
        goBack(){
            history.go(-1);
        },
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
          axios.get(this.blockURL+`/qypfs-user/currency/validateCode?mobile=${this.phone}`,{
              responseType: 'arraybuffer'
          }).then(res=>{
              this.imgpath = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.txshow = true
          }).catch(err=>{

          })
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
            axios.post(this.blockURL+`/qypfs-user/currency/sendCode`,{
                code: this.txmsg,
                mobile: this.phone,
                state: 1
            }).then(res=>{
                if (res.data.code == 200){
                    showToast("验证码发送成功");
                    var that = this;
                    this.second = 60;
                    var timer = setInterval(()=>{
                        that.second = that.second-1<0?0:that.second-1;
                        if (that.second==0){
                            clearInterval(timer);
                        }
                    },1000)

                } else {
                    showToast(res.data.message);
                }
                Indicator.close();
            }).catch(err=>{Indicator.close();});
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
            newPassword: this.ycode,
            code: this.code,
            phone: this.phone
        };
        axios.post(this.blockURL + '/qypfs-user/auth/updatePassword', params)
          .then((res) => {
            if (res.data.data) {
              showToast('密码修改成功');
             var that = this;
             setTimeout(()=>{
                 that.$router.go(-1);
             },1500)
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
    background: #FF0000FF;
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
    .telwrap{
        margin-top: 2.2rem;
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
    background-color: #FF5F23FF;
    border-radius: .2222rem
      /* 10/45 */
    ;
    color: #fff;
    margin-top: 2.4444rem
      /* 110/45 */
    ;
  }

  .telwrap #padd {
    color: #FFA700FF;
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
    background-image: url('../../assets/images/nosee-icon.png');
  }

  .global .see {
    background-image: url('../../assets/images/see-icon.png');
  }

</style>
<style scoped>
  .global>>>.mint-cell:last-child,
  .global>>>.mint-cell-wrapper {
    background-image: none;
  }

</style>
