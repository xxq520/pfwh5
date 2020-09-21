<template>
    <div class="commission-wrap">
        <mt-header title="返佣管理">
            <router-link slot='left' to="/wholesale/storeManagement">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="list">
            <ul>
                <li>
                    <router-link :to="{path:'/wholesale/myBalance'}">
                        <div class="">
                            <span></span>
                            <p>我的余额</p>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/wholesale/commissionList', query: { type: 2 }}">
                        <div>
                            <span></span>
                            <p>代理商返佣报表</p>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path: '/wholesale/commissionList', query: { type: 1 }}">
                        <div>
                            <span></span>
                            <p>推荐批发商一次性奖励</p>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </router-link>
                </li>

            </ul>
        </div>
    </div>
</template>

<style scoped>
.commission-wrap .mint-header {
    background: #ef4628;
    color: #fff;
}
.list {
    background: #fff;
    border-radius: .2222rem /* 10/45 */;
    margin: .4444rem /* 20/45 */  .3333rem /* 10/45 */;
    padding: 0 .2222rem /* 10/45 */;
}
.list li a{
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    border-bottom: 1px solid #000;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
}
.list li:nth-last-of-type(1) a{
    border-bottom: 0;
}
.list li div >* {
    display: inline-block;
    vertical-align: middle;
}
.list li p {
    font-size: .6222rem /* 28/45 */;
    line-height: .6222rem /* 28/45 */;
}
.list li span {
    width: .4444rem /* 20/45 */;
    height: .4444rem /* 20/45 */;
    background: pink;
}
.list li i {
    font-size: .7111rem /* 32/45 */;

}
</style>
