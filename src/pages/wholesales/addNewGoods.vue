<template>
    <div class="addNewGoods" :style="{height:addNewGoodsHeight+'px'}">
        <div class="main" v-show="!isAddSpec">
        <topnav :top="topnav" ></topnav>
            <ul class="goodsDesc">
                <li class="title">商品信息</li>
                <li class="goodsFilter">
                    <span class="liTitle">商品分类：</span>
                    <div class="liMain rightIcon">
                        <span class="filterOption"><input type="text" v-model="classify" placeholder="没有..." readonly></span>
                    </div>
                </li>
                <li class="goodsName">
                    <span class="liTitle">商品名称：</span>
                    <input type="text" v-model="Name" placeholder="请输入商品名称(5-20个字符，特殊字符除外)">
                    <div class="liMain">
                    </div>
                </li>
                <li class="goodsInfo">
                    <span class="liTitle">商品简介：</span>
                    <div class="liMain"><input type="text" v-model="Crime" placeholder="没有..." readonly></div>
                </li>
                <li class="keyWords">
                    <span class="liTitle">关键字：</span>
                    <div class="liMain"><input type="text" v-model="Keywords" placeholder="没有..." readonly></div>
                </li>
            </ul>
            <ul class="specSetting">
                <li class="title">规格设置</li>
                <li class="specItem" v-for="(item,index) in postData.listProStandAttached" :key="index">
                    <span class="liTitle">规格{{ (index+1) }}：</span>
                    <div class="liMain" @click="property(item)">
                        <p class="text">
                            <span v-for="(post,i) in Property" :key="i">
                                {{ item['StandardName'+(i+1)]?item['StandardName'+(i+1)]+(i==postData.listProductProperty.length-1?'':'/'):'' }}
                            </span>
                        </p>
                        <i class="hidePage el-icon-arrow-right"></i>
                    </div>
                </li>
            </ul>
            <ul class="paramSetting">
                <li class="title">参数设置</li>
                <!-- <li class="goodsType">
                    <span class="liTitle">商品类型：</span>
                    <div class="liMain">
                        <el-radio v-model="WeightType" label="轻货" disabled>轻货</el-radio>
                        <el-radio v-model="WeightType" label="重货" disabled>重货</el-radio>
                    </div>
                </li> -->
                <li class="factory" v-for="(item,index) in listProParameter" :key="index">
                    <span class="liTitle">{{item.PName}}：</span>
                    <div class="liMain"><input type="text" v-model="item.PDName" placeholder="没有..." readonly></div>
                </li>
                <!-- <li>
                    <div class="goodsLength">
                        <div class="Lengthlist" v-for="(item, index) in postData.listProParameter" :key="index">
                            <span class="liTitle">{{ item.PName }}：</span>
                            <div class="liMain">{{ item.PDName }}</div>
                        </div>
                    </div>
                </li> -->
            </ul>
            <ul class="imgManagement">
                <li class="title">图片管理</li>
                <li class="goodsImg">
                    <span class="liTitle">商品图：</span>
                    <div class="liMain" v-if="listimg.length > 0">
                        <ul class="goodsImgList">
                            <li class="goodsImgItem" v-for="(item, index) in listimg" :key="index"><img :src="item.strProductImgUrl"></li>
                        </ul>
                    </div>
                    <div class="liMain" v-else style="font-size:0.6rem;">没有</div>
                </li>
            </ul>
            <div class="submitBox"><button class="submitBtn" @click="submitfn">提交</button></div>
        </div>
        <!--一批二批批发商-->
        <div class="addSpec" v-show="isAddSpec">
        <div class="addSpecHeader">
          <p><i class="el-icon-arrow-left" @click="closeAddSpec"></i><span>商品规格设置</span></p>
        </div>
        <div class="addSpecMain">
          <ul class="specList">
            <li class="specItem size" v-for="(item,index) in Property" :key="index">
              <p class="title">{{ item.Name }}</p>
              <ul class="sizeList list">
                <!--<li class="sizeItem item" v-for="(post,i) in Standard" :key="i" v-if="post.ParamterId == item.Id || post.ParameterId == item.Id"  :class="{'sizehover':propertyOBJ['StandardName'+(index+1)]==post.Name}" @click="itemsize(index,post.Name)">-->
                <li class="sizeItem item" v-for="(post,i) in Standard" :key="i" v-if="post.ParamterId == item.Id || post.ParameterId == item.Id"  :class="{'sizehover':propertyOBJ['StandardName'+(index+1)]==post.Name}">
                  <p>{{post.Name}}</p>
                </li>
              </ul>
            </li>
            <li class="specItem priceAndStock">
              <p class="title">价格/库存</p>
              <ul class="list" style="width:calc(100% + 0.4rem);">
                <li class="storePrice inputStyle">
                  <p>成本价:</p>
                  <!--判断是否是区域批发商，如果是则禁止输入成本价-->
                  <input type="number" :disabled="userBlock" placeholder="无成本价" v-model="propertyOBJ.FactoryPrice" :style="{color:userBlock?'#333':'#666'}">
                </li>
                <li class="wholesalePrice inputStyle">
                  <p>销售价:</p>
                  <input type="number" placeholder="输入销售价" v-model="propertyOBJ.ShopPrice">
                </li>
                <li class="storePrice inputStyle">
                  <p>零售价:</p>
                  <input type="number" placeholder="输入零售价" v-model="propertyOBJ.WholesalePrice">
                </li>
                <li class="stock inputStyle">
                  <p>库存量:</p>
                  <input type="number" placeholder="输入库存量" v-model="propertyOBJ.StockCount" @keyup="inputnige($event,'StockCount')">
                </li>
                <li class="stock inputStyle">
                  <p>起订量:</p>
                  <input type="number" placeholder="输入起订量" v-model="propertyOBJ.Moq" @keyup="inputnige($event,'Moq')">
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="saveSpec">
          <span class="saveSpecBtn" @click="confirm">确定</span>
        </div>
      </div>
    </div>
