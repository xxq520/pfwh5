<template lang="html">
    <div class="quik-con">
      <p class="quik-title">第三方登录</p>
      <div class="quik-box">
          <div class="quik-items">
              <i class="iconfont icon-weibo"></i>
              <p>微博</p>
          </div>
          <div class="quik-items" v-if="showWX" @click="wxloginFn">
              <i class="iconfont icon-weixin"></i>
              <p>微信</p>
          </div>
          <div class="quik-items">
              <i class="iconfont icon-QQ"></i>
              <p>QQ</p>
              <span id="qqLoginBtn" class="qqLoginBtn"></span>
          </div>
      </div>
    </div>
</template>

<script>
import {isWeixin,showToast} from "@/assets/js/common.js";
export default {
    data () {
        return {
            showWX:false,//是否显示微信登录
        }
    },
    mounted(){
        this.isWXlogin();
        this.QQLgoin();
    },
    methods:{
        // 判断是否是微信浏览器，是-->微信登录
        isWXlogin(){
            if(isWeixin()){
                this.showWX = true;
            }else{
                this.showWX = false;
            }
        },
        // 微信登录
        wxloginFn(){
          const APPID = 'wx52465426df74f243'
          const local = 'http://pf.520shq.com/Html5/project/index.html#/bindtel'.replace(/[/]/g,"%2f")
          .replace(/[:]/g,"%3a")
          .replace(/[#]/g,"%23")
          .replace(/[&]/g,"%26")
          .replace(/[-]/g,"%3d");
          window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APPID+'&redirect_uri='+local
          +'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
        },
        QQLgoin(){
            QC.Login({
                btnId:document.getElementById("qqLoginBtn")	//插入按钮的节点id
            });
        }
    }
}
</script>

<style lang="css">
    .quik-con{
        /* width:14.4667rem; */
        /* margin:0 auto; */
        text-align:center;
        font-size:.5778rem;
        color:#666;
    }
    .quik-con .quik-title{
        margin-bottom:.4444rem;
    }
    .quik-con .quik-box{
        display:flex;
        justify-content: space-between;
    }
    .quik-con .quik-box .quik-items{
        position:relative;
        flex:6;
    }

    .quik-con .quik-box .iconfont{
        font-size:1.8667rem;
    }
    .quik-con .quik-box .icon-weibo{
        color:#ff5b2e;
    }
    .quik-con .quik-box .icon-weixin{
        color:#78c02f;
    }
    .quik-con .quik-box .icon-QQ{
        color:#3492ff;
    }
    .quik-con .quik-items p{
        font-size:.4444rem;
    }
    .quik-con .qqLoginBtn{
        position:absolute;
        top:0;
        left:30%;
        height:3rem;
        opacity: 0;
    }
</style>
