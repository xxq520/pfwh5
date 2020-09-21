<template lang="html">
  <div class="register-con">
      <mt-header title="注册新用户" class="mt-headers">
          <router-link :to="{ path: '/login'}" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
      <div class="main">
          <div class="label input-label">
              <span class="area-code">+86<i class="iconfont icon-you"></i></span>
              <mt-field placeholder="请输入手机号" type="number" class="inputs" v-model.trim="account" @input="isRegister"></mt-field>
          </div>
          <div class="label input-label">
              <mt-field placeholder="请输入验证码" class="inputs" v-model.trim="msgCode" @input="isRegister"></mt-field>
              <send-msg :account="account"></send-msg>
          </div>
          <div class="label input-label">
              <mt-field placeholder="请输入密码" class="inputs" v-model.trim="password" @input="isRegister"></mt-field>
          </div>
          <div class="label input-label last-label">
              <mt-field placeholder="请输入邀请码" class="inputs" v-model.trim="InvitationCode"></mt-field>
          </div>
          <div class="agreement-con">
            <i class="iconfont icon-selected" :class="isSelected?'orange':''"></i>
            <p>我已阅读并同意<span class="orange">《520批发网商家协议》</span></p>
          </div>
          <mt-button type="default" size="large" class="large-btn btn-radius" :class="disable?'btn-cur':''" @click="register">注册</mt-button>
          <quik-login></quik-login>
      </div>
  </div>
</template>

<script>
import QuikLogin from "../componentn/QuickLogin.vue";
import SendMsg from "../componentn/SendMsg.vue";
import {showToast,phoneRuler} from "@/assets/js/common.js";
export default {
    data () {
        return {
            account:"",
            msgCode:"",
            password:"",
            InvitationCode:"",
            disable:false,
            isSelected:true,
        }
    },
    components:{
        QuikLogin,
        SendMsg
    },
    methods:{
        // 能否注册操作
        isRegister(){
            if(this.account !="" && this.msgCode != "" && this.password != ""){
                this.disable = true;
            }else{
                this.disable = false;
            }
        },
        // 注册操作
        register(){
            if(!this.disable) return;
            if(this.account == "" || !phoneRuler(this.account)){
                showToast("请输入有效手机号码");
                return;
            }
            if(this.msgCode == ""){
                showToast("请输入短信验证码");
                return;
            }
            if(this.password.length<6 || this.password.length>20){
                showToast("请输入6-20位密码");
                return;
            }
        }
    }
}
</script>

<style lang="css">
    .register-con .main{
        padding-top:2.8222rem;
    }
    .register-con .last-label{
        margin-bottom:.8444rem;
    }
  
    .register-con .large-btn{
        margin-bottom: 2.2222rem;
    }
</style>
