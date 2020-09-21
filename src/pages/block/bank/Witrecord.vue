<template>
  <div class="warp">
    <mt-header title="提现记录" ref="header" :fixed="true">
      <mt-button icon="back" slot="left" @click="goBack"></mt-button>
    </mt-header>
    <div v-for="c in list" style="margin-top: 0.5rem;" class="main">
      <div class="mian-title">
        {{ c.month }}
        <i
          :class="c.isOpen?'el-icon-arrow-right':'el-icon-arrow-down'"
          @click="c.isOpen = !c.isOpen"
        ></i>
      </div>
      <div class="moneybox">
        <span>提现:￥{{ c.amountSum}}</span>
        <span>个税:￥{{ c.taxSum }}</span>
        <span>实际:￥{{ c.factAmountSum }}</span>
      </div>
      <div v-for="d in c.withdrawVOList" class="tijlxq" v-show="c.isOpen">
        <div class="left">
          <div>{{d.monthAndDay}}</div>
          <div>{{d.hourAndMinute}}</div>
        </div>
        <div class="right">
          <div class="title">
            <div class="a1">{{ d.bankName + ' (尾号' + d.cardNumber.substr(-4) + ')' }}</div>
            <div
              class="a2"
              style="color:#FFA800;"
            >{{ d.status==0?'申请中':d.status==1?'提现中':d.status==2?'已提现':d.status==3?'财务审核不通过':'出纳审核不通过' }}</div>
          </div>
          <div class="text">
            <span>提现￥{{ d.amount}}</span>
            <span>个税￥{{ d.totalTax }}</span>
            <p class="a5" style="color: #FF6023;"><span
                    v-show="d.status==0||d.status==1||d.status==2">+</span>{{d.factAmount }}</p>
          </div>
        </div>
      </div>
    </div>
      <img v-if="!list.length" class="noneData" src="../../../assets/images/img_zw.png" alt="">
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      seq: this.$store.state.userInfo.seq,
      userId: this.$store.state.userInfo.userId
    };
  },

  mounted() {
    this.$refs.header.$el.style.background =
      "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
    this.getInfo();
  },
  methods: {
    goBack() {
      try {
        window.action.app_back();
      } catch (err) {
        history.go(-1);
      }
    },
    //获取银行卡列表的信息
    getInfo() {
      axios({
        url: this.blockURL + "/qypfs-wallet/withdraw/getWithdrawList",
        method: "post",
        data: { seq: this.seq, userId: this.userId }
      }).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data;
          this.list = data;
        } else {
          Toast(res.data.message);
        }
      });
    }
  }
};
</script>
<style scoped>
.noneData{
    display: block;
    max-width: 80%;
    margin: 0 auto;
}
.warp {
  min-height: 100vh;
  background-color: #f2f2f2;
  overflow: hidden;
  margin-top: 2rem;
}

.mint-header {
  background-color: #f23030;
  color: #fff;
  height: 44px;
  font-size: 16px;
}
.main {
  background-color: #fff;
  font-size: 0.6rem;
  color: #666;
}
.mian-title {
  width: 100%;
  text-align: center;
  background: #ffe9c9;
  color: #ec0a48;
  font-size: 14px;
  line-height: 36px;
}

.moneybox {
  width: 100%;
  overflow: hidden;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.moneybox span {
  float: left;
  width: 33.333%;
  padding: 0.3em 0.6em;
  font-size: 12px;
  color: #666;
  line-height: 1.6em;
}
.tijlxq {
  width: 100%;
  display: flex;
  line-height: 1.2rem;
  padding: 0.3rem;
  border-bottom: 1px solid #f5f5f5;
  padding: 0 0.2rem;
}
.tijlxq .left {
  display: flex;
  max-width: 20%;
  min-width: 16%;
  border-right: 1px solid #f5f5f5;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tijlxq .right {
  flex: 1;
  padding: 0 0.2rem;
}
.tijlxq .right .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tijlxq .right .text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.55rem;
}
</style>
