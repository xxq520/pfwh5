<template>
    <div class="global block-order">
        <div class="top">
            <mt-header :title="topnav.title">
                <mt-button icon="back" slot="left" @click="back"></mt-button>
                <span class="orderTypeTab" slot="right" @click="showfilter">
              <img src="../../assets/images/sx_icon.png">
              <span>筛选</span>
        </span>
            </mt-header>
            <!-- 滑动菜单栏 -->
            <div class="topwrap">
                <div class="topnav" ref="topnav">
                    <ul>
                        <li v-for="(item,index) in filter" :key="index" :title="item.id"
                            :class="{'lihover': item.id === navIndex}" @click="navClick(item.id,item.orderStatus)">
                            {{item.title}}<i></i></li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="main">
            <div class="tabBox" :style="{height:tabBoxHeight+'px'}"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="3">
                <div class="none"></div>
                <!-- 全部订单 -->
                <div id="tab0" class="statecontent" :class="{'showcontent':'tab0' === navIndex}">
                    <div class="SendingList">
                        <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder"
                               :datas="datas"></goods>
                    </div>
                </div>
                <!-- 待支付 -->
                <div id="tab1" class="statecontent" :class="{'showcontent':'tab1' === navIndex}">
                    <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder"
                           :datas="datas"></goods>
                </div>
                <!-- 待发货 -->
                <div id="tab3" class="statecontent" :class="{'showcontent':'tab2' === navIndex}">
                    <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder"
                           :datas="datas"></goods>
                </div>
                <!-- 待收货 -->
                <div id="tab2" class="statecontent" :class="{'showcontent':'tab3' === navIndex}">
                    <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder"
                           :datas="datas"></goods>
                </div>
                <!-- 退/换货 -->
                <div id="tab5" class="statecontent" :class="{'showcontent':'tab4' === navIndex}">
                    <!--v-if="datas.length"-->
                    <div class="exitGood">
                        <div :class="{'activGood':exitGood==2}" @click="changeExitGood(2)">已退款</div>
                        <div :class="{'activGood':exitGood==1}" @click="changeExitGood(1)">未退款</div>
                    </div>
                    <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder" :datas="datas"
                           :title="exitGood==2?'退款成功':''"></goods>
                </div>
                <!-- 已完成 -->
                <div id="tab6" class="statecontent" :class="{'showcontent':'tab5' === navIndex}">
                    <goods noPLatform="true" :num="navIndex.substr(3)" @reloadOrder="reloadOrder"
                           :datas="datas"></goods>
                </div>
                <img class="noData" v-if="!datas.length" src="../../assets/images/img_zw.png" alt="">
            </div>
        </div>

        <!-- 右侧筛选弹框 -->
        <div class="filterpopup">
            <mt-popup id="filterwrap" v-model="popupVisible2" popup-transition="popup-fade" position="right"
                      lockScroll="true">
                <div class="ordernum">
                    <span class="titleFs">订单号</span>
                    <div class="numipt ">
                        <el-input placeholder="请输入内容" type="tel" v-model="ordernum" clearable
                        ></el-input>
                    </div>
                </div>
                <div class="ordertime">
                    <span class="titleFs">订单时间</span>
                    <div class="numipt">
                        <input type="button" class="buttonNew" :value="inputStartTime==''?'开始时间':inputStartTime"
                               @click="openPicker">
                        <input type="button" class="buttonNew" :value="inputEndTime==''?'结束时间':inputEndTime"
                               @click="openPicker2">
                    </div>
                </div>
                <div class="ordernum">
                    <span class="titleFs">商品名称</span>
                    <div class="numipt ">
                        <el-input placeholder="请输入商品名称" type="text" v-model="goodsName" clearable></el-input>
                    </div>
                </div>
                <div class="ordernum noneBorder">
                    <span class="titleFs">收货人</span>
                    <div class="numipt ">
                        <el-input placeholder="请输入收货人姓名或手机号" type="text" v-model="consignee" clearable></el-input>
                    </div>
                </div>
                <div class="filterend">
                    <mt-button id="reset" type="default" @click="reset">重置</mt-button>
                    <mt-button id="sure" type="default" @click="sureCheck">确定</mt-button>
                </div>
            </mt-popup>
        </div>
        <div class="tamepiker">
            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date" v-model="startTime" :startDate="startDate1"
                                year-format="{value} 年"
                                month-format="{value} 月" date-format="{value} 日"
                                @confirm="handleConfirm" :endDate="endDate">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2" type="date" v-model="endTime" :startDate="startDate2"
                                year-format="{value} 年"
                                month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm2"
                                :endDate="endDate">
            </mt-datetime-picker>
        </div>
    </div>
