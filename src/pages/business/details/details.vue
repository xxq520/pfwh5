<template>
    <div class="glode">
        <!--正常-->
        <mt-header title="商品详情">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
            <mt-button slot="right">
                <!-- 如果是区域批发商和区域批发商分享进入的用户才展示分享按钮 -->
                <!--v-if="userBlock||shareIstrue"-->
                <!--<div class="share" @click="changeShare" >-->
                  <!--<img src="../../../assets/images/fenxian.png" alt="">-->
                <!--</div>-->
            </mt-button>
        </mt-header>
        <!--产品轮播图-->
        <div class="column-img">
            <mt-swipe :auto="5000" :show-indicators="false" @change="handleChange">
                <mt-swipe-item v-for="(item,index) in productImg" :key="index"><img :src="item.ProductImgUrl">
                </mt-swipe-item>
            </mt-swipe>
            <div class="col">{{ imgindex }} / {{ imglist }}</div>
        </div>
        <!--产品信息-->
        <div class="product-info">
            <div class="product-name">{{ product.Name }}</div>
            <div class="product-money">
                <div class="money" v-if="listData">
                    <span
                        v-if="listData['StandardName1']"><i>¥</i>{{ isBlockTypeList?"**.**":listData.DisCountPrice || listData.ShopPrice}}</span>
                    <span v-else style="font-size:0.65rem;">该产品部分信息不完整</span>
                </div>
                <div class="amountMoq"><!--<i>包邮</i>已售1089 | -->起订量{{ countSale(listData.Moq) }}{{product.Unit}}</div>
            </div>
            <div class="product-money" v-if="blockType&&blockType!=5">
                <div class="discount-price">
                    全国统一零售价：<del>￥**.**</del>
                </div>
            </div>
            <div class="product-money" v-else>
                <div class="discount-price">
                    全国统一零售价：<del>￥{{ detail.listProStandAttached[0] && detail.listProStandAttached[0].WholesalePrice }}</del>
                </div>
            </div>
        </div>
        <!--产品规格-->
        <div class="spec" @click="spec">
            <div class="spectext" v-if="listData">
                <span>已选</span>
                <p v-if="listData['StandardName1']"><i v-for="(item,index) in detail.proStandardJoints" :key="index">{{item.ParamterName+"："}}{{
                    listData['StandardName'+(index+1)]+' ' }}</i></p>
                <p v-else>无</p>
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
                    <tr v-for="(post,index) in Parameter" :key="index" v-if="post.PDName != '-1' ">
                        <td style="width:7em;">{{post.PName}}</td>
                        <td>{{post.PDName}}</td>
                    </tr>
                </table>
            </div>
            <!--图文详情-->
            <div class="info-box" v-show="infonav=='图文详情'"></div>
            <!--购买须知-->
            <div class="info-box" v-show="infonav=='购买须知'">
                <div class="txtHeader">正品保障</div>
                <div class="txtContent">
                    520批发网商品品质保证,100%正品。
                </div>
                <div class="txtHeader">服务保证</div>
                <div class="txtContent">
                    520批发网为您提供"专业质检""严选品牌商"等服务,让您轻松进货赚钱有保障。
                </div>
                <!--    <div class="txtHeader">发货时间</div>
                    <div class="txtContent">
                      买家付款成功后的36小时内完成发货,一般配送时间在1-3天。
                    </div>-->
                <div class="txtHeader">商品运费</div>
                <div class="txtContent">
                    520批发网价格最优,运费按订单量多少来选择运输方式，运费需自理。
                </div>
                <!--       <div class="txtHeader">七天退换</div>
                       <div class="txtContent">
                         用户自收到520批发网商品之日起,在保证商品不影响第二次销售的前提下, 7天内可享受无理由退换货(秒杀/活动商品除外)。
                       </div>-->
                <div class="txtHeader">退货运费</div>
                <div class="txtContent">
                    非产品质量问题不能退货;如产品质量有问题,由供货商承担运费,买家先垫付邮费,待确认收货后联系平台客服处理退货运费。
                </div>
                <div class="txtHeader">退款手续费</div>
                <div class="txtContent">
                    您发起的退款申请将会产生1%的银行退款手续费,因商品质量问题发起的退货退款,该项费用将由厂家承担。
                </div>
            </div>
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
        <shoppingCart :iSeq="iSeq" :Wseq="Wseq" :wholesaleSeq="wholesaleSeq" :ApplyStatus="ApplyStatus"
                      :shop.sync="shift"
                      :cartList="cartnum" @shopMai-change="shopMai" v-if="isMyStore&&blockType==5" v-show="isType"></shoppingCart>
        <!--v-if="!blockType"-->
        <mt-popup   v-model="shift" position="bottom" popup-transition="popup-fade" class="popup" >
            <div class="close el-icon-close" @click="close"></div>
            <div >
                <detailPopup  :ApplyStatus="ApplyStatus" :isMyStore="isMyStore" :isType.sync="isType" :shift.sync="shift"
                              :detail.sync="detail" @detail-change="detailfn" @listData-change="listDatafn" @num-change="num"
                              @cart-change="cartChange" ></detailPopup>
            </div>
        </mt-popup>
        <kf-con></kf-con>
        <wholesale-nav v-if="!isMyStore"></wholesale-nav>
        <!--<sh-are ref="share1" :shareData="shareData" :key="Math.random()"></sh-are>-->
    </div>
