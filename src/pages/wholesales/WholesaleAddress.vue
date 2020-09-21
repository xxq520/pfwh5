<template>
  <div class="globaleditaddr">
    <topnav :top='topnav'></topnav>
    <div class="wrap2">
      <div class="citywrap">
        <p class="addressText">
          <span class="title">店铺名称：</span>
          <input type="text" v-model="storeName">
        </p>
      </div>
      <div class="citywrap">
        <p class="addressText">
          <span class="title">店铺电话：</span>
          <input type="text" v-model="storeMobile" placeholder="请输入店铺电话" maxlength="11">
        </p>
      </div>
      <div class="citywrap" @click="showcities">
        <p class="addressText">
          <span class="title">城市分区：</span>
          <input type="text" readonly v-model="cities" placeholder="请输入城市分区信息">
        </p>
      </div>
      <div class="addressDetail">
        <p class="addressText">
          <span class="title">详细地址：</span>
          <input type="text" v-model="address" placeholder="请输入详细地址">
        </p>
      </div>
    </div>
    <div class="btneditaddr">
      <mt-button  class="btn" type="default" @click="saveEdit">保存</mt-button>
    </div>
      <!-- 城市弹出框 -->
        <div class="addrpop">
          <mt-popup  id="showaddress" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <div class="btntop">
              <span @click="cancelbtn">取消</span>
              <span @click="surebtn">确定</span>
            </div>
            <div class="content">
              <div class="city">
                <span>选择所在省份：</span>
                <div class="cityselect">
                  <!-- element级联选择 -->
                  <el-select v-model="sheng" placeholder="请选择所在省" @change="choseCity">
                    <el-option
                      v-for="item in province"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option >
                  </el-select>
                </div>
              </div>
              <div class="area" >
                <span>选择所在市区：</span>
                <div class="areaselect">
                  <!-- element级联选择 -->
                  <el-select v-model="shi" placeholder="请选择所在市" @change="choseBlock">
                    <el-option
                      v-for="item in city"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="area" >
                <span>选择所在区县：</span>
                <div class="areaselect">
                  <!-- element级联选择 -->
                  <el-select v-model="qu" placeholder="请选择所在区" @change="choseArea">
                    <el-option
                      v-for="item in block"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="area" >
                <span>选择所在街道：</span>
                <div class="areaselect">
                  <!-- element级联选择 -->
                  <el-select v-model="jie" placeholder="请选择所在街道" @change="choseStreet">
                    <el-option
                      v-for="item in street"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
        </mt-popup>
        </div>
   </div>
</template>

