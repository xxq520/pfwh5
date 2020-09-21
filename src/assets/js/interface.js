import { get, post } from './http';
import baseUrl from "./baseUrl";
const base = baseUrl();
const sendMsg = p => get(base.URL + "/PersonalCenter/GetVerificationCode",p);//发送短信
const loginApi = p => post(base.URL + '/User/UserLogin', p);//登录请求
export {
    sendMsg,
    loginApi
}
