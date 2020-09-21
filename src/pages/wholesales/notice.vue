<template>
    <div class="user-management">
        <!-- header -->
        <mt-header title="公告" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <!---->
        <div class="blank1">
            <p class="tit">关于520平台互联网新批发项目功能调整</p>
            <p >各位伙伴：</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“新区域批发商”供应链新批发系统已上线，原由此处进入的订货功能已迁移到新系统，请您在“店铺管理”中选择“退出登录，然后重新登录520批发网APP，登录时请选择“供应链”类型用户登录切换到新系统进行操作。如有疑问，请联系以下人员咨询：</p>
            <p class="mt">钟磊：18565551382</p>
            <p>李智：18565553161</p>
            <p>刘助理：18589286282</p>
            <p class="thank">谢谢！</p>
            <p class="text-r">520平台互联网新批发项目运营中心</p>
            <p class="text-r">2020年7月13日</p>
        </div>
    </div>

</template>
<script>
    import {showToast} from '@/assets/js/common.js';
    import { Toast } from 'mint-ui';
    export default {
        data() {
            return {
            }
        },
        components: {
        },
        created() {
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
        },
        methods: {
            goBack(){
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            withdrawal(){
                Toast('暂未开放，敬请期待');
            },
        }
    }

</script>
<style scoped>
    .blank1{

        margin: 0 auto;
        margin-top: 55px;
        padding: 0 0.57rem;
    }
    .blank1 p{
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:1.09rem;
    }

    .blank1 .tit{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:1.09rem;
        text-align: center;
    }
    .thank{
        margin: 1rem 0;
    }
    .mt{
        margin-top: 0.2rem;
    }
    .text-r{
        text-align: right;
    }
    .mint-header{
        color: #fff;
    }

</style>
