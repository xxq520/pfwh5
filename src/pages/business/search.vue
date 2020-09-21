<template>
  <div>
    <topnav :top="topnav" ></topnav>
    <div class="search" v-show="history.length > 0">
      <div class="search-title">
        <span>历史搜索</span>
        <i class="el-icon-delete" @click="clearhistory"></i>
      </div>
      <div class="search-box">
        <span class="search-list" v-for="(item,index) in history" :key="index" @click="historylist(item)">{{ item }}</span>
      </div>
    </div>
    <div class="search" v-show="host.length > 0">
      <div class="search-title">
        <span>热门搜索</span>
        <!--<i class="el-icon-delete"></i>-->
      </div>
      <div class="search-box">
        <span class="search-list" v-for="(item,index) in host" :key="index" @click="historylist(item.KeyWord)">{{ item.KeyWord }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        topnav:{
          searh:true
        },
        history:[],
        wholesaler:this.$route.query.wholesaler,
        host:[]
      }
  },
  mounted(){
    // /MerchantPage/GetHotSearch?WholesaleSEQ={WholesaleSEQ}
    axios.get(this.URL + '/MerchantPage/GetHotSearch?SEQ='+sessionStorage.seq).then(res => {
      this.host = res.data;
    })
    this.addhistory();
  },
  methods: {
    clearhistory(){
      this.$cookie.delete('searchHistory');
      this.addhistory();
    },
    addhistory(){
      this.history = this.$cookie.get('searchHistory')?JSON.parse(this.$cookie.get('searchHistory')):[];
    },
    historylist(val){
      this.$router.push({path:'/productList',query:{wholesaler:this.wholesaler,keyword:val}});
    }
  }
}
</script>

<style scoped>
.search{
  overflow:hidden;
  padding:0 10px 0;
  background:white;
  margin-bottom:0.5rem;
  font-size:0.65rem;
}
.search-title{
  overflow:hidden;
  line-height:1.2em;
  padding:0.5rem 0;
  color:#212121;
  border-bottom:1px solid #e6e6e6;
  margin-bottom:0.4rem;
}
.search-title span{
  float:left;
}
.search-title i{
  float:right;
  color:#686868;
  font-size:0.7rem;
}
.search-box{
  overflow:hidden;
  width:calc(100% + 0.4rem);
}
.search-list{
  color:#212121;
  line-height:1.2em;
  padding:0.4rem 0.6rem;
  background:#f5f5f5;
  float:left;
  margin:0 0.4rem 0.4rem 0;
  border-radius:2rem;
}
</style>
