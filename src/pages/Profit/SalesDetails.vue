<template>
    <div class="sale-details">
        <mt-header title="销售报表" fixed>
            <!-- <router-link to="/wholesale/myProfit" > -->
                <mt-button icon="back" slot="left" @click="backTo"></mt-button>
            <!-- </router-link> -->
            <!-- <router-link to="/wholesale/capitalDetails" slot="right">明细</router-link> -->
        </mt-header>
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" class="loadmore" :class="{'overflows':allLoaded}">
            <div class="header-con">
                <div class="select-con">
                    <p class="select-text" @click="showSelect">{{tableValue}}</p>
                    <ul class="select-list" v-show="isShow">
                        <li class="select-item" v-for="(item,i) in tabList" :key="i" @click="selectTable(item.id,item.text)">{{item.text}}</li>
                    </ul>
                </div>
                <p class="company">总金额(元)</p>
                <p class="price">{{TotalAmount}}</p>
                <div class="show-desc">
                    <div class="show-con">
                        <p>已结算金额(元)</p>
                        <p class="show-price">{{SettledAmount}}</p>
                    </div>
                    <div class="show-con">
                        <p>未结算金额(元)</p>
                        <p class="show-price">{{UnsettledAmount}}</p>
                    </div>
                </div>
            </div>
            <div class="slide-con" v-if="previewList.length">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in previewList" :key="index">
                            <div class="slides-con">
                                <h3 class="title">{{item.type}}数据</h3>
                                <div class="slide-list">
                                    <div class="slide-item">
                                        <p class="slide-title">昨日已结算</p>
                                        <p class="slide-profit">￥{{item.Up_settledAmounts}}</p>
                                    </div>
                                    <div class="slide-item">
                                        <p class="slide-title">昨日未结算</p>
                                        <p class="slide-profit">￥{{item.Up_unsettledAmounts}}</p>
                                    </div>
                                    <div class="slide-item">
                                        <p class="slide-title">昨日销售总额</p>
                                        <p class="slide-profit">￥{{item.Up_totalAmounts}}</p>
                                    </div>
                                    <div class="slide-item">
                                        <p class="slide-title">{{item.type}}已结算</p>
                                        <p class="slide-profit">￥{{item.Now_settledAmounts}}</p>
                                    </div>
                                    <div class="slide-item">
                                        <p class="slide-title">{{item.type}}未结算</p>
                                        <p class="slide-profit">￥{{item.Now_unsettledAmounts}}</p>
                                    </div>
                                    <div class="slide-item">
                                        <p class="slide-title">{{item.type}}销售总额</p>
                                        <p class="slide-profit">￥{{item.Now_totalAmounts}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-con" v-if="PlayType != 0">
                <p class="tab-item" :class="HKJSType == 1?'cur':''" @click="HKJSTypeSelect(1)">已结算</p>
                <p class="tab-item" :class="HKJSType == 0?'cur':''" @click="HKJSTypeSelect(0)">未结算</p>
            </div>
            <div class="goods-list">
                <div class="goods-item" v-for="(items,index) in orderList" :key="index">
                    <p class="order-title"><span class="order-code">订单号：{{items.salenumber}}</span><span class="order-status" v-if="items.PlayType == 1">{{items.HKJSType==1?"已结算":"未结算"}}</span></p>
                    <div class="goods-info" v-for="(item,i) in items.ordersdtl" :key="i">
                        <router-link :to="{ path: '/orderDetails', query: {orderCode:item.salenumber,seq:item.SEQ}}" class="links">
                            <div class="con-left">
                                <div class="img-box">
                                    <img :src="item.ProductImg" alt="">
                                </div>
                                <div class="goods-desc">
                                    <p class="goods-title">{{item.name}}</p>
                                    <p class="goods-company">{{item.other1Name}}</p>
                                </div>
                            </div>
                            <div class="con-right">
                                <p class="goods-price">￥{{item.dlprice.toFixed(2)}}</p>
                                <p class="goods-num">x{{item.buycount}}</p>
                                <p class="goods-total">总金额￥{{item.TatolPrice.toFixed(2)}}</p>
                            </div>
                        </router-link>
                    </div>
                    <div class="goods-bottom">
                        <p class="bottom-price-box">共{{items.TotalBuyCount}}件商品，合计
                            <span class="bottom-price">{{items.TotalPaymentAmount.toFixed(2)}}元</span>
                            <!-- <span class="yunfei">(含运费：￥14.9)</span> -->
                        </p>
                        <p>支付方式：{{items.PlayType == 0?"线下支付":"银联支付"}}</p>
                        <p>下单时间：{{items.ordertime.replace("T"," ").substring(0,19)}}</p>
                    </div>
                </div>
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { Swiper } from 'vue-awesome-swiper'
    export default {
        data () {
            return {
                allLoaded:false,
                tabList:[{id:-1,text:"全部"},{id:0,text:"线下支付"},{id:1,text:"银联支付"}],
                tableValue:"全部",
                isShow:false,   //下拉显示
                PlayType:-1,    //支付类型(-1 全部 / 0 线下 / 1 银联)
                HKJSType:1,     //结算类型
                previewList:[],//预览数据
                orderList:[],   //订单列表
                SettledAmount:"",    //已结算金额
                TotalAmount:"",     //总金额
                UnsettledAmount:"",     //未结算金额
                pages:1,     //当前页数
                totalPage:1,     //总页数
            }
        },
        mounted(){
            this.getData();
            // this.StatisticsSlide();
        },
        components:{Swiper},
        methods:{
            // 下拉选择支付方式
            showSelect(){
                this.isShow = !this.isShow;
            },
            // 选择支付类型
            selectTable(id,value){
                this.tableValue = value;
                this.PlayType = id;
                this.HKJSType = 1;
                this.isShow = false;
                this.pages = 1;
                this.orderList = [];
                this.getData(1);
            },
            HKJSTypeSelect(index){
                this.HKJSType = index;
                this.pages = 1;
                this.orderList = [];
                this.getData(1);
            },
            // 数据统计滑动
            StatisticsSlide(){
                new Swiper('.swiper-container', {
                    watchSlidesProgress: true,
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    loop: true,
                    loopedSlides: 5,
                    autoplay: false,
                    on: {
                        progress: function(progress) {
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide = this.slides.eq(i);
                                var slideProgress = this.slides[i].progress;

                                if (Math.abs(slideProgress) > 1) {
                                    var modify = (Math.abs(slideProgress) - 1) * 0.4 + 1;
                                }
                                var translate = slideProgress * modify * 168 + 'px';
                                var scale = 1 - Math.abs(slideProgress) / 7;
                                var zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                                slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                                slide.css('zIndex', zIndex);
                                slide.css('opacity', 1);
                                if (Math.abs(slideProgress) > 3) {
                                    slide.css('opacity', 0);
                                }
                            }
                        },
                        setTransition: function(transition) {
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide = this.slides.eq(i)
                                slide.transition(transition);
                            }
                        }
                    }
                })
            },
            // 获取数据
            getData(down){
                var that = this;
                this.allLoaded = true;
                this.previewList=[];
                if(this.pages > this.totalPage) return;
                let paramsValue = {
                    queryJson:{
                        PlayType:this.PlayType,
                        HKJSType:this.HKJSType
                    },
                    WholeSaleSeq:sessionStorage.getItem("seq"),
                    page:this.pages,
                    row:10
                }
                axios.get(this.URL + "/OrderNewListInfo/GetWholesSalesReport",{params:paramsValue})
                .then(res => {
                    if(res.data.code == 200){
                        this.orderList = this.orderList.concat(res.data.data.Orderdata);
                        this.SettledAmount = res.data.data.SettledAmount.toFixed(2);
                        this.TotalAmount = res.data.data.TotalAmount.toFixed(2);
                        this.UnsettledAmount = res.data.data.UnsettledAmount.toFixed(2);
                        this.totalPage = res.data.data.totalPage,
                        this.previewList = res.data.data.TotalSettlemoneyList;
                        this.pages++;
                        this.allLoaded = false;
                        if(res.data.data.Orderdata.length == 0){
                            this.pages = 1;
                            this.allLoaded = true;
                        }
                        // if(!down){
                            setTimeout(that.StatisticsSlide,100);
                        // }
                    }
                })
                .catch(res => {

                })
            },
            // 加载更多
            loadBottom(){
                this.getData(1);
            },
            // 返回
            backTo(){
                // try{
                //     window.action.app_back();
                // }catch(err){
                    this.$router.push("/wholesale/myProfit?seq="+sessionStorage.getItem("seq"))
                // }
            }
        }
    }
