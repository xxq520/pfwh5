<template>
    <div class="glode">
        <mt-header title="确认订单" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <router-link  v-if="defaultAddress.id" to="/block/blockmyAddress?tolink=confirmoder" class="address">
            <div class="addreText">
                <div>
                    <div class="users">{{defaultAddress.userName}}({{defaultAddress.mobileNumber}})<span v-if="defaultAddress.isDefault">默认信息</span></div>
                    <div class="addre">收货地址：{{defaultAddress.regionProvinceName+defaultAddress.regionCityName+defaultAddress.regionDistrictName+defaultAddress.address}}</div>
                </div>
                <div class="el-icon-arrow-right"></div>
            </div>
        </router-link>
        <router-link  v-else  to="/block/blockmyAddress?tolink=confirmoder">
            <div class="addAddress">
                <div>
                    <img src="../../../assets/images/pf_dd_icon_tianjia.png" alt="">
                    <span class="users">请先填写收货地址</span>
                </div>
                <div class="el-icon-arrow-right"></div>
            </div>
        </router-link>
        <div class="mainlist">
            <div v-for="(order,i) in postData.orderList" class="list-item">
                <div class="shopName">
                    <span>{{order.wholesalerName}}</span>
                </div>
                <div class="good-box">
                    <div v-for="(item,index) in order.orderDetails" class="goods" >
                        <div class="goodimg">
                            <img :src="item.picUrl">
                        </div>
                        <div class="goodtext">
                            <p>{{item.goodsName}}</p>
                            <span class="order">规格:{{item.spec}}</span>
                            <span>数量:{{item.goodsNum}}</span>
                            <i>金额:￥{{item.retailPrice}}</i>
                        </div>
                    </div>
                </div>
                <div class="total">共1件商品&nbsp;&nbsp;&nbsp;小计：<i><i style="font-size: 0.6rem">￥</i>{{order.totalOrderPrice}}</i></div>
                <div class="Leaved">
                    <input v-model="order.remark" type="text" placeholder="买家留言:(选填)填写内容已和商家协商确定">
                </div>
            </div>
        </div>
        <div class="orderbottom">
            <div class="amount">合计: <i><i class="small">¥</i>{{postData.totalOrderPrice}}</i></div>
            <div class="shopbut">
                <a href="javascript:" class="buy" @click="buy" :style="0!='0'?'background:#ddd;':''">提交订单</a>
            </div>
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
                postData: new Object(),
                // 默认的收货地址
                defaultAddress: {},
                //用户信息
                userInfo: this.$store.state.userInfo,
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
            this.defaultAddress = sessionStorage.setAddress?JSON.parse(sessionStorage.setAddress):{};
            // 回显地址
            if (!this.defaultAddress.id) {
                this.getAddressList();
            }
            this.getConfirmOrder();
        },
        destroyed(){
           // 删除缓存
           sessionStorage.removeItem("setAddress");
        },
        methods: {
            // 获取确认订单数据
            getConfirmOrder() {
                var order = sessionStorage.getItem("order");
                if (order){
                    order = JSON.parse(order);
                    this.postData = order;
                }
            },
            //获取默认地址
            getAddressList() {
                axios.get(`${this.blockURL}/qypfs-user/userShippingAddress/getDefaultUserAddress?userId=${this.userInfo.userId}`).then(res => {
                    if (res.data.code == 200) {
                        this.defaultAddress = res.data.data ? res.data.data : this.defaultAddress;
                    } else {
                        showToast('网络错误，请重试', 'middle')
                    }
                })
            },
            // 返回事件
            goBack() {
                history.go(-1);
            },
            // 点击提交订单创建支付订单
            buy() {
                if (!this.defaultAddress.id) {
                    Toast('请选择收货地址');
                    return false;
                }
                Indicator.open();
                let payParams = sessionStorage.getItem("postOrder");
                let orderList = this.postData.orderList;
                if (payParams){
                    payParams = JSON.parse(payParams);
                    payParams.remarkList = [];
                    // 买家的留言
                    for (let i=0; i<orderList.length; i++){
                        payParams.remarkList.push({orderNo:orderList[i].orderNo,remark:orderList[i].remark})
                    }
                }
                payParams.address = this.defaultAddress;
                axios.post(this.blockURL + '/qypfs-order/api/order/submitOrder',payParams)
                    .then((res) => {
                        Indicator.close();
                        if (res.data.code == 200) {
                            sessionStorage.setItem('order',JSON.stringify(res.data.data));
                            res.data.data.seq = this.userInfo.seq;// 用户seq
                            this.$router.push({path: '/block/paypage',query:res.data.data});
                        } else {
                            Toast(res.data.message);
                        }
                }).catch(err=> {
                    Indicator.close();
                });
            },
        }
    }
