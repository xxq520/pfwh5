<template>
   <div class="glo">
     <topnav :top='topnav'></topnav>
     <div id="tab1"  class="statecontent showcontent">
        <div class="orderdetail" v-for="(item,index) in nedPayList" :key="index">
              <!-- 订单号区 -->
              <router-link class="detailtop" :to="'/wholesale/orderDetails?orderCode='+item.salenumber+'&seq='+seq">
                <div class="ordernum" style="font-size:16px">店铺名称：<span>{{item.WholesaleName}}</span></div>
                <span class="changestate" v-if="item.gjType == 1">{{item.gjState == 0?'申请改价中':item.gjState == 1?'改价通过':'改价未通过'}}</span>
                <span class="changestate" v-if="item.gjType == 0">
                  {{item.YN == 1?'待支付':item.YN == 2?'已付款':item.YN == 3?'退货退款中':item.YN == 4?'退款中':item.YN == 6?'已收货':item.YN == 7?'退货退款成功':item.YN == 8?'退款成功':item.YN == 10?'待发货':'待收货'}}
                </span>
              </router-link>
              <!-- 商品详情区 -->
              <div class="detailcontent" >
                <div id="gg" v-for="(glist,t) in item.ordersdtl" :key="t">
                  <img :src="glist.ProductImg" alt="">
                  <div class="goodsname">
                      <div class="line">
                          <span class="godname">{{glist.name}}</span>
                          <span class="price">￥<i>{{glist.dlprice}}</i></span>
                      </div>
                      <div class="line">
                          <span class="godnum"> <i>{{glist.buycount}}</i><i>{{glist.unitName}}</i></span>
                          <span class="num">X <i>{{glist.buycount}}</i></span>
                      </div>
                      <div class="line">
                          <span class="godnum">规格:<i>{{glist.other1Name}}</i></span>
                      </div>
                      <div class="line" id="total">总金额￥<i>{{glist.TatolPrice}}</i></div>
                  </div>
                </div>
              </div>
              <!-- 结账信息区 -->
              <div class="other">
                <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
                <div class="totalgood" v-if="item.gjType == 1 && item.gjState == 1">共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{item.TatolPrice}}元</i></div>
                <div class="totalgood" v-else>共 <i>{{item.TotalBuyCount}}</i>件商品，合计 <i style="color:#e4393c;font-size:.7111rem">{{item.TotalPaymentAmount}}元</i></div>
                <div class="ordertime">下单时间：<i>{{formatter(item.ordertime)}}</i></div>
                <div class="changetotal" v-if="item.gjType == 1 && item.gjState == 1">改后合价：<i>￥{{item.TotalPaymentAmount}}元</i></div>
              </div>
              <!-- 支付/取消按钮 -->
              <div class="btnwrap">
                  <mt-button type="default" id="cancl" v-if="item.YN == 1" @click="nPsurecancl(item.salenumber)">取消订单</mt-button>
                  <mt-button type="default" id="pay" v-if="item.YN == 1" @click="showPay(item)">立即支付</mt-button>
                  <mt-button type="default" id="pay"  v-if="item.YN == 2 || item.YN == 11" @click="surereceive(item.salenumber)">确认收货</mt-button>
                  <!-- <mt-button type="default" id="pay" v-if="item.PlayType != 0 && item.islock == 0 && item.YN == 3" @click="returngoods(item.salenumber)">申请退/货款</mt-button> -->
                  <mt-button type="default" id="pay" v-else-if="item.PlayType != 0 && item.islock == 0 && item.YN == 3 || item.YN == 7" @click="returnDetails(item.salenumber)">退货详情</mt-button>
                  <!-- <mt-button type="default" id="pay" v-if="item.PlayType != 0 && item.islock == 0 && item.YN == 4" @click="returngoods1(item.salenumber)">申请退款</mt-button> -->
                  <mt-button type="default" id="pay" v-else-if="item.YN == 4 && item.PlayType != 0 && item.islock == 0 || item.YN == 8" @click="returnDetails(item.salenumber)">退款详情</mt-button>
              </div>
        </div>
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
             <div class="ways" @click="ways('线下支付')">
                 <p>线下支付</p>
                 <span class="el-icon-circle-check" v-show="amount=='线下支付'"></span>
             </div>
             <div class="surebtn">
               <mt-button class="btn" type="default" @click="gotopay">立即付款</mt-button>
             </div>
        </div>
      </mt-popup>
   </div>
