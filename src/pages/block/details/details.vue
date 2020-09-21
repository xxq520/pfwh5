<template>
    <div class="glode">
        <!--正常-->
        <mt-header fixed title="商品详情" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <!--产品轮播图-->
        <div class="column-img">
            <mt-swipe :auto="5000" :show-indicators="false" @change="handleChange">
                <mt-swipe-item v-for="(item,index) in productImg" :key="index">
                    <img :src="item">
                    <!-- 商品主图视频 -->
                    <img v-show="listData.videoUrl && index==0" @click="playVideo" class="playIcon" :src="require('../../../assets/images/block/icon_live.png')" alt="">
                </mt-swipe-item>
            </mt-swipe>
            <transition name="fade">
                <div v-show="isplayVideo" class="goodsVideo">
                    <div  @click="pauseVideo" class="videoControl">
                        <p>视频播放</p>
                        <i class="el-icon-circle-close"></i>
                    </div>
                    <video id="video" ref="playvideo" class="videoSrc" controls="" preload="auto" data-setup="{}" :src="listData.videoUrl"></video>
                </div>
            </transition>
            <div class="col">{{ imgindex }} / {{ imglist }}</div>
        </div>
        <!--产品信息-->
        <!-- 只有区域批发商及下游商家才会展示商品价格 -->
        <div v-if="blockType==5 || blockType==6" class="product-info">
            <div class="product-name">{{ product.Name }}</div>
            <div class="product-money product-money-1">
                <!-- 下游商家 -->
                <div class="money" v-if="business == 2 || blockType==6">
                    <span ><i>¥</i>{{ (listData.salePrice || 0) | formatPrice }} ({{ (listData.productPackage) }})</span>
                </div>
                <div class="money" v-else>
                    <span ><i>¥</i>{{(listData.platformPrice || 0) | formatPrice }} ({{ (listData.productPackage) }})</span>
                </div>
                <div class="amountMoq"><!--<i>包邮</i>已售1089 | -->起订量{{ countSale(listData.minimumQuantity) }}{{product.Unit}}</div>
            </div>
            <div class="product-money">
                <div class="discount-price">
                    建议零售价：￥{{ (getOperation() == 2 ? (listData.platformLinePrice || 0) :  (listData.retailPrice || 0)) | formatPrice }}/{{product.Unit2}}
                </div>
            </div>
        </div>
        <div v-else class="product-info">
            <div class="product-name">{{ product.Name }}</div>
            <div class="product-money product-money-1">
                <div class="money">
                    <span ><i>¥</i>**.**/{{ product.Unit }}</span>
                </div>
                <div class="amountMoq">起订量{{ countSale(listData.minimumQuantity) }}{{product.Unit}}</div>
            </div>
            <div class="product-money"  >
                <div class="discount-price">
                    建议零售价：<span>￥**.**/{{ product.Unit }}</span>
                </div>
            </div>
        </div>
        <!--产品规格-->
        <div class="spec" @click="spec">
            <div class="spectext" v-if="listData">
                <span>规格</span>
                <p v-if="selectSku.length > 0" v-text="selectSku.join('/')"></p>
                <p v-else>未选择</p>
            </div>
            <i class="el-icon-more"></i>
        </div>
        <div class="information">
            <div class="info-nav">
                <a href="javascript:" :class="{ 'infohover':infonav=='规格参数' }" @click="Parame">规格参数<i></i></a>
                <span>|</span>
                <a href="javascript:" :class="{ 'infohover':infonav=='图文详情' }" @click="graphic">图文详情<i></i></a>
                <span>|</span>
                <a href="javascript:" :class="{ 'infohover':infonav=='购买须知' }" @click="instruct">购买须知<i></i></a>
            </div>
            <!--规格参数-->
            <div class="info-box" v-show="infonav=='规格参数'">
                <table>
                    <tr v-for="(item,index) in parameterList" :key="index">
                        <td style="width:7em;" v-text="item.parameter"></td>
                        <td v-text="item.parameterName"></td>
                    </tr>
                </table>
            </div>
            <!--图文详情-->
            <div class="info-box" v-show="infonav=='图文详情'" v-html="listData.description"></div>
            <!--购买须知-->
            <div class="info-box" v-show="infonav=='购买须知'" v-html="listData.buyingGuide"></div>
        </div>
        <div class="goodsPromissImg" v-if="detail.product.BusinessLicense&&(BusinessLicense||TradeLicense)">
                  <ul class="promissList">
                    <li class="promissTitle">票证单据</li>
                    <li class="promissItem" v-if="BusinessLicense">
                      <img :src="detail.product.BusinessLicense" @error="error(1)">
                    </li>
                    <li class="promissItem" v-if="TradeLicense" @error="error(2)">
                      <img :src="detail.product.TradeLicense">
                    </li>
                  </ul>
        </div>
        <!-- 底部购物车 -->
        <block-shopping-cart
            v-if="(blockType == 5 && business == 1) || blockType == 6"
            :select-sku='selectSku'
            :cur-data="curData"
            ref="cart"
            @open-spec="spec">
        </block-shopping-cart>
        <!--v-if="!blockType"-->
        <mt-popup   v-model="shift" position="bottom" popup-transition="popup-fade" class="popup" >
            <div class="close el-icon-close" @click="close"></div>
            <div style="height: 100%;"> <!-- 规格弹窗 -->
                <detailPopup
                    :shift.sync="shift"
                    :list.sync="listData"
                    :sku-list="skuList"
                    :sku-len="skuLen"
                    @select-over-change="selectOver"
                    @add-cart="addCart"
                    @detail-change="detailfn"
                >
                </detailPopup>
            </div>
        </mt-popup>
        <customer></customer>
        <wholesale-nav v-if="!isMyStore"></wholesale-nav>
    </div>
