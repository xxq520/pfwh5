<template>
    <!-- 支付成功后的订单详情页面 -->
    <div class="glode">
        <mt-header title="订单详情" ref="header" :fixed='true'>
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
                    <div class="users">{{orderDetail.consignee}}（{{orderDetail.consigneeMobile}}）</div>
                    <div class="addre">
                        收货地址：{{(orderDetail.province+orderDetail.city+orderDetail.district+orderDetail.address)||''}}
                    </div>
                </div>
            </div>
        </div>
        <div class="mainlist">
            <div class="list-item">
                <div class="good-box">
                    <div class="borderBottom" v-for="(item,index) in orderDetail.orderDetails">
                        <div class="goods">
                            <div class="goodimg"><img
                                :src="item.picUrl">
                                <i v-if="item.reviewStatus == 4">已退款</i>
                                <i v-if="[1, 2, 3].indexOf(Number(item.reviewStatus)) > -1">退款中</i>
                            </div>
                            <div class="goodtext">
                                <p class="textTitle">{{item.goodsName}}</p>
                                <span class="order span">规格:{{item.spec}}</span>
                                <span class="span">数量:{{item.goodsNum}}</span>
                                <div class="receivedBox">
                                    <i>金额:￥{{item.totalPrice}}</i>
                                    <div v-if="isShowUtil(item)==1" class="received">{{item.deliverDesc}}</div>
                                    <div v-if="isShowUtil(item)==2" @click="cahngeLogistics(index)" class="received">
                                        <span>物流信息</span>
                                        <img v-if="!item.isShowLogistics"
                                             :src="require('../../../assets/images/block/icon_bottom.png')" alt="">
                                        <img v-else :src="require('../../../assets/images/block/icon_top.png')" alt="">
                                    </div>
                                    <div v-if="isShowUtil(item)==3" class="received">
                                        <p v-if="item.goodsNum>1" @click="showSetNum(item,'部分发货')" class="part">部分发货</p>
                                        <p @click="orderSendSure(item)">发货</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="logistics" v-if="item.isShowLogistics">
                            <p>
                                <span>物流类型</span>
                                <span>{{item.waybillNo?'快递':'物流'}}</span>
                            </p>
                            <div>
                                <span>物流信息</span>
                                <span v-if="item.waybillNo"
                                      @click="gologisticsDetail(item.waybillNo,orderDetail.orderNo)">
                                    <i class="red">{{item.waybillNo}}</i>
                                    <i class="el-icon-arrow-right"></i>
                                </span>
                                <img v-if="item.logisticsVoucher" preview="1" preview-text="凭证"
                                     :src="item.logisticsVoucher" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Leaved">
                    <span>买家留言:</span> <input :value="orderDetail.remark||'无'" type="text" readonly="readonly">
                </div>
            </div>
        </div>
        <div class="orderPrice mt20">
            <div class="borderb">
                <span class="title">商品总金额</span>
                <span class="priceTot"><i class="small">￥</i>{{orderDetail.orderPrice}}</span>
            </div>
            <div>
                <span class="title">支付总金额</span>
                <span class="priceTot now"><i class="small">￥</i>{{orderDetail.totalOrderPrice}}</span>
            </div>
        </div>
        <!-- 判断该订单是否发货 -->
        <div v-if="orderDetail.orderStatus>=3" class="orderPrice mt20">
            <div v-if="orderDetail.waybillNo" class="borderb">
                <span class="title">物流类型</span>
                <span class="priceTot orderPricer">{{orderDetail.waybillNo?'快递':'物流'}}</span>
            </div>
            <div v-if="orderDetail.carrier" class="borderb">
                <span class="title">快递公司</span>
                <span class="priceTot orderPricer">{{orderDetail.carrier}}</span>
            </div>
            <div v-if="orderDetail.waybillNo">
                <span class="title">快递单号</span>
                <span class="priceTot orderPricer">{{orderDetail.waybillNo}}</span>
            </div>
            <div v-if="orderDetail.logisticsVoucher" class="wuliuBox">
                <span class="title">凭证</span>
                <img class="wuliu" :src="orderDetail.logisticsVoucher" alt="" preview="1" preview-text="凭证">
            </div>
        </div>
        <div class="orderFs">
            <p>订单编号：{{orderDetail.orderNo}}</p>
            <p v-if="orderDetail.serialNo">交易单号：{{orderDetail.serialNo}}</p>
            <p>订单创建时间：{{orderDetail.createTime}}</p>
            <p v-if="orderDetail.payTime">订单交易时间：{{orderDetail.payTime}}</p>
        </div>
        <!-- 设置发货数量 -->
        <mt-popup v-model="isShowSetNum">
            <div class="content cont-act">
                <p class="title">请选择发货数量:</p>
                <div class="setBox">
                    <img @click="setNum('prev')" src="../../../assets/images/block/button_0001.png" alt="">
                    <input type="number" v-model="goodsNum">
                    <img @click="setNum('next')" src="../../../assets/images/block/button_002.png" alt="">
                </div>
                <div class="btns">
                    <span @click="hideSetNum">取消</span>
                    <span @click="orderSendSure(SetNumOrderItem,'部分发货')">确定</span>
                </div>
            </div>
        </mt-popup>
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
                orderNo: "",
                // 订单详情数据
                orderDetail: {},
                // 用户信息
                userInfo: this.$store.state.userInfo,
                // 是否显示设置发货数量弹窗
                isShowSetNum: false,
                // 设置部分发货得订单
                SetNumOrderItem: {},
                // 发货得数量
                goodsNum: 0
            }
        },
        created() {
            // 07.22
            // 加载订单数据需要传递订单的总单号 orderNo字段
            var query = this.$route.query;
            if (query) {
                this.orderNo = query.orderNo
            }
            this.getOrderDetail();
        },
        computed: {
            // 是否是默认地址
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        methods: {
            // 加减发货数量事件
            setNum(type) {
                let num = this.goodsNum;
                let goods = this.SetNumOrderItem;
                // 剩余可发的商品数量
                let deliverNum = goods.goodsNum - goods.deliverNum;
                if (type === 'prev') {
                    num = num - 1 <= 0 ? 1 : num - 1;
                } else if (type === 'next') {
                    num = num + 1 > (deliverNum || 0) ? deliverNum : num + 1;
                }
                this.goodsNum = num;
            },
            // 设置发货的数量
            showSetNum(item) {
                this.isShowSetNum = true;
                this.goodsNum = item.goodsNum - (item.deliverNum || 0);
                this.SetNumOrderItem = item;
                console.log(11122)
            },
            hideSetNum() {
                this.isShowSetNum = false;
            },
            // 跳转物流详情页面
            gologisticsDetail(logistics, orderNo) {
                this.$router.push({
                    path: `/block/logistics?logistics=${logistics}&orderNo=${orderNo}`
                });
            },
            // 更改物流信息的显示隐藏
            cahngeLogistics(index) {
                this.$set(this.orderDetail.orderDetails[index], `isShowLogistics`, !this.orderDetail.orderDetails[index].isShowLogistics)
                this.$previewRefresh()
            },
            // 筛选需要展示的数据
            isShowUtil(item) {
                let showNum = 0;
                //1：显示待收货/待发货  2：展示物流信息  3：可以点击发货
                // 区域批发商卖家可以看到发货按钮 其他角色无法看到
                // 当订单详情有待发货/待收货 并且当前登录用户不为区域批发商卖家身份的时候 为true
                let isUser = item.deliverDesc && this.userInfo.business != 2;
                // 当订单详情有待收货 并且当前登录用户是区域批发商卖家身份的时候 为true
                let isAdmin = item.deliverDesc == "待收货" && this.userInfo.business == 2
                // 详细商品订单不是退款状态
                if (item.reviewStatus) {
                    return showNum;
                }
                // 是否有物流信息 有则展示物商品流信息
                if (item.waybillNo || item.logisticsVoucher) {
                    showNum = 2;
                } else if (this.orderDetail.orderStatus != 2) {
                    return showNum;
                } else if (isUser || isAdmin) {
                    showNum = 1;
                } else if (this.userInfo.business == 2 && (item.deliverDesc == "待发货" || item.deliverDesc.indexOf('部分发货') != -1)) {
                    showNum = 3;
                }
                return showNum;
            },
            // 发货
            orderSendSure(item, typeStr) {
                var that = this;
                let goodsNum = this.goodsNum.toString();
                // 是否是部分发货
                if (typeStr === '部分发货') {
                    if (!goodsNum || !(/(^[1-9]\d*$)/.test(goodsNum))) {
                        showToast('发货数量只能为正整数');
                        return
                    } else if (goodsNum > (item.goodsNum - item.deliverNum)) {
                        showToast(`最多可发${item.goodsNum}件`);
                        return
                    }
                }
                this.hideSetNum();
                let params = {};
                let url = "";
                MessageBox({
                    title: "",
                    message: '是否确定发货?',
                    showCancelButton: true
                }).then(action => {
                    if (action != 'confirm') {
                        return false;
                    }
                    // 部分发货参数
                    if (typeStr === '部分发货') {
                        url = '/qypfs-order/api/order/v2/deliver';
                        params = {
                            "orderNo": that.orderDetail.orderNo,
                            "deliverDetails": [
                                {"deliverNum": goodsNum, "detailId": item.id}
                            ],
                            wholesalerId: that.orderDetail.wholesalerId
                        };
                    } else {
                        // 单品发货参数
                        params = {
                            "orderNo": that.orderDetail.orderNo,
                            "detailId": [item.id],
                            wholesalerId: that.orderDetail.wholesalerId
                        };
                    }
                    that.postDeliver(params, url);
                });
            },
            // 发货提交请求
            postDeliver(params, url) {
                url = url ? url : '/qypfs-order/api/order/deliver';
                axios.post(this.blockURL + url, params)
                    .then((res) => {
                            if (res.data.code == 200) {
                                showToast('发货成功');
                                this.getOrderDetail();
                            } else {
                                showToast(res.data.message);
                                this.getOrderDetail();
                            }
                        }
                    )
            },
            // 获取订单详情数据
            getOrderDetail() {
                Indicator.open();
                axios.get(this.blockURL + `/qypfs-order/api/order/get?orderNo=${this.orderNo}`).then(res => {
                    if (res.data.code == 200) {
                        console.log('我的', res.data)
                        this.orderDetail = res.data.data || {};
                        this.$previewRefresh()
                    } else {
                        Toast({message: res.data.message, position: 'bottom', duration: 2000});
                    }
                    Indicator.close();
                }).catch(err => {
                    Indicator.close();
                });
            },
            // 返回事件
            goBack() {
                history.go(-1);
            },
        },
    }
