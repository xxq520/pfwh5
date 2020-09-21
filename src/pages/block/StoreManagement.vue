<template>
    <div class="store-management">
        <div>
            <div class="header-con">
                <img src="http://dfs2.520shq.com:80/group1/M00/07/BD/wKgAC19I492AXTE9AAFXhweXkaU850.jpg" class="bgc" alt="">
                <div class="store-info">
                    <div class="img-con">
                        <img :src="userInfo.icon||require('@/assets/images/wholesale/user-icon.png')" alt="">
                    </div>
                    <div class="userInfo">
                        <p class="user-name">{{nowUser.nickname||'暂无昵称'}}</p>
                        <p class="inviteCode">邀请码：{{userInfo.invitationCode}}</p>
                        <p class="address">
                            <img src="@/assets/images/wholesale/address-icon.png">
                            <span class="WholesaleAddress">{{addressBlcok||'暂无地址'}}</span>
                        </p>
                        <p class="phone"><img
                                :src="require('../../assets/images/wholesale/phone-icon.png')">{{nowUser.phone}}
                        </p>
                    </div>
                </div>
                <div class="select">
                    <select @change="changeAuth">
                        <option :value="item.roleId" :selected="selectAuth==item.roleId"
                            v-for="(item,index) in userInfo.userRoles">{{item.name}}
                        </option>
                    </select>
                </div>
            </div>
            <!-- 除了区域批发商角色都展示收益
                1.区域批发商1.0版本要求
              -->
            <div class="profit">
                <div class="profit-header">
                    <p class="label">余额：￥{{currentTotalBalance||'0.00'}}</p>
                    <p @click="withdrawal" class="btn">立即提现</p>
                </div>
                <div class="profit-body">
                    <div class="profit-item">
                        <span>{{money.roleEarnigns||'0.00'}}</span>
                        <p>{{selectAuth==5?'累计货款':'角色收益'}}</p>
                    </div>
                    <div class="profit-item">
                        <span>{{money.yesterDayEarnigns||'0.00'}}</span>
                        <p>{{selectAuth==5?'今日货款':'昨日收益'}}</p>
                    </div>
                    <div class="profit-item">
                        <span>{{money.thisMonthDayEarnigns||'0.00'}}</span>
                        <p>{{selectAuth==5?'待结算货款':'本月收益'}}</p>
                    </div>
                    <div class="profit-item none-b">
                        <span>{{money.sumEarnigns||'0.00'}}</span>
                        <p>{{selectAuth==5?'已提现':'总收益'}}</p>
                    </div>
                </div>
            </div>
            <!--1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官-->
            <!-- 发展角色展示的内容 -->
            <div v-if="[2,3,6].indexOf(Number(selectAuth))!=-1" class="invitation">
                <div v-if="selectAuth!=3&&selectAuth!=4" @click="changeShare(3)" class="invitation-item">
                    <img :src="require('../../assets/images/ewm.png')" alt="">
                    <p>邀请发展商</p>
                </div>
                <div @click="changeShare(5)" class="invitation-item">
                    <img :src="require('../../assets/images/ewm.png')" alt="">
                    <p>邀请区域批发商</p>
                </div>
                <div @click="goDetail(3)" class="invitation-item">
                    <img :src="require('../../assets/images/invitation.png')" alt="">
                    <p>旗下发展人数</p>
                </div>
            </div>
            <!--区域批发商2.1版本新增-->
            <div v-if="[5].indexOf(Number(selectAuth))!=-1" class="invitation">
                <div v-if="selectAuth!=3&&selectAuth!=4" @click="showEwm" class="invitation-item">
                    <img :src="require('../../assets/images/ewm.png')" alt="">
                    <p>店铺二维码</p>
                </div>
                <div @click="goSetting(1)" class="invitation-item">
                    <img :src="require('../../assets/images/block/shop_icon.png')" alt="">
                    <p>店铺设置</p>
                </div>
                <router-link to="/block/stocklist" class="invitation-item">
                    <img :src="require('../../assets/images/block/icon-stock-list.png')" alt="">
                    <p>库存报表</p>
                </router-link>
            </div>
            <!-- 统筹角色展示的内容
                2.区域批发商2.0版本要求
             -->
            <div v-if="[1,4,7].indexOf(Number(selectAuth))!=-1" class="invitation">
                <!-- 1总部统筹官 -->
                <div v-if="selectAuth==1" @click="changeShare(7)" class="invitation-item">
                    <img :src="require('../../assets/images/icon_qrcode.png')" alt="">
                    <p>统筹省统筹官</p>
                </div>
                <!-- 4区域统筹官 -->
                <div v-if="selectAuth==4" @click="changeShare(5)" class="invitation-item">
                    <img :src="require('../../assets/images/icon_qrcode.png')" alt="">
                    <p>统筹区域批发商</p>
                </div>
                <!-- 1总部统筹官 7省统筹官 -->
                <div v-if="[1,7].indexOf(Number(selectAuth))!=-1" @click="changeShare(4)" class="invitation-item">
                    <img :src="require('../../assets/images/icon_qrcode.png')" alt="">
                    <p>区域统筹官</p>
                </div>
                <div @click="goDetail(4)" class="invitation-item">
                    <img :src="require('../../assets/images/icon_qxfzrs.png')" alt="">
                    <p>旗下管理人员</p>
                </div>
            </div>

            <div :style="{'padding-top':'0rem'}" class="fn-list">
                <!--2020/08/24区域批发商v3.0版本新增-->
                <div class="fn-item" v-if="selectAuth==5">
                    <router-link to="/block/message" class="links">
                        <span class="fn-item-title fn-item-msg">
                            消息中心
                            <i v-show="unreadCount" class="msg-box">{{  unreadCount > 9 ? '9+' :  unreadCount  }}</i>
                        </span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <!--2020/08/13区域批发商v2.1版本新增-->
                <div class="fn-item" v-if="selectAuth==5">
                    <router-link :to="'/myorder?seq='+userInfo.seq+'&fromApp=true'" class="links">
                        <span class="fn-item-title">历史订单</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
