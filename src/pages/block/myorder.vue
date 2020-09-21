<template>
    <div class="myorder blockOrder" >
        <div class="fixtop">
            <mt-header :title="topnav.title" fixed ref="header">
                <span slot="right" @click="showfilter" class="orderTypeTab">
                      <img src="../../assets/images/sx_icon.png">
                      <span>筛选</span>
                </span>
            </mt-header>
            <!-- 滑动菜单栏 -->
            <div class="topwrap">
                <div class="topnav" >
                    <ul>
                        <li @click="changeState($event,0)" id="all" class="lihover" title="tab0">全部订单<i></i></li>
                        <li @click="changeState($event,1)" class="tab1">待支付<i></i></li>
                        <li @click="changeState($event,2)" title="tab3">待发货<i></i></li>
                        <li @click="changeState($event,3)" title="tab2">待收货<i></i></li>
                        <li @click="changeState($event,4)" title="tab4">退货/退款<i></i></li>
                        <li @click="changeState($event,5)" title="tab5">已完成<i></i></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="content-box"
                 v-infinite-scroll="loadMoreData"
                 infinite-scroll-disabled="isLoad"
                 infinite-scroll-distance="3"
                 :style="{height:(tabBoxHeight)+'px'}"
            >
                <div v-if="orderStatus==4||orderStatus==8||orderStatus==9" class="exitGood">
                    <div :class="{'activGood':exitGood==9}" @click="changeExitGood(9)">已退款</div>
                    <div :class="{'activGood':exitGood==8}" @click="changeExitGood(8)">未退款</div>
                </div>
                <!-- 全部订单 0-待支付,1-待接单,2-待发货(已接单),3-待收货(已发货),4-售后退款,5-已完成,6-取消 -->
                <div :id="'tab'+select" v-for="(box,select) in 6"  :class="(select==0?'showcontent':'')+' statecontent'">
                    <div v-for="(item,index) in nedPayList" :key="index" class="orderdetail">
                        <store-order :item="item" num="1"></store-order>
                        <div v-if="[6,7].indexOf(Number(item.orderStatus))==-1 && !item.lockTime" class="btnwrap">
                            <mt-button v-if="item.orderStatus == 0" @click="nPsurecancl(item)" id="cancl">取消订单</mt-button>
                            <mt-button v-if="item.orderStatus == 0" @click="showPay(item)" id="pay">立即支付</mt-button>
                            <mt-button v-if="[2,3,5].indexOf(Number(item.orderStatus)) > -1 && !item.lockTime" @click="returngoods1(item)" id="pay">申请退款</mt-button>
                            <mt-button v-if="item.orderStatus==3" @click="surereceive(item)" id="pay">确认收货</mt-button>
                            <mt-button v-if="item.orderStatus==4" @click="returnDetails(item)" id="pay">退款详情</mt-button>
                        </div>
                    </div>
                </div>
                <div class="nodata" v-show="nedPayList.length == 0">~ 没有更多数据了 ~</div>
            </div>
        </div>
        <!-- 右侧筛选弹框 -->
        <div class="filterpopup myorder" >
            <mt-popup id="filterwrap" v-model="popupVisible" popup-transition="popup-fade" position="right" lockScroll="true">
                <div class="ordernum">
                    <span class="titleFs">订单号</span>
                    <div class="numipt">
                        <el-input placeholder="请输入内容" value="aa" v-model="ordernum"  clearable></el-input>
                    </div>
                </div>
                <div class="ordertime">
                    <span class="titleFs">订单时间</span>
                    <div class="numipt">
                        <input :value="inputStartTime==''?'开始时间':inputStartTime" @click="openPicker" type="button" class="buttonNew">
                        <input :value="inputEndTime==''?'结束时间':inputEndTime" @click="openPicker2" type="button" class="buttonNew">
                    </div>
                </div>
                <div class="filterend">
                    <mt-button id="reset" type="default"  @click.native="clearForm">重置</mt-button>
                    <mt-button id="sure" type="default" @click.native="sureCheck">确定</mt-button>
                </div>
            </mt-popup>
        </div>
        <div class="tamepiker">
            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" v-model="startTime"  month-format="{value} 月" date-format="{value} 日"
            @confirm="handleConfirm" :startDate="startDate" :endDate="endDate">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2" type="date" year-format="{value} 年" v-model="endTime"  month-format="{value} 月" date-format="{value} 日"
            @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
            </mt-datetime-picker>
        </div>
        <block-tabbar></block-tabbar>
   </div>
