<template>
   <div class="global">
     <!-- <topnav :top='topnav'></topnav> -->
     <mt-header title="退款详情">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
     <div class="content">
       <div class="title">
         <span>{{RefundStatus == 0 ?'待处理':RefundStatus==1?'处理中':RefundStatus==2?'退款失败':'退款成功'}}</span>
         <span v-if="RefundStatus==3 || RefundStatus==2">{{formatter(UpdateDate)}}</span>
       </div>
       <div class="returnmoney">
          <span class="totalm">退款总金额<i style="color:#ff0005">￥{{RefundAmount}}</i></span>
          <span class="bank">返回银行卡<i>￥{{RefundAmount}}</i></span>
       </div>
       <div class="progressbar">
            <el-steps :active="proV" finish-status="success">
                <el-step :title="this.WholesaleAudit == 0 ? '卖家待审核':this.WholesaleAudit == 1 ?'卖家审核通过':'卖家审核拒绝'"></el-step>
                <el-step :title="this.FinanceAudit == 0 ? '银行待审核':this.FinanceAudit == 1 ?'银行审核通过':'银行审核拒绝'"></el-step>
                <el-step :title="this.AppropriationAudit == 0 ? '待银行拨款':this.AppropriationAudit == 1 ?'退款成功':'拨款拒绝'"></el-step>
            </el-steps>
      </div>
       <!-- 退款信息 -->
       <div class="details">
         <div class="detailtitle">退货信息</div>
         <div class="goods" v-for="(item,index) in goods" :key="index">
            <!-- 商品详情区 -->
            <img :src="item.ProductImg" alt="">
            <div class="goodsname">
                <div class="linee">
                    <span class="godname">{{item.name}}</span>
                </div>
                <div class="linee">
                    <span class="godnum"><i>{{item.buycount}}</i>{{item.unitName}}</span>
                </div>
                <div class="line">
                    <span class="godnum">规格:<i>{{item.other1Name}}</i></span>
                </div>
            </div>
         </div>
         <div class="returndetails">
           <div>退货原因：<i>{{reason}}</i></div>
           <div>退款金额：<i>￥{{TatolPrice}}</i></div>
           <div>申请时间：<i>{{formatter(CreateDate)}}</i></div>
           <div>退货编号：<i>{{RefundNo}}</i></div>
         </div>
       </div>
     </div>
   </div>
</template>

<script type="text/javascript">
import $ from 'jquery'
export default {
   name: 'returnDetails',
   data() {
       return {
        //  topnav:{
        //    title:'退款详情'
        //  },
         seq:sessionStorage.getItem('seq'),
         salenumber:'',
         reason:'',
         TatolPrice:'',
         goods:[],//退货信息的总数据
         RefundAmount:'',//退款总金额
         CreateDate:'',//退款创建时间
         UpdateDate :'',//退款审核时间
         RefundNo:'',//退款编号
         RefundStatus:'',//退款状态 0 待处理 1 处理中 2 退款失败 3 退款成功
         proV:new Number,//控制退款进度数据
         WholesaleAudit:'',// 批发商审核状态  0 待审核 1 审核通过 2 审核拒绝（卖家退款）
         AppropriationAudit:'',// 财务拨款状态 0 待拨款 1 已拨款 2 拒绝拨款  '发起申请-财务审核-批发商审核-财务拨款-退款完成'
         FinanceAudit:'',// 财务审核状态 0 待审核 1 审核通过 2 审核拒绝 (银行受理)
       }
   },
   mounted(){
     this.salenumber = this.$route.query.salenumber
     // 退款详情进度
      // /BusinessOrders/GetOrdersRefundDetail?seq={seq}&salenumber={salenumber}
       axios.get(this.URL + '/BusinessOrders/GetOrdersRefundDetail?seq='+this.seq+'&salenumber='+this.salenumber)
        .then(res=>{
          if (res.status == 200) {
            let data = res.data.data
            // console.log('退款详情查出来的数据',data);
            //退款状态
            if (data.UpdateDate == null) {
              this.UpdateDate = '审核时间暂未更新'
            }else{
              this.UpdateDate  = data.UpdateDate
            }
            // //状态更新
            this.AppropriationAudit = data.AppropriationAudit
            this.FinanceAudit = data.FinanceAudit
            this.WholesaleAudit = data.WholesaleAudit
            this.RefundStatus = data.RefundStatus

            //创建时间
            this.CreateDate = data.CreateDate
            //退款金额
            this.RefundNo = data.RefundNo
            //退款原因
            this.reason = data.RefundReason
            //商品数据绑定更新
            let order = data.orders
            this.goods = order.ordersdtl
            // console.log(order);
            this.TatolPrice = (order.TotalPaymentAmount).toFixed(2); //退款信息中的退款金额
            this.RefundAmount = (order.TotalPaymentAmount).toFixed(2) //退款总金额
            if (data.WholesaleAudit == '1') {
              //退款进度状态控制
              this.proV = 1//1表示 第一个状态点亮
            }
            if (data.FinanceAudit == 1 && data.WholesaleAudit == 1) {
              this.proV = 2
            }
            if (data.AppropriationAudit == 1 && data.FinanceAudit == 1 && data.WholesaleAudit == 1) {
              this.proV = 3
            }
          }else{
            setTimeout(() => {
              showToast('请重试','middle')
            }, 2000);
          }
        })

      document.querySelector("body").setAttribute("style","background-color: #f5f5f5");//切换本页body背景颜色
   },
   methods: {
     formatter(data) {
        return data.replace("T", " ").substring(0,19);
    },
    back(){
        this.$router.go(-1);
    },
   }
}
</script>
<style scoped>
@import '../../assets/css/returndetails.css';
</style>
<style>
  .progressbar{
    background: #f5f5f5;
    padding: .5rem 2.5rem;
  }
  .progressbar .el-step__main{
    margin-left: -25px;
  }
  .progressbar .el-step__title{
    color: #999;
	  font-size: .5778rem /* 26/45 */;
  }
  .progressbar .el-step.is-horizontal .el-step__line{
    top: .8rem
  }

</style>
