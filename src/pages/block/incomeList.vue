<template>
  <div class="warp">
    <mt-header title="批发网收益" ref="header" :fixed="true">
      <mt-button icon="back" slot="left" @click="goBack"></mt-button>
    </mt-header>

    <template v-if="!noneData">
      <div v-for="(c, index) in monthStr" style="margin-top: 0.5rem;" v-if="list[c.key + 'OrderNum']" class="main" :key="index">
        <div class="mian-title">
          {{ `2020年${c.month}月` }}
          <i
            :class="c.isOpen?'el-icon-arrow-up':'el-icon-arrow-down'"
            @click="c.isOpen = !c.isOpen"
          ></i>
        </div>
        <div class="moneybox">
          <span>收益总额:￥{{ (list[c.key + 'ProfitNum'] || 0).toFixed(2) }}</span>
          <span>订单总数:{{ list[c.key + 'OrderNum'] || 0}}</span>
        </div>
        <div v-for="(d, idx) in list[c.key + 'ProfiDetails']" class="tijlxq" v-show="c.isOpen" :key="idx">
          <div class="left">
            <div class="l-1">{{ getTime(d.createTime, 0) }}</div>
            <div class="l-2">{{ getTime(d.createTime, 1) }}</div>
          </div>
          <div class="mid">
            <div class="a1">{{ `订单号：${d.orderNo}` }}</div>
            <div class="a2">{{ `身份：${d.roleName}` }}</div>
          </div>
          <div class="right">
            +{{ d.profit }}
          </div>
        </div>
        <div class="tijlxq-none" v-show="c.isOpen && list[c.key + 'ProfiDetails'] && list[c.key + 'ProfiDetails'].length < 1">
          暂无数据
        </div>
      </div>
    </template>

    <img v-else class="noneData" src="../../assets/images/img_zw.png" alt="">
  </div>
</template>
<script>
let MonthStr = [
  {
    key: 'august',
    month: 8,
    isOpen: true
  },{
    key: 'july',
    month: 7,
    isOpen: true
  },{
    key: 'june',
    month: 6,
    isOpen: true
  },{
    key: 'may',
    month: 5,
    isOpen: true
  }
]
export default {
  data() {
    return {
      list: [],
      seq: this.$route.query.seq || this.$store.state.userInfo.seq,
      monthStr: MonthStr,
      noneData: false
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
    //获取收益列表
    getInfo() {
      Indicator.open('加载中...');
      axios.get(this.blockURL + "/qypfs-profit/earnings/findProfitByPifa", {params: { seq: this.seq }}).then(res => {
        console.log('findProfitByPifa', res);
        if (res.data.code == 200) {
          let list = res.data.data;
          let num = 0;
          MonthStr.forEach((item, idx) =>{
            num += list[item.key + 'ProfiDetails'].length;
          })
          if (num == 0) this.noneData = true;
          this.list = list;
        } else {
          this.noneData = true;
          Toast(res.data.message);
        }
        Indicator.close();
      }).catch(res => {
        this.noneData = true;
        Toast('系统错误');
        Indicator.close();
      })
    },
    // 时间处理
    getTime(time, idx) {
      if (!time) return '';
      return time.slice(5, -3).split(' ')[idx];
    }
  }
};
</script>
<style scoped>
.noneData{
    display: block;
    max-width: 65%;
    margin: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
}
.warp {
  position: relative;
  min-height: 100vh;
  background-color: #f2f2f2;
  overflow: hidden;
  padding-top: 1.83rem;
}

.mint-header {
  background-color: #f23030;
  color: #fff;
  height: 44px;
  font-size: 16px;
}
.main {
  width: 100%;
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
  width: 50%;
  padding: 0.3em 0.6em;
  font-size: 14px;
  color: #666;
  line-height: 1.6em;
}
.tijlxq-none{
  text-align: center;
  padding: .2rem 0;
}
.tijlxq {
  width: 100%;
  display: flex;
  line-height: 1.2rem;
  border-bottom: 1px solid #f5f5f5;
}
.tijlxq .left {
  display: flex;
  width: 15%;
  border-right: 1px solid #f5f5f5;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tijlxq .left .l-1{
  font-size: .57rem;
}
.tijlxq .left .l-2{
  font-size: .55rem;
}
.tijlxq .mid {
  flex: 2;
  padding-left: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tijlxq .mid div{
  font-size: .55rem;
}
.tijlxq .mid .a1{
  font-weight: 500;
}
.tijlxq .mid .a2{
  margin-top: -0.2rem;
}
.tijlxq .right {
  width: 18%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.65rem;
  color:#FFA800;
  font-size: 500;
}
</style>
