<template>
  <div class="glode">
    <!--正常-->
    <mt-header title="商品详情">
        <!-- <mt-button icon="back" slot="left" @click="back"></mt-button> -->
    </mt-header>
    <!--产品轮播图-->
    <div class="column-img">
      <mt-swipe :auto="5000" :show-indicators="false" @change="handleChange">
        <mt-swipe-item v-for="(item,index) in productImg" :key="index"><img :src="item.ProductImgUrl"></mt-swipe-item>
      </mt-swipe>
      <div class="col">{{ imgindex }} / {{ imglist }}</div>
    </div>
    <!--产品信息-->
    <div class="product-info">
      <div class="product-name">{{ product.Name }}</div>
      <div class="product-money">
        <div class="money">
          <span v-if="listData&&listData.ShopPrice"><i>¥</i>{{ listData&&listData.ShopPrice?listData.ShopPrice:0 }}</span>
          <span v-else  style="font-size:0.65rem;">该产品部分信息不完整</span>
        </div>
        <div class="amountMoq"><!--<i>包邮</i>已售1089 | -->起订量{{  listData?countSale(listData.Moq):0 }}件</div>
      </div>
    </div>
    <!--产品规格-->
    <div class="spec" @click="spec">
      <div class="spectext">
        <span>规格</span>
        <p v-if="listData"><i v-for="(item,index) in detail.proStandardJoints" :key="index">{{ listData['StandardName'+(index+1)]+'/' }}</i></p>
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
          <tr v-for="(post,index) in Parameter" :key="index" v-if=" post.PDName != '-1' ">
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
          爱之家商品由中国联合保险承保正品保证险,品质保证,100%正品，假一赔十。
        </div>
        <div class="txtHeader">服务保证</div>
        <div class="txtContent">
          520爱之家为您提供"专业质检""严选品牌商""7天无理由退货"等服务,让您轻松购物有保障。
        </div>
        <div class="txtHeader">发货时间</div>
        <div class="txtContent">
          买家付款成功后的36小时内完成发货,一般配送时间在1-3天。
        </div>
        <div class="txtHeader">商品包邮</div>
        <div class="txtContent">
          爱之家支持全场包邮,部分偏远地区(如港澳台、新疆、西藏、内蒙古、青海等)除外。
        </div>
        <div class="txtHeader">七天退换</div>
        <div class="txtContent">
          用户自收到爱之家商品之日起,在保证商品不影响第二次销售的前提下,  7天内可享受无理由退换货(秒杀/活动商品除外)。
        </div>
        <div class="txtHeader">退货运费</div>
        <div class="txtContent">
          非产品质量问题产生退货,由买家承担运费;如产品质量有问题,由供货商承担运费,买家先垫付邮费,待确认收货后联系平台客服处理退货运费。
        </div>
        <div class="txtHeader">退款手续费</div>
        <div class="txtContent">
          您发起的退款申请将会产生1%的银行退款手续费,非商品质量问题发起的退货退款,该项费用将由买家承担。
        </div>
      </div>
    </div>
    <!-- <shoppingCart :shop.sync="shift" :cartList="cartnum" @shopMai-change="shopMai"  v-if="isMyStore"></shoppingCart> -->
    <mt-popup v-model="shift" position="bottom" popup-transition="popup-fade" class="popup">
        <div class="close el-icon-close" @click="close"></div>
        <yulanPopup :isMyStore="isMyStore" :isType.sync="isType" :shift.sync="shift" :detail.sync="detail" @detail-change="detailfn" @listData-change="listDatafn" @num-change="num" @cart-change="cartChange"></yulanPopup>
    </mt-popup>
    <!-- <wholesale-nav v-if="!isMyStore"></wholesale-nav> -->
  </div>
