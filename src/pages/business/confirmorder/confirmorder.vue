<template>
   <div class="glode">
       <topnav :top='topnav'></topnav>
       <router-link to="/myaddress?tolink=confirmoder" class="address">
            <div class="addreText" v-if="address==null">
               <div class="users"><i class="el-icon-location-outline"></i> 添加地址</div>
               <div class="el-icon-arrow-right"></div>
           </div>
           <div class="addreText" v-else>
               <div class="users">{{ address.Name }}（{{ address.Phone }}）<span v-show="address.IsDefault">默认信息</span></div>
               <div class="addre">收货地址：{{ address.Province+address.City+address.Area+address.Address }}</div>
               <div class="el-icon-arrow-right"></div>
           </div>
       </router-link>
       <div class="mainlist">
            <div class="list-item" v-for="(item,index) in postData" :key="index">
               <div class="shopName">
                   <span>店铺: {{ item.WholesaleName }}</span>
               </div>
               <div class="good-box">
                   <div class="goods" v-for="(list,i) in item.listProductModel" :key="i">
                       <div class="goodimg"><img :src="list.PriductImg"></div>
                       <div class="goodtext">
                           <p>{{ list.Name }}</p>
                           <span class="order">规格:{{ list.StandardName }}</span>
                           <span>数量:{{ list.BuyCount }}</span>
                           <i>金额:￥{{ (list.PlatformPrice).toFixed(2) }}</i>
                       </div>
                   </div>
               </div>
               <div class="total">共{{ item.listProductModel.length }}件商品&nbsp;&nbsp;&nbsp;小计：<i>{{ item.ProdcutMoney.toFixed(2) }}</i></div>
               <div class="Leaved">
                    <p @click="leaved($event, index)">买家留言:(选填)填写内容已和商家协商确定</p>
                    <div class="textarea">
                        <textarea rows="3" placeholder="填写内容已和商家协商确定" @change="textareafn($event, index)"></textarea>
                    </div>
               </div>
               <div class="xuzhi" @click="xuzhiShow">
                    <p style="font-size:0.6222rem;">购买须知<span class="jt">&gt;</span></p>
                    <p style="font-size:0.5333rem;" class="xuzhiP">一、此为520批发网平台卖家销售、发货并保证质量的商品非520平台自营商品，由平台卖家提供发票和相应的售后服务。请您放心购买！</p>
               </div>
            </div>
       </div>
        <div class="orderbottom">
            <div class="amount">合计: <i>¥{{ allmoney.toFixed(2) }}</i></div>
            <div class="shopbut">
                <a href="javascript:" class="changeprice" @click="changeprice" :style="ApplyStatus!='05'?'background:#ddd;':''">申请改价</a>
                <a href="javascript:" class="buy" @click="buy" :style="ApplyStatus!='05'?'background:#ddd;':''">提交订单</a>
            </div>
        </div>
        <mt-popup v-model="shift" position="bottom" class="popup">
            <confirpopup :shift.sync="shift" :confir.sync="confir" @shift-change="shiftfn"></confirpopup>
        </mt-popup>
        <div class="mask-con" v-show="isXuzhi">
      <div class="mask-box">
        <!-- <h5 class="title">用户协议</h5> -->
        <div class="mask-desc">
          <div class="mask-list">
            <p class="p" style="text-align:center;background:#FFFFFF;" align="center">
              <b><span style="color:#343434;font-weight:bold;font-size:14.0000pt;background:#FFFFFF;">购买须知</span></b><b><span style="color:#343434;font-weight:bold;font-size:14.0000pt;background:#FFFFFF;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">一、此为520批发网平台卖家销售、发货并保证质量的商品非520平台自营商品，由平台卖家提供发票和相应的售后服务。请您放心购买！</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;background:#FFFFFF;">二、本站商品信息均来自于合作方，其真实性、准确性和合法性由信息拥有者（合作方）负责。本站不提供任何保证，并不承担任何法律责任。</span></b><b><span class="15" style="font-weight:bold;font-size:9.0000pt;background:#FFFFFF;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">三、520批发网平台上的所有商品信息、客户评价、商品咨询、网友讨论等内容，是520批发网平台重要的经营资源，未经许可，禁止非法转载使用。
</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
          </div>
        </div>
        <div class="btns-con">
          <button class="btns" @click="isXuzhi = false" style="color:#fff;background:#f00">我知道了</button>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import Vue from 'vue';
