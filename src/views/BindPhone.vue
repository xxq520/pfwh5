<template lang="html">
  <div class="bind-phone">
    <mt-header title="新用户绑定手机" class="mt-headers">
        <router-link :to="{ path: '/login'}" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="main">
        <div class="label input-label account-input">
            <span class="area-code">+86<i class="iconfont icon-you"></i></span>
            <mt-field placeholder="请输入手机号" type="number" class="inputs" v-model.trim="account" @input="isClick"></mt-field>
        </div>
        <div class="label input-label password-input">
            <mt-field placeholder="请输入验证码" class="inputs" v-model.trim="msgCode" @input="isClick"></mt-field>
            <send-msg :account="account"></send-msg>
        </div>
        <mt-button type="default" size="large" class="large-btn btn-radius" :class="disable?'btn-cur':''" @click="bindClick">完成</mt-button>
    </div>
  </div>
</template>

<script>
import SendMsg from "@/componentn/SendMsg.vue";
import {showToast} from "@/assets/js/common.js";
export default {
    data () {
        return {
            disable:false,
            account:"",
            msgCode:""
        }
    },
    components:{
        SendMsg
    },
    methods:{
        // 判断能否点击完成按钮
        isClick(){
            if(this.account != "" && this.msgCode != ""){
                this.disable = true;
            }else{
                this.disable = false;
            }
        },
        // 发送短信
        getMsgCode(){
            if(this.account == ""){
                showToast("请输入正确的手机号");
                return;
            }
        },
        // 完成绑定
        bindClick(){
            if(!this.disable) return;
        }
    }
}
</script>

<style lang="css">
    .bind-phone .main{
        padding-top:2.8222rem ;
    }
    .bind-phone .account-input{
        margin-bottom:1.3778rem;
    }
    .bind-phone .password-input{
        margin-bottom:3.2889rem;
    }
</style>
