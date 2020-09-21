<template>
   <div class="global">
     <topnav :top='topnav'></topnav>
     <div class="telwrap">
       <div class="formwrap">
         <div class="codewrap">
             <div class="code">
                 <mt-field label='验证码：' placeholder="请输入验证码" type="text"  v-model="code" >
                   <div class="captTime capbtn" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
                   <div class="inoutcode" @click="getcode" v-else>获取验证码</div>
                 </mt-field>
             </div>
         </div>
         <div class="tel">
             <mt-field label='新手机号码：' placeholder="请输入新手机号" type="number" attr="{maxlength: 10}" v-model="phone" ></mt-field>
         </div>
       </div>
          <div class="btnwrap">
            <mt-button  class="btn" type="default">确定修改</mt-button>
          </div>
     </div>
   </div>
</template>

<script type="text/javascript">
import {phoneRuler, showToast} from '../../../assets/js/common.js'
export default {
   name: 'ChangeTel',
   data() {
       return {
         topnav:{
               title:'修改手机号码'
         },
         code:'',
         phone:'',
         captlist:60,
         captbtn:false
       }
   },
   mounted(){
     document.querySelector("body").setAttribute("style","background-color: #f5f5f5");
   },
   methods: {
     getcode(){
      let that = this;
      if (!that.phone) {
        showToast('手机号码不能为空');
      }else if (phoneRuler(that.phone) == false) {
        showToast('请输入正确的手机号码');
      }else{
        that.captbtn = true;
        // axios.get(this.URL + '/PersonalCenter/GetVerificationCode?mobile='+that.phone);
        var timer = setInterval(function(){
          that.captlist--;
          if(that.captlist == 0){
            that.captbtn = false;
            clearInterval(timer);
          };
        },1000);
      }
    },
   }
}
</script>

<style>
  .global .formwrap{
    margin-top: .3333rem /* 15/45 */;
  }
  .formwrap .tel{
    height: 2.2222rem /* 100/45 */;
    display: flex;
    align-items: center;
    border-bottom: .0222rem /* 1/45 */ solid #dddddd;
    overflow: hidden;
  }
  .formwrap .codewrap .code{
    height: 100%;
    border-bottom: .0222rem /* 1/45 */ solid #dddddd;
  }
  .formwrap .mint-cell{
    height: 100%;
    width: 100%;
  }
  .formwrap .inoutcode{
      width: 3.7778rem /* 170/45 */;
      color: #fff;
      background: #ff5558;
      font-size: .6222rem /* 28/45 */;
      border-radius: .1778rem /* 8/45 */ .1778rem /* 8/45 */;
      padding: .3333rem /* 15/45 */;
  }
  .global .telwrap .btnwrap{
    display: flex;
    justify-content: center
  }
  .global .telwrap .btn{
    width: 14.6667rem /* 660/45 */;
    height: 1.7778rem /* 80/45 */;
    font-size: .6667rem /* 30/45 */;
    background-color: #ff5558;
    border-radius: .2222rem /* 10/45 */;
    color: #fff ;
    margin-top: 2.4444rem /* 110/45 */;
  }

</style>