</script>
<style>
    /* body{
        background-color:#f5f5f5;
    } */
    .sale-details .loadmore{
        /* height:11.1111rem; */
        /* padding-top:44px; */
        -webkit-overflow-scrolling: touch;
        overflow:scroll;
    }
    .sale-details .overflows{
        overflow:hidden;
    }
    .sale-details .header-con{
        position:relative;
        margin-top:44px;
        text-align:center;
        background-color:#ef4628;
        color:#fff;
        height:7rem;
        padding-top:0.8889rem;
    }
    .sale-details .header-con .select-con{
        position:absolute;
        top:.8889rem;
        right:.5333rem;
        font-size:.6222rem;
        width:3.3333rem;
    }
    .sale-details .header-con .select-text{
        position:relative;
        padding-right:.5rem;
    }
    .sale-details .header-con .select-text:after{
        display:block;
        content:"";
        position:absolute;
        right:0;
        top:50%;
        margin-top:-.15rem;
        width:0;
        height:0;
        border-width:.3rem .3rem 0;
        border-style:solid;
        border-color:#fff transparent transparent;
    }
    .sale-details .header-con .select-list{
        background-color:#fff;
        color:#333;
        border-radius:3px;
        padding:.3rem 0;
    }
    .sale-details .header-con .select-item{
        line-height:1.4rem;
    }
    .sale-details .header-con .company{
        font-size:.6222rem;
    }
    .sale-details .header-con .price{
        font-size:1.5556rem;
        margin-bottom:.4rem;
    }
    .sale-details .header-con .show-desc{
        display:flex;
        justify-content: space-between;
        font-size:.5333rem;
        text-align: center;
    }
    .sale-details .header-con .show-desc .show-con{
        flex:1;
    }
    .sale-details .header-con .show-desc .show-price{
        font-size:.8rem;
    }
    .sale-details .tab-con{
        display:flex;
        justify-content: space-between;
        background-color:#fff;
        color:#666;
        text-align:center;
        font-size:.7111rem;
        border-bottom:1px solid #eee;
    }
    .sale-details .tab-con .tab-item{
        position:relative;
        flex:1;
        height:1.9556rem;
        line-height:1.9556rem;
    }
    .sale-details .tab-con .tab-item:first-child::after{
        display:block;
        content:"";
        position:absolute;
        right:0;
        top:50%;
        height:1rem;
        width:.0222rem;
        background-color:#ddd;
        margin-top:-.5rem;
    }
    .sale-details .tab-con .cur{
        color:#ef4628;
    }
    .sale-details .goods-item{
        margin-bottom:.4444rem;
        background-color:#fff;
        /* border-bottom:.0222rem solid #ccc; */
    }
    .sale-details .goods-item .order-title{
        display:flex;
        justify-content: space-between;
        font-size:.5778rem;
        color:#666;
        padding:.7111rem .5333rem;
        /* border-bottom:.0222rem solid #ccc; */
    }
    .sale-details .goods-item .order-status{
        color:#ef4628;
    }
    .sale-details .goods-item .goods-info{
        padding:0 .5333rem;
        background-color:#f9f9f9;
    }
    .sale-details .goods-item .links{
        display:flex;
        justify-content: space-between;
        color:#666;
        font-size:.5333rem;
        padding:.4444rem 0;
    }
    .sale-details .goods-item .con-left{
        display:flex;
    }
    .sale-details .goods-item .goods-desc{
        width:7rem;
    }
    .sale-details .goods-item .img-box{
        width:3.3333rem;
        height:3.3333rem;
        margin-right:.4444rem;
    }
    .sale-details .goods-item .goods-title,
    .sale-details .goods-item .goods-price{
        font-size:.7111rem;
        color:#333;
        padding-top:.3rem;
        margin-bottom:.2rem;
    }
    .sale-details .goods-item .goods-title{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .sale-details .goods-item .con-right{
        text-align:right;
    }
    .sale-details .goods-item .goods-num{
        margin-bottom:.2rem;
    }
    .sale-details .goods-bottom{
        font-size:.5778rem;
        color:#666;
        text-align:right;
        padding:.3rem .5333rem;
        line-height:1rem;
    }
    .sale-details .goods-bottom .bottom-price-box{
        color:#333;
        font-size:.6222rem;
    }
    .sale-details .goods-bottom .bottom-price{
        color:#ff0025;
        font-size:.8rem;
    }
    .sale-details .goods-bottom .yunfei{
        color:#666;
        font-size:.5778rem;
    }
    .sale-details .slide-con{
        padding:0 .5333rem;
        background-color:#fff;
        margin-bottom:.4444rem;
    }
    .sale-details .swiper-container{
        padding:.6667rem 0;
        background-color:#fff;
    }
    .sale-details .swiper-slide{
        width:13.3556rem;
        font-size:.4889rem;
        background-color:#fff;
    }
    .sale-details .slides-con{
        padding: .4444rem .5333rem;
        box-shadow: 0 0 .2222rem #888888;
        border-radius:5px;
    }
    .sale-details .slide-list{
        display:flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .sale-details .slide-item{
        /* padding:.3333rem; */
        width:3.8444rem;
        height:2.4222rem;
        border:1px solid #e5e5e5;
        border-radius:5px;
        margin-bottom:.3333rem;
        text-align:center;
    }
    .sale-details .slide-item .slide-title{
        padding-top:.3333rem;
    }
    .sale-details .slide-item .slide-profit{
        font-size:.5333rem;
        font-weight:500;
        padding-top:.2222rem;
    }
    .sale-details .swiper-slide .title{
        font-size:.6667rem;
        color:#090909;
        margin-bottom:.5333rem;
    }
</style>
