<template>
    <div class="myorder" >
        <div class="fixtop">
            <!-- <topnav :top='topnav'></topnav> -->
            <mt-header :title="topnav.title" fixed ref="header">
                <mt-button v-if="blockLimit" @click="goBack" slot="left" icon="back"></mt-button>
                <span class="orderTypeTab" slot="right" v-if="userType == 2||userType == 3||userType == 7||userType == 8">
                    <router-link :class="activeType?'activeType':''" to="/wholesale/orderManagement">卖单</router-link>
                    <router-link :class="activeType?'':'activeType'" to="/myorder">买单</router-link>
                </span>
            </mt-header>
            <!-- 滑动菜单栏 -->
            <div class="topwrap">
                <div class="topnav" >
                    <ul>
                        <li id="all" class="lihover" title="tab0" @click="changeState($event,0)">全部订单<i></i></li>
                        <li class="tab1" @click="changeState($event,1)">待支付<i></i></li>
                        <li title="tab3" @click="changeState($event,3)">待发货<i></i></li>
                        <li title="tab2" @click="changeState($event,2)">待收货<i></i></li>
                        <li title="tab4" @click="changeState($event,4)">退货/退款<i></i></li>
                        <li title="tab7" @click="changeState($event,7)">待结算<i></i></li>
                        <li title="tab5" @click="changeState($event,5)">已完成<i></i></li>
                    </ul>
                </div>
                    <!-- 筛选 -->
                    <!-- <div class="filter" @click="showfilter">
                        <img src="../../assets/images/filter.png" alt=""> 筛选
                    </div> -->
                    <div class="filterBox" v-if="!blockLimit">
                        <span class="filterBtn" @click="showfilter">
                            <img src="../../assets/images/filter.png"> 筛选
                        </span>
                    </div>
            </div>
        </div>
        <mt-loadmore :top-method="loadTop" ref="loadmore">
            <div class="exitGood" v-if="orderStatus==4||orderStatus==8||orderStatus==9">
                <div :class="{'activGood':exitGood==9}" @click="changeExitGood(9)">已退款</div>
                <div :class="{'activGood':exitGood==8}" @click="changeExitGood(8)">未退款</div>
            </div>
            <div id="main" v-show="prodblur">
                <!-- 全部订单 -->
                <div id="tab0"  class="statecontent showcontent">
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                            <!-- <span class="changestate" v-if="item.gjType == 1">{{item.gjState == 0?'申请改价中':item.gjState == 1?'改价通过':'改价未通过'}}</span> -->
                            <span class="changestate" v-if="item.TYN == 0">
                                {{item.YN == 1 && item.gjState == 0 && item.gjType == 1 ? '申请改价中' : item.YN == 1 && item.gjState == 1 && item.gjType == 1 ? '改价通过' : item.YN == 1 && item.gjState == 0 && item.gjType == 0 ? '待支付' : item.YN == 2 ? '待接单' : item.YN == 3 ? '退货退款中' : item.YN == 4 ? '退款中' : item.YN == 5 ? '换货中' : item.YN == 6 ? '已收货' : item.YN == 7 ? '退货退款成功' : item.YN == 8 ? '退款成功' : item.YN == 9 ? '换货成功' : item.YN == 10 ? '待发货' : '待收货'}}
                            </span>
                            <span class="changestate" v-else>
                                已取消
                            </span>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.discountprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                           <span class="godnum">规格:</span> <span class="godnum"><i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额<i>￥{{checkInt(glist.TatolPrice)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{checkInt(item.TatolPrice)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{checkInt(item.TotalPaymentAmount)}}元</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{checkInt(item.TotalPaymentAmount)}}元</i></div>
                        </div>
                        <!-- 支付/取消按钮 -->
                        <div class="btnwrap" v-if="item.TYN == 0">
                            <mt-button type="default" id="cancl" v-if="item.YN == 1" @click="nPsurecancl(item.salenumber)">取消订单</mt-button>
                            <mt-button type="default" id="pay" v-if="item.YN == 1" @click="showPay(item)">立即支付</mt-button>
                            <mt-button type="default" id="pay"  v-if="item.YN == 11 && item.PlayType == 1" @click="surereceive(item.salenumber)">确认收货</mt-button>
                            <!-- <mt-button type="default" id="pay" v-if="item.PlayType != 0 && item.islock == 0 && item.YN == 3" @click="returngoods(item.salenumber)">申请退/货款</mt-button> -->
                            <mt-button type="default" id="pay" v-else-if="item.PlayType != 0 && (item.YN == 3 || item.YN == 7)" @click="returnDetails(item.salenumber)">退货退款详情</mt-button>
                            <mt-button type="default" id="pay" v-if="item.PlayType != 0 && (item.YN == 4 || item.YN == 8)" @click="returnDetails(item.salenumber)">退款详情</mt-button>
                            <!-- <mt-button type="default" id="pay" v-if="(item.refundStatus == -1 || item.refundStatus == 2) && item.PlayType != 0 && item.YN != 1" @click="returngoods1(item.salenumber)">申请退货/款</mt-button> -->
                            <mt-button type="default" id="pay" v-if="item.YN == 11 && item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) && (item.HKJSType != 1 && item.HKJSState != 2)" @click="returngoods(item.salenumber)">申请退货退款</mt-button>
                            <mt-button type="default" id="pay" v-if="item.YN == 10 && item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) && (item.HKJSType != 1 && item.HKJSState != 2)" @click="returngoods1(item.salenumber)">申请退款</mt-button>
                            <mt-button type="default" id="pay" v-if="(item.YN != 1 && item.YN != 2) && item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) && (item.HKJSType != 1 && item.HKJSState != 2)" @click="agreeSettlement(item.salenumber, item.WholesaleName)">同意结算</mt-button>

                        </div>
                    </div>
                </div>
                <!-- 待支付区 -->
                <div id="tab1"  class="statecontent">
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <!-- <router-link class="detailtop" :to="'/index?orderCode='+item.salenumber+'&seq='+seq"> -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <!-- <span class="changestate" v-if="item.YN == 1">待支付</span> -->
                                <span class="changestate">{{item.gjType == 1&&item.gjState == 0?'申请改价中':item.gjType == 1&&item.gjState == 1?'改价通过':'待支付'}}</span>
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link  :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                        <div class="detailcontent" >
                            <div id="gg" v-for="(glist,index) in item.ordersdtl" :key="index">
                                <div class="goodsimg">
                                    <img :src="glist.ProductImg" alt="">
                                </div>
                                <div class="goodsname">
                                    <div class="line">
                                        <span class="godname">{{glist.name}}</span>
                                        <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                    </div>
                                    <div class="line">
                                        <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                        <span class="num">X <i>{{glist.buycount}}</i></span>
                                    </div>
                                    <div class="line">
                                        <span class="godnum">规格：{{glist.other1Name}}</span>
                                    </div>
                                    <div class="line" id="total">总金额：￥<i>{{(glist.TatolPrice).toFixed(2)}}</i></div>
                                </div>
                            </div>
                        </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other" >
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                        </div>
                        <!-- 支付/取消按钮 -->
                        <div class="btnwrap">
                            <mt-button type="default" id="cancl" v-if="item.YN == 1" @click="nPsurecancl(item.salenumber)">取消订单</mt-button>
                            <mt-button type="default" id="pay" v-if="item.YN == 1" @click="showPay(item)">立即支付</mt-button>
                        </div>
                    </div>
                </div>
                <!-- 待发货区 -->
                <div id="tab3" class="statecontent" >
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum
                                " style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <!-- 支付成功的订单无提示 -->
                                <span class="changestate">{{item.YN == 2?'待接单':'待发货'}}</span>
                                <!-- <span class="changestate" v-if="item.gjType == 1">{{item.gjState == 0?'待改价':item.gjState == 1?'改价通过':'改价未通过'}}</span> -->
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额￥<i>{{(glist.TatolPrice).toFixed(2)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="shorter" style="width:75%" id="test" v-if="item.refundStatus==2"  @click="refuseMore(item,$event)">退款失败原因：{{item.refundMark}}</div>
                            <!-- <div class="refuseMark" v-if="item.refundStatus==2"><p>退款失败原因：{{item.refundMark}}</p><span >更多</span></div> -->
                        </div>
                        <!-- 同意结算/申请退款按钮 -->
                        <div class="btnwrap" v-if="item.YN != 2 && item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) &&(item.HKJSType != 1 && item.HKJSState != 2)"><!-- palytype=0为线下支付订单，不能申请退款 -->
                            <mt-button type="default" id="pay" @click="agreeSettlement(item.salenumber, item.WholesaleName)">同意结算</mt-button>
                            <mt-button type="default" id="pay" @click="returngoods1(item.salenumber)">申请退款</mt-button>
                            <!-- <mt-button type="default" id="pay" v-else-if="item.PlayType !=0" @click="returnDetails(item.salenumber)">退款详情</mt-button> -->
                        </div>
                    </div>
                </div>
                <!-- 待收货区 -->
                <div id="tab2" class="statecontent" >
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <!-- 支付成功的订单无提示 -->
                                <!-- <span class="changestate">待收货</span> -->
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link  :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额￥<i>{{(glist.TatolPrice).toFixed(2)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="shorter" style="width:75%" id="test" v-if="item.refundStatus==2"  @click="refuseMore(item,$event)">退款失败原因：{{item.refundMark}}</div>
                            <!-- <div class="refuseMark" id="test" v-if="item.refundStatus==2"><p>退款失败原因：{{item.refundMark}}</p><span @click="refuseMore(item,$event)">更多</span></div> -->
                        </div>
                        <!-- 申请退货/款按钮 -->
                        <div class="btnwrap"><!-- palytype=0为线下支付订单，不能申请退款 -->
                            <mt-button type="default" id="pay" v-if="item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) && (item.HKJSType != 1 && item.HKJSState != 2)" @click="agreeSettlement(item.salenumber, item.WholesaleName)">同意结算</mt-button>
                            <mt-button type="default" id="pay" @click="surereceive(item.salenumber)">确认收货</mt-button>
                            <mt-button type="default" id="pay" v-if="item.PlayType != 0 && (item.refundStatus == -1 || item.refundStatus == 2) && (item.HKJSType != 1 && item.HKJSState != 2)" @click="returngoods(item.salenumber)">申请退货退款</mt-button>
                            <!-- <mt-button type="default" id="pay" v-else-if="item.refundStatus==2 && item.PlayType != 0" @click="returnDetails(item.salenumber)">退款详情</mt-button> -->
                        </div>
                        <!-- 取消订单/催发货 -->
                        <!-- <div class="btnwrap">
                            <mt-button type="default" id="cancl" @click="surecancl" style="border:none;background:#ff0000;color:#fff;width: 4rem;height: 1.3333rem">取消订单</mt-button>
                            <mt-button type="default" id="pay" style="background:#666;color:#fff;border:none;width: 4rem;height: 1.3333rem">催发货</mt-button>
                        </div> -->
                    </div>
                </div>
                <!-- 退/换货区 -->
                <div id="tab4" class="statecontent">
                    <!--v-if="nedPayList.length"-->

                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <span class="changestate" >{{item.YN == 3?'退货退款中':item.YN == 4?'退款中':item.YN == 7?'退货退款成功':'退款成功'}}</span>
                                <!-- <span class="changestate">'退款成功' </span> -->
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额￥<i>{{checkInt(glist.TatolPrice)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                        </div>
                        <!-- 退货/款详情按钮 -->
                        <div class="btnwrap">
                        <!-- <mt-button type="default" id="pay" v-if="item.YN == 3 && item.PlayType != 0" @click="returngoods(item.salenumber)">申请退货</mt-button> -->
                            <mt-button type="default" id="pay" v-if="item.PlayType != 0 && (item.YN == 3 || item.YN == 7)" @click="returnDetails(item.salenumber)">退货退款详情</mt-button>
                            <!-- <mt-button type="default" id="pay" v-if="item.YN == 4 && item.PlayType != 0" @click="returngoods1(item.salenumber)">申请退款</mt-button> -->
                            <mt-button type="default" id="pay" v-if="item.PlayType != 0 && (item.YN == 4 || item.YN == 8)" @click="returnDetails(item.salenumber)">退款详情</mt-button>
                        </div>
                    </div>
                </div>
                <!-- 已完成区    已确认收货+退款成功的订单-->
                <div id="tab5" class="statecontent" >
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <span class="changestate">{{item.YN == 6?'确认收货':item.YN == 7?'退货退款成功':'退款成功'}}</span>
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额￥<i>{{checkInt(glist.TatolPrice)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="shorter" style="width:75%" id="test" v-if="item.refundStatus==2"  @click="refuseMore(item,$event)">退款失败原因：{{item.refundMark}}</div>
                        </div>

                        <!-- 退货/款详情按钮 -->
                        <div class="btnwrap">
                            <!-- <mt-button type="default" id="pay" v-if="item.refundStatus !=2 && item.islock !=1 && item.YN != 7 && item.PlayType != 0" @click="returngoods(item.salenumber)">退货退款</mt-button> -->
                            <mt-button type="default" id="pay" v-if="item.YN == 8 && item.PlayType != 0 " @click="returnDetails(item.salenumber)">退款详情</mt-button>
                            <mt-button type="default" id="pay" v-if="item.YN == 7 && item.PlayType != 0 " @click="returnDetails(item.salenumber)">退货退款详情</mt-button>
                            <!-- <mt-button type="default" id="pay" v-else-if="item.PlayType != 1 && item.islock !=0" @click="returnDetails(item.salenumber)">退款详情</mt-button> -->

                        </div>
                    </div>
                </div>
                <!-- 待结算 -->
                <div id="tab7" class="statecontent" >
                    <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
                        <!-- 订单号区 -->
                        <router-link class="detailtop" :to="'/business?wholesaler='+item.WholeSaleSEQ">
                            <div class="detailtop" >
                                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                                <span class="changestate" >未结算</span>
                            </div>
                        </router-link>
                        <!-- 商品详情区 -->
                        <router-link :to="'/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                            <div class="detailcontent" >
                                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                                    <div class="goodsimg">
                                        <img :src="glist.ProductImg" alt="">
                                    </div>
                                    <div class="goodsname">
                                        <div class="line">
                                            <span class="godname">{{glist.name}}</span>
                                            <span class="price">￥<i>{{checkInt(glist.dlprice)}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                                            <span class="num">X <i>{{glist.buycount}}</i></span>
                                        </div>
                                        <div class="line">
                                            <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                                        </div>
                                        <div class="line" id="total">总金额￥<i>{{checkInt(glist.TatolPrice)}}</i></div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <!-- 结账信息区 -->
                        <div class="other">
                            <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                            <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TatolPrice).toFixed(2)}}元</i></div>
                            <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="ordertime" v-if="item.PlayType">支付方式：<i>{{item.PlayType == 0?'线下支付':'线上支付'}}</i></div>
                            <div class="ordertime">下单时间：<i>{{formatDate(item.ordertime)}}</i></div>
                            <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{(item.TotalPaymentAmount).toFixed(2)}}元</i></div>
                            <div class="shorter" style="width:75%" id="test" v-if="item.refundStatus==2"  @click="refuseMore(item,$event)">退款失败原因：{{item.refundMark}}</div>
                        </div>
                        <!-- 同意结算按钮 -->
                        <div class="btnwrap" v-if="item.PlayType != 0">
                            <mt-button type="default" id="pay" @click="agreeSettlement(item.salenumber, item.WholesaleName)">同意结算</mt-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nodata" v-show="nedPayList.length == 0">~ 没有更多数据了 ~</div>
        </mt-loadmore>
        <!-- 右侧筛选弹框 -->
        <!-- <div class="filterpopup" v-for="(item,index) in nedPayList" :key="index"> -->
        <div class="filterpopup myorder" >
            <mt-popup id="filterwrap" v-model="popupVisible" popup-transition="popup-fade" position="right" lockScroll="true">
                <div class="ordernum">
                    <span class="titleFs">订单号</span>
                    <div class="numipt"><el-input placeholder="请输入内容" value="aa" v-model="ordernum" @change="checkNum" onkeyup="this.value=this.value.replace(/[^\d]/g,'');" clearable></el-input></div>
                </div>
                <div class="ordertime">
                    <span class="titleFs">订单时间</span>
                    <div class="numipt">
                        <!-- <input type="text" readonly="readonly" placeholder='开始时间' v-model="inputStartTime" @click="openPicker">
                        <input type="text" readonly="readonly" placeholder='结束时间' v-model="inputEndTime" @click="openPicker2"> -->
                        <input type="button" class="buttonNew" :value="inputStartTime==''?'开始时间':inputStartTime" @click="openPicker">
                        <input type="button" class="buttonNew" :value="inputEndTime==''?'结束时间':inputEndTime" @click="openPicker2">
                    </div>
                </div>
                <div class="pay">
                    <span class="titleFs">支付方式</span>
                    <div class="numipt over" >
                        <mt-button class="btnitem payBtn" :class="{'active':zhifutext=='银联'}" @click="zhifu('银联')">银联</mt-button>
                        <mt-button class="btnitem payBtn" :class="{'active':zhifutext=='线下'}" @click="zhifu('线下')">线下</mt-button>
                        <mt-button class="btnitem payBtn" :class="{'active':zhifutext=='全部'}" @click="zhifu('全部')">全部</mt-button>
                    </div>
                </div>
                <div class="filterend">
                    <mt-button id="reset" type="default"  @click.native="clearForm">重置</mt-button>
                    <mt-button id="sure" type="default" @click.native="sureCheck">确定</mt-button>
                </div>
            </mt-popup>
        </div>
        <div class="tamepiker">
            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" v-model="startTime"  month-format="{value} 月" date-format="{value} 日"
            @confirm="handleConfirm" :startDate="startDate" :endDate="endDate">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2" type="date" year-format="{value} 年" v-model="endTime"  month-format="{value} 月" date-format="{value} 日"
            @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
            </mt-datetime-picker>
        </div>
        <!-- 立即支付页面弹窗 -->
        <mt-popup id="payrwrap" v-model="shift" popup-transition="popup-fade" position="bottom" style="width:100%">
            <div class="payment">
                <div class="pay-title">
                    选择支付方式
                    <div class="close el-icon-close" @click="close"></div>
                </div>
                <div class="amount">
                    <span>支付金额</span>
                    <p>{{paymoney}}元</p>
                </div>
                <div class="ways" @click="ways('线上支付')">
                    <p>线上支付</p>
                    <span class="el-icon-circle-check" v-show="amount=='线上支付'"></span>
                </div>
                <!--  v-if="certificate_type != 1"年费类型支持线下 -->
                <div class="ways" @click="ways('线下支付')">
                    <p>线下支付</p>
                    <span class="el-icon-circle-check" v-show="amount=='线下支付'"></span>
                </div>
                <div class="surebtn">
                    <mt-button class="btn" type="default" @click="gotopay">立即付款</mt-button>
                </div>
            </div>
        </mt-popup>
        <div v-if="!blockLimit">
            <div v-if="userBlock">
                <block-tabbar></block-tabbar>
            </div>
            <div v-else>
                <bottomnav :bottom="bottomnav" v-if="(userType == 1 || userType == 5)&&!userBlock"></bottomnav>
                <wholesale-nav v-else-if="userType == 2||userType == 3||userType == 4 || userType == 6||userType == 7||userType == 8"></wholesale-nav>
            </div>
        </div>
   </div>
</template>

<script type="text/javascript">
import '../../assets/css/myorder.css';
import Vue from 'vue'
import { MessageBox , Loadmore ,InfiniteScroll} from 'mint-ui';
import {showToast} from '../../assets/js/common.js'
import MintUI from 'mint-ui';
Vue.use(MintUI);
import moment from 'moment'
import $ from 'jquery'
import {payMixin} from '@/assets/js/mixin'
import blockTabbar from '@/components/blockTabbar'
export default {
    name: 'MyOrder',
    mixins: [payMixin],
    data() {
        return {
            topnav:{
                title:this.userType==1?'我的订单':'订单管理'
            },
            isFixed:false,
            bottomnav:{
                index:'我的订单'
            },
            ApplyStatus:'',
            fromApp:false,
            paymoney:'',//支付弹窗所示价格合计
            amount: '线上支付',
            shift:false,//立即支付弹窗显示控制
            zhifutext:'全部',
            popupVisible:false,//筛选弹窗显示控制
            ordernum:'',//筛选订单号数据,
            startTime: new Date(),
            endTime: new Date(),
            inputStartTime: '',
            inputEndTime: '',
            ordertime:'',//订单的时间戳
            startDate: new Date('2018'),
            startDate2: new Date('2018'),//开始时间
            endDate: new Date(), // 结束时间
            seq:sessionStorage.getItem('seq'),//商家seq
            skip:0,//起始行数(从第几条开始，默认0),
            take:5,//返回总行数
            // queryJson:{},//查询条件,(salenumber 订单号搜索关键字, StartTime 订单起始时间, EndTime 订单结束时间,
            // PlayType 支付类型 0 线下支付/1 线上支付) 线下支付的订单不能退款，不能退货
            playType:'',
            orderState:'',//订单状态(1 待支付 2 待收货 3 待发货 4 退/换货 5 已完成 7 待结算)
            nedPayList:[],//当前状态下的所有订单列表
            gjType:'',//0 未申请价 1 申请改价
            gjState:'',// 0 待改价 1 改价通过 2 改价未通过
            islock:'',//锁单状态 0未锁单 1锁单
            page:1,
            prodblur:false,
            loading:false,
            YN:'',//YN 0：加入购物车 1:待支付 2：支付完成 3:退货退款 4：仅退款 5：换货 6:确认收货  7:退货退款成功 8:退款成功 9:换货成功 10 待发货 11待收货
            endshow:false,
            isLoad:true,
            userType:'',
            showAll:true,//点击查看更多
            queryJson:{
                salenumber:'',
                StartTime:'',
                EndTime:'',
                PlayType:this.playType,
            },
            activeType:false,
            certificate_type:'',
            salenumber: '',
            userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
            exitGood: 9, // 点击已退款或者未退款  9已退款  8未退款
            orderStatus: 0,
            blockLimit: false
        }
    },
    components:{
        blockTabbar,
    },
    created() {
        this.activeType = false;
        this.seq = sessionStorage.getItem('seq');
        let query = this.$route.query;
        let fromAPPSeq = this.$route.query.seq;
        let fromApp = sessionStorage.getItem('app');
        if(fromApp){
            this.fromApp = fromApp;
        }
        let userType = sessionStorage.getItem('userType');
        if(userType){
            this.userType = userType;
        }
        if(fromAPPSeq){
            this.seq = fromAPPSeq;
            sessionStorage.setItem('seq',fromAPPSeq);
        }
        //请求拦截器
        axios.interceptors.request.use((config) => {
            MintUI.Indicator.open({ //打开loading
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            return config;
        }, (err) => {
            return Promise.reject(err)
        })
        //响应拦截器
        axios.interceptors.response.use((response) => {
            MintUI.Indicator.close(); //关闭loading
            return response;
        }, (err) => {
            return Promise.reject(err);
        });
        // 2020/08/13 区域批发商v2.1版本需求 供应链查看批发网订单
        if (query.fromApp) {
            this.blockLimit = true;
            this.userBlock = true
        }
        //this.inputStartTime = moment(this.startTime).format('YYYY.MM.DD');
        //this.inputEndTime = moment(this.endTime).format('YYYY.MM.DD');
    },
    updated(){
        this.$nextTick(function(){
            $('.refuseMark').each(function(i,e){
                if($(e).height() < $(e).find('p').height()){
                    $(e).find('span').show();
                }
            });
        });
    },

    mounted(){
        this.getOrderList(0)
        document.querySelector("body").setAttribute("style","background-color: #f5f5f5");//切换本页body背景颜色
        // 滚动下拉
        window.addEventListener('scroll', this.menu1);
        if (this.userBlock) {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.menu1);
    },
    methods: {
        // 返回按钮
        goBack() {
            try {
                window.action.app_back();
            } catch (err) {
                history.go(-1);
            }
        },
        changeExitGood(num) {
            this.exitGood = num;
            this.orderStatus = num;
            this.skip = 0;
            this.datas = [];
            this.nedPayList = [];
            this.getOrderList(num)
        },
        //  move(e){
        //  },
        checkInt(num){
            var fixedNum = num;
            if(fixedNum !=0 && fixedNum != null){
                fixedNum = (fixedNum).toFixed(2);
                return fixedNum;
            }else{
                return '0.00';
            }
        },
        checkNum(aa){
            var r = aa.match(/^[0-9]*$/);
            if (r == null) {
                showToast('请输入正确的订单号！','bottom')
            }
        },
        //下拉刷新加载
        loadTop() {
            this.$refs.loadmore.onTopLoaded();
            let str = $('.showcontent')[0].id//获取当前页面的tabel个数
            this.skip = 0;
            this.nedPayList = [];
            let val = str.substring(3)
            this.getOrderList(val)
        },
        //退货/款详情页面查看
        returnDetails(salenumber){
            this.$router.push({path:'./returndetails',query:{seq:this.seq,salenumber:salenumber}})
        },
        //关闭支付弹窗
        close(){
            this.shift = false
        },
        //支付方式选择控制
        ways(val){
            this.amount = val;
        },
        //支付弹窗显示
        showPay(item){
            this.salenumber = item.salenumber;

            if(item.IsSplitOrder) {
                this.$router.push({
                    name: 'payment',
                    query: {
                        salenumber: this.salenumber,
                        iSeq: this.seq
                    }
                })
                return false;
            }
            this.certificate_type = item.certificate_type;
            // if(this.certificate_type == null){
            //   showToast('该订单已失效');
            // }else{
                // this.getApplyStatus(item.SEQ);
                this.paymoney = item.TotalPaymentAmount
                // this.salenumber = item.salenumber
                this.shift = true
            // }
        },
        // getApplyStatus(seq){
        //   axios.get(this.URL+'/User/GetEnterMessage',{params:{seq:seq}})
        //   .then((res)=>{
        //     this.ApplyStatus = res.data.data.success;
        //   })
        // },
        //跳转去支付页面
        gotopay(){
            this.shift = false;
            if (this.amount == '线下支付') {
                this.amount = 0
                axios.post(this.URL + '/OrdersPay/SetOrdersOfflinePay',{salenumber:this.salenumber,seq:this.seq}).then(res=>{
                    if (res.status == 200) {
                        this.$router.push('/successful');
                        return false
                    }
                    showToast(res.data.message,'middle')
                })
            }else if (this.amount == '线上支付') {
                if(this.paymoney > 5000) {

                    MessageBox({
                        title: '',
                        message: '您好！单次支付金额最高￥5000元，您的支付金额过大，请问是否需要分单支付？',
                        showCancelButton: true,
                        confirmButtonText: "分单支付",
                        cancelButtonText: "取消"
                    }).then(action => {
                        if(action == 'confirm') {
                            this.$router.push({
                                name: 'payment',
                                query: {
                                    salenumber: this.salenumber,
                                    iSeq: this.seq
                                }
                            })
                        }
                    })
                    return false;
                }

                this.amount = 1
                if(this.fromApp){
                    let salenumber = this.salenumber;
                    let iSeq = this.seq;
                    window.action.AppGoPay(salenumber,iSeq,'10019', true);
                }else{
                    this.payLink()
                }
            }
        },
        // 同意结算
        agreeSettlement(salenumber, name) {
            var str = $('.showcontent')[0].id//获取当前页面的tabel个数
            MessageBox({
                message: '您确认现在就要支付完该订单的款项吗？',
                title:'',
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                showCancelButton: true,
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton'
            }).then(action => {
                if (action == 'confirm') {
                    MessageBox({
                        message: '您确定支付该订单款后，该笔订单资金将立即转入卖家账户，且不可撤回。 请您再次确认！',
                        title:'',
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        showCancelButton: true,
                        confirmButtonClass: 'confirbutton',
                        cancelButtonClass:'cancelbutton'
                    }).then(action => {
                        if (action == 'confirm') {
                            let data = {
                                seq:this.seq,
                                salenumber:salenumber,
                                Name: name
                            }
                            axios.get(this.URL + '/OrderNewListInfo/BusinessPaymentSettlement',{params: data}).then(res=>{
                                if (res.status == 200) {
                                    showToast('订单结算成功','middle')
                                    this.skip = 0;
                                    this.nedPayList = [];
                                    let val = str.substring(3)
                                    setTimeout(() => {
                                        this.getOrderList(val)
                                    }, 1000);
                                }else{
                                    setTimeout(() => {
                                        showToast('请重试','middle')
                                    }, 2000);
                                }
                            })
                        }
                    })
                }
            })
        },
        //重置筛选
        clearForm(){
            this.ordernum = '';
            this.inputStartTime = '';
            this.inputEndTime = '';
            this.playType = '';
            this.zhifutext = '全部';
        },
        //确定筛选
        sureCheck(){
            // var r = this.ordernum.match(/^[0-9]*$/);
            let that = this;
            // if (r == null || !that.ordernum) {
            //    showToast('请输入正确的订单号！','bottom')
            // }else
            // if (that.inputStartTime == null || !that.inputStartTime) {
            //    showToast('请输入开始时间！','bottom')
            // }else if (that.inputEndTime == null || !that.inputEndTime) {
            //    showToast('请输入结束时间！','bottom')
            // }else if(that.ordernum!='' && that.inputStartTime!='' && that.inputEndTime!=''){
                // that.queryJson["salenumber"] = that.ordernum;
                // that.queryJson["startTime"] = that.inputStartTime;
                // that.queryJson["endTime"] = that.inputEndTime;
                // that.queryJson["playType"] = that.playType;
                $('.topnav li').removeClass('lihover');
                $('#all').addClass('lihover');
                $(".statecontent").removeClass('showcontent');
                $('#tab0').addClass('showcontent');
                // 每次点击查询先清空上一次的数据
                that.skip = 0;
                that.nedPayList = [];


                that.queryJson.salenumber=that.ordernum;
                that.queryJson.StartTime=that.inputStartTime;
                that.queryJson.EndTime=that.inputEndTime;
                that.queryJson.PlayType=that.playType;
                that.getOrderList(0);
                that.ordernum = '';
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';

                that.popupVisible = false;
                // let post = {
                //   "seq":that.seq,
                //   "take":that.take,
                //   "queryJson":that.queryJson,
                //   "orderStatus":0,
                //   "skip":that.skip
                // }
            // let filData = encodeURIComponent(JSON.stringify(post));  // 编译链接字符符号适合url使用
            // this.$router.push({path:'./orderFilter',query:{sjData:filData}});
            // }
            // if(that.inputStartTime!='') that.queryJson["startTime"] = that.inputStartTime;
            // if(that.inputEndTime!='') that.queryJson["endTime"] = that.inputEndTime;
            // if(that.playType!=null) that.queryJson["playType"] = that.playType;
            // let post = {
            //   "seq":that.seq,
            //   "take":that.take,
            //   "queryJson":that.queryJson,
            //   "orderStatus":0,
            //   "skip":that.skip
            // };
            // let filData = encodeURIComponent(JSON.stringify(post));  // 编译链接字符符号适合url使用
            // this.$router.push({path:'./orderFilter',query:{sjData:filData}});
        },
        //筛选支付方式切换样式
        zhifu(val){
            this.zhifutext = val
            if (val == '银联') {
                this.playType = 1
            }else if (val == '线下') {
                this.playType = 0
            }else if (val == '全部'){
                this.playType = '';
            }
        },
        changeState(event,val){
            let elem = event.currentTarget;
            this.skip = 0;
            this.nedPayList = [];
            this.orderState = val;
            $('.topnav li').removeClass('lihover');
            $(elem).addClass('lihover');
            $(".statecontent").removeClass('showcontent');
            $('#tab' + val).addClass('showcontent');
            // 如果是退货退款，重置筛选状态
            if (val==4){
                this.exitGood = 9;
                val = 9;
            }
            this.getOrderList(val)
            this.orderStatus = val;
        },
        //获取商家订单列表
        getOrderList(val){
            var that = this;
            var objData={
                seq:that.seq,take:that.take,queryJson:JSON.stringify(that.queryJson),orderStatus:val,skip:that.skip
            }
             //判断如果是登录的区域批发商的身份则加加上字段
            if(this.userBlock){
                objData.wholesalerType=0
            }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                objData.wholesalerType=1
            }else{
                objData.wholesalerType=0
            }
            console.log(this.URL,456)
            axios.get(this.URL + '/BusinessOrders/GetBusinessOrdersListJson',{params:objData})
            .then(res => {
                if (res.data.code == 200) {
                    this.isLoad = true;
                    that.prodblur = true;
                    // that.nedPayList = res.data.data;
                    that.nedPayList = that.nedPayList.concat(res.data.data);
                    that.gjType = that.nedPayList.gjType
                }else{
                    this.isLoad = false;
                    // setTimeout(() => {
                    //   showToast('请重试','middle')
                    // }, 1000);
                };
            });
        },
        formatDate(date){
            return (date.replace('T'," ")).substring(0,19);
        },
        // 下拉加载
        menu1() {
            let scroll1 = parseInt(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset);
            let h1 = parseInt(document.documentElement.offsetHeight - document.documentElement.clientHeight);
            if(this.$route.path == '/myorder'){
                console.log(456,Number(scroll1) -Number(h1));
                if( scroll1 != 0 && (Number(h1) - Number(scroll1))<=10){
                    if(this.isLoad){
                        let str = $('.showcontent')[0].id;//获取当前页面的tabel个数
                        let val = str.substring(3);
                        this.skip += 5
                        this.getOrderList(this.orderStatus)
                    }else{
                        showToast('暂无更多数据~');
                    }
                }
            }
        },
        //  待支付--取消订单弹窗
        nPsurecancl(salenumber){
            var str = $('.showcontent')[0].id//获取当前页面的tabel个数

            MessageBox({
                message: '您是否取消订单?',
                title:'',
                confirmButtonText:'是',
                cancelButtonText:'否',
                showCancelButton: true,
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton'
            }).then(action => {
                if (action == 'confirm') {
                    let data = {
                        seq:this.seq,
                        salenumber:salenumber
                    }
                    axios.post(this.URL + '/BusinessOrders/CancelBusinessOrders',data).then(res=>{
                        if (res.status == 200) {
                            showToast('订单取消成功','middle')
                            this.skip = 0;
                            this.nedPayList = [];
                            let val = str.substring(3)
                            setTimeout(() => {
                                this.getOrderList(val)
                            }, 1000);
                        }else{
                            setTimeout(() => {
                                showToast('请重试','middle')
                            }, 2000);
                        }
                    })
                }
            })
        },
        //  确认收货弹窗
        surereceive(salenumber){
            var str = $('.showcontent')[0].id//获取当前页面的tabel个数
            MessageBox({
                message: '您是否确定收货?',
                confirmButtonText:'是',
                cancelButtonText:'否',
                title:'',
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton',
                showCancelButton: true
            }).then(action => {
                if (action == 'confirm') {
                    let data2 = {
                        seq:this.seq,
                        salenumber:salenumber
                    }
                    axios.post(this.URL + '/BusinessOrders/ConfirmBusinessOrders',data2).then(res=>{
                        if (res.status == 200) {
                            showToast('确认收货成功','middle')
                            this.skip = 0;
                            this.nedPayList = [];
                            let val = str.substring(3)
                            setTimeout(() => {
                                this.getOrderList(val)
                            })
                        }else{
                            setTimeout(() => {
                                showToast('请重试','middle')
                            }, 2000);
                        }
                    })
                }
            })
        },
        //  申请退款
        returngoods1(salenumber){
            // let pathData = []
            // let totalp = ''
            // for (const j in this.nedPayList) {
            //   if (this.nedPayList[j].salenumber == salenumber) {
            //     const p = this.nedPayList[j].ordersdtl
            //     totalp = this.nedPayList[j].TotalPaymentAmount
            //     for (const k in p) {
            //       pathData.push(p[k])
            //     }
            //   }
            // }
            this.$router.push({path:'/returnmoney',query:{salenumber:salenumber}})
            //  this.$router.push({path:'/returnmoney',query:{pathData:pathData,salenumber:salenumber,totalp:totalp}})
        },
        //  退换货
        returngoods(salenumber){
            this.$router.push({path:'/returngoods',query:{salenumber:salenumber}})
        },
        // 筛选弹窗
        showfilter(){
            this.popupVisible = true;
        },
        // 时间筛选
        openPicker () {
            this.$refs.picker.open()
        },
        openPicker2 () {
            this.$refs.picker2.open()
        },
        //订单筛选开始时间确定fn
        handleConfirm (data) {
            if(new Date(data).getTime() <= new Date(this.endTime).getTime()){
                let date = moment(data).format('YYYY.MM.DD');
                this.inputStartTime = date;
            }else{
                Toast({
                message: '开始时间不能大于结束时间！',
                duration: 2000,
                className:'counttc'
                });
            }
        },
        //订单筛选开始时间确定fn
        handleConfirm2 (data) {
            if(new Date(data).getTime() >= new Date(this.startTime).getTime()){
                let date = moment(data).format('YYYY.MM.DD');
                this.inputEndTime = date;
            }else{
                Toast({
                    message: '结束时间不能小于开始时间！',
                    duration: 2000,
                    className:'counttc'
                });
            }
        },
        // more
        refuseMore(i,event){
            let elem = event.currentTarget;
            // elem.parentNode.style.height = 'auto';
            // elem.style.display= 'none';
            const mark = i.refundMark.length
            if (mark >= 15) {
                if($(elem).hasClass("refuseMark")){
                    $(elem).removeClass("refuseMark").addClass("shorter");
                }else{
                    $(elem).removeClass("shorter").addClass("refuseMark");
                }
            }
        }
    },
    // 判断返回页面不刷新
    beforeRouteLeave(to,from,next){
        if(to.name == 'orderDetails' || to.name == 'returndetails'){
            from.meta.keepAlive = true;
        }else{
            from.meta.keepAlive = false;
        };
        next();
    }
}
</script>
<style scoped>
    #filterwrap{
        padding-top: 46px !important;
    }
    .myorder .mint-header{
        z-index: 10000;
        background:linear-gradient(-90deg,rgba(255,94,35,1),rgba(255,119,37,1));
        color: #fff;
    }
    .exitGood{
        display: flex;
        width: 7rem;
        background-color: #fff;
        border-radius: 1rem;
        font-size: 0.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        margin: 0 auto;
        overflow: hidden;
        margin-bottom: 0.4rem;
    }
    .exitGood div{
        width: 50%;
        text-align: center;
    }
    .activGood{
        background:rgba(255,96,35,1) !important;
        color: #fff !important;
    }
.orderdetail .shorter{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .5778rem /* 26/45 */;
    color: #666;
    margin-top: .6667rem /* 30/45 */;
    width: 100%;
    text-align: right;
}
.myorder .isFixed{
    position: fixed;
    top: 0px;
    z-index: 4;
    width: 100%;
    height:auto;
    overflow-y: auto;
}
.myToast{
    z-index: 99999999;
}
.timetoast{
    z-index: 99999999;
}
.active{
    background: rgba(255,238,231,1) !important;
    color:rgba(255,96,35,1) !important;
}
.nodata{
    overflow:hidden;
    padding:1rem;
    text-align: center;
    font-size:0.8rem;
    font-weight:bold;
    color:#ccc;
}
/* 立即支付弹窗组件 */
.payment{
    overflow:hidden;
    font-size:0.65rem;
}
.payment .surebtn{
    display: flex;
    justify-content: center;
}
.payment .surebtn .btn{
    background: #ff0025;
    color: #fff;
    width: 100%;
    margin:0.6rem 0.3rem;
}
.payment .pay-title{
    overflow:hidden;
    padding:10px;
    text-align: center;
    line-height:1.2em;
    position:relative;
    padding:0.6rem 0;
    border-bottom:1px solid #dcdcdc;
}
.close{
    position:absolute;
    right:10px;
    top:10px;
    font-size:1rem;
    color:#999;
}
.amount{
    overflow:hidden;
    border-bottom:1px solid #dcdcdc;
    line-height:1.2em;
    padding:0.9rem 0;
    text-align: center;
}
.amount span{
    display:block;
    font-size:0.6rem;
    color:#999;
    margin-bottom:0.2rem;
}
.amount p{
    display:block;
    font-size:0.9rem;
    color:#ff0025;
}
.ways{
    overflow:hidden;
    border-bottom:1px solid #dcdcdc;
    padding:0.9rem 10px;
    position:relative;
}
.ways p{
    float:left;
    line-height:1.4em;
}
.ways span{
    font-size:1rem;
    position:absolute;
    right:10px;
    top:calc((100% - 1.2em)/2);
    line-height:1.2em;
    color:#e43a3d;
}
.counttc{
    z-index:999999
}
.orderTypeTab{
    display: flex;
    justify-content:space-between;
    align-items:center;
    text-align:center;
    border:1px solid #f00;
    border-radius:4px;
    color:#f00;
    background:#fff;
}
.orderTypeTab a{
    color:#f00;
    flex:1;
    height: 0.8889rem;
    line-height: 0.8889rem;
}
.orderTypeTab .activeType{
    color:#fff;
    background:#f00;
}
.titleFs{
    font-size:0.59rem !important;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
}
    .buttonNew{
        background:rgba(239,239,239,1);
        font-size: 0.6222rem !important;
        color:rgba(153,153,153,1) !important;
    }
    .payBtn{
        background:rgba(239,239,239,1);
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        width: 4rem !important;
        padding: 0 1rem;
        display: block;
        margin-bottom: 0.6rem;
    }
    .over{
        flex-wrap: wrap;
        display: flex;
        justify-content: space-between;
    }
    .pay{
        border-bottom: none !important;
    }
    .filterend{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        right: 0;
        display: flex;
        height: 2rem !important;
        line-height: 1rem !important;
    }
    #reset{
        width: 40% !important;
        background: #Fff;
        height: 2rem !important;
        margin: 0 !important;
        border-radius: 0 !important;
        padding: 0 !important;
    }
    #sure{
        border-radius: 0 !important;
        width: 60% !important;
        padding: 0 !important;
        background:rgba(255,96,35,1) !important;
        height: 2rem !important;
        margin: 0 !important;
        color:rgba(255,255,255,1) !important;
    }
.filterpopup #filterwrap .filterend{
    right: 0 !important;
}
    .topnav ul li.lihover{
        color: #FF6023FF;
    }
    .topnav ul li i{
        background: #FF6023FF;
    }
    .goodsimg img {
        max-height: 100%;
    }
</style>
