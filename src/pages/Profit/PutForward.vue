<template>
    <div class="put-forward">
        <mt-header title="提现">
            <router-link to="/wholesale/myProfit" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="put-con">
            <div class="all-con">
                <p>可提现余额:12345.23</p>
                <p class="put-btn">全部提现</p>
            </div>
            <div class="input-con">
                <mt-field placeholder="请输入金额" type="number" v-model="account" class="input-account"></mt-field>
            </div>
            <mt-button class="next-btn" @click="nextFn">下一步</mt-button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            account:''
        }
    },
    mounted(){},
    methods:{
        nextFn(){
            this.$router.push('/wholesale/putForwardDetails')
        }
    }
}
</script>

<style>
    .put-forward .put-con{
        padding:2rem .5333rem 0;
    }
    .put-forward .all-con{
        display:flex;
        justify-content: space-between;
        font-size:.5778rem;
        margin-bottom:1rem;
    }
    .put-forward .all-con .put-btn{
        color:#999;
    }
    .put-forward .input-con{
        margin-bottom:2.2222rem;
    }
    .put-forward .input-con .input-account{
        font-size:.6222rem;
    }
    .put-forward .next-btn{
        width:100%;
        height:1.9556rem;
        color:#fff;
        background-color:#f23030;
    }
</style>
