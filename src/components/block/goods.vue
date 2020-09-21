<template lang="html">
    <div class="agreement SendingList">
        <div v-for="(item,key) in datas" :key="key" class="sitem wbg">
            <p class="pro-top" >
                <span class="code">{{item.orderNo}}</span>
                <span v-if="title" class="status">{{title}}</span>
                <span v-else class="status">{{getOrderType(item)}}</span>
            </p>
            <ul class="pro-list" @click="jumpToOrderDetails(item)">
                <li v-for="(proItem,index) in item.orderDetails" :key="index" class="pro-item">
                    <div class="pro-img">
                        <img :src="proItem.picUrl">
                        <i v-if="proItem.reviewStatus == 4">已退款</i>
                        <i v-if="[1, 2, 3].indexOf(Number(proItem.reviewStatus)) > -1">退款中</i>
                    </div>
                    <div class="pro-desc">
                        <p class="pro-title">
                            <span class="title">{{proItem.goodsName}}</span>
                            <span class="unitPrice">￥{{proItem.retailUnitPrice}}</span>
                        </p>
                        <p class="pro-spec">
                            <span class="info">{{proItem.spec}}</span>
                            <span class="count">x {{proItem.goodsNum}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{proItem.totalPrice}}</p>
                        <div class="lgTop">
                            <p v-if="proItem.saleType" class="isPresale">{{proItem.saleType}}</p>
                            <p v-if="item.orderStatus==2 && !proItem.reviewStatus" class="isPresale">{{proItem.deliverDesc}}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="pro-bottom">
                <div class="pro-item">
                    <p class="item-tit">
                        合计
                    </p>
                    <p class="total">共{{item.totalGoodsNum||1}}件商品，合计：<span class="price">￥{{item.totalOrderPrice}}元</span>
                    </p>
                </div>
                <div class="pro-item" v-if="item.changePriceFront">
                    <p class="item-tit">改价前合计</p>
                    <p class="total"><span class="price">￥{{item.changePriceFront}}元</span></p>
                </div>
                <div v-if="item.orderStatus>0&&item.orderStatus!=6" class="pro-item">
                    <p class="item-tit">
                        支付方式
                    </p>
                    <p class="payment item-right" v-if="item.paymentMethod==9">线下支付</p>
                    <p class="payment item-right">
                        {{item.paymentMethod||'暂无'}}
                    </p>
                </div>
                <div class="pro-item">
                    <p class="item-tit">
                        下单时间
                    </p>
                    <p class="orderTime item-right">{{item.createTime}}</p>
                </div>
                <div v-if="item.payTime" class="pro-item">
                    <p class="item-tit">
                        付款时间
                    </p>
                    <p class="orderTime item-right">{{item.payTime}}</p>
                </div>
                <div class="pro-item" v-if="item.remark">
                    <p class="item-tit">
                        留言
                    </p>
                    <p class="orderTime item-right">{{item.remark}}</p>
                </div>
                <div v-if="item.lockTime" class="pro-item">
                    <p class="item-tit">
                        结算时间
                    </p>
                    <p class="orderTime item-right">{{item.lockTime}}</p>
                </div>
                <div v-if="item.changePriceTime" class="pro-item">
                    <p class="item-tit">
                        改价时间
                    </p>
                    <p class="orderTime item-right">{{item.changePriceTime}}</p>
                </div>
            </div>
            <div v-if="!noPLatform">
                <p v-if="item.orderStatus==0" class="BtnBox" ref="SpanBox">
                    <span @click="changePricePopup(item)" class="Btn">改价</span>
                </p>
                <p v-if="item.orderStatus==2" class="BtnBox" ref="SpanBox" >
                    <span @click="orderSendSure(item)" class="Btn">发货</span>
                </p>
                <p v-if="item.orderStatus==4 && item.afterSalesStatusDesc!='退款失败' && title!='退款成功'" class="BtnBox" ref="SpanBox">
                    <span @click="refundSure(item)" class="Btn">同意退款</span>
                    <span @click="disRsure(item)" class="Btn">拒绝退款</span>
                </p>
            </div>
        </div>
        <!-- 改价弹窗 -->
        <div class="changePriceBox" v-if="changePrice">
            <mt-popup
                v-model="changePrice"
                popup-transition="popup-fade"
                position="bottom"
                closeOnClickModal="false">
                <div class="popup-box">
                <span class="close" @click="popupClose()"><img
                    src="../../assets/images/wholesale/close-icon.png"></span>
                    <div class="proCode">
                        <img :src="changePriceItem.orderDetails[0].picUrl" alt="">
                        <div class="proCodeDiv">
                            <p class="price">￥{{changePriceItem.totalOrderPrice}}</p>
                            <p>颜色：红色</p>
                            <p>尺码：30件/箱</p>
                            <p class="count">数量：{{changePriceItem.orderDetails[0].goodsNum}}</p>
                        </div>
                    </div>
                    <div class="totalPrice">
                        <span class="text">合计金额：</span><span class="price">￥{{changePriceItem.totalOrderPrice}}</span>
                    </div>
                    <div class="changedPrice">
                        <span class="text">改价合计：</span>
                        <span class="changeInput">
                            ￥<input :value="changePriceItem.totalOrderPrice" @input="checkGJInput" ref="changePriceTag" type="text">
                        </span>
                    </div>
                    <span @click="sureChangePrice()" class="changeBtn">确定改价</span>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script>
