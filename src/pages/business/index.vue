<template>
  <div class="glode">
    <header class="mint-header">
        <!-- <div class="mint-header-button is-left"><img src="../../assets/images/logo.png"></div> -->
        <!-- <mt-button icon="back" slot="left" @click="backPageLogin"></mt-button> -->
        <mt-button icon="" ></mt-button>
        <h1 class="mint-header-title">
            <router-link :to="'/search?wholesaler='+wholesaler" class="searhed">
                <i class="mint-toast-icon mintui mintui-search"></i>
                <input type="text" placeholder='请输入需要搜索的商品名称' readonly>
            </router-link>
        </h1>
 
    </header>
    <div class="shopxx">
      <!-- <div class="shoplogo" v-if="shopData.HeadPortraitURL"><img :src="shopData.HeadPortraitURL"></div>
      <div class="shoplogo" v-else><img src="@/assets/images/wholesale/user-icon.png"></div>
      <div class="describe">
        <h1>{{ shopData.storeName?shopData.storeName:shopData.shopname?shopData.shopname:''}}</h1>
        <p>{{ shopData.province+shopData.city+shopData.area+shopData.street+shopData.address}}</p>
        <p>
          <span>{{ shopData.storeMobile || shopData.mobile }}</span>
          <span class="orderStatus" v-show="userType==1" @click="OrderState">平台订货</span>
        </p>
      </div> -->
       <div class="column-img">
         <mt-swipe :auto="4000" :show-indicators="false">
           <mt-swipe-item v-for="(item,i) in banner" :key="i">
             <a @click="bannerLink(item.directUrl)"><img :src="item.imgUrl"></a>
           </mt-swipe-item>
         </mt-swipe>
       </div>
       <span class="orderStatus" v-show="userType != 5 && userType != 6" @click="OrderState">平台订货</span>
    </div>
    <div>
      <div class="topnav">
        <ul>
          <li v-for="(item,index) in classify" :class="{lihover:classli==index}" @click="lihover(index,item.Id)" :key="index">{{ item.Name }}<i></i></li>
        </ul>
      </div>
   
        <div class="shopChange">
          <el-row>
            <el-col :span="12" @click.native.capture="synthesis">综合<i :class="Sort==1?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
            <el-col :span="12" @click.native.capture="pricefn">价格<i :class="Sort==3?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
            <!-- <el-col :span="8" @click.native.capture="salesfn">销量<i :class="Sort==5?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col> -->
          </el-row>
        </div>
        <div class="shopbox" v-infinite-scroll="getProduct" infinite-scroll-disabled="loading" infinite-scroll-distance="80">
          <div class="shopmain">
            <!--list-->
            <div class="shoplist" v-for="(item,index) in product" :key="index" @click="linkTo(item.Code,item.SEQ)">
              <div class="shopimg"><img :src="item.ProductImg"></div>
              <div class="shoptext">
                <div class="shopname">{{ item.Name }}</div>
                <div class="shopdeal" v-if="sales">
                  <p style="margin-bottom:0.4rem"><i class="letter">已售{{ countSale(item.CountSale) }}{{item.Unit}}</i><i class="order">{{ countSale(item.Moq) }}{{item.Unit}}起订</i></p>
                  <p><span class="money"><!--<i>促</i>-->￥{{ item.Price }}</span></p>
                </div>
                <div class="shopdeal" v-else>
                  <p class="order">{{ countSale(item.Moq) }}{{item.Unit}}起订</p>
                  <p class="money-con" :class="{paddingBtm:!item.DisCountPrice}">
                    <span class="money"><!--<i>促</i>-->￥{{ item.DisCountPrice||item.Price }}</span>
                    <i class="cart-icon" :class="{sml:!item.DisCountPrice}" @click.stop="addCart(item.Code,item.Sku,item.Moq)"></i>
                  </p>
                  <p class="old-price" v-if="item.DisCountPrice < item.Price">￥{{ item.Price}}</p>
                </div>
              </div>
              <!--list end-->
            </div>
          </div>
        </div>
   
    </div>
    <bottomnav :bottom="bottomnav" v-if="userType == 1 || userType == 5 || userType == 6"></bottomnav>
    <wholesale-nav v-else-if="userType == 2 || userType == 3||userType == 7" :Wseq='seq'></wholesale-nav>
  </div>