</template>

<script type="text/javascript">
import '../../assets/css/myorder.css';
import Vue from 'vue'
import { MessageBox , Loadmore ,InfiniteScroll} from 'mint-ui';
import {showToast} from '../../assets/js/common.js'
import MintUI from 'mint-ui';
Vue.use(MintUI);
import moment from 'moment'
import $ from 'jquery'
import blockTabbar from '@/components/blockTabbar'
import storeOrder from '@/components/block/storeOrder'
export default {
    name: 'MyOrder',
    data() {
        return {
            topnav:{
                title:'我的订单'
            },
            amount: '线上支付',
            zhifutext:'全部',
            popupVisible:false,//筛选弹窗显示控制
            ordernum:'',//筛选订单号数据,
            startTime: new Date(),
            endTime: new Date(),
            inputStartTime: '',
            tabBoxHeight: 0,
            inputEndTime: '',
            startDate: new Date('2018'),
            startDate2: new Date('2018'),//开始时间
            endDate: new Date(), // 结束时间
            playType:'',  // PlayType 支付类型 0 线下支付/1 线上支付) 线下支付的订单不能退款，不能退货
            orderState:'',//订单状态(1 待支付 2 待收货 3 待发货 4 退/换货 5 已完成 7 待结算)
            nedPayList:[],//当前状态下的所有订单列表
            isLoad:false,
            queryJson:{ //查询条件,(salenumber 订单号搜索关键字, StartTime 订单起始时间, EndTime 订单结束时间,
                salenumber:'',
                StartTime:'',
                EndTime:'',
                PlayType:this.playType,
            },
            salenumber: '',
            userInfo:this.$store.state.userInfo,//是否是区域批发商身份 true是
            exitGood: 9, // 点击已退款或者未退款  9已退款  8未退款
            orderStatus:1,
            // 数据的页数
            pageNum: 1
        }
    },
    components:{
        blockTabbar,
        storeOrder
    },
    created() {
        //请求拦截器
        axios.interceptors.request.use((config) => {
            MintUI.Indicator.open({ //打开loading
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            return config;
        }, (err) => {
            return Promise.reject(err)
        })
        //响应拦截器
        axios.interceptors.response.use((response) => {
            MintUI.Indicator.close(); //关闭loading
            return response;
        }, (err) => {
            return Promise.reject(err);
        });

    },
    updated(){
    },
    mounted(){
        this.getHeight()
        document.querySelector("body").setAttribute("style","background-color: #f5f5f5");//切换本页body背景颜色
        // 滚动下拉
        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
        this.$refs.header.$el.style.color = "#fff"
        this.getOrderList(0)
    },
    methods: {
        getHeight() {
            this.tabBoxHeight = document.documentElement.clientHeight
                - document.querySelector('.mint-header').clientHeight
                - document.querySelector('.topwrap').clientHeight;
        },
        // 加载更多数据
        loadMoreData(){
            console.log(56)
            this.getOrderList(); //调用接口，此时页数+1，查询下一页数据
        },
        changeExitGood(num) {
            this.exitGood = num;
            this.orderStatus = num;
            this.datas = [];
            this.pageNum = 1;
            this.nedPayList = [];
            this.getOrderList(num)
        },
        //退货/款详情页面查看
        returnDetails(item){
            this.$router.push({path:'/block/refunddetail',query:{orderNo:item.orderNo, afterSalesNo:item.afterSalesNo}})
        },
        //支付方式选择控制
        ways(val){
            this.amount = val;
        },
        //支付弹窗显示
        showPay(item){
            let payParams = {
                totalOrderSn: item.totalOrderNo, // 支付单号
                totalOrderPrice: item.totalOrderPrice, // 支付金额
                seq: this.userInfo.seq, // 用户seq
            };
            sessionStorage.setItem('order',JSON.stringify(payParams));
            this.$router.push({path: '/block/paypage',query:payParams});
            return false;
        },
        //重置筛选
        clearForm(){
            this.ordernum = '';
            this.inputStartTime = '';
            this.inputEndTime = '';
            this.playType = '';
            this.zhifutext = '全部';
        },
        //确定筛选
        sureCheck(){
            let that = this;
                // 每次点击查询先清空上一次的数据
                that.nedPayList = [];
                this.pageNum = 1;
                that.queryJson.salenumber=that.ordernum;
                that.queryJson.StartTime=that.inputStartTime;
                that.queryJson.EndTime=that.inputEndTime;
                that.queryJson.PlayType=that.playType;
                that.getOrderList(this.orderState);
                that.popupVisible = false;
        },
        //筛选支付方式切换样式
        zhifu(val){
            this.zhifutext = val
            if (val == '银联') {
                this.playType = 1
            }else if (val == '线下') {
                this.playType = 0
            }else if (val == '全部'){
                this.playType = '';
            }
        },
        changeState(event,val){
            let elem = event.currentTarget;
            this.nedPayList = [];
            this.pageNum = 1;
            this.orderState = val;
            $('.topnav li').removeClass('lihover');
            $(elem).addClass('lihover');
            $(".statecontent").removeClass('showcontent');
            $('#tab' + val).addClass('showcontent');
            // 如果是退货退款，重置筛选状态
            this.getOrderList(val)
            this.orderStatus = val;
        },
        //获取商家订单列表
        getOrderList(val){
            this.isLoad = true;
            var that = this;
            var objData= {
                gtTime: this.queryJson.StartTime,
                ltTime: this.queryJson.EndTime,
                orderNo: this.queryJson.salenumber,
                orderStatusBar: this.orderState||0,
                queryField:"orderNo",
                queryValue:this.queryJson.salenumber,
                timeField:"createTime",
                pageIndex: this.pageNum,
                pageSize: 10,
                // seq: this.userInfo.seq,
                userId: this.userInfo.userId,
                // wholesalerId: 0
            }
            if (objData.orderStatusBar == 4) {
                objData.type = this.exitGood == 9 ? 2 : 1;
            }
            //判断如果是登录的区域批发商的身份则加加上字段
            axios.post(this.blockURL + '/qypfs-order/api/order/list',objData)
            .then(res => {
                if (res.data.code == 200&&res.data.data.list.length) {
                    that.nedPayList = that.nedPayList.concat(res.data.data.list);
                    if (res.data.data.list.length>=10){
                        this.pageNum = this.pageNum+1;
                        this.isLoad = false;
                    } else {
                        this.isLoad = true;
                    }
                }else{
                    this.isLoad = true;
                };
            });
        },
        //  待支付--取消订单弹窗
        nPsurecancl(salenumber){
            var str = $('.showcontent')[0].id//获取当前页面的tabel个数
            MessageBox({
                message: '您是否取消订单?',
                title:'',
                confirmButtonText:'是',
                cancelButtonText:'否',
                showCancelButton: true,
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton'
            }).then(action => {
                if (action == 'confirm') {
                    let data = {
                        "orderNo": salenumber.orderNo,
                    };
                    axios.post(this.blockURL + '/qypfs-order/api/order/cancel',data).then(res=>{
                        if (res.data.code == 200) {
                            showToast('订单取消成功','middle')
                            this.nedPayList = [];
                            let val = str.substring(3);
                            setTimeout(() => {
                                this.getOrderList(val)
                            }, 300);
                        }else{
                            showToast(res.data.message || '网络错误，稍后再试!','middle')
                        }
                    })
                }
            })
        },
        //  确认收货弹窗
        surereceive(salenumber){
            var str = $('.showcontent')[0].id//获取当前页面的tabel个数
            MessageBox({
                message: '是否确认收货此订单？',
                confirmButtonText:'是',
                cancelButtonText:'否',
                title:'',
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') {
                    let data = {
                        "orderNo": salenumber.orderNo,
                    };
                    axios.post(this.blockURL + '/qypfs-order/api/order/finish',data).then(res=>{
                        if (res.data.code == 200) {
                            showToast('确认收货成功','middle')
                            this.nedPayList = [];
                            let val = str.substring(3);
                            setTimeout(() => {
                                this.getOrderList(val)
                            }, 300);
                        }else{
                            showToast(res.data.message || '网络错误，稍后再试!','middle')
                        }
                    })
                }
            })
        },
        //  申请退款
        returngoods1(salenumber){
            this.$router.push({path:'/block/orderRefund',query:{orderNo:salenumber.orderNo}})
        },
        //  退换货
        returngoods(salenumber){
            this.$router.push({path:'/returngoods',query:{salenumber:salenumber}})
        },
        // 筛选弹窗
        showfilter(){
            this.popupVisible = true;
        },
        // 时间筛选
        openPicker () {
            this.$refs.picker.open()
        },
        openPicker2 () {
            this.$refs.picker2.open()
        },
        //订单筛选开始时间确定fn
        handleConfirm (data) {
            if(new Date(data).getTime() <= new Date(this.endTime).getTime()){
                let date = moment(data).format('YYYY.MM.DD');
                this.inputStartTime = date;
            }else{
                Toast({
                message: '开始时间不能大于结束时间！',
                duration: 2000,
                className:'counttc'
                });
            }
        },
        //订单筛选开始时间确定fn
        handleConfirm2 (data) {
            if(new Date(data).getTime() >= new Date(this.startTime).getTime()){
                let date = moment(data).format('YYYY.MM.DD');
                this.inputEndTime = date;
            }else{
                Toast({
                    message: '结束时间不能小于开始时间！',
                    duration: 2000,
                    className:'counttc'
                });
            }
        },
    },
    // 判断返回页面不刷新
    beforeRouteLeave(to,from,next){
        console.log(to,456)
        if(to.name == 'blockOrderDetail' || to.name == 'returndetails'){
            from.meta.keepAlive = true;
        }else{
            from.meta.keepAlive = false;
        };
        next();
    }
}
</script>
<style scoped>
    @import '../../assets/css/block/blockOrdercss.css';
    .myorder{
        margin-bottom:7px !important;
    }
    .main{
        margin-top: 85px;
    }
    .content-box{
        border-top: 1px solid transparent;
        overflow-y: auto;
        padding-top: 9px;
        position: relative;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 55px;
    }
    .filterpopup #filterwrap .filterend{
        position: relative;
        justify-content: flex-end;
    }
    .filterpopup #filterwrap .numipt{
        padding-right: 0;
        justify-content: space-between;
    }

    .filterpopup #filterwrap .filterend button{
        width:3.41rem !important;
        height:1.36rem !important;
        margin-left: 0.4rem;
        border-radius: 0.1rem !important;
    }
    .filterpopup #filterwrap .filterend #reset{
        margin-right: 0.7rem !important;
        background:rgba(246,246,246,1);
    }
    .filterpopup #filterwrap .filterend #sure{
        background:rgba(255,168,0,1) !important;
    }
    .filterpopup #filterwrap .ordertime input{
        margin-right: 0;
    }
    .orderdetail{
        margin-bottom: 0.4rem;
    }
    .detailtop{
        border-bottom: 1px solid rgba(230,230,230,1) !important;
    }
    .filterpopup #filterwrap .ordertime{
        border-bottom: none;
    }
</style>
