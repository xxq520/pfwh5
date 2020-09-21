<template>
  <div class="glode">
    <topnav :top="topnav"></topnav>
    <div class="success">
      <div class="succ-img"><img src="../../assets/images/chenggong.png"></div>
      <div class="succ-text">下单成功</div>
    </div>
  </div>
</template>

<script>
import {getCookie} from '@/assets/js/common.js'
export default {
  data() {
      return {
        topnav:{
          title:'下单成功',
          url:'/myorder'
        }
      }
  },
  mounted(){
    let seq = getCookie('seq');
    let userType = getCookie('userType');
    if (seq) {
      sessionStorage.setItem('seq',seq)
    }
    if(userType){
      sessionStorage.setItem('userType',userType);
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.glode{
  overflow:hidden;
  height:100vh;
}
.success{
  overflow:hidden;
  text-align: center;
  padding-top:2rem;
}
.succ-img{
  overflow:hidden;
  display:inline-block;
  width:3.5rem;
}
.succ-text{
  font-size:1rem;
  color:#66d321;
}
</style>
