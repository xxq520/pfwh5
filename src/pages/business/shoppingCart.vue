<template>
  <div class="glode" v-infinite-scroll="createdfn" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
    <header class="mint-header">
      <mt-button icon="back" slot="left" @click="$router.go(-1)" v-if="userType != 1||userBlock"></mt-button>
      <div class="mint-header-button is-left"></div>
      <h1 class="mint-header-title">购物车{{ '('+list+')' }}</h1>
      <div class="mint-header-button is-right" @click="clearfn">删除</div>
    </header>
    <div v-if="shopkong" class="shopKong">
      <p><i class="el-icon-goods"></i><p>
      <p>亲，购物车空荡荡的(┬＿┬)</p>
    </div>
    <div v-else class="shopbox" v-for="(whole,post) in shopData" :key="post">
      <div class="merchants">
        <i class="checked" @click="listAll($event, post)"></i>
        <span><router-link :to="'/business?wholesaler='+whole[0].WhosaleNo">{{ whole[0].WhosaleName }}</router-link></span>
      </div>
      <div class="shoplist">
        <!--产品-->
        <div class="goods" v-for="(item,index) in whole" :key="index">
          <div class="shopcheck"><i class="checked" @click="listcheck($event, post, item)" :data-sku="item.sku"></i></div>
          <div class="shopmain">
            <div class="shopimg" @click="(item.DeleteStatus == 1||item.DeleteStatus == 0&&(item.isupper==0||item.isupper==2))?'':jumpToDetails(item.code,item.WhosaleNo)"><img :src="item.PriductImg"></div>
            <div class="shoptext">
              <div class="shopname" @click="(item.DeleteStatus == 1||item.DeleteStatus == 0&&(item.isupper==0||item.isupper==2))?'':jumpToDetails(item.code,item.WhosaleNo)">{{ item.name }}</div>
              <div class="shopspec" @click="(item.DeleteStatus == 1||item.DeleteStatus == 0&&(item.isupper==0||item.isupper==2))?'':jumpToDetails(item.code,item.WhosaleNo)">
                <div class="spec">
                  <span>规格:{{ item.other1Name }}</span><!--<i class="el-icon-arrow-down"></i>-->
                </div>
              </div>
              <div class="shopdeal">
                <div class="money">金额:￥{{ (item.DeleteStatus==1||(item.DeleteStatus==0&&(item.isupper==0||item.isupper==2)))?0:item.discountprice }}</div>
                <div class="numb">
                  <span class="minus" @click="(item.DeleteStatus==1||(item.DeleteStatus==0&&(item.isupper==0||item.isupper==2)))?'':minusfn($event, post, index, item.qidingCount)"><i class="el-icon-minus"></i></span>
                  <input type="number" :readonly="(item.DeleteStatus==1||(item.DeleteStatus==0&&(item.isupper==0||item.isupper==2)))?true:false" class="numbers" :value="(item.DeleteStatus==1||(item.DeleteStatus==0&&(item.isupper==0||item.isupper==2)))?0:item.buycount" @keyup="keyupfn($event, post, index, item.qidingCount, item.stockcount)">
                  <span class="plus" @click="(item.DeleteStatus==1||(item.DeleteStatus==0&&(item.isupper==0||item.isupper==2)))?'':plusfn($event, post, index, item.stockcount)"><i class="el-icon-plus"></i></span>
                </div>
              </div>
              <!-- <div class="delPrice" v-if="item.discountprice != item.dlprice">￥{{item.dlprice}}</div> -->
              <div>
                <div class="isValid stock" style="color:#666">库存：{{item.DeleteStatus == 0&&(item.stockcount&&(item.isupper==1))?item.stockcount:0}}</div>
                <div class="isValid" v-if="item.DeleteStatus == 1">（商品已失效）</div>
                <div class="isValid" v-else-if="item.DeleteStatus == 0&&(item.isupper == 0||item.isupper == 2)">（商品已下架）</div>
              </div>

            </div>
          </div>
        </div>
        <!---->
      </div>
    </div>
    <div class="settlement" :style="(userType==2||userType==3|| userType == 6||userType==7||userType==8||userBlock)?'bottom:0':'bottom:55px'">
      <div class="setbut"
           :style="{background:'#ddd'}"
           @click="setbut">去结算{{ '('+checklist+')' }}</div>
      <div class="setmoney">合计：<i>{{ money }}</i></div>
      <input type="hidden" :value="moneyAll"> <!--防止修改产品数量无效-->
    </div>
    <!-- <wholesale-nav v-if="userType == 2"></wholesale-nav> -->
    <bottomnav :bottom="bottomnav" :carcount="carcount" v-if="(userType == 1 || userType == 5)&&!userBlock"></bottomnav>
  </div>