</template>
<script>
    import Vue from 'vue';
    import wholesaleNav from '@/components/WholesaleNav';
    import detailPopup from './detailPopup';
    import {showToast} from '@/assets/js/common';
    import customer from "@/components/block/customer";
    import shAre from "@/components/share";
    import blockShoppingCart from "@/components/blockShoppingCart"
    export default {
        name:"goodsDetail",
        data() {
            return {
                productImg: new Object(),            // 轮播图
                product: '',               // 产品主信息
                imglist: 1,                          // 轮播图数量显示
                imgindex: 1,                         // 轮播图索引
                shift: false,                        // 显示产品其他规格选择
                strCode: this.$route.query.strCode,  // 单号
                detail: {
                    proStandardJoints: [],
                    listProStandAttached: [],
                    listProductImg: [],
                    product: {}
                },
                listData: new Object(),
                iSeq: '',                            // 商家seq
                infonav: '规格参数',                  // 判断信息导航索引样式
                Parameter: new Object(),             // 规格参数数据
                parameterList:[],  // 规格参数数据
                skuList: [],
                selectSku: [], // 选择的商品Sku数据
                curData: {}, // 选择的商品基础数据
                skuLen: null,
                nums: 1,
                isType: true,
                queryType: false,
                isMyStore: true,
                userType: '',
                Wseq: '',                     //区分查看自己的商品还是其他店铺商品
                shareData: {sites: ['weixin', 'weixintimeline', 'qq', 'qzone']},//分享时的数据
                userBlock: false,//是否是区域批发商身份 true是
                shareIstrue: false,//是否是分享进来的
                wholesaleSeq: '',
                BusinessLicense:true,
                TradeLicense:true,
                blockType:this.$store.state.userInfo.Blocktype,
                userId: this.$store.state.userInfo.userId,
                business: this.$store.state.userInfo.business, // 1角色5买家  2角色5卖家
                userInfo: this.$store.state.userInfo, // 用户信息
                isplayVideo: false
            }
        },
        components: {
            wholesaleNav,
            detailPopup,
            shAre,
            blockShoppingCart,
            customer
        },
        created() {
            console.log(this.blockType,"秀")
            this.iSeq = sessionStorage.seq;
            this.queryType = this.$route.query.type ? true : false;
            let userType = sessionStorage.getItem('userType');
            this.userType = userType;
            var search = window.location.href.split("?")[1];
            var searchData = {};
            var searchArr = search.split("&")
            for (var i = 0; i < searchArr.length; i++) {
                var str = searchArr[i].split("=")
                searchData[str[0]] = str[1];
            }
            this.shareIstrue = searchData.share ? searchData.seq : false
            //如果是分享进入的商品详情页，则从url参数中取得分享者的seq
            if (searchData.share) {
                this.iSeq = searchData.seq
                //商家seq
                this.wholesaleSeq = searchData.wholesaler
            }
        },
        mounted() {
            window.scroll(0, 0);
            $('.column-img .mint-swipe').css('height', $('.column-img').width() + 'px');
            this.getDetailsInfo();
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
            this.$refs.header.$el.style.zIndex = "100"
        },
        filters:{
            formatPrice(val){
                let num = Math.abs(val);
                num = num.toFixed(2);
                return num
            }
        },
        methods: {
            // 播放视频
            playVideo() {
                this.isplayVideo = true;
                this.$refs['playvideo'].play();
            },
            // 暂停视频
            pauseVideo() {
                this.isplayVideo = false;
                this.$refs['playvideo'].pause();
            },
            //分享商品事件
            changeShare() {
                this.$refs.share1.changeShare()
            },
            // 判断图片是否是404
            error(index){
                if (index==1){
                    this.BusinessLicense = false;
                } else {
                    this.TradeLicense = false;
                }
            },
            // 根据角色获取operation
            getOperation() {
                let operation = 3;
                if (this.blockType == 6) {
                    operation = 1
                } else if(this.blockType == 5) {
                    operation = this.business == 1 ? 2 : 1
                }
                return operation;
            },
            // 获取详情信息
            getDetailsInfo() {
                var url = "";
                var that = this;
                var wholesaleSeq = this.$route.query.wholesaleSEQ;
                if (this.queryType) {
                    this.isType = false;
                    $('.glode').css('padding-bottom', '0'); // 去底部多余空位
                    url = this.MS + '/Product/GetDHProductDetailsInfo?strCode=' + this.strCode + '&wholesaleSeq=' + wholesaleSeq;
                }
                url = this.blockURL + '/qypfs-product/admin/mobile/product/buying/detail';
                let param = {
                    id: this.strCode,
                    operation: this.getOperation(),
                    userId: this.$store.state.storeId
                }
                if (this.blockType == 6) param.downstreamId = this.userId; // 下游商家特殊价格需求
                axios.post(url,param).then(res => {
                    if (res.data.code == 200) {
                        console.log('buying/detail==',res);
                        let data = res.data.data;

                        this.listData = data;
                        this.product = {
                            Name: data.name,
                            Unit: data.unit,
                            Unit2: data.unit2,
                        }

                        this.productImg = data.imgList;
                        this.parameterList = data.parameterList;
                        this.imglist = this.productImg ? this.productImg.length : 0;

                        let skuList = data.skuList;
                        let skuLen = null;
                        skuList.forEach(item => {
                            item.check = {};
                            skuLen = item.skuPropertyInfoList.length;
                            item.skuPropertyInfoList.forEach(obj => {
                                item.check[obj.propertyName] = obj.propertyValueName;
                            });
                        });
                        this.skuList = skuList;
                        this.skuLen = skuLen;
                        this.Parame();
                    } else {
                        showToast(res.data.message || '系统错误，请稍后再试!')
                    }
                });
            },
            countSale(count) {
                let countext = count;
                if (count / 10000 >= 1 && count / 1000000 < 1) {
                    countext = Math.round(count / 10000) + '万';
                } else if (count / 1000000 >= 1 && count / 10000000 < 1) {
                    countext = Math.round(count / 1000000) + '百万';
                } else if (count / 10000000 >= 1 && count / 100000000 < 1) {
                    countext = Math.round(count / 10000000) + '千万';
                } else if (count / 100000000 >= 1) {
                    countext = Math.round(count / 100000000) + '亿';
                }
                ;
                return countext;
            },
            back() {
                this.$router.back(-1);
            },
            handleChange(val) {
                this.imgindex = val + 1;
            },
            spec() {
                //是否是 总部统筹官、新发展商、发展商  统筹官身份 如果是则不展示选择规格
                if([5, 6].indexOf(Number(this.blockType)) == -1){
                    return false
                } else {
                    this.shift = true;
                }
            },
            close() {
                this.shift = false;
            },
            detailfn(val) {
                this.shift = val;
            },
            // 规格产品
            listDatafn(val) {
                console.log(val,6666666);
                this.listData = val;
            },
            // 购买数量
            num(val) {
                this.nums = val;
            },
            shopMai(val) {
                this.shift = val;
            },
            // 规格参数
            Parame() {
                this.infonav = '规格参数';
            },
            // 图文详情
            graphic() {
                this.infonav = '图文详情';
                $('.info-box').eq(1).html(this.product.Description);
            },
            // 购买须知
            instruct() {
                this.infonav = '购买须知';
                if (this.product.BuyersGuide) {
                    $('.info-box').eq(2).html(this.product.BuyersGuide);
                }
            },
            // 选择规格回调
            selectOver(data,data2) {
                console.log(data, data2, '选择完毕');
                this.selectSku = Object.values(data);
                this.curData = data2;
            },
            // 加入购物车
            addCart(selectSku, curData) {
                console.log('addCart', selectSku, curData);
                let params = {
                    productId: Number(this.strCode),
                    productNumber: Number(selectSku.num),
                    skuId: Number(curData.skuId),
                    status: 1,
                    username: Number(this.$store.state.userInfo.username)
                }
                if(this.blockType == 6) {  // 下游商家需要传区域批发商id
                    params.wholesalerId = Number(this.$store.state.storeId);
                }
                axios.post(this.blockURL + '/qypfs-cart/cart/addCart',params).then(res => {
                    console.log(res, '==addCart');
                    if (res.data.code == 200) {
                        showToast('添加成功');
                        this.$refs.cart.findCart();
                    } else {
                        showToast(res.data.message || '系统错误')
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .videoControl{
        height:1.23rem;
        background:rgba(154,154,154,1);
        position: absolute;
        top: -1;
        z-index: 13;
        color: #fff;
        width: 100%;
        line-height: 1.23rem;
    }
    .videoControl p{
        text-align: center;
        font-size:0.55rem;
        font-family:PingFang SC;
        font-weight:400;
    }
    .videoControl i{
        margin-top: -1rem;
        margin-right: 0.3rem;
        font-size: 0.9rem;
        float: right;
    }
    .goodsVideo{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        z-index: 12;
    }
    img.playIcon{
        width: 2.96rem !important;
        height: 2.96rem !important;
        position: absolute;
        z-index: 10;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .goodsVideo video{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 12;
    }
    .glode {
        padding-bottom: 65px;
    }

    .column-img {
        position: relative;
        margin-top: 44px;
    }

    .column-img img {
        display: block;
        height: 100%;
    }

    .col {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background: rgba(0, 0, 0, 0.4);
        color: white;
        border-radius: 5rem;
        padding: 0.1rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .discount-price {
        font-size: 0.542rem;
        color: #666666;
    }
    .product-info {
        overflow: hidden;
        padding: 0.6rem 10px;
        background-color: white;
        border-bottom: 1px solid #e4e5e9;
        position: relative;
    }

    .product-info .product-name {
        overflow: hidden;
        font-size: 0.75rem;
        line-height: 1.4em;
    }

    .share {
        margin-top: 1px
    }

    .share img {
        width: 0.8rem;
        height: 0.8rem;
    }
    .product-info .product-money{
        overflow: hidden;
    }

    .product-info .product-money-1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: .32rem;
    }

    .product-info .product-money .money {
        float: left;
        font-size: .8rem;
        color: #FF6023;
        line-height: 1.2em;
    }

    .product-info .product-money .money i {
        font-size: 0.53rem;
        margin-right: 3.6px;
    }

    .product-info .product-money .amountMoq {
        float: right;
        font-size: 0.542rem;
        color: #666666;
    }

    .product-info .product-money .amountMoq i {
        display: inline-block;
        font-size: 0.6rem;
        color: #ff0025;
        background: #f1f2f5;
        padding: 0 0.1rem;
        border-radius: 3px;
        border: 1px solid #ff0025;
        margin-right: 0.2rem;
        line-height: 1.2em;
    }

    .spec {
        overflow: hidden;
        margin-bottom: 0.5rem;
        background: white;
        padding: 0.6rem 10px;
        font-size: 0.65rem;
        line-height: 1.6em;
    }

    .spec .spectext {
        float: left;
    }

    .spec .spectext span {
        float: left;
        color: #666666;
        padding-right: 0.4rem;
        font-size: .583rem;
    }

    .spec .spectext p {
        float: left;
        width: 15em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: .583rem;
        color: #333333;
    }

    .spec .el-icon-more {
        float: right;
        color: #666;
        font-size: 0.8rem;
    }

    .information {
        overflow: hidden;
        background: white;
    }

    .information .info-nav {
        overflow: hidden;
        border-bottom: 1px solid #e4e5e9;
        text-align: center;
        font-size: 0.8rem;
    }

    .information .info-nav {
        overflow: hidden;
        border-bottom: 1px solid #e4e5e9;
        text-align: center;
        font-size: 0.72rem;
        line-height: 3em;
    }

    .information .info-nav a {
        display: inline-block;
        position: relative;
        color: #333333;
    }

    .information .info-nav a.infohover {
        color: #FF6023;
        font-size: .71rem;
    }

    .information .info-nav a.infohover i {
        position: absolute;
        width: 100%;
        height: 2px;
        background: #FF6023;
        left: 0;
        bottom: 0;
    }

    .information .info-nav span {
        padding: 0 0.5rem;
        color: #e4e5e9;
    }

    .info-box {
        overflow: hidden;
        padding: 10px;
        background: white;
        font-size: .625rem;
    }

    .info-box img {
        display: block;
    }

    .info-box table {
        width: 100%;
        line-height: 1.2em;
        color: #666;
        font-size: .625rem;
    }

    .info-box table td {
        vertical-align: top;
        padding: 0.4em;
    }

    .info-box .txtHeader {
        width: 100%;
        color: #212121;
        padding-left: 1rem;
    }

    .info-box .txtContent {
        padding: .4rem 0;
        border: 1px dashed #e2e2e2;
        margin: .4rem 0;
        background: rgb(245, 245, 245);
    }

    /* popup */
    .popup {
        width: 100%;
        height: 60vh;
        background: white !important;
    }

    .close {
        position: absolute;
        right: 0.6rem !important;
        top: 0.6rem !important;
        font-size: 1rem;
        color: #999;
    }

    /*票证单据*/
    .promissList {
        background: #fff;
    }

    .promissTitle {
        margin-top: 0.4444rem;
        text-align: center;
        height: 1.3333rem;
        line-height: 1.3333rem;
        font-size: 0.6222rem;
        border-bottom: 1px solid #e4e5e9;
    }

    .promissItem {
        padding: 0 0.4444rem;
        margin: 0.4444rem 0;
    }
</style>
