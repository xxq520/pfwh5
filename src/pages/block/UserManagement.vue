<template>
    <div class="block-management">
        <!-- header -->
        <mt-header title="我的下游商家" ref="header" :fixed='true'>
            <p slot="left">
                <mt-button icon="back" @click="goBack"></mt-button>
            </p>
            <mt-button slot="right">
                <div @click="alertMsg" class="top">
                    <img class="topImg" :src="require('@/assets/images/sx_icon.png')" alt=""><span
                        class="topName">{{editText}}</span>
                </div>
            </mt-button>
        </mt-header>
        <!-- search -->
        <div class="search-box">
            <div class="search-con" ref="search">
                <input type="text" placeholder="请输入用户名或手机号码" class="search-input" v-model="searchText">
                <button class="search-btn" @click="searchFn" v-if="searchStatus == 0">搜索</button>
                <button class="search-btn" @click="clearSearch" v-else>取消</button>
            </div>
        </div>
        <div class="user-list">
            <ul>
                <li v-for="(item,index) in list" :key="index" class="user-item"
                    @click.stop="item.status==2 ? record(item.downswimId):''">
                    <div class="item-left">
                        <img :src="item.headImg" alt="" v-if="item.headImg">
                        <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
                    </div>
                    <div class="item-middle">
                        <p class="user-name"><span class="name">{{item.downNickName || "匿名"}}</span>
                            <span class="status-type1" v-if="item.status == 1">已同意</span>
                            <span class="status-type" v-if="item.status == 2">已拒绝</span>
                        </p>
                        <p class="user-tel">
                            <span>{{item.downUserName}}</span>
                        </p>
                    </div>
                    <div class="item-right">
                        <p v-if="item.createTime" class="time">{{item.createTime}}</p>
                        <div class="btns-con" v-if="item.status == '0'">
                            <button class="btns" @click.stop="toExamine(item.downswimId,2)">拒绝申请</button>
                            <button class="btns agree" @click.stop="toExamine(item.downswimId,1)">同意申请</button>
                        </div>
                        <div class="btns-con" v-if="item.status == '2'">
                            <button class="btns agree" @click.stop="toExamine(item.downswimId,1)">同意申请</button>
                        </div>
                        <div class="btns-con" v-if="item.status == '1'">
                            <button class="btns" @click.stop="toExamine(item.downswimId,2)">拒绝申请</button>
                        </div>
                        <button class="btns" @click.stop="delUser(item.downswimId)" v-if="isEdit">删除</button>
                    </div>
                </li>
            </ul>
            <p v-if="!noData" class="no-data">{{noDataText}}</p>
            <!-- 设置折扣弹框 -->
        </div>
        <div class="filterpopup filterpopupnew">
            <mt-popup id="filterwrap" v-model="popupVisible2" popup-transition="popup-fade" position="right"
                lockScroll="true">
                <div class="pay border pt border1">
                    <span class="titleFs">申请时间</span>
                    <div class="numipt over">
                        <mt-button class="btnitem payBtn" v-for="(item,key) in paymentArr" :key="key"
                            @click="curPayment(key)" :class="{'active':key == paymentIdx}">{{item.value}}</mt-button>
                    </div>
                </div>
                <div class="pay pt none">
                    <span class="titleFs">申请状态</span>
                    <div class="numipt over">
                        <mt-button class="btnitem payBtn status" v-for="(item,key) in statusArr" :key="key"
                            @click="curStatus(key)" :class="{'active':key == statusIdx}">{{item.value}}</mt-button>
                    </div>
                </div>
                <div class="filterend">
                    <mt-button id="reset" type="default" @click="reset">重置</mt-button>
                    <mt-button id="sure" type="default" @click="sureCheck">确定</mt-button>
                </div>
            </mt-popup>
        </div>
        <!-- <wholesale-nav></wholesale-nav> -->
        <div class="setting-mask" v-show="isShowMask">
            <div class="setting-box">
                <div class="title">折扣</div>
                <div class="input-con">
                    <span>请输入折扣比例</span><input type="number" placeholder="折扣" v-model="settingValue"><span>折</span>
                </div>
                <div class="btns-con">
                    <button class="cancel" @click="closeMask">取消</button>
                    <button class="confirm" @click="settingZK">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import wholesaleNav from '@/components/WholesaleNav';
    import {
        showToast
    } from '@/assets/js/common.js';
    import {
        mapActions
    } from "vuex";

    export default {
        data() {
            return {
                isEdit: false,
                editText: "筛选",
                searchText: "",
                seq: '',
                mobile: '',
                params: {},
                list: [

                ],
                search: "",
                conHeight: "",
                bottomnav: {
                    index: "用户管理"
                },
                searchStatus: 0,
                pages: 1,
                isLoading: true,
                allLoaded: false,
                noData: false,
                noDataText: "暂无数据",
                isShowMask: false, //弹框显示
                settingValue: "", //设置折扣
                MerchantSEQ: '', //下有商家seq
                popupVisible2: false, // 是否显示筛选按钮
                paymentArr: [ // 申请状态查询
                    {
                        value: '今天',
                        dateStatus: 1
                    },
                    {
                        value: '昨天',
                        dateStatus: 2
                    },
                    {
                        value: '7天',
                        dateStatus: 3
                    },
                    {
                        value: '全部',
                        dateStatus: 0
                    },
                ],
                paymentIdx: 3,
                statusArr: [ // 申请状态列表查询数据
                    {
                        value: '已同意',
                        status: 1
                    },
                    {
                        value: '已拒绝',
                        status: 2
                    },
                    {
                        value: '待处理',
                        status: 0
                    },
                    {
                        value: '全部',
                        status: 3
                    },
                ],
                statusIdx: 3,
                payment: 3,
                status: "",
                userId: this.$store.state.userInfo.userId,
            }
        },
        components: {
            wholesaleNav
        },
        created() {
            this.seq = sessionStorage.getItem('seq');
            this.mobile = sessionStorage.getItem('mobile');
        },
        mounted() {
            this.getToken()
            Indicator.open();
        },
        methods: {
            ...mapActions(["saveRole"]),
            getToken() {
                var that = this;
                var fromApp = that.$route.query;
                if (fromApp.app) {
                    console.log('2');
                    // 在global中挂载方法
                    window["getAppLogin"] = function (json) {
                        console.log(3);
                        sessionStorage.setItem("bearer", json);
                        that.getUserInfo();
                    };
                    if (sessionStorage.getItem("bearer")) {
                        that.getUserlist();
                    }
                } else {
                    that.getUserlist();
                }
            },
            getUserInfo() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.seq = data.seq;
                        this.userId = data.userId;
                        this.saveRole(data);
                        this.getUserlist();
                    }
                });
            },



            alertMsg() {
                this.popupVisible2 = true;
            },
            //确定筛选
            sureCheck() {
                var that = this;
                this.list = [];
                this.pages = 1;
                that.popupVisible2 = false;
                that.getUserlist();
                // this.reset();
            },
            // 筛选重置
            reset() {
                this.ordernum = '';
                this.inputStartTime = '';
                this.inputEndTime = '';
                this.startTime = new Date();
                this.endTime = new Date();
                this.paymentIdx = 3;
                this.statusIdx = 3;
            },
            // 筛选弹窗-支付方式样式切换
            curPayment(index) {
                this.paymentIdx = index;
            },
            // 筛选弹窗-支付方式样式切换
            curStatus(index) {
                this.statusIdx = index;
            },
            //计算中间滚动内容高度
            setHeight() {
                //屏幕高度
                let body = document.documentElement.clientHeight;
                //头部高度
                let header = this.$refs.header.$el.clientHeight;
                //搜索区高度
                let search = this.$refs.search.$el.clientHeight;
                //底部高度
                let bottom = document.querySelector('.mint-tabbar').clientHeight;
                this.conHeight = body - header - search - bottom;
                sessionStorage.setItem("user", this.conHeight);
            },
            loadBottom() {
                this.getUserlist();
                this.allLoaded = true; // 若数据已全部获取完毕
                this.$refs.loadmore.onBottomLoaded();
            },
            //获取用户列表
            getUserlist() {
                if (!this.isLoading) return;
                let params = {
                    page: this.pages,
                    pageSize: 10,
                    storeUserId: this.userId,
                    userNameOrPhone: this.searchText,
                    dateStatus: this.paymentArr[this.paymentIdx]['dateStatus'],
                    status: this.statusArr[this.statusIdx]['status']
                }
                axios.post(this.blockURL + '/qypfs-user/wholesaler/findDownMerchantList', params)
                    .then((res) => {
                        console.log('1');
                        Indicator.close();
                        // console.log('findDownMerchantList', res);
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            if (data.list && data.list.length != 0) {
                                // console.log(this, this.list);

                                this.list = this.list.concat(data.list);
                                if (this.pages > res.data.totalPage) {
                                    this.isLoading = false;
                                }
                                this.allLoaded = false;
                                this.pages++;
                                this.noData = true;
                            } else {
                                if (this.pages > 1) {
                                    this.noDtataText = "暂无更多数据数据"
                                } else {
                                    this.noDataText = "暂无数据"
                                }
                                this.noData = false;
                            }
                        }
                    });
            },
            // 审核
            toExamine(userSeq, status) {
                let self = this;
                if (status == 2) {
                    MessageBox({
                        title: '提示',
                        message: '拒绝该用户申请？',
                        showCancelButton: true
                    }).then(action => {
                        if (action == 'confirm') {
                            self.doExamine(userSeq, status);
                        }
                    });
                } else {
                    self.doExamine(userSeq, status);
                }

            },
            doExamine(userSeq, status) {
                let self = this;
                let params = {
                    downswimId: userSeq,
                    status: status,
                    regionalId: this.userId
                }
                axios.get(this.blockURL + '/qypfs-user/wholesaler/updateAudiStatus', {
                        params: params
                    })
                    .then((res) => {
                        showToast(res.data.message);
                        self.list = [];
                        self.pages = 1;
                        self.getUserlist();
                    });
            },
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            // 搜索
            searchFn() {
                if (this.searchText == '') {
                    Toast("请输入用户名或手机号码");
                    // return false;
                } else {
                    this.pages = 1;
                    this.list = [];
                    this.noDataText = "数据加载中..."
                    this.getUserlist();
                    this.searchStatus = 1;
                }
            },
            //取消搜索
            clearSearch() {
                this.noData = false;
                this.pages = 1;
                this.list = [];
                this.searchText = "";
                this.noDataText = "数据加载中..."
                this.getUserlist();
                this.searchStatus = 0;
            },
            //编辑
            editFn() {
                this.isEdit = !this.isEdit;
                if (this.isEdit) {
                    this.editText = "取消";
                } else {
                    this.editText = "编辑";
                }
            },
            delUser(val) {
                let self = this;
                MessageBox({
                    title: "",
                    message: '确定删除该用户?',
                    showCancelButton: true
                }).then(action => {
                    if (action == 'confirm') {
                        self.delUserData(val);

                    }
                });
            },
            // 设置折扣
            /**
             *userSeq下有商家seq
             */
            settingZK() {
                let that = this;
                this.isShowMask = false;

                if (that.settingValue >= 10) {
                    showToast("请输入低于10的数");
                    return;
                }
                if (that.settingValue.indexOf(".") > -1 && that.settingValue.split(".")[1].length > 2) {
                    showToast("最多输入两位小数");
                    return;
                }
                if (that.settingValue < 0) {
                    showToast("不能为负数");
                    return;
                }
                Indicator.open();
                axios.get(this.URL + '/WholesaleManage/SetDiscountRaio', {
                        params: {
                            WholesaleSEQ: this.seq,
                            MerchantSEQ: that.MerchantSEQ,
                            DiscountRaio: that.settingValue
                        }
                    })
                    .then(res => {
                        Indicator.close()
                        if (res.data.code == '200') {
                            that.pages = 1;
                            this.list = [];
                            that.getUserlist();
                            showToast("设置成功");
                        } else {
                            showToast("设置失败，请重新设置");
                        }
                    })
                    .catch(err => {
                        Indicator.close();
                    });
            },
            // 请求接口
            toggleMask(seq, value) {
                this.isShowMask = !this.isShowMask;
                value ? value : "";
                seq ? seq : "";
                this.settingValue = value;
                this.MerchantSEQ = seq;
            },
            closeMask() {
                this.isShowMask = !this.isShowMask;
            },
            // 跳转购买记录页面
            record(seq) {
                this.$router.push({
                    path: "/wholesale/purchaseRecord",
                    query: {
                        id: seq
                    }
                });
            }
        }
    }

