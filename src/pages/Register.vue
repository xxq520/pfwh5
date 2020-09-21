<template>
    <div class="register">
        <mt-header title="手机号码注册">
            <mt-button icon="back" slot="left" v-if="fromApp" @click='backPageLogin'></mt-button>
            <div to="" target="div" @click="back" slot="left" v-else>
                <mt-button icon="back"></mt-button>
            </div>
        </mt-header>
        <div class="register-con">
            <div class="account-box">
                <span>+86</span>
                <mt-field placeholder="手机号" type="tel" v-model="account" class="account" :attr="{maxlength:11}" @change="che(account)"></mt-field>
                <button :disabled="disabled" @click="gettxCode">{{'获取图形码'}}</button>
            </div>
               <mt-field placeholder="请输入图形码" type="text" v-model="txmsg" class="border-b">
               <img :src="imgpath" v-show="txshow" >
               </mt-field>
             <div class="account-box">
               <mt-field placeholder="请输入验证码" type="number" v-model="msg" class="account" ></mt-field>
               <button :disabled="disabled" @click="getMsgCode">{{btntext}}</button>
             </div>
            <mt-field placeholder="输入密码" :type="isSee ? 'text' : 'password'" v-model="password" class="border-b">
                <span class="see-icons" :class="{see:isSee}" @click="taggle"></span>
            </mt-field>
            <mt-field placeholder="请输入邀请码" type="number" v-model="code" class="border-b" :attr="{maxlength:10}" :readonly="readOnly"></mt-field>
            <div class="agreement-con">
                <i class="icons" :class="{agree:isAgree}" @click="agreeClick"></i>
                <p @click="maskShow">我已阅读并同意《520批发网商家协议》</p>
               
            </div>
            
            
                 <p @click="privacyShow" style="text-align: center;color: #f00; font-size: 14px  ;">已阅读并同意《隐私政策》</p>
           
            <button class="login-btn" @click="registerBtn" :disabled="bdisabled">完成</button>
        </div>
        <div class="mask-con" v-show="isMaskShow">
            <div class="mask-box">
                <div class="mask-title">520批发网商家协议</div>
                <div class="mask-text">
                    <business-agreement></business-agreement>
                </div>
                <div class="mask-button" @click="maskShow">知道</div>
            </div>
        </div>
    </div>