<script type="text/javascript">
import s from '../../assets/js/ProvinceCityAreaList.json'
import { showToast } from '../../assets/js/common';
import { phoneRuler } from '../../assets/js/common';
export default {
   name: 'wholesaleAddress',
   data() {
      return {
         topnav:{
            title:'用户信息'
        },
        WholesaleSEQ:sessionStorage.getItem('seq'),
        storeName:'',
        storeMobile:'',
        cities:'',
        address:'',
        parentId:1,
        cityId:'',
        areaId:'',
        streetId:'',
        provinceId:'',
        popupVisible:false,//城市弹窗隐藏
        mapJson:s,//省市数据json文件
        sheng: '',//省级双向绑定数据
        shi: '',//市级选择双向数据绑定
        qu: '',//区级选择双向数据绑定
        jie: '',//街道选择双向数据绑定
        province:[],//省返回数组
        city:[],//市区返回数据数组
        block:[],//区返回数据数组
        street:[],//街道返回数据数组
      }
   },
   created(){
     let StoreName = sessionStorage.getItem('StoreName');
     if(StoreName){
       this.storeName = StoreName;
     }
     let mobile = sessionStorage.getItem('shopMobile');
     if(mobile){
       this.storeMobile = mobile;
     }
     let data = JSON.parse(sessionStorage.getItem('addressData'));
     this.cities = sessionStorage.getItem('area');
     this.address = sessionStorage.getItem('address');
     this.sheng = data.province;
     this.shi = data.city;
     this.qu = data.area;
     this.jie = data.street;
     this.storeMobile = data.mobile;
   },
   mounted(){
     document.querySelector("body").setAttribute("style","background-color: #f5f5f5");
   },
   methods: {
    //获取所有地区数据
    getWholeAddress(){
      let self = this;
      axios.get(this.URL + '/WholesaleManage/GetArea',{params:{parentId:this.provinceId}})
      .then((res)=>{
        if(res.data.success == "True"){
          if(this.provinceId!=''){
            let arr = res.data.data;
            if(self.city.length != 0){
              self.city = [];
            }
            arr.map(function(item){
              self.city.push({id:item.id,value:item.name});
              if(self.shi == item.name && item.type=='3'){
                // self.cityId = item.id;
                self.getArea(item.id);
              }
            })    
          }
        }
      })
    },
    getArea(id){
      console.log(id);
      var self = this;
      axios.get(this.URL + '/WholesaleManage/GetArea',{params:{parentId:id}})
      .then((res)=>{
        if(res.data.success == "True"){
          if(self.block.length != 0){
              self.block = [];
          }
          res.data.data.map(function(item){
            if(self.qu == item.name){
            // self.areaId = item.id;
              self.getStreet(item.id);
            }
            self.block.push({id:item.id,value:item.name});
          })
        }
      })
    },
    getStreet(id){
      var self = this;
      axios.get(this.URL + '/WholesaleManage/GetArea',{params:{parentId:id}})
      .then((res)=>{
        if(res.data.success == "True"){
          if(self.street.length != 0){
              self.street = [];
          }
          res.data.data.map(function(item){
            // if(self.jie == item.name){
            // self.streetId = item.id;}
            self.street.push({id:item.id,value:item.name});
          })
        }
      })
    },
     //获取全部城市json数据
    getCityData(parentId,areaData){
      var self = this;
        axios.get(this.URL+'/WholesaleManage/GetArea',{params:{
            parentId:parentId
        }}).then(res=>{
            if(res.data.success == "True"){
                let data = res.data.data;
                if(areaData.length != 0){
                    areaData = [];
                }
                for (var i = 0;i<data.length;i++) {
                    var item = data[i];
                    if(self.sheng == item.name && item.type=='2'){
                      self.provinceId  = item.id;
                      self.parentId = item.id;
                      self.getWholeAddress();
                    }
                    areaData.push({id:item.id,value:item.name});
                }
            }else{
                showToast('网络开小差啦','middle')
            }
        })
    },
      //选中省份fn
     choseCity(pid){
        // console.log('$$$$====',pid);
        let obj = {};
        obj=this.province.find((item)=>{
            return item.id == pid
        })
        this.sheng = obj.value;
        this.parentId = obj.id;
        this.provinceId = obj.id;
        // console.log(this.provinceId);
        this.city = [];
        this.block =[];
        this.street = [];
        this.getCityData(this.parentId,this.city);
        this.shi = '';
        this.qu = '';
        this.jie = '';
     },
     //选中市fn
     choseBlock(cid){
        // this.city = [];
        let obj = {};
        obj=this.city.find((item)=>{
            return item.id == cid
        })
        this.shi = obj.value;
        this.parentId = obj.id;
        this.cityId = obj.id;
        console.log(this.cityId);
        this.block =[];
        this.street = [];
        this.getCityData(this.parentId,this.block);
        this.qu = '';
        this.jie = '';
      },
     //选中区县fn
     choseArea(bid){
        // this.block = [];
        let obj = {};
        obj=this.block.find((item)=>{
            return item.id == bid
        })
        this.qu = obj.value;
        this.parentId = obj.id;
        this.areaId = obj.id;
        console.log(this.areaId);
        this.street = [];
        this.getCityData(this.parentId,this.street);
        this.jie = '';
     },
     //选中街道fn
     choseStreet(sid){
        // this.street = [];
        let obj = {};
        obj=this.street.find((item)=>{
            return item.id == sid
        })
        this.jie = obj.value;
        this.streetId = obj.id;
     },
     //城市选择弹窗
     showcities(){
       this.popupVisible =true;
       this.getCityData(this.parentId,this.province);
     },
    //弹窗选择取消操作
    cancelbtn(){
      this.popupVisible =false;
    },
    surebtn(){
        if(this.sheng==''||this.shi==''||this.qu==''||this.jie==''){
            showToast('请完成信息！');
            return ;
        }
        this.cities = this.sheng +' '+this.shi+' '+this.qu+' '+this.jie;
        this.popupVisible =false;
    },
    saveEdit(){
        var that = this;
        if(that.cities == ''){
            showToast('请选择城市分区');
        }else if(that.address == ''){
            showToast('请输入详细地址');
        }else{
            axios.get(this.URL + '/WholesaleManage/UPWholesalerInfoDetail',{params:{
                WholesaleSEQ:that.WholesaleSEQ,
                proince:that.sheng,
                city:that.shi,
                area:that.qu,
                street:that.jie,
                address:that.address,
                storeMobile:that.storeMobile,
                store_name:that.storeName,
                // provinceId:this.provinceId,
                // cityId:this.cityId,
                // areaId:this.areaId,
                // streetId:this.streetId
            }})
            .then((res)=>{
                if(res.data.code){
                    showToast('修改成功');
                    this.$router.push('/wholesale/storeManagement');
                }else{
                    showToast('修改失败');
                }
            })
        }
    }
  }
}
</script>