</script>

<style scoped>
    /deep/ .v-modal {
        z-index: 10 !important;
    }

    .setBox {
        display: flex;
        align-items: center;
        width: 74%;
    }

    .setBox img {
        width: 1rem;
        height: 1rem;
        margin: 0.3rem;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10.44rem;
        height: 6.25rem;
        background: rgba(255, 255, 255, 1);
        border-radius: .2rem;
        position: relative;
    }

    .content.cont-act {
        height: 7rem;
    }

    .content .title {
        font-size: .75rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 1rem;
        margin-top: .78rem;
        margin-bottom: .37rem;
    }

    .content input {
        width: 76%;
        height: 1.5rem;
        border: 1px solid rgba(153, 153, 153, 1);
        border-radius: 4px;
        padding-left: .3rem;
        text-align: center;
    }

    .content .tip {
        color: red;
        font-size: .5rem;
        font-family: PingFang SC;
        margin-top: .3rem;
    }

    .content .btns {
        width: 100%;
        height: 2.04rem;
        position: absolute;
        bottom: 0;
        display: flex;
        border-top: 1px solid #E5E5E5;
    }

    .content .btns span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #E5E5E5;
        width: 50%;
        font-size: .625rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .content .btns span:last-child {
        border: 0 none;
        color: #FF5F23;
    }

    .part {
        margin-right: 0.2rem;
    }

    .red {
        color: #FF6023;
    }

    .logistics {
        background: rgba(240, 240, 240, 1);
        margin: 0 0.4rem;
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 0.4rem;
        padding: 0 0.1rem;
    }

    .logistics > p {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(220, 220, 220, 1);
        justify-content: space-between;
        height: 1.64rem;
    }

    .logistics > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0;
        min-height: 1.8rem;
    }

    .logistics > div span {
        display: flex;
        align-items: center;
    }

    .logistics > div .el-icon-arrow-right {
        font-size: 0.8rem;
        color: #999999;
    }

    .logistics img {
        max-width: 2.27rem;
    }

    .receivedBox {
        display: flex;
        justify-content: space-between;
    }

    .receivedBox .received {
        color: rgba(255, 96, 35, 1);
        font-size: 0.55rem;
    }

    .received span {
        color: rgba(255, 96, 35, 1);
    }

    .received {
        display: flex;
        align-items: center;
    }

    .received img {
        width: 0.55rem;
        height: 0.55rem;
        margin-left: 0.1rem;
        margin-top: -0.1rem;
    }

    .received p {
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

    .goodimg {
        position: relative;
    }

    .goodimg i {
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

    .borderBottom {
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
        padding: 0.6rem 10px;
        text-align: right;
        font-size: 0.65rem;
        border-bottom: 1px solid #f1f2f5;
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
