<template lang="html">
  <div class="login-con">
    <div class="bg-con"></div>
    <div class="logo-con">
        <h1 class="logo-box">
            <img src="@/assets/images/newimg/logo.png" alt="">
        </h1>
        <p class="logo-desc">链接上下游商家的统一入口</p>
    </div>
    <div class="inputs-con">
        <div class="label input-label">
            <span class="area-code">+86 <i class="iconfont icon-you"></i></span>
            <mt-field placeholder="请输入用户名" type="number" class="inputs" v-model.trim="account" @input="isLogin"></mt-field>
        </div>
        <div class="label input-label" v-show="!isPhone">
            <mt-field placeholder="请输入密码" class="inputs" type="password" v-model.trim="password" @input="isLogin"></mt-field>
            <button class="small-btn">忘记密码</button>
        </div>
        <div class="label input-label" v-show="isPhone">
            <mt-field placeholder="请输入验证码" class="inputs" v-model.trim="msgCode" @input="isLogin"></mt-field>
            <send-msg :account="account"></send-msg>
        </div>
        <div class="label button-label">
            <button class="small-btn" v-show="!isPhone" @click="cutLogin">验证码登录</button>
            <button class="small-btn" v-show="isPhone" @click="cutLogin">密码登录</button>
            <!-- <button class="small-btn" v-show="!isPhone">忘记密码</button> -->
            <router-link class="small-btn" to="/register">注册账号</router-link>
        </div>
        <div class="btns-con">
            <mt-button type="default" size="large" class="large-btn login" :class="disable?'btn-cur':''" @click="loging">登录</mt-button>
            <mt-button type="default" size="large" class="large-btn settled" @click="cutPopup">入驻入口</mt-button>
        </div>
    </div>
    <div class="main">
        <quik-login></quik-login>
    </div>
    <mt-popup v-model="visiblePopup">
        <div class="popup-con">
            <div class="title-con">
                <p>请选择入驻身份</p>
                <i class="iconfont icon-guanbi" @click="cutPopup"></i>
            </div>
            <div class="popup-list">
                <router-link :to="{ name: '', params: {} }" class="popup-items" v-for="i in 3" :key="i">
                    <div class="img-box">
                        <img src="@/assets/images/newimg/logo.png" alt="">
                    </div>
                    <p>批发商入驻</p>
                    <i class="iconfont icon-you"></i>
                </router-link>
            </div>
        </div>
    </mt-popup>
  </div>
</template>
<script>
import QuikLogin from "../componentn/QuickLogin.vue";
import SendMsg from "../componentn/SendMsg.vue";
import {showToast} from "@/assets/js/common.js";
import {loginApi} from "@/assets/js/interface.js";
export default {
    data () {
        return {
            isPhone:false,//切换登录方式
            disable:false,//登录按钮是否能点击
            account:"",//用户账号
            password:"",//用户密码
            msgCode:"",//用户短信验证码
            visiblePopup:false,
        }
    },
    components:{
        QuikLogin,
        SendMsg
    },
    methods:{
        // 切换登录方式
        cutLogin(){
            this.password = "";
            this.msgCode = "";
            this.disable = false;
            this.isPhone = !this.isPhone;
        },
        // 判断登录按钮是否能点击
        isLogin(){
            if(!this.isPhone && this.account != "" && this.password != ""){
                this.disable = true;
            }else if(this.isPhone && this.account != "" && this.msgCode != ""){
                this.disable = true;
            }else{
                this.disable = false;
            }
        },

        // 登录
        loging(){
            // 账号 密码 或者 短信验证码为空  不能点击
            if(!this.disable) return;
            let obj = {
                account:this.account
            }
            // 判断登录方式
            if(!this.isPhone){
                this.$set(obj,"pwd",this.password);
                if(this.password.length<6 || this.password.length>20){
                    showToast("请输入6-20位密");
                    return;
                }
            }else{
                this.$set(obj,"msgCode",this.msgCode);
            }
            // 接口请求
            loginApi(obj).then(res => {
                console.log(res);
            })
        },
        // 关闭popup
        cutPopup(){
            this.visiblePopup = !this.visiblePopup;
        }
    }
}
</script>

<style lang="css">
    .login-con .bg-con{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:14.8889rem;
        background:url("https://ndhimg.520shq.com/UploadFile/ImgFile/20200727/202007271723061045.jpeg") no-repeat top center;
        background-size:contain;
        z-index:-1;
    }
    .login-con .logo-con{
        text-align:center;
        font-size:.8rem;
        color:#fff;
        padding-top:2.6667rem;
        margin-bottom:.9778rem;
    }
    .login-con .logo-box{
        width:3.3333rem;
        height:3.3333rem;
        margin:0 auto .4rem;
    }
    .login-con .inputs-con{
        width:14.4667rem;
        border-radius:5px;
        margin:0 auto 1.8889rem;
        padding:.3333rem 1.0222rem .0267rem;
        background-color:#fff;
        box-shadow: 0 3px 6px rgba(0,0,0,.2);
    }
    .login-con .inputs-con .button-label{
        padding-top:.7556rem;
        margin-bottom:.6667rem;
    }
    .login-con .small-btn{
        color:#b9b9b9;
    }
    .login-con .btns-con .large-btn{
        margin-bottom:.9333rem;
        color:#fff;
        font-size:.7111rem;
    }
    .login-con .btns-con .settled{
        background-color:#ff3f4e;
    }
    .login-con .mint-popup{
        width:12.0444rem;
        border-radius:5px;
        overflow:hidden;
        padding:0 .7111rem .4444rem;
    }
    .login-con .popup-con .title-con{
        position:relative;
        padding-top:1.0444rem;
        font-size:.8rem;
        color:#333;
        text-align:center;
        margin-bottom:1.1111rem;
    }
    .login-con .title-con .iconfont{
        position:absolute;
        top:1.2667rem;
        right:.4444rem;
    }
    .login-con .popup-items{
        display:flex;
        justify-content: space-between;
        align-items: center;
        height:2.8889rem;
        padding:0 .4889rem 0 .8rem;
        font-size:.6667rem;
        background-color:#fff7f6;
        border-radius:5px;
        margin-bottom:.4444rem;
        color:#333;
    }
    .login-con .popup-items .img-box{
        width:1.5778rem;
        height:1.5778rem;
    }
</style>
