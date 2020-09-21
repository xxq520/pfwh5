<template lang="html">
  <div class="send-msg">
      <button type="default" size="small" class="small-btn code-btn" @click="getMsgCode" :disabled="disabled">{{btntext}}</button>
  </div>
</template>

<script>
import {showToast,phoneRuler} from "@/assets/js/common.js";
import {sendMsg} from "@/assets/js/interface.js";
export default {
    props:["account"],
    data () {
        return {
            btntext:"获取验证码",
            disabled:false
        }
    },
    methods:{
        // 发送短信倒计时
        countDown(){
            let self = this;
            let count = 60;
            let timer = null;
            timer = setInterval(()=>{
                if(count >=0){
                    this.btntext = (count + "s");
                    count--;
                    this.disabled = true;
                }else{
                    clearInterval(timer);
                    timer = null;
                    this.btntext="获取验证码";
                    this.disabled = false;
                }
            },1000);
        },
        // 获取短信
        getMsgCode(){
            if(!this.account || this.account == "" || !phoneRuler(this.account)){
                showToast("请输入正确手机号");
                return;
            }
            this.countDown();
            sendMsg({
                mobile:this.account
            }).then(res => {

            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
