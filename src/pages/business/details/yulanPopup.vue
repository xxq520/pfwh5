<template>
  <div class="popup-bg">
    <div class="popup-box">
      <!--单价信息-->
      <div class="popup-item">
        <div class="pop-img"><img :src="headimg"></div>
        <div class="pop-text">
          <p v-if="listData">￥{{ listData&&queryType?listData.FactoryPrice:listData.ShopPrice }}</p>
          <div v-if="listProject">
            <div v-if="postData.proStandardJoints.length <= 2">
              <span v-for="(item,index) in postData.proStandardJoints" :key="index">{{ item.ParamterName?item.ParamterName:'规格' }}：{{ listData['StandardName'+(index+1)] }}</span>
            </div>
            <div v-else>
              <span >规格：<i v-for="(item,index) in getData" :key="index">{{ listData[index]+' / ' }}</i></span>
            </div>
          </div>
          <div v-else><span>该产品部分信息不完整</span></div>
          <span>库存量：{{ listData&&listData.StockCount?listData.StockCount:0 }}</span>
        </div>
      </div>
      <!--规格选择信息-->
      <div class="popup-item" v-for="(item,index) in postData.proStandardJoints" :key="index">
        <div class="list-title">{{ item.ParamterName }}</div>
        <div class="list-box">
          <span v-for="(text,i) in item.ListStandardJoints" :key="i" :class="{'shover':getData['StandardName'+(index+1)]==text.Name}" @click="Standard(index,text.Name,i)">{{ text.Name }}</span>
        </div>
      </div>
      <!--购买数量-->
      <!-- <div class="popup-item" style="padding:0.4rem 0;" v-if="isShowBuy" v-show="isMyStore">
        <div class="add-text">购买数量</div>
        <div class="add-box">
          <el-input-number v-model="num" @change="handleChange" style="width:7rem;"></el-input-number>
        </div>
      </div> -->
    </div>
    <!--按钮-->
    <!-- <div class="popup-btn" v-if="isShowBuy" v-show="isMyStore">
      <a href="javascript:" class="addCart" @click="addCart"><span>加入购物车</span></a>
      <a href="javascript:" class="buy" @click="buy"><span>立即购买</span></a>
    </div> -->
  </div>
</template>
<script>
  export default {
    props:["shift","detail","isType","isMyStore"],
    data(){
      return {
        num: 1,
        visible: this.shift,
        postData: this.detail,
        getData:{},
        listData:{},
        listProject:true,
        countChange:false,
        isShowBuy:this.isType,
        queryType:false,
        changeCart:0,
        headimg:''
      }
    },
    mounted() {
      let that = this;
      this.queryType = this.$route.query.type?true:false;
      $('.el-input-number input[type=text]').attr('type','number')
        .on('keyup',function(){
          $(this).val(this.value.replace(/\D/g,''));
          if(this.value > that.listData.StockCount){
            Toast({
              message: '购买数量过大，请按库存量购买。。。',
              className: 'counttc',
              duration: 1000
            });
            that.countChange = true;
          };
        })
        .on('blur',function(){
          if(this.value > that.listData.StockCount){
            Toast({
              message: '购买数量过大，请按库存量购买。。。',
              className: 'counttc',
              duration: 1000
            });
          };
        });
    },
    watch:{
      // 获取产品信息
      postData: {
        handler(curVal,oldVal){
          this.headimg = curVal.product.PriductImg?curVal.product.PriductImg:
                        curVal.listProductImg.length>0?curVal.listProductImg[0].ProductImgUrl:
                        '';
          curVal.proStandardJoints.forEach((post,index) => {
            this.getData['StandardName'+(index+1)] = '';
          });
          this.listData = curVal.listProStandAttached[0];
          this.oneprice(this.listData);
        },
        deep: true
      },
      visible(val){
        this.$emit("detail-change",val);
      },
      changeCart(val){
        this.$emit("cart-change",val);
      },
      shift(val){
        this.visible = val;
      },
      listData(val){
        this.$emit("listData-change",val);
      },
      num(val){
        this.$emit("num-change",val);
      }
    },
    methods:{
      handleChange(value) {
        this.num = value;
      },
      // 立即购买
      buy(){
        if(this.listData.StockCount <= 0){
          Toast({
            message: '该商品暂时无库存量！',
            className: 'counttc',
            duration: 2000
          });
          return false;
        }else if(this.num > this.listData.StockCount){
          Toast({
            message: '购买数量过大，请按库存量购买。。。',
            className: 'counttc',
            duration: 2000
          });
          return false;
        }else if(this.num < this.listData.Moq){
          Toast({
            message: '购买数量低于起订量，请重新选择购买数量',
            className: 'counttc',
            duration: 2000
          });
          return false;
        };
        if(this.countChange){
          this.countChange = false;
          return false;
        };
        this.visible = false;
        if(!this.listData.Sku){
          Toast('没有产品，无法购买。')
          return false;
        };
        let post = {
            iSeq: sessionStorage.seq,
            carInfoStr: [
                {
                  strSku: this.listData.Sku,
                  iBuyCount: this.num
                }
            ]
        };
        axios.post(this.URL + '/Product/PurchasingCertainProduct',post).then(res => {
          let data = res.data.Resultdata;
          let address = new Object();
          data.listAddressInfo.forEach(post => {
            if(post.IsDefault) address = post;
          });
          sessionStorage.setItem('shopData',JSON.stringify(data.listOrder));
          sessionStorage.setItem('setAddress',JSON.stringify(address));
          this.$router.push('/confirmorder');
        });
      },
      // 加入购物车
      addCart(){
        if(this.listData.StockCount <= 0){
          Toast({
            message: '该商品暂时无库存量！',
            className: 'counttc',
            duration: 2000
          });
          return false;
        }else if(this.num > this.listData.StockCount){
          Toast({
            message: '购买数量过大，请按库存量购买。。。',
            className: 'counttc',
            duration: 2000
          });
          return false;
        }else if(this.num < this.listData.Moq){
          Toast({
            message: '购买数量低于起订量，请重新选择购买数量',
            className: 'counttc',
            duration: 2000
          });
          return false;
        };
        if(this.countChange){
          this.countChange = false;
          return false;
        };
        if(!this.listData.Sku){
          Toast({
            message: '没有产品，无法加入购物车。',
            className: 'counttc',
            duration: 2000
          });
          return false;
        };
        this.visible = false;
        let post = {
          iSeq: sessionStorage.seq,
          strCode: this.listData.Code,
          carInfoStr: this.listData.Sku+'|'+this.num
        };
        axios.post(this.URL + '/Product/AddShoppingCart',post).then(res => {
          if(res.data.Code == 200){
            (this.changeCart)++;
          }else{
            Toast({
              message: '该商品已加入购物车，购买量过大，无法继续添加购买数量！',
              className: 'counttc',
              duration: 2000
            });
          };
        });
      },
      // 获得每个规格的选项
      Standard(s,text,v){
        if(this.getData['StandardName'+(s+1)] != text){
          this.getData['StandardName'+(s+1)] = text;
          this.unitprice(this.getData);
        };
      },
      // 获得规格产品信息条
      unitprice(arr){
        let that = this;
        ;(function(){
          let list = that.postData.listProStandAttached;
          for(let y in list){
            if(tf(list[y])){
              that.listData = list[y];
              that.listProject = true;
              return false;
            };
          };
        })();
        function tf(obj){
          for(let i in arr){
            if(arr[i].replace(/^\s|\s$/,'') != obj[i].replace(/^\s|\s$/,'')){
              that.listData = {};
              that.listProject = false;
              return false;
            }
          };
          return true;
        };
        that.listData.FactoryPrice = that.listData.FactoryPrice?that.listData.FactoryPrice:0;
        that.num = this.listData.Moq = that.listData.Moq?that.listData.Moq:1;
      },
      oneprice(obj){
        let that = this;
        if(that.postData.proStandardJoints.length != 0){
          that.postData.proStandardJoints.forEach((post,index) => {
            (function(p){
          console.log(p);
              for(var y=0;y<p.length;y++){
                if(obj['StandardName'+(y+1)] == p[y].Name){
                  that.getData['StandardName'+(y+1)] = p[y].Name;
                  return false;
                }
              }
            })(post.ListStandardJoints,index);
          });
        that.listData.FactoryPrice = that.listData.FactoryPrice?that.listData.FactoryPrice:0;
        that.num = this.listData.Moq = that.listData.Moq?that.listData.Moq:1;
        }
      }
    }
  }
