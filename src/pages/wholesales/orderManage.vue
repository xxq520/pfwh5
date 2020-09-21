<template>
   <div class="global">
      <mt-header :title="topnav.title">
        <span class="orderTypeTab" slot="right">
          <router-link :class="activeType?'activeType':''" to="/wholesale/orderManagement">卖单</router-link>
          <router-link :class="activeType?'':'activeType'" to="/myorder">买单</router-link>
        </span>
      </mt-header>
       <!-- 滑动菜单栏 -->
       <div class="topwrap">
           <div class="topnav" ref="topnav">
              <ul>
                <li v-for="(item,index) in filter" :key="index" :title="item.id" :class="{'lihover': item.id === navIndex}" @click="navClick(item.id,item.orderStatus)">{{item.title}}<i></i></li>
              </ul>
            </div>
            <!-- 筛选 -->
            <div class="filterBox">
              <span class="filterBtn" @click="showfilter">
                  <img src="../../assets/images/filter.png"> 筛选
              </span>
            </div>
       </div>
       <div id="main">
         <div class="tabBox" :style="{height:tabBoxHeight+'px'}"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="3">
            <!-- 全部订单 -->
            <div id="tab0" class="statecontent" :class="{'showcontent':'tab0' === navIndex}">
              <div class="SendingList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="sitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status">
                      {{item.YN==1&&item.gjState == 1&&item.gjType == 1?'已改价'
                      :item.YN==1&&item.gjState == 0&&item.gjType == 1?'待改价'
                      :item.islock == 0&&item.PlayType== 1&&item.YN==6?'已收货'
                      :item.islock == 1&&item.HKJSType==1||item.PlayType!= 1&&item.YN==6||item.PlayType!= 1&&item.YN==6?'已完成'
                      :statusText(item)}}
                    </span>
                     <!--  :item.islock == 1&&item.PlayType== 1&&item.YN==6&&item.HKJSState==0&&item.HKJSType==0?'未结算'
                      :item.islock == 1&&item.PlayType== 1&&item.YN==6&&item.HKJSState==1&&item.HKJSType==1?'结算中'
                      :item.islock == 1&&item.PlayType== 1&&item.YN==6&&item.HKJSState==2&&item.HKJSType==1?'结算成功'
                      :item.islock == 1&&item.PlayType== 1&&item.YN==6&&item.HKJSState==3&&item.HKJSType==1?'结算失败' -->
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.discountprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':item.PlayType==0?'线下支付':'未选择支付方式'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                  </div>
                  <p class="BtnBox" ref="SpanBox" v-if="(item.gjState == 0 || item.gjState == 2)&& (item.gjType == 0 || item.gjType == 1) && item.islock != 1 && item.YN == 1">
                    <span class="Btn" @click="changePricePopup(item.salenumber,item.TotalPaymentAmount)">改价</span>
                  </p>
                  <p class="BtnBox" ref="SpanBox" v-if="item.YN == 10 && item.PlayType==1">
                    <span class="Btn" @click="setbutSingle(item.salenumber,item.WholesaleName)" v-if="item.HKJSState==0">申请结算</span>
                  </p>
                  <p class="BtnBox" ref="SpanBox" v-if="item.YN == 10">
                    <span class="Btn" @click="orderSendSure(item.salenumber)">发货</span>
                  </p>
                  <p class="BtnBox" ref="SpanBox" v-if="item.YN == 2 && item.PlayType == 0">
                    <span class="Btn" @click="orderTaking(item.salenumber)">接单</span>
                  </p>