</template>
<!--<script src=""></script>-->
<script>
    import Vue from 'vue';
    import wholesaleNav from '@/components/WholesaleNav';
    import detailPopup from './detailPopup';
    import {showToast} from '../../../assets/js/common';
    import kfCon from "@/components/KF53";
    import shAre from "@/components/share"
    export default {
        name:"goodsDetail",
        data() {
            return {
                ApplyStatus: '',
                productImg: new Object(),            // 轮播图
                product: new Object(),               // 产品主信息
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
                nums: 1,
                isType: true,
                queryType: false,
                cartnum: 0,
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
                isBlockTypeList:false, //是否是 总部统筹官、新发展商、发展商  统筹官身份 如果是则不展示价格
            }
        },
        components: {
            wholesaleNav,
            kfCon,
            detailPopup,
            shAre,
        },
        created() {
            if (this.$store.state.userInfo.Blocktype&&this.$store.state.userInfo.Blocktype!=5){
                this.isBlockTypeList = true
            }
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

        },
        methods: {
            // 资金入驻状态
            getApplyStatus(seq) {
                axios.get(this.URL + '/User/GetEnterMessage', {params: {seq: seq}})
                    .then((res) => {
                        this.ApplyStatus = res.data.applyStatus;
                        if (this.ApplyStatus != '05') {
                            if (this.Wseq != this.iSeq) {
                                if (!this.queryType && !this.shareIstrue) {
                                    showToast('您的上游批发商正在进行资金账户安全认证，银行审核通过后才可进行交易。请谅解，谢谢！');
                                }
                            }
                        }
                    })
            },
            //分享商品事件
            changeShare() {
                this.$refs.share1.changeShare()
                // console.log(this.$refs.share)
            },
            // 判断图片是否是404
            error(index){
                if (index==1){
                    this.BusinessLicense = false;
                } else {
                    this.TradeLicense = false;
                }
            },
            // 获取详情信息
            getDetailsInfo() {
                var url = '';
                var that = this;
                var wholesaleSeq = this.$route.query.wholesaleSEQ;
                if (this.queryType) {
                    this.isType = false;
                    $('.glode').css('padding-bottom', '0'); // 去底部多余空位
                    // url = this.PRODUCT + '/Product/GetDHProductDetailsInfo?strCode='+this.strCode;
                    url = this.MS + '/Product/GetDHProductDetailsInfo?strCode=' + this.strCode + '&wholesaleSeq=' + wholesaleSeq;
                } else {
                    this.isType = true;
                    //如果当前页面找不到商家的seq则在分享当中的商家seq
                    url = this.URL + '/Product/GetProductDetailsInfo?strCode=' + this.strCode + '&iSeq=' + this.iSeq + '&wholesaleSeq=' + (wholesaleSeq || this.wholesaleSeq || this.iSeq);
                }
                //判断如果是登录的区域批发商的身份则加加上字段
                if (this.userBlock) {
                    url += '&wholesalerType=2'
                } else {
                    url += '&wholesalerType=0'
                }
                axios.get(url).then(res => {
                    let data = res.data.Resultdata;
                    this.product = data.product;
                    this.Wseq = data.product.SEQ;
                    // this.getApplyStatus(this.Wseq);
                    this.checkUserType();
                    if (!this.blockType) {
                        sessionStorage.setItem('Wseq', this.Wseq);
                    }
                    this.productImg = data.listProductImg;
                    this.imglist = this.productImg ? this.productImg.length : 0;
                    for (let i in this.detail) {
                        this.detail[i] = data[i];
                    }
                    // 判断图片是否是404
                    if(!data.product.BusinessLicense){
                        this.BusinessLicense = false;
                    }
                    if(!data.product.TradeLicense){
                        this.TradeLicense = false;
                    }
                    //规格参数
                    this.Parameter = data.listProParameter;
                    this.Parame();
                    //初始化分享内容
                    var shareObj = {
                        // 分享的链接，默认使用location.href
                        url: location.origin + location.pathname + `#/details?strCode=${this.strCode}&wholesaler=${this.wholesaleSeq || this.iSeq}&share=true&seq=${this.iSeq}`,
                        // 分享的标题，默认使用document.title
                        title: "520批发网花更少的钱，买更优质的商品",
                        // 分享的摘要，默认使用<meta name="description" content="">content的值
                        digest: data.product.Name,
                        // 分享的图片，默认获取本页面第一个img元素的src
                        pic: this.product.PriductImg,
                        // 默认显示的网站为以下六个个,支持设置的网站有
                        // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                        sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                    }
                    this.shareData = shareObj
                });
            },
            // 检测店铺批发商是否通过银行审核
            // testingWholesale(){
            //   axios.get(this.URL+'/User/GetEnterMessage',)
            // },
            // 检查是否是批发商
            checkUserType() {
                if ((this.userType == 2 || this.userType == 7) && this.iSeq == this.Wseq) {
                    // console.log(123);
                    this.isMyStore = false;
                } else {
                    // console.log(321);
                    this.isMyStore = true;
                }
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
                if (this.isBlockTypeList){
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
                this.listData = val;
            },
            // 购买数量
            num(val) {
                this.nums = val;
            },
            cartChange(val) {
                this.cartnum = val;
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
            }
        }
    }
</script>
<style scoped>

    .glode {
        padding-bottom: 65px;
    }

    .column-img {
        position: relative;
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
        padding: 0.2rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .discount-price {
        color: #7d7d7d;
        font-size: .65rem;
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
        margin-bottom: 0.4rem;
        padding-right: 1.3rem;
    }

    .share {
        margin-top: 1px
    }

    .share img {
        width: 0.8rem;
        height: 0.8rem;
    }

    .product-info .product-money {
        overflow: hidden;
    }

    .product-info .product-money .money {
        float: left;
        font-size: 1rem;
        color: #ff0025;
        line-height: 1.2em;
    }

    .product-info .product-money .money i {
        font-size: 0.7rem;
    }

    .product-info .product-money .amountMoq {
        float: right;
        font-size: 0.65rem;
        color: #717171;
        padding-top: 0.24rem;
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
        color: #7d7d7d;
        padding-right: 0.4rem;
    }

    .spec .spectext p {
        float: left;
        width: 15em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        color: black;
    }

    .information .info-nav a.infohover {
        color: #db0020;
    }

    .information .info-nav a.infohover i {
        position: absolute;
        width: 100%;
        height: 2px;
        background: #db0020;
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
        font-size: 0.65rem;
    }

    .info-box img {
        display: block;
    }

    .info-box table {
        width: 100%;
        line-height: 1.2em;
        color: #333;
        font-size: 0.65rem;
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
        height: 70vh;
        background: white !important;
    }

    .close {
        position: absolute;
        right: 10px !important;
        top: 10px !important;
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
