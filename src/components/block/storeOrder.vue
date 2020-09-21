<template lang="html">
    <div class="agreement orderdetail">
        <div class="detailtop">
            <div class="ordernum" style="font-size:16px">
                <span>店铺名称: {{item.wholesalerName || item.supplierName}}</span>
            </div>
            <span class="changestate">{{item.afterSalesStatusDesc || getOrderType(item)}}</span>
        </div>
        <router-link :to="'/block/orderDetail?orderNo='+item.orderNo">
            <div class="detailcontent" >
                <div v-for="(glist,t) in item.orderDetails" :key="t" id="gg">
                    <div class="goodsimg">
                        <img :src="glist.picUrl" alt="">
                        <i v-if="glist.reviewStatus == 4">已退款</i>
                        <i v-if="[1, 2, 3].indexOf(Number(glist.reviewStatus)) > -1">退款中</i>
                    </div>
                    <div class="goodsname">
                        <div class="line">
                            <span class="godname ">{{glist.goodsName}}</span>
                            <span class="price">￥<i>{{glist.retailUnitPrice}}</i></span>
                        </div>
                        <div class="line">
                            <span v-if="glist.spec" class="godnum">{{glist.spec}}</span>
                            <span class="num">X <i>{{glist.goodsNum}}</i></span>
                        </div>
                        <div class="line" id="total">总金额<i>￥{{glist.totalPrice}}</i></div>
                        <div class="lgTop">
                            <p v-if="glist.saleType" class="isPresale">{{glist.saleType}}</p>
                            <p v-if="item.orderStatus==2 && !glist.reviewStatus" class="isPresale">{{glist.deliverDesc}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
        <div class="other">
            <div class="orderItem">
                <div class="orderItemTit">合计</div>
                <div class="totalgood orderItemCon">共 <i>{{item.totalGoodsNum||1}}</i>件商品，合计 <i style="color:#FF6023;font-size:.7111rem">￥{{item.totalOrderPrice}}元</i></div>
            </div>
            <div class="orderItem">
                <div class="orderItemTit">订单号</div>
                <div class="ordernum orderItemCon"><span>{{item.orderNo}}</span></div>
            </div>
            <div class="orderItem">
                <div class="orderItemTit">下单时间</div>
                <div class="ordernum orderItemCon"><span>{{item.createTime}}</span></div>
            </div>
            <div v-if="item.orderStatus>0 && item.orderStatus!=6" class="orderItem">
                <div class="orderItemTit">支付方式</div>
                <div class="ordernum orderItemCon"><span>{{item.paymentMethod||'暂无'}}</span></div>
            </div>
            <div v-if="item.gjType == 1 && item.gjState == 1" class="changetotal">改后合价：<i>￥{{item.TotalPaymentAmount}}元</i></div>
        </div>
    </div>
</template>

<script>
export default {
    props:["item","num","title"],
    data () {
        return {
            // 支付方式集合
            payment: {
                9: '微信支付',
                10: '支付宝支付',
                11: '银联支付',
                997: '在线支付',
                998: '线下支付',
                999: '余额支付',
            }
        }
    },
    components:{
    },
    mounted(){
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
                        str = "退款失败";
                    } else if (order.orderDetails[0] && order.orderDetails[0].reviewStatus ==4) {
                        str = "退款成功"
                    } else {
                        str = "退款中";
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
        knows(){
            this.$emit("changeShow",this.nowShow);
        },
    }
}
</script>

<style lang="css" scoped>
    @import '../../assets/css/block/blockOrdercss.css';
    .lgTop{
        color: #ff7125;
        font-size: 0.58rem;
        margin-top: -0.8rem;
    }
    .orderdetail{
        margin-bottom: 0;
    }
    .goodsimg{
        position: relative;
    }
    .goodsimg img{
        max-height: 100%;
    }
    .goodsimg i{
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
    .detailcontent>div{
        border-bottom: 1px solid rgba(230,230,230,1) !important;
    }
    .detailcontent>div:last-child{
        border-bottom: none !important;
    }

</style>
