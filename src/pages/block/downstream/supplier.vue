<template>
    <div class="glode supplier-con">
        <mt-header :title="topnav.title" :fixed="true" ref="header">
            <mt-button icon="back" slot="left" @click="backPage"></mt-button>
        </mt-header>
        <div class="supplier" >
            <div class="sup-item" v-for="(item,index) in supData" :key="index">
                <div class="sup-img">
                    <img :src="item.storeCoverImg" v-if="item.storeCoverImg">
                    <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
                </div>
                <div class="sup-text">
                    <div class="sup-name">
                        <p>{{ item.storeTitle }}</p>
                        <span v-if="item.status == 1" class="pass" @click="business(item)">进入店铺</span>
                        <span v-if="item.status == 2" class="noPass">审核不通过</span>
                        <span v-if="item.status == 0" class="toExamine">待审核</span>
                    </div>
                    <div class="sup-xx">手机号码：{{ item.storePhone }}</div>
                    <div class="address">地址：{{ item.storeAddress}}</div>
                </div>
            </div>
            <div v-if="supData==undefined" class="nodata">~ 无供应商 ~</div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import wholesaleNav from '@/components/WholesaleNav';
    import {Loadmore} from 'mint-ui';
    import {showToast, getCookie, setCookie} from '@/assets/js/common.js'

    export default {
        name: 'myaddress',
        data() {
            return {
                topnav: {
                    title: '我的供货商'
                },
                supData: [],
                userId:"",
                // 用户的信息
                userInfo: this.$store.state.userInfo,
            }
        },
        components: {
            wholesaleNav
        },
        created() {
            // 账号seq
            this.userId = this.$route.query.userId;
            this.getWholesaleList()
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
        },
        methods: {
            business(item){
                this.$store.commit('saveStoreId', item.regionalId);
                this.$router.push({
                    path:"/block/blockIndex"
                });
            },
            // app退出登录
            backPage() {
                history.go(-1)
            },
            // 获取绑定批发商数据
            getWholesaleList() {
                let params = {
                    "downswimId": this.userId || this.userInfo.userId,
                    "page": 0,
                    "pageSize": 1000,
                    "userNameOrPhone": ""
                };
                axios.post(this.blockURL + '/qypfs-user/wholesaler/findDownStoreList',params).then(res => {
                    if (res.data.code==200){
                        this.supData = res.data.data.list||[];
                    } else {
                        Toast({
                            message: res.data.message,
                            position: 'bottom',
                            duration: 2000
                        });
                    }
                });
            },
        }
    }
</script>

<style scoped>
    span.pass{
        background:rgba(255,96,35,1) !important;
    }
    span.noPass{
        background:rgba(255,0,0,1) !important;
    }
    span.toExamine{
        background:rgba(255,168,0,1) !important;
    }
    .glode {
        min-height: 100vh;
    }

    .dinghuo {
        padding: 0.1111rem .2222rem;
        background: #f00;
        color: #fff;
        border-radius: 25px;
        font-size: .4888rem;
    }

    .supplier {
        margin-top: 54px;
        overflow: hidden;
        height: auto;
        overflow-y: auto;
    }

    .supplier .sup-item {
        overflow: hidden;
        padding: 0.5rem 10px;
        background: white;
        border-bottom: 1px solid rgba(230,230,230,1);
        font-size: 0.65rem;
    }

    .supplier .sup-item .sup-img {
        float: left;
        width: 4rem;
        height: 4rem;
        overflow: hidden;
        background: #f2f2f2;
    }

    .supplier .sup-item .sup-text {
        float: right;
        width: calc(100% - 4.5rem);
        height: 4rem;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-justify-content: space-between;
        justify-content: space-between;
    }

    .supplier .sup-item .sup-text .sup-name {
        overflow: hidden;
    }

    .supplier .sup-item .sup-text .sup-name p {
        float: left;
        width: 9em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.6em;
        margin-top: -0.2rem;
        font-size:0.71rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }

    .supplier .sup-item .sup-text .sup-name span {
        float: right;
        line-height: 1.8em;
        width:3.18rem;
        height:1rem;
        text-align: center;
        background: #fe6f37;
        color: white;
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        border-radius: 3px;
    }

    .supplier .sup-item .sup-text .sup-name span.pass {
        background: #f71010;
    }

    .supplier .sup-item .sup-xx {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size:0.66rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }

    .supplier .sup-item .address {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }

    .nodata {
        overflow: hidden;
        padding: 1rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        color: #ccc;
    }

    .supplier-con .mask-con {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
    }

    .supplier-con .mask-box {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -7.7778rem;
        margin-left: -6.6667rem;
        width: 13.3333rem;
        height: 15.5556rem;
        background-color: #fff;
        overflow: hidden;
        border-radius: .2222rem;
    }

    .supplier-con .title {
        text-align: center;
        padding: .8889rem 0;
        font-size: .7111rem;
    }

    .supplier-con .mask-desc {
        height: 100%;
        overflow: auto;
    }

    .supplier-con .mask-list {
        padding: 15px 15px 2rem;
    }

    .supplier-con .mask-item {
        font-size: .5333rem;
        padding: 0 .7333rem;
        line-height: .8rem;
    }

    .supplier-con .btns-con {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.7778rem;
        border-top: .0222rem solid #ccc;
        display: flex;
        background: white;
    }

    .supplier-con .btns-con .btns {
        background-color: transparent;
        border: 0;
        outline-style: none;
        font-size: .6667rem;
        flex: 1;
    }

    .supplier-con .btns-con .btns:nth-child(2) {
        color: #fe0000;
        border-left: .0222rem solid #ccc;
    }

    .supplier-con .btns-con .btns:active {
        background-color: #f2f2f2;
    }

    .text {
        padding: 0.4444rem;
    }

    .text p {
        text-indent: 1.5111rem;
        font-size: 0.7555rem;
        margin-bottom: 0.4444rem;
    }

    .text p a {
        color: #f71010;
    }
</style>
