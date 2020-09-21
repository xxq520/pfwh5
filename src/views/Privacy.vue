<template>
  <div class="mainbox">
    <div class="top_nav" v-if="backapp!='move'">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span>{{topnav.title}}</span>
    </div>
    <div class="content">
      <img src="http://dfs2.520shq.com/group1/M00/07/BD/wKgAC19I0-eARSOlAAmt4_R4D6k063.png" alt="" preview="1" preview-text="隐私政策">
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: "隐私政策"
                },
                backapp: this.$route.query.backapp
            }
        },
        props:["register"],
        mounted() {
        },
        methods: {
            goback() {
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                   try {
                   window.action.app_back();
                   } catch (err) {
                   window.history.go(-1)
                   }
            },
        }
    }

</script>

<style scoped>
    .mainbox {


    width: 100%;
    height: 100%;
    }

    .top_nav {
    width: 100%;
    height: 40px;
    background-color: #e60012;
    color: #fff;
    display: flex;
    line-height: 40px;
    text-align: center;
    position: fixed;
    left: 0;
    top: 0;
    }

    .top_nav i {
    flex: 1;
    line-height: 40px !important;
    font-size: 20px !important;
    }

    .top_nav span {
    flex: 9;
    font-size: 18px;
    text-indent: -50px;
    }

    .mainbox .content {


    width: 100%;
    height: 100%;
    }


</style>