</template>
<script>
  import Vue from 'vue';
  import wholesaleNav from '@/components/WholesaleNav';
  import yulanPopup from './yulanPopup';
  Vue.component('yulanPopup',yulanPopup);

  export default {
    data(){
      return {
        productImg:new Object(),            // 轮播图
        product:new Object(),               // 产品主信息
        imglist:1,                          // 轮播图数量显示
        imgindex:1,                         // 轮播图索引
        shift:false,                        // 显示产品其他规格选择
        strCode:this.$route.query.strCode,  // 单号
        detail:{
          proStandardJoints:[],
          listProStandAttached:[],
          listProductImg:[],
          product:{}
        },
        listData:new Object(),
        iSeq:'',                            // 商家seq
        infonav:'规格参数',                  // 判断信息导航索引样式
        Parameter:new Object(),             // 规格参数数据
        nums:1,
        isType:true,
        queryType:false,
        cartnum:0,
        isMyStore:true,
        userType:''
      }
    },
    components:{
      wholesaleNav
    },
    created(){
      let view = this.$route.query.View;
      this.iSeq = sessionStorage.seq;
      this.queryType = this.$route.query.type?true:false;
      let userType = sessionStorage.getItem('userType');
      this.userType = userType;
      var url = '';
      // if(this.queryType){
        this.isType = false;
        $('.glode').css('padding-bottom','0'); // 去底部多余空位
        // url = this.PRODUCT + '/Product/GetDHProductDetailsInfo?strCode='+this.strCode;
        // url = this.MS + '/Product/GetDHProductDetailsInfo?strCode='+this.strCode;
      // }else{
      //   this.isType = true;
      if(view == 2){
        url = this.MS + '/Product/GetDHProductDetailsInfo?strCode='+this.strCode+'&iSeq=1&wholesaleSeq=1';
      }else{
        url = this.URL + '/Product/GetProductDetailsInfo?strCode='+this.strCode+'&iSeq=1&wholesaleSeq=1';
        if(this.$store.state.userBlock){
          url+='&wholesalerType=2'
        }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          url+='&wholesalerType=1'
        }else{
          url+='&wholesalerType=0'
        }
      }
      // }
      axios.get(url).then(res => {
        let data = res.data.Resultdata;
        this.product = data.product;
        this.productImg = data.listProductImg;
        this.imglist = this.productImg?this.productImg.length:0;
        for(let i in this.detail){
          this.detail[i] = data[i];
        };
        //规格参数
        this.Parameter = data.listProParameter;
        this.Parame();
      });
    },
    mounted() {
      window.scroll(0,0);
      $('.column-img .mint-swipe').css('height',$('.column-img').width()+'px');
      this.checkUserType();
    },
    methods:{
      // 检查是否是批发商
      checkUserType(){
        let wSeq = sessionStorage.getItem('Wseq');
        if(this.userType == 2 && this.iSeq == wSeq){
          this.isMyStore = false;
        }else{
          this.isMyStore = true;
        }
      },
      countSale(count){
        let countext = count;
        if(count/10000 >= 1 && count/1000000 < 1){
          countext = Math.round(count/10000)+'万';
        }else if(count/1000000 >= 1 && count/10000000 < 1){
          countext = Math.round(count/1000000)+'百万';
        }else if(count/10000000 >= 1 && count/100000000 < 1){
          countext = Math.round(count/10000000)+'千万';
        }else if(count/100000000 >= 1){
          countext = Math.round(count/100000000)+'亿';
        };
        return countext;
      },
      back(){
        this.$router.back(-1);
      },
      handleChange(val){
        this.imgindex = val+1;
      },
      spec(){
        this.shift = true;
      },
      close(){
        this.shift = false;
      },
      detailfn(val){
        this.shift = val;
      },
      // 规格产品
      listDatafn(val){
        this.listData = val;
      },
      // 购买数量
      num(val){
        this.nums = val;
      },
      cartChange(val){
        this.cartnum = val;
      },
      shopMai(val){
        this.shift = val;
      },
      // 规格参数
      Parame(){
        this.infonav = '规格参数';
      },
      // 图文详情
      graphic(){
        this.infonav = '图文详情';
        $('.info-box').eq(1).html(this.product.Description);
      },
      // 购买须知
      instruct(){
        this.infonav = '购买须知';
        if(this.product.BuyersGuide){
          $('.info-box').eq(2).html(this.product.BuyersGuide);
        }
      }
    }
  }