</script>

<style>
.counttc{
  z-index:999999
}
/*.mint-popup-bottom{
    z-index: 1000!important;
}*/
.v-modal{
  z-index: 10!important;
}
</style>

<style scoped>
.popup-bg{
  width:100%;
  overflow:auto;
  background:white;
  padding:10px;
  height:100%;
}
.popup-box{
  padding-bottom:50px;
  overflow:hidden;
}
.popup-item{
  overflow:hidden;
  padding:0.5rem 0;
  font-size:0.65rem;
  border-bottom:1px solid #e6e6e6;
}
.popup-item .pop-img{
  float:left;
  width:4.5rem;
  height:4.5rem;
  border:1px solid #e6e6e6;
}
.popup-item .pop-img img{
  height:100%;
}
.popup-item .pop-text{
  float:right;
  width:calc(100% - 5.5rem);
  padding:0.3rem 0;
}
.popup-item .pop-text p{
  font-size:0.7rem;
  color:#ff0025;
  line-height:1.2em;
}
.popup-item .pop-text span{
  display:block;
  color:#666;
  padding-top:0.17rem;
}
.list-title{
  overflow:hidden;
  color:#333;
}
.list-box {
  overflow:hidden;
  width:calc(100% + 0.7rem);
}
.list-box span{
  float:left;
  min-width:5em;
  padding:0 0.4rem;
  line-height:2.1em;
  margin-right:0.7rem;
  border-radius:5rem;
  margin-top:0.4rem;
  text-align:center;
  background:#e9e9e9;
}
.list-box span.shover{
  background:#ff0025;
  color:white;
}
.add-text{
  float:left;
  line-height:40px;
}
.add-box{
  float:right;
}
.popup-btn{
    overflow:hidden;
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    background:white;
    border-top:1px solid #e0e0e0;
    z-index:9999;
}
.popup-btn a{
    float:left;
    width:50%;
    color:white;
    font-size:16px;
    line-height:100%;
    height:50px;
    text-align:center;
    line-height:45px;
}
.popup-btn a.addCart{
    background-color:#fb7024;
}
.popup-btn a.buy{
    background-color:#f23030;
}
.popup-bg >>> .el-input-number .el-input__inner{
  padding-left: 40px;
  padding-right: 40px;
}
.popup-bg >>> .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), .popup-bg >>> .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
  border-color:#dcdfe6;
}
</style>