</script>
<style>
    .block-management .mint-header.is-fixed {
        z-index: 10000;
        background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
        color: #fff;
    }

    .block-management .search-box {
        display: block;
        position: fixed;
        top: 43px;
        width: 100%;
        height: 50px;
        background-color: #f5f5f5;
        z-index: 1;
    }

    .block-management .search-con {
        width: 13.7778rem;
        height: 1.2rem;
        background-color: #fff;
        border-radius: 1.2rem;
        overflow: hidden;
        margin: .4444rem auto 0;
    }

    .block-management .search-con .search-input,
    .block-management .search-con .search-btn {
        height: 1.2rem;
        float: left;
    }

    .block-management .search-con .search-input {
        width: 11.5556rem;
        text-indent: 1.6rem;
        background: url('../../assets/images/search-icon.png') no-repeat .6rem center;
        background-size: .8rem;
    }

    .block-management .search-con .search-btn {
        width: 2.2222rem;
        border: 0;
        background-color: #f23030;
        color: #fff;
    }

    .block-management .user-list {
        padding-top: 100px;
        overflow: auto;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch
    }

    .block-management .user-item {
        position: relative;
        padding: .3556rem .5333rem;
        overflow: hidden;
        border-bottom: .0222rem solid #e4e4e4;
        box-sizing: border-box;
        background-color: #fff;
    }

    .block-management .user-item .user-type,
    .block-management .user-item .user-type1 {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-width: 1.2444rem 1.2444rem 0 0;
        border-style: solid;
        border-color: #f23030 transparent transparent transparent;
    }

    .block-management .user-item .user-type1 {
        border-color: #e7ab08 transparent transparent transparent;
    }

    .block-management .user-item .type-text {
        display: block;
        position: absolute;
        left: 0;
        top: -1.2444rem;
        font-size: .5333rem;
        color: #fff;
    }

    .block-management .item-left {
        width: 2.4444rem;
        height: 2.2222rem;
        border-radius: 100%;
        overflow: hidden;
        float: left;
    }

    .block-management .item-middle {
        margin-left: .2222rem;
        float: left;
    }

    .block-management .item-right {
        position: relative;
        float: right;
        top: 0rem;
    }

    .block-management .item-right .btns-con {
        position: absolute;
        right: 0;
        top: 1.3333rem;
        width: 250%;
        display: flex;
        justify-content: flex-end;
    }

    .block-management .item-middle .user-name {
        font-size: .6667rem;
        margin: .2222rem 0;
        display: flex;
        align-items: center;
    }

    .block-management .item-middle .name {
        display: inline-block;
        max-width: 4.4444rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
    }

    .block-management .item-middle .status-type,
    .block-management .item-middle .status-type1 {
        display: inline-block;
        font-size: .4444rem;
        color: #f23030;
        border: .0222rem solid #f23030;
        border-radius: .1111rem;
        width: 1.8667rem;
        height: .6667rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: .1rem;
    }

    .block-management .item-middle .status-type1 {
        color: #2acf2e;
        border-color: #2acf2e;
    }

    .block-management .user-tel,
    .block-management .time {
        color: #666;
        font-size: .5778rem;
        text-align: right;
        /* margin:.1111rem 0; */
    }

    .block-management .user-tel {
        text-align: left;
    }

    .block-management .btns {
        width: 3.5555rem;
        height: .8889rem;
        border: 0;
        color: #fff;
        background-color: #FF0000;
        font-size: .5333rem;
        border-radius: 4px;
        outline-style: none;
        min-width: 3.6rem;
    }

    .block-management .zhekou {
        width: 2.6667rem;
        background: #ff9f6e url("../../assets/images/zhekou-icon.png") no-repeat .3333rem center;
        background-size: .6222rem .4889rem;
        color: #fff;
        padding-left: 1rem;
        margin-right: .4444rem;
    }

    .block-management .agree {
        margin-left: .4444rem;
        background-color: #2ACF2E;
    }

    .block-management .no-data {
        font-size: .7111rem;
        color: #999;
        text-align: center;
        padding: .6667rem 0;
    }

    .block-management .mint-loadmore-bottom {
        font-size: 0.6667rem;
    }

    .block-management .setting-mask {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, .3);
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

    .block-management .setting-mask .setting-box {
        background-color: #fff;
        width: 75%;
        margin: 0 auto;
        border-radius: 3px;
    }

    .block-management .setting-mask .title {
        padding: 15px 0 10px;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #dedede;
    }

    .block-management .setting-mask .input-con {
        text-align: center;
        padding: 20px 20px 30px;
        font-size: .6222rem;
    }

    .block-management .setting-mask input {
        border: 1px solid #dedede;
        padding: 4px 5px;
        border-radius: 5px;
        width: 20%;
        margin: 0 .2222rem;
        text-align: center;
        font-size: .6222rem;
    }

    .block-management .setting-mask .btns-con {
        display: flex;
        justify-content: flex-start;
        height: 40px;
        line-height: 40px;
        border-top: 1px solid #dedede;
    }

    .block-management .setting-mask button {
        background-color: transparent;
        border: 0;
        flex: 1;
        outline-style: none;
        font-size: .7111rem;
    }

    .block-management .setting-mask button:active {
        background-color: #dedede;
    }

    .top {
        display: flex;
        align-items: center;
    }

    .topImg {
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.1rem;
    }

    .topName {
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 500;
    }

    .block-management .setting-mask .cancel {
        border-right: 1px solid #dedede;
    }

    .block-management .setting-mask .confirm {
        color: #f23030;
    }

    .titleFs {
        font-size: 0.59rem !important;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    #filterwrap {
        height: 100%;
        padding: 0.6666rem;
        bottom: 0;
        right: 0;
        padding-top: 46px;
        width: 10rem;
    }

    .buttonNew {
        background: rgba(239, 239, 239, 1);
        font-size: 0.6222rem !important;
        color: rgba(153, 153, 153, 1) !important;
    }

    .block-management .payBtn {
        background: rgba(239, 239, 239, 1);
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        width: 3.8rem !important;
        padding: 0 1rem;
        display: block;
        margin-bottom: 0.6rem;
    }

    .block-management .status {
        padding: 0 0.9rem;
    }

    .block-management .over button {
        height: 1.3rem;
    }

    .over {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 0.3rem;
    }

    .pay {
        border-bottom: none !important;
    }

    .filterend {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        right: 0;
        display: flex;
        height: 2rem !important;
        line-height: 1rem !important;
    }

    #reset {
        width: 40% !important;
        background: #Fff;
        height: 2rem !important;
        margin: 0 !important;
        border-radius: 0 !important;
        padding: 0 !important;
    }

    #sure {
        border-radius: 0 !important;
        width: 60% !important;
        padding: 0 !important;
        background: rgba(255, 96, 35, 1) !important;
        height: 2rem !important;
        margin: 0 !important;
        color: rgba(255, 255, 255, 1) !important;
    }

    .filterpopup #filterwrap .filterend {
        right: 0 !important;
    }

    .filterpopupnew #filterwrap {
        width: 10rem !important;
    }

    .active {
        background: rgba(255, 238, 231, 1) !important;
        color: rgba(255, 96, 35, 1) !important;
    }

    .block-management .mint-popup-right {
        padding-top: 46px !important;
    }

    div.pt {
        border-bottom: 0.02rem solid rgba(230, 230, 230, 1) !important;
    }

    .pt .over {
        padding: 0rem !important;
    }

    div.border1 {
        border-bottom: 0.02rem solid rgba(230, 230, 230, 1) !important;
    }

    div.none {
        border: none !important;
    }

    .block-management .btns-con {}

</style>
