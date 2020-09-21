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
        return {
            // 测试地址
            VIDEO : 'http://pf.520shq.com/html5/videoHtml/index.html',
            DOWNLOAD : 'http://pf.520shq.com/html5/settled/download/index.html',
            URL : 'http://192.168.1.36:1099/api',
            PRODUCT : 'http://192.168.1.36:1098/api',
            PAY : 'http://192.168.1.36:8077/home/indexwap?comefrom=10019&busimode=2&salenumber=',
            MS : 'http://192.168.1.36:1098/api',
            Price : 'http://payts.520shq.com/',
            SETTLED : 'http://192.168.1.36:1099/Html5/settled/userInfo.html', //批发商入驻
            AGENT : 'http://192.168.1.100:8080/agentManage/static/wholesales/agentAdd.html', //代理商入驻
            AGENTCHECK : 'http://192.168.1.100:8080/agentManage/static/wholesales/assessFirst.html', //代理商入驻
            BRANDSQUARE :"http://192.168.1.36:1077/Html5/project/index.html#/settled",//品牌广场入驻
            BRANDSQUAREPROGRESS :"http://192.168.1.36:1077/Html5/project/index.html#/settledProgress",//品牌广场入驻
            STOREINFO : "http://192.168.1.43:9080/localQuickPurchase/app/html/person.jsp?from=1&seq=",
            BYYL:'http://192.168.1.22:9088/#/settings/bankList', //跳转回百业惠盟银联入驻列表
            SettledPay : "http://192.168.1.36:8077/home/indexwap?comefrom=10020&busimode=2&salenumber=",//批发商入驻支付
        }
      }else{
        return {
            VIDEO : 'http://pf.520shq.com/html5/videoHtml/index.html',
            DOWNLOAD : 'http://pf.520shq.com/html5/settled/download/index.html',
            URL : '/api',
            PRODUCT : '/product',
            Price: 'http://payts.520shq.com/',
            PAY : 'http://192.168.1.36:8077/home/indexwap?comefrom=10019&busimode=2&salenumber=',
            MS : '/product',
            SETTLED : 'http://192.168.1.36:1099/Html5/settled/userInfo.html', //批发商入驻
            AGENT : 'http://192.168.1.100:8080/agentManage/static/wholesales/agentAdd.html', //代理商入驻
            AGENTCHECK : 'http://192.168.1.100:8080/agentManage/static/wholesales/assessFirst.html', //代理商入驻
            BRANDSQUARE : "http://192.168.1.139:8082/#/settled",//品牌广场入驻
            BRANDSQUAREPROGRESS : "http://192.168.1.139:8082/#/settledProgress",//品牌广场入驻
            STOREINFO : "http://192.168.1.43:9080/localQuickPurchase/app/html/person.jsp?from=1&seq=",
            BYYL:'http://192.168.1.154:8080/#/settings/bankList', //跳转回百业惠盟银联入驻列表
            SettledPay : "http://192.168.1.36:8077/home/indexwap?comefrom=10020&busimode=2&salenumber=",//批发商入驻支付
        }
      }
    }else if(href && href =='pf'){
      // 线上
      if(http == "https"){
          return {
              VIDEO : 'https://pf.520shq.com/html5/videoHtml/index.html',
              DOWNLOAD : 'https://pf.520shq.com/html5/settled/download/index.html',
              URL : 'https://pf.520shq.com/api',
              PRODUCT : 'https://admapi.520shq.com/api',
              PAY : 'https://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=',
              // MS = 'http://admapi.520shq.com/api',//正式站点
              MS : 'https://admapi.520shq.com/api', //测试站点
              Price: 'http://pay.520shq.com/',
              SETTLED : 'https://pf.520shq.com/Html5/settled/userInfo.html', //批发商入驻
              AGENT : 'https://manager.520shq.com/static/wholesales/agentAdd.html', //代理商入驻
              AGENTCHECK : 'https://manager.520shq.com/static/wholesales/assessFirst.html', //代理商入驻
              BRANDSQUARE : "https://brandts.520shq.com/Html5/project/index.html#/settled",//品牌广场入驻
              BRANDSQUAREPROGRESS : "https://brandts.520shq.com/Html5/project/index.html#/settledProgress",//品牌广场入驻进度页
              STOREINFO : "http://nbhs2.520shq.com:92/localQuickPurchase/app/html/person.jsp?from=1&seq=",
              BYYL:'https://byhm.520shq.com/#/settings/bankList', //跳转回百业惠盟银联入驻列表
              SettledPay : "https://pay.520shq.com/home/indexwap?comefrom=10020&busimode=2&salenumber=",//批发商入驻支付
          }
      }else{
          return {
              VIDEO : 'http://pf.520shq.com/html5/videoHtml/index.html',
              DOWNLOAD : 'http://pf.520shq.com/html5/settled/download/index.html',
              URL : 'http://pf.520shq.com/api',
              PRODUCT : 'http://admapi.520shq.com/api',
              Price: 'http://pay.520shq.com/',
              PAY : 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=',
              // MS = 'http://admapi.520shq.com/api';//正式站点
              MS : 'http://admapi.520shq.com/api', //测试站点
              SETTLED : 'http://pf.520shq.com/Html5/settled/userInfo.html', //批发商入驻
              AGENT : 'http://manager.520shq.com/static/wholesales/agentAdd.html', //代理商入驻
              AGENTCHECK : 'http://manager.520shq.com/static/wholesales/assessFirst.html', //代理商入驻
              BRANDSQUARE : "http://brandts.520shq.com/Html5/project/index.html#/settled",//品牌广场入驻
              BRANDSQUAREPROGRESS : "https://brandts.520shq.com/Html5/project/index.html#/settledProgress",//品牌广场入驻进度页
              STOREINFO : "http://nbhs2.520shq.com:92/localQuickPurchase/app/html/person.jsp?from=1&seq=",
              BYYL:'http://byhm.520shq.com/#/settings/bankList', //跳转回百业惠盟银联入驻列表
              SettledPay : "http://pay.520shq.com/home/indexwap?comefrom=10020&busimode=2&salenumber=",//批发商入驻支付
          }
      }

    }else if(href && href == 'pfts'){
        return {
          // 线上测试
          VIDEO : 'http://pf.520shq.com/html5/videoHtml/index.html',
          DOWNLOAD : 'http://pf.520shq.com/html5/settled/download/index.html',
           Price: 'http://payts.520shq.com/',
          PRODUCT : 'http://admapits.520shq.com/api',
          PAY : 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=',
          // MS = 'http://admapi.520shq.com/api';
          MS : 'http://admapits.520shq.com/api',
          Price: 'http://pay.520shq.com/',
          SETTLED : 'http://pf.520shq.com/Html5/settled/userInfo.html', //批发商入驻
          AGENT : 'http://manager.520shq.com/static/wholesales/agentAdd.html', //代理商入驻
          AGENTCHECK : 'http://manager.520shq.com/static/wholesales/assessFirst.html', //代理商入驻
          BRANDSQUARE : "http://brandts.520shq.com/Html5/project/index.html#/settled",//品牌广场入驻
          BRANDSQUAREPROGRESS : "http://brandts.520shq.com/Html5/project/index.html#/settledProgress",//品牌广场入驻进度页
          BYYL:'http://byt.520shq.com/#/settings/bankList',//跳转回百业惠盟银联入驻列表
      }
    }else if(href && href == 'pftest'){
        return {
          // 线上测试2
          DOWNLOAD : 'http://pftest.520shq.com/html5/settled/download/index.html',
          VIDEO : 'http://pftest.520shq.com/html5/videoHtml/index.html',
          URL : 'http://pftest.520shq.com/api',
          Price : 'http://payts.520shq.com/',
          PRODUCT : 'http://admapits.520shq.com/api',
          PAY : 'http://pay.520shq.com/home/indexwap?comefrom=10019&busimode=2&salenumber=',
          // MS = 'http://admapi.520shq.com/api',
          MS : 'http://admapits.520shq.com/api',
          SETTLED : 'http://pftest.520shq.com/Html5/settled/userInfo.html', //批发商入驻
          AGENT : 'http://manager.520shq.com/static/wholesales/agentAdd.html', //代理商入驻
          AGENTCHECK : 'http://manager.520shq.com/static/wholesales/assessFirst.html', //代理商入驻
        }
    }
}
export default apis;