import {showToast} from '@/assets/js/common.js'
import { Toast,Indicator,Popup} from 'mint-ui';
export default {
    props:["datas","num","title"],
    data () {
        return {
            // 改价元素
            changePrice: false,
            changePriceItem: {},
            // 用户的信息
            userInfo: this.$store.state.userInfo,
            // 是否查看平台订单管理
            noPLatform: false
        }
    },
    components:{
    },
    mounted(){
    },
    created() {
        this.noPLatform = this.$route.path=="/block/platformOrder";
    },
    methods:{
        // 判断订单状态中文
        getOrderType(order){
            let str = "待支付";
            switch (order.orderStatus) {
                case 0:
                    str = "待支付";
                    break;
                case 1:
                    str = "待发货";
                    break;
                case 2:
                    str = "待发货";
                    break;
                case 3:
                    str = "待收货";
                    break;
                case 4:
                    if (order.orderDetails[0] && order.orderDetails[0].route && order.orderDetails[0].reviewStatus<-1){
                        str = "已拒绝退款";
                    } else {
                        str = "买家申请退款";
                    }
                    break;
                case 5:
                    str = "已完成";
                    break;
                case 6:
                    str = "取消";
                    break;
            }
            return str;
        },
        // 拒绝退款
        disRsure(item) {
            var that = this;
            this.$router.push({path: `/block/buyrefuse?orderNo=${item.orderNo}&afterSalesNo=${item.afterSalesNo}`})
        },
        // 退款
        refundSure(item) {
            var that = this;
            MessageBox({
                title: "",
                message: '确认同意此单退款?',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') {
                    // 需要同意的单号 为每个商品订单的id
                    let arr = [];
                    let orderDetail = item.orderDetails;
                    for(let i=0; i<orderDetail.length; i++){
                        arr.push(orderDetail[i].id)
                    }
                    let params = {
                        "detailId": arr,
                        "orderNo": item.orderNo,
                        "remarks": "",
                        "status": 3,
                        "userName": this.userInfo.username
                    };
                    axios.post(this.blockURL + '/qypfs-order/api/order/afterSale/trial',params)
                        .then((res) => {
                            if (res.data.code == 200) {
                                showToast('退款成功');
                                that.$emit("reloadOrder");
                            } else {
                                showToast(res.data.message);
                                return false;
                            }
                        })
                }
            });
        },
        // 发货
        orderSendSure(item) {
            var that = this;
            MessageBox({
                title: "",
                message: '是否确定发货?',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') {
                    let params = {
                        "orderNo": item.orderNo,
                        "waybillNo": "",
                        "wholesalerId": this.userInfo.userId
                    };
                    axios.post(this.blockURL + '/qypfs-order/api/order/deliver', params)
                    .then((res) => {
                        if (res.data.code == 200) {
                            showToast('发货成功');
                            setTimeout(()=>{
                                that.$emit("reloadOrder");
                            },1000)
                        } else  {
                            showToast(res.data.message);
                            that.$emit("reloadOrder");
                        }
                    })
                }
            });
        },
        // 改价框限制小数点后2位
        checkGJInput(e) {
            e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
        },
        // 进入订单详情页面
        jumpToOrderDetails(item) {
            // 判断订单是否是售后退款的状态
            if(item.orderStatus==4) {
                this.$router.push({path: `/block/busrefusedetail?orderNo=${item.orderNo}&afterSalesNo=${item.afterSalesNo}`});
                return false;
            }
            this.$router.push({path: `/block/orderDetail?orderNo=${item.orderNo}`})
        },
        // 改价盒子
        popupClose() {
            var that = this;
            that.changePrice = false;
        },
        // 改价
        sureChangePrice() {
            let changePrice = Number(this.$refs.changePriceTag.value);
            let item = this.changePriceItem;
            let orderDetail = item.orderDetails;
            let orderDetailSum = 0;
            for(let i=0; i<orderDetail.length; i++) {
                orderDetailSum += Number(orderDetail[i].platformPrice)
            }
            // 判断改价价格是否低于平台价
            if (changePrice<orderDetailSum) {
                Toast({
                    message:'改后的价格需要大于平台价',
                    className:"alert"});
                return false
            }
            var self = this;
            MessageBox({
                title: "",
                message: '是否确定改价?',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') {
                    let params = {
                        "changePrice": changePrice,
                        "orderNo": item.orderNo,
                    };
                    axios.post(this.blockURL + '/qypfs-order/api/order/changePrice',params)
                        .then((res) => {
                            self.$emit("reloadOrder");
                            if (res.data.code == 200) {
                                self.popupClose();
                                showToast('改价成功');
                                self.$emit("reloadOrder");
                            }  else {
                                self.popupClose();
                                showToast(res.data.message);
                            }
                        })
                }
            });
        },
        knows(){
            this.$emit("changeShow",this.nowShow);
        },
        // 改价盒子
        changePricePopup(item) {
            var i = 0;
            this.changePrice = !this.changePrice;
            this.changePriceItem = item;
        },
    }
}
</script>

