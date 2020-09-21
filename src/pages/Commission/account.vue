<template>
    <div class="account-wrap">
        <mt-header title="账户管理">
            <router-link slot='left' to="/wholesale/commission">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="topbar">
            <div class="tab">
                <span>新增</span>
            </div>
            <div class="refresh">
                <span>刷新</span>
                <i class="el-icon-refresh"></i>
            </div>
        </div>
        <div class="list-con">
            <ul>
                <li v-for="(item, i) in 7">
                    <div class="name">
                        <p>线下服务中心名称</p>
                        <div>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                    <div class="user">
                        <p>14516587246</p>
                        <span>2018-04-11</span>
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
            seq:''
        }
    },
    created(){
        this.getSeq();
    },
    methods: {
        // 获取用户seq
        getSeq(){
            let seq = sessionStorage.getItem('seq');
            if(seq){
                this.seq = seq;
            }
        },
    }
}
</script>

<style scoped>
    .account-wrap {
        padding-bottom: 1.1111rem /* 50/45 */;
    }
    .account-wrap .mint-header {
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
    .list-con ul{
        margin: 0 .3333rem /* 10/45 */;
    }
    .list-con li{
        padding: .6667rem /* 30/45 */ .4444rem /* 20/45 */ ;
        font-size: .6222rem /* 28/45 */;
        border-radius: .2222rem /* 10/45 */;
        margin-bottom: .4444rem /* 20/45 */;
        background: #fff;
    }
    .list-con li:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    .list-con li>div{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .list-con li .name {
        border-bottom: 1px solid #000;
        padding-bottom: .4444rem /* 20/45 */;
    }
    .list-con li .name span {
        display: inline-block;
        background: #ffb64d;
        border-radius: .2222rem /* 10/45 */;
        font-size: .2667rem /* 12/45 */;
        color: #fff;
        width: 2.2222rem /* 100/45 */;
        height: 1.1111rem /* 50/45 */;
        text-align: center;
        line-height: 1.1111rem /* 50/45 */;
    }
    .list-con li .name span:nth-of-type(2){
        background: #ff4d4d;
    }
    .list-con li .user {
        padding-top: .2222rem /* 10/45 */;
    }
</style>