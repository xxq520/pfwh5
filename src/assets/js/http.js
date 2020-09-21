import axios from 'axios';
import {showToast} from "@/assets/js/common.js";
axios.defaults.timeout = 10000;
axios.defaults.baseURL ='';
import { Toast } from 'mint-ui';
import router from '../../router/index'
import Vue from 'vue'
import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
import store from "../../store/index"
//http response 拦截器
axios.interceptors.response.use(
  response => {
      if (response.data&&response.data.code&&response.data.code==401) {
          try {
              window.action.app_back();
          } catch (err) {
              // 设置不自动登录
              setCookie('isAuto',false);
              // 清除缓存数据
              sessionStorage.clear();
              // 将vuex中的用户数据为空
              store.state.userInfo = {};
              router.push({
                  path:"/login",
                  querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
              });
          }
          Toast('暂未登录或登录已失效，请重新登录');
      }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
);

// http request 拦截
axios.interceptors.request.use(
    request => {
        let noToken = true;
        // 不想要传递token的接口，避免后台返回token失效问题
        let drowUrl = [
            '/qypfs-user/currency/sendCode','/qypfs-user/currency/validateCode',
            '/qypfs-user/region','/qypfs-user/auth/register',
            '/qypfs-user/register/getRegisterLog','/qypfs-user/register/undo',
            '/qypfs-user/auth/login'
        ];
        for (let i =0; i<drowUrl.length; i++) {
            // 如果有一个是为不需要传递token的接口结束判断不传递token
            if (request.url.indexOf(drowUrl[i])!=-1){
                noToken = false;
                break;
            }
        }
        // 判断如果是否需要传递token
        if (noToken){
            request.headers.Authorization = sessionStorage.getItem("bearer")
        }
        return request;
    },
    error => {
        return Promise.reject(error)
    }
);
// post封装
 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }
// get封装
export function get(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}
Vue.prototype.axios = axios

