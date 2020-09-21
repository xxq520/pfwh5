<template>
    <div class="register">
        <mt-header title="手机号码注册" ref="header">
            <mt-button v-if="fromApp" @click='backPageLogin' icon="back" slot="left" ></mt-button>
            <div @click="back" slot="left" v-else>
                <mt-button icon="back"></mt-button>
            </div>
        </mt-header>
        <div class="register-con">
            <div class="account-box">
                <span>+86</span>
                <mt-field v-model="account" :attr="{maxlength:11}" placeholder="手机号" type="tel"  class="account" @blur.native.capture="checkPhone2"></mt-field>
                <button v-if="!ifRegister" :disabled="disabled" @click="checkPhone2(1)">{{'获取图形码'}}</button>
            </div>
            <mt-field v-if="!ifRegister" v-model="txmsg" placeholder="请输入图形码" type="text"  class="border-b">
                <img :src="imgpath" v-show="txshow">
            </mt-field>
            <div v-if="!ifRegister" class="account-box">
                <mt-field v-model="msg" placeholder="请输入验证码" type="number"  class="account accountNew"></mt-field>
                <button :disabled="disabled" @click="getMsgCode">{{btntext}}</button>
            </div>
            <mt-field :type="isSee ? 'text' : 'password'" v-model="password"  placeholder="请输入密码" class="border-b">
                <span :class="{see:isSee}" @click="taggle" class="see-icons"></span>
            </mt-field>
            <p class="pwd-tip" v-show="ifRegister">该手机号已经注册过平台账号，请使用密码登录即可绑定</p>
            <mt-field v-model="code" :attr="{maxlength:10}" :readonly="!!code" placeholder="请输入邀请码" type="number"  class="border-b" ></mt-field>
            <div class="agreement-con">
                <i :class="{agree:isAgree}" @click="agreeClick" class="icons" ></i>
                <p @click="maskShow">我已阅读并同意<span class="c-yellow">《520批发网商家协议》</span></p>
            </div>
            <button @click="registerBtn" :disabled="bdisabled" class="registerBtn" :class="{'registerBtn-act': isAgree}">完成</button>
        </div>
        <div v-show="isMaskShow" class="mask-con">
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
<script>
    import {phoneRuler} from "@/assets/js/common.js"
    import {showToast} from "@/assets/js/common.js"
    import {getPicCode} from "@/assets/js/common.js"
    import businessAgreement from "@/pages/Agreement/business";
    export default {
        data() {
            return {
                account: '',
                password: '',
                msg: '',
                code: '',
                readOnly: false,
                disabled: false,
                bdisabled: false,
                isSee: false,
                btntext: '获取验证码',
                fromApp: '',
                type: 0,
                isAgree: true,//协议同意
                isMaskShow: false,//协议弹框显示
                txmsg: '',
                imgpath: '',
                txshow: false,
                isCheck: true,
                state: 0,
                ifRegister: false,
            }
        },
        components: {
            businessAgreement
        },
        created() {
            this.getStorage();
            let fromApp = this.$route.query.app;
            if (fromApp) {
                this.fromApp = fromApp;
            }
            
            var obj = sessionStorage.getItem('register') ? JSON.parse(sessionStorage.getItem('register')) : {};
            if (obj.account) {
                this.account = obj.account;
                this.msg = obj.msg;
                this.password = obj.password;
                this.code = obj.code;
                this.isAgree = obj.isAgree;
                this.txmsg = obj.txmsg;
            }
            // 判断分享者seq
            if (this.$route.query.seq){
                this.code = this.$route.query.seq
            }
        },
        mounted() {
            this.$router.afterEach((to, from) => {
                if (to.path === "/login" || to.path === "/downstream") {
                    return;
                } else {
                    this.type = 0;
                    sessionStorage.removeItem('wholesalerSeq');
                }
            })
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
        },
        watch: {
            // 请输入有效的手机号码
            'account': function (newVal) {
                this.setSession('account', newVal)
            },
            // 请输入短信验证码
            'msg': function (newVal) {
                this.setSession('msg', newVal)
            },
            // 请输入6-18位密码
            'password': function (newVal) {
                this.setSession('password', newVal)
            },
            // 请输入邀请码
            'code': function (newVal) {
                this.setSession('code', newVal)
            },
            'isAgree': function (newVal) {
                this.setSession('isAgree', newVal)
            },
            'txmsg': function (newVal) {
                this.setSession('txmsg', newVal)
            },
        },
        methods: {
            setSession(key, val) {
                var obj = sessionStorage.getItem('register') ? JSON.parse(sessionStorage.getItem('register')) : {};
                obj[key] = val;
                sessionStorage.setItem('register', JSON.stringify(obj))
            },
            privacyShow() {
                this.$router.push("/Privacy")
            },
            che() {
                var r = this.account.match(/^[0-9]*$/);
                if (r == null) {
                    showToast('请输入正确格式的手机号！', 'bottom');
                    return false;
                }
                return true;
            },
            checkPhone2(msg) {
                if (!this.che()) return;
                let params = {
                    mobile: this.account
                }
                axios.get(this.blockURL + '/qypfs-user/auth/ifRegister', { params:  params}).then((res) => {
                    console.log(res, 'ifRegister');
                    if (res.data.code == 200) {
                        this.ifRegister = res.data.data;
                        if(!res.data.data && msg == 1) this.gettxCode();
                    } else {
                        showToast(res.data.message);
                    }
                    
                })
            },
            checkPhone(msg) {
                let params = {
                    phone: this.account
                }
                axios.get(this.blockURL + '/qypfs-user/wholesaler/findUserOne', { params:  params}).then((res) => {
                    console.log(res, 'findUserOne');
                    if (res.data.code == 200) {
                        if(msg == 1) this.gettxCode();
                    } else if(res.data.code == 1039){
                        this.state = 3;
                        if(msg == 1) this.gettxCode();
                    } else {
                        this.account = '';
                        showToast(res.data.message);
                    }
                    
                })
            },
            // 获取本地存储数据
            getStorage() {
                sessionStorage.removeItem('mobile');
                let code = sessionStorage.getItem('wholesalerSeq');
                if (code) {
                    this.type = 1;
                    this.code = code;
                    this.readOnly = true;
                } else {
                    this.type = 0;
                }
            },
            //倒计时
            countDown() {
                let self = this;
                let count = 60;
                let timer = null;
                timer = setInterval(() => {
                    if (count >= 0) {
                        this.btntext = (count + "s");
                        count--;
                        this.disabled = true;
                    } else {
                        clearInterval(timer);
                        timer = null;
                        this.btntext = "获取验证码";
                        this.disabled = false;
                    }
                }, 1000);
            },
            backPageLogin() {
                sessionStorage.removeItem('register');
                if (this.fromApp) {
                    window.action.backPageLogin();
                }
            },
            back() {
                sessionStorage.removeItem('register');
                this.$router.push({path: '/login'});
            },
            gettxCode() {
                if (this.account == '' || !phoneRuler(this.account)) {
                    showToast("请输入有效的手机号码");
                    return;
                }
                getPicCode(this.account).then(res =>{
                    console.log(res, 'getPicCode');
                    this.isCheck = false;
                    this.imgpath = res;
                    this.txshow = true
                })
            },
            //获取验证码
            getMsgCode() {
                let self = this;
                if (this.account == '' || !phoneRuler(this.account)) {
                    showToast("请输入有效的手机号码");
                    return;
                }
                if (!this.txmsg) {
                    showToast("请输入图形验证码");
                    return;
                }
                // self.countDown();
                let params = {
                    mobile: this.account, 
                    code: this.txmsg,
                    state: this.state
                }
                axios.post(this.blockURL + '/qypfs-user/currency/sendCode', params).then((res) => {
                    console.log('sendCode', res);
                    if (res.data.code == '200') {
                        showToast('短信发送成功');
                        self.countDown();
                    } else if (res.data.code == '100') {
                        showToast('手机格式不正确');
                    } else if (res.data.code == '400') {
                        showToast('获取失败');
                    } else {
                        showToast(res.data.message);
                    }
                })
            },
            // 切换显示隐藏密码
            taggle() {
                this.isSee = !this.isSee;
            },
            //注册
            registerBtn() {
                if (this.account == '' || !phoneRuler(this.account)) {
                    showToast("请输入有效的手机号码");
                    return;
                }
                if (!this.ifRegister && this.msg == '') {
                    showToast('请输入短信验证码');
                    return;
                }
                if (!this.ifRegister && (!this.msg || this.msg.length != 4)) {
                    showToast('请输入4位数验证码');
                    return;
                }
                if (!this.password || this.password.length < 6 || this.password.length > 18) {
                    showToast("请输入6-18位密码");
                    return;
                }
                if (this.code == '') {
                    showToast('请输入邀请码');
                    return;
                }
                if (this.code == '' || this.code.length > 10 || this.code.length < 7) {
                    showToast("请输入7-10位邀请码");
                    return;
                }
                if (!this.isAgree) {
                    showToast("请先阅读并同意《520批发网商家协议》");
                    return;
                }

                let params = {
                    password: this.password,
                    phone: this.account,
                    shareSeq: this.code
                }
                if (!this.ifRegister) params.code = this.msg;
                this.bdisabled = true;
                axios.post(this.blockURL + '/qypfs-user/wholesaler/registerDownMerchant', params)
                    .then((res) => {
                        this.bdisabled = false;
                        console.log(res, 'Registered');
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            showToast(res.data.data || '创建成功');
                            if (this.fromApp) {
                                console.log(this.fromApp);
                                window.action.backPageLogin();
                            } else {
                                setTimeout(() => {
                                    this.$router.push({path: '/login'});
                                }, 2000);
                            }
                        } else {
                            showToast(res.data.message || '系统错误');
                        }
                    }).catch(res => {
                })
            },
            // 同意协议
            agreeClick() {
                this.isAgree = !this.isAgree;
            },
            // 弹框显示
            maskShow() {
                this.isMaskShow = !this.isMaskShow;
            }
        }
    }
