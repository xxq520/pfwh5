<template>
   <div class="global myaddress">
     <topnav :top='topnav'></topnav>
     <div class="addresswrap">
        <div class="addresslist" v-for=" (item,index) in addrList" :key="index">
            <div class="contentwrap" @click="getAddress(item)">
              <div class="detail">{{item.Province+item.City+item.Area+item.Address}}</div>
              <div class="ptel">{{item.Name}} <span>{{item.Phone}}</span></div>
            </div>
            <div class="bottomwrap">
                 <label @click="showDefault(index)">
                    <input type="radio" name="defalt" id='' class="a-radio">
                    <span class="b-radio" :class="{moren:item.IsDefault}"></span>默认地址
                </label>
                <div class="iconwrap">
                  <span class="editwrap el-icon-edit-outline" @click="pusheditaddr(index)">编辑</span>
                  <span class="editwrap el-icon-delete" @click="deletaddr(index)">删除</span>
                </div>
            </div>
        </div>
        <p class="noData" v-if="addrList.length == 0">~暂无收货地址~</p>
     </div>
     <bottomnav v-if="userType!=2&&userType!=7" :bottom="bottomnav"></bottomnav>
   </div>
</template>

<script type="text/javascript">
import { MessageBox } from 'mint-ui';
import {showToast} from '../../../assets/js/common.js'
export default {
  name: 'myaddress',
  data() {
      return {
        topnav:{
            title:'收货地址',
            addnewaddress:'addnewaddress',
        },
        bottomnav:{
          index:'个人中心'
        },
        addrList:[],
        seq:sessionStorage.seq,
        id:[],
        userType:''
      }
  },
  created(){
    let userType = sessionStorage.getItem('userType');
    if(userType){
      this.userType = userType;
    }
    console.log(userType);
  },
  mounted(){
    //获取地址列表
    this.getAddressList()
    //动态设置背景颜色
    document.querySelector("body").setAttribute("style","background-color:#f5f5f5");
  },
  methods: {
    // 设为默认地址弹窗
    showDefault(index){
      MessageBox({
        message: '是否设为默认地址?',
        title:'',
        confirmButtonText:'确认设置',
        cancelButtonText:'返回上级',
        confirmButtonClass: 'sureaddress',
        cancelButtonClass:'canceladdress',
        showCancelButton: true
        }).then(action => {
        if (action == 'confirm') {
          let ID = this.id[index]
          axios.post(this.URL + '/User/UserAddress',{seq:this.seq,ID:ID,IsDefault:true}).then(res=>{
            if (res.status == 200) {
              this.getAddressList();
            }
          })
        }
        // this.$router.go(-1);
      })
    },
    //获取地址列表
    getAddressList(){
      axios.post(this.URL + '/User/UserAddress',{seq:this.seq}).then(res=>{
        if (res.status == 200) {
          this.addrList = res.data.Resultdata;
          for (const key in this.addrList) {
            this.id.push( this.addrList[key].ID);
          }
          // console.log('收货地址列表',this.addrList)
        }else{
          showToast('网络错误，请重试','middle')
        }
      })
    },
    //点击删除提示弹窗
    deletaddr(index){
      MessageBox({
        message: '是否删除地址',
        title:'',
        confirmButtonText:'确认删除',
        cancelButtonText:'返回上级',
        confirmButtonClass: 'sureaddress',
        cancelButtonClass:'canceladdress',
        showCancelButton: true
        }).then(action => {
        if (action == 'confirm') {
          let ID = this.id[index]
          axios.post(this.URL + '/User/UserAddress',{seq:this.seq,ID:ID,IsDelete:true}).then(res=>{
            if (res.status == 200) {
              showToast('删除成功','middle')
              window.location.reload()
              // setTimeout(() => {
              //   this.getAddressList();
              // }, 1000);
            }
          })
        }
      })
    },
    //跳转到编辑地址页面
    pusheditaddr(index){
      let ID = this.id[index];
      let chooosen = []
    for (const key in this.addrList) {
      if (this.addrList[key].ID == ID) {
        chooosen = this.addrList[key];
      }
    }
    let params = {
      id:ID,
      name:chooosen.Name,
      address:chooosen.Address,
      phone:chooosen.Phone,
      Province:chooosen.Province,
      City:chooosen.City,
      Area:chooosen.Area,
    }
      this.$router.push({path:'./editaddress',query:params})
    },
    getAddress(val){
      if(this.$route.query.tolink == 'confirmoder'){
        sessionStorage.setItem('setAddress',JSON.stringify(val));
        this.$router.go(-1);
      };
    }
  }
}
</script>

<style scoped>
.noData{
  overflow:hidden;
  padding:1rem;
  text-align: center;
  font-size:0.8rem;
  font-weight:bold;
  color:#ccc;
}
  /* 信息提示弹窗样式重置 */
  /* 去除弹框提示 */
  .sureaddress{
    color: #ff4a4a;
  }
  .canceladdress{
    height: 20px;
    line-height: 20px;
    margin-top: 9px;
  }
  .addresswrap .addresslist{
    margin-top: .4444rem /* 20/45 */;
    background: #fff;
    color: #212121;
    padding: .4444rem /* 20/45 */;
  }
  .addresswrap .addresslist .contentwrap{
    padding-bottom: .6667rem /* 30/45 */;
    border-bottom: .0222rem /* 1/45 */ solid #e6e6e6;
  }
  .addresswrap .addresslist .detail{
    font-size: .7111rem /* 32/45 */;
  }
  .addresswrap .addresslist .ptel{
    margin-top: .4444rem /* 20/45 */;
    font-size: .6222rem /* 28/45 */;
  }
  .addresswrap .addresslist .bottomwrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* 单选框样式重置 */
  .addresswrap .addresslist .bottomwrap label{
    font-size: .6222rem /* 28/45 */;
    color: #666666;
    display: flex;
    align-items: center;
  }

  .addresswrap .addresslist .bottomwrap .mint-cell-wrapper{
    padding-left: 0px;
  }
  .addresswrap .addresslist .bottomwrap .inputwrap{
    display: block
  }
  .addresswrap .addresslist .bottomwrap .a-radio{
      display: none;
  }
  .addresswrap .addresslist .bottomwrap .b-radio{
      display: inline-block;
      border:1px solid #ccc;
      width:.6667rem /* 30/45 */;
      height: .6667rem /* 30/45 */;
      border-radius:50%;
      vertical-align: middle;
      margin-right: .5556rem /* 25/45 */;
      position: relative;
  }
  .addresswrap .addresslist .bottomwrap .moren:before{
      content: '';
      font-size: 0;
      width: .4444rem /* 20/45 */;
      height: .4444rem /* 20/45 */;
      background: #e43a3d;
      position: absolute;
      left:50%;
      top:50%;
      margin-left: -.2222rem /* 10/45 */;
      margin-top: -.2222rem /* 10/45 */;
      border-radius: 50%;
  }
/*.addresswrap .addresslist .bottomwrap .a-radio:checked~.b-radio:before{
      display: block;
  }*/
  .addresswrap .addresslist .bottomwrap .editwrap{
    font-size: .5333rem /* 24/45 */;
    color: #4c4c4c;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
  }
</style>
<style scoped>
.global{
  padding-bottom:60px;
}
</style>