</template>

<script>
import wholesaleNav from '@/components/WholesaleNav'
import { showToast } from '../../assets/js/common';
export default {
  data() {
    return {
      topnav:{
        title:'购物车',
        editor:true
      },
      bottomnav:{
        index:'购物车'
      },
      loading: false,
      checkAll: false,
      shopData:{},
      skip:0,
      take:5,
      num1:1,
      list:0,
      money:0,
      moneyAll:0,
      shift:false,
      order:[],
      checklist:0,
      carcount:0,
      shopkong:false,
      userType:'',
      userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
    }
  },
  components:{
    wholesaleNav
  },
  created(){
        let userType = sessionStorage.getItem('userType');
        if(userType){
            this.userType = userType;
        }
        //
    },
  mounted(){
    this.createdfn();
  },
  methods: {
    createdfn(){
      Indicator.open();
      this.loading = true;
      let that = this;
      // 购物车集合
      axios.get(this.URL + '/OrderNewBuycar/BuyCar?skip='+this.skip+'&take='+this.take+'&seq='+sessionStorage.seq).then(res => {
        let data = res.data;
        Indicator.close();
        data.forEach(post => {
          if(that.shopData[post.WhosaleNo]){
            that.shopData[post.WhosaleNo].push(post);
          }else{
            that.shopData[post.WhosaleNo] = [];
            that.shopData[post.WhosaleNo].push(post);
          }
        });
        // 判断购物车是否有商品
        ;(function (){
          for(let i in that.shopData){
            that.shopkong = false;
            return false;
          };
          that.shopkong = true;
          return true;
        })();
        this.skip += this.take;
        this.listfn();
        this.moneyfn();
        if(data.length == 0){
          this.loading = true;
          return false;
        };
        this.loading = false;
        // 下拉重新判断商家全选
        setTimeout(function(){
          if(that.order.length>0){
            let vs = 0;
            for(var i in that.shopData){
              that.judgeCheck($('.shopbox').eq(vs));
              vs++;
            };
          }
        },50);
      }).catch(err => {
        Indicator.close();
      });
    },
    jumpToDetails(code,seq){
      this.$router.push({path:'/details',query:{strCode:code,wholesaleSEQ:seq}});
    },
    // 结算选择购物商品
    setbut(){
        showToast('请前往520批发网app中完成后续支付')
        return
      let that = this;
      if(this.order.length == 0){
        Toast('请选择要购买的产品！');
        return false;
      };
      let post = {
          iSeq: sessionStorage.seq,
      };
      let buyArr = [];
      let order = '';
      for(var i=0;i<this.order.length;i++){
        let posts = this.order[i];
        if(posts.DeleteStatus == 0 &&(posts.isupper == 0 || posts.isupper == 2)){
          showToast('所选择的订单内包含已下架产品，请重新选择！')
          return false;
        }else if(posts.DeleteStatus == 1){
          showToast('所选择的订单内包含已失效产品，请重新选择！')
          return false;
        }
        if(posts.buycount > posts.stockcount){
          Toast('亲，'+posts.name+'库存量不足，无法购买。');
          this.listcheck(posts.sku, posts.WhosaleNo, posts);
          return false;
        };
        let obj = {
          strSku: posts.sku,
          iBuyCount: posts.buycount
        };
        buyArr.push(obj);
        order = i==this.order.length-1?order+posts.ordernumber:order+posts.ordernumber+',';
      };
      post.carInfoStr = buyArr;
      axios.post(this.URL + '/Product/PurchasingCertainProduct',post).then(res => {
          let data = res.data.Resultdata;
          let status = true;
          let address = new Object();
          data.listAddressInfo.forEach(post => {
            if(post.IsDefault) address = post;
          });
          data.listOrder.forEach(post2 => {
            post2.listProductModel.forEach(item =>{
              if(item.Status != 1){
                showToast('所选商品库存数量不足，请重新下单！');
                status = false;
              }
            })
          })
          if(status){
            sessionStorage.setItem('shopData',JSON.stringify(data.listOrder));
            sessionStorage.setItem('setAddress',JSON.stringify(address));
            this.$router.push({path:'/confirmorder',query:{ordernumber:order}});
          }else{
            location.reload();
          }
      });
    },
    // 删除购物车产品
    clearfn(){
      if(this.order.length == 0){
        Toast('请选择需要删除的产品！');
        return false;
      };
      let order = '';
      this.skip = 0;
      this.order.forEach((post,index) => {
        order = index==this.order.length-1?order+post.ordernumber:order+post.ordernumber+',';
      });
      axios.get(this.URL + '/OrderNewBuycar/Deletes?ordernumber='+order).then(res => {
        if(res.data){
          Toast('删除成功');
          this.createdfn();
        };
        (this.carcount)++;//改变值刷新底部购物车数量
        this.shopData = {};
        this.order = [];
        this.checklist = this.order.length;
        $('.checked').removeClass('hover el-icon-check');
        this.moneyfn();
      })
    },
    // 减
    minusfn(event,p,i,min){
      console.log(min)
      let that = this;
      let elem = event.currentTarget.parentNode;
      let list = new Number($(elem).find('input').val());
      let mins = min?new Number(min):0;
      if(list > mins){
        list--;
        that.shopData[p][i].buycount = list;
        $(elem).find('input').val(list);
        that.moneyfn();
        that.UpdateNum(that.shopData[p][i]);
        that.addmiusProject(that.shopData[p][i]);
      }
    },
    // 加
    plusfn(event,p,i,max){
      let that = this;
      let elem = event.currentTarget.parentNode;
      let list = new Number($(elem).find('input').val());
      if(max){
        let maxs = new Number(max)
        if(list < max){
          list++;
          addfn();
        }else{
          Toast('购买数量过多!');
        }
      }else{
        list++;
        addfn();
      };
      function addfn(){
        that.shopData[p][i].buycount = list;
        $(elem).find('input').val(list);
        that.moneyfn();
        that.UpdateNum(that.shopData[p][i]);
        that.addmiusProject(that.shopData[p][i]);
      }
    },
    keyupfn(event,p,i,min,max){
      let that = this;
      let elem = event.currentTarget;
      let list = new Number($(elem).val());
      let mins = min?new Number(min):0;
      let maxs = new Number(max);
      function addfn(){
        that.shopData[p][i].buycount = list;
        $(elem).val(list);
        that.moneyfn();
        that.UpdateNum(that.shopData[p][i]);
        that.addmiusProject(that.shopData[p][i]);
      }
      if(max){
        if(list <= maxs && list > maxs){
          addfn();
          return false;
        }else if(list > maxs){
          $(elem).val(maxs)
          Toast('购买量过大!');
        }
      };
      if(min){
        if(list >= mins && list < maxs){
          addfn();
          return false;
        }else if(list < mins){
          $(elem).val(mins)
          Toast('购买量不能少于起订量!');
        }
      };
    },
    // 单个店铺全选
    listAll(event,p){
      if(this.order.length>0 && this.order[0].WhosaleNo != p){
        Toast('不能同时选择2个的批发商商品下单！');
        return false;
      };
      let elem = event.currentTarget;
      let checked = $(elem).closest('.shopbox').find('.checked');
      if($(elem).attr('class').indexOf('hover') == -1){
        this.shopData[p].forEach(post => {
          this.addArr(p,post);
        });
        $(elem).addClass('hover el-icon-check');
        checked.addClass('hover el-icon-check');
      }else{
        this.shopData[p].forEach(post => {
          this.removeArr(post);
        });
        $(elem).removeClass('hover el-icon-check');
        checked.removeClass('hover el-icon-check');
      };
      this.checklist = this.order.length;
      this.moneyfn();
    },
    // 单商品选择
    listcheck(event,p,obj){
      if(this.order.length>0 && this.order[0].WhosaleNo != p){
        Toast('不能同时选择2个的批发商商品下单！');
        return false;
      };
      let elem = (typeof event == 'object')?event.currentTarget:$('[data-sku='+event+']').get([0]);
      let list = $(elem).closest('.shopbox');
      if($(elem).attr('class').indexOf('hover') == -1){
        this.addArr(p,obj);
        $(elem).addClass('hover el-icon-check');
      }else{
        this.removeArr(obj);
        $(elem).removeClass('hover el-icon-check');
      };
      this.judgeCheck(list);
      this.checklist = this.order.length;
      this.moneyfn();
    },
    // 判断单个店铺选择
    judgeCheck(elem){
      let checkelem = $(elem).find('.shoplist .checked');
      for(var i=0;i<checkelem.length;i++){
        if(checkelem.get([i]).className.indexOf('hover') == -1){
          $(elem).find('.merchants .checked').removeClass('hover el-icon-check');
          return false;
        }
      };
      $(elem).find('.merchants .checked').addClass('hover el-icon-check');
      return true;
    },
    // 添加选中的货单
    addArr(post, obj){
      for(var i=0;i<this.order.length;i++){
        if(this.order[i].sku == obj.sku) return false;
      };
      this.order.push(obj);
    },
    // 删除选中的货单
    removeArr(obj){
      for(var i=0;i<this.order.length;i++){
        if(this.order[i].sku == obj.sku){
          this.order.splice(i,1);
          return false
        }
      }
    },
    // 计算器加减产品数量
    addmiusProject(obj){
      this.order.forEach((post,index) => {
        if(post.sku == obj.sku) post.num = obj.buycount;
      });
    },
    // 更改购物数量
    UpdateNum(obj){
      axios.post(this.URL + '/OrderNewBuycar/UpdateBuyCountOrPrice?ordernumber='+obj.ordernumber+'&buycount='+obj.buycount)
    },
    // 获取购物车数目
    listfn(){
      axios.get(this.URL + '/OrderNewBuycar/GetBuyCarCount?seq='+sessionStorage.seq).then(res => {
        this.list = res.data;
      });
    },
    // 计算总金额数
    moneyfn(){
      this.money = 0;
      let text = '';
      this.order.forEach(res => {
        text += res.ordernumber+','
      });
      for(var i in this.shopData){
        this.shopData[i].forEach(post => {
          if(text.indexOf(post.ordernumber) != -1) this.money += post.discountprice*post.buycount;
          this.moneyAll += post.discountprice*post.buycount;
        });
      };
      this.money = this.money.toFixed(2);
    }
  }
};
</script>

