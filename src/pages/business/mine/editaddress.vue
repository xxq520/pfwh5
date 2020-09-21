<template>
   <div class="globaleditaddr">
     <topnav :top='topnav'></topnav>
     <div class="wrap2">
       <div class="citywrap" @click="showcities">
          <mt-cell  title="城市分区：" is-link v-model="cities" placeholder="请输入城市分区信息">
            <div class="el-icon-location" slot='icon'></div>
          </mt-cell>
       </div>
       <mt-field label='详细地址：' placeholder="请输入详细地址" v-model="address"></mt-field>
       <mt-field label='收货人：' placeholder="请输入收货人" v-model="name"></mt-field>
       <mt-field label="电话：" placeholder="请输入电话号码" type="tel" :attr="{ maxlength:11}" v-model="phone"></mt-field>
       <!-- <mt-field label="身份证：" placeholder="请输入身份证号码" v-model="idcard"></mt-field> -->
     </div>
     <div class="btneditaddr">
        <mt-button  class="btn" type="default" @click="uploadNewAddr">保存</mt-button>
     </div>
      <!-- 城市弹出框 -->
        <div class="addrpop">
          <mt-popup  id="showaddress" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <div class="btntop">
              <span @click="cancelbtn">取消</span>
              <span @click="surebtn">确定</span>
            </div>
            <div class="content">
              <div class="city" style="z-index:999999">
                <span>选择所在省份：</span>
                <div class="cityselect">
                  <!-- element级联选择 -->
                  <el-select v-model="sheng" placeholder="请选择所在省" @change="choseCity"  >
                    <el-option
                      v-for="item in province"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="area" style="z-index:999999">
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
              <div class="area"  style="z-index:999999">
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
            </div>
        </mt-popup>
        </div>
   </div>
</template>

