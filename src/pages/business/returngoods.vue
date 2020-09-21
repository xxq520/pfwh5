<template>
   <div class="global">
     <topnav :top='topnav'></topnav>
     <div class="content" v-for="(item,i) in data" :key="i">
       <div class="goods">
         <!-- 商品详情区 -->
          <div class="detailcontent" v-for="(pitem,index) in item.ordersdtl" :key="index">
            <img :src="pitem.ProductImg" alt="">
            <div class="goodsname">
                <div class="line">
                    <span class="godname">{{pitem.name}}</span>
                </div>
                <div class="line">
                    <span class="godnum"> <i>{{pitem.buycount}}</i>{{pitem.unitName}}</span>
                    <span class="num">X<i>{{pitem.buycount}}</i></span>
                </div>
                <div class="line">
                    <span class="godnum">规格:<i>{{pitem.other1Name}}</i></span>
                </div>
            </div>
          </div>
       </div>
       <!-- 退款原因 -->
       <div class="reason">
         <div class="details">
           <span>退款原因<i style="color:#f00">*</i>：</span>
           <textarea v-model="reason"></textarea>
         </div>
         <div class="money">退款金额：<span style="color:#ff0000">{{item.TotalPaymentAmount}}元</span></div>
       </div>
       <div class="others">
         <div class="ordernum">订单号：<span>{{item.salenumber}}</span></div>
         <span class="seven">七天无理由退换</span>
       </div>
       <div class="btnwrapreturn">
          <mt-button  class="btn" type="default" @click="toreturndetails">提交</mt-button>
        </div>
     </div>
   </div>
</template>

<script type="text/javascript">
import {showToast} from '../../assets/js/common.js'
export default {
   name: 'ReturnGoods',
   data() {
       return {
         topnav:{
           title:'退货退款申请'
         },
         seq:sessionStorage.getItem('seq'),
         salenumber:'',
         name:'',
         buycount:'',
         unitName:'',
         reason:'',
         TatolPrice:'',
         ProductImg:'',
         data:[],
         userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
       }
   },
   mounted(){
     document.querySelector("body").setAttribute("style","background-color: #f1f2f5");//切换本页body背景颜色
     this.salenumber = this.$route.query.salenumber
    //  this.ProductImg = this.$route.query.ProductImg
    //  this.name = this.$route.query.name
    //  this.buycount = this.$route.query.buycount
    //  this.unitName = this.$route.query.unitName
    //  this.TatolPrice = this.$route.query.TatolPrice
     this.getOrderInfo();
   },
   methods: {
     getOrderInfo(){
      var objData={
         seq:this.seq,skip:0,take:1,queryJson:{salenumber:this.$route.query.salenumber},orderStatus:0
       }
        //判断如果是登录的区域批发商的身份则加加上字段
      if(this.userBlock){
          objData.wholesalerType=2
      }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          objData.wholesalerType=1
      }else{
          objData.wholesalerType=0
      }
       axios.get(this.URL + '/BusinessOrders/GetBusinessOrdersListJson',{params:objData})
       .then((res)=>{
         if(res.data.code == 200){
           this.data = res.data.data;
           console.log(this.data)
         }
       })
     },
     //退款退货
     toreturndetails(){
        if(this.reason == ''|| this.reason == null){
            showToast('退款退货理由不能为空！')
        }else{
            MessageBox({
                message: '您是否确定要退货退款?',
                title:'',
                confirmButtonText:'是',
                cancelButtonText:'否',
                showCancelButton: true,
                confirmButtonClass: 'confirbutton',
                cancelButtonClass:'cancelbutton'
            }).then(action => {
                if (action == 'confirm') {
                    axios.post(this.URL + '/BusinessOrders/SetOrdersAllRefund',{seq:this.seq,salenumber:this.salenumber,reason:this.reason}).then(res=>{
                        if (res.status == 200) {
                            if (res.data.code == 200) {
                            console.log(res);
                            showToast(res.data.message,'middle')
                            setTimeout(() => {
                            this.$router.push({path:'./myorder'})//填完退款信息，回到订单首页，可以查看退款进度
                            }, 1000);
                        }else{
                            showToast(res.data.message,'middle')
                            setTimeout(() => {
                            this.$router.push({path:'./myorder'})
                            }, 1500);
                            }
                        }else{
                            setTimeout(() => {
                                showToast('请重试','middle')
                            }, 2000);
                        }
                    })
                }
            })
            
        }
     }
   }
}
</script>

<style scoped>
@import '../../assets/css/returngoods.css';
</style>
