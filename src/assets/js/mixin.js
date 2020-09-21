import { showToast } from './common.js'
export const payMixin = {
    data() {
        return {
            system:''
        }
    },
    methods: {
        payLink() {
            let androidDownUrl = 'http://pf.520shq.com/html5/settled/download/index.html';
            let iosDownUrl = 'http://pf.520shq.com/html5/settled/download/index.html';
            this.configSystem()
            if(this.system == 'android'){
                this.checkAppExit(this.DOWNLOAD);
                window.location.href='order://order.app/openwith';
            }else if(this.system == 'ios'){
                // window.location.href='lovefenxiao://';
                this.checkAppExit(this.DOWNLOAD);
                window.location.href='ordersys://';
            }else if(this.system == 'wx'){
                showToast('平台暂时不支持微信支付方式，请您下载520批发网APP，进行购买操作！','center');
                setTimeout(function(){
                    window.location.href = 'http://pf.520shq.com/html5/settled/download/index.html';
                },1000)
            }
            // window.location.href = this.PAY+data.data[0]+'&seq='+this.postData.iSeq;
        },
        // 检查是否app存在
        checkAppExit(url){
            var startTime = Date.now();
            // alert(startTime);
            var t = setTimeout(function() {
                var endTime = Date.now();
                //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
                if ((endTime - startTime) < (800)) {
                    window.location.href = url
                } else {
                    window.close();
                }
            }, 600);
            window.onblur = function() {
                clearTimeout(t);
            }
        },
        configSystem(){
            let ua = navigator.userAgent.toLowerCase();
            //Android终端
            let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
    　　   //Ios终端
            let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if (this.isWeixinBrowser(ua)) {
                this.system = 'wx';
            } else {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    this.system = 'ios';
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    this.system = 'android';
                }
            }
        },
        // 判断是否是微信浏览器
        isWeixinBrowser(ua){
            return (/micromessenger/.test(ua)) ? true : false;
        },
    }
  }
