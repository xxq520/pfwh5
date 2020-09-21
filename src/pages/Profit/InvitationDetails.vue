<template>
    <div class="invitation-details">
        <mt-header title="详情" class="header">
            <router-link to="/wholesale/invitationRebate" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="main">
            <div class="content">
                <div class="items">
                    <p class="name">下游店铺名称:</p>
                    <p class="values">{{datas.storeName}}</p>
                </div>
                <div class="items">
                    <p class="name">下游账号:</p>
                    <p class="values">{{datas.storeMobile}}</p>
                </div>
                <div class="items">
                    <p class="name">入驻类型:</p>
                    <p class="values">{{datas.certificateType}}</p>
                </div>
                <div class="items">
                    <p class="name">订单号:</p>
                    <p class="values">
                        <!-- /orderDetails?orderCode=5784228201902251436066641&seq=5784228 -->
                        <router-link :to="{ path: '/orderDetails', query: {orderCode:datas.salenumber,seq:seq}}">{{datas.salenumber}}</router-link>
                    </p>
                </div>
                <!-- <div class="items">
                    <p class="name">商品名称:</p>
                    <p class="values">{{datas.salenumber}}</p>
                </div> -->
                <div class="items">
                    <p class="name">订单时间:</p>
                    <p class="values">{{ordertime}}</p>
                </div>
                <div class="items">
                    <p class="name">结算状态:</p>
                    <p class="values">{{datas.HKJSType==1?'已结算':'未结算'}}</p>
                </div>
                <div class="items" v-if="datas.HKJSType == 1">
                    <p class="name">同意结算时间:</p>
                    <p class="values">北京东方航天生物制品有限公司</p>
                </div>
                <div class="items">
                    <p class="name">销售金额:</p>
                    <p class="values">¥{{datas.TotalPaymentAmount.toFixed(2)}}</p>
                </div>
                <div class="items">
                    <p class="name">利润金额:</p>
                    <p class="values">¥{{datas.Profit.toFixed(2)}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            WholeSaleSeq:"",//批发商seq
            seq:"",//下游商家seq
            salenumber:"",//订单号
            HKJSType:0,//结算类型
            ordertime:'',//订单时间
            datas:{}//获取数据
        }
    },
    mounted(){
        this.getUrlParams();
    },
    methods:{
        //获取路由参数
        getUrlParams(){
            this.WholeSaleSeq = this.$route.query.WholeSaleSeq;
            this.seq = this.$route.query.SEQ;
            this.salenumber = this.$route.query.salenumber;
            this.getDetails();
        },
        // 获取详情数据
        getDetails(){
            axios.get(this.URL + "/OrderNewListInfo/GetProfitOrderDtl",{params:{
                salenumber:this.salenumber,
                SEQ:this.seq,
                WholeSaleSeq:this.WholeSaleSeq
            }})
            .then(res => {
                console.log(res.data);
                if(res.data.code == 200){
                    this.datas = res.data.data;
                    this.HKJSType = res.data.data. HKJSType;
                    this.ordertime = res.data.data.ordertime.replace("T"," ").substring(0,19);
                }
            })
            .catch(err => {

            })
        }
    }
}
</script>

<style>
    .invitation-details .header{
        background-color:#ef4628;
        color:#fff;
    }
    .invitation-details .main{
        padding:.6667rem .3333rem 0;
    }
    .invitation-details .content{
        background-color:#fff;
        border-radius:5px;
        padding:0 .3333rem;
    }
    .invitation-details .items{
        display:flex;
        justify-content: space-between;
        border-bottom:1px solid #ccc;
        padding:.4444rem 0;
        font-size:.6222rem;
        color:#666;
    }
    .invitation-details .items:last-child{
        border-bottom:0 none;
    }
    .invitation-details .items .values{
        color:#999;
        font-size:.5778rem;
    }
</style>