</template>

<script type="text/javascript">
    import moment from 'moment'
    import {showToast} from '@/assets/js/common.js'
    import goods from '@/components/block/goods'

    export default {
        name: 'ordermanage',
        data() {
            return {
                // 商品名称
                goodsName: "",
                // 收货人
                consignee: "",
                filter: [
                    {id: 'tab0', title: '全部订单', orderStatus: -1}
                    , {id: 'tab1', title: '待支付', orderStatus: 6}
                    , {id: 'tab2', title: '待发货', orderStatus: 2}
                    , {id: 'tab3', title: '待收货', orderStatus: 3}
                    , {id: 'tab4', title: '退货/退款', orderStatus: 4}
                    , {id: 'tab5', title: '已完成', orderStatus: 5}
                ],
                topnav: {
                    title: '平台订单管理',
                    noBack: false
                },
                popupVisible: false,
                isShow: true,
                tabBoxHeight: 0,
                bootmnavHeight: 0,
                navIndex: "tab0",
                popupVisible2: false,//筛选弹窗显示控制
                ordernum: '',//筛选订单号数据,
                startTime: new Date(),
                endTime: new Date(),
                inputStartTime: '',
                inputEndTime: '',
                startDate1: new Date('2018'),
                startDate2: new Date('2018'),
                endDate: new Date(), // 结束时间
                loading: false,
                queryJson: {
                    salenumber: '',
                    StartTime: '',
                    EndTime: '',
                },
                orderStatus: -1,
                datas: [],
                // 用户信息
                userInfo: {},
                exitGood: 2, // 点击已退款或者未退款  2已退款  1未退款
                // 请求页数
                pageNum: 1
            }
        },
        components: {
            goods,
        },
        created() {
            this.getToken();

        },
        mounted() {
            this.getHeight();
        },
        methods: {
            getToken() {
                var that = this;
                var fromApp = that.$route.query;
                if (fromApp.fromApp) {
                    sessionStorage.setItem("bearer", fromApp.token);
                    this.getOrderData();
                } else {
                    this.getOrderData();
                }
            },
            // 返回按钮
            back() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            changeExitGood(num) {
                this.pageNum = 1;
                this.exitGood = num;
                this.orderStatus = num;
                this.datas = [];
                this.getOrderData();
            },
            getHeight() {
                let self = this;
                self.height();
            },
            height() {
                if (this.$route.query.seq == undefined || this.$route.query.seq == null) {
                    this.tabBoxHeight = document.documentElement.clientHeight
                        - document.querySelector('.topwrap').clientHeight
                    sessionStorage.setItem("contentHeight", this.tabBoxHeight);
                } else {
                    this.tabBoxHeight = document.documentElement.clientHeight
                        - document.querySelector('.mint-header').clientHeight
                        - document.querySelector('.topwrap').clientHeight;
                }
            },
            // 导航栏
            navClick(index, orderStatus) {
                var that = this;
                that.navIndex = index;
                this.pageNum = 1;
                that.datas = [];
                this.loading = false;
                that.orderStatus = orderStatus;
                if (index == 'tab1') {
                    that.isShow = true;
                } else {
                }
                if (orderStatus == 4) {
                    that.orderStatus = 9;
                }
                that.getOrderData();
            },

            // 筛选弹窗
            showfilter() {
                this.popupVisible2 = true;
            },
            // 时间筛选
            openPicker() {
                this.$refs.picker.open()
            },
            openPicker2() {
                this.$refs.picker2.open()
            },
            //订单筛选开始时间确定fn
            handleConfirm(data) {
                if (new Date(data).getTime() <= new Date(this.endTime).getTime()) {
                    let date = moment(data).format('YYYY/MM/DD');
                    this.inputStartTime = date;
                } else {
                    Toast({
                        message: '开始时间不能大于结束时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            //订单筛选开始时间确定fn
            handleConfirm2(data) {
                if (new Date(data).getTime() >= new Date(this.startTime).getTime()) {
                    let date = moment(data).format('YYYY/MM/DD');
                    this.inputEndTime = date;
                } else {
                    Toast({
                        message: '结束时间不能小于开始时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            //确定筛选
            sureCheck() {
                var that = this;
                that.datas = [];
                this.pageNum = 1;
                that.queryJson.salenumber = that.ordernum;
                that.queryJson.StartTime = that.inputStartTime;
                that.queryJson.EndTime = that.inputEndTime;
                that.popupVisible2 = false;
                that.getOrderData();
            },
            jumpToOrderDetails(orderCode, seq) {
                this.$router.push({path: '/orderDetails?orderCode=' + orderCode + '&seq=' + seq})
            },
            // 筛选重置
            reset() {
                this.ordernum = '';
                this.inputStartTime = '';
                this.inputEndTime = '';
                this.startTime = new Date();
                this.endTime = new Date();
                // 商品名称
                this.goodsName = "";
                // 收货人
                this.consignee = "";
            },
            // 获取订单列表数据
            getOrderData() {
                console.log(sessionStorage.getItem("bearer"), 'token----')
                this.loading = true;
                Indicator.open();
                var that = this;
                // 0->全部;1->待付款;2->待接单;3->待提货;4->售后/退款;5->待评价;其他->全部
                var objData = {
                    consignee: this.consignee,
                    goodsName: this.goodsName,
                    gtTime: this.queryJson.StartTime.replace(/\//g, '-'),
                    ltTime: this.queryJson.EndTime.replace(/\//g, '-'),
                    orderStatusBar: this.navIndex.substr(3) || 0,
                    pageIndex: this.pageNum,
                    pageSize: 10,
                    orderNo: this.queryJson.salenumber,
                    timeField: "createTime",
                };
                if (this.navIndex.substr(3) == 4) {
                    objData.type = this.exitGood // 订单附属状态(待付款,售后/退款)下使用:1(待改价/待退款);2(已改价/已退款);
                }
                //判断如果是登录的区域批发商的身份则加加上字段
                axios.post(this.blockURL + '/qypfs-order/api/order/super/list', objData)
                    .then(res => {
                        if (res.data.code == 200 && res.data.data.list.length) {
                            that.datas = that.datas.concat(res.data.data.list);
                            this.loading = false;
                            $('.balanceAllChoose .checked').removeClass('hover el-icon-check');
                            // 判断返回的数据页数是否还有下一页
                            if (res.data.data.list.length >= 10) {
                                this.pageNum = this.pageNum + 1;
                            } else {
                                this.loading = true;
                            }
                        } else {
                            showToast('暂无更多数据~');
                            this.loading = true;
                            Indicator.close();
                            return false;
                        }
                        ;
                        Indicator.close();
                    }).catch(() => {
                    showToast('请求超时');
                    Indicator.close();
                });
            },
            loadMore() {
                let self = this;
                self.getOrderData();
                console.log(111)
            },
            reloadOrder() {
                var that = this;
                this.pageNum = 1;
                that.datas = [];
                that.getOrderData();
            },
        },
        // 判断返回页面不刷新
        beforeRouteLeave(to, from, next) {
            if (to.name == 'blockOrderDetail' || to.name == 'busRefuseDetail' || to.name == 'buyRefuse') {
                from.meta.keepAlive = true;
            } else {
                from.meta.keepAlive = false;
            }
            ;
            next();
        }
    }
</script>
<style scoped>
    @import '../../assets/css/orderManage.css';

    .el-input__inner {
        height: 30px;
    }

    .noneBorder {
        border-bottom: none !important;
    }

    .ordertime .numipt {
        justify-content: space-between;
    }

    .ordertime .numipt input {
        margin-right: 0 !important;
        width: 4.2rem !important;
    }

    .status {
        padding: 0 !important;
    }

    .top {
        display: block !important;
    }

    .noData {
        padding: 2rem;
    }

    .top {
        position: fixed;
        top: 0;
        z-index: 100;
        width: 100%;
    }

    .none {
        height: 0.4rem;
    }

    #main {
        margin-top: 85px;
    }

    .pro-item {
        display: flex;
        justify-content: space-between;
        margin-top: 0.16rem;
    }

    .item-tit {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .item-right {
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    .SendingList .pro-top .code {
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-bottom: -0.15rem;
    }

    .SendingList .pro-top .status {
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 96, 35, 1)
    }

    .BtnBox .Btn {
        border: 1px solid #FF6023;
        color: #FF6023;
        padding: 0 0.8rem;
    }

    .SendingList .pro-list .pro-item .pro-desc .pro-title .title {
        font-size: 0.73rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .SendingList .pro-list {
        background-color: #FBF8FB;
        padding: 0;
    }

    .SendingList .pro-bottom .total .price {
        color: #FF6023;
    }

    .SendingList .pro-list .pro-item {
        /*border-top: 1px solid rgba(230,230,230,1);*/
        padding: 0.4rem 0.5333rem;
    }

    .changePriceBox .popup-box {
        padding-top: 0.5rem !important;
    }

    .tabBox {
        overflow: auto;
    }

    .proCode {
        display: flex;
        padding-top: 0 !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
    }

    .proCode img {
        width: 4.98rem;
        height: 4.98rem;
    }

    .changePriceBox .mint-popup {
        height: 53%;
    }

    .proCodeDiv .price {
        font-size: 0.73rem;
        font-family: PingFang SC;
        font-weight: 800;
        color: rgba(255, 96, 35, 1);
    }

    .proCodeDiv p {
        margin-top: 0.3rem;
    }

    .proCodeDiv {
        padding-left: 0.3rem;
        font-size: 0.55rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(102, 102, 102, 1)
    }

    .changePriceBox .popup-box .changeBtn {
        background: rgba(255, 96, 35, 1);
    }

    .changePriceBox .popup-box .changedPrice .changeInput {
        border: 1px solid rgba(255, 96, 35, 1);
    }

    .changePriceBox .popup-box .totalPrice .price {
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 96, 35, 1);
    }

    .topnav ul li.lihover {
        margin-right: 0.8rem;
    }

    .global #filterwrap {
    }

    .global .mint-header {
        z-index: 10000;
        background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
        color: #fff;
    }

    .exitGood {
        display: flex;
        width: 7rem;
        background-color: #fff;
        border-radius: 1rem;
        font-size: 0.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        margin: 0 auto;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .exitGood div {
        width: 50%;
        text-align: center;
    }

    .activGood {
        background: rgba(255, 96, 35, 1) !important;
        color: #fff !important;
    }

    .mint-indicator-mask {
        z-index: 1000 !important;
    }

    .counttc {
        z-index: 999999
    }

    span.orderTypeTab {
        float: right;
        border-radius: 4px;
        color: #fff;
        text-align: right;
        font-size: 0.6rem;
        font-family: PingFang SC;
        background-color: transparent !important;
        border: none;
    }

    .orderTypeTab img {
        margin-right: 0.1rem;
        width: 0.57rem;
        height: 0.59rem;
        vertical-align: middle;
    }

    .titleFs {
        font-size: 0.59rem !important;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    .buttonNew {
        background: rgba(239, 239, 239, 1);
        font-size: 0.6222rem !important;
        color: rgba(153, 153, 153, 1) !important;
    }

    .block-order .payBtn {
        background: rgba(239, 239, 239, 1);
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        width: 4rem !important;
        padding: 0 1rem;
        display: block;
        margin-bottom: 0.6rem;
    }

    .over {
        flex-wrap: wrap;
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

    .active {
        background: rgba(255, 238, 231, 1) !important;
        color: rgba(255, 96, 35, 1) !important;
    }

    .topnav ul li.lihover {
        color: #FF6023FF;
    }

    .global .topnav ul li i {
        background: #FF6023FF;
    }
</style>
