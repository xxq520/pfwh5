<template>
    <div class="glode">
        <mt-header title="退款详情" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="RefuseDetail">
            <div class="order-con">
                <p class="order-con-tit">退款状态</p>
                <p class="theme">{{refuseStatus[orderDetail.reviewStatus||'1']}}</p>
            </div>
            <div class="order-con">
                <p class="order-con-tit">买家姓名</p>
                <p >{{orderDetail.consignee}}</p>
            </div>
            <div v-if="orderDetail.trialRemarks" class="order-con">
                <p class="order-con-tit">审核备注</p>
                <p >{{orderDetail.refundReason}}</p>
            </div>
            <div class="order-con">
                <p class="order-con-tit">手机号码</p>
                <p >{{orderDetail.mobile}}</p>
            </div>
            <div v-if="orderDetail.refundTheWhy" class="order-con">
                <p class="order-con-tit">退款方式</p>
                <p >
                    {{orderDetail.refundTheWhy}}
                    <!--<span class="theme">￥{{getRefunPrice}}</span>-->
                </p>
            </div>
            <div v-if="orderDetail.refundType" class="order-con">
                <p class="order-con-tit">退款类型</p>
                <p >{{orderDetail.refundType}}</p>
            </div>
        </div>
        <!-- 退货信息 -->
        <div  class="refuseOrder">
            <div class="order-con">
                <p class="order-con-tit">退货信息</p>
                <p ></p>
            </div>
            <div class="orderList">
                <div v-for="(item,index) in orderDetail.afterSalesOrderDetails" class="orderItem">
                    <img class="orderPro" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595506383844&di=e2fe48e2257863218428cab52e2c75a4&imgtype=0&src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB2KAKkjCMmBKNjSZTEXXasKpXa_%2521%25211073593497.jpg_400x400.jpg" alt="">
                    <div class="orderCon">
                        <p>
                            <span>{{item.goodsName}}</span>
                            <span>￥{{item.goodsPrice}}</span>
                        </p>
                        <p>
                            <span>{{item.spec}}</span>
                            <span>X {{item.goodsNum}}</span>
                        </p>
                        <p>
                            <span></span>
                            <span>金额￥{{item.totalPrice}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="exitPrice">
                <div class="order-con">
                    <p class="order-con-tit">退款总额</p>
                    <p >共{{orderDetail.totalGoodsNum}}件商品，合计<span class="theme" style="font-size: 0.7rem">￥{{orderDetail.totalRefundAmount||'0.00'}}</span></p>
                </div>
            </div>
           <div class="orderRefuse">
               <p>退货原因：{{orderDetail.refundReason||'无'}}</p>
               <p>申请时间：{{orderDetail.applyTime||'暂无'}}</p>
               <p>退货编号：{{orderDetail.afterSalesNo||'暂无'}}</p>
               <p>图片凭证：{{orderDetail.afterSaleImgUrl?'':'无'}}
                   <img v-for="(url) in orderDetail.afterSaleImgUrl" :src="url" alt="" class="orderPro"  preview="1" preview-text="图片凭证">
               </p>
           </div>
        </div>
        <div v-if="orderDetail.reviewStatus==2" class="fixedBtn">
            <button @click="editFefuse" style="background:#ccc">拒绝退款</button>
            <button @click="refuseReturn">同意退款</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Toast,Indicator,Popup} from 'mint-ui';
    export default {
        data() {
            return {
                // 订单数据
                orderDetail: new Object(),
                // 订单号和总金额
                orderNo:{},
                // 退款状态
                refuseStatus:{'1':'待审核', '2':'客服同意',
                    '3':'待商家处理', '4':'财务同意',
                    '-2':'客服拒绝', '-3':'商家拒绝',
                    '-4':'财务拒绝'},
                // 退款单号
                afterSalesNo: ""
            }
        },
        computed:{},
        mounted() {
            sessionStorage.removeItem("splitMoney");
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        // 获取用户默认收货地址
        created() {
            let query = this.$route.query;
            if (query.orderNo){
                this.orderNo = query.orderNo;
                this.afterSalesNo = query.afterSalesNo;
                this.getOrderDetail();
            }
        },
        methods: {
            editFefuse() {
                this.$router.push(`/block/buyrefuse?orderNo=${this.orderNo}`);
            },
            // 同意退款
            refuseReturn() {
                MessageBox({
                    title: "",
                    message: '是否同意退款?',
                    showCancelButton: true
                }).then(action => {
                    if (action == 'confirm') {
                        // 订单得详情
                        let orderDetail = this.orderDetail;
                        let arr = orderDetail.detailId || [];
                        let params = {
                            "detailId": arr,
                            "orderNo": this.orderNo,
                            "remarks": "",
                            "status": 3,
                        };
                        // 同意退款
                        axios.post(this.blockURL + `/qypfs-order/api/order/afterSale/trial`,params).then(res => {
                            if (res.data.code == 200) {
                                Toast('退款成功');
                            } else {
                                Toast({message: res.data.message,position: 'bottom',duration: 2000});
                            }
                        });
                    }
                });
            },
            // 获取订单详情数据
            getOrderDetail() {
                axios.get(this.blockURL + `/qypfs-order/api/order/seller/getAfterSalesOrderDetail?orderNo=${this.orderNo}&afterSalesNo=${this.afterSalesNo}`).then(res => {
                    if (res.data.code == 200) {
                        this.orderDetail = res.data.data || {};
                        this.$previewRefresh()
                    } else {
                        Toast({message: res.data.message,position: 'bottom',duration: 2000});
                    }
                });
            },
            // 获取确认订单数据
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
        }
    }
</script>

<style scoped>
    .RefuseDetail{
        margin-top: 52px;
        padding-bottom: 0.4rem;
        font-size: 0.64rem;
        color:rgba(51,51,51,1);

    }
    .order-con{
        background-color: #fff;
        height:2.23rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.45rem;
        align-items: center;
        margin-bottom: 1px;
    }
    .order-con-tit{
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .theme{
        font-weight:400;
        color:rgba(255,96,35,1);
    }
    .refuseOrder{
        background:rgba(255,255,255,1);
        font-size:0.64rem;
        color:rgba(51,51,51,1);
        margin-bottom: 2.5rem;
    }
    .orderList{
        background-color: #FBF8FB;
        padding:0 0.5rem ;
        border-top: 1px solid rgba(230,230,230,1);
    }
    .orderItem{
        border-bottom: 1px solid #F7F4F8;
        display: flex;
        padding: 0.5rem 0;
    }
    .orderPro{
        width:3.39rem;
        height:3.39rem;
    }
    .orderCon{
        padding-left: 0.4rem;
        width: calc(100% - 3.5rem);
    }
    .orderCon>p{
        display: flex;
        justify-content: space-between;
        font-size:0.55rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(156,156,156,1);
        margin-top: 0.1rem;
        margin-bottom: 0.2rem;
    }
    .orderCon>p:first-child{
        font-size:0.73rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .orderCon>p:first-child span:last-child{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(33,33,33,1);
    }
    .orderRefuse{
        padding: 0.4rem;
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .orderRefuse p{
        margin-bottom: 0.3rem;
        display: flex;
        align-items: center;
    }
    .exitPrice{
        padding: 0 0.45rem;
    }
    .exitPrice .order-con{
        padding: 0;
        border-bottom: 1px solid rgba(230,230,230,1);
    }
    .orderRefuse img{
        width:2.27rem;
        height:2.27rem;
    }
    .fixedBtn{
        position: fixed;
        bottom: 0;
        left: 0;
        height:2.23rem;
        color:rgba(255,255,255,1);
        width: 100%;
        display: flex;

    }
    .fixedBtn button{
        outline:none ;
    }
    .fixedBtn button:first-child{
        background:rgba(255,0,5,1);
        border: none;
        width: 50%;
        color: #fff;
        font-size:0.77rem;
    }
    .fixedBtn button:last-child{
        background:rgba(255,96,35,1);
        border: none;
        width: 50%;
        color: #fff;
        font-size:0.77rem;
    }
</style>