</script>

<style scoped>
    .addAddress {
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        height: 2.27rem;
        padding: 0 0.55rem;
        font-size: 0.7rem;
        font-family: HiraginoSansGB;
        color: rgba(102, 102, 102, 1);
        font-weight: normal;
        margin-bottom: 0.4rem;
    }

    .addAddress > div {
        display: flex;
        align-items: center;
    }

    .addAddress > div > span {
        padding-left: 0.3rem;
    }

    .addAddress img {
        width: 0.9rem;
        height: 0.9rem;
    }

    .addAddress span {

    }

    .addreText {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .addreText .el-icon-arrow-right {
    }

    .glode {
        min-height: 100vh;
        padding-top: 40px;
        padding-bottom: 60px;
    }

    .glode >>> .mint-header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 99;
    }

    .address {
        display: block;
        padding: 0.7rem 0.5rem;
        background: white;
        font-size: 0.65rem;
        position: relative;
        color: #212121;
    }

    .address {
        overflow: hidden;
        padding-right: 0.5rem;
    }

    .address .users {
        overflow: hidden;
        margin-bottom: 0.3rem;
        line-height: 1.4em;
        color: #212121;
    }

    .address .users span {
        color: white;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        background: rgba(255, 96, 35, 1);
        border-radius: 3px;
        padding: 0.08rem 0.3rem;
        margin-left: 0.6rem;
    }

    .address .addre {
        line-height: 1.4em;
    }

    .address .el-icon-arrow-right {
        font-size: 0.8rem;
        line-height: 1.2em;
        color: #999;
    }

    .mainlist {
        overflow: hidden;
        margin-top: 0.5rem;
    }

    .list-item {
        overflow: hidden;
        background: white;
        margin-bottom: 0.5rem;
        font-size: 0.65rem;
        line-height: 1.2em;
    }

    .list-item .shopName {
        overflow: hidden;
        border-bottom: 1px solid #f1f2f5;
        padding: 0 0.54rem;
        height: 1.9rem;
        line-height: 1.9rem;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .good-box {
        overflow: hidden;
        padding: 0 10px;
        background-color: #FBF8FB;
    }

    .good-box .goods {
        overflow: hidden;
        padding: 0.6rem 0;
        border-bottom: 1px solid rgba(241, 242, 245, 1);
    }

    .good-box .goods:last-child {
        border-bottom: none;
    }

    .good-box .goods .goodimg {
        float: left;
        width: 5rem;
        height: 5rem;
    }

    .goodimg img {
        height: 100%;
    }

    .good-box .goods .goodtext {
        float: right;
        width: calc(100% - 5.5rem);

    }

    .good-box .goods .goodtext p {
        overflow: hidden;
        height: calc(2.4em - 1px);
        line-height: 1.2em;
        margin-bottom: 0.4rem;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #212121;
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(33, 33, 33, 1);
    }

    .good-box .goods .goodtext span {
        display: block;
        font-size: 0.62rem;
        margin-bottom: 0.45rem;
        color: #4c4c4c;
        line-height: 1.2em;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(77, 77, 77, 1);
    }

    .small {
        font-size: 0.68rem !important;
    }

    .good-box .goods .goodtext span.order {
        max-height: calc(2.4em - 1px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .good-box .goods .goodtext i {
        display: block;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 96, 35, 1);
    }

    .total {
        overflow: hidden;
        padding: 0.6rem 10px;
        border-top: 1px solid #f1f2f5;
        border-bottom: 1px solid #f1f2f5;
        text-align: right;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    .total i {
        font-size: 0.7rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FF6023;
    }

    .Leaved {
        overflow: hidden;
        padding: 0.6rem 10px;
        text-align: right;
        font-size: 0.65rem;
        border-bottom: 1px solid #f1f2f5;
    }

    .Leaved input {
        padding-left: 3rem;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        text-align: right;
    }

    .orderbottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: white;
        border-top: 1px solid rgba(230, 230, 230, 1);
        z-index: 9;
        font-size: 0.7rem;
    }

    .orderbottom .amount {
        float: left;
        line-height: 50px;
        padding: 0 0 0 10px;
        font-size: 0.82rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .orderbottom .amount i {
        color: #FF6023;
    }

    .shopbut {
        float: right;
    }

    .shopbut a {
        float: left;
        color: white;
        line-height: 50px;
        padding: 0 0.8em;
        text-align: center;
        font-size: 0.77rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
    }

    .shopbut a.buy {
        background-color: rgba(255, 96, 35, 1);
    }

</style>