</template>
<script>
import { showToast } from '../../assets/js/common';
export default {
    data(){
        return {
            topnav:{
               title:'商品编辑',
            },
            WeightType:'',
            code:this.$route.query.code,
            isAddSpec:false,
            addNewGoodsHeight:0,
            isShowColor:false,
            classifyArr:[],
            classify:'',        // 商品分类
            postData:{},
            Name:'',
            Crime:'',
            Keywords:'',
            CompanyName:'',
            listimg:[],
            Property:[],
            Standard:[],
            propertyOBJ:new Object(),
            xuzhi:'',
            listProParameter:[],
            initData:[],
            userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是,//用户的身份是否是区域批发商 true为开启区域批发  false为平台批发商
        }
    },
    created(){
        // console.log($);

    },
    mounted(){
        if (this.userBlock) {
            $('.goodsName').find('input').attr('readonly','');
            $('.goodsName').find('input').css({color:'#666'})
        }
        Indicator.open();
        let that = this;
        // http://admapits.520shq.com/api
        var url=this.PRODUCT+'/Product/GetProductDetailsInfo?strCode='+this.code
        this.addNewGoodsHeight = document.documentElement.clientHeight;
        if(this.$store.state.userBlock){
          url+='&wholesalerType=2'
        }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
          url+='&wholesalerType=1'
        }else{
          url+='&wholesalerType=0'
        }
        url+='&wholesalerSeq='+sessionStorage.getItem('seq')
        axios.get(url).then(res => {
            let data = res.data.Resultdata;
            this.postData = data;
            this.initData=res.data.Resultdata
			if(!data || data.listProStandAttached && data.listProStandAttached.length == 0){
                // showToast('亲，从商品库添加的商品由于没有商品属性和规格，需要您移步到电脑端的批发商后台进行完善才可上架使用。感谢您的理解，谢谢！');
                MessageBox({
                    title:"温馨提示",
                    message: '亲，从商品库添加的商品由于没有商品属性和规格，需要您移步到电脑端的批发商后台进行完善才可上架使用。感谢您的理解，谢谢！',
                    showCancelButton: false
                }).then(action => {
                    if(action == 'confirm'){
                        return false;
                    }
                })
                Indicator.close();
                return false;
            };
            this.listProParameter = data.listProParameter;
            this.xuzhi = data.product.BuyersGuide;
            this.Name = data.product.Name;
            this.Crime = data.product.Crime;
            this.Keywords = data.product.Keywords;
            this.CompanyName = data.product.CompanyName
            this.listimg = data.listProductImg;
            this.WeightType = data.product.WeightType;
            this.Property = data.listProductProperty?data.listProductProperty.concat(data.listCustomizeProperty):[];
            data.listProStandardJoint.forEach((post,index) => {
                data.listProStandardJoint[index].name = post.Name.replace(/^\s|\s$/,'');
            });
            data.listCustomizeStandard.forEach((post,index) => {
                data.listCustomizeStandard[index].name = post.Name.replace(/^\s|\s$/,'');
            });
            
            this.Standard = data.listProStandardJoint.concat(data.listCustomizeStandard);
            this.propertyOBJ = data.listProStandAttached[0];
            var objData={iSeq:sessionStorage.getItem('seq')}
            if(this.$store.state.userBlock){
                objData.wholesalerType=2
            }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                objData.wholesalerType=1
            }else{
                objData.wholesalerType=0
            }
            axios.get(that.URL+'/Product/GetListWholesaleProductClass',{params:objData}).then(res => {
                try {
                    that.classifyArr = that.userBlock?JSON.parse(res.data.Resultdata):res.data.Resultdata;
                } catch (err) {
                    that.classifyArr = res.data.Resultdata;
                }
                that.classifyArr.forEach(post => {
                    if(data.product.CategoryId == post.Id) that.classify = post.Name;
                });
                Indicator.close();
            });
        });
    },
    methods:{
        addSpec(isSpec){
            this.isAddSpec = isSpec;
        },
        closeAddSpec(){
            this.isAddSpec = false;
        },
        property(obj){
            let that = this;
            this.isAddSpec = true;
            this.propertyOBJ = obj;
            inputChange();
            $('.inputStyle input').on('change',inputChange);
            function inputChange(){
                that.propertyOBJ.FactoryPrice = Math.round(that.propertyOBJ.FactoryPrice*100)/100;
                that.propertyOBJ.WholesalePrice = Math.round(that.propertyOBJ.WholesalePrice*100)/100;
                that.propertyOBJ.ShopPrice = Math.round(that.propertyOBJ.ShopPrice*100)/100;
                that.propertyOBJ.StockCount = Math.floor(that.propertyOBJ.StockCount*100/100);
                that.propertyOBJ.Moq = Math.floor(that.propertyOBJ.Moq*100/100);
            };
        },
        inputnige(event,val){
            let elem = event.currentTarget;
            let text = new String(elem.value);
            let texts = val=='StockCount'?'库存量':val=='Moq'?'起订量':'';
            if(elem.value > 1000000000){
                if(val=='StockCount'){
                    showToast(texts+'不能输入太大！');
                    this.propertyOBJ.StockCount = new Number(text.substring(0,9));
                }else if(val=='Moq'){
                    showToast(texts+'不能输入太大！');
                    this.propertyOBJ.Moq = new Number(text.substring(0,9));
                };
               return false;
            }
        },
        itemsize(i,text){
            this.propertyOBJ['StandardName'+(i+1)] = text;
        },
        confirm(){
            if(this.propertyOBJ.FactoryPrice == 0){
                showToast('成本价不能为空或0');
                return false;
            }
            if(this.propertyOBJ.WholesalePrice == 0){
                showToast('批销价不能为空或0');
                return false;
            }
            if(this.propertyOBJ.ShopPrice == 0){
                showToast('店铺价不能为空或0');
                return false;
            }
            if(this.propertyOBJ.StockCount == 0){
                showToast('库存量不能为空或0');
                return false;
            }
            if(this.propertyOBJ.Moq == 0){
                showToast('起订量不能为空或0');
                return false;
            }
            if(this.propertyOBJ.Moq > this.propertyOBJ.StockCount){
                showToast('起订量不能大于库存量');
                return false;
            }
            //判断如果是区域批发商则需要验证销售价和零售价区间值是否符合后台设置区间值
            if(this.userBlock){
              //销售价
              var ShopPrice=this.propertyOBJ.ShopPrice;
              //零售价
              var WholesalePrice=this.propertyOBJ.WholesalePrice;
              //平台后台设置的销售价
              var adminShopMaxPrice=this.propertyOBJ.SalePriceMax;
              var adminShopMinPrice=this.propertyOBJ.SalePriceMin;
              //平台后台设置的零售价
              var adminWholesaleMaxPrice=this.propertyOBJ.RetailPriceMax;
              var adminWholesaleMinPrice=this.propertyOBJ.RetailPriceMin;
              //判断销售价是否大于平台设置的销售价
              if((ShopPrice<adminShopMinPrice)){
                showToast("销售价需大于平台设置的销售价："+adminShopMinPrice);
                return false;
              }
              if((ShopPrice>adminShopMaxPrice)){
                showToast("销售价需小于平台设置的销售价："+adminShopMaxPrice);
                return false;
              }
              if((WholesalePrice<adminWholesaleMinPrice)){
                showToast("零售价需大于平台设置的零售价："+adminWholesaleMinPrice);
                return false;
              }
              if((WholesalePrice>adminWholesaleMaxPrice)){
                showToast("零售价需小于平台设置的零售价："+adminWholesaleMaxPrice);
                return false;
              }
            }
            this.postData.listProStandAttached.forEach((post,index) => {
                if(post.ID == this.propertyOBJ.ID){
                    this.postData.listProStandAttached[index] = this.propertyOBJ;
                    this.isAddSpec = false;
                }
            });
            
        },
        submitfn(){
            let that = this;
            let data = this.postData;
            // axios.post(this.PRODUCT + '/Product/AndOrEditProductInfo',post).then(res => {
            if(!data || data.listProStandAttached && data.listProStandAttached.length == 0){
                // showToast('亲，从商品库添加的商品由于没有商品属性和规格，需要您移步到电脑端的批发商后台进行完善才可上架使用。感谢您的理解，谢谢！');
                MessageBox({
                    title:"温馨提示",
                    message: '亲，从商品库添加的商品由于没有商品属性和规格，需要您移步到电脑端的批发商后台进行完善才可上架使用。感谢您的理解，谢谢！',
                    showCancelButton: false
                }).then(action => {
                    if(action == 'confirm'){
                        return false;
                    }
                })
            }else{
                let post = {
                  arrListCustomizeProperty:[],
                  arrListProStandAttached: [],
                  arrListCustomizeStandards:  [],
                  arrListProStandardJoint: [],
                  arrListProParameter: [],
                  product: {
                      SEQ: sessionStorage.seq,
                      BuyersGuide:this.xuzhi,
                      CategoryId: data.product.CategoryId,
                      GenreId: data.product.GenreId,
                      ThreeId: data.product.ThreeId,
                      FourId: data.product.FourId,
                      Name: this.Name,
                      Code: data.product.Code,
                      Crime: data.product.Crime,
                      Sort: data.product.Sort,
                      WeightType: data.product.WeightType,
                      Weight: data.product.Weight,
                      Volume: data.product.Volume,
                      Package: data.product.Package,
                      Unit: data.product.Unit,
                      Keywords: data.product.Keywords,
                      TermsConditions: data.product.TermsConditions,
                      Description: data.product.Description,
                      CreatUser: data.product.CreatUser,
                      FactoryCode: data.product.FactoryCode,
                      Barcode: data.product.Barcode
                  },
                  arrListProductImg: []
              };
              // 自定义属性
              this.postData.listCustomizeProperty.forEach((res,index) => {
                  let resdata = {
                      parentId: res.Id,
                      name: res.Name,
                      rowIndex: res.Sort,
                      Status: res.Status
                  };
                  post.arrListCustomizeProperty.push(resdata);
              })
              // 产品规格信息
              this.postData.listProStandAttached.forEach((res,index) => {
                  if(res.ID !=0){
                      let resdata = {
                          StockCount : res.StockCount,
                          Moq : res.Moq,
                          ShopPrice : res.ShopPrice,
                          WholesalePrice : res.WholesalePrice,
                          proId : res.ID,
                          FactoryPrice : res.FactoryPrice,
                          ProduceMoq: res.ProduceMoq,
                          SafeStockCount: res.SafeStockCount,
                          Code: this.code,
                          SalePriceMin: res.SalePriceMin,
                          SalePriceMax: res.SalePriceMax,
                          Sku: res.Sku,
                          GrossProfitMargin: res.GrossProfitMargin,
                          IsUpper: res.IsUpper,
                          RetailPrice:res.RetailPrice,
                          ID: res.ID,
                          RetailPriceMin: res.RetailPriceMin,
                          RetailPriceMax: res.RetailPriceMax,
                          FactoryUnitPrice: res.FactoryUnitPrice,
                          PlatformPrice: res.PlatformPrice,
                          PlatformUnitPrice: res.PlatformUnitPrice,
                          Status: res.Status,
                          MemberPrice: res.MemberPrice,
                          Isstandard: res.Isstandard,
                          ProductType: res.ProductType,
                          Iscommoditynature: res.Iscommoditynature,
                          CreatDate: res.CreatDate,
                          CreatUser: res.CreatUser,
                          ProduceCount: res.ProduceCount,
                          ProStandardId: res.ProStandardId,
                          "productStatus": null,
                      };
                      that.Property.forEach((p,i) => {
                          console.log(p)
                          let s = i+1;
                          resdata['parentId'+s] = p.Id;
                          resdata['prop'+s] = res['StandardName'+s];
                      });
                      post.arrListProStandAttached.push(resdata);
                  }
              });
              // 自定义规格
              this.postData.listCustomizeStandard.forEach((res,index) => {
                  let resdata = {
                      rowIndex: res.Level,
                      parentId: res.ParameterId,
                      name: res.Name
                  };
                  post.arrListCustomizeStandards.push(resdata);
              });
              // 规格参数
              this.postData.listProStandardJoint.forEach((res,index) => {
                  let resdata = {
                      rowIndex: res.Level,
                      parentId: res.ParamterId,
                      id: res.StandardId,
                      name: res.Name
                  };
                  post.arrListProStandardJoint.push(resdata);
              });
              // 规格详情
              this.postData.listProParameter.forEach((res,index) => {
                  let resdata = {
                      Id: res.Id,
                      PName: res.PName,
                      PDName: res.PDName
                  };
                  post.arrListProParameter.push(resdata);
              });
              // 图片集合
              this.postData.listProductImg.forEach((res,index) => {
                let resdata = {
                    ImgName: res.ImgName,
                    ImgUrl: res.ImgUrl
                };
                post.arrListProductImg.push(resdata);
              });
              //判断如果是登录的区域批发商的身份则加加上字段
              if(this.userBlock){
                post.wholesalerType=2
              }else{
                post.wholesalerType=1
              }
              //区域批发商的保存编辑商品
              if (this.userBlock){
                 //判断如果是登录的区域批发商的身份则加加上字段
                axios.post(this.MS+'/Product/AndOrEditProductInfo',post).then(res => {
                  showToast(res.data.Msg);
                  if(res.data.Resultdata===true){
                    setTimeout(function(){
                      // that.$router.go(-1);
                      that.$router.push('/wholesale/goodsManagement');
                    },700);
                  }
                })
                //普通批发商的保存编辑商品
              }else{
                axios.post(this.MS + '/Product/AndOrEditProductInfo',post).then(res => {
                  showToast(res.data.Msg);
                  if(res.data.Code == 200){
                    setTimeout(function(){
                      // that.$router.go(-1);
                      that.$router.push('/wholesale/goodsManagement');
                    },500);
                  }
                });
              }
            }
        }
    }
}
</script>
<style scoped>
@import '../../assets/css/addNewGoods.css';
.mint-popup{  width:100%; }
</style>