<!--                   <span v-else-if="item.YN == 10&&item.PlayType==1">
                      <span class="Btn"  @click="orderSendSure(item.salenumber)">发货</span>
                      <span class="Btn" v-if="item.HKJSState==0" @click="setbutSingle(item.salenumber,item.WholesaleName)">申请结算</span>
                  </span>
 -->
                 <!-- <span class="Btn" @click="orderTaking(item.salenumber)" v-else-if="item.YN == 2 && item.islock != 1 && item.PlayType == 0">接单</span> -->
                  <p class="BtnBox" ref="SpanBox" v-else-if="item.YN == 4 && item.refundStatus==0">
                    <span class="Btn" @click="disRsure(item.salenumber)">拒绝退款</span>
                    <span class="Btn" @click="refundSure(item.salenumber)">同意退款</span>
                  </p>
                  <p class="BtnBox" ref="SpanBox" v-else-if="item.YN == 3 && item.refundStatus==0">
                    <span class="Btn" @click="reAllSure(item.salenumber)" >同意退货退款</span>
                    <span class="Btn" @click="disRgoods(item.salenumber)" >拒绝退货退款</span>
                  </p>

                  <!--   <span class="Btn"
                    v-else-if="item.YN == 3&&item.FinanceAudit ==2 && item.WholesaleAudit != 1 && item.islock != 1 && item.PlayType == 1
                    ||item.YN == 4&&item.FinanceAudit ==2 && item.WholesaleAudit != 1 && item.islock != 1 && item.PlayType == 1">审核拒绝</span> -->
                    <!-- <span class="Btn" @click="setbut2(item.id,item.WholesaleName) " v-else-if="item.islock == 1 && item.PlayType == 1&&item.YN==6">申请结算</span> -->


                </div>
              </div>
            </div>
            <!-- 待改价 -->
            <div id="tab1" class="statecontent" :class="{'showcontent':'tab1' === navIndex}">
              <div class="isChange wbg">
                <button class="waitToChange" @click="changeBox(true)" :style="{color:(isShow?choosed:unChoose)}">待改价</button>
                <button class="changed" @click="changeBox(false)" :style="{color:(isShow?unChoose:choosed)}">已改价</button>
              </div>
              <div class="waitToChangeList" v-show="isShow">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="item" v-for="(item,key) in datas" :key="key">
                  <div class="wtcitem wbg" v-if="item.gjState == 0">
                    <p class="pro-top">
                      <span class="code">订单号：{{item.salenumber}}</span>
                      <span class="status">{{statusText(item)}}</span>
                    </p>
                    <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                      <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                        <div class="pro-img"><img :src="proItem.ProductImg"></div>
                        <div class="pro-desc">
                          <p class="pro-title">
                            <span class="title">{{proItem.name}}</span>
                            <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                          </p>
                          <p class="pro-spec">
                            <span class="info">{{proItem.other1Name}}</span>
                            <span class="count">x {{proItem.buycount}}</span>
                          </p>
                          <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                        </div>
                      </li>
                    </ul>
                    <div class="pro-bottom">
                      <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TotalPaymentAmount)}}元</span></p>
                      <p class="payment">支付方式：{{item.PlayType==null?'未选择付款方式':item.PlayType==1?'银联支付':'线下支付'}}</p>
                      <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                    </div>
                    <p class="changeBtnBox"><span class="changeBtn" @click="changePricePopup(item.salenumber,item.TotalPaymentAmount)">改价</span></p>
                  </div>
                </div>
              </div>
              <!-- 已改价 -->
              <div class="changedList" v-show="!isShow">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="item" v-for="(item,key) in datas" :key="key">
                  <div class="citem wbg" v-if="item.gjState == 1">
                    <p class="pro-top">
                      <span class="code">订单号：{{item.salenumber}}</span>
                      <span class="status">{{statusText(item)}}</span>
                    </p>
                    <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                      <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                        <div class="pro-img"><img :src="proItem.ProductImg"></div>
                        <div class="pro-desc">
                          <p class="pro-title">
                            <span class="title">{{proItem.name}}</span>
                            <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                          </p>
                          <p class="pro-spec">
                            <span class="info">{{proItem.other1Name}}</span>
                            <span class="count">x {{proItem.buycount}}</span>
                          </p>
                          <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                        </div>
                      </li>
                    </ul>
                    <div class="pro-bottom">
                      <p class="total">共{{item.TotalBuyCount}}件商品，合计<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                      <p class="changeTotal">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                      <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                      <p class="orderTime" v-if="item.gjTime !== null">改价时间：{{formatter(item.gjTime)}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 待收货 -->
            <div id="tab2" class="statecontent" :class="{'showcontent':'tab4' === navIndex}">
              <div class="SendingList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="sitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status">{{statusText(item)}}</span>
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                  </div>
                  <p class="sendBtnBox" v-if="item.HKJSState==0&&item.PlayType==1">
                    <span class="sendBtn" @click="setbutSingle(item.salenumber,item.WholesaleName)" >申请结算</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- 待发货 -->
            <div id="tab3" class="statecontent" :class="{'showcontent':'tab3' === navIndex}">
              <div class="toBeSendList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="tbsitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status">{{statusText(item)}}</span>
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                  </div>
                  <p class="sendBtnBox">
                    <span class="sendBtn" v-if="item.HKJSState==0&&item.PlayType==1" @click="setbutSingle(item.salenumber,item.WholesaleName)" style="margin-right:0.5333rem;">申请结算</span>
                    <span class="sendBtn" @click="orderSendSure(item.salenumber)">发货</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- 待接单 -->
            <div id="tab4" class="statecontent" :class="{'showcontent':'tab2' === navIndex}">
              <div class="toBeSendList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="tbsitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status">{{statusText(item)}}</span>
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                  </div>
                  <p class="sendBtnBox"><span class="sendBtn" @click="orderTaking(item.salenumber)">接单</span></p>
                </div>
              </div>
            </div>
            <!-- 退/换货 -->
            <div id="tab5" class="statecontent" :class="{'showcontent':'tab5' === navIndex}">
                <!--v-if="datas.length"-->
                <div class="exitGood" >
                    <div :class="{'activGood':exitGood==9}" @click="changeExitGood(9)">已退款</div>
                    <div :class="{'activGood':exitGood==8}" @click="changeExitGood(8)">未退款</div>
                </div>
              <div class="afterSalesList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="asitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>


                    <span class="status" v-if="item.YN==3&&(item.refundStatus==0||item.refundStatus==1)">退货退款中</span>
                    <span class="status" v-if="item.YN==4&&(item.refundStatus==0||item.refundStatus==1)">退款中</span>

                    <span class="status" v-if="item.YN==11&&item.refundStatus==2">退货退款失败</span>
                    <span class="status" v-if="item.YN==10&&item.refundStatus==2">退款失败</span>


                    <span class="status" v-if="item.YN==7&&item.refundStatus==3">退货退款成功</span>
                    <span class="status" v-if="item.YN==8&&item.refundStatus==3">退款成功</span>


                <!--     <span class="status" v-if="item.YN==3&&item.FinanceAudit ==0 && item.WholesaleAudit != 1||item.YN==3&&item.FinanceAudit ==1 && item.WholesaleAudit == 1">退货退款中</span>
                    <span class="status" v-if="item.YN==4&&item.FinanceAudit ==0 && item.WholesaleAudit != 1||item.YN==4&&item.FinanceAudit ==1 && item.WholesaleAudit == 1">退款中</span> -->


<!--
                    <span class="status" v-if="item.YN==3&&item.FinanceAudit ==2 && item.WholesaleAudit != 1">退货退款失败</span>
                    <span class="status" v-if="item.YN==4&&item.FinanceAudit ==2 && item.WholesaleAudit != 1">退款失败</span> -->
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                    <p class="refundReason" v-if="item.YN == 4">{{item.YN == 4?'退款原因':'退货退款原因'}}：{{item.RefundReason}}</p>
                  </div>
                  <!-- <p class="agreeBtnBox" v-if="item.YN == 5 && item.FinanceAudit ==1 && item.WholesaleAudit != 1"><span class="agreeBtn" @click="reGoodsSure(item.salenumber)">同意申请</span></p> -->

               <!--    <p class="agreeBtnBox" v-if="item.YN == 4 && item.FinanceAudit ==1 && item.WholesaleAudit != 1"><span class="disagreeBtn" @click="writeSure(item.salenumber)">拒绝退</span><span class="agreeBtn" @click="refundSure(item.salenumber)">同意退</span></p> -->

                  <p class="agreeBtnBox" v-if="item.YN == 4&& (item.refundStatus==0||item.refundStatus==1)"><span class="disagreeBtn" @click="disRsure(item.salenumber)">拒绝退款</span><span class="agreeBtn" @click="refundSure(item.salenumber)">同意退款</span></p>


                  <p class="agreeBtnBox" v-if="item.YN == 3&& (item.refundStatus==0||item.refundStatus==1)"><span class="disagreeBtn" @click="disRgoods(item.salenumber)">拒绝退货退款</span><span class="agreeBtn" @click="reAllSure(item.salenumber)">同意退货退款</span></p>




                  <!-- <p class="agreeBtnBox" v-if="item.FinanceAudit ==0 && item.WholesaleAudit != 1"><span class="agreeBtn" >平台审核中</span></p> -->
                  <!-- <p class="agreeBtnBox" v-if="item.FinanceAudit ==1 && item.WholesaleAudit == 1"><span class="agreeBtn" >等待退款</span></p> -->
                  <!-- <p class="agreeBtnBox" v-if="item.FinanceAudit ==2 && item.WholesaleAudit != 1"><span class="agreeBtn" >审核拒绝</span></p> -->
                </div>
              </div>
            </div>
            <!-- 已完成 -->
            <div id="tab6" class="statecontent" :class="{'showcontent':'tab6' === navIndex}">
              <div class="completedList">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="citem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">

                     <span class="code">订单号：{{item.salenumber}}</span>
                    <!--<span class="status" v-if="item.YN ==6 && item.PlayType == 1">{{item.islock == 0?'已收货':'已完成'}}</span>
                    <span class="status" v-else-if="item.YN ==6 && item.PlayType == 0">{{'已完成'}}</span>
                    <span class="status" v-else>{{statusText(item)}}</span> -->

                    <!-- <span class="code">订单号：{{item.salenumber}}</span> -->

                    <span class="status"  v-if="item.YN==6||item.HKJSType==1" >{{'已完成'}}</span>
                    <span class="status"  v-else>{{statusText(item)}}</span>



                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <!-- <p class="total">共{{item.TotalBuyCount}}件商品，合计<span class="price">{{item.TatolPrice}}元</span><span class="express">（含运费：￥10.00）</span></p> -->
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 货款结算 -->
            <div id="tab7" class="statecontent" :class="{'showcontent':'tab7' === navIndex}">
              <div class="isBalance wbg">
                <span class="waitToBalance" @click="BalanceBox(true)" :style="{color:(isBalance?choosed:unChoose)}">未结算</span>
                <span class="balanced" @click="BalanceBox(false)" :style="{color:(isBalance?unChoose:choosed)}">已结算</span>
              </div>
              <div class="applyList" v-show="isBalance">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="aitem wbg" v-for="(item,key) in datas"  :key="key">
                <!-- <div class="aitem wbg" v-for="(item,key) in datas" v-show="item.PlayType!=1&&item.islock == 1"> -->
                  <p class="pro-top">
                    <i class="checked" @click="listAll($event, key,item)" v-show="item.HKJSState != 1"></i>
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status" v-if="item.HKJSState == 0">未结算</span>
                    <div class="status statusing" v-if="item.HKJSState == 1"><p>结算中</p><p>(待买家同意)</p></div>
                    <span class="status" v-if="item.HKJSState == 3">结算失败</span>
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                    <!-- <i class="checked" @click="listcheck($event, index,proItem)"></i> -->
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                    <p class="orderTime" v-if="item.HKJSTime!=null&&item.HKJSState!=0">结算时间：{{formatter(item.HKJSTime)}}</p>
                    <p class="orderTime" v-if="item.HKJSState!=0">批次号：{{item.Batchnumber}}</p>
                    <p class="refuseReason" v-if="item.HKJSState == 3">拒绝原因：{{item.refuseReason}}</p>
                  </div>
                </div>
              </div>
              <div class="balancedList" v-show="!isBalance">
                <p class="noData" v-if="datas.length<1">~没有更多数据了~</p>
                <div class="bitem wbg" v-for="(item,key) in datas" :key="key">
                  <p class="pro-top">
                    <span class="code">订单号：{{item.salenumber}}</span>
                    <span class="status">{{statusText(item)}}</span>
                  </p>
                  <ul class="pro-list" @click="jumpToOrderDetails(item.salenumber,item.SEQ)">
                    <li class="pro-item" v-for="(proItem,index) in item.ordersdtl" :key="index">
                      <div class="pro-img"><img :src="proItem.ProductImg"></div>
                      <div class="pro-desc">
                        <p class="pro-title">
                          <span class="title">{{proItem.name}}</span>
                          <span class="unitPrice">￥{{checkInt(proItem.dlprice)}}</span>
                        </p>
                        <p class="pro-spec">
                          <span class="info">{{proItem.other1Name}}</span>
                          <span class="count">x {{proItem.buycount}}</span>
                        </p>
                        <p class="totalPrice">总金额￥{{checkInt(proItem.TatolPrice)}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="pro-bottom">
                    <p class="total">共{{item.TotalBuyCount}}件商品，合计：<span class="price">{{checkInt(item.TatolPrice)}}元</span></p>
                    <p class="changeTotal" v-if="item.gjType == 1&&item.gjState == 1">改价合计：<span>￥{{checkInt(item.TotalPaymentAmount)}}</span></p>
                    <p class="payment">支付方式：{{item.PlayType==1?'银联支付':'线下支付'}}</p>
                    <p class="orderTime">下单时间：{{formatter(item.ordertime)}}</p>
                    <p class="orderTime" v-if="item.HKJSType == 1">结算时间：{{formatter(item.HKJSTime)}}</p>
                    <p class="orderTime" v-if="item.HKJSType == 1">批次号：{{item.Batchnumber}}</p>
                  </div>
                </div>
              </div>
              <div class="balance" v-show="isBalance" style="bottom:55px;">
                <div class="balanceDetail">
                  <div class="balanceAllChoose">
                    <div class="setcheck"><i class="checked" @click="allCheck($event)"></i><span>全选</span></div>
                  </div>
                  <div class="balanceTotal">
                    <p class="price">合计：<span>￥{{checkInt(money)}}</span></p>
                    <!-- <p class="express">（含运费:￥10.00）</p> -->
                  </div>
                </div>
                <div class="balanceBtnBox">
                  <span class="balanceBtn" @click="applyBalance()">申请结算</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <mt-popup
          v-model="balancePopup"
          popup-transition="popup-fade" class="baPopup">
          <div class="balancePopupBox">
            <p class="totalPrice">订单金额：<span>{{checkInt(STotalPaymentAmount)}}元</span></p>
            <p class="poundage">平台手续费：<span>{{checkInt(PlatformExpenses)}}元</span></p>
            <p class="balancePrice">结算金额：<span>{{checkInt(SumTatolJSPrice)}}元</span></p>
            <img src="@/assets/images/wholesale/close-icon.png" @click="closeBalancePopup">
            <span class="balanceSubmit" @click="applyBalance">结算</span>
          </div>
        </mt-popup> -->
       <!-- 改价弹窗 -->
       <div class="changePriceBox">
        <mt-popup
          v-model="changePrice"
          popup-transition="popup-fade"
          position="bottom"
          closeOnClickModal="false">
          <div class="popup-box">
            <span class="close" @click="popupClose()"><img src="../../assets/images/wholesale/close-icon.png"></span>
            <!-- <div class="pro-desc">
              <div class="pro-img"><img src="../../assets/images/wholesale/shop02.png"></div>
              <div class="pro-details">
                <p class="price">￥98.00</p>
                <p class="color">颜色：红色</p>
                <p class="size">尺码：30件/箱</p>
                <p class="count">数量：10箱</p>
              </div>
            </div> -->
            <div class="proCode">
              <span class="text">商品编码：</span><span class="code">{{code}}</span>
            </div>
            <div class="totalPrice">
              <span class="text">合计金额：</span><span class="price">￥{{checkInt(totalPrice)}}</span>
            </div>
            <div class="changedPrice">
              <span class="text">改价合计：</span><span class="changeInput">￥<input ref="changePriceTag" type="text" :value="totalPrice" @input="checkGJInput"></span>
            </div>
            <span class="changeBtn" @click="sureChangePrice()">确定改价</span>
          </div>
        </mt-popup>
      </div>
<!-- 右侧筛选弹框 -->
       <div class="filterpopup" >
          <mt-popup id="filterwrap" v-model="popupVisible2" popup-transition="popup-fade" position="right" lockScroll="true">
            <div class="ordernum">
              <span class="titleFs">订单号</span>
              <div class="numipt "><el-input placeholder="请输入内容"  type="tel" v-model="ordernum" clearable onkeyup="this.value=this.value.replace(/[^\d]/g,'');"></el-input></div>
            </div>
            <div class="ordertime">
                <span class="titleFs">订单时间</span>
                <div class="numipt">
                  <input type="button" class="buttonNew" :value="inputStartTime==''?'开始时间':inputStartTime" @click="openPicker">
                  <input type="button" class="buttonNew" :value="inputEndTime==''?'结束时间':inputEndTime" @click="openPicker2">
                </div>
            </div>
            <div class="pay">
              <span class="titleFs">支付方式</span>
              <div class="numipt over" >
                <mt-button class="btnitem payBtn" v-for="(item,key) in paymentArr" :key="key" @click="curPayment(key)" :class="{'active':key == payment}">{{item}}</mt-button>
              </div>
            </div>
            <div class="filterend">
              <mt-button id="reset" type="default" @click="reset">重置</mt-button>
              <mt-button id="sure" type="default" @click="sureCheck">确定</mt-button>
            </div>
          </mt-popup>
       </div>
        <div class="tamepiker">
            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date" v-model="startTime" :startDate="startDate1" year-format="{value} 年"  month-format="{value} 月" date-format="{value} 日"
              @confirm="handleConfirm" :endDate="endDate">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2" type="date" v-model="endTime" :startDate="startDate2" year-format="{value} 年"  month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm2" :endDate="endDate">
            </mt-datetime-picker>
        </div>
        <wholesale-nav v-if="userType == 2||userType == 3||userType == 4||userType == 7||userType == 8||userBlock"></wholesale-nav>
   </div>
</template>

<script type="text/javascript">
import wholesaleNav from '@/components/WholesaleNav'
import moment from 'moment'
import {showToast} from '@/assets/js/common.js'
export default {
    name: 'ordermanage',
    data() {
      return {
          jsid:'',
          isSingle:false,
          seq :'',
          userType:'',
          filter:[
            {id:'tab0',title:'全部订单',orderStatus:-1,gjState:''}
            ,{id:'tab1',title:'待改价',orderStatus:6,gjState:0}
            ,{id:'tab2',title:'待接单',orderStatus:1,gjState:''}
            ,{id:'tab3',title:'待发货',orderStatus:2,gjState:''}
            ,{id:'tab4',title:'待收货',orderStatus:3,gjState:''}
            ,{id:'tab5',title:'退货/退款',orderStatus:4,gjState:''}
            ,{id:'tab6',title:'已完成',orderStatus:5,gjState:''}
            ,{id:'tab7',title:'货款结算',orderStatus:7,gjState:''}
          ],
          topnav:{
              title:'订单管理',
              noBack:false
          },
          orderId:'',
          isIndeterminate:true,
          popupVisible:false,
          isShow:true,
          isBalance:true,
          choosed:'#FF0025',
          unChoose:'#939397',
          changePrice:false,
          tabBoxHeight:0,
          bootmnavHeight:0,
          navIndex:"tab0",
          popupVisible2:false,//筛选弹窗显示控制
          ordernum:'',//筛选订单号数据,
          startTime: new Date(),
          endTime: new Date(),
          inputStartTime: '',
          inputEndTime: '',
          paymentArr:['线下','银联','全部'],
          payment:2,
          payType:'',
          startDate1: new Date('2018'),
          startDate2: new Date('2018'),
          endDate: new Date(), // 结束时间
          skip:0,
          take:5,
          code:'',
          WholesaleName:'',
          totalPrice:'',
          loading:false,
          queryJson:{
            salenumber:'',
            StartTime:'',
            EndTime:'',
            PlayType:this.payType,
            gjState:'',
            HKJSType:''
          },
          WholeSaleSeq:sessionStorage.getItem('seq'),
          orderStatus:-1,
          datas:[],
          order:[],
          codeArr:'',
          checklist:0,
          money:0,
          moneyAll:0,
          balancePopup:false,
          PlatformExpenses:0,
          STotalPaymentAmount:0,
          SumTatolJSPrice:0,
          isMermber:0,
          haveSpan:true,
          activeType:true,
          userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
          exitGood: 9, // 点击已退款或者未退款  9已退款  8未退款
        }
    },
    components:{
      wholesaleNav
    },
    created(){
      this.activeType = true;
      let seq = this.$route.query.seq
      let userType = sessionStorage.getItem('userType');
      if(userType){
        this.userType = userType;
      }
      if(seq == null || seq == undefined){
        this.seq = sessionStorage.getItem('seq');
      }else{
        sessionStorage.setItem('seq',seq);
        this.seq =seq;
      };
      // this.inputStartTime = moment(this.startTime).format('YYYY/MM/DD');
      // this.inputEndTime = moment(this.endTime).format('YYYY/MM/DD');
    },
    activated(){
      // this.getOrderData();
    },
    mounted(){
      this.getHeight();
      if(this.$route.query.seq==undefined||this.$route.query.seq==null){
        this.bootmnavHeight = document.querySelector('.nav-box').clientHeight;
      }
      // this.getOrderData();
    },
    methods: {
        changeExitGood(num) {
            this.exitGood = num;
            this.skip = 0;
            this.orderStatus = num;
            this.datas = [];
            this.getOrderData();
        },
      statusText(item) {
        let statusText = ['加入购物车','待支付','待接单','退货退款','仅退款','换货','已完成','退货退款成功','退款成功','换货成功','待发货','待收货'];

        if(item.YN == 4 && item.refundStatus == 1) {
          return '退款中'
        } else if (item.YN == 4 && item.refundStatus == 2) {
          return '退款失败'
        } else if (item.YN == 3 && item.refundStatus == 1) {
          return '退货退款中'
        } else if (item.YN == 3 && item.refundStatus == 2) {
          return '退货退款失败'
        } else {
          return statusText[item.YN];
        }
      },
      getHeight(){
        let self = this;
        let height = sessionStorage.getItem("contentHeight");
        if(height){
          this.tabBoxHeight = height;
        }else{
          self.height();
        }
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
      height(){
        if(this.$route.query.seq==undefined||this.$route.query.seq==null){
          this.tabBoxHeight = document.documentElement.clientHeight
          -101
          -document.querySelector('.topwrap').clientHeight
          sessionStorage.setItem("contentHeight",this.tabBoxHeight);
        }else{
          this.tabBoxHeight = document.documentElement.clientHeight
          -document.querySelector('.mint-header').clientHeight
          -document.querySelector('.topwrap').clientHeight;
        }
      },
      // 是否已改价
      changeBox(isTrue){
        var that = this;
        that.skip = 0;
        that.datas = [];
        that.isShow = isTrue;
        if(that.isShow){
          that.queryJson.gjState = 0;
        }else{
          that.queryJson.gjState = 1;
        }
        that.getOrderData();
      },
      // 是否已结算
      BalanceBox(isTrue){
        var that = this;
        that.skip = 0;
        that.datas = [];
        that.isBalance = isTrue;
        if(that.isBalance){
          that.queryJson.HKJSType = 0;
        }else{
          that.queryJson.HKJSType = 1;
        }
        that.getOrderData();
      },
      // 导航栏
      navClick(index,orderStatus){
        var that = this;
        that.navIndex = index;
        that.skip = 0;
        that.datas = [];
        that.queryJson.salenumber='';
        that.queryJson.StartTime='';
        that.queryJson.EndTime='';
        that.queryJson.PlayType='';
        this.loading = false;
        that.orderStatus = orderStatus;

        if(index == 'tab1'){
          that.queryJson.gjState = 0;
          that.isShow = true;
          that.queryJson.HKJSType = '';
        }else if(index == 'tab7'){
          that.queryJson.HKJSType = 0;
          that.isBalance = true;
          that.queryJson.gjState = '';
          that.order=[];
          that.codeArr='';
          that.money = 0;
          $('.checked').removeClass('hover el-icon-check');
        }else{
          that.queryJson.gjState = '';
          that.queryJson.HKJSType = '';
        }
          if (orderStatus==4){
              that.orderStatus = 9;
          }
        that.getOrderData();
      },
      // 改价盒子
      changePricePopup(code,price){
        var that = this;
        var i = 0;
        that.code = code;
        that.totalPrice = price;
        if(i==0){
          that.changePrice = true;
          i++;
        }else{
          that.changePrice = false;
          i--;
        }
      },
      popupClose(){
        var that = this;
        that.changePrice = false;
      },
      // 筛选弹窗
      showfilter(){
        this.popupVisible2 = true;
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
          let date = moment(data).format('YYYY/MM/DD');
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
          let date = moment(data).format('YYYY/MM/DD');
          this.inputEndTime = date;
        }else{
          Toast({
            message: '结束时间不能小于开始时间！',
            duration: 2000,
            className:'counttc'
          });
        }
      },
      //确定筛选
      sureCheck(){
        var that = this;
        that.navIndex = 'tab0';
        that.datas = [];
        that.skip = 0;
        that.queryJson.salenumber=that.ordernum;
        that.queryJson.StartTime=that.inputStartTime;
        that.queryJson.EndTime=that.inputEndTime;
        that.queryJson.PlayType=that.payType;
        that.queryJson.gjState='';
        that.queryJson.HKJSType='';
        that.popupVisible2 =false;
        that.getOrderData();
        this.reset();
      },
      jumpToOrderDetails(orderCode,seq){
        this.$router.push({path:'/orderDetails?orderCode='+orderCode+'&seq='+seq})
      },
      // 筛选重置
      reset(){
        this.ordernum = '';
        this.inputStartTime = '';
        this.inputEndTime = '';
        this.startTime = new Date();
        this.endTime = new Date();
        this.payment = 2;
        this.payType = '';
      },
      // 筛选弹窗-支付方式样式切换
      curPayment(index){
        this.payment = index;
        if(this.payment == 2){
          this.payType = '';
        }else{
          this.payType = this.payment;
        }
      },
      formatter(data) {
        return data.replace("T", " ").substring(0,19);
      },
      // 获取订单列表数据
      getOrderData(){
        var that = this;
        this.loading = true;
        Indicator.open();
        var url=this.URL+'/OrderNewListInfo/GetBusinessOrdersListJson'
        //如果是区域批发商的话
        if(this.userBlock){
          //请求区域批发商的接口数据，不请求一批二批商中数据
          url=this.URL+'/OrderNewListInfo/GetBusinessOrdersListJson'
        }
        var obj={
          skip:that.skip,
          take:that.take,
          queryJson:that.queryJson,
          WholeSaleSeq:that.WholeSaleSeq,
          orderStatus:that.orderStatus
        }
        //判断商户的身份是否是区域批发商身份
        if(this.userBlock){
          obj.wholesalerType=2
        }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          obj.wholesalerType=1
        }else{
          obj.wholesalerType=0
        }
        axios.get(url,{params:obj,timeout:30000})
        .then((res)=>{
          if(res.data.code == 200){
            that.datas = that.datas.concat(res.data.data);
            that.skip += 5;
            self.order=[];
            this.WholesaleName = that.datas[0].WholesaleName;
            self.codeArr='';
            $('.balanceAllChoose .checked').removeClass('hover el-icon-check');
          }else{
             showToast('暂无更多数据~');
            this.loading = true;
            Indicator.close();
            return false;
          };
          this.loading = false;
          Indicator.close();
        })
        .catch(err => {
          showToast('请求超时');
          Indicator.close();
        })
      },
      loadMore() {
        let self = this;
        self.getOrderData();
      },
      // 改价
      sureChangePrice(){
        var self = this;
        MessageBox({
            title:"",
            message: '是否确定改价?',
            showCancelButton: true
        }).then(action => {
            if(action == 'confirm'){
              axios.get(this.URL + '/OrderNewListInfo/ChangeOrderGjPrice',{params:{
                ordernumber:self.code,WholeSaleSeq:self.WholeSaleSeq,gjprice:parseFloat(this.$refs.changePriceTag.value)
              }})
              .then((res)=>{
                self.getOrderData();
                if(res.data.code == 200){
                  showToast('改价成功');
                  self.popupClose();
                  self.skip = 0;
                  self.datas = [];
                  self.getOrderData();
                }else if(res.data.code == 300){
                  self.popupClose();
                  showToast('订单号未申请改价');
                }else if(res.data.code == 400){
                  self.popupClose();
                  showToast('改价金额不能大于订单金额');
                }else if(res.data.code == 500){
                  showToast('改价失败');
                  self.popupClose();
                }
              })
            }
        });
      },
      // 改价框限制小数点后2位
      checkGJInput(e) {
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
      },
      // 发货
      orderSendSure(code){
        var that = this;
          that.getOrderData();
        MessageBox({
          title:"",
          message: '是否确定发货?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/DeliverGoods',{params:{
              ordernumber:code,WholeSaleSeq:that.seq
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('发货成功！');
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
              }else{
                showToast('订单信息有误！');
                return false;
              }
            })
          }
        });
      },
      // 接单
      orderTaking(code){
        var that = this;
        MessageBox({
          title:"",
          message: '是否确定接单?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/ReceiptOrdernumber',{params:{
              ordernumber:code,WholeSaleSeq:that.seq
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('接单成功');
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
              }else{
                showToast('订单信息有误！');
                return false;
              }
            })
          }
        });
      },
      // 拒绝退货退款
      disRgoods(code){
            var that = this;
             MessageBox({
                  $type:'prompt',
                  title:'',
                  message:'拒绝原因：',
                  showInput:true,
                  showCancelButton:true,
                  inputPattern:/^[\s\S]{0,30}$/,
                  inputErrorMessage:'不能超过30个文字'
             }).then(({ value, action }) => {
               if (action =='confirm') {
                axios.get(this.URL + '/OrderNewListInfo/ConfirmReGoods',{params:{
                    ordernumber:code,refuseReason:value,WholeSaleSeq:that.seq,type:1
                  }})
                  .then((res)=>{
                    if(res.data.code==200){
                      showToast('已拒绝退货退款');
                      that.skip = 0;
                      that.datas = [];
                      that.queryJson.salenumber='';
                      that.queryJson.StartTime='';
                      that.queryJson.EndTime='';
                      that.queryJson.PlayType='';
                      that.getOrderData();
                    }else{
                        showToast(res.data.message);
                        return false;
                      }
                    })
               }else{
              }
          });
      },
      // 拒绝退款
      disRsure(code){
        var that = this;
         MessageBox({
              $type:'prompt',
              title:'',
              message:'拒绝原因：',
              showInput:true,
              showCancelButton:true,
              inputPattern:/^[\s\S]{0,30}$/,
              inputErrorMessage:'不能超过30个文字'
         }).then(({ value, action }) => {
           if (action =='confirm') {
            axios.get(this.URL + '/OrderNewListInfo/ConfirmRefund',{params:{
                ordernumber:code,refuseReason:value,WholeSaleSeq:that.seq,type:1
              }})
              .then((res)=>{
                if(res.data.code==200){
                  showToast('已拒绝退款');
                  that.skip = 0;
                  that.datas = [];
                  that.queryJson.salenumber='';
                  that.queryJson.StartTime='';
                  that.queryJson.EndTime='';
                  that.queryJson.PlayType='';
                  that.getOrderData();
                }else{
                    showToast(res.data.message);
                    return false;
                  }
                })
           }else{
          }
      });
      },
      // 退款
      refundSure(code){
        var that = this;
        MessageBox({
          title:"",
          message: '是否同意退款?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/ConfirmRefund',{params:{
              ordernumber:code,WholeSaleSeq:that.seq,type:0
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('退款成功');
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
              }else{
                showToast('订单信息有误！');
                return false;
              }
            })
          }
        });
      },
      // 退货退款
      reAllSure(code){
        var that = this;
        MessageBox({
          title:"",
          message: '是否同意退货退款?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/ConfirmReGoods',{params:{
              ordernumber:code,WholeSaleSeq:that.seq,type:0
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('退货退款成功！');
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
              }else{
                showToast('订单信息有误！');
                return false;
              }
            })
          }
        });
      },
      // 添加选中的货单
    addArr(obj){
      for(var i=0;i<this.order.length;i++){
        if(this.order[i].ordernumber == obj.salenumber) return false;
      };
        this.order.push({
          ordernumber: obj.salenumber,
          totalPrice: obj.TotalPaymentAmount
          // sku: obj.sku,
          // num: obj.buycount
        });
    },
    // 删除选中的货单
    removeArr(obj){
      for(var i=0;i<this.order.length;i++){
        if(this.order[i].ordernumber == obj.id){
          this.order.splice(i,1);
          return false
        }
      }
    },
    // 计算总金额数
    moneyfn(){
      this.money = 0;
      let text = '';
      this.order.forEach(res => {
        text += res.ordernumber+',';
        this.money+=res.totalPrice;
      });
        // this.datas.forEach(post => {
          // if(text.indexOf(post.ordernumber) != -1) this.money += post.dlprice*post.buycount;
          // this.moneyAll += post.dlprice*post.buycount;
        // });
    },
      // 单个店铺全选
    listAll(event,p,data){
      let elem = event.currentTarget;
      let checked = $(elem).closest('.aitem').find('.checked');
      if(elem.className.indexOf('hover') == -1){
        // data.ordersdtl.forEach(post => {
          this.addArr(data);
        // });
        $(elem).addClass('hover el-icon-check');
        checked.addClass('hover el-icon-check');
      }else{
        // data.ordersdtl.forEach(post => {
          this.removeArr(data);
        // });
        $(elem).removeClass('hover el-icon-check');
        checked.removeClass('hover el-icon-check');
      };
      this.judgeAllCheck();
      this.checklist = this.order.length;
      this.moneyfn();
    },
    allCheck(event){
      let elem = event.currentTarget;
      if(elem.className.indexOf('hover') == -1){
          this.datas.forEach(post => {
            if(post.HKJSState == 1){

            }else{
              this.addArr(post);
            }
          });
        $('.checked').addClass('hover el-icon-check');
      }else{
          this.datas.forEach(post => {
              this.order=[],
              this.codeArr='',
              this.money = 0;
              this.removeArr(post);
          });
        $('.checked').removeClass('hover el-icon-check');
      };
      this.checklist = this.order.length;
      this.moneyfn();
    },
    // 判断是否所有店铺已经选择
    judgeAllCheck(){
      let checkelem = $('.applyList .checked');
      for(var i=0;i<checkelem.length;i++){
        if(checkelem.get([i]).className.indexOf('hover') == -1){
          $('.balanceAllChoose .checked').removeClass('hover el-icon-check');
          return false;
        }
      };
      $('.balanceAllChoose .checked').addClass('hover el-icon-check');
      return true;
    },
    // 结算选择购物商品
    setbut(){
      if(this.order.length == 0){
        Toast('请选择要结算的订单！');
        return false;
      }else{
        var that = this;
        that.codeArr = '';
        for(var i = 0;i<that.order.length;i++){
          that.codeArr+=that.order[i].ordernumber+',';
        }
        if(that.codeArr != ''){
          that.codeArr = that.codeArr.substring(0,that.codeArr.length-1)
        }
        axios.get(this.URL + '/OrderNewListInfo/NewApplicationPaymentSettlement',{params:{
          salenumber:that.codeArr,
          WholesaleSeq:that.seq,
          WholesaleName:that.WholesaleName
        }})
        .then((res)=>{
          if(res.data.code==200){
            that.PlatformExpenses = res.data.data.PlatformExpenses;
            that.STotalPaymentAmount = res.data.data.STotalPaymentAmount;
            that.SumTatolJSPrice = res.data.data.SumTatolJSPrice;
            that.isMermber = res.data.data.isMermber;
            this.balancePopup = true;
          }
        })
      }
    },
    applyBalance(){
        var that = this;
        if(that.isSingle){
          that.codeArr=that.jsid;
        }else if(this.order.length == 0){
          Toast('请选择要结算的订单！');
          return false;
          }else{
            var that = this;
            that.codeArr = '';
            for(var i = 0;i<that.order.length;i++){
              that.codeArr+=that.order[i].ordernumber+',';
            }
            if(that.codeArr != ''){
              that.codeArr = that.codeArr.substring(0,that.codeArr.length-1)
            }
          }
        MessageBox({
          title:"",
          message: '是否确定结算?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/NewApplicationPaymentSettlement',{params:{
              salenumber:that.codeArr,
              WholesaleSeq:that.seq,
              WholesaleName:that.WholesaleName
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('结算申请已提交！');
                that.codeArr = '';
                // that.balancePopup = false;
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
                this.order = [];
                // this.moneyfn();
              }else if(res.data.code == 300){
                showToast('订单信息有误！');
                // that.balancePopup = false;
              }
            })
          }
        });
      },
    closeBalancePopup(code,name){
      this.balancePopup = false;
    },
    setbut2(id,name){
      var that = this;
      that.WholesaleName = name;
      that.orderId = id;
      axios.get(this.URL + '/OrderNewListInfo/GetPlatformExpenses',{params:{
        ordernumber:that.orderId,
        WholesaleSeq:that.seq
      }})
      .then((res)=>{
        if(res.data.code==200){
          that.PlatformExpenses = res.data.data.PlatformExpenses;
          that.STotalPaymentAmount = res.data.data.STotalPaymentAmount;
          that.SumTatolJSPrice = res.data.data.SumTatolJSPrice;
          that.isMermber = res.data.data.isMermber;
          this.balancePopup = true;

        }else{
          showToast('订单信息有误！');
        }
      })
    },

