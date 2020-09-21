<template>
    <div class="global">
        <mt-header fixed title="退款详情" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div class="content orderD">
            <div class="title" :class="{'active': refundData.refundStatus == 3}">
                <img v-if="refundData.refundStatus == 2" src="../../../assets/images/block/pf_bgimage_tk_tkcg.png" alt="">
                <img v-else-if="refundData.refundStatus == 3" src="../../../assets/images/block/pf_bgimage_tk_tksb.png" alt="">
                <img v-else="" src="../../../assets/images/block/pf_bgimage_tk_tkz.png" alt="">
                <span>{{['退款中', '退款中', '退款成功', '退款失败'][refundData.refundStatus]}}</span>
                <span v-if="refundData.reviewTime" v-text="refundData.reviewTime"></span>
            </div>
            <div class="returnmoney">
                <span class="bank" v-if="refundData.refundStatus == 3 && refundData.refundRemarks">退款备注<i style="color:#999999" v-text="refundData.refundRemarks"></i></span>
                <span class="totalm">退款总金额<i style="color:#FF6023" v-text="'￥' + (refundData.totalRefundAmount || 0)"></i></span>
                <span class="bank">
                    退款方式
                    <i>
                        <span>{{refundData.refundTheWhy}}</span>
                    </i>
                </span>
            </div>
            <div class="progressbar">
                <el-steps :active="activeNum" finish-status="success">
                    <!--卖家待审核 卖家审核通过 卖家审核拒绝-->
                    <!--银行待审核 银行审核通过 银行审核拒绝-->
                    <!--待银行拨款 退款成功 拨款拒绝-->
                    <el-step :title="'卖家待审核'"></el-step>
                    <el-step :title="'银行待审核'"></el-step>

                    <el-step v-if="refundData.refundStatus < 2" title="待银行拨款"></el-step>
                    <el-step v-else-if="refundData.refundStatus == 2" title="退款成功"></el-step>
                    <el-step v-else-if="refundData.refundStatus == 3" title="退款失败" status="error"></el-step>
                </el-steps>
            </div>
            <!-- 退款信息 -->
            <div class="details">
                <div class="detailtitle">退货信息</div>
                <div v-for="(item,index) in refundData.refundOrderDetails" :key="index">
                    <div class="goods" >
                        <!-- 商品详情区 -->
                        <img :src="item.picUrl" alt="">
                        <div class="goodsname">
                            <div class="linee">
                                <span class="godname">{{item.goodsName}}</span>
                            </div>
                            <div class="linee">
                                <span class="godnum"><i>{{item.goodsNum}}</i>{{item.goodsUnit}}</span>
                            </div>
                            <div class="line">
                                <span class="godnum">规格:<i>{{item.spec}}</i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="returndetails">
                    <div>退款类型：<i>{{refundData.refundType}}</i></div>
                    <div>退货原因：<i>{{refundData.refundReason}}</i></div>
                    <div>退款金额：<i>￥{{refundData.totalRefundAmount}}</i></div>
                    <div>申请时间：<i>{{refundData.applyTime}}</i></div>
                    <div>退货编号：<i>{{refundData.afterSalesNo}}</i></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import $ from 'jquery'

    export default {
        name: 'returnDetails',
        data() {
            return {
                // 订单详情
                refundData: {},
                // 订单号
                orderNo: '',
                // 售后订单号
                afterSalesNo: '',
                // 选中的步骤条
                activeNum: 1
            }
        },
        created() {
            this.orderNo = this.$route.query.orderNo;
            this.afterSalesNo = this.$route.query.afterSalesNo;
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
            document.querySelector("body").setAttribute("style", "background-color: #f5f5f5");//切换本页body背景颜色
            // 获取订单数据
            this.getOrderDetail();
        },
        computed:{
            reviewStatus(){
                // ['退款中','退款失败','退款成功']
                if (this.activeNum<3){
                    return 0
                } else if(this.refundData.reviewStatus <-1) {
                    return 1;
                } else {
                    return 2;
                }
            }
        },
        methods: {
            // 获取订单支详情
            getOrderDetail() {
                axios.get(this.blockURL + `/qypfs-order/api/order/getAfterSalesOrderDetail?orderNo=${this.orderNo}&afterSalesNo=${this.afterSalesNo}`).then(res => {
                    if (res.data.code == 200) {
                        console.log('getAfterSalesOrderDetail', res.data)
                        let refundData = res.data.data || {};

                        let activeNum = 1;
                        if (refundData.refundStatus == 0) {
                            activeNum = 1;
                        } else if(refundData.refundStatus == 1){
                            activeNum = 2;
                        } else if(refundData.refundStatus == 2 || refundData.refundStatus == 3){
                            activeNum = 3;
                        }
                        this.activeNum = activeNum;
                        this.refundData = refundData;
                    } else {
                        Toast({message: res.data.message, position: 'bottom', duration: 2000});
                    }
                });
            },
            formatter(data) {
                return data.replace("T", " ").substring(0, 19);
            },
            back() {
                console.log(123,'进入')
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
    @import '../../../assets/css/returndetails.css';
    .content .details .returndetails {
        padding: .5rem;
    }
    .content .title.active span{
        color: #999;
    }
</style>
<style>
    .orderD {
        margin-top: 44px;
    }
    .content .returnmoney .bank i{
        display: flex;
        align-items: center;
    }
    .content .returnmoney .bank i span{
        color: rgb(255, 96, 35);
        padding-left: 0;
    }

    .progressbar {
        background: #f5f5f5;
        padding: .5rem 2.5rem;
    }

    .progressbar .el-step__main {
        margin-left: -25px;
    }

    .progressbar .el-step__title {
        color: #999;
        font-size: .5778rem /* 26/45 */;
    }

    .progressbar .el-step.is-horizontal .el-step__line {
        top: .8rem
    }

    .orderD div.title {
        margin-bottom: 0.45rem;
        background-color: #fff !important;
        text-align: center;
        color: #FF6023 !important;
        height: auto !important;
        padding: 0.7rem 0 !important;
    }

    .orderD .title span {
        margin-bottom: 0.1rem !important;
    }

    .orderD .title img {
        max-width: 1.82rem;
        /*width: 1.82rem;*/
    }

    .orderD .details .goods {
        justify-content: flex-start !important;
    }

    .content .returnmoney {
        height: auto !important;
    }

    .content .returnmoney span {
        border-bottom: 1px solid #e9e9e9;
    }

    .content .details .detailtitle {
        height: 2rem !important;
        line-height: 2rem !important;
    }

    .orderD .el-step__head.is-success {
        color: #FF6023;
        border-color: #FF6023
    }

    .orderD .progressbar {
        padding: .5rem 1.8rem;
    }
    .orderD .details .returndetails{
        padding-bottom: 0.2rem;
    }
    .orderD .details{
        margin-bottom: 2rem;
    }

</style>
