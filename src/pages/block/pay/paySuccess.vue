<template>
    <div class="pay"  v-cloak>
        <mt-header v-if="!isApp" :title="title" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="getOrderDetail"></mt-button>
        </mt-header>
        <img class="payOk" :src="order==0 ? payStatus[1] : payStatus[0]" alt="">
        <p v-if="!order" class="payExit"><b>支付失败</b></p>
        <p>{{orderTit}}</p>
        <button class="payButton"  @click="getOrderDetail">查看详情</button>
    </div>
</template>

<script>
    import { Toast,Indicator,Popup} from 'mint-ui';
    export default{
        data() {
            return {
                // 支付订单号
                orderNo: "",
                // 订单详情数据
                order : 1,
                // 支付的状态
                title: "获取支付状态中",
                // 订单的状态
                orderTit: "正在获取支付状态...",
                // 支付状态图
                payStatus:[require('../../../assets/images/block/pf_bgima_pay_yes.png'),require('../../../assets/images/block/pf_bgima_pay_no.png')],
                // 是否是app
                isApp: false
            }
        },
        created() {
            let query = this.$route.query;
            // 加载订单数据需要传递订单的总单号 orderNo字段
            if (query.orderNo) {
                this.orderNo = query.orderNo;
                this.isApp = query.app || false;
                this.verificationPay();
            }
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        methods: {
            // 获取订单详情数据
            verificationPay() {
                axios.get(`${this.blockURL}/qypfs-order/api/pay/verifyPayStatus?orderNo=${this.orderNo}`).then(res => {
                    if (res.data.code == 200) {
                        this.order = res.data.data;
                        this.orderTit = res.data.data==1? '您已经完成支付！' : '您未成功支付！';
                        this.title = res.data.data==1? '付款成功' : '支付失败';
                        // 获取支付数据
                    } else {
                        this.order = 0;
                        this.orderTit = '您未成功支付！';
                        this.title = '支付失败';
                        Toast(res.data.message);
                    }
                })
            },
            // 返回事件
            goBack() {
                this.$router.push(`/block/blockMyorder`);
            },
            // 支付订单
            getOrderDetail() {
                try {
                    window.action.payStatus(this.order?1:0);
                }catch (e) {
                    this.$router.push(`/block/blockMyorder`);
                }
            }
        }
    }
</script>

<style scoped>
    [v-cloak]{
        display: none;
    }
    .payExit{
        font-size:0.82rem;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(102,102,102,1);
        margin-top: -1rem;
        margin-bottom: 0.5rem;
    }
    .pay{
        padding-top: 44px;
        background-color: #fff;
        width: 100vw;
        height: 100vh;
        text-align: center;
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
    }
    .payOk{
        width:5.86rem;
        height: 6rem;
        margin-top: 7.05rem;
    }
    .pay .payButton{
        width:7.73rem;
        height:1.45rem;
        background:linear-gradient(-90deg,rgba(255,94,35,1),rgba(255,119,37,1));
        border-radius:1rem;
        font-size:0.68rem;
        font-size:0.68rem;
        font-family:PingFang SC;
        color:rgba(255,255,255,1);
        border: none;
        display: block;
        margin: 0 auto;
        outline: none;
        margin-top: 1.05rem;
    }
</style>
