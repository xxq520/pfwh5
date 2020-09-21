import 'babel-polyfill';
import qs from 'qs';
import Vue from 'vue'
import md5 from 'js-md5'
import axios from 'axios';
import moment from 'moment'
import MintUI from 'mint-ui';
import plugins from './assets/js/plugins';
import preview from 'vue-photo-preview'
import vueCookie from 'vue-cookie';
import ElementUI from 'element-ui';
import {Indicator, MessageBox, Toast} from 'mint-ui';
import App from './App'
import apis from "./assets/js/api.js"
import store from "./store/index"
import router from './router'
import topnav from './components/topnav';
import axiosHttp from "@/assets/js/http"
import bottomnav from './components/bottomnav';
import writeUrls from "./assets/js/whiteListUrl.js"
import blockTabbar from '@/components/blockTabbar'
import initRichText from './assets/js/initHTMLEditor.js';
import shoppingCart from '@/components/shoppingCart';
import wholesaleNav from '@/components/WholesaleNav';
let Base64 = require('js-base64').Base64;
import "./assets/js/formatTime.js";
import 'mint-ui/lib/style.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css';
import "font-awesome.css";
import "./assets/font/iconfont.css";
import 'vue-photo-preview/dist/skin.css'
Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
Vue.prototype.$base64 = Base64;
Object.defineProperty(Vue.prototype, "$moment", {
    value: moment
})

/*使用mint-ui和element-ui*/
Vue.use(preview);
Vue.use(MintUI);
Vue.use(ElementUI);
Vue.use(vueCookie);

/*公用组件*/
Vue.component('topnav', topnav);
Vue.component('bottomnav', bottomnav);
Vue.component('wholesaleNav', wholesaleNav);
Vue.component('blockTabbar', blockTabbar);
Vue.component('shoppingCart', shoppingCart);
window.axios = axios; //ajax库
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //设置post请求的默认请求头
window.qs = qs;
window.Toast = Toast;
window.Indicator = Indicator;
window.MessageBox = MessageBox; //弹窗插件
let productUrl = Vue.prototype.PRODUCT;

initRichText(productUrl);
import VueRouter from 'vue-router';
apis();
//校验登陆

router.beforeEach((to, from, next) => {
    //to即将进入的目标路由对象，from当前导航正要离开的路由， next : 下一步执行的函数钩子
    var pathS = writeUrls;
    if (pathS.indexOf(to.path) != -1) {
        next();
    } else { //进入的不是登录路由
        if (sessionStorage.getItem("bearer")) {
            next();
        } else if (!sessionStorage.getItem('seq') || sessionStorage.getItem('seq') == '') {
            next({path: '/login'});
        } else { //下一跳路由需要登录验证，并且还未登录，则路由定向到 登录路由
            next();
        }
    }
});
// 金额格式化
Vue.filter("moneyFormat", function (money) {
    return money.toFixed(2);
});
// 时间格式化
Vue.filter("dataFormat", function (data) {
    return data.replace("T", " ").substring(0, 19);
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
