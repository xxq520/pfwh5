<template>

</template>
<script>
import { Toast } from 'mint-ui';
import { Indicator} from 'mint-ui';
import {phoneRuler,setCookie} from "@/assets/js/common.js"
export default {
    data () {
        return {
            account:"",
            password:"",
        }
    },
    created(){
        Indicator.open('加载中...');
        sessionStorage.setItem('app',true);
        this.getAppUserInfo();
    },
    methods:{
        getAppUserInfo(){
            let that = this;
            window['userNamePw'] = function(json){
                let datas = JSON.parse(json);
                that.account = datas.username;
                // that.password = datas.password;
                that.loginFn(datas.username,datas.password);
            };
        },
        toastFn(val){
            Toast({message: val,position: 'bottom',duration: 2000});
        },
        loginFn(name,pwd){
            let self = this;
            this.disabled = true;
            axios.post(this.URL+"/User/UserLogin",{
                account:name,
                pwd:pwd
            })
            .then((res)=>{
                Indicator.close();
                if(res.status == '200'){
                    switch(res.data.retCode){
                        case 0:
                            self.toastFn('登陆失败，系统繁忙');
                            break;
                        case 101:
                            self.toastFn('用户账号格式有误');
                            break;
                        case 102:
                            self.toastFn('密码格式错误,只能是小写字母和数字');
                            break;
                        case 200:
                            let userType = res.data.shopper;
                            // let serviceFanWei = res.data.serverfanwei;
                            let seq = userType.SEQ;
                            let path = '';
                            let wholesalerSeq = sessionStorage.getItem('wholesalerSeq');
                            //批发商
                            sessionStorage.setItem('IsServicer',res.data.shopper.IsServicer);
                            sessionStorage.setItem('auditStatus',res.data.shopper.auditStatus);
                            if(userType.accountType == 3||userType.accountType == 4){
                                // self.toastFn('登录成功');
                                let datas = {
                                    adressdetail:res.data.shopper.adressdetail,
                                    shopname:res.data.shopper.shopname
                                }
                                sessionStorage.setItem('xx',JSON.stringify(datas));      
                                path = '/wholesale/business?wholesaler='+seq;
                            }else if(userType.accountType == 2 ||userType.accountType == 8 || userType.accountType == 7||userType.accountType == 6){
                                // self.toastFn('登录成功');
                                if(wholesalerSeq){
                                    path = '/supplier';
                                }else{
                                    path = '/wholesale/business?wholesaler='+seq;
                                }
                            }else if(userType.accountType == 1||userType.accountType == 5){
                                // self.toastFn('登录成功');
                                sessionStorage.setItem('isLogin','true');
                                path = '/supplier';
                            }else{
                                self.toastFn('请先注册成为商家或入驻批发商！');
                                window.action.backPageLogin();
                            };
                            setTimeout(()=>{
                                this.$router.push(path);
                            },1000);
                            setCookie('seq',seq);
                            setCookie('userType',userType.accountType);
                            sessionStorage.setItem("seq",seq);
                            sessionStorage.setItem("userType",userType.accountType);
                            sessionStorage.setItem("mobile",this.account);
                            sessionStorage.setItem("p",this.password);
                            sessionStorage.setItem("isFrom","app");//登录来源APP
                            //判断是否来自二维码分享 wholesalerSeq(批发商seq) isBand(是否开启弹窗)；
                            break;
                        case 400:
                            self.toastFn('账号密码有误或账号不存在');
                            window.action.backPageLogin();
                            break;
                    }
                };
            }).catch(res =>{
                Indicator.close();
                self.toastFn('连接失败');
            });
        }
    },

}
</script>
<style>

</style>
