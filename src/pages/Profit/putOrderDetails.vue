<template>
    <div class="putorder-details">
        <mt-header title="提现详情">
            <router-link to="/wholesale/myProfit" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="detail-header">
            <div class="detail-header-con">
                <p class="detail-title">收益提现</p>
                <p class="detail-price">-5245.20</p>
                <p class="detail-status">交易成功</p>
            </div>
        </div>
        <div class="detail-list">
            <div class="detail-item">
                <span class="item-left">类型</span>
                <span class="item-right">收益提现</span>
            </div>
            <div class="detail-item">
                <span class="item-left">创建时间</span>
                <span class="item-right">2018-04-17  12:00:00</span>
            </div>
            <div class="detail-item">
                <span class="item-left">完成时间</span>
                <span class="item-right">2018-04-17  12:00:00</span>
            </div>
            <div class="detail-item">
                <span class="item-left">交易单号</span>
                <span class="item-right">54555445578522454</span>
            </div>
            <div class="detail-item">
                <span class="item-left">备注</span>
                <span class="item-right">中国银行</span>
            </div>
        </div>
    </div>
</template>
<style>
    .putorder-details .detail-header{
        background-color:#f5f5f5;
        padding-top:.3rem;
        margin-bottom:1.3333rem;
    }
    .putorder-details .detail-header-con{
        background-color:#fff;
        text-align:center;
        padding-top:.8889rem;
    }
    .putorder-details .detail-header-con .detail-title{
        font-size:.6667rem;
        margin-bottom:.8889rem;
    }
    .putorder-details .detail-header-con .detail-price{
        font-size:1.1111rem;
        margin-bottom:.6667rem;
    }
    .putorder-details .detail-header-con .detail-status{
        font-size:.5333rem;
        color:#999;
    }
    .putorder-details .detail-item{
        padding:0 .5333rem;
        display:flex;
        justify-content: space-between;
        color:#666;
        font-size:.6667rem;
        margin-bottom:1.1111rem;
    }
</style>
