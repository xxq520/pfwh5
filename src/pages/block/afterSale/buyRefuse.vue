<template>
    <div class="glode">
        <mt-header title="拒绝退款" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="buyRefuse">
            <p class="buyRefuse-tit">拒绝退款原因</p>
            <textarea v-model="refuseVal" placeholder="请输入审核备注，限20字，必填" maxlength="20"></textarea>
        </div>
        <button @click="refuse" class="buyRefuseBtn">拒绝退款</button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { Toast,Indicator,Popup} from 'mint-ui';
    export default {
        data() {
            return {
                // 订单数据
                postData: new Object(),
                // 退款原因
                refuseVal: "",
                // 订单号和总金额
                orderNo:{},
                // 订单售后的单号 不是订单号
                afterSalesNo: "",
            }
        },
        mounted() {
            sessionStorage.removeItem("splitMoney");
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        // 获取用户默认收货地址
        created() {
            let query = this.$route.query;
            this.orderNo = query.orderNo;
            this.afterSalesNo = query.afterSalesNo;
            if(this.orderNo) {
                this.getOrderDetail()
            }
        },
        methods: {
            // 获取订单详情
            getOrderDetail() {
                axios.get(this.blockURL + `/qypfs-order/api/order/seller/getAfterSalesOrderDetail?orderNo=${this.orderNo}&afterSalesNo=${this.afterSalesNo}`).then(res => {
                    if (res.data.code == 200) {
                        this.postData = res.data.data || {};
                    } else {
                        showToast(res.data.message);
                        return false;
                    }
                });
            },
            // 拒绝订单
            refuse() {
                if (!this.refuseVal.trim()){
                    Toast('请填写拒绝原因');
                    return false;
                }
                // 需要退款额商品明细单号
                let detailId = this.postData.detailId;
                Indicator.open();
                axios.post(this.blockURL + '/qypfs-order/api/order/afterSale/trial', {
                    "detailId": detailId,
                    "orderNo": this.orderNo,
                    "remarks": this.refuseVal,
                    "status": -3,
                })
                .then((res) => {
                    Indicator.close();
                    if (res.data.code == 200) {
                        Toast('操作成功');
                        history.go(-1);
                    } else {
                        Toast(res.data.message);
                        setTimeout(()=>{
                            history.go(-1)
                        },1500);
                        return false;
                    }
                }).catch(err=>{Indicator.close()})
            },
            // 获取确认订单数据
            goBack() {
                history.go(-1);
            },
        }
    }
</script>

<style scoped>
    .buyRefuse{
        margin-top: 52px;
        background-color: #fff;
        padding-bottom: 0.6rem;
    }
    .buyRefuse .buyRefuse-tit{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        height: 2rem;
        padding: 0 0.4rem;
        line-height: 2rem;
        border-bottom: 1px solid rgba(230,230,230,1);
    }
    .buyRefuse textarea{
        height:3.41rem;
        background:#FBF8FB;
        border-radius:0rem;
        display: block;
        margin:  0.4rem auto;
        width: 95%;
        padding: 0.4rem;
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        line-height:0.75rem;
    }
    .buyRefuseBtn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height:2.23rem;
        background:rgba(255,96,35,1);
        border: none;
        font-size:0.77rem;
        font-family:Hiragino Sans GB;
        font-weight:normal;
        color:rgba(255,255,255,1);
    }

</style>
