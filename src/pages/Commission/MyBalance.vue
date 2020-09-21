<template>
    <div class="my-balance">
      <mt-header title="我的余额" class="mt-header">
          <router-link :to="{ path: '/wholesale/commission'}" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
      <div class="main">
          <div class="balance-con">
              <div class="img-bg"></div>
              <p class="balance-text">我的余额</p>
              <p class="balance-value">¥{{Balance.toFixed(2)}}</p>
          </div>
          <div class="btn-con">
              <button type="button" name="button" class="btn1" @click="toCashWithdrawal">提现</button>
              <button type="button" name="button" class="btn2" @click="toTransferredBalance">转余额</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            Balance:0,//余额
            AccountId:0//用户id
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        // 获取数据
        getData(){
            axios.get(this.URL + "/Earnings/GetUserAccountInfo",{params:{userSeq:sessionStorage.getItem("seq")}})
            .then(res => {
                if(res.data.code == 200){
                    this.Balance = res.data.data.Balance;
                    this.AccountId = res.data.data.AccountId;
                }
            })
            .catch(err => {

            })
        },
        // 页面跳转
        // 提现
        toCashWithdrawal(){
            this.$router.push({path:"/wholesale/cashWithdrawal"});
        },
        // 转余额
        toTransferredBalance(){
            this.$router.push({path:"/wholesale/transferBalance"});
        }

    }
}
</script>


<style>
    .my-balance .main{
        height:calc(100vh - 44px);
        background-color:#fff;
    }
    .my-balance .balance-con{
        padding-top:2.8889rem;
        margin-bottom:2.6222rem;
    }
    .my-balance .img-bg{
        height:3.4444rem;
        width:3.4444rem;
        margin:0 auto .8889rem;
        background:url("../../assets/images/myBalance-icon.png") no-repeat center;
        background-size:cover;
    }
    .my-balance .balance-con p{
        text-align:center;
    }
    .my-balance .balance-text{
        font-size:.6667rem;
        color:#666;
        margin-bottom:.8889rem;
    }
    .my-balance .balance-value{
        font-size:1.0667rem;
        color:#ff6f24;
    }
    .my-balance .btn-con button{
        display:block;
        width:14.4444rem;
        height:1.7333rem;
        font-size:.6667rem;
        border:.0444rem solid transparent;
        border-radius:1.7333rem;
        margin:0 auto;
        background-color:#fff;
    }
    .my-balance .btn-con .btn1{
        color:#ff6f24;
        border-color:#ff6f24;
        margin-bottom:.4444rem;
    }
    .my-balance .btn-con .btn2{
        color:#fff;
        background-color:#ff6f24;
        border-color:#ff6f24;
    }
</style>