import confirpopup from './confirpopup';
Vue.component('confirpopup',confirpopup);
export default {
    data() {
        return {
            topnav:{
                title:'确认订单'
            },
            ApplyStatus:'',
            shift:false,
            postData:new Object(),
            allmoney:0,                 // 总金额
            address:new Object(),       // 地址
            message:[],
            confir:{},
            isXuzhi:false,
            wSeq:''
        }
    },
    mounted(){
        sessionStorage.removeItem("splitMoney");
        this.postData = JSON.parse(sessionStorage.shopData);
        this.address = JSON.parse(sessionStorage.setAddress).ID!=undefined?JSON.parse(sessionStorage.setAddress):null;
        this.wSeq = this.postData[0].WholesaleSEQ;
        this.postData.forEach((post,index) => {
            this.allmoney += post.ProdcutMoney;
            this.message[index] = {
                WholesaleSEQ: post.WholesaleSEQ,
                strRemark: ''
            };
            // 解决手机端输入法中文输入问题
            let flag = false;
            $('.textarea textarea').eq(index).on('compositionstart',function(){
                flag = false;
            })
            $('.textarea textarea').eq(index).on('compositionend',function(){
                flag = true;
            })
            //oninput在oncompositionend之前执行，需加定时器
            $('.textarea textarea').eq(index).on('input',function(){
                var _this = this;
                setTimeout(function() {
                    if(flag) {
                        this.message[index].strRemark = $(this).val();
                    }
                },1);
            });
        });
        this.getApplyStatus(this.wSeq);
    },
    methods: {
        // 资金入驻状态
        getApplyStatus(seq){
            axios.get(this.URL+'/User/GetEnterMessage',{params:{seq:seq}})
            .then((res)=>{
                this.ApplyStatus = res.data.applyStatus;
            })
        },
        textareafn(event,i){
            let elem = event.currentTarget;
            this.message[i].strRemark = elem.value;
        },
        xuzhiShow(){
            this.isXuzhi = true;
        },
        changeprice(){
            let ordernumber = this.$route.query.ordernumber;
            if(this.ApplyStatus!='05'){
                Toast('您的上游批发商正在进行资金账户安全认证，银行审核通过后才可进行交易。请谅解，谢谢！');
                return false;
            }
            if(this.address==null){
                Toast('请填写订单接收人地址！');
                return false;
            };
            let post = {
                iSeq: sessionStorage.seq,
                iAddressId: this.address.ID,
                strOrderDescr: this.message,
                gjType: 1
            };
            if(ordernumber){
                let order = this.$route.query.ordernumber.split(',');
                post.ordernumber = order;
            }else{
                post.carInfoStr = [];
                post.carInfoStr.push({
                    strSku: this.postData[0].listProductModel[0].Sku,
                    iBuyCount: this.postData[0].listProductModel[0].BuyCount
                })
            };
            axios.post(this.URL + '/OrderNewListInfo/ConfirmOrderInfo',post).then(res => {
                Toast(res.data.message);
                this.$router.push('/myorder');
            });
        },
        buy(){
            if(this.ApplyStatus!='05'){
                Toast('您的上游批发商正在进行资金账户安全认证，银行审核通过后才可进行交易。请谅解，谢谢！');
                return false;
            }
            if(this.address==null){
                Toast('请填写订单接收人地址！');
                return false;
            };
            this.shift = true;
            let ordernumber = this.$route.query.ordernumber;
            let post = {
                iSeq: sessionStorage.seq,
                iAddressId: this.address.ID,
                strOrderDescr: this.message,
            };
            if(ordernumber){
                let order = this.$route.query.ordernumber.split(',');
                post.ordernumber = order;
            }else{
                post.carInfoStr = [];
                post.carInfoStr.push({
                    strSku: this.postData[0].listProductModel[0].Sku,
                    iBuyCount: this.postData[0].listProductModel[0].BuyCount
                })
            };
            this.confir = post;
            this.confir.allmoney = this.allmoney;
        },
        shiftfn(val){
            this.shift = val;
        },
        leaved(event, i){
            let that = this;
            let elem = event.currentTarget.parentNode;
            that.leavedshow(elem);
            let text = $(elem).find('.textarea textarea').val();

            $(elem).find('.textarea textarea').on('keyup',function(){
                that.message[i].strRemark = this.value;
            });
        },
        leavedhide(elem){
            $(elem).find('p').show();
            $(elem).find('.textarea').hide();
        },
        leavedshow(elem){
            $(elem).find('p').hide();
            $(elem).find('.textarea').show();
        }
    }
}
</script>

