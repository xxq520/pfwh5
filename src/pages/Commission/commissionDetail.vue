<template>
    <div class="commission-wrap">
        <mt-header title="详情">
            <router-link slot='left' :to="{ path: '/wholesale/commissionOperation', query: { type: 4 }}">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="list">
            <ul>
                <li>
                    <p>交易时间：</p>
                    <span>2018-12-25</span>
                </li>
                <li>
                    <p>批发商名称：</p>
                    <span>温尚文</span>
                </li>
                <li>
                    <p>身份证号码：</p>
                    <span>452115788912245213</span>
                </li>
                <li>
                    <p>返佣金额：</p>
                    <span>¥65.62</span>
                </li>
                <li>
                    <p>提现/转余额：</p>
                    <span>¥65.62</span>
                </li>
                <li>
                    <p>剩余金额：</p>
                    <span>¥65.62</span>
                </li>
                <li>
                    <p>操作：</p>
                    <div>
                        <span>详情</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </li>
            </ul>
            <ul>
                <li>
                    <p>转余额：</p>
                    <i class="el-icon-arrow-right"></i>
                </li>
            </ul>
            <ul v-if="type == 1">
                <li>
                    <p>店铺名称：</p>
                    <span>北京东方航天生物制品有限公司</span>
                </li>
                <li>
                    <p>批发商账号：</p>
                    <span>18765512881</span>
                </li>
                <li>
                    <p>入驻类型：</p>
                    <span>年费：1080元</span>
                </li>
                <li>
                    <p>入驻订单号：</p>
                    <span>18765512881</span>
                </li>
                <li>
                    <p>交易流水号：</p>
                    <span>452115788912245213</span>
                </li>
                <li>
                    <p>返佣金额：</p>
                    <span>65.62元</span>
                </li>
                <li>
                    <p>交易时间：</p>
                    <span>2018-02-18 12:40</span>
                </li>
                <li>
                    <p>入驻金额：</p>
                    <span>¥：1080.00</span>
                </li>
            </ul>
            <ul>
                <li>
                    <p>申请时间：</p>
                    <span>2018-02-18 12:40:20</span>
                </li>
                <li>
                    <p>申请类型：</p>
                    <span>转余额</span>
                </li>
                <li>
                    <p>关键字：</p>
                    <span>18765512881</span>
                </li>
                <li>
                    <p>申请金额：</p>
                    <span>¥：1080.00</span>
                </li>
                <li>
                    <p>税后金额：</p>
                    <span>¥：1080.00</span>
                </li>
                <li>
                    <p>审核结果</p>
                    <span>转余额成功</span>
                </li>
                <li>
                    <p>审核时间：</p>
                    <span>2018-02-18 12:40:10</span>
                </li>
                <li>
                    <p>备注：</p>
                    <span>转余额1080.00元给18765512881</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            type: this.$route.query.type
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.commission-wrap .mint-header {
    background: #ef4628;
    color: #fff;
}
.list ul {
    background: #fff;
    border-radius: .2222rem /* 10/45 */;
    margin: .4444rem /* 20/45 */  .3333rem /* 10/45 */;
    padding: 0 .2222rem /* 10/45 */;
}
.list li{
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    border-bottom: 1px solid #000;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
      font-size: .6222rem /* 28/45 */;
}
.list li:nth-last-of-type(1) {
    border-bottom: 0;
}
.list li p {
    font-size: .6222rem /* 28/45 */;
    line-height: .6222rem /* 28/45 */;
}
.list li i {
    font-size: .7111rem /* 32/45 */;

}
</style>