</script>

<style scoped>
.glode{padding-bottom:65px;}
.column-img{
  position:relative;
}
.column-img img{
  display:block;
  height:100%;
}
.col{
  position:absolute;
  right:10px;
  bottom:10px;
  background:rgba(0,0,0,0.4);
  color:white;
  border-radius:5rem;
  padding:0.2rem 0.5rem;
  font-size:0.6rem;
  line-height:1.4em;
}
.product-info{
  overflow:hidden;
  padding:0.6rem 10px;
  background-color:white;
  border-bottom:1px solid #e4e5e9;
}
.product-info .product-name{
  overflow:hidden;
  font-size:0.75rem;
  line-height:1.4em;
  margin-bottom:0.4rem;
}
.product-info .product-money{
  overflow:hidden;
}
.product-info .product-money .money{
  float:left;
  font-size:1rem;
  color:#ff0025;
  line-height:1.2em;
}
.product-info .product-money .money i{
  font-size: 0.7rem;
}
.product-info .product-money .amountMoq{
  float:right;
  font-size:0.65rem;
  color:#717171;
  padding-top:0.24rem;
}
.product-info .product-money .amountMoq i{
  display:inline-block;
  font-size:0.6rem;
  color:#ff0025;
  background:#f1f2f5;
  padding:0 0.1rem;
  border-radius:3px;
  border:1px solid #ff0025;
  margin-right:0.2rem;
  line-height:1.2em;
}
.spec{
  overflow:hidden;
  margin-bottom:0.5rem;
  background:white;
  padding:0.6rem 10px;
  font-size:0.65rem;
  line-height:1.6em;
}
.spec .spectext{
  float:left;
}
.spec .spectext span{
  float:left;
  color:#7d7d7d;
  padding-right:0.4rem;
}
.spec .spectext p{
  float:left;
  width:15em;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.spec .el-icon-more{
  float:right;
  color:#666;
  font-size:0.8rem;
}
.information{
  overflow:hidden;
  background:white;
}
.information .info-nav{
  overflow:hidden;
  border-bottom:1px solid #e4e5e9;
  text-align:center;
  font-size:0.8rem;
}
.information .info-nav{
  overflow:hidden;
  border-bottom:1px solid #e4e5e9;
  text-align:center;
  font-size:0.72rem;
  line-height:3em;
}
.information .info-nav a{
  display:inline-block;
  position:relative;
  color:black;
}
.information .info-nav a.infohover{
  color:#db0020;
}
.information .info-nav a.infohover i{
  position:absolute;
  width:100%;
  height:2px;
  background:#db0020;
  left:0;
  bottom:0;
}
.information .info-nav span{
  padding:0 0.5rem;
  color:#e4e5e9;
}
.info-box{ 
  overflow:hidden; 
  padding:10px; 
  background:white; 
  font-size:0.65rem;
}
.info-box img{ display:block; }
.info-box table{ width:100%; line-height:1.2em; color:#333; font-size:0.65rem;}
.info-box table td{ vertical-align:top;padding:0.4em;}

.info-box .txtHeader{
  width: 100%;
  color: #212121;
  padding-left: 1rem;
}
.info-box .txtContent{
  padding: .4rem 0;
  border: 1px dashed #e2e2e2;
  margin: .4rem 0;
  background: rgb(245,245,245);
}
/* popup */
.popup{width:100%;height:70vh;background:white !important;}
.close{
  position:absolute;
  right:10px;
  top:10px;
  font-size:1rem;
  color:#999;
}
</style>