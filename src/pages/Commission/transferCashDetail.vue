<template>
    <div class="transferCash-detail">
        <mt-header title="返佣转提现详情">
            <router-link slot='left' :to="{ path: '/wholesale/commissionOperation', query: { type: 4 }}">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="list-con">
            <ul>
                <li v-for="(item, i) in 2">
                    <div class="info">
                        <p>温尚文</p>
                        <span>440203144512274554</span>
                    </div>
                    <div class="price">
                        <div class="price-info">
                            <p>¥65.62</p>
                            <span>2018-12-03</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    created(){
    },
    methods: {
    }
}
</script>

<style scoped>
    .transferCash-detail .mint-header {
        background: #ef4628;
        color: #fff;
    }
    .list-con {
            margin: .4444rem /* 20/45 */ .3333rem /* 10/45 */;
    }
    .list-con ul{
        padding: 0 .3333rem /* 15/45 */;
        background: #fff;
        border-radius: .2222rem /* 10/45 */;
        margin-bottom: .4444rem /* 20/45 */;
    }
    .list-con ul:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    .list-con ul li{
        padding: .4444rem /* 20/45 */ 0;
        font-size: .6222rem /* 28/45 */;
        padding-right: .3333rem;
        border-bottom: 1px solid #000;
    }
    .list-con ul li:nth-last-of-type(1) {
        border-bottom: 0;
    }
    .list-con li p{
        margin-bottom: .3333rem;
    }
    .list-con li > * {
        display: inline-block;
        vertical-align: middle;
    }
    .list-con li .price {
        float: right;
        text-align: right;
    }
    .list-con .price > * {
        display: inline-block;
        vertical-align: middle;
    }
    .list-con li span {
         font-size: .5333rem /* 24/45 */;
    }
    .list-con .info p {
        max-width: 8.8889rem /* 400/45 */;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>