// 单个申请结算
  setbutSingle(salenumber,name){
    var that = this;
    that.isSingle = true;
    that.WholsaleName = name;
    that.jsid = salenumber;
    MessageBox({
          title:'',
          message:'申请结算该订单？',
          showCancelButton:true
     })
    .then(action=>{
      if (action =='confirm') {
        axios.get(this.URL + '/OrderNewListInfo/NewApplicationPaymentSettlement',{params:{
            salenumber:that.jsid,
            WholesaleSeq:that.seq,
            WholesaleName:that.WholsaleName
          }})
        .then((res)=>{
          if (res.data.code==200) {
            showToast('申请结算成功');
            that.skip = 0;
            that.datas = [];
            that.queryJson.salenumber='';
            that.queryJson.StartTime='';
            that.queryJson.EndTime='';
            that.queryJson.PlayType='';
            that.getOrderData();
          }else {
            showToast('订单信息有误！');
          }
        })
      }
     })
  },

    applyBalance2(){
        var that = this;
        MessageBox({
          title:"",
          message: '是否确定结算?',
          showCancelButton: true
        }).then(action => {
          if(action == 'confirm'){
            axios.get(this.URL + '/OrderNewListInfo/ApplicationPaymentSettlement',{params:{
              ordernumber:[that.orderId],
              WholesaleSeq:that.seq,
              WholesaleName:that.WholesaleName
            }})
            .then((res)=>{
              if(res.data.code == 200){
                showToast('结算申请已提交！');
                that.codeArr = '';
                that.balancePopup = false;
                that.skip = 0;
                that.datas = [];
                that.queryJson.salenumber='';
                that.queryJson.StartTime='';
                that.queryJson.EndTime='';
                that.queryJson.PlayType='';
                that.getOrderData();
                this.order = [];
              }else if(res.data.code == 300){
                showToast('订单信息有误！');
                that.balancePopup = false;
              }
            })
          }
        });
      },
  },
    // 判断返回页面不刷新
    beforeRouteLeave(to,from,next){
      if(to.name == 'orderDetails'){
        from.meta.keepAlive = true;
      }else{
        from.meta.keepAlive = false;
      };
      next();
    }
}
</script>
<style scoped>
@import '../../assets/css/orderManage.css';
</style>
<style>
    .global #filterwrap{
        padding-top: 46px !important;
    }
    .global .mint-header{
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
    }
    .exitGood div{
        width: 50%;
        text-align: center;
    }
    .activGood{
        background:rgba(255,96,35,1) !important;
        color: #fff !important;
    }
  .mint-indicator-mask{
      z-index: 1000 !important;
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
  .active{
      background: rgba(255,238,231,1) !important;
      color:rgba(255,96,35,1) !important;
  }
    .topnav ul li.lihover{
        color: #FF6023FF;
    }
    .global .topnav ul li i{
        background: #FF6023FF;
    }
</style>
