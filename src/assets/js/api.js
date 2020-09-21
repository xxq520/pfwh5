import Vue from "vue";
let apis = function(){
    /*接口配置*/
    // 下载链接
    let locations = location.href.split('/')[2];
    let http = location.href.split(":")[0];//获取协议（http or https）

    let href = locations.split('.')[0];
    // 本地

    if(href && href == '192'){
      if (locations.split('.')[locations.split('.').length - 1].split(":")[0] == '36'){
        // 测试地址
        Vue.prototype.VIDEO = 'http://pf.520shq.com/html5/videoHtml/index.html';
        Vue.prototype.DOWNLOAD = 'http://pf.520shq.com/html5/settled/download/index.html';
        Vue.prototype.url = 'http://192.168.1.36:1099/';
        Vue.prototype.URL = 'http://192.168.1.36:1099/api';
        Vue.prototype.blockURL = 'http://qypfts.520shq.com';
        Vue.prototype.PRODUCT = 'http://192.168.1.36:1098/api';
        Vue.prototype.PAY = 'http://192.168.1.36:8077/home/indexwap?comefrom=10019&busimode=2&salenumber=';
        Vue.prototype.MS = 'http://192.168.1.36:1098/api';
        Vue.prototype.SETTLED = 'http://192.168.1.36:1099/Html5/settled/userInfo.html'; //批发商入驻
        Vue.prototype.AGENT = 'http://192.168.1.100:8080/agentManage/static/wholesales/agentAdd.html'; //代理商入驻
        Vue.prototype.AGENTCHECK = 'http://192.168.1.100:8080/agentManage/static/wholesales/assessFirst.html'; //代理商入驻
        Vue.prototype.BRANDSQUARE ="http://192.168.1.36:1077/Html5/project/index.html#/settled";//品牌广场入驻
        Vue.prototype.BRANDSQUAREPROGRESS ="http://192.168.1.36:1077/Html5/project/index.html#/settledProgress";//品牌广场入驻
        Vue.prototype.STOREINFO = "http://192.168.1.43:9080/localQuickPurchase/app/html/person.jsp?from=1&seq=";
        Vue.prototype.BYYL='http://192.168.1.22:9088/#/settings/bankList'; //跳转回百业惠盟银联入驻列表
        Vue.prototype.SettledPay = "http://192.168.1.36:8077/home/indexwap?comefrom=10020&busimode=2&salenumber=";//批发商入驻支付
        Vue.prototype.BaiYeGoodsManage = 'http://nbhts.520shq.com/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq='
      } else {
        Vue.prototype.VIDEO = 'http://pf.520shq.com/html5/videoHtml/index.html';
        Vue.prototype.url = 'http://192.168.1.36:1099/';
        Vue.prototype.DOWNLOAD = 'http://pf.520shq.com/html5/settled/download/index.html';
        Vue.prototype.blockURL = 'http://qypfts.520shq.com';
          // Vue.prototype.blockURL = 'http://192.168.1.84:8808';
          // Vue.prototype.blockURL = 'http://192.168.1.161:8600';
        Vue.prototype.URL = 'http://admapits.520shq.com/api';
        Vue.prototype.PRODUCT = 'http://admapits.520shq.com/api';
        Vue.prototype.PAY = 'http://192.168.1.36:8077/home/indexwap?comefrom=10019&busimode=2&salenumber=';
        Vue.prototype.MS = '/product';
        Vue.prototype.SETTLED = 'http://192.168.1.36:1099/Html5/settled/userInfo.html'; //批发商入驻
        Vue.prototype.AGENT = 'http://192.168.1.100:8080/agentManage/static/wholesales/agentAdd.html'; //代理商入驻
        Vue.prototype.AGENTCHECK = 'http://192.168.1.100:8080/agentManage/static/wholesales/assessFirst.html'; //代理商入驻
        Vue.prototype.BRANDSQUARE = "http://192.168.1.139:8082/#/settled";//品牌广场入驻
        Vue.prototype.BRANDSQUAREPROGRESS = "http://192.168.1.139:8082/#/settledProgress";//品牌广场入驻
        Vue.prototype.STOREINFO = "http://192.168.1.43:9080/localQuickPurchase/app/html/person.jsp?from=1&seq=";
        Vue.prototype.BYYL='http://192.168.1.154:8080/#/settings/bankList'; //跳转回百业惠盟银联入驻列表
        Vue.prototype.SettledPay = "http://192.168.1.36:8077/home/indexwap?comefrom=10020&busimode=2&salenumber=";//批发商入驻支付
        Vue.prototype.BaiYeGoodsManage = 'http://nbhts.520shq.com/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq='
      }
    }else if(href && href =='pf'){
      // 线上
      if(http == "https"){
          Vue.prototype.VIDEO = 'https://pf.520shq.com/html5/videoHtml/index.html';
          Vue.prototype.DOWNLOAD = 'https://pf.520shq.com/html5/settled/download/index.html';
        Vue.prototype.url = 'https://pf.520shq.com/';
          Vue.prototype.URL = 'https://pf.520shq.com/api';
          Vue.prototype.blockURL = 'http://qypf.520shq.com';
          Vue.prototype.PRODUCT = 'https://admapi.520shq.com/api';
          Vue.prototype.PAY = 'https://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=';
          // Vue.prototype.MS = 'http://admapi.520shq.com/api';//正式站点
          Vue.prototype.MS = 'https://admapi.520shq.com/api'; //测试站点
          Vue.prototype.SETTLED = 'https://pf.520shq.com/Html5/settled/userInfo.html'; //批发商入驻
          Vue.prototype.AGENT = 'https://manager.520shq.com/static/wholesales/agentAdd.html'; //代理商入驻
          Vue.prototype.AGENTCHECK = 'https://manager.520shq.com/static/wholesales/assessFirst.html'; //代理商入驻
          Vue.prototype.BRANDSQUARE = "https://brandts.520shq.com/Html5/project/index.html#/settled";//品牌广场入驻
          Vue.prototype.BRANDSQUAREPROGRESS = "https://brandts.520shq.com/Html5/project/index.html#/settledProgress";//品牌广场入驻进度页
          Vue.prototype.STOREINFO = "http://nbhs2.520shq.com:92/localQuickPurchase/app/html/person.jsp?from=1&seq=";
          Vue.prototype.BYYL='https://byhm.520shq.com/#/settings/bankList'; //跳转回百业惠盟银联入驻列表
          Vue.prototype.SettledPay = "https://pay.520shq.com/home/indexwap?comefrom=10020&busimode=2&salenumber=";//批发商入驻支付
        //http://nbhs2.520shq.com:92/localQuickPurchase/app/html/goodsManage/goodsManage.jsp
          Vue.prototype.BaiYeGoodsManage = 'http://nbhs2.520shq.com:92/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq=';//百叶商品管理
      }else{
          Vue.prototype.VIDEO = 'http://pf.520shq.com/html5/videoHtml/index.html';
          Vue.prototype.DOWNLOAD = 'http://pf.520shq.com/html5/settled/download/index.html';
        Vue.prototype.url = 'https://pf.520shq.com/';
          Vue.prototype.URL = 'http://pf.520shq.com/api';
          Vue.prototype.blockURL = 'http://qypf.520shq.com';
          Vue.prototype.PRODUCT = 'http://admapi.520shq.com/api';
          Vue.prototype.PAY = 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=';
          // Vue.prototype.MS = 'http://admapi.520shq.com/api';//正式站点
          Vue.prototype.MS = 'http://admapi.520shq.com/api'; //测试站点
          Vue.prototype.SETTLED = 'http://pf.520shq.com/Html5/settled/userInfo.html'; //批发商入驻
          Vue.prototype.AGENT = 'http://manager.520shq.com/static/wholesales/agentAdd.html'; //代理商入驻
          Vue.prototype.AGENTCHECK = 'http://manager.520shq.com/static/wholesales/assessFirst.html'; //代理商入驻
          Vue.prototype.BRANDSQUARE = "http://brandts.520shq.com/Html5/project/index.html#/settled";//品牌广场入驻
          Vue.prototype.BRANDSQUAREPROGRESS = "https://brandts.520shq.com/Html5/project/index.html#/settledProgress";//品牌广场入驻进度页
          Vue.prototype.STOREINFO = "http://nbhs2.520shq.com:92/localQuickPurchase/app/html/person.jsp?from=1&seq=";
          Vue.prototype.BYYL='http://byhm.520shq.com/#/settings/bankList'; //跳转回百业惠盟银联入驻列表
          Vue.prototype.SettledPay = "http://pay.520shq.com/home/indexwap?comefrom=10020&busimode=2&salenumber=";//批发商入驻支付
          Vue.prototype.BaiYeGoodsManage = 'http://nbhs2.520shq.com:92/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq=';//百叶商品管理
      }

    }
    else if(href && href == 'pfts'){
      // 线上测试
      Vue.prototype.VIDEO = 'http://pf.520shq.com/html5/videoHtml/index.html';
      Vue.prototype.DOWNLOAD = 'http://pf.520shq.com/html5/settled/download/index.html';
      Vue.prototype.url = 'http://pfts.520shq.com';
      Vue.prototype.URL = 'http://pfts.520shq.com/api';
        Vue.prototype.blockURL = 'http://qypfts.520shq.com';
      Vue.prototype.PRODUCT = 'http://admapits.520shq.com/api';
      Vue.prototype.PAY = 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=';
      // Vue.prototype.MS = 'http://admapi.520shq.com/api';
      Vue.prototype.MS = 'http://admapits.520shq.com/api';
      Vue.prototype.SETTLED = 'http://pfts.520shq.com/Html5/settled/userInfo.html'; //批发商入驻
      Vue.prototype.AGENT = 'http://manager.520shq.com/static/wholesales/agentAdd.html'; //代理商入驻
      Vue.prototype.AGENTCHECK = 'http://manager.520shq.com/static/wholesales/assessFirst.html'; //代理商入驻
      Vue.prototype.BRANDSQUARE = "http://brandts.520shq.com/Html5/project/index.html#/settled";//品牌广场入驻
      Vue.prototype.STOREINFO = "http://nbhs2.520shq.com:92/localQuickPurchase/app/html/person.jsp?from=1&seq=";
      Vue.prototype.BRANDSQUAREPROGRESS = "http://brandts.520shq.com/Html5/project/index.html#/settledProgress";//品牌广场入驻进度页
      Vue.prototype.BYYL='http://byt.520shq.com/#/settings/bankList';//跳转回百业惠盟银联入驻列表
      Vue.prototype.BaiYeGoodsManage = 'http://nbhts.520shq.com/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq='
    }else if(href && href == 'pftest'){
      // 线上测试2
      Vue.prototype.DOWNLOAD = 'http://pftest.520shq.com/html5/settled/download/index.html';
      Vue.prototype.VIDEO = 'http://pftest.520shq.com/html5/videoHtml/index.html';
      Vue.prototype.url = 'http://pfts.520shq.com';

        Vue.prototype.blockURL = 'http://qypfts.520shq.com';
      Vue.prototype.URL = 'http://pftest.520shq.com/api';
      Vue.prototype.PRODUCT = 'http://admapits.520shq.com/api';
      Vue.prototype.PAY = 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=';
      // Vue.prototype.MS = 'http://admapi.520shq.com/api';
      Vue.prototype.MS = 'http://admapits.520shq.com/api';
      Vue.prototype.SETTLED = 'http://pftest.520shq.com/Html5/settled/userInfo.html'; //批发商入驻
      Vue.prototype.AGENT = 'http://manager.520shq.com/static/wholesales/agentAdd.html'; //代理商入驻
      Vue.prototype.AGENTCHECK = 'http://manager.520shq.com/static/wholesales/assessFirst.html'; //代理商入驻
      Vue.prototype.BaiYeGoodsManage = 'http://nbhts.520shq.com/localQuickPurchase/app/html/goodsManage/goodsManage.jsp?seq='
    }
}
export default apis;
