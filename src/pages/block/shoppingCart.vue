<template>
    <div class="glode">
        <header class="mint-header">
            <div class="mint-header-button is-left"></div>
            <h1 class="mint-header-title">购物车{{ `( ${ cartNumber || 0 } )` }}</h1>
            <div class="mint-header-button is-right" @click="clearCart">删除</div>
        </header>
        <div v-if="!shopData.length" class="shopKong">
            <p><i class="el-icon-goods"></i>
                <p>
                    <p>亲，购物车空荡荡的(┬＿┬)</p>
        </div>
        <!-- 店铺 -->
        <div v-else class="shopbox" v-for="(whole,post) in shopData" :key="post" v-show="!whole.isClear">
            <div class="merchants">
                <img 
                @click="storeCheck(whole)" 
                :src="whole.isSelect ? require('../../assets/images/button_def_choose.png'):require('../../assets/images/block/pf_payment_icon_checkbox_n.png')"
                alt="">
                <span class="shopName">
                        {{ whole.shopName }}
                </span>
            </div>
            <div class="shoplist">
                <!--产品-->
                <div class="goods" v-for="(item,index) in whole.productCarts" :key="index" v-show="!item.isClear">
                    <div class="shopcheck" @click="goodsCheck(whole,item)">
                        <img
                            :src="item.isSelect ? require('../../assets/images/button_def_choose.png'):require('../../assets/images/block/pf_payment_icon_checkbox_n.png')"
                            alt="">
                    </div>
                    <div class="shopmain">
                        <div class="shopimg" @click="jumpToDetails(item.productId, item.wholesalerId)"><img
                                :src="item.productImage"></div>
                        <div class="shoptext">
                            <div class="shopname" @click="jumpToDetails(item.productId, item.wholesalerId)">{{ item.productName }}</div>
                            <div class="shopspec" @click="jumpToDetails(item.productId, item.wholesalerId)">
                                <div class="spec">
                                    <span>规格:{{ item.specs }}</span>
                                    <!--<i class="el-icon-arrow-down"></i>-->
                                </div>
                            </div>
                            <div class="shopdeal">
                                <div class="isValid stock" style="color:#666">库存：{{item.stock > 0 ? '有现货' : '暂无现货'}}</div>
                                <div class="numb">
                                    <span class="minus" @click="minusfn(item, index)"><i
                                            class="el-icon-minus"></i></span>
                                        <input 
                                            type="number"
                                            class="numbers" 
                                            :value="item.productNumber"
                                            @blur="keyupfn(item, index, $event)"
                                            @keyup.13="keyupfn(item, index, $event)" >
                                    <span class="plus" @click="plusfn(item, index)"><i class="el-icon-plus"></i></span>
                                </div>
                            </div>
                            <div>
                                <!-- <div class="money">金额:￥{{ item.amountAll || (item.amount * item.productNumber).toFixed(2) }}</div> -->
                                <div class="money">金额:￥{{ item.amount }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="settlement" style="bottom:51px">
            <img 
                class="all-select"
                @click="allCheck" 
                :src="isSelect ? require('../../assets/images/button_def_choose.png'):require('../../assets/images/block/pf_payment_icon_checkbox_n.png')"
                alt="">
            <div class="setbut" @click="setbut">去结算{{ `( ${ checkNum || 0 } )` }}</div>
            <div class="setmoney">合计：<span><i>￥</i>{{ totalMoney || '0.00' }}</span></div>
            <input type="hidden" :value="moneyAll">
            <!--防止修改产品数量无效-->
        </div>
        <block-tabbar v-if="true"></block-tabbar>
    </div>
</template>

<script>
    import {
        showToast,
        floatAdd
    } from '../../assets/js/common';
    import blockTabbar from '@/components/blockTabbar'
    export default {
        data() {
            return {
                loading: false,
                cartNumber: 0,
                shopData: [],
                isSelect: false,
                checkGoods: 0,
                skip: 0,
                take: 5,
                num1: 1,
                list: 0,
                totalMoney: 0,
                checkNum: 0,
                moneyAll: 0,
                shift: false,
                order: [],
                checklist: 0,
                carcount: 0,
                userType: '',
                userInfo: this.$store.state.userInfo,
            }
        },
        components: {
            blockTabbar
        },
        created() {
            this.createdfn()
        },
        mounted() {
            console.log(this.userInfo);
        },
        methods: {
            createdfn() {
                Indicator.open();
                this.loading = true;
                let that = this;
                var params = {
                    "pageIndex": 1,
                    "pageSize": 100,
                }
                // 购物车集合
                axios.post(this.blockURL + '/qypfs-cart/cart/findCarts', params).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.cartNumber = data.data.cartNumber;
                        this.shopData = this.shopData.concat(data.data.shopCarts);
                        // this.shopData = this.shopData.concat(JSON.parse(JSON.stringify(data.data.shopCarts)));
                        // this.cartNumber = 10;
                    } else {
                        Toast(res.data.message);
                    }
                    Indicator.close();
                    this.skip += this.take;
                    this.moneyfn();
                    if (data.data.shopCarts.length == 0) {
                        this.loading = true;
                        return false;
                    };
                    this.loading = false;
                }).catch(err => {
                    Indicator.close();
                });
            },
            jumpToDetails(productId, wholesalerId) {
                this.$router.push({
                    path: '/block/details',
                    query: {
                        strCode: productId,
                        wholesaleSEQ: wholesalerId
                    }
                });
            },
            // 删除购物车商品参数获取
            clearCartParams() {
                let params = {
                    username: this.userInfo.username
                };
                let localCarts = [];
                this.shopData.forEach(item => {
                    item.productCarts.forEach(obj => {
                        if(obj.isSelect){
                            localCarts.push({
                                productId: obj.productId,
                                skuId: obj.skuId,
                                supplierSeq: obj.supplierSeq,
                                wholesalerId: obj.wholesalerId || ""
                            })
                        }
                    });
                });
                params.localCarts = localCarts;
                return params;
            },
            // 删除购物车商品
            clearCart() {
                // return console.log(this.clearCartParams());
                let postCart = this.clearCartParams();
                let len = postCart.localCarts.length;
                if(len < 1) return;
                MessageBox.confirm(`确认要删除这${len}种商品吗?`).then(action => {
                    if(action === 'confirm'){
                        axios.post(`${this.blockURL}/qypfs-cart/cart/deleteCart`, postCart).then(res =>{
                            console.log('deleteCart', res);
                            if (res.data.code == 200) {
                                setTimeout(() =>{
                                    this.$router.go(0);
                                }, 1000)
                            }
                            showToast(res.data.message);
                        })
                    }
                });
            },
            // 减
            minusfn(val, idx) {
                if(val.productNumber - 1 < val.minimumQuantity) return showToast('起订量不足');
                var post = {
                    username: this.userInfo.username,
                    productNumber: 1,
                    skuId: val.skuId,
                    status: 2,
                    productId: val.productId
                }
                // 下游商家需要传区域批发商id
                if (this.userInfo.Blocktype == 6) {
                   post.wholesalerId = Number(this.$store.state.storeId);
                } 

                axios({
                    url: this.blockURL + "/qypfs-cart/cart/addCart",
                    method: "post",
                    data: post
                }).then(res => {
                    if (res.data.code == 200) {
                        val.productNumber--;
                        val.amountAll = (val.amount * val.productNumber).toFixed(2);
                        this.countTotal();
                        // showToast(res.data.message);
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            // 加
            plusfn(val, idx) {
                // if(Number(val.productNumber) + 1 > val.stock) return showToast('库存不足');
                var post = {
                    username: this.userInfo.username,
                    productNumber: 1,
                    skuId: val.skuId,
                    status: 1,
                    productId: val.productId
                }
                // 下游商家需要传区域批发商id
                if (this.userInfo.Blocktype == 6) {
                   post.wholesalerId = Number(this.$store.state.storeId);
                } 

                axios({
                    url: this.blockURL + "/qypfs-cart/cart/addCart",
                    method: "post",
                    data: post
                }).then(res => {
                    if (res.data.code == 200) {
                        val.productNumber++;
                        val.amountAll = (val.amount * val.productNumber).toFixed(2);
                        this.countTotal();
                        // showToast(res.data.message);
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            // 修改数量
            keyupfn(val, idx, $event) {
                let value = $event.target.value;
                if(value < val.minimumQuantity) return showToast('起订量不足');
                // if(Number(value) > val.stock) {
                //     $event.target.value = val.productNumber;
                //     return showToast('库存不足');
                // }
                var post = {
                    username: this.userInfo.username,
                    productNumber: value,
                    skuId: val.skuId,
                    status: 3,
                    productId: val.productId
                }
                // 下游商家需要传区域批发商id
                if (this.userInfo.Blocktype == 6) {
                   post.wholesalerId = Number(this.$store.state.storeId);
                } 
                axios({
                    url: this.blockURL + "/qypfs-cart/cart/addCart",
                    method: "post",
                    data: post
                }).then(res => {
                    if (res.data.code == 200) {
                        val.productNumber = value;
                        val.amountAll = (val.amount * val.productNumber).toFixed(2);
                        this.countTotal();
                        // showToast(res.data.message);
                    } else {
                        $event.target.value = val.productNumber
                        Toast(res.data.message);
                    }
                });

            },
            // 选中所有
            allCheck() {
                // this.isSelect = !this.isSelect;
                this.shopData.forEach(item => {
                    item.isSelect = !this.isSelect;
                    if (item.isSelect) {
                        this.checkGoods = this.cartNumber;
                    } else {
                        this.checkGoods = 0;
                    }
                    item.productCarts.forEach(obj => {
                        obj.isSelect = !this.isSelect;
                    });
                });

                this.countTotal();
            },
            // 店铺选中
            storeCheck(item) {
                console.log('店铺选中', item);
                item.isSelect = !item.isSelect;
                item.checkNum = item.isSelect ? item.productCarts.length : 0;
                item.productCarts.forEach(obj => {
                    if (item.isSelect && !obj.isSelect) {
                        this.checkGoods += 1;
                    } else if(!item.isSelect && obj.isSelect) {
                        this.checkGoods -= 1;
                    }
                    obj.isSelect = item.isSelect;
                });

                this.countTotal();
            },
            // 商品选中
            goodsCheck(item, obj) {
                console.log('商品选中', item, obj);
                let checkNum = item.checkNum == undefined ? 0 : item.checkNum;
                if (obj.isSelect) {
                    item.checkNum = checkNum - 1;
                    this.checkGoods -= 1;
                    this.money -= Number(obj.amount);
                    item.isSelect = false;
                } else {
                    item.checkNum = checkNum + 1;
                    this.checkGoods += 1;
                    this.money += Number(obj.amount);
                    if(item.checkNum === item.productCarts.length) item.isSelect = true;
                }
                obj.isSelect = !obj.isSelect;

                this.countTotal();
            },
            // 计算总价
            countTotal() {
                if (this.checkGoods == this.cartNumber) {
                    this.isSelect = true;
                } else {
                    this.isSelect = false;
                }
                let totalMoney = 0;
                let checkNum = 0;
                this.shopData.forEach(item => {
                    item.productCarts.forEach(obj => {
                        let amountAll = obj.amountAll || (obj.amount * obj.productNumber);
                        // totalMoney += obj.isSelect ? Number(amountAll) : 0;
                        totalMoney = floatAdd(totalMoney, obj.isSelect ? Number(amountAll) : 0);
                        checkNum += obj.isSelect ? 1 : 0; 
                    });
                });
                this.totalMoney = totalMoney.toFixed(2);
                this.checkNum = checkNum;
            },
            // 下单结算参数获取
            orderParams() {
                let params = {
                    fromDevice: 'H5',
                    remarkList: [],
                    fromCart: true,
                    roleId: this.userInfo.Blocktype, // 角色ID
                    // roleId: Number(this.userInfo.Blocktype)
                };
                let productAndSkuQueryList = [];
                this.shopData.forEach(item => {
                    item.productCarts.forEach(obj => {
                        if(obj.isSelect){
                            productAndSkuQueryList.push({
                                goodsNum: obj.productNumber,
                                productId: obj.productId,
                                skuId: obj.skuId,
                                wholesalerId: obj.wholesalerId || this.$store.state.storeId
                            })
                        }
                    });
                });
                params.productAndSkuQueryList = productAndSkuQueryList;
                return params;
            },
            // 下单结算商品
            setbut() {
                if(!this.checkNum || this.checkNum < 1) return;
                // return console.log(this.orderParams());
                let postOrder = this.orderParams() || {};
                axios.post(`${this.blockURL}/qypfs-order/api/order/confirmOrder`, postOrder).then(res => {
                    console.log('confirmOrder==', res);
                    if (res.data.code == 200) {
                        let data = res.data.data || {};
                        sessionStorage.setItem('order',JSON.stringify(data));
                        sessionStorage.setItem('postOrder',JSON.stringify(postOrder));
                        this.$router.push({
                            path: '/block/confirmorder'
                        })
                    } else {
                        showToast(res.data.message);
                    }
                })
            },
        }
    };

</script>

<style scoped>
    .money{
        color: #FF6023;
    }
    .shopName {
        color: #333;
        font-weight: bold;
    }
    .glode {
        min-height: 100vh;
        padding-top: 40px;
        padding-bottom: 110px;
        height: auto;
        overflow-y: auto;
    } 

    .glode>>>.mint-header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 99;
        background: linear-gradient(-90deg, rgba(255, 93, 35, 1), rgba(255, 119, 37, 1));
        color: #fff;
    }

    .is-right {
        font-size: 14px;
    }

    .shopbox {
        background: white;
        margin-top: 0.5rem;
        font-size: 0.65rem;
    }

    .shopbox .merchants {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        padding: 0.5rem 10px;
        border-bottom: 1px solid #f1f2f5;
        color: #333;
    }

    .merchants img {
        width: .68rem;
        object-fit: cover;
    }

    .checked {
        float: left;
        width: 1.1em;
        height: 1.1em;
        border: 1px solid #ccc;
        overflow: hidden;
        border-radius: 50%;
        color: white;
    }

    .checked.hover {
        background: red;
        border-color: red;
    }

    .shopbox .merchants span {
        padding-left: 0.4rem;
    }

    .shopbox .shoplist {
        padding: 0 10px;
    }

    .shopKong {
        overflow: hidden;
        font-size: 0.7rem;
        text-align: center;
        color: #ccc;
        padding: 1.5rem 0;
    }

    .shopKong p {
        margin-bottom: 0.6rem;
    }

    .shopKong p i {
        font-size: 4rem;
    }

    .shopbox .shoplist .goods {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f2f5;
        zoom: 1;
    }

    .shopbox .shoplist .goods .shopcheck {
        float: left;
        padding-right: 0.4rem;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
    }

    .shopbox .shoplist .goods .shopcheck img {
        width: .68rem;
        object-fit: cover;
    }

    .shopbox .shoplist .goods .shopmain {
        float: right;
        width: calc(100% - 1rem - 2px);
    }

    .shopmain .shopimg {
        float: left;
        width: 4rem;
        height: 4rem;
        border: 1px solid #e6e6e6;
    }

    .shopmain .shopimg img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .shopmain .shoptext {
        float: right;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        width: calc(100% - 4.5rem);
        /* height:4rem; */
        font-size: 0.62rem;
        line-height: 1.2em;
    }

    .shopmain .shoptext .shopname {
        width: 100%;
        line-height: 1.2em;
        height: calc(2.4em - 1px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .shopmain .shoptext .shopspec {
        position: relative;
    }

    .shopmain .shoptext .shopspec .spec {
        display: flex;
        align-items: center;
        position: relative;
        max-width: calc(100% - .3rem);
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: .49rem;
    }

    .shopmain .shoptext .shopspec .spec i {
        color: #d6d6d6;
        position: absolute;
        right: 0.3rem;
        top: 0;
        line-height: 1.6em;
    }

    .shopdeal {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: space-between;
        justify-content: space-between;
    }

    .shopdeal .money {
        float: left;
        color: #FF6023;
        font-size: .6rem;
    }

    .shopdeal .money i{
        font-size: .5rem;
    }

    .shoptext .delPrice {
        color: #666;
        font-size: .5333rem;
        text-decoration: line-through;
    }

    .isValid {
        display: flex;
        align-items: center;
        font-size: .49rem;
        color: #999999;
    }

    .settlement {
        position: fixed;
        left: 0;
        bottom: 55px;
        width: 100%;
        background: white;
        font-size: 0.65rem;
        border-top: 1px solid #e6e6e6;
    }

    .settlement .all-select{
        width: .85rem;
        object-fit: cover;
        max-height: .85rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: .42rem;
    }

    .settlement .setcheck {
        float: left;
        padding: 0 10px;
        height: 50px;
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
    }

    .settlement .setmoney {
        float: right;
        line-height: 50px;
        padding-right: 0.4rem;
        color:#333;
    }

    .settlement .setmoney span {
        font-size: 0.65rem;
        color: #FF6023;
    }
    .settlement .setmoney span i{
        font-size: .52rem;
    }

    .settlement .setbut {
        float: right;
        min-width: 4.3rem;
        padding: 0 0.5rem;
        line-height: 48px;
        color: white;
        background: #FF6023;
    }

    .nodata {
        overflow: hidden;
        padding: 1rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        color: #ccc;
    }

    /* popup */
    .popup {
        width: 100%;
        height: 70vh;
        top: 30vh !important;
        background: white !important;
    }

    .close {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 1rem;
        color: #999;
    }

    .glode>>>.bottomnav {
        box-shadow: none;
    }

    /*计数器*/
    .numb {
        float: right;
        font-size: 0.6rem;
        width: 7em;
        border: 1px solid #999;
        overflow: hidden;
        text-align: center;
        transform: translateY(-2px);
    }

    .numb .minus {
        float: left;
        width: 1.8em;
        line-height: 1.6em;
        border-right: 1px solid #999;
        color: #999;
    }

    .numb .plus {
        float: right;
        width: 1.8em;
        line-height: 1.6em;
        border-left: 1px solid #999;
        color: #999;
    }

    .numb .numbers {
        float: left;
        font-size: 0.6rem;
        width: calc(100% - 2px - 3.6em);
        line-height: 1.6em;
        color: #333;
        text-align: center;
        font-family:PingFang SC;
        font-weight:400;
    }

</style>