<!--                nowUser.isSpecial-->
                <div v-if="nowUser.isSpecial" class="fn-item" >
                    <router-link :to="'/block/platformOrder?userId='+userInfo.userId" class="links">
                        <span class="fn-item-title">平台订单管理</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <!--2020/08/24区域批发商v3.1.1版本新增-->
                <div class="fn-item" v-if="nowUser.isSpecial">
                    <router-link to="/block/stockChange" class="links">
                        <span class="fn-item-title fn-item-msg">
                            进销存报表
                        </span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <!-- 4.区域统筹官 7.省统筹官 -->
                <div v-if="[5].indexOf(Number(selectAuth))!=-1" class="fn-item links">
                    <router-link to="/block/UserManagement" class="links">
                        <span class="fn-item-title">我的下游商家</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div v-if="[4,5,7].indexOf(Number(selectAuth))!=-1" class="fn-item links" @click="goTop">
                    <span class="fn-item-title">我的上级统筹官</span>
                    <span class="fn-item-con"></span>
                </div>
                <div v-if="selectAuth==5" class="fn-item">
                    <router-link to="/block/blockmyAddress" class="links">
                        <span class="fn-item-title">收货地址</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div v-if="nowUser.isSpecial&&selectAuth==1" class="fn-item">
                    <div @click="changeShare(1)" class="links">
                        <span class="fn-item-title">邀请总部统筹官</span>
                        <span class="fn-item-con"></span>
                    </div>
                </div>
                <div v-if="nowUser.isSpecial&&selectAuth==1" class="fn-item">
                    <div @click="goDetail(5)" class="links">
                        <span class="fn-item-title">平台旗下总部统筹官</span>
                        <span class="fn-item-con"></span>
                    </div>
                </div>
                <div class="fn-item">
                    <router-link to="/block/blank" class="links">
                        <span class="fn-item-title">我的银行卡</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/videoList" class="links">
                        <span class="fn-item-title">操作指南</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item" v-if="[1, 2, 3, 4, 7].indexOf(Number(selectAuth))!=-1">
                    <router-link :to="'/block/incomeList?seq=' + userInfo.seq" class="links">
                        <span class="fn-item-title">新批发收益</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/notice" class="links">
                        <span class="fn-item-title">客服中心</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <div class="fn-item">
                    <router-link to="/block/changecode" class="links">
                        <span class="fn-item-title">修改密码</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
                <!--3发展商 5区域批发商-->
                <div v-if="[2,3,4,5,7].indexOf(Number(selectAuth))!=-1" class="fn-item">
                    <router-link :to="'/block/applylist?phone='+userInfo.phone" class="links">
                        <span class="fn-item-title">申请记录</span>
                        <span class="fn-item-con"></span>
                    </router-link>
                </div>
            </div>
            <share :shareData="shareData" ref="share" :key="timer"></share>
            <div @click="loginOut" class="setting-item">
                <span>退出登录</span>
            </div>
        </div>

        <div class="showEwm" v-show="isShowEwm">
            <div class="showBgc"></div>
            <div class="showEwmBox">
                <div class="ewmClose" @click="showEwm">
                    <img :src="require('../../assets/images/wholesale/close-icon.png')" alt="">
                </div>
                <img class="ewmPic" :src="qrCode" alt="">
                <p class="saveEwm" @click="toastShow('长按二维码图片即可保存')">保存二维码到相册</p>
            </div>
        </div>
        <blockTabbar ref="block"></blockTabbar>
    </div>
