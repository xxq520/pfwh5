<template>
   <div class="global">
     <topnav :top='topnav'></topnav>
     <div class="wrap">
       <mt-field placeholder='请输入新名字' v-model="username" ></mt-field>
     </div>
     <div class="btnwrapenedit">
        <mt-button  class="btn" type="default" @click="sendnewname">提交</mt-button>
      </div>
   </div>
</template>

<script type="text/javascript">
import { showToast } from '@/assets/js/common.js';
export default {
   name: 'ChangeName',
   data() {
       return {
         topnav:{
               title:'更改名字'
        },
        username:'',
        seq:''
       }
   },

   created(){
      // Indicator.open();
     this.seq = sessionStorage.getItem('seq');
   },
   methods: {
     sendnewname(){
       if (!this.username) {
         showToast('名字不能为空');
         return;
       }
       if(this.username.length >10){
         showToast("请输入10个字符以内的名字");
         return;
       }

       let params = {seq:this.seq,name:this.username};
       axios.post(this.URL + "/User/ModifyUserInfo",params)
       .then((res) => {
        //  Indicator.close();
         if(res.data){
           showToast("更改成功");
           setTimeout(()=>{
             this.$router.push('/mineindex');
           },2000)
         }else{
           showToast("更改失败");
         }
       })
     }
   }
}
</script>

<style>
  .global:after{
    display:block;
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:#f5f5f5;
    z-index:-1;
  }
  .global .wrap{
    margin-top: .3333rem /* 15/45 */;
  }
  .global .btnwrapenedit .btn {
    width: 100%;
    height: 1.7778rem /* 80/45 */;
    font-size: .7111rem /* 32/45 */;
    background-color: #ff5558;
    color: #fff ;
    position: fixed;
    bottom: 0;
  }
</style>
