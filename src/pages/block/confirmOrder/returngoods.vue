<template>
    <div class="global">
        <mt-header title="退款申请" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="content">
            <div class="goods">
                <!-- 商品详情区 -->
                <div class="detailcontent" v-for="(pitem,index) in orderDetail.orderDetails" :key="index">
                    <img :src="pitem.picUrl" alt="">
                    <div class="goodsname">
                        <div class="line">
                            <span class="godname">{{pitem.goodsName}}</span>
                        </div>
                        <div class="line">
                            <span class="godnum tit"> {{pitem.spec||'暂无规格'}}{{pitem.goodsUnit}}</span>
                            <span class="num"></span>
                        </div>
                        <div class="line">
                            <span class="godnum">总金额:<i>  ￥{{pitem.totalPrice}}</i></span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 退款原因 -->
            <div class="reason">
                <div class="details">
                    <span>退款原因：</span>
                </div>
                <input type="text" v-model="reason" placeholder="填写原因" class="reamk">
                <div class="money">退款金额：<span style="color:#FF6023">￥{{orderDetail.totalOrderPrice}}元</span></div>
            </div>
            <div class="others">
                <div class="ordernum">订单号：<span>{{orderDetail.totalOrderNo}}</span></div>
                <span class="seven">七天无理由退换</span>
            </div>
            <div class="btnwrapreturn">
                <button class="btn" @click="toreturndetails">提交</button>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {showToast} from '../../../assets/js/common.js'

    export default {
        name: 'ReturnGoods',
        data() {
            return {
                seq: sessionStorage.getItem('seq'),
                // 订单号
                orderNo: '',
                reason: '',
                TatolPrice: '',
                ProductImg: '',
                data: [],
                // 商品详情信息
                orderDetail: {},
                userInfo: this.$store.state.userInfo,//是否是区域批发商身份 true是
            }
        },
        created() {
            this.orderNo = this.$route.query.orderNo;
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";

            this.getOrderInfo();
        },
        methods: {
            // 返回事件
            goBack() {
                history.go(-1);
            },
            // 获取订单详情
            getOrderInfo() {
                axios.get(this.blockURL + `/qypfs-order/api/order/get?orderNo=${this.orderNo}`).then(res => {
                    if (res.data.code == 200) {
                        console.log('我的', res.data)
                        this.orderDetail = res.data.data || {};
                    } else {
                        Toast({message: res.data.message, position: 'bottom', duration: 2000});
                    }
                });
            },
            //退款退货
            toreturndetails() {
                if (this.reason == '' || this.reason == null) {
                    showToast('退款退货理由不能为空！')
                } else {
                    var userInfo = this.userInfo;
                    MessageBox({
                        message: '您是否确定要退货退款?',
                        title: '',
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        showCancelButton: true,
                        confirmButtonClass: 'confirbutton',
                        cancelButtonClass: 'cancelbutton'
                    }).then(action => {
                        if (action == 'confirm') {
                            axios.post(this.blockURL + '/qypfs-order/api/order/afterSales', {
                                "afterSalesWhy": this.reason, // 售后原因
                                // "detailId": [], // 	售后订单明细ID 不填写则以订单售后
                                "orderNo": this.salenumber, // 	订单号
                                "route": 1, // 	售后类型(0:正常订单;1:仅退款,2:退货退款,3:换货)
                                "seq": userInfo.seq, // 生活圈用户ID
                                "userId": userInfo.userId, // 用户ID
                                // "wholesalerId": 0, // 商家ID
                            }).then(res => {
                                if (res.data.code == 200) {
                                    console.log(res);
                                    showToast(res.data.message, 'middle')
                                    setTimeout(() => {
                                        history.go(-1)
                                    }, 1000);
                                } else {
                                    showToast(res.data.message, 'middle')
                                    setTimeout(() => {
                                        history.go(-1)
                                    }, 1500);
                                }
                            })
                        }
                    })

                }
            }
        }
    }
</script>

<style scoped>
    @import '../../../assets/css/returngoods.css';
    .content{
        margin-top: 52px;
    }
    .btn{
        border: none;
        height: 2rem !important;
        background-color: rgba(255,96,35,1) !important;
    }
    .details{
        height: 1rem !important;
        border: none !important;
    }
    .reamk{
        border: none;
        width: 100%;
        margin-top: 0.7rem;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid rgba(233,233,233,1);
    }
    .content .reason .money{
        height: 1.5rem;
        margin-top: 0;
    }
    .content .goods .detailcontent{
        border-top: none;
    }
    .tit{
        font-size:0.55rem !important;
        font-family:HiraginoSansGB;
        font-weight:normal;
        color:rgba(102,102,102,1) !important;
    }
</style>