<style scoped>
.addressText{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0.4444rem 0.4444rem;
    font-size: 0.6667rem;
    border-bottom:1px solid #f3f3f3;
}
.addressText input{
    flex: 1;
    font-size: 0.6667rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    padding-left: 1.1111rem;
}
    .mint-cell:last-child{
        background-position: initial;
    }
  .globaleditaddr .wrap2{
    margin-top: .3333rem /* 15/45 */;
    padding-left:.5rem;
    padding-right:.5rem;
    background: #fff;
    position: relative;
  }
  .globaleditaddr .wrap2 .el-icon-location{
    color: #ea2424;
    position: absolute;
    left: 3.4rem;
    font-size: .8889rem /* 40/45 */;
  }
  .globaleditaddr .wrap2 .mint-cell-value.is-link{
    width: 70%;
    margin-right: 0px;
  }
  .globaleditaddr .wrap2 .mint-cell-value.is-link span{
    font-size: .7111rem /* 32/45 */;
    color: #212121;
  }
  .globaleditaddr .wrap2 .mint-cell-wrapper{
    padding: 0;
  }
  .globaleditaddr .wrap2 .mint-cell-title{
    font-size: .7111rem /* 32/45 */;
    color: #212121;
  }
  .globaleditaddr .wrap2 .mint-field .mint-cell-title{
    width: 3.5556rem /* 160/45 */;
  }
  .globaleditaddr .btneditaddr .btn {
    width: 100%;
    height: 1.7778rem /* 80/45 */;
    font-size: .7111rem /* 32/45 */;
    background-color: #ff5558;
    color: #fff ;
    position: fixed;
    bottom: 0;
  }
  /* 地址选择弹窗 */
  .globaleditaddr .mint-popup-bottom{
    width: 100%;
  }
  .globaleditaddr .addrpop .btntop{
    background: #e6e6e6;
    display: flex;
    justify-content: space-between;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    padding: 0 .5rem;
  }
  .globaleditaddr .addrpop .btntop span{
    display: block;
    font-size: .7111rem /* 32/45 */;
    color: #4c4c4c;
  }
  .globaleditaddr .addrpop .btntop span:nth-child(2){
    color: #2696ff;
  }
  .globaleditaddr .addrpop .content{
    font-size: .7111rem /* 32/45 */;
    color: #212121;
    padding-left: .5rem;
    margin: 2.2222rem /* 100/45 */ 0;
  }
  .globaleditaddr .addrpop .content .city{
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 1.5556rem /* 70/45 */;
    height: 1.5556rem /* 70/45 */;
    line-height: 1.5556rem /* 70/45 */;
  }
  .globaleditaddr .addrpop .content .area{
    margin-bottom: 1.5556rem /* 70/45 */;
  }
  .globaleditaddr .addrpop .content .el-select {
    z-index: 99999;
  }
  .globaleditaddr .addrpop .content .area{
    display: flex;
    flex-wrap: nowrap;
    height: 1.5556rem /* 70/45 */;
    line-height: 1.5556rem /* 70/45 */;
  }
  .mint-field-core{
    margin-right: 24px;
    text-align: right
  }
</style>
<style>
.mint-toast {
    z-index: 5000 !important;
}
.el-select-dropdown{
  z-index: 1000000 !important;
}
</style>