</template>
<script>
import wholesaleNav from "@/components/WholesaleNav"
import { showToast } from '../../assets/js/common';

  export default {
    data(){
      return {
        bottomnav:{
          index:'首页'
        },
        shopData:'',
        sales:false,
        loading:false,
        classify:[
          {
            Id:0,
            Name:"全部"
          }
        ],
        classli:0,
        url:this.URL + '/MerchantPage/MerchantPageList',
        product:[],
        wholesaler:'',
        page:1,
        rows:10,
        Sort:0,
        keyword:'',
        classifyID:0,
        userType:'',
        mobile:'',
        shopname:'',
        address:'',
        seq:'',
        IsServicer:'',
        system:'',
        isUploadInfo:false,
        applay:'',
        banner: [],
        Wseq:this.$route.query.wholesaler,
        userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
      }
    },
    components:{
      wholesaleNav
    },
    created(){
      this.saveData();
    },

    updated(){
      this.$nextTick(function(){
        // 产品图片固定高度
        $('.shopimg').each(function(i,e){
          $(e).css('height',$(e).width()+'px');
        })
      })
    },
    mounted() {
      this.getStoreInfo();
      let that = this;
      this.getFenlei();
      this.huoBanner();
    },
    methods:{
           //获取轮播图
           huoBanner() {
           axios.get(this.URL + '/WholesaleManage/GetWholesaleBannerList?seq='+this.Wseq).then(res => {
           this.banner = res.data.dataList

           }).catch(function (error) {
           });
           },
           bannerLink(links) {

           if (links.indexOf('http') >= 0 || links.indexOf('https') >= 0) {
           window.location.href = links;
           } else {
           this.$router.push({
           path: links
           })
           }
           },
      // 保存数据
      saveData(){
        let seq = sessionStorage.getItem('seq');
        let IsServicer = sessionStorage.getItem('IsServicer');
        if(IsServicer){
          this.IsServicer = IsServicer;
        }

        if(seq){
          this.seq = seq;
        }
        if(this.$route.query.wholesaler){
          sessionStorage.setItem('Wseq',this.$route.query.wholesaler);
        }
        let userType = sessionStorage.getItem('userType');
        if(userType){
          this.userType = userType;
        }
        if(sessionStorage.getItem('oldWseq')){
          this.wholesaler = sessionStorage.getItem('oldWseq');
        }else if(sessionStorage.getItem('Wseq')){
          this.wholesaler = sessionStorage.getItem('Wseq');
        }else{
          this.wholesaler = sessionStorage.getItem('seq');
        }
        this.configSystem();
      },
      //获取店铺信息
      getStoreInfo(){
        axios.get(this.URL + '/WholesaleManage/GetWholesalerInfoDetail?WholesaleSEQ='+this.wholesaler).then(res => {
          this.shopData = res.data;
          this.ApplyStatus = res.data.ApplyStatus;
          sessionStorage.setItem('certificateType',res.data.certificate_type);
          sessionStorage.setItem('certificate_type',res.data.certificate_type);
        });
      },
      //获取分类数据
      getFenlei(){
        axios.get(this.URL + '/MerchantPage/GetProductCategory?WholesaleSEQ='+this.wholesaler).then(res => {
          let data = res.data;
          data.forEach(post => {
            this.classify.push(post)
          });
        }).catch(function (error) {
          console.log(error);
        });
      },
      backPageLogin(){
        let fromApp = sessionStorage.getItem('app');
        if(fromApp){
          window.action.backPageLogin();
        }else{
          this.$router.push('/login');
        }
      },
      goSettled(){
        let url = this.SETTLED+'?usertype=3&wholesaler='+this.wholesaler+'&phone='+this.shopData.mobile+'&isIndex=true';
        // let url = 'http://192.168.1.36:1099/html5/settled/userInfo.html?usertype=3&wholesaler='+this.wholesaler+'&phone='+this.shopData.mobile+'&isIndex=true';
        // let url = 'http://localhost:37809/html5/settled/userInfo.html?usertype=3&wholesaler='+this.wholesaler+'&phone='+this.shopData.mobile+'&isIndex=true';
        return url ;
      },
      getUserInfo(){
        axios.get(this.URL + '/User/GetUserInfoBySeq',{params:{seq:this.seq}})
        // axios.get(this.URL + '/User/GetUserInfo',{params:{account:this.account,pwd:this.pwd}})
        .then((res) => {
          Indicator.close();
          if(res.data){
            this.shopData = res.data;
          }else{
            // showToast("请先登录");
            // setTimeout(()=>{
            //   this.$router.push('/login');
            // },2000);
          }
        });
      },
      // 分类点击获取
      lihover(i,Id){
        this.classli = i;
        this.page = 1;
        this.classifyID = Id;
        this.product = [];
        this.prodblur = false;
        this.getProduct();
      },
      // 跳转到自己的店铺
      toUsStore(){
        // let se
        let wholesaler = this.$route.query.wholesaler;
        if(wholesaler == this.seq){
          this.getProduct();
        }
      },
      // 获取产品数据
      getProduct(){
        Indicator.open();
        this.loading = true;
        let that = this;
        let post = {
          SEQ: sessionStorage.seq,
          WholesaleSEQ:this.wholesaler,
          classifyID:this.classifyID,
          page:this.page,
          rows:4,
          keyword:this.keyword,
          Sort:this.Sort
        };
        //判断如果是登录的区域批发商的身份则加加上字段
        if(this.userBlock){
          post.wholesalerType=2
          }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          post.wholesalerType=1
          }else{
          post.wholesalerType=0
        }
        axios.get(that.url,{params:post,timeout:30000}).then(res => {
          Indicator.close();
          if(res.data.MerchantPageVM.length == 0){
            this.loading = true;
            return false;
          };
          (that.page)++;
          that.product = that.product.concat(res.data.MerchantPageVM);
          this.loading = false;
        }).catch(function (error) {
          showToast('请求超时');
          Indicator.close();
        });
      },
      // 综合排序
      synthesis(){
        switch(this.Sort){
          case 1:
            this.Sort = 2;
            break;
          default:
            this.Sort = 1;
            break;
        };
        this.loadfn();
      },
      // 价格排序
      pricefn(){
        switch(this.Sort){
          case 3:
            this.Sort = 4;
            break;
          default:
            this.Sort = 3;
            break;
        };
        this.loadfn();
      },
      // 销量排序
      salesfn(){
        switch(this.Sort){
          case 5:
            this.Sort = 6;
            break;
          default:
            this.Sort = 5;
            break;
        };
        this.loadfn();
      },
      loadfn(){
        this.page = 1;
        this.product = [];
        this.prodblur = false;
        this.getProduct();
      },
      linkTo(code,wholesaleSeq){
        this.$router.push({path:'/details',query:{strCode:code,wholesaleSEQ:wholesaleSeq}});
      },
      // 防止购买数量过多用计算单位来替换
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
       // 跳转到订货平台
      OrderState(){
        let fromApp = sessionStorage.getItem('app');
        if(fromApp){
          window.action.toDingHuo()
        }else{
          let androidDownUrl = 'http://dh.520shq.com/dowAPK/shq_business_v1.0.0.apk';
          let iosDownUrl = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1243425475';
          this.configSystem()
          if(this.system == 'android'){
            this.checkAppExit(androidDownUrl);
            window.location.href='order://order.app/openwith';
          }else if(this.system == 'ios'){
            // window.location.href='lovefenxiao://';
            this.checkAppExit(iosDownUrl);
            window.location.href='ordersys://';
          }else if(this.system == 'wx'){
            showToast('微信不支持，请使用第三方浏览器打开！','center')
          }
        }
      },
      // 判断手机系统
      configSystem(){
        let ua = navigator.userAgent.toLowerCase();
        //Android终端
        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
　　   //Ios终端
        let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (this.isWeixinBrowser(ua)) {
          //  this.$router.push({
          //     path: '/product'
          //  })
          this.system = 'wx';
        } else {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            this.system = 'ios';
              //Ios
          } else if (/(Android)/i.test(navigator.userAgent)) {
            this.system = 'android';
              //Android终端
              // window.location.href = 'order://order.app/openwith'
          }
        }
      },
      // 检查是否填写自动分账信息
      checkUpload(){
        axios.get(this.URL+'/User/GetEnterMessage',{params:{
          seq:this.seq
          // seq:'5761984'
        }}).then((res)=>{
          let data = res.data.data;
          if(data){
            if(data.success == true){
            }else{
              // MessageBox({
              //   title:"",
              //   message: '为了保障您的资金权益，银行需要对您的交易帐户和身份等信息进行认证，请点击立即前往进行认证资料填写，感谢您的配合，谢谢！',
              //   showCancelButton: false,
              //   confirmButtonText:'立即前往',
              //   closeOnClickModal:false
              // }).then(action => {
              //   if(action == 'confirm'){
              //     this.$router.push('/wholesale/uploading');
              //   }
              // })
            }
          }
        })
      },
      // 检查是否app存在
      checkAppExit(url){
        var startTime = Date.now();
        var t = setTimeout(function() {
          var endTime = Date.now();
          //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
          if ((endTime - startTime) < (800)) {
            window.location.href = url
          } else {
              window.close();
          }
        }, 600);
        window.onblur = function() {
          clearTimeout(t);
        }
      },
      // 判断是否是微信浏览器
      isWeixinBrowser(ua){
        return (/micromessenger/.test(ua)) ? true : false;
      },
      // h5唤醒app
      WxWakeUpApp(){

        var ua = navigator.userAgent.toLowerCase();
        var t;
        //config 配置文件 JS 传递 scheme  客户端进行匹配
        //scheme_IOS IOS端必要参数
        //scheme_Adr 安卓端必要参数
        //download_url_Adr download_url_IOS 下载地址  timeout 过期时间
        var config = {
        //scheme:必须
          scheme_IOS: 'order://',
          scheme_Adr: 'order://order.app/openwith',
          download_url_Adr: 'order://order.app/openwith',
          download_url_IOS: 'http://www.baidu.com',
          timeout: 600
        };
        function openclient() {
          // 用户点击时，在动态创建一个iframe，并且让这个iframe去加载config中的Schema
            var ifr = document.createElement('iframe');
            // 端口判断 安卓或IOS
            if(ua.indexOf('os') > 0){
              ifr.src =  config.scheme_IOS
            }else{
              ifr.src =  config.scheme_Adr
            }

            ifr.style.display = 'none';
            document.getElementById("app").appendChild(ifr);
            var startTime = Date.now();
            var t = setTimeout(function() {
                var endTime = Date.now();
                //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
                if ((endTime - startTime) < (config.timeout + 200)) {
                    //判断是安卓 还是IOS
                    if (/iphone|ipad|ipod/.test(ua)) {
                        // window.location.href = config.download_url_IOS;
                    } else if (/android/.test(ua)) {
                        // window.location.href = config.download_url_Adr;
                    }
                } else {
                    window.close();
                }
            }, config.timeout);

            window.onblur = function() {
                clearTimeout(t);
            }
        }
        openclient();
        //点击事件  调用openclient方法
        // window.addEventListener("DOMContentLoaded", function(){
        //     document.getElementsByClassName("orderStatus").addEventListener('click',openclient,true);
        // }, true);
      },
      addCart(code,sku,num){
        let post = {
          iSeq: sessionStorage.seq,
          strCode: code,
          carInfoStr: sku+'|'+num
        };
        axios.post(this.URL + '/Product/AddShoppingCart',post).then(res => {
          if(res.data.Code == 200){
            showToast(res.data.Msg)
          }else{
            showToast("添加购物车失败，请重新添加")
          };
        });
      }
    },
    // 判断返回页面不刷新
    // beforeRouteLeave(to,from,next){
    //   if(to.name == 'details'){
    //     from.meta.keepAlive = true;
    //   }else{
    //     from.meta.keepAlive = false;
    //   };
    //   next();
    // },
    // watch:{
    //   '$route'(to,from){
    //     this.classli = 0;
    //     this.page = 1;
    //     this.classifyID = 0;
    //     this.product = [];
    //     this.prodblur = false;

    //     if(to.path == '/wholesale/business'){
    //       if(from.name == 'details'){

    //         }else{
    //         this.wholesaler = this.seq;
    //         this.getStoreInfo();
    //         this.getFenlei();
    //         this.getProduct();
    //       }

    //     }
    //     if(to.name !=from.name || from.name == supplier){
    //       this.getStoreInfo();
    //       this.getFenlei();
    //       this.getProduct();
    //       // this.getUserInfo();
    //     }
    //   }
    // }
  }
