<template>
    <div>
      <mt-popup v-model="shareIsTrue" position="bottom"  popup-transition="popup-fade" class="popup share-popup" @click="changeShare">
        <p class="share-type">选择分享平台</p>
        <ul class="share-list">
          <div class="soshm"></div>
        </ul>
        <p class="cancel-share" @click="changeShare">取消分享</p>
      </mt-popup>
    </div>
</template>

<script>
  import soshm from  'soshm'
  import wx from 'weixin-sdk-js';
  import Vue from 'vue';
  import { Toast,Indicator } from 'mint-ui';
  // import vshare from 'vshare'
  import detailPopup from '../../src/pages/business/details/details.vue';
  Vue.component('detailPopup',detailPopup);
    export default {
        name: "share",
      data(){
          return{
            shareIsTrue:false
          }
      },
      props: {
        shareData:{
          type: Object,
          default: {}
        }
      },
      watch: {
       },
        created(){
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'
            document.body.appendChild(script)
        },
      methods:{
        changeShare(){
          this.shareIsTrue=!this.shareIsTrue
        },
        shareInit(){
          var that=this;
          var getappId=axios.get('https://nfxts.520shq.com/localQuickPurchase/shareQRCode/getShareStr', {
            params: {url:window.location.href.split("#")[0]}
          });
          getappId.then(res => {
            var data=res.data.data;
            var userSeq=sessionStorage.getItem('seq');
            wx.config({
              debug: false,
              appId: data.appId,
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.signature,
              jsApiList: [
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareQZone'
              ]
            });
            wx.ready(function() {
              wx.checkJsApi({
                jsApiList: [
                  'onMenuShareAppMessage',
                  'onMenuShareTimeline',
                  'onMenuShareQQ',
                  'onMenuShareQZone',
                ]
              });
              var shareData = {
                title: that.shareData.title,
                desc: that.shareData.digest,
                link: that.shareData.url,
                shareUrl:that.shareData.url,
                imgUrl: that.shareData.pic,  //图片路径
                success:function(){
                }
              };
              wx.onMenuShareAppMessage(shareData);
              wx.onMenuShareTimeline(shareData);
              wx.onMenuShareQQ(shareData);
              wx.onMenuShareQZone(shareData);
            });
          }).catch(err=>{
              Indicator.close();
          })
        },
      },
      mounted(){
          var that=this;
          soshm('.soshm', that.shareData);
          that.shareInit()
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'
          document.body.appendChild(script)
      }
    }
</script>

<style >
  .soshm-item-text {
    padding-top: 0.2rem;
  }
  .soshm-item-text{
    display: block !important;
  }
  .soshm{
    display: flex;
    text-align: center;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .soshm>div{
    float: none !important;

  }
  div.share-popup{
    height: 30vh;
    width: 100%;
    background-color: #f1f1f1 !important;
  }
  div.share-popup{
    height: 30vh;
    background-color: #f1f1f1 !important;
  }
  .share-type{
    font-size: 0.7rem;
    text-align: center;
    padding-top: 1rem;
  }
  .share-list{
  }
  .cancel-share{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.6rem;
    background-color: #f8f8f8;
    text-align: center;
    font-size: 0.6rem;
    line-height: 1.6rem;
  }
</style>