<style scoped>
.glode{
  min-height:100vh;
  padding-top:40px;
  padding-bottom:110px;
  height: auto;
  overflow-y: auto;
}
.glode >>> .mint-header{
  position:fixed;
  left:0;
  top:0;
  width:100%;
  z-index:99;
}
.is-right{
  font-size:14px;
}
.shopbox{
  background:white;
  margin-top:0.5rem;
  font-size:0.65rem;
}
.shopbox .merchants{
  display: -webkit-flex;
  display: flex;
  -webkit-align-items:center;
  align-items:center;
  padding:0.5rem 10px;
  border-bottom:1px solid #f1f2f5;
  color:#333;
}
.checked{
  float:left;
  width:1.1em;
  height:1.1em;
  border:1px solid #ccc;
  overflow:hidden;
  border-radius:50%;
  color:white;
}
.checked.hover{
  background:red;
  border-color:red;
}
.shopbox .merchants span{
  padding-left:0.4rem;
}
.shopbox .shoplist{
  padding:0 10px;
}
.shopKong{
  overflow:hidden;
  font-size:0.7rem;
  text-align: center;
  color:#ccc;
  padding:1.5rem 0;
}
.shopKong p{
  margin-bottom:0.6rem;
}
.shopKong p i{
  font-size:4rem;
}
.shopbox .shoplist .goods{
  display: -webkit-flex;
  display: flex;
  -webkit-align-items:center;
  align-items:center;
  padding:0.5rem 0;
  border-bottom:1px solid #f1f2f5;
  zoom:1;
}
.shopbox .shoplist .goods .shopcheck{
  float:left;
  padding-right:0.4rem;
}
.shopbox .shoplist .goods .shopmain{
  float:right;
  width:calc(100% - 1rem - 2px);
}
.shopmain .shopimg{
  float:left;
  width:4rem;
  height:4rem;
  border:1px solid #e6e6e6;
}
.shopmain .shopimg img{
  display:block;
  width:100%;
  height:100%;
}
.shopmain .shoptext{
  float:right;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content:space-between;
  justify-content:space-between;
  width:calc(100% - 4.5rem);
  /* height:4rem; */
  font-size:0.62rem;
  line-height:1.2em;
}
.shopmain .shoptext .shopname{
  width:100%;
  line-height:1.2em;
  height:calc(2.4em - 1px);
  overflow:hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.shopmain .shoptext .shopspec{
  position:relative;
}
.shopmain .shoptext .shopspec .spec{
  display:inline-block;
  position:relative;
  max-width:calc(100% - .3rem);
  line-height:1.6em;
  height:1.6em;
  padding:0 0.3rem;
  background:#f9f9f9;
  color:#999;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.shopmain .shoptext .shopspec .spec i{
  color:#d6d6d6;
  position:absolute;
  right:0.3rem;
  top:0;
  line-height:1.6em;
}
.shopdeal{
  overflow:hidden;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items:center;
  align-items:center;
  -webkit-justify-content:space-between;
  justify-content:space-between;
  padding: .2222rem 0;
}
.shopdeal .money{
  float:left;
  color:#e4393c;
}
.shoptext .delPrice{
  color:#666;
  font-size:.5333rem;
  text-decoration: line-through;
}
.isValid{
  display: inline-block;
  font-size: .4888rem;
  color:#ff0000;
}
.settlement{
  position:fixed;
  left:0;
  bottom:55px;
  width:100%;
  background:white;
  font-size:0.65rem;
  border-top:1px solid #e6e6e6;
}
.settlement .setcheck{
  float:left;
  padding:0 10px;
  height:50px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items:center;
  align-items:center;
}
.settlement .setmoney{
  float:right;
  line-height:50px;
  padding-right:0.4rem;
}
.settlement .setmoney i{
  font-size:0.65rem;
  color:#e4393c;
}
.settlement .setbut{
  float:right;
  padding:0 0.5rem;
  line-height:50px;
  color:white;
  background:#e4393c;
}
.nodata{
  overflow:hidden;
  padding:1rem;
  text-align: center;
  font-size:0.8rem;
  font-weight:bold;
  color:#ccc;
}
/* popup */
.popup{width:100%;height:70vh;top:30vh !important;background:white !important;}
.close{
  position:absolute;
  right:10px;
  top:10px;
  font-size:1rem;
  color:#999;
}
.glode >>> .bottomnav{
  box-shadow:none;
}
/*计数器*/
.numb{
  float:right;
  font-size:0.6rem;
  width:7em;
  border:1px solid #999;
  overflow:hidden;
  text-align: center;
}
.numb .minus{
  float:left;
  width:1.8em;
  line-height:1.6em;
  border-right:1px solid #999;
  color:#999;
}
.numb .plus{
  float:right;
  width:1.8em;
  line-height:1.6em;
  border-left:1px solid #999;
  color:#999;
}
.numb .numbers{
  float:left;
  font-size:0.6rem;
  width:calc(100% - 2px - 3.6em);
  line-height:1.6em;
  color:#999;
  text-align: center;
}

</style>
