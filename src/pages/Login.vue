<template>
    <div class="logo">
        <!-- 新版登录入口 -->
        <div class="img-con">
             <img src="../assets/images/LOGO2.png" alt="">
         </div>
        <div class="slogen"><img src="../assets/images/zit@2x.png" alt=""></div>
        <!--登录用户切换的身份-->
        <!-- <div class="select selectLogin">
            <select @change="selectLogin">
                <option :selected="selected=='供应链用户'" value ="供应链用户">供应链用户</option>
                <option :selected="selected=='批发网用户'" value ="批发网用户" selected>批发网用户</option>
            </select>
        </div> -->
        <ul class="select-item">
            <li :class="{'select-active': selected == '供应链新批发'}" @click="roleChange('供应链新批发')"><span>供应链新批发</span></li>
            <i class="line"></i>
            <li :class="{'select-active': selected == '批发网用户'}" @click="roleChange('批发网用户')"><span>批发网</span></li>
        </ul>
        <div class="inputs-con">
            <mt-field placeholder="请输入手机号码" type="tel" v-model="account" :attr="{maxlength:11}"></mt-field>
            <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
        </div>
            <button class="loginBtn" id="1" type="button" :disabled="disabled" @click="loginFn()">手机登录</button>
            <!-- <button class="loginw" id="2" @click="logWhol()">批发商入驻</button> -->
            <button class="loginw" id="2" @click="selectSettled">入驻入口</button>
        <!-- </div> -->
        <!-- <div style="display:none;">
            <div class="register-con">——— 其它登录 ———</div>
            <div class="weixin">
                <span @click="wxloginFn" class="img-box"><img src="../assets/images/wx@2x.png"></span>
            </div>
        </div> -->
        <div class="fn-box">
            <router-link to="/register">立即注册></router-link>
            <router-link to="/changecode?from=login">忘记密码</router-link>

        </div>
        <div class="settledMask" v-if="showSettled">
            <div class="settledBox">
                <p class="settledTitle">选择您要入驻的类型<img class="close" @click='closeSettled' src="@/assets/images/wholesale/close-icon.png"></p>
                <div class="settledWaysList">
                    <div class="settledWaysItem" @click="logWhol()">
                        <div class="settledWaysImg"><img src="@/assets/images/wholesale/pfSettled.png"></div>
                        <p class="settledWaysName">批发商入驻</p>
                    </div>
                    <div class="settledWaysItem" @click="logDls()">
                        <div class="settledWaysImg"><img src="@/assets/images/wholesale/dlsSettled.png"></div>
                        <p class="settledWaysName">代理商入驻</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Toast } from 'mint-ui';
