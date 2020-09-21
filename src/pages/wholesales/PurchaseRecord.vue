<template>
    <div class="purchase-record">
        <mt-header title="下游订单查询" class="header">
            <!-- <router-link slot='left' to="/wholesale/storeManagement"> -->
                <mt-button slot="left" icon='back' @click="()=>{this.$router.go(-1)}"></mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="all-btn" @click="checkAll">全部订单</div>
        <div class="wap-con">
            <div class="block">
                <el-input placeholder="开始日期" suffix-icon="el-icon-date" v-model="startDate" @focus="openPicker(2)" readonly class="date-input"></el-input>
                <i class="el-icon-sort"></i>
                <el-input placeholder="结束日期" suffix-icon="el-icon-date" v-model="endDate" @focus="openPicker(3)" readonly class="date-input"></el-input>
                <el-button type="primary" @click="setTime">查询</el-button>
            </div>
        </div>
        <mt-datetime-picker
            v-model="pickerVisible"
            type="date"
            ref="picker"
            year-format="{value}"
            month-format="{value}"
            date-format="{value}"
            @confirm="handleConfirm"
            >
        </mt-datetime-picker>
        <mt-loadmore class="goods-con" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" v-if="resArry.length>=1" :bottomPullText="bottomeText">
            <div class="goods-list">
                <div class="goods-item" v-for="(item,index) in resArry" :key="index" @click="details(item.salenumber,item.SEQ)">
                    <div class="item-top">
                        <p class="item-order">订单号：{{item.salenumber}}</p>
                        <p class="item-status">{{statusText[index]}}</p>
                    </div>
                    <div class="goods-desc">
                        <div class="img-con">
                            <img :src="item.ordersdtl[0].ProductImg" alt="">
                        </div>
                        <div class="goods-text">
                            <div class="goods-nature">
                                <p class="goods-name">{{item.ordersdtl[0].name}}</p>
                                <p class="goods-price">¥{{item.ordersdtl[0].dlprice.toFixed(2)}}</p>
                            </div>
                            <div class="goods-nature">
                                <p>{{item.ordersdtl[0].other1Name}}</p>
                                <p>x {{item.ordersdtl[0].buycount}}{{item.ordersdtl[0].unitName}}</p>
                            </div>
                            <div class="total-price">总金额：¥{{item.ordersdtl[0].TatolPrice.toFixed(2)}}</div>
                        </div>
                    </div>
                    <div class="goods-info">
                        <div class="info-item">
                            <p>合计：</p>
                            <p>（共{{item.ordersdtl[0].buycount}}件商品）<span class="price">¥{{item.ordersdtl[0].TatolPrice.toFixed(2)}}</span></p>
                        </div>
                        <div class="info-item">
                            <p>支付方式：</p>
                            <p>{{item.PlayType==null?"待支付":item.PlayType==0?"线下支付":"银联支付"}}</p>
                        </div>
                        <div class="info-item">
                            <p>下单时间：</p>
                            <p>{{item.ordertime.replace("T"," ").substr(0,19)}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </mt-loadmore>
        <div class="no-data" v-else>
            暂无数据
        </div>
    </div>
</template>
<script>
// import purchaseRecord from "@/components/DateTimeChoose";
import {showToast} from "@/assets/js/common.js";
export default {
    data(){
        return {
            startDate: '',//开始时间
            endDate: '',//结束时间
            pickerVisible: new Date(),
            selectTimeIndex:0,
            allLoaded:false,
            resArry:[],//返回数据
            pages:1,//当前页数
            totalPage:1,//总页数
            statusText:[],//状态文案
            bottomeText:"上拉加载"
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        //开启时间选择
        openPicker(index) {
            this.$refs.picker.open();
            this.selectTimeIndex = index;
        },
        // 时间格式化
        formatDate(date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            return y+ '-' + m + '-' + d;
        },
        // 获取选中时间
        handleConfirm (data) {
            let date = this.formatDate(this.$refs.picker.value);
            switch(this.selectTimeIndex){
                case 1:
                    this.time = date;
                    break;
                case 2:
                    this.startDate = date;
                    break;
                case 3:
                    this.endDate = date;
                    break;
            }
        },
        loadBottom() {
          // 加载更多数据
         // 若数据已全部获取完毕
          this.getData();
          this.$refs.loadmore.onBottomLoaded();
      },
      // 获取数据
      getData(){
        let that = this;
         this.allLoaded = true;
         that.resArry=[];
         if(this.pages > this.totalPage){
            this.bottomeText = "暂无更多数据";
            return false;
         }
        let params = {
            WholesaleSeq:sessionStorage.getItem("seq"),
            UserSeq:that.$route.query.id,
            queryJson:{
                StartTime:that.startDate,
                EndTime:that.endDate
            },
            page:that.pages,
            row:10
        }
        axios.get(that.URL + "/OrderNewListInfo/GetDownstreamBusinessOrdersList",{params:params}).then(res=>{
            if(res.data.code == 201){
                that.resArry = []
            }
            if(res.data.code == 200){
                that.resArry = that.resArry.concat(res.data.data.data);
                that.allLoaded = false;
                that.totalPage = res.data.data.totalPage;
                that.pages++;
                for(let index=0;index<that.resArry.length;index++){
                    if(that.resArry[index]["YN"] == 1){
                        that.statusText.push("待支付")
                    };
                    if(that.resArry[index]["YN"] == 2){
                        that.statusText.push("待接单")
                    };
                    if(that.resArry[index]["YN"] == 3){
                        that.statusText.pus.push("退货退款")
                    };
                    if(that.resArry[index]["YN"] == 4){
                        that.statusText.push("仅退款")
                    };
                    if(that.resArry[index]["YN"] == 5){
                        that.statusText.push("换货")
                    };
                    if(that.resArry[index]["YN"] == 6){
                        that.statusText.push("已完成")
                    };
                    if(that.resArry[index]["YN"] == 7){
                        that.statusText.push("退货退款成功")
                    };
                    if(that.resArry[index]["YN"] == 8){
                        that.statusText.push("退款成功")
                    };
                    if(that.resArry[index]["YN"] == 9){
                        that.statusText.push("换货成功")
                    };
                    if(that.resArry[index]["YN"] == 10){
                        that.statusText.push("待发货")
                    };
                    if(that.resArry[index]["YN"] == 11){
                        that.statusText.push("待收货")
                    };
                }
            }
        })
        .catch(err=>{

        })
      },
      // 查询全部
      checkAll(){
        this.startDate = '';
        this.endDate = '';
        this.pages = 1;
        this.getData();
    },
      // 时间条件
      setTime(){
          if(this.startDate == ''){
              showToast("请选择起始日期");
              return;
          }
          if(this.endDate == ''){
              showToast("请选择结束日期");
              return;
          }
          this.pages = 1;
          this.getData();
      },
      // 订单详情
      details(salenumber,seqs){
          this.$router.push({path:"/orderDetails",query:{orderCode:salenumber,seq:seqs}})
      }
    }
}
</script>
<style>
    .purchase-record .header{
        background-color:#ef4628;
        color:#fff;
    }
    .purchase-record .all-btn{
        height:40px;
        line-height:40px;
        text-align:center;
        font-size:.6667rem;
        color:#28b0ef;
    }
    .purchase-record .wap-con{
        padding:0 .5333rem;
        margin-bottom:10px;
    }
    .purchase-record .block{
        background-color:#fff;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding:0 .3333rem;
        height:50px;
        border-radius:5px;
    }
    .purchase-record .el-icon-sort{
        transform: rotate(90deg);
        font-size:.7111rem;
        color:#999;
    }
    .purchase-record .date-input{
        width:5.1111rem;
        color:#999;
        outline-color: none;
        text-align: center;
        font-size:.5333rem;
    }
    .purchase-record .el-input__inner{
        height:1.3333rem;
        line-height:1.3333rem;
        padding:0 .3333rem;
    }
    .purchase-record .el-input__icon{
        line-height:1.3333rem;
    }
    .purchase-record .el-button{
        height:1.3333rem;
        line-height:0;
        padding:0 .4444rem;
    }
    .purchase-record .picker-toolbar{
        display:flex;
    }
    .purchase-record .goods-con{
        overflow:auto;
        -webkit-overflow-scrolling: touch;
        height: calc(100vh - 144px);
    }
    .purchase-record .goods-list{
        overflow:scroll;
        -webkit-overflow-scrolling: touch;
        padding:0 .5333rem ;
    }
    .purchase-record .goods-item{
        background-color:#fff;
        border-radius:5px;
        padding:0 .5333rem;
        margin-bottom:.2222rem;
    }
    .purchase-record .item-top{
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-size:.5778rem;
        height:1.9111rem;
        border-bottom:.0222rem solid #ccc;
        margin-bottom:.6667rem;
    }
    .purchase-record .item-order{
        color:#333;
    }
    .purchase-record .item-status{
        color:#ff0000;
    }
    .purchase-record .goods-desc{
        display:flex;
        justify-content: space-between;
        border-bottom:1px solid #ccc;
        padding-bottom:.6667rem;
        margin-bottom:.6667rem;
    }
    .purchase-record .img-con{
        width:3.5556rem;
        height:3.5556rem;
        margin-right:.4444rem;
    }
    .purchase-record .goods-text{
        flex:1;
        font-size:.6667rem;
        color:#999;
    }
    .purchase-record .goods-nature{
        display:flex;
        justify-content: space-between;
        margin-bottom:.4444rem;
    }
    .purchase-record .goods-nature .goods-name{
        width:7.1111rem;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color:#333;
    }
    .purchase-record .goods-nature .goods-price{
        color:#333;
    }
    .purchase-record .total-price{
        text-align:right;
    }
    .purchase-record .goods-info{
        padding-bottom:.4444rem;
    }
    .purchase-record .info-item{
        display:flex;
        justify-content: space-between;
        font-size:.5778rem;
        margin-bottom:.4444rem;
    }
    .purchase-record .info-item .price{
        color:#ff0000;
    }
    .purchase-record .mint-loadmore-top, .mint-loadmore-bottom{
        height:1.1111rem;
        line-height:1.1111rem;
        margin-bottom:-1.1111rem;
        font-size:.6222rem;
        color:#999;
    }
    .purchase-record .no-data{
        font-size:.6222rem;
        text-align:center;
        color:#999;
    }
</style>