</template>
<!--register-->
<script>
import { phoneRuler } from "@/assets/js/common.js"
import { showToast } from "@/assets/js/common.js"
import businessAgreement from "@/pages/Agreement/business";
// import xieyi  from "@/views/"
export default {
    data () {
        return {
            account:'',
            password:'',
            msg:'',
            code:'',
            readOnly:false,
            disabled:false,
            bdisabled:false,
            isSee:false,
            btntext:'获取验证码',
            fromApp:'',
            type : 0 ,
            isAgree:true,//协议同意
            isMaskShow:false,//协议弹框显示
            txmsg:'',
            imgpath:'',
            txshow:false
        }
    },
    components:{
        businessAgreement
    },
    created(){
        this.getStorage();
        let fromApp = this.$route.query.app;
        if(fromApp){
            this.fromApp = fromApp;
        }
        var obj = sessionStorage.getItem('register')?JSON.parse(sessionStorage.getItem('register')):{};
        if (obj.account){
            this.account = obj.account;
            this.msg = obj.msg;
            this.password = obj.password;
            this.code = obj.code;
            this.isAgree = obj.isAgree;
            this.txmsg = obj.txmsg;
        }
    },
    mounted(){
        this.$router.afterEach((to,from) =>{
            if(to.path === "/login" || to.path === "/register"){
                return;
            }else{
                this.type = 0;
                sessionStorage.removeItem('wholesalerSeq');
            }
        })
    },
    watch:{
        // 请输入有效的手机号码
        'account':function (newVal) {
            this.setSession('account',newVal)
        },
        // 请输入短信验证码
        'msg':function (newVal) {
            this.setSession('msg',newVal)
        },
        // 请输入6-18位密码
        'password':function (newVal) {
            this.setSession('password',newVal)
        },
        // 请输入邀请码
        'code':function (newVal) {
            this.setSession('code',newVal)
        },
        'isAgree':function (newVal) {
            this.setSession('isAgree',newVal)
        },
        'txmsg':function (newVal) {
            this.setSession('txmsg',newVal)
        },
    },
    methods:{
        setSession(key,val){
            var obj = sessionStorage.getItem('register')?JSON.parse(sessionStorage.getItem('register')):{};
            obj[key] = val;
            sessionStorage.setItem('register',JSON.stringify(obj))
        },
        privacyShow(){
             this.$router.push("/Privacy")
        },
        che(){
          var r = this.account.match(/^[0-9]*$/);
          if (r == null) {
            showToast('请输入正确格式的手机号！','bottom')
          }
        },
        // 获取本地存储数据
        getStorage(){
            sessionStorage.removeItem('mobile');
            let code = sessionStorage.getItem('wholesalerSeq');
            if(code){
                this.type = 1;
                this.code = code;
                this.readOnly = true;
            }else{
                this.type = 0;
            }
        },
        //倒计时
        countDown(){
            let self = this;
            let count = 60;
            let timer = null;
            timer = setInterval(()=>{
                if(count >=0){
                    this.btntext = (count + "s");
                    count--;
                    this.disabled = true;
                }else{
                    clearInterval(timer);
                    timer = null;
                    this.btntext="获取验证码";
                    this.disabled = false;
                }
            },1000);
        },
        backPageLogin(){
            sessionStorage.removeItem('register');
            if(this.fromApp){
                window.action.backPageLogin();
            }
        },
        back(){
            sessionStorage.removeItem('register');
            this.$router.push({path:'/login'});
        },
             gettxCode(){
       
             if(this.account == '' || !phoneRuler(this.account)){
             showToast("请输入有效的手机号码");
             return ;
             }
              
             axios.get(this.URL + '/PersonalCenter/GetGraphicsCode',{params:{mobile:this.account}})
             .then((res) => {
               
               this.imgpath=res.data;
               this.txshow=true
             })
             },
        //获取验证码
        getMsgCode(){
            let self = this;
            if(this.account == '' || !phoneRuler(this.account)){
                showToast("请输入有效的手机号码");
                return ;
            }
              if(this.txmsg == ''){
              showToast("请输入图形验证码");
              return ;
              }
            self.countDown();
            axios.get(this.URL +
            '/PersonalCenter/GetVerificationCode',{params:{mobile:this.account,verifyCode:this.txmsg}})
            .then((res) => {
                if(res.data == '200'){
                    showToast('短信发送成功');
                    // self.countDown();
                }else if(res.data == '100'){
                     showToast('手机格式不正确');
                }else if(res.data == '400'){
                    showToast('获取失败');
                }
            })
        },
        // 切换显示隐藏密码
        taggle(){
            this.isSee = !this.isSee;
        },
        //注册
        registerBtn(){
            if(this.account == '' || !phoneRuler(this.account)){
                showToast("请输入有效的手机号码");
                return;
            }
            if(this.msg == ''){
                showToast('请输入短信验证码');
                return;
            }
            if(this.msg.length !=4){
              showToast('请输入4位数验证码');
              return;
            }
            if(this.password == '' || this.password.length < 6 || this.password.length > 18){
                showToast("请输入6-18位密码");
                return;
            }
            if(this.code == ''){
                showToast('请输入邀请码');
                return;
            }
            if(this.code == '' || this.code.length > 10 || this.code.length < 7){
                showToast("请输入7-10位邀请码");
                return;
            }
            if(!this.isAgree){
                showToast("请先阅读并同意《520批发网商家协议》");
                return;
            }
            let data = {
                "mobile":this.account,
                "pwd":this.password,
                "invitecode":this.code,
                "yzcode":this.msg,
                "type":this.type
            }
             this.bdisabled = true;
            axios.post(this.URL + '/User/Registered',data)
            .then((res) => {
                this.bdisabled = false;
                switch(res.data.retCode){
                    case 0:
                        showToast("注册失败");
                        break;
                    case 101:
                        showToast("验证码错误");
                        break;
                    case 102:
                        showToast("密码格式错误,只能是小写字母和数字");
                        break;
                    case 200:
                        showToast("注册成功");
                        if(this.fromApp){
                            window.action.backPageLogin();
                        }else{
                            setTimeout(()=>{
                                this.$router.push({path:'/supplier'});
                                sessionStorage.setItem('seq',res.data.seq);
                                sessionStorage.setItem('mobile',res.data.mobile);
                            },2000);
                        }
                        break;
                    case 404:
                        showToast("注册失败，系统繁忙");
                        break;
                    case 400:
                        showToast("注册失败，用户已存在");
                        break;
                }
            }).catch(res => {
                this.bdisabled = false;
            })
        },
        // 同意协议
        agreeClick(){
            this.isAgree = !this.isAgree;
        },
        // 弹框显示
        maskShow(){
            this.isMaskShow = !this.isMaskShow;
        }
    }
}
</script>
<style scoped>
    .register:after{
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
    .register-con{
        padding:1.4444rem .6667rem 0;
    }
   .register .border-b,
    .register .account-box{
       border-bottom:.0222rem solid #ccc;
    }
    .register .border-b{
        margin-bottom:.6667rem;
    }
    .mint-cell-wrapper{
        background:none;
    }
    .register .account-box{overflow:hidden;}
    .register .account-box span,
    .register .account-box .account{
        float:left;
    }
    .register .account-box button{
        float:right;
    }
    .register .account-box span,
    .register .account-box button
     {
         line-height:48px;
     }
    .register .account-box .account{
        position:relative;
        width:59%;
    }
    .register .account-box .account:before{
        display:block;
        content:"";
        position:absolute;
        left:0;
        top:50%;
        width:1px;
        height:20px;
        margin-top:-10px;
        background-color:#ccc;
    }
    .register .account-box span{
        font-size:.6222rem;
        margin-right:.4444rem;
    }
    .register .account-box button{
        width: 4.1111rem;
        background-color:transparent;
        color:#ffa3a5;
        font-size:.5778rem;
        outline-style: none;
        border:0;
    }
 .tuyzm{
        width: 4.1111rem;
        background-color:transparent;
        color:#ffa3a5;
        font-size:.5778rem;
        outline-style: none;
        border:0;
 }
.register .account-box button:active{
    background-color:#eee;
}
.register .see-icons{
    display:block;
    width:1rem;
    height:1rem;
    background-position:center;
    background-repeat:no-repeat;
    background-size:contain;
    background-image:url('../assets/images/nosee-icon.png');
}
.register .see{
    background-image:url('../assets/images/see-icon.png');
}
.register .agreement-con{
    display:flex;
    justify-content: flex-start;
    align-items: center;
    font-size:.5333rem;
    color:#666;
    margin-bottom: 15px;
}
.register .agreement-con .icons{
    display:block;
    width:.6667rem;
    height:.6667rem;
    border-radius:50%;
    background:url("../assets/images/weixuanzhong.png") no-repeat center;
    background-size:cover;
    margin-right:.2222rem;
}
.register .agreement-con .agree{
    background-image: url("../assets/images/xuanzhong.png");
}
.register .mask-con{
    display:flex;
    align-items: center;
    justify-items: center;
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
}
.register .mask-box{
    width:80%;
    margin:0 auto;
    background-color:#fff;
    text-align:center;
    border-radius:3px;
}
.register .mask-box .mask-title{
    font-size:.7111rem;
    padding:.4444rem 0;
    font-weight:bold;
}
.register .mask-box .mask-text{
    height:11.1111rem;
    overflow:scroll;
    -webkit-overflow-scrolling : touch;
    font-size:.5333rem;
    padding:.2222rem .5333rem;
    text-align:left;
    line-height:2
}
.register .mask-box .mask-text h1,
.register .mask-box .mask-text h2{
    font-size:.5333rem;
}
.register .mask-box .mask-button{
    font-size:.7111rem;
    padding:.4444rem 0;
}
</style>
