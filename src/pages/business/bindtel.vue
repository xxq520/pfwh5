<template>
   <div class="global">
       <topnav :top='topnav'></topnav>
       <div class="content">
           <div class="tips">
               <div class="tipscontent">
                   <img src="../../assets/images/safe.png" alt="">
                   <div class="text">
                       <p>为确保您的账号安全</p>
                       <p>请及时绑定手机号码</p>
                   </div>
               </div>
           </div>
           <div class="btform" >
                    <div class="tel">
                        <img src="../../assets/images/ipone.png" alt="">
                        <mt-field placeholder="请输入手机号" type="tel" v-model="phone"  v-on:input='watchnum()'></mt-field>
                    </div>
                    <div class="codewrap">
                        <div class="code">
                            <img src="../../assets/images/code.png" alt="">
                            <mt-field placeholder="请输入短信验证码" type="tel" v-model="yzcode" v-on:input='watchnum()'></mt-field>
                        </div>
                        <div class="captTime capbtn" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
                        <div class="inoutcode" @click="getcode" v-else>获取验证码</div>
                    </div>
                    <div class="ycode">
                        <img src="../../assets/images/ycode.png" alt="">
                        <mt-field placeholder="请输入邀请码" type="tel" v-model="ycode"  v-on:input='watchnum()'></mt-field>
                    </div>
               <mt-button class="btn" type="default" @click="showlog" :disabled='ifdisabled'>立即绑定</mt-button>
           </div>
       </div>
       <!-- 登录选择弹框 -->
       <!-- <div class="cellwrap">
         <mt-popup id="showconten" v-model="popupVisible" popup-transition="popup-fade">
           <div class="popcontent">
               <img src="../../assets/images/saoma.png" alt="">
               <img src="../../assets/images/codelog.png" alt="">
           </div>
           <div id="closebtn" class="el-icon-error" @click="coloselog"></div>
       </mt-popup>
       </div> -->
   </div>
</template>

<script type="text/javascript">
import '../../assets/css/bindtel.css'
import {phoneRuler, showToast} from '../../assets/js/common.js'
export default {
   name: 'Bindtel',
   data() {
       return {
           topnav:{
               title:'绑定手机号'
           },
           phone:'',
           yzcode:'',//验证码
           ycode:'',//邀请码
           openId : '',
           popupVisible:false,
           ifdisabled:true,
           captlist:60,
           captbtn:false
           //返回码说明：100，必传参数不完整；101：验证码有误；102：该用户不存在，请输入邀请码； 200：绑定成功；201：绑定失败
       }
   },
   watch:{

   },
   created(){
        let ycode = sessionStorage.getItem('wholesalerSeq');
        if(ycode){
            this.ycode = ycode;
        }
        this.getCode1()
    },
   mounted(){
     document.querySelector("body").setAttribute("style","background-color: #fff")
    // this.getCode1()
   },
   methods: {
       //判断按钮禁用状态
       watchnum(){
           if (this.phone && this.yzcode) {
               this.ifdisabled = false
           }else if (!this.phone || !this.yzcode) {
               this.ifdisabled = true
           }
       },
       getQuery(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
      },
       getCode1(){
         const code = this.getQuery('code')
        // const code = this.$route.query.code
          let state = '123'
          axios.get(this.URL + '/User/GetWeiXinUser?code='+code+'&state='+state).then(res=>{
            //   alert('code='+res.data.retCode)
              if(res.data.retCode == 200 || res.data.retCode == 202){
                // alert('openId='+res.data.openId);
                this.openId = res.data.openId
                if(res.data.shopper.accountType ==1){
                    this.$router.push({path:'/supplier'});
                }else if(res.data.shopper.accountType == 2){
                    this.$router.push({path:'/wholesale'});
                }else{
                    showToast('该账号不是商家或批发商');
                }
                if(this.yqcode != ''){
                    sessionStorage.setItem('wholesalerSeq',this.yqcode);
                }
                sessionStorage.setItem("seq",datas.SEQ);
                sessionStorage.setItem("userType",datas.accountType);
                sessionStorage.setItem("mobile",datas.mobile);
                sessionStorage.setItem("p",datas.pwd);
            }else{
                showToast('授权失败');
                this.$router.push({path:'/login'});
            }
          });
       },
       //登录选择弹框
       showlog(){
        //  alert(this.getQuery('code'))
           this.popupVisible=true;
          let data = {
            openid:this.openId,
            mobile:this.phone,
            yzcode:this.yzcode,
            yqcode:this.ycode
          }
           //绑定手机号码
           axios.post(this.URL + '/User/BindWx',data).then(res=>{
                this.popupVisible=false;
            //    alert('retCode='+res.data.retCode);
               if(res.data.retCode == 200){
                    let datas = res.data.shopper;
                    alert(datas.accountType);
                    if(datas.accountType ==1){
                        this.$router.push({path:'/supplier'});
                        showToast('绑定成功');
                    }else if(datas.accountType == 2){
                        this.$router.push({path:'/wholesale/orderManagement'});
                        showToast('绑定成功');
                    }else{
                        showToast('该账号不是商家或批发商');
                    }
                    sessionStorage.setItem("seq",datas.SEQ);
                    sessionStorage.setItem("userType",datas.accountType);
                    sessionStorage.setItem("mobile",datas.mobile);
                    sessionStorage.setItem("p",datas.pwd);
               }else if(res.data.retCode == 101){
                   showToast('验证码错误');
               }else if(res.data.retCode == 102){
                   showToast('该用户不存在');
               }else if(res.data.retCode == 201){
                   showToast('绑定失败');
               }
            })
            .catch(res => {
                this.popupVisible=false;
            });
       },
       coloselog(){
         this.popupVisible=false;
       },
       getcode(){
          let that = this;
          if (!that.phone) {
            MessageBox('提示', '手机号码不能为空');
          }else if (phoneRuler(that.phone) == false) {
            MessageBox('提示', '请输入正确的手机号码');
          }else{
            that.captbtn = true;
            axios.get(this.URL + '/PersonalCenter/GetVerificationCode?mobile='+that.phone);
            var timer = setInterval(function(){
              that.captlist--;
              if(that.captlist == 0){
                that.captbtn = false;
                that.captlist = 59;
                clearInterval(timer);
              };
            },1000);
          }
        },
     }
}
</script>

<style>
  .btform .mint-cell-wrapper{
    background-image:none
  }
  /* 登录选择弹窗 */
  .cellwrap .mint-popup{
      background: none !important;
      top: 80% !important;
  }
  .add_bg{
    background: #fff;
  }
  .captbtn{
    display:inline-block;
    padding-left:0.5rem;
    margin-left:0.5em;
    line-height:1.8em;
    border-left:1px solid #ccc;
    color:red;
  }
  .captTime{
    color:#999;
    font-size: .6222rem /* 28/45 */;
    margin-bottom: .4444rem /* 20/45 */;
  }
</style>
