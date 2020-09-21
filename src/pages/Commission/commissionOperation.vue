<template>
    <div class="commission-operation">
        <mt-header :title="title">
            <router-link slot='left' to="/wholesale/commission">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="topbar">
            <div class="tab">
                <span @click="detail">详细</span>
                <span @click="checkBill">对账单</span>
                <span @click="linkToBalance" v-if="type == 4">提现</span>
            </div>
            <div class="refresh">
                <span>刷新</span>
                <i class="el-icon-refresh"></i>
            </div>
        </div>
        <div class="list-con">
            <div>
                <ul>
                    <li v-for="(item, i) in 7" @click="linkToItemDetail">
                        <div class="info">
                            <p>温尚文</p>
                            <span>440203144512274554</span>
                        </div>
                        <div class="price">
                            <div class="price-info">
                                <p><em>¥65.62</em></p>
                                <span>2018-12-03</span>
                            </div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            seq:'',
            type: this.$route.query.type
        }
    },
    created(){
        this.getSeq();
    },
    computed: {
        title() {
            return this.type == 3 ? '返佣转余额' :  '返佣提现' ;
        }
    },
    methods: {
        // 获取用户seq
        getSeq(){
            let seq = sessionStorage.getItem('seq');
            if(seq){
                this.seq = seq;
            }
        },
        // 详细
        detail() {
            if(this.type == 4) {
                this.$router.push({
                    name: 'transferCashDetail'
                })
            }
        },
        // 详情
        linkToItemDetail() {
            if(this.type == 4) {
                this.$router.push({
                    name: 'commissionDetail'
                })
            }
        },
        // 提现
        linkToBalance() {
            if(this.type == 4) {
                this.$router.push({
                    name: 'transferBalance'
                })
            }
        },
        // 转余额
        checkBill() {
            if(this.type == 4) {
                this.$router.push({
                    path: '/wholesale/commissionList', 
                    query: { type: 4 }
                })
            }
        }
    }
}
</script>

<style scoped>
    .commission-operation {
        padding-bottom: 1.1111rem /* 50/45 */;
    }
    .commission-operation .mint-header {
        background: #ef4628;
        color: #fff;
    }
    .topbar {
        margin: 0 .3333rem /* 10/45 */ .4444rem /* 20/45 */ ;
        background: #fff;
        font-size: .6222rem /* 28/45 */;
        position: relative;
        padding: .4444rem /* 20/45 */ 0;
        border-bottom-left-radius: .2222rem /* 10/45 */;
        border-bottom-right-radius: .2222rem /* 10/45 */;
    }
    .topbar .tab {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .topbar .tab span {
        width: 2.6667rem /* 120/45 */;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
        background: #4da9ff;
        border-radius: .2222rem /* 10/45 */;
        color: #fff;
        text-align: center;
        margin-right: .4444rem /* 20/45 */;
    }
    .topbar .tab span:nth-of-type(2) {
        background: #ff983c;
    }
    .topbar .tab span:nth-of-type(3) {
        margin-right: 0;
        background: #00dd5e;
    }
    .topbar .refresh {
        position: absolute;
        right: .4444rem /* 20/45 */;
        top: .4444rem /* 20/45 */;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
    }
    .list-con {
        margin: 0 .3333rem /* 10/45 */;
    }
    .list-con > div {
        border-radius: .2222rem /* 10/45 */;
        overflow: hidden;
    }
    .list-con ul{
        padding-left: .3333rem /* 15/45 */;
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
    .list-con li em{
        color: #ef4628;
        font-style: normal;
    }
</style>