</script>
<style scoped>
    .registerBtn {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        border-radius: 1rem;
        border: none;
        font-size: 0.73rem;
        font-family: PingFang SC;
        color: rgba(254, 254, 254, 1);
        margin-top: 2rem;
        background: rgba(105, 105, 105, .35);
    }
    .registerBtn-act{
        background: rgba(255, 96, 35, 1);
    }

    .c-yellow {
        color: #FF6023;
    }

    .register:after {
        display: block;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: -1;
    }

    .register-con {
        padding: 1.4444rem .6667rem 0;
    }
    .register-con .pwd-tip{
        font-size: .5rem;
        color: red;
        font-family: PingFang SC;
        margin-top: -.4rem;
        margin-bottom: .8rem;
    }
    .register .register-con /deep/ .mint-cell-wrapper{
        background-image: none;
    }

    .register .border-b,
    .register .account-box {
        border-bottom:1px solid rgba(236,236,236,1);
    }

    .register .border-b {
        margin-bottom: .6667rem;
    }

    .mint-cell-wrapper {
        background: none;
    }

    .register .account-box {
        overflow: hidden;
    }

    .register .account-box span,
    .register .account-box .account {
        float: left;
    }

    .register .account-box button {
        float: right;
    }

    .register .account-box span,
    .register .account-box button {
        line-height: 48px;
    }

    .register .account-box .account {
        position: relative;
        width: 59%;
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
    }

    .register .account-box .account:before {
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: 20px;
        margin-top: -10px;
        background:rgba(236,236,236,1);
    }
    .register .account-box .accountNew:before {
        background:transparent;
    }

    .register .account-box span {
        font-size: .6222rem;
        margin-right: .4444rem;
    }

    .register .account-box button {
        background-color: transparent;
        outline-style: none;
        border: 0;
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,0,0,1);
    }

    .tuyzm {
        width: 4.1111rem;
        background-color: transparent;
        color: #ffa3a5;
        font-size: .5778rem;
        outline-style: none;
        border: 0;
    }

    .register .account-box button:active {
        background-color: #eee;
    }

    .register .see-icons {
        display: block;
        width: 1rem;
        height: 1rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url('../../../assets/images/look1.png');
    }

    .register .see {
        background-image: url('../../../assets/images/look2.png');
    }

    .register .agreement-con {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: .5333rem;
        color: #666;
        margin-bottom: 15px;
    }

    .register .agreement-con .icons {
        display: block;
        width: .6667rem;
        height: .6667rem;
        border-radius: 50%;
        background: url("../../../assets/images/button_del_choose.png") no-repeat center;
        background-size: cover;
        margin-right: .2222rem;
    }

    .register .agreement-con .agree {
        background-image: url("../../../assets/images/button_def_choose.png");
    }

    .register .mask-con {
        display: flex;
        align-items: center;
        justify-items: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
    }

    .register .mask-box {
        width: 80%;
        margin: 0 auto;
        background-color: #fff;
        text-align: center;
        border-radius: 3px;
    }

    .register .mask-box .mask-title {
        font-size: .7111rem;
        padding: .4444rem 0;
        font-weight: bold;
    }

    .register .mask-box .mask-text {
        height: 11.1111rem;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        font-size: .5333rem;
        padding: .2222rem .5333rem;
        text-align: left;
        line-height: 2
    }

    .register .mask-box .mask-text h1,
    .register .mask-box .mask-text h2 {
        font-size: .5333rem;
    }

    .register .mask-box .mask-button {
        font-size: .7111rem;
        padding: .4444rem 0;
    }
</style>
