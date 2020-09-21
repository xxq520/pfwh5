<template>
    <!-- 支付成功后的订单详情页面 -->
    <div class="glode">
        <mt-header title="快递详情" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="orderTopBox">
            <div class="orderTop">
                <p :class="(item%2)?'blue':'pink'" v-for="item in 100"></p>
            </div>
        </div>
        <div class="address">
            <div class="addreText">
                <div>
                    <div class="addre">订单号：<span>{{orderNo}}</span></div>
                    <div v-if="logisticsData[0]" class="addre">承运快递：<span>{{logisticsData[0].type || "暂无信息"}}</span></div>
                    <div class="addre">快递单号：<span>{{logistics}}</span></div>
                </div>
            </div>
        </div>
        <div class="mainlist">
            <div class="list-item">
                <div class="good-box">
                </div>
                <div class="Leaved">
                    <span>快递追踪</span>
                </div>
                <div v-if="logisticsData.length" class="logisticsList">
                    <p class="line"></p>
                    <div v-for="(item,index) in logisticsData" class="logisticsBox">
                        <span>
                            <i :class="index==0?'active':''"></i>
                        </span>
                        <div>
                            <p class="logisticsTit">{{item.logisticsInfo}}</p>
                            <p class="time">{{item.date}}</p>
                        </div>
                    </div>

                </div>
                <div v-else class="noneData">
                    暂无快递信息...
                </div>
            </div>
        </div>
        <div class="orderPrice mt20">
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        Toast,
        Indicator
    } from 'mint-ui';
    import {showToast} from '@/assets/js/common.js'
    export default {
        data() {
            return {
                // 下单单号
                logistics: "",
                // 订单详情数据
                logisticsData: [],
                // 订单号
                orderNo: ""
            }
        },
        created() {
            // 07.22
            // 加载订单数据需要传递订单的总单号 orderNo字段
            var query = this.$route.query;
            if (query) {
                this.logistics = query.logistics;
                this.orderNo = query.orderNo
            }
            this.getLogistics();
        },
        computed: {
            // 是否是默认地址
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        methods: {
            // 获取订单物流信息
            getLogistics() {
                Indicator.open();
                axios.get(this.blockURL + `/qypfs-order/api/order/logisticsInfo/get?waybillNo=${this.logistics}`)
                    .then((res) => {
                            if (res.data.code == 200) {
                                this.logisticsData = res.data.data || [];
                            } else  {
                                showToast(res.data.message);
                            }
                            Indicator.close();
                        }
                    ).catch(err=>{Indicator.close()})
            },
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
        },
    }
</script>

<style scoped>
    .noneData{
        text-align: center;
        padding-bottom: 0.5rem;
        color: #7d7d7d;
    }
    .line{
        position: absolute;
        height: calc(100% - 2.3rem);
        border-left: 1px solid rgba(215,215,215,1);
        top: 0.8rem;
        left: 0.74rem;
        z-index: 0;
    }
    .logisticsList{
        padding: 0.2rem 0.6rem;
        position: relative;
    }
    .logisticsBox{
        display: flex;
    }
    .logisticsBox>span{
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        margin-top: 0.1rem;
        position: relative;
    }
    .logisticsBox>span i{
        position: absolute;
        z-index: 10;
        background: rgba(208,208,208,1);
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        margin-top: 0.5rem;
    }
    .logisticsBox .active{
        background:#FF6023 !important;
        width: 0.4rem;
        height: 0.4rem;
        left: -0.03rem;
    }
    .logisticsBox>div{
        padding-left: 0.6rem;
        max-width: 97%;
        margin-bottom: 0.6rem;
    }
    .logisticsBox .logisticsTit{
        font-size:0.55rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(154,154,154,1);
    }
    .logisticsBox .time{
        font-size:0.55rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(154,154,154,1);
        margin-top: 0.08rem;
    }

    .Leaved>div{}
    .red {
        color: #FF6023;
    }
    .logistics{
        background:rgba(240,240,240,1);
        margin: 0 0.4rem;
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-bottom: 0.4rem;
        padding: 0 0.1rem;
    }
    .logistics>p{
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(220,220,220,1);
        justify-content: space-between;
        height: 1.64rem;
    }
    .logistics>div{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0;
        min-height: 1.8rem;
    }
    .logistics>div span{
        display: flex;
        align-items: center;
    }
    .logistics>div .el-icon-arrow-right{
        font-size: 0.8rem;
        color: #999999;
    }
    .logistics img{
        max-width: 2.27rem;
    }
    .receivedBox {
        display: flex;
        justify-content: space-between;
    }
    .receivedBox .received{
        color: rgba(255, 96, 35, 1);
        font-size: 0.55rem;
    }
    .received span{
        color: rgba(255, 96, 35, 1);
    }
    .received{
        display: flex;
        align-items: center;
    }
    .received img{
        width: 0.55rem;
        height: 0.55rem;
        margin-left: 0.1rem;
        margin-top: -0.1rem;
    }
    .received p{
        padding: 0.1rem 0.6rem;
        border: 1px solid rgba(255, 96, 35, 1);;
        color: rgba(255, 96, 35, 1);
        font-size: 0.55rem;
        border-radius: 0.2rem;
    }
    .wuliuBox {
        height: 2.73rem !important;
    }

    .wuliu {
        width: 2.27rem;
        height: 2.27rem;
    }

    .orderTopBox {
        width: 100%;
        overflow: hidden;
    }
    .goodimg{
        position: relative;
    }
    .goodimg i{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .65);
        color: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        font-size: .59rem;
    }
    .orderTop {
        margin-top: 0.1rem;
        background-color: #FFFDFF;
        margin-bottom: 0.02rem;
        width: 110%;
        overflow: hidden;
        height: 0.27rem;
    }

    .orderTop p {
        float: left;
        transform: skewX(-45deg);
        width: 0.7rem;
        height: 0.27rem;
        margin-left: 0.12rem;
        margin-right: 0.12rem;
    }

    .blue {
        background: rgba(207, 223, 247, 1);
    }

    .pink {
        background: rgba(252, 202, 205, 1);
    }

    .orderFs p {
        padding-top: 0.25rem;
    }

    .orderFs {
        padding-left: 0.4rem;
        font-size: 0.6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .priceTot {
        font-size: 0.74rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .orderPricer {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .now {
        color: #FF6023;
    }

    .orderPrice > div {
        display: flex;
        justify-content: space-between;
        padding: 0 0.45rem;
        height: 2.2rem;
        align-items: center;
    }

    .glode span.title {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .borderb {
        border-bottom: 1px solid rgba(220, 220, 220, 1);
    }

    .orderPrice {
        background-color: #fff;
    }

    .mt20 {
        margin-top: 0.45rem;
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
        padding: 0.4rem 0.5rem;
        background: white;
        font-size: 0.65rem;
        position: relative;
        color: #212121;
    }

    .address {
        overflow: hidden;
        padding-right: 0.5rem;
    }
    .addreText>div>div{
        overflow: hidden;
        padding-right: 0.5rem;
        margin-bottom: 0.1rem;
    }
    .address>div>div span{
        color: #666666;
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
        font-size: 0.65rem;
        line-height: 1.2em;
    }

    .good-box {
        overflow: hidden;
    }

    .good-box .goods {
        padding: 0.6rem 10px;
        overflow: hidden;
    }
    .borderBottom{
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

    .good-box .goods .goodtext .textTitle {
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

    .good-box .goods .goodtext .span {
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

    .Leaved {
        overflow: hidden;
        padding: 0.4rem 10px;
        text-align: right;
        font-size: 0.65rem;
        align-items: center;
        display: flex;
    }

    .Leaved span {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1)
    }

    .Leaved input {
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 70%;
        font-size: 0.68rem;
        padding-left: 0.2rem;
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

    .shopbut a.changeprice {
        background-color: rgba(255, 168, 0, 1);
    }

    .shopbut a.buy {
        background-color: rgba(255, 96, 35, 1);
    }

    /* popup */
    .popup {
        width: 100%;
        background: white !important;
    }

    .xuzhi {
        padding: 0.4444rem;
    }

    .glode .mask-con {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 99;
    }

    .glode .mask-box {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -7.7778rem;
        margin-left: -6.6667rem;
        width: 13.3333rem;
        height: 15.5556rem;
        background-color: #fff;
        overflow: hidden;
        border-radius: .2222rem;
    }

    .glode .title {
        text-align: center;
        padding: .8889rem 0;
        font-size: .7111rem;
    }

    .glode .mask-desc {
        height: 100%;
        overflow: auto;
    }

    .glode .mask-list {
        padding: 15px 15px 2rem;
    }

    .glode .mask-item {
        font-size: .5333rem;
        padding: 0 .7333rem;
        line-height: .8rem;
    }

    .glode .btns-con {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.7778rem;
        border-top: .0222rem solid #ccc;
        display: flex;
        background: white;
    }

    .glode .btns-con .btns {
        background-color: transparent;
        border: 0;
        outline-style: none;
        font-size: .6667rem;
        flex: 1;
    }

    .glode .btns-con .btns:nth-child(2) {
        color: #fe0000;
        border-left: .0222rem solid #ccc;
    }

    .glode .btns-con .btns:active {
        background-color: #f2f2f2;
    }

    .xuzhiBTN {
        display: inline-block;
        font-size: .4444rem;
        color: #f00;
        float: right;
    }

    .xuzhiP {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .jt {
        float: right;
    }
</style>