</template>
<script type="text/javascript">
import {showToast} from '../../assets/js/common.js'
export default {
   name: 'orderFilter',
   data() {
       return {
         topnav:{
            title:'筛选结果'
         },
         url:'',
         fromApp:false,
         nedPayList:'',//当前状态下的所有订单列表
         goodsList:[],//每一条订单下的商品列表
         gjType:'',//0 未申请价 1 申请改价
         gjState:'',// 0 待审核 1 改价通过 2 改价未通过
         paymoney:'',//支付弹窗所示价格合计
         amount: '线上支付',
         shift:false,//立即支付弹窗显示控制
         zhifutext:'银联支付',
         seq:sessionStorage.getItem('seq'),//商家seq
         skip:'0',//起始行数(从第几条开始，默认0),
         take:5,//返回总行数
         queryJson:{},//查询条件,(salenumber 订单号搜索关键字, StartTime 订单起始时间, EndTime 订单结束时间, PlayType 支付类型 0 线下支付/1 线上支付)
         orderState:'',//订单状态(1 待支付 2 待收货 3 待发货 4 退/换货 5 已完成)
         nedPayList:[],//当前状态下的所有订单列表
         userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
       }
   },
    created(){
      let fromApp = sessionStorage.getItem('app');
      if(fromApp){
        this.fromApp = fromApp;
        console.log
      }
    },
   mounted(){
    //this.nedPayList
    document.querySelector("body").setAttribute("style","background-color: #f5f5f5");//切换本页body背景颜色
    let decodeJson = new Object();
    if(this.$route.query.sjData){
      decodeJson = JSON.parse(decodeURIComponent(this.$route.query.sjData));
      this.url = '/BusinessOrders/GetBusinessOrdersListJson';
    }else if(this.$route.query.pfData){
      decodeJson = JSON.parse(decodeURIComponent(this.$route.query.pfData));
      this.url = '/OrderNewListInfo/GetBusinessOrdersListJson';
    }
    this.getOrderList(decodeJson);
   },
   methods: {
     //  确认收货弹窗
    surereceive(salenumber){
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
                setTimeout(() => {
                  this.$router.push({path:'./myorder'})
                }, 1000);
              }else{
                setTimeout(() => {
                  showToast('请重试','middle')
                }, 2000);
              }
            })
          }
          console.log('cancle')
        })
    },
       //获取商家订单列表
    getOrderList(val){
      var that = this;
      //判断如果是登录的区域批发商的身份则加加上字段
      if(this.userBlock){
          val.wholesalerType=2
      }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          val.wholesalerType=1
      }else{
          val.wholesalerType=0
      }
      axios.get(this.URL + this.url,{params:val})
      .then(res => {
      if (res.code = 200) {
        that.prodblur = true;
        that.nedPayList = res.data.data;
        that.gjType = that.nedPayList.gjType
        console.log('godds列表',that.nedPayList);
      }else{
        setTimeout(() => {
          showToast('请重试','middle')
        }, 1000);
      }
      });
    },
     //  待支付--取消订单弹窗
    nPsurecancl(salenumber){
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
                setTimeout(() => {
                  this.$router.push({path:'./myorder'})
                }, 1000);
              }else{
                setTimeout(() => {
                  showToast('请重试','middle')
                }, 2000);
              }
            })
          }
          console.log('cancle')
        })
    },
    //支付弹窗显示
    showPay(item){
      this.paymoney = item.TatolPrice
      this.salenumber = item.salenumber
      this.shift = true
    },
     //关闭支付弹窗
    close(){
      this.shift = false
    },
    //支付方式选择控制
    ways(val){
      this.amount = val;
    },
    // 日期截取
    formatter(data) {
        return data.replace("T", " ").substring(0,19);
    },
    //跳转去支付页面
    gotopay(){
      if (this.amount == '线下支付') {
        this.amount = 0
        axios.post(this.URL + '/OrdersPay/SetOrdersOfflinePay',{salenumber:this.salenumber,seq:this.seq}).then(res=>{
          if (res.status == 200) {
            showToast(res.data.message,'middle')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000);
          }
        })
      }else if (this.amount == '线上支付') {
        this.amount = 1
        if(this.fromApp){
          let salenumber = this.salenumber;
          let iSeq = this.seq;
          window.action.AppGoPay(salenumber,iSeq);
        }else{
          window.location.href = this.PAY+this.salenumber+'&seq='+this.seq;
        }
        // window.location.href = 'http://192.168.1.36:8077/home/indexwap?comefrom=10019&busimode=2&salenumber='+this.salenumber+'&seq='+this.seq
      }
    },
    //  申请退款
    returngoods1(salenumber){
      let pathData = ''
      for (const j in this.nedPayList) {
        if (this.nedPayList[j].salenumber == salenumber) {
          const p = this.nedPayList[j].ordersdtl
          for (const k in p) {
            pathData = p[k]
          }
        }
      }
      let params={
        ProductImg:pathData.ProductImg,
        salenumber:salenumber,
        name:pathData.name,
        buycount:pathData.buycount,
        unitName:pathData.unitName,
        TatolPrice:pathData.TatolPrice,
      }
     this.$router.push({path:'/returnmoney',query:params})
    },
     //  退换货
    returngoods(salenumber){
      let pathData = ''
      for (const j in this.nedPayList) {
        if (this.nedPayList[j].salenumber == salenumber) {
          const p = this.nedPayList[j].ordersdtl
          for (const k in p) {
            pathData = p[k]
          }
        }
      }
      let params={
        ProductImg:pathData.ProductImg,
        salenumber:salenumber,
        name:pathData.name,
        buycount:pathData.buycount,
        unitName:pathData.unitName,
        TatolPrice:pathData.TatolPrice,
      }
     this.$router.push({path:'/returngoods',query:params})
    },
     //退货/款详情页面查看
    returnDetails(salenumber){
      this.$router.push({path:'./returndetails',query:{seq:this.seq,salenumber:salenumber}})
    },
   }
}
</script>

