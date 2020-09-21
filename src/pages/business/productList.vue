<template>
  <div class="glode">
    <topnav :top="topnav" @keyword-change="changeKeyword"></topnav>
    <div class="topnav">
      <ul>
        <li v-for="(item,index) in classify" :class="{lihover:classli==index}" @click="lihover(index,item.Id)" :key="index">{{ item.Name }}<i></i></li>
      </ul>
    </div>
    <div class="shoppin">
      <div class="shopChange">
        <el-row>
          <el-col :span="12" @click.native.capture="synthesis">综合<i :class="Sort==1?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
            <el-col :span="12" @click.native.capture="pricefn">价格<i :class="Sort==3?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
            <!-- <el-col :span="8" @click.native.capture="salesfn">销量<i :class="Sort==5?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col> -->
        </el-row>
      </div>
      <div class="shopbox" v-infinite-scroll="getProduct" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
        <div class="shopmain">
          <!--list-->
          <router-link class="shoplist" v-for="(item,index) in product" :key="index" :to="'/details?strCode='+item.Code">
            <div class="shopimg"><img :src="item.ProductImg"></div>
            <div class="shoptext">
              <div class="shopname">{{ item.Name }}</div>
              <div class="shopdeal" v-if="sales">
                <p style="margin-bottom:0.4rem"><i class="letter">已售{{ item.CountSale }}件</i><i class="order">{{ item.Moq }}件起订</i></p>
                <p><span class="money"><!--<i>促</i>-->￥{{ item.Price }}</span></p>
              </div>
              <div class="shopdeal" v-else>
                <span class="money">￥{{ item.Price }}</span>
                <i class="order">{{ item.Moq }}件起订</i>
              </div>
            </div>
          </router-link>
          <!--list end-->
        </div>
      </div>
    </div>
    <!-- <bottomnav :bottom="bottomnav" v-if="userType!=2"></bottomnav> -->
  </div>
</template>
<script>
  export default {
    data(){
      return {
        topnav:{
          searh: true,
          keyword: this.$route.query.keyword
        },
        bottomnav:{
          index:'首页'
        },
        rightlist:4,
        sales:true,
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
        wholesaler:this.$route.query.wholesaler,
        page:1,
        rows:6,
        Sort:1,
        keyword:this.$route.query.keyword,
        classifyID:0,
        userType:''
      }
    },
    created(){
      let userType = sessionStorage.getItem('userType');
      
      if(userType){
        this.userType = userType;
      }
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
      let that = this;
      axios.get(this.URL + '/MerchantPage/GetProductCategory?WholesaleSEQ='+this.wholesaler).then(res => {
        let data = res.data;
        data.forEach(post => {
          this.classify.push(post)
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    methods:{
      // 搜索
      changeKeyword(val){
        this.keyword = val;
        this.lihover(0,0);
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
          rows:this.rows,
          keyword:this.keyword,
          Sort:this.Sort
        };
         //判断如果是登录的区域批发商的身份则加加上字段
        if(this.$store.state.userBlock){
          post.wholesalerType=2
          }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          post.wholesalerType=1
          }else{
          post.wholesalerType=0
        }
        axios.get(that.url,{params:post}).then(res => {
          Indicator.close();
          if(res.data.MerchantPageVM.length == 0){
            that.loading = true;
            return false;
          };
          ;(that.page)++;
          
          that.product = that.product.concat(res.data.MerchantPageVM);
          that.loading = false;
        }).catch(function (error) {
          console.log(error);
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
      // 判断返回页面不刷新
      beforeRouteLeave(to,from,next){
        if(to.name == 'details'){
          from.meta.keepAlive = true;
        }else{
          from.meta.keepAlive = false;
        };
        next();
      }
    },
    watch: {
      $route(to,from){
        if( to.path == '/productList') {
          this.topnav.keyword = this.$route.query.keyword;
          this.keyword = this.$route.query.keyword;
        }
      },
      keyword(val, oldVal) {
        if(val != oldVal) {
          this.prodblur = false;
          this.product = [];
          this.page = 1;
          this.getProduct();
        }
        
      }
    }
  }
</script>

<style scoped>
  .glode{padding-bottom:60px;min-height:100vh}
  
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
    overflow:auto;
    padding:0 10px;
    margin-top:0.5rem;
  }
  .shopmain{
    overflow:hidden;
    width:calc(100% + 0.5rem);
  }
  .shoplist{
    float:left;
    width:calc(50% - 0.5rem);
    margin:0 0.5rem 0.5rem 0;
    background:white;
  }
  .shoplist .shopimg{
    overflow:hidden;
    border:1px solid #e9e9e9;
    border-bottom:none;
  }
  .shoplist .shopimg img{display:block;height:100%;}
  .shoplist .shoptext{
    overflow:hidden;
    border:1px solid #e9e9e9;
    padding:0.4rem 0.2rem;
  }
  .shoplist .shoptext .shopname{
    overflow:hidden;
    font-size:0.65rem;
    line-height:1.2em;
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
  .shoplist .shoptext .shopdeal p{
    overflow:hidden;
  }
  .shoplist .shoptext .shopdeal .money{
    float:left;
    color:#df2211;
    font-size:0.7rem;
  }
  .shoplist .shoptext .shopdeal .money i{
    color:white;
    font-size:0.7rem;
    background:#df2211;
  }
  .shoplist .shoptext .shopdeal .order{
    float:right;
    color:#999;
  }
  .shoplist .shoptext .shopdeal .letter{
    float:left;
    color:#999;
  }
  .loadings{
    overflow:hidden;
    padding:1rem;
    text-align: center;
  }
</style>
