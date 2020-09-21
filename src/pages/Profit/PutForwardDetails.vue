<template>
    <div class="putforward-details">
        <mt-header title="提现">
            <router-link to="/wholesale/putForward" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="details-con">
            <div class="details-box">
                <p class="put-code">
                    <span>提现编号：</span>
                    <span>201712251658123456</span>
                </p>
                <p class="put-item">
                    <span>提现金额：</span>
                    <span class="price">￥588.00</span>
                </p>
                <p class="put-item">
                    <span>手续费：</span>
                    <span class="item-right">￥588.00</span>
                </p>
                <p class="put-item">
                    <span>时间：</span>
                    <span class="item-right">2018.01.02</span>
                </p>
            </div>
        </div>
        <div class="bank-con">
            <p class="bank-title">请选择体现方式</p>
            <div class="bank-list">
                <div class="bank-item">
                    <p><img src="@/assets/images/wxlogo.png" alt="" class="imgs">建设银行0740 <span class="item-tips">(暂不收取手续费)</span></p>
                    <i class="icons"></i>
                </div>
                <div class="bank-item">
                    <p><img src="@/assets/images/wxlogo.png" alt="" class="imgs">建设银行0740 <span class="item-tips">(暂不收取手续费)</span></p>
                    <i class="icons"></i>
                </div>
            </div>
        </div>
        <div class="add-con">
            <router-link to="/mybank">添加银行卡</router-link>
        </div>
        <mt-button class="submit-btn" @click="submitFn">确定提现</mt-button>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    mounted(){
        
    },
    methods:{
        submitFn(){
            this.$router.push('/wholesale/putOrderDetails');
        }
    }
}
</script>

<style>
    .putforward-details .details-con{
        background-color:#f5f5f5;
        padding:.3rem 0;
    }
    .putforward-details .details-box{
        background-color:#fff;
        padding:0 .5333rem;
        font-size:.6222rem;
    }
    .putforward-details .details-box p{
        display:flex;
        justify-content: space-between;
        line-height:1.5rem;
    }
    .putforward-details .details-box .put-code{
        padding:.2rem 0;
        border-bottom:.0222rem solid #eee;
    }
    .putforward-details .details-box .price{
        color:#e43a3d;
    }
    .putforward-details .details-box .item-right{
        color:#666;
    }
    .putforward-details .submit-btn{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        height:1.9556rem;
        color:#fff;
        background-color:#e43a3d;
        border-radius:0;
    }
    .putforward-details .bank-con{
        font-size:.6222rem;
        padding:0 .5333rem;
        margin-bottom:1rem;
    }
    .putforward-details .bank-con .bank-title{
        height:1.9556rem;
        line-height:1.9556rem;
        border-bottom:.0222rem solid #eee;
    }
    .putforward-details .bank-item{
        display:flex;
        justify-content: space-between;
        align-items:center;
        height:2.6667rem;
        line-height:2.6667rem;
        border-bottom:.0222rem solid #eee;
    }
    .putforward-details .bank-item .imgs{
        width:1.3333rem;
        height:1.3333rem;
        border-radius:50%;
        vertical-align: middle;
        margin-right:.4444rem;
    }
    .putforward-details .bank-item .item-tips{
        font-size:.5778rem;
        color:#999;
    }
    .putforward-details .bank-item .icons{
        display:block;
        width:.8889rem;
        height:.8889rem;
        border-radius:50%;
        background:url('../../assets/images/wholesale/selected-icon.png') no-repeat center;
        background-size:100% 100%;
    }
    .putforward-details .add-con{
        padding:0 .5333rem;
        font-size:.6222rem;
        text-align:right;
    }
    .putforward-details .add-con a{
        color:#36a0e3;
    }
</style>
