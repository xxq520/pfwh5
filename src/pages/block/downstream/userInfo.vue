<template>
    <div class="store-management">
        <mt-header title="个人中心" ref="header" :fixed='true'></mt-header>
        <div>
            <div :style="{'padding-top':'0rem'}" class="fn-list">
                <div class="fn-item avart">
                    <div class="links ">
                        <input @change="upImg('icon')" accept="image/*" type="file" ref="icon" class="img-file avartInput">
                        <span class="fn-item-title">头像</span>
                        <span class="fn-item-con">
                             <img :src="userInfo.icon || require('../../../assets/images/ewm.png')" alt="">
                        </span>
                    </div>
                </div>
                <div class="fn-item" @click="showName">
                    <div class="links">
                        <span class="fn-item-title">姓名</span>
                        <span class="fn-item-con" v-text="userInfo.nickname"></span>
                    </div>
                </div>
                <div class="fn-item" name="phone">
                    <router-link to="" class="links">
                        <span class="fn-item-title">手机号</span>
                        <span class="fn-item-con" v-text="userInfo.phone"></span>
                    </router-link>
                </div>
                <div class="fn-item money" name="phone">
                    <router-link to="" class="links">
                        <span class="fn-item-title">钱包余额</span>
                        <div @click="alert('钱包余额：消费退换货款的资金不能提现到卡，可用于消费；')">
                            <span class="fn-item-con" v-text="'￥'+(currentTotalBalance||'0.00')"></span>
                            <img class="why" src="../../../assets/images/block/icon_why.png" alt="">
                        </div>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/blank" class="links">
                        <span class="fn-item-title">银行卡</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/supplier" class="links">
                        <span class="fn-item-title">我的供货商</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/blockmyAddress" class="links">
                        <span class="fn-item-title">收货地址</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/changecode" class="links">
                        <span class="fn-item-title">修改密码</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
            </div>
            <div @click="loginOut" class="setting-item">
                <span>退出登录</span>
            </div>
        </div>
        <block-tabbar v-if="true"></block-tabbar>
    </div>
</template>
<script>
    import {Toast, Indicator,MessageBox} from 'mint-ui';
    import {setCookie, loginFn, uploadImg} from '../../../assets/js/common';
    import {mapActions} from 'vuex'
    import blockTabbar from '@/components/blockTabbar';

    export default {
        data() {
            return {
                selectAuth: null,
                userInfo: this.$store.state.userInfo,
                seq: '',
                // 用户的余额数据
                currentTotalBalance:0
            }
        },
        components: {
            blockTabbar
        },
        created() {
            if (!this.userInfo.invitationCode) {
                this.login()
            }
            this.getInfo();
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
        },
        watch: {
        },
        methods: {
            // 获取用户的余额
            getInfo() {
                let userParams = {
                    "usedWhere": 0,
                    "seq": this.userInfo.seq // 用户seq
                };
                axios.post(this.blockURL + '/qypfs-wallet/balance/totalBalance', userParams).then(res => {
                    console.log(res.data);
                    if (res.data.code == 200) {
                        this.currentTotalBalance = res.data.data;
                    } else {
                        Toast( res.data.message);
                    }
                })
            },
            ...mapActions([
                "saveRole",
            ]),
            // 显示更改姓名弹窗
            showName() {
                MessageBox.prompt(" ","修改姓名",{
                    "inputValue": this.userInfo.nickname
                }).then(({ value, action }) => {
                    // 是否点击确认按钮
                    if (action=='confirm') {
                        if (!value){
                            Toast('请输入姓名');
                            return
                        }
                        axios.post(this.blockURL + `/qypfs-user/user/updateUserInfo`, {
                            "userId": this.userInfo.userId,
                            "nickname": value
                        }).then(res => {
                            this.$set(this.userInfo,"nickname",value)
                        }).catch();
                    }
                });
            },
            // 登出事件
            loginOut() {
                let app = sessionStorage.getItem('app');
                if (app) {
                    window.action.loginOut();
                } else {
                    MessageBox({
                        title: "",
                        message: '确定退出登录?',
                        showCancelButton: true
                    }).then(action => {
                        if (action === 'confirm') {
                            setCookie('seq', '');
                            setCookie('isAuto', this.$base64.encode("false"));
                            sessionStorage.clear();
                            this.$router.replace('/login');
                            this.$store.dispatch("changeUserBlock", false);
                            this.saveRole({});
                        }
                    });
                }
            },
            // 批发网区域批发商个人中心登录
            login() {
                loginFn().then(data =>{
                    console.log('userInfo==',data);
                    this.selectAuth = data.Blocktype;
                    this.userInfo = data;
                    this.seq = data.seq;
                    this.saveRole(data || {});
                })
            },
            // 图片上传
            upImg(type) {
                let f = this.$refs[type].files[0];
                let param = new FormData();
                param.append('file', f);
                uploadImg(param).then(url=>{
                    this.$set(this.userInfo,"icon",url)
                }).catch(err=>{
                    Toast(err.message);
                })
            },
            // 弹出信息
            alert(message){
                MessageBox({
                    title:'',
                    message: message,
                    confirmButtonText: "我知道了"
                });
            }
        }
    }
</script>
<style scoped>
    .money{
        position: relative;
    }
    .money .fn-item-con{
        padding-right: 0.5rem;
    }
    .why{
        position: absolute;
        top: 0.43rem;
        right: 0.23rem;
        width: 0.68rem;
        height: 0.7rem;
    }
    div.avart{
        height: 2.73rem;
        line-height: 2.73rem;
    }
    .avart img{
        max-height: 2.2rem;
        max-width: 2.2rem;
        object-fit: cover;
    }
    .avartInput{
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        height: 2.5rem;
        z-index: 100;
    }
    .none-b {
        border-right: 0;
    }
    .fn-list {
        margin-top: 2.2rem;
        background-color: #f5f5f5;
    }

    .fn-item {
        background-color: #fff;
        position: relative;
        height: 2.2rem;
        line-height: 2.2rem;
        border-bottom: .0222rem solid rgba(204, 204, 204, .9);
        padding: 0 1.2444rem 0 .5333rem;
        display: flex;
        justify-content: space-between;
    }

    .fn-item:after {
        display: block;
        content: "";
        position: absolute;
        right: .5333rem;
        top: 52%;
        margin-top: -.2222rem;
        width: .3556rem;
        height: .3556rem;
        transform: rotate(45deg);
        border-top: .0222rem solid #666;
        border-right: .0222rem solid #666;
    }
    .fn-item[name="phone"]{
        padding-right: 0.4rem;
    }
    .fn-item[name="phone"]:after {
        content: "";
        right: .5333rem;
        top: 52%;
        margin-top: -.2222rem;
        width: .3556rem;
        height: .3556rem;
        transform: rotate(45deg);
        border: none;
    }

    .fn-item:last-child {
        border: 0;
    }

    .fn-item .links {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .fn-item span {
        font-size: .6222rem;
    }

    .fn-item .fn-item-title {
        color: #212121;
    }

    .fn-item .fn-item-con {
        color: #888;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fn-item3 img {
        margin-top: 0.3rem;
        width: 2.4rem;
        height: 2.4rem;
    }

    .WholesaleAddress .fn-item-con {
        flex: 1.5;
        padding-left: 1.1111rem;
        line-height: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .setting-item {
        height: 2.25rem;
        background: rgba(255, 255, 255, 1);
        font-size: 0.68rem;
        font-family: PingFang SC;
        color: rgba(255, 96, 35, 1);
        text-align: center;
        line-height: 2.25rem;
        margin-top: 0.45rem;
    }

</style>