<style lang="css" scoped>
    @import '../../assets/css/orderManage.css';
    .isPresale {
    }
    .lgTop{
        color: #ff7125;
        font-size: 0.58rem;
        margin-top: -0.6rem;
    }
    .pro-img{
        position: relative;
    }
    .pro-img i{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .65);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .59rem;
    }
    .alert{
        z-index: 100000;
        position: absolute;
        top: 2rem;
        left: 2rem;
    }
    .v-modal{
        z-index: 100 !important;
    }
    .top{
        position: fixed;
        top: 0;
        z-index: 100;
        width: 100%;
    }
    .none{
        height: 0.4rem;
    }
    #main{
        margin-top: 85px;
    }
    .pro-item{
        display: flex;
        justify-content: space-between;
        margin-top: 0.16rem;
    }
    .item-tit{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .item-right{
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .SendingList .pro-top .code{
        font-size:0.6rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin-bottom: -0.15rem;
    }
    .SendingList .pro-top .status{
        font-size:0.6rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,96,35,1)
    }
    .SendingList .pro-top{
        padding: 0 0.4rem;
    }
    .BtnBox .Btn{
        border: 1px solid #FF6023;
        color: #FF6023;
        padding: 0 0.8rem;
    }
    .SendingList .pro-list .pro-item .pro-desc .pro-title .title{
        font-size:0.73rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .SendingList .pro-list{
        background-color: #FBF8FB;
        padding: 0;
    }
    .SendingList .pro-bottom .total .price{
        color: #FF6023;
    }
    .SendingList .pro-list .pro-item{
        padding: 0.4rem 0.5333rem;
    }
    .changePriceBox .popup-box{
        padding-top: 0.5rem !important;
    }
    .changePriceBox .popup-box{
        padding-top: 0.5rem !important;
    }
    .tabBox{
        overflow: auto;
    }
    .proCode{
        display: flex;
        padding-top: 0 !important;
        justify-content: flex-start !important;
        align-items:flex-start !important;
    }
    .proCode img{
        width:4.98rem;
        height:4.98rem;
    }
    .changePriceBox .mint-popup{
        height: 53%;
    }
    .proCodeDiv .price{
        font-size:0.73rem;
        font-family:PingFang SC;
        font-weight:800;
        color:rgba(255,96,35,1);
    }
    .proCodeDiv p{
        margin-top: 0.3rem;
    }
    .proCodeDiv{
        padding-left: 0.3rem;
        font-size:0.55rem;
        font-family:Hiragino Sans GB;
        font-weight:normal;
        color:rgba(102,102,102,1)
    }
    .changePriceBox .popup-box .changeBtn{
        background:rgba(255,96,35,1);
    }
    .changePriceBox .popup-box .changedPrice .changeInput{
        border: 1px solid rgba(255,96,35,1);
    }
    .changePriceBox .popup-box .totalPrice .price{
        font-family:Hiragino Sans GB;
        font-weight:normal;
        color:rgba(255,96,35,1);
    }
</style>