<style>
  .glo .orderdetail .detailtop{
    height: 2rem /* 90/45 */;
    line-height: 2rem;
    padding: 0 .5rem;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
    margin-top: .4444rem /* 20/45 */;
}
.glo .orderdetail .detailtop .ordernum{
    font-size: .5778rem /* 26/45 */;
    color:#666;
    display: inline-block;
}
.glo .orderdetail .detailtop .changestate{
    font-size: .6222rem /* 28/45 */;
    color: #ed1414;
    position: absolute;
    right: .4444rem /* 20/45 */;
}
.glo .orderdetail .detailcontent{
    padding: 0 .5rem;
    /* height: 4.2222rem; */
    border-top: 1px solid #e6e6e6;
    background: #f9f9f9;
}
.glo .orderdetail .detailcontent img{
    width: 3.3333rem /* 150/45 */;
    height: 3.3333rem /* 150/45 */;
    float: left;
}
.glo .orderdetail .detailcontent .goodsname{
    width: 77%;
    float: left;
    padding-left: .6667rem /* 30/45 */;

}
.glo .orderdetail .detailcontent .goodsname .line{
    display: flex;
    justify-content: space-between;

}
.glo .orderdetail .detailcontent .goodsname #total{
    display: flex;
    justify-content: flex-end;
    margin-top: .1rem;
}
.glo .orderdetail .detailcontent .goodsname .godname{
    font-size: .7111rem /* 32/45 */;
    color: #212121;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    height: 1rem

}
.glo .orderdetail .detailcontent .goodsname .price{
    font-size: .6222rem /* 28/45 */;
    color: #212121;
}
.glo .orderdetail .detailcontent .goodsname .godnum{
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.glo .orderdetail .detailcontent .goodsname .num{
    font-size: .5333rem /* 24/45 */;
    color: #999999;
}
.glo .orderdetail .detailcontent .goodsname #total{
    font-size: .5333rem /* 24/45 */;
    color: #9c9c9c;
}
.glo .orderdetail .totalgood{
    font-size: .6222rem /* 28/45 */;
    color: #666;
}
.glo .orderdetail .ordertime, .changep, .changetotal{
    font-size: .5778rem /* 26/45 */;
    color: #666;
    margin-top: .6667rem /* 30/45 */;
    width: 100%;
    text-align: right;
}
.glo .orderdetail .other{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding: .5556rem /* 25/45 */ .5rem;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
}
.glo .orderdetail .btnwrap{
    padding: .4444rem /* 20/45 */ .5rem;
    display: flex;
    justify-content: flex-end;
    background: #fff;
}
.glo .orderdetail .btnwrap #pay{
    margin-left: .6222rem /* 28/45 */;
    font-size: .6222rem /* 28/45 */;
    color: #ff0025;
    background-color: #fff;
    border: 1px solid #ff0025;
    box-shadow: none;
    height: 1.2222rem /* 55/45 */;
}
.glo .orderdetail .btnwrap #cancl{
    font-size: .6222rem /* 28/45 */;
    color: #212121;
    background-color: #fff;
    border: 1px solid #999999;
    box-shadow: none;
    height: 1.2222rem /* 55/45 */;
}

</style>