</script>

<style scoped>
  .xx{
    text-align: center;
    background:url('../../assets/images/ICON.png') no-repeat center 2.8889rem ;
    background-size:9.1111rem 7.5111rem;
    padding:11.1556rem 0 0;
  }
  .xx p{
    overflow: hidden;
    font-size: .6667rem;
    color: #9ea0a0;
    margin-bottom:2.8222rem;
  }
  .xx a{
    color:#ff0000;
    display: block;
    width:4.4444rem;
    height:1.5111rem;
    line-height:1.5556rem;
    border-radius:3px;
    font-size: .7111rem;
    border:1px solid #d83232;
    margin:0 auto;
  }
  .orderStatus{display: inline-block;background: red;color: #fff;padding:0.2222rem 0.4444rem;border-radius:25px;float: right;}
  .glode{padding-bottom:60px;min-height:100vh}
  /* header */
  .mint-header{background:#ccc;height:auto;border-bottom:none;}
  .mint-header-button{-webkit-box-flex:.12;-ms-flex:.12;flex:.12;}
  .searhed{float:left;padding:6px 0.5rem;background:#ebebeb;border-radius:2em;width:calc(100% - 1rem);margin-left:0.5rem;}
  .searhed input{background:transparent;float:left;width:calc(100% - 0.5rem - 1em);}
  .searhed i{float:left;color:#9c9c9c;padding-right:0.2rem;}
  .send{width:20px;position:relative;z-index:1;font-size:0.6rem;}
  .send img{display:block;}
  .send .right-list{position:absolute;right:-8px;top:-0.4em;font-size:12px;color:red;line-height:1.4em;min-width:1.4em;background:white;border-radius:2rem;}
  /* shop */
  .shopxx {
  background: #ccc;
  padding: 5px;
  font-size: 0.62rem;
  line-height: 1.4em;
  overflow: hidden;
  position: relative;
  }

  .shopxx .column-img>>>.mint-swipe {
  height: calc(100vw*0.46);
  max-height: 340px;
  }

  .shopxx .column-img>>>.mint-swipe-item img {
  width: 100%;
  height: 100%;
  }

  .shopxx .orderStatus {

  padding: 4px 15px;
  font-size: 0.62rem;
  position: absolute;
  right: 3px;
  bottom: 5px;
  }

  .shoplogo{
    float:left;
    width:3rem;
    height:3rem;
    overflow:hidden;
    background:#ebebeb;
    position:absolute;
    top: 50%;
    left: 10px;
    margin-top: -1.5rem;
  }
  .shoplogo img{
    height:100%;
  }
  .describe{
    float:right;
    width:calc(100% - 3.5rem);
    color:white;
  }
  .describe h1{
    font-size:0.7rem;
    line-height:1.2em;
    padding-bottom:0.2rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .describe p{
    overflow:hidden;
    text-overflow:ellipsis;
    /* white-space:nowrap; */
    margin-bottom:0.2rem;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .describe span{
    font-size:0.6rem;
    line-height:1.2em;
  }
  .topnav{
    background:white;
    overflow:auto;
    font-size:0.7rem;
    margin-bottom:0.5rem;
  }
  .topnav ul{
    white-space:nowrap;
  }
  .topnav::-webkit-scrollbar {display:none}/* 影藏滚动条 */
  .topnav ul li{
    display: inline-block;
    height:3em;
    line-height:3em;
    position:relative;
    color:#666;
    margin:0 10px;
  }
  .topnav ul li.lihover{
    color:red;
  }
  .topnav ul li i{
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    height:2px;
    background:red;
    display:none;
  }
  .topnav ul li.lihover i{
    display:block;
  }
  .shoppin{
    overflow:hidden;
  }
  .shopChange{
    overflow:hidden;
    background:white;
  }
  .shopChange .el-col{
    float: left;
    text-align: center;
    font-size: 0.65rem;
    color:#939397;
    line-height:3em;
  }
  .shopbox{
  
    padding:0 10px;
    margin-top:0.5rem;
    
  }
  .shopmain{
    /* overflow:hidden;
    width:calc(100% + 0.5rem); */
    display:flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .shoplist{
    width:7.2rem;
    /* margin:0 0.5rem 0.5rem 0; */
    margin-bottom:.4444rem;
    background:white;
  }
  .shoplist .shopimg{
    overflow:hidden;
    border:1px solid #e9e9e9;
    border-bottom:none;
  }
  .shoplist .shopimg img{
    display:block;
    height:100%;
  }
  .shoplist .shoptext{
    overflow:hidden;
    border:1px solid #e9e9e9;
    padding:.2222rem .2667rem;
  }
  .shoplist .shoptext .shopname{
    overflow:hidden;
    font-size:.5333rem;
    line-height:1.2;
    /* line-height:1.2em; */
    height:calc(2.4em - 1px);
    margin-bottom:0.3rem;
    color:#333;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .shoplist .shoptext .shopdeal{
    overflow:hidden;
    font-size:0.57rem;
    line-height:1.2em;
  }
  .shoplist .shoptext .shopdeal .money-con{
    position:relative;
  }
  .shoplist .shoptext .shopdeal .cart-icon{
    display:block;
    position:absolute;
    right:.2222rem;
    top:-.3222rem;
    width:1rem;
    height:1rem;
    background:url("../../assets/images/cart-icon.png") no-repeat center;
    background-size:cover;
  }
  .shoplist .shoptext .shopdeal .sml{
    top:0;
    width:.75rem;
    height:.75rem;
  }
  .shoplist .shoptext .shopdeal .money{
    color:#df2211;
    font-size:.5333rem;
    margin-right:.2222rem;
  }
  .shoplist .shoptext .shopdeal .paddingBtm{
    padding-bottom:.2222rem;
  }
  .shoplist .shoptext .shopdeal .old-price{
    color:#666;
    text-decoration:line-through;
    font-size:.4444rem;
    height:.7111rem;
  }
  .shoplist .shoptext .shopdeal .money i{
    color:white;
    font-size:0.7rem;
    background:#df2211;
  }
  .shoplist .shoptext .shopdeal .order{
    /* float:right;
    text-align: right; */
    color:#999;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    margin-bottom:.2222rem;
  }
  .shoplist .shoptext .shopdeal .letter{
    float:left;
    text-align: left;
    color:#999;
    width:50%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display:none;
  }
  .loadings{
    overflow:hidden;
    padding:1rem;
    text-align: center;
  }
</style>