import { Indicator} from 'mint-ui';
import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
export default {
    data () {
        return {
            account:"",
            password:"",
            disabled:false,
            isWeixin:false,
            showSettled:false,
            // 默认的登录方式
            selected:"供应链新批发"
        }
    },
    created(){
        //二维码中批发商的seq
        let wholesalerSeq = this.$route.query.WholesaleSEQ;
        if(wholesalerSeq){
            sessionStorage.setItem('wholesalerSeq',wholesalerSeq);
        }
        // 判断是否有默认选中值
        if (sessionStorage.getItem('selected')){
            this.selected = sessionStorage.getItem('selected')
        }
        this.is_weixin();
    },
    mounted(){
        this.checkCookie();
    },
    methods:{
        ...mapActions([
            "saveRole",
        ]),
        // 登录下拉选框更改事件
        selectLogin(e){
            this.selected = e.target.value;
        },
        // 检测cookie中是否存在账号密码,如果存在 自动登录
        checkCookie(){
            let mobile = getCookie('mobile');
            let pwd = getCookie('pwd');
            let isAuto = getCookie('isAuto');
            if(mobile && pwd && isAuto){
                this.account = this.$base64.decode(mobile);
                this.password = this.$base64.decode(pwd);
                var isAutoNow = isAuto=="false"?"false":isAuto=="true"?"true":this.$base64.decode(isAuto);
                if(isAutoNow != "true"){
                    return
                }
                this.loginFn();
            }
        },
        roleChange(role) {
            if (this.selected == role) return
            this.selected = role;
        },
        //判断是否微信浏览器
        is_weixin(){
            let ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == "micromessenger"){
                this.isWeixin = true;
            }else{
                 this.isWeixin = false;
            }
        },
        toastFn(val){
            Toast({message: val,position: 'bottom',duration: 2000});
        },
        // 获取用户身份类型
        getUserType() {
            let self = this;
            axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then((res) => {
                if (res.data.code == 200) {
                    var data = res.data.data;
                    data.Blocktype = data.userRoles[0].roleId; // 默认的登录角色
                    // 根据获取得数据得到默认的角色数据
                    if (data.Blocktype == 5) data.business = 2;
                    if (data.Blocktype != 6) {
                        this.$store.commit('saveStoreId', data.userId);
                    }
                    this.saveRole(data || {});
                    // 下游商家身份
                    if(data.Blocktype == 6){
                        sessionStorage.setItem("seq", data.seq);
                        // 保存当前用户的可访问的商家
                        sessionStorage.setItem('Wseq', data.headquartersStoreSeq);
                        setCookie('seq', data.seq);
                        this.seq = data.seq;
                        // 跳转选择供应链的页面
                        setTimeout(()=>{
                            self.$router.push({
                                path: `/block/supplier?userId=${data.userId}`
                            });
                        },1000);
                    } else {
                        setTimeout(()=>{
                            self.$router.push({
                                path:"/block/storeManagement"
                            });
                        },1000);
                    }
                }
            }).catch(err => {
            })
        },
        loginFn(){
            let self = this;
            var r = this.account.match(/^[0-9]*$/);
            if(this.account=='' || !phoneRuler(this.account) || r == null){
                Toast({
                    message: '请输入有效的手机号码',
                    position: 'bottom',
                    duration: 2000
                });
                return false;
            }
            if(this.password.length < 6 || this.password.length > 18 ){
                Toast({
                    message: '请输入6至18位登录密码',
                    position: 'bottom',
                    duration: 2000
                });
                return false;
            }
            this.disabled = true;
            Indicator.open('加载中...');
            // 判断是否是供应链用户
            if (this.selected == '供应链新批发') {
                axios.post(this.blockURL+`/qypfs-user/auth/login`,{
                    username:this.account,
                    password:this.password
                }).then((res)=>{
                        this.disabled = false;
                        Indicator.close();
                        if(res.data.code == '200'){
                            switch(res.data.code){
                                case 1000:
                                    self.toastFn(res.data.message);
                                    break;
                                case 101:
                                    self.toastFn('用户账号格式有误');
                                    break;
                                case 102:
                                    self.toastFn('密码格式错误,只能是小写字母和数字');
                                    break;
                                case 200:
                                    self.saveRole({});
                                    let userType = res.data.data;
                                    /*  用户信息保存到store */
                                    sessionStorage.setItem("bearer",userType.tokenHead+" "+userType.token);
                                    setCookie('mobile',this.$base64.encode(this.account));
                                    setCookie('pwd',this.$base64.encode(this.password));
                                    setCookie('isAuto',this.$base64.encode("true"));
                                    // sessionStorage.setItem("userType",userType.accountType);//1:商家 2:批发商 3:线下服务中心 4:伙伴代理商 5:百货商家 6:供货商 7:批发网代理商 8:批发网品牌商
                                    sessionStorage.setItem("mobile",this.account);
                                    sessionStorage.setItem("isFrom","h5");//登录来源h5
                                    this.$store.dispatch("changeUserBlock",true);
                                    self.toastFn('登录成功');
                                    self.getUserType();

                                    sessionStorage.setItem('selected','供应链新批发');
                                    //判断是否来自二维码分享 wholesalerSeq(批发商seq) isBand(是否开启弹窗)；
                                    break;
                                case 400:
                                    self.toastFn('账号密码有误或账号不存在');
                                    break;
                            }
                        } else if(res.data.code==1012){
                            self.$router.push({
                                path:"/block/applylist"
                            });
                            sessionStorage.setItem("applyPhone",this.account)
                        }else{
                            self.toastFn(res.data.message);
                        }
                    }).catch(res =>{
                    this.disabled = false;
                    Indicator.close();
                    self.toastFn('连接失败');
                });
            } else {
                axios.post(this.URL+"/User/UserLogin",{
                    account:this.account,
                    pwd:this.password
                })
                    .then((res)=>{
                        this.disabled = false;
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
                                    /*  用户信息保存到store */
                                    self.saveRole(userType);
                                    sessionStorage.setItem("userInfo",JSON.stringify(userType))
                                    let seq = userType.SEQ;
                                    let path = '';
                                    let wholesalerSeq = sessionStorage.getItem('wholesalerSeq');
                                    //批发商
                                    sessionStorage.setItem('IsServicer',res.data.shopper.IsServicer);
                                    sessionStorage.setItem('auditStatus',res.data.shopper.auditStatus);
                                    sessionStorage.setItem("shopName",res.data.shopper.shopname);
                                    // return
                                    //如果是3:线下服务中心 4:伙伴代理商
                                    var accountType=userType.accountType;

                                    if((accountType == 3||accountType == 4) && userType.WholesalerType != 2){
                                        self.toastFn('登录成功');
                                        let datas = {
                                            adressdetail:res.data.shopper.adressdetail,
                                            shopname:res.data.shopper.shopname
                                        }
                                        sessionStorage.setItem('xx',JSON.stringify(datas));
                                        path = '/wholesale/business?wholesaler='+seq;
                                        //如果是    2:批发商  6:供货商 7:批发网代理商 8:批发网品牌商
                                        //WholesalerType  批发商身份类型[1=普通批发商,2=区域批发商]
                                    }else if(accountType == 2|| accountType == 6 ||accountType == 7||accountType == 8||userType.WholesalerType == 2){
                                        self.toastFn('登录成功');
                                        if (userType.WholesalerType == 2) {
                                            path = '/wholesale/business?from=areaWholesaler&wholesaler='+seq
                                        } else {
                                            if(wholesalerSeq){
                                                path = '/supplier';
                                            }else{
                                                path = '/wholesale/business?wholesaler='+seq;
                                            }
                                        }
                                        //如果是1:商家     5:百货商家
                                    }else if(userType.accountType == 1||userType.accountType == 5){
                                        self.toastFn('登录成功');
                                        sessionStorage.setItem('isLogin','true');
                                        sessionStorage.setItem("certificate_type",userType.certificate_type);
                                        sessionStorage.setItem("IsExpired",userType.IsExpired)
                                        path = '/supplier';
                                    }else if(userType.accountType == 0){
                                        self.toastFn('请先注册成批发网用户再登陆~')
                                    }
                                    // else if(userType.auditStatus==5&&userType.accountType==2){
                                    //     MessageBox({
                                    //         title:"",
                                    //         message: '您提交的批发商入驻资料被驳回，请立即前往重新填写资料',
                                    //         showCancelButton: false,
                                    //         confirmButtonText:'立即前往',
                                    //     }).then(action => {
                                    //         if(action=='confirm'){
                                    //             location.href = this.SETTLED +'?wholesaler='+userType.SEQ+'&rewrite=true';
                                    //         }
                                    //     })
                                    // }
                                    // else{
                                    //     self.toastFn('登录成功');
                                    //     sessionStorage.setItem('isLogin','true');
                                    //     path = '/wholesaleCheckProgress?seq='+seq;
                                    //     // self.toastFn('请先注册成为商家或入驻批发商！');
                                    // };
                                    setTimeout(()=>{
                                        this.$router.push(path);
                                    },1000);
                                    setCookie('mobile',this.$base64.encode(this.account));
                                    setCookie('pwd',this.$base64.encode(this.password));
                                    setCookie('isAuto',this.$base64.encode("true"));
                                    setCookie('seq',seq);
                                    setCookie('userType',userType.accountType);
                                    sessionStorage.setItem("seq",seq);
                                    sessionStorage.setItem("userType",userType.accountType);//1:商家 2:批发商 3:线下服务中心 4:伙伴代理商 5:百货商家 6:供货商 7:批发网代理商 8:批发网品牌商
                                    // sessionStorage.setItem("serviceFanWei",serviceFanWei);
                                    sessionStorage.setItem("mobile",this.account);
                                    sessionStorage.setItem("p",this.password);
                                    sessionStorage.setItem("isFrom","h5");//登录来源h5
                                    sessionStorage.setItem("username",userType.username);//登录来源h5
                                    sessionStorage.setItem('selected','批发网用户')
                                    //判断是否来自二维码分享 wholesalerSeq(批发商seq) isBand(是否开启弹窗)；
                                    break;
                                case 400:
                                    self.toastFn('账号密码有误或账号不存在');
                                    break;
                            }
                        };
                    }).catch(res =>{
                    this.disabled = false;
                    Indicator.close();
                    self.toastFn('连接失败');
                });
            }


        },
        selectSettled(){
            this.showSettled = true;
        },
        closeSettled(){
            this.showSettled = false;
        },
        logWhol(){
            location.href = this.SETTLED+"?type=h5&source=2";
        },
        logDls(){
            location.href = this.AGENT;
        },
        logBrand(){
            location.href = this.BRANDSQUARE+"?type=h5";
        },
        wxloginFn(){
          const APPID = 'wx52465426df74f243'
          // const local = 'http://pf.520shq.com'
          const local = 'http://pf.520shq.com/Html5/project/index.html#/bindtel'.replace(/[/]/g,"%2f")
          .replace(/[:]/g,"%3a")
          .replace(/[#]/g,"%23")
          .replace(/[&]/g,"%26")
          .replace(/[-]/g,"%3d")
          // const code = this.getUrlParam('code')
          // if (code) {
          //  this.getUrlParam(code)
          // }else{
          //    window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APPID+'&redirect_uri='+encodeURIComponent(local)
          // +'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
          // }
          window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APPID+'&redirect_uri='+local
          +'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
        },
    },

}
</script>
<style >
    .selectLogin{
        width:11.36rem;
        height:1.64rem;
        margin: 0 auto;
        margin-top: 2rem;
    }
    .selectLogin select{
        width:11.36rem;
        height:1.64rem;
        background-color: transparent;
        border: 0.02rem solid #FFF;
        color: #fff;
        outline: none;
    }
    .selectLogin select option{
        color: #333;
        outline: none;
    }

    .select-item{
        display: flex;
        align-items: center;
        width: 66.7%;
        margin: 1.8rem auto .7rem auto;
        border-bottom: 1px solid #fff;
    }

    .select-item li{
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .75rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255,255,255,1);
        transform: translateY(1px);
    }
    .select-item i.line{
        height: .9rem;
        width: 1px;
        background: #fff;
    }
    .select-item li span{
        display: inline-block;
        height: 100%;
        padding-bottom: .26rem;
    }

    .select-item li.select-active{
        font-weight:bold;
        color:rgba(242,16,34,1);
    }
    .select-item li.select-active span{
        border-bottom: 2px solid #F21022
    }

    .fn-box{
        text-align: center;
        margin-bottom: 1rem;
    }
    .fn-box a{
        font-size: 0.5778rem;
        padding: 0 0.8889rem;
        color:#f00;
    }
    .fn-box a:last-child{
        color:#999;
    }
    .logo{
        overflow:hidden;
        background-image: url('../assets/images/bjt@2x.png');
        background-size: 100%;
        background-repeat:no-repeat;
        background-position:center;
    }
    .logo:after{
        display:block;
        content:"";
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:#fff;
        z-index:-1;
    }


    .logo .img-con{
        width:3.2444rem;
        height:3.2444rem;
        margin:2.7778rem auto 1.3333rem;
    }
    .logo .inputs-con{
      /* width: 11.2222rem ; */
      /* margin-top: 3.5556rem ;
      margin-bottom: 3.5556rem ; */
      width: 66.7%;
      margin: 0.4rem auto 0rem;
    }
    .logo .slogen{
        width: 13.3333rem /* 600/45 */;
        margin: 0 auto;
    }
    .logo .inputs-con input{
        width:100%;
        font-size:.6222rem;
        text-indent:1.1111rem;
        padding-top:.1rem;
        padding-bottom:.1rem;
        background-color: transparent;
        background-position:left center;
        background-size:.6222rem;
        background-repeat:no-repeat;

    }
    .logo input::-webkit-input-placeholder {
         color: #fff;
         font-size: .6667rem;
     }
    .logo .mint-cell-wrapper{
      background-color: transparent;
      background-image:none;
    }
    .logo .mint-cell{
      background-color: transparent;
      background-image:none;
      border-bottom:.0222rem solid #fff;
    }
    .logo .inputs-con input[type=tel]{
        background-image:url('../assets/images/yh@2x.png');
    }
    .logo .inputs-con input[type=password]{
        background-image:url('../assets/images/icon_password@2x.png');
    }

    .logo .register-con{
        text-align:center;
        margin-top: 1.4444rem /* 65/45 */;
        font-size: .6667rem /* 30/45 */;
        color: #666;
    }

    .logo .loginBtn{
      display: block;
      width: 8.8889rem;
      height: 1.5556rem;
      margin: .7778rem auto .7778rem /* 35/45 */;
      background-color: #e60012;
      color: #fff;
      border: 0;
      outline-style: none;
      font-size: .7111rem;
      border-radius: 5px;
    }
    .logo .loginw{
      display: block;
      width: 8.8889rem;
      height: 1.5556rem;
      margin: .7778rem auto .7778rem /* 35/45 */;
      background-color: #fff;
      color: #e60012;
      border: 1px solid #e60012;
      outline-style: none;
      font-size: .7111rem;
      border-radius: 5px;
    }
    /* .weixin{
        overflow:hidden;
        text-align:center;
        margin:  ;
    } */
    .weixin .img-box{
        display:block;
        width:2.1111rem;
        height:2.1111rem;
        margin:.8889rem auto;
    }

    /* 入口选择 */
    .settledMask{
        height: 100vh;
        width: 100%;
        background:rgba(0, 0, 0, .3);
        position: fixed;
        top: 0;
        left: 0;
    }
    .settledBox{
        position:relative;
        top:50%;
        left: 50%;
        /* height: 10rem; */
        width: 70%;
        margin-left:-35%;
        margin-top:-4.8333rem;
        background:#fff;
        border-radius: 8px;
    }
    .settledTitle{
        padding: 0.4444rem 0;
        border-bottom: 1px solid #ddd;
        position: relative;
        font-size: 0.6222rem;
        text-align: center;
        /* position: absolute; */
        top: 0;
        left: 0;
        width: 100%;
    }
    .close{
        height: 0.6666rem;
        width: 0.6666rem;
        position:absolute;
        top: 50%;
        right: 0.4444rem;
        margin-top: -.3333rem;
    }
    .settledWaysList{
        padding: .8889rem 0 0.8889rem;
        width: 100%;
        display: flex;
        /* justify-content: center; */
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
    }
    .settledWaysItem{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin-bottom: 0.4444rem;
    }
    .settledWaysImg{
        width: 1.8667rem;
        height:1.8667rem;
    }
    .settledWaysImg img{
        width: 100%;
        height:100%;
    }
    .settledWaysName{
        margin-top: 0.4444rem;
        font-size: 0.7111rem;
    }
</style>