<style scoped>
.glode{
  min-height:100vh;
  padding-top:40px;
  padding-bottom:60px;
}
.glode >>> .mint-header{
  position:fixed;
  left:0;
  top:0;
  width:100%;
  z-index:99;
}
.address{
    display:block;
    padding:1rem 10px;
    background:white;
    font-size:0.65rem;
    margin-top:0.5rem;
    position:relative;
    color:#212121;
}
.address{
    overflow:hidden;
    padding-right:1rem;
}
.address .users{
    overflow:hidden;
    margin-bottom:0.3rem;
    line-height:1.4em;
    color:#212121;
}
.address .users span{
    font-size:0.6rem;
    color:white;
    background:#e4393c;
    border-radius:3px;
    padding:0 0.2rem;
}
.address .addre{
    line-height:1.4em;
}
.address .el-icon-arrow-right{
    font-size:0.8rem;
    position:absolute;
    right:10px;
    top:calc((100% - 1.2em)/2);
    line-height:1.2em;
    color:#999;
}
.mainlist{
    overflow:hidden;
    margin-top:0.5rem;
}
.list-item{
    overflow:hidden;
    background:white;
    margin-bottom:0.5rem;
    font-size:0.65rem;
    line-height:1.2em;
}
.list-item .shopName{
    overflow:hidden;
    border-bottom:1px solid #f1f2f5;
    padding:0.6rem 10px;
    color:#212121;
}
.good-box{
    overflow:hidden;
    padding:0 10px;
}
.good-box .goods{
    overflow:hidden;
    padding:0.6rem 0;
    border-bottom:1px solid #f1f2f5;
}
.good-box .goods:last-child{
    border-bottom:none;
}
.good-box .goods .goodimg{
    float:left;
    width:5rem;
    height:5rem;
    border:1px solid #e6e6e6;
}
.goodimg img{
    height:100%;
}
.good-box .goods .goodtext{
    float:right;
    width:calc(100% - 5.5rem);
}
.good-box .goods .goodtext p{
    overflow:hidden;
    font-size:0.65rem;
    height:calc(2.4em - 1px);
    line-height:1.2em;
    margin-bottom:0.4rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color:#212121;
}
.good-box .goods .goodtext span{
    display:block;
    font-size:0.62rem;
    margin-bottom:0.35rem;
    color:#4c4c4c;
    line-height:1.2em;
}
.good-box .goods .goodtext span.order{
    max-height:calc(2.4em - 1px);
    overflow:hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.good-box .goods .goodtext i{
    display:block;
    color:#e4393c;
}
.total{
    overflow:hidden;
    padding:0.6rem 10px;
    border-top:1px solid #f1f2f5;
    border-bottom:1px solid #f1f2f5;
    text-align: right;
}
.total i{
    font-size:0.8rem;
    color:#e4393c;
}
.Leaved{
    overflow:hidden;
    padding:0.6rem 10px;
    text-align: right;
    font-size:0.65rem;
    border-bottom:1px solid #f1f2f5;
}
.Leaved p{
    padding-left:3rem;
    color:#999;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.Leaved .textarea{
    overflow:hidden;
    font-size:0.65rem;
    display:none;
}
.Leaved textarea{
    width:100%;
    padding:0.4rem;
    line-height:1.4em;
    text-align: left;
    color:#333;
    border:1px solid #e6e6e6;
    border-radius:5px;
    margin-bottom:0.3rem;
}
.orderbottom{
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    background:white;
    border-top:1px solid #e0e0e0;
    z-index:9;
    font-size:0.7rem;
}
.orderbottom .amount{
    float:left;
    line-height:50px;
    padding:0 0 0 10px;
}
.orderbottom .amount i{
    color:red;
}
.shopbut{
    float:right;
}
.shopbut a{
    float:left;
    color:white;
    line-height:50px;
    padding:0 1em;
    text-align:center;
}
.shopbut a.changeprice{
    background-color:#fb7024;
}
.shopbut a.buy{
    background-color:#f23030;
}
/* popup */
.popup{width:100%;background:white !important;}

.xuzhi{
    padding: 0.4444rem;
}
.glode .mask-con{
  position:fixed;
  width:100%;
  height:100%;
  top:0;
  left:0;
  background-color:rgba(0,0,0,.5);
  z-index: 99;
}
.glode .mask-box{
  position:absolute;
  top:50%;
  left:50%;
  margin-top:-7.7778rem;
  margin-left:-6.6667rem;
  width:13.3333rem;
  height:15.5556rem;
  background-color:#fff;
  overflow:hidden;
  border-radius:.2222rem;
}
.glode .title{
  text-align:center;
  padding:.8889rem 0;
  font-size:.7111rem;
}
.glode .mask-desc{
  height:100%;
  overflow:auto;
}
.glode .mask-list{
  padding:15px 15px 2rem;
}
.glode .mask-item{
  font-size:.5333rem;
  padding:0 .7333rem;
  line-height:.8rem ;
}
.glode .btns-con{
  position:absolute;
  left:0;
  bottom:0;
  width:100%;
  height:1.7778rem;
  border-top:.0222rem solid #ccc;
  display:flex;
  background:white;
}
.glode .btns-con .btns{
  background-color:transparent;
  border:0;
  outline-style: none;
  font-size:.6667rem;
  flex:1;
}
.glode .btns-con .btns:nth-child(2){
  color:#fe0000;
  border-left:.0222rem solid #ccc;
}
.glode .btns-con .btns:active{
  background-color:#f2f2f2;
}
.xuzhiBTN{
    display: inline-block;
    font-size: .4444rem;
    color:#f00;
    float: right;
}
.xuzhiP{
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.jt{
    float: right;
}
</style>