<script type="text/javascript">
import { showToast } from '../../../assets/js/common'
import { phoneRuler } from '../../../assets/js/common'
import s from '../../../assets/js/ProvinceCityAreaList.json'
export default {
   name: 'editaddress',
   data() {
      return {
         topnav:{
            title:'编辑地址'
        },
        name:'',
        phone:'',
        telPhone:'0',
        idcard:'',
        id:1,//id=1表示新增一条地址数据
        address:'',
        parentId:1,
        provinceId:'',
        cities:'',
        zipCode:'0',//邮编
        addTime:'00',
        popupVisible:false,//城市弹窗隐藏
        mapJson:s,//省市数据json文件
        sheng: '',//区级双向绑定数据
        shi: '',//市级选择双向数据绑定
        qu: '',//县级选择双向数据绑定
        province:[],//省返回数组
        city:[],//市区返回数据数组
        block:[],//区返回数据数组
        area:[],//区县返回数据数组
        erjidata:[],//三级数据所需二级数据暂存
        numReg:/^1[34578]\d{9}$/
      }
   },
   created:function(){},
   mounted(){
     this.name = this.$route.query.name
     this.address = this.$route.query.address
     this.phone = this.$route.query.phone
     this.cities = this.$route.query.Province + this.$route.query.City + this.$route.query.Area
     this.sheng = this.$route.query.Province;
     this.shi = this.$route.query.City;
     this.qu = this.$route.query.Area;
     this.id = this.$route.query.id;
     let shengId ='',shiId='',quId='';
     
     document.querySelector("body").setAttribute("style","background-color: #f5f5f5");
   },
   methods: {

     //获取所有地区数据
    getWholeAddress(){
      let self = this;
      if(this.provinceId!=''){
        axios.get(this.URL + '/WholesaleManage/GetArea',{params:{parentId:this.provinceId}})
        .then((res)=>{
          if(res.data.success == "True"){
              self.city = [];
              res.data.data.map(function(item){
                self.city.push({id:item.id,value:item.name});
                if(self.shi == item.name && item.type=='3'){
                  self.getArea(item.id);
                }
            })
          }
        })
      }
    },
    getArea(id){
      var self = this;
      axios.get(this.URL + '/WholesaleManage/GetArea',{params:{parentId:id}})
      .then((res)=>{
        if(res.data.success == "True"){
          self.block = [];
          res.data.data.map(function(item){
            self.block.push({id:item.id,value:item.name});
          })
        }
      })
    },
     //编辑地址
     uploadNewAddr(){
      var input  = /^[\s]*$/;
       if (input.test(this.cities)) {
        showToast('城市分区不能为空','middle')
      }else if (this.address== "") {
        showToast('详细地址不能为空','middle')
      }else if (this.name== "") {
        showToast('收货人不能为空','middle')
      }else if (!phoneRuler(this.phone) || this.phone == '') {
        showToast('请输入正确的手机号码','middle')
      }else{
        let amodel = {
        id:this.id,
        seq: sessionStorage.seq,
        name: this.name,
        address: this.address,
        zipCode: this.zipCode,
        phone: this.phone,
        province:this.sheng == '' ? this.province = this.$route.query.Province:this.sheng,
        city:this.shi == '' ? this.City = this.$route.query.City:this.shi,
        area: this.qu == '' ? this.Area = this.$route.query.Area:this.qu,
        isDefault: false
      }
      axios.post(this.URL + '/User/UserAddress',amodel).then(res=>{
         if (res.status == 200) {
           showToast('修改成功','middle')
          this.$router.go(-1)
         }else{
           setTimeout(() => {
             showToast('网络开小差啦','middle')
           }, 2000);
         }
      })
      }
     },
    //  验证手机号码正则
    checkPhoneType(text){
      let reg = this.numReg;
      if(!reg.test(text)){
        return '';
      }
    },
    //获取全部城市json数据
     getCityData(parentId,areaData){
       let self = this;
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
                    if(this.sheng == data[i].name && item.type=='2'){
                      this.provinceId  = data[i].id;
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
     choseCity(vid){
      let obj = {}
      obj = this.province.find((item)=>{
        return item.id == vid
      })
      this.sheng = obj.value;
        this.parentId = obj.id;
        this.city = [];
        this.block =[];
        this.street = [];
        this.getCityData(this.parentId,this.city);
        this.shi = '';
        this.qu = '';
     },
     //选中区域fn
     choseBlock(bid){
      let obj2 = {}
      obj2 = this.city.find((item)=>{
        return item.id == bid
      })
      this.shi = obj2.value;
        this.parentId = obj2.id;
        this.block =[];
        this.street = [];
        this.getCityData(this.parentId,this.block);
        this.qu = '';
      },
     //选中区县fn
     choseArea(cid){
       let obj3 = {}
      obj3 = this.block.find((item)=>{
        return item.id == cid
      })
      this.qu = obj3.value;
        this.parentId = obj3.id;
        this.street = [];
        this.getCityData(this.parentId,this.street);
     },
     //城市选择弹窗
     showcities(){
       this.popupVisible =true;
       this.getCityData(this.parentId,this.province);//获取地址data
       
     },
    //弹窗选择取消操作
    cancelbtn(){
      this.popupVisible =false;
    },
    //地址弹窗确定操作
    surebtn(){
      // if(this.sheng==''||this.shi==''||this.qu==''){
      if(this.sheng==''){
        showToast('请输入所在省份！','middle');
        return ;
      }else if (this.shi=='') {
        showToast('请输入所在市区！','middle');
        return ;
      }else if (this.qu=='') {
        showToast('请输入所在区县！','middle');
        return ;
      }
      this.cities = this.sheng+this.shi+this.qu
      this.popupVisible =false;
    }
  }
}
</script>

<style>
.el-select-dropdown{
  z-index: 1000000 !important;
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
  .globaleditaddr .wrap2 .mint-field ,.globaleditaddr .mint-cell{
    border-bottom: 1px solid #e9e9e9;
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
</style>