</template>
<script>
    import blockTabbar from '@/components/blockTabbar'
    import share from "@/components/share"
    import {
        Toast,
        Indicator
    } from 'mint-ui';
    import {
        setCookie,
        showToast
    } from '../../assets/js/common';
    import wx from 'weixin-sdk-js';
    import {
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                seq: "",
                codeImg: '',
                nowUser: sessionStorage.getItem("nowUser") || {}, // 当前角色数据
                shareData: {
                    sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                }, //分享时的数据
                userName: this.$store.state.userInfo.userRoles || [],
                userInfo: this.$store.state.userInfo || {},
                addressBlcok: this.$store.state.userInfo && this.$store.state.userInfo.userRegions ? this.$store.state
                    .userInfo.userRegions[0].regionDetails : "",
                selectAuth:this.$store.state.userInfo.Blocktype,
                money: {}, // 收益的数据
                isShowEwm: false, // 是否显示店铺二维码弹窗
                qrCode: '', // 邀请二维码
                currentTotalBalance:'',
                // 刷新
                timer: 0,
                unreadCount: 0,// 未读消息数量
            }
        },
        components: {
            blockTabbar,
            share
        },
        created() {
            if (!sessionStorage.getItem("bearer")) {
                this.$router.push({
                    path: '/login'
                });
            }
            this.videoUrl = this.VIDEO;
            this.getUserRole(this.userInfo.Blocktype, sessionStorage.getItem("seq"));
        },
        mounted() {
            // this.getUserInfoType();
            this.queryMessage();
        },
        watch: {
            '$store.state.userBlock'() {
                this.userBlock = this.$store.state.userBlock;
            }
        },
        methods: {
            // 显示二维码
            showEwm() {
                axios.get(`${this.blockURL}/qypfs-store/store/findStoreBySeqShowQrCode?seq=${this.$store.state.userInfo.seq}`).then((res) => {
                    if (res.data.code == 200) {
                        this.qrCode = res.data.data;
                        this.isShowEwm = !this.isShowEwm
                    } else {
                        showToast('二维码生成失败')
                    }
                }).catch(err => {})
            },
            getInfo() {
                axios({
                    url: this.blockURL + "/qypfs-wallet/balance/getBalance",
                    method: "post",
                    data: {
                        seq: this.userInfo.seq
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.currentTotalBalance = data.currentTotalBalance;
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            // 提示
            toastShow(val) {
                showToast(val)
            },
            // 跳转至店铺信息设置页面
            goSetting() {
                this.$router.push({
                    path: '/block/storeInfo',
                    query: {}
                });
            },
            // 更新用户角色
            updateUserType() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then((res) => {
                    if (res.data.code == 200) {
                        var data = res.data.data;
                        this.$set(this.userInfo, "userRoles", data.userRoles)
                        // 保存当前选中的角色到store中
                        var userInfo = this.$store.state.userInfo;
                        userInfo.icon = data.icon;
                        this.saveRole(userInfo || {});
                    }
                }).catch(err => {})
            },
            // 点击跳转上级统筹官
            goTop() {
                if (this.nowUser.boolSuperior) {
                    this.$router.push({
                        path: '/block/UserDetalis',
                        query: {
                            userId: this.userInfo.userId,
                            id: this.selectAuth,
                            top: true
                        }
                    });
                } else {
                    Toast('当前身份暂无上级统筹官');
                }
            },
            // 获取收益数据
            getMoneyData() {
                axios.get(this.blockURL +
                    `/qypfs-profit/earnings/findUserRoleEarnings?roleId=${this.selectAuth}&seq=${this.userInfo.seq}`,
                    ).then((res) => {
                    if (res.data.code == 200) {
                        this.money = res.data.data
                    }
                }).catch(err => {})
            },
            // 点击不同角色下拉框切换事件
            changeAuth(e) {
                Indicator.open();
                this.selectAuth = e.target.value;
                // 如果是区域批发商的话需要做些处理
                var userInfo = this.$store.state.userInfo;
                userInfo.Blocktype = this.selectAuth;
                if (userInfo.Blocktype == 5) userInfo.business = 2;
                if (userInfo.Blocktype != 6) {
                    this.$store.commit('saveStoreId', userInfo.userId);
                }
                // 保存当前选中的角色到store中
                this.saveRole(userInfo);
                // 根据获取得数据得到角色数据
                this.getUserRole(e.target.value, this.seq);
                setTimeout(() => {
                    Indicator.close();
                }, 500)
            },
            // 点击发展人数
            goDetail(type) {
                switch (type) {
                    // 如果点击的是旗下发展人数的话
                    case 3:
                        this.$router.push({
                            path: `/block/UserDevelopment`
                        });
                        break;
                        // 如果点击的是旗下管理人员的话
                    case 4:
                        this.$router.push({
                            path: `/block/UserDevelopment?userId=${this.userInfo.userId}`
                        });
                        break;
                    case 5:
                        // typeOne表示查询平台旗下的总部统筹官
                        this.$router.push({
                            path: `/block/UserDevelopment?userId=${this.userInfo.userId}&typeOne=true`
                        });
                        break;
                }
            },
            ...mapActions([
                "saveRole",
            ]),
            // 批发网区域批发商个人中心登录
            login() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then((res) => {
                    if (res.data.code == 200) {
                        var data = res.data.data;
                        data.Blocktype = data.userRoles[0].roleId; // 默认的登录角色
                        this.selectAuth = data.Blocktype;
                        this.userInfo = data;
                        // 根据获取得数据得到默认的角色数据
                        this.getUserRole(data.Blocktype, data.seq);
                        this.seq = data.seq;
                        // business 1买, 2卖
                        console.log('Blocktype==', data.Blocktype);
                        if (data.Blocktype == 5) data.business = 2;
                        if (data.Blocktype != 6) {
                            this.$store.commit('saveStoreId', data.userId);
                        }
                        this.saveRole(data || {});
                    }
                }).catch(err => {})
            },
            // 获取当前用户身份标识集合
            getUserInfoType() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then((res) => {
                    if (res.data.code == 200) {
                        var data = res.data.data;
                        this.userName = data.userRoles // 默认的登录角色
                        this.getInfo();
                    }
                }).catch(err => {})
            },
            // 获取当前选中角色的id
            getUserRole(type, seq) {
                var data = {
                    isInterest: "",
                    page: 1,
                    pageSize: 100,
                    roleId: type,
                    type: "",
                    userId: "",
                    userName: "string",
                    userSeq: this.userInfo.seq
                };
                axios.post(this.blockURL + `/qypfs-user/user/findUserRoleChecked`, data).then((res) => {
                    if (res.data.code == 200) {
                        this.getMoneyData();
                        this.nowUser = res.data.data;
                        var data = res.data.data.userCheckRegion[0];
                        this.addressBlcok = data.regionDetails || "";
                        var userInfo = this.$store.state.userInfo;
                        if (res.data.data.userCheckRole.roleId == 5 && !userInfo.business) {
                            userInfo.business = 2;
                            this.saveRole(userInfo || {});
                            this.$refs.block.business = 2;
                        }
                        this.getInfo();
                        sessionStorage.setItem("nowUser", JSON.stringify(res.data.data));
                    } else if (res.data.code == 1020) {
                        Toast(res.data.message);
                        setCookie('seq', '');
                        setCookie('isAuto', this.$base64.encode("false"));
                        sessionStorage.clear();
                        this.$store.dispatch("changeUserBlock", false);
                        this.saveRole({});
                        this.$router.push({
                            path: '/login'
                        });
                        return;
                    } else {
                        if (res.data.code != 401) {
                            Toast(res.data.message);
                        }
                    }
                }).catch(err => {})
            },
            // 显示toast弹窗
            withdrawal() {
                this.$router.push("/block/tixianDetails");
            },
            //分享商品事件
            changeShare(type) {
                this.getCodeImg(type);
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
            // 邀请发展商  邀请区域批发商 按钮点击事件
            getCodeImg(type) {
                // 更改为区域批发商模式
                // this.$store.dispatch("changeUserBlock",false);
                var that = this;
                var data = {
                    invitationType: type, // 邀请类型:1总部统筹官,2新发展商,3发展商,4统筹官,5区域批发商,6下游商家
                    type: this.selectAuth, // 分享者当前角色类型:1总部统筹官,2新发展商,3发展商,4统筹官,5区域批发商,6下游商家
                };
                axios.post(this.blockURL + '/qypfs-user/poster/shareCard', data)
                    .then((res) => {
                        if (res.data.code == 200) {
                            this.codeImg = res.data.message;
                            //初始化分享数据
                            var shareObj = {
                                // 分享的链接，默认使用location.href
                                url: res.data.data.url,
                                // 分享的标题，默认使用document.title
                                title: res.data.data.title,
                                // 分享的摘要，默认使用<meta name="description" content="">content的值
                                digest: res.data.data.content,
                                // 分享的图片，默认获取本页面第一个img元素的src
                                pic: res.data.data.softwareLogo,
                                // 默认显示的网站为以下六个个,支持设置的网站有
                                // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                                sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                            };
                            this.shareData = shareObj;
                            this.timer = Math.random();
                            setTimeout(()=>{
                                this.$refs.share.changeShare()
                            })
                        }
                    });
            },
            goUserInfo() {
                this.$router.push({
                    path: '/wholesale/wholesaleAddress'
                });
            },
            goInviteList() {
                this.$router.push({
                    path: '/wholesale/invitation'
                });
            },
            // 未读消息数量
            queryMessage() {
                if (this.selectAuth != 5) return;
                axios.get(this.blockURL+'/qypfs-message/api/message/unreadCount', { }).then(res => {
                    res.data.code == 200 ? this.unreadCount = res.data.data || 0 : Toast(res.data.message || '系统错误')
                })
            },
        }
    }

</script>
<style scoped>
    .showEwm {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    .showEwm .showBgc {
        position: absolute;
        z-index: 11;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .3);
    }

    .showEwm .ewmClose {
        padding: 0.34rem 0.64rem;
        right: 29px;
        top: 13px;
        position: absolute;
        z-index: 13;
    }

    .showEwm .ewmClose img {
        width: 0.8rem;
        height: 0.8rem;

    }

    .showEwm .showEwmBox {
        padding: 0.68rem;
        width: 90%;
        height: 18rem;
        position: absolute;
        z-index: 12;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 0.2rem;
        text-align: center;
        overflow: hidden;
    }

    .showEwm .shopHead {
        display: flex;
        align-items: center;
        font-size: 0.68rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .showEwm .shopHead p {
        padding-left: 0.48rem;
    }

    .showEwm .shopHead img {
        width: 2.27rem;
        height: 2.27rem;
    }

    .showEwm .ewmPic {
        width: 88%;
        display: block;
        margin: 0 auto;
    }

    .showEwm .saveEwm {
        display: inline-block;
        margin: 0 auto;
        padding: 0.1rem 0.2rem;
        background: rgba(243, 243, 243, 1);
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        margin-top: 0;
        position: absolute;
        bottom: 1.6rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .header-con {
        position: relative;
        background-color: #823d6c;
    }

    .header-con .bgc {
        position: absolute;
        top: 0;
        height: 6.4rem;
        z-index: 0;
        opacity: 0.3;
    }

    .select {
        position: absolute;
        right: 0.45rem;
        top: 1.32rem;
        overflow: hidden;
        background-color: transparent;
        display: flex;
        color: #FFF;
        align-items: center;
    }

    .select select {
        outline: none;
        margin: 0;
        color: #FFF;
        padding: 0.04rem 0.2rem;
        padding-left: 0.1rem;
        width: 100%;
        height: 1rem;
        border-radius: 0.16rem;
        line-height: 1rem;
        background-color: transparent;
        text-align: center;
        text-align-last: center;
    }

    .select select option {
        text-align: center;
        color: #333;
    }

    .invitation {
        margin-top: 0.4rem;
        background-color: #fff;
        display: flex;
        margin-bottom: 0.4rem;
        justify-content: space-around;
    }

    .invitation-item {
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        padding: 0.7rem;
    }

    .invitation-item img {
        width: 0.95rem;
        height: 0.95rem;
    }

    .profit {
        margin-top: 0.45rem;
        background-color: #fff;
        margin-bottom: 0.45rem;
    }

    .profit-header {
        height: 2rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.02rem solid rgba(204, 204, 204, 0.9);
        padding: 0 0.4rem;
    }

    .profit-header .label {
        font-size: 0.68rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .profit-header .btn {
        width: 2.73rem;
        height: 0.82rem;
        background: rgba(255, 96, 35, 1);
        border-radius: 1rem;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        text-align: center;
    }

    .profit-body {
        display: flex;
        padding: 0.8rem 0;
    }

    .profit-body .profit-item {
        border-right: 0.02rem solid rgba(204, 204, 204, 0.9);
        height: 2rem;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        width: 25%;
        text-align: center;
        line-height: 1rem;
    }

    .none-b {
        border-right: 0;
    }

    .store-management {
        padding-bottom: 55px;
    }

    .header-con {
        height: 6.4rem;
        background-size: 100% 100%;
        position: relative;
        background-color: #823d6c;
        margin-bottom: 0.45rem;
    }

    .store-info {
        padding: 0 0.4444rem;
        padding-top: 1.2889rem;
        display: flex;
        justify-content: space-between;
    }

    .img-con {
        position: relative;
        width: 3.5556rem;
        height: 3.5556rem;
        background-color: #fff;
        border-radius: 0.4rem;
        overflow: hidden;
    }

    .img-con img {
        height: 100%;
    }

    .userInfo {
        flex: 1;
        margin-left: 0.4444rem;
        position: relative;
    }

    .userInfo .oldidentity span {
        vertical-align: top;
        margin-right: 0.2rem
    }

    .userInfo .oldidentity img {
        width: 0.9rem;
        height: 0.9rem;
    }

    .userInfo .blockshop img {
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.1rem
    }

    .user-name {
        font-size: 0.7111rem;
        font-weight: 700;
        height: .65rem;
        color: #fff;
    }

    .address {
        margin-top: 0.2222rem;
        padding-left: 0.6666rem;
        position: relative;
        text-align: left;
    }

    .address img {
        height: 0.4444rem;
        width: 0.3556rem;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.2222rem;
    }

    .address span {
        font-size: 0.5333rem;
        color: #fff;
        line-height: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-right: 0.6666rem;
    }

    .phone {
        margin-top: 0.2222rem;
        position: relative;
        padding-left: 0.6666rem;
        font-size: 0.5333rem;
        color: #fff;
    }

    .phone img {
        height: 0.4444rem;
        width: 0.3556rem;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.2222rem;
    }

    .inviteCode {
        display: inline-block;
        font-size: 0.5333rem;
        color: #fff;
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

    .fn-list {
        padding-top: .4444rem;
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
    }

    .fn-item3 img {
        margin-top: 0.3rem;
        width: 2.4rem;
        height: 2.4rem;
    }

    .user-con img {
        float: left;
        width: 2.2222rem;
        height: 2.2222rem;
    }

    .user-con span {
        float: left;
        font-size: .6667rem;
        margin-left: .6rem;
    }

    .WholesaleAddress {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
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

    .inviteImg img {
        width: 100%;
    }

    .point-content span {
        display: inline-block;
        border-radius: 25px;
        border: 1px solid #ccc;
        overflow: hidden;
        margin: 0 0.2222rem;
    }

    .point-content span input {
        width: 2.2222rem;
        text-align: center;
    }

    .point-btn span {
        flex: 1;
        text-align: center;
        font-size: 0.6222rem;
        color: #fff;
    }

    .fn-item-msg{
        position: relative;
        display: flex;
        align-items: center;
    }
    .fn-item-msg .msg-box{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .6rem;
        transform: scale(.67);
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        background:rgba(255,0,0,1);
        width: .95rem;
        height: .95rem;
        border-radius: 50%;
        margin-left: .2rem;
    }

</style>
