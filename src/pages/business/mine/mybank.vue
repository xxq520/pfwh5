<template>
  <div class="glode">
    <mt-header title="我的银行卡">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
      <mt-button slot="right" @click="addbank"><i class="el-icon-plus" style="font-size:18px;"></i></mt-button>
    </mt-header>
    <div class="bankcart">
      <!---->
      <div class="banklist" v-for="(item,index) in bank" @click="unbund(item)" :key="index">
        <div class="bankbox">
          <div class="logo"><img :src="item.banklogourl"></div>
          <div class="text">
            <div class="bankname">{{ item.bank_name }}</div>
            <div class="card">{{ item.bank_type }}</div>
            <div class="numbers">
              <span>****</span>
              <span>****</span>
              <span>****</span>
              <span>{{ item.bank_card.substr(-4) }}</span>
            </div>
          </div>
        </div>
        <img :src="item.bankiconurl">
      </div>
      <!---->
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="popupbox">
        <div class="removebut">
          <p>确定要解绑{{ bankname }}尾号为{{ banklast }}的银行卡吗？</p>
          <span @click="removebank">确定解绑</span>
        </div>
        <div class="closebut" @click="closefn">取消</div>
      </div>
    </mt-popup>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      bank:[],
      popupVisible:false,
      bankseq:'',
      banknum:'',
      banklast:'',
      bankname:''
    }
  },
  mounted(){
    this.datapost();
  },
  methods: {
    back(){
      this.$router.go(-1);
    },
    addbank(){
      this.$router.push('/bankCard');
    },
    unbund(obj){
      this.popupVisible = true;
      this.bankseq = obj.seq;
      this.banknum = obj.bank_card;
      this.banklast = obj.bank_card.substr(-4);
      this.bankname = obj.bank_name;
    },
    removebank(){
      // api/PersonalCenter/UntiedBank;
      // 必传参数：seq：用户seq；bankCard：银行卡号
      let post = {
        seq: this.bankseq,
        bankCard: this.banknum
      };
      axios.post(this.URL + '/PersonalCenter/UntiedBank',post).then(res => {
        this.popupVisible = false;
        if(res.data == false){
          Toast('系统错误，解绑失败！');
          return false;
        };
        Toast('尾号为'+this.banklast +'的'+this.bankname+'银行卡解绑成功！');
        this.datapost();
      });
    },
    closefn(){
      this.popupVisible = false;
    },
    datapost(){
      axios.get(this.URL + '/PersonalCenter/GetBankInfoList?seq='+sessionStorage.seq+'&bankCard=').then(res => {
        this.bank = res.data;
      });
    }
  }
}
</script>

<style scoped>
.glode{
  min-height:100vh;
}
.bankcart{
  overflow:hidden;
  padding:0 10px;
  margin-top:0.5rem;
}
.banklist{
  overflow:hidden;
  margin-bottom:0.3rem;
  position:relative;
}
.banklist .bankbox{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  padding:1rem 1rem;
}
.banklist .bankbox .logo{
  float:left;
  width:2rem;
  height:2rem;
  padding:0.15rem;
  background:white;
  border-radius:50%;
}
.banklist .bankbox .logo img{
  vertical-align: middle;
}
.banklist .bankbox .text{
  float:right;
  width:calc(100% - 2.8rem);
  color:white;
  font-size:0.65rem;
}
.banklist .bankbox .text .bankname{
  overflow:hidden;
  font-size:0.7rem;
  line-height:1.2em;
}
.banklist .bankbox .text .card{
  overflow:hidden;
  font-size:0.6rem;
  padding:0.3rem 0;
  line-height:1.2em;
}
.banklist .bankbox .text .numbers{
  overflow:hidden;
  line-height:1.2em;
}
.banklist .bankbox .text .numbers span{
  float:left;
  padding-right:1rem;
}
.banklist .bankbox .text .numbers span:last-child{
  padding-right:0;
}

/**/
.glode >>> .mint-popup-bottom{
  width:100%;
  text-align: center;
}
.popupbox{
  overflow:hidden;
  background:#f5f5f5;
  font-size:0.7rem;
}
.popupbox .closebut{
  overflow:hidden;
  color:#212121;
  padding:0.6rem 0;
  line-height:1.2em;
  background:white;
}
.popupbox .removebut{
  overflow:hidden;
  margin-bottom:0.3rem;
}
.popupbox .removebut{
  overflow:hidden;
  margin-bottom:0.3rem;
  background:white;
}
.popupbox .removebut p{
  color:#999;
  font-size:0.6rem;
  line-height:2.5em;
  border-bottom:1px solid #f5f5f5;
}
.popupbox .removebut span{
  display:block;
  padding:0.6rem 0;
  line-height:1.2em;
  color:#db0020;
}
</style>
