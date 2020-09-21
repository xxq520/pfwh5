<template>
    <div class="order-details">
        <!-- <topnav :top="topnav"></topnav> -->
        <mt-header :title="topnav.title">
            <mt-button icon="back" @click="$router.go(-1)" slot="left"></mt-button>
        </mt-header>
        <div class="main">
            <div class="ownerInfo wbg mgTop pad">
                <i class="el-icon-location-outline"></i>
                <p class="ownerName">{{data.ConsigneeName}}（{{data.ConsigneePhone}}）</p>
                <p class="ownerAddress">收货地址：{{data.ConsigneeAddress}}</p>
            </div>
            <div class="pro-list wbg mgTop pad">
                <div class="pro-item" v-for="(item,i) in data.ordersdtl" :key="i">
                    <div class="pro-img"><img :src="item.ProductImg"></div>
                    <div class="pro-details">
                        <p class="pro-title fs26 padbtm">{{item.name}}</p>
                        <p class="pro-spec fs24 padbtm">规格：{{item.other1Name}}</p>
                        <p class="pro-count fs24 padbtm">数量：{{item.buycount}}{{item.unitName}}</p>
                        <p class="pro-price fs24 pclor">金额：￥{{checkInt(item.TatolPrice)}}</p>
                    </div>
                </div>
                <p class="mark fs28"><span>备注：</span><span class="text">{{data.MARK?data.MARK:''}}</span></p>
            </div>
            <div class="price-box wbg mgTop pad">
                <p class="totalPrice fs30 padbtm"><span>商品总金额</span><span>￥{{checkInt(data.TatolPrice)}}</span></p>
                <p class="gjPrice fs30"><span>支付总金额</span><span class="pclor">￥{{checkInt(data.TotalPaymentAmount)}}</span></p>
            </div>
            <p class="orderCode pad fs28 padbtmno">订单编号：{{data.salenumber}}</p>
            <p class="saleCode pad fs28 padbtmno" v-if="data.YN != 1">交易单号：{{data.playnumber}}</p>
            <p class="createTime pad fs28 padbtmno">订单创建时间：{{data.ordertime!=null?formatter(data.ordertime):''}}</p>
            <p class="playTime pad fs28 padbtmno" v-if="data.YN != 1">订单交易时间：{{data.PlayTime!=null?formatter(data.PlayTime):''}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            topnav:{
                title:'订单详情'
            },
            code:'',
            seq:'',
            data:[]
        }
    },
    mounted(){
        Indicator.open();
        this.code = this.$route.query.orderCode;
        this.seq =this.$route.query.seq;
        this.getOrderDetails();
    },
    methods: {
        getOrderDetails(){
            axios.get(this.URL + '/OrderNewListInfo/GetOrderDetail',{params:{
                ordernumber:this.code,
                Seq:this.seq
            }})
            .then((res)=>{
                if(res.data.code == 200){
                    this.data = res.data.data;
                }
                console.log(res);
                Indicator.close();
            })
            .catch((err)=>{
                Indicator.close();
            })
        },
        checkInt(num){
          var fixedNum = num;
          if(fixedNum !=0 && fixedNum != null){
            fixedNum = (fixedNum).toFixed(2);
            return fixedNum;
          }else{
            return '0.00';
          }
        },
        formatter(data) {
            return data.replace("T", " ").substring(0,19);
        },
    }
}
</script>
<style scoped>
@import '../../assets/css/orderDetails.css';
</style>
