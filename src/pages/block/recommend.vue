<template>
    <div class="user-management">
        <mt-header title="推荐提醒" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="search-box">
            <div class="search-con" ref="search">
                <input type="text" placeholder="姓名/手机号" class="search-input" v-model="searchText">
                <p class="submit" @click="searchFn">搜索</p>
            </div>
        </div>
        <div class="user-list">
            <ul>
                <li v-for="(item,index) in list" :key="index" class="user-item">
                    <div class="item-left">
                        <img :src="item.lowerIcon" alt="" v-if="item.HeadPortraitURL">
                        <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
                    </div>
                    <div class="item-middle">
                        <div class="user-name">
                            <p>{{item.nickname||item.lowerNickName ||"匿名"}}</p>
                            <p class="active">{{item.lowerRoleName||item.roleName}}</p>
                        </div>
                        <p class="user-tel">{{item.phone||item.lowerPhone}}</p>
                        <p class="time">创建时间: {{item.createTime}}</p>
                    </div>
                    <div class="item-right">
                        <!-- 0待绑定 1审核中 2已拒绝 -->
                        <span @click="banding(item)" :class="item.type==1?'banding disable':'banding'">{{['绑定','审核中','已拒绝'][item.type]}}</span>
                        <p class="time" @click.stop="record(item.userSeq,item.roleId,item.userId)"> <i class="el-icon-arrow-right mr-l-14"
                                style="font-size: 18px; color: #666;"></i></p>
                    </div>
                </li>
            </ul>
            <p v-if="!noData" class="no-data">{{noDataText}}</p>
        </div>

    </div>
</template>
<script>
    import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
    import wholesaleNav from '@/components/WholesaleNav';
    import {
        showToast
    } from '@/assets/js/common.js';
    import {Toast, Indicator,MessageBox} from 'mint-ui';

    export default {
        data() {
            return {
                searchText: "",
                seq: '',
                list: [],
                conHeight: "",
                pages: 1,
                isLoading: true,
                allLoaded: false,
                noData: false,
                noDataText: "暂无数据",
                // 区域批发商2.0 查询管理人员需要传入userId
                userId: "",
            }
        },
        components: {
            wholesaleNav
        },
        created() {
            var  query = this.$route.query;
            // 判断是发是管理旗下发展人员
            this.seq = query.seq
        },
        mounted() {
            Indicator.open();
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.getToken()
        },
        methods: {
            // 点击绑定事件
            banding(item) {
                // 是否是可以绑定状态
                if (item.type!=0){
                    return
                }
                MessageBox({
                    title: '',
                    message: '确认是否绑定该账号？',
                    showCancelButton: true,
                    confirmButtonText: "绑定",
                    cancelButtonText: "取消"
                }).then(action => {
                    if(action == 'confirm') {
                        // 是否是获取旗下发展管理人员
                        Indicator.open();
                        axios.post(this.blockURL +`/qypfs-user/auth/govern?mobile=${item.phone}&shareSeq=${this.seq}`)
                            .then((res) => {
                                Indicator.close();
                                if (res.data.code == 200) {
                                    Toast("绑定成功，已提交平台审核");
                                    this.getUserlist()
                                } else {
                                    Toast(res.data.message);
                                }
                            }).catch(err=>{
                            Indicator.close();
                        });
                    }
                })
            },
            getToken(){
                this.getUserlist();
            },
            goBack(){
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            //计算中间滚动内容高度
            setHeight() {
                //屏幕高度
                let body = document.documentElement.clientHeight;
                //头部高度
                let header = this.$refs.header.$el.clientHeight;
                //搜索区高度
                let search = this.$refs.search.$el.clientHeight;
                //底部高度
                let bottom = document.querySelector('.mint-tabbar').clientHeight;
                this.conHeight = body - header - search - bottom;
                sessionStorage.setItem("user", this.conHeight);
            },
            loadBottom() {
                this.getUserlist();
                this.allLoaded = true; // 若数据已全部获取完毕
                this.$refs.loadmore.onBottomLoaded();
            },
            //获取用户列表
            getUserlist() {
                // 是否是获取旗下发展管理人员
                axios.get(this.blockURL +`/qypfs-user/userManage/recommend?nameOrPhone=${this.searchText}&page=0&pageSize=1000`)
                    .then((res) => {
                        Indicator.close();
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            if (data.list.length != 0) {
                                this.list = data.list;
                                if (this.pages > data.totalPage) {
                                    this.isLoading = false;
                                }
                                this.allLoaded = false;
                                this.pages++;
                                this.noData = true;
                            } else {
                                if (this.pages > 1) {
                                    this.noDtataText = "暂无更多数据数据"
                                } else {
                                    this.noDataText = "暂无数据"
                                }
                                this.noData = false;
                            }
                        } else {
                            this.noData = false;
                            this.noDataText = "暂无数据"
                        }
                    }).catch(err=>{
                    Indicator.close();
                });
            },
            // 搜索
            searchFn() {
                if (this.searchText == '') {
                 this.clearSearch()
                } else {
                    this.pages = 1;
                    this.list = [];
                    this.noDataText = "数据加载中..."
                    this.getUserlist();
                }
            },
            //取消搜索
            clearSearch() {
                this.noData = false;
                this.pages = 1;
                this.list = [];
                this.searchText = "";
                this.noDataText = "数据加载中..."
                this.getUserlist();
            },
            // 跳转购买记录页面
            record(seq,id,userId) {
                console.log(seq,id,userId)
                this.$router.push({
                    path: "/block/UserDetalis",
                    query: {
                        seq: seq||this.seq,
                        id:id ,
                        userId:userId
                    }
                });
            }
        }
    }

</script>
<style scoped>
    .user-management .item-right .banding{
        padding: 0.04rem 0.4rem !important;
        border: 1px solid #FF6023FF !important;
        font-size: 0.56rem;
        color: #FF6023FF !important;
        margin-right: 0.2rem;
        border-radius: 0.15rem;
        display: block;
    }
    .user-management .item-right .disable{
        padding: 0.04rem 0.4rem !important;
        border: 1px solid #ccc !important;
        display: block;
        font-size: 0.56rem;
        color: #ccc !important;
        margin-right: 0.2rem;
        border-radius: 0.15rem;
    }
    .user-management{
    }
    .search-con{
        display: flex;
    }
    .submit{
        font-size: 0.5rem;
        margin-left: 0.3rem;
        border-left: 0.02rem solid #ccc;
        padding-left: 0.4rem;
    }
    .user-management .search-box {
        display: block;
        position: fixed;
        top: 44px;
        width: 100%;
        height: 2rem;
        background-color: #f5f5f5;
        z-index: 1;
    }

    .mint-header {
        background-color: #f23030;
        color: #fff;
        height: 44px;
        font-size: 16px;

    }

    .user-management .search-con {
        width: 13.7778rem;
        height: 1.3rem;
        background-color: #fff;
        border-radius: 1.3rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        margin: .4444rem auto 0;
    }

    .user-management .search-con .search-input {
        width: 11.5556rem;
        text-indent: 1.6rem;
        background: url('../../assets/images/search-icon.png') no-repeat .5rem center;
        background-size: .5rem;
    }

    .user-management .search-con .search-btn {
        width: 2.2222rem;
        border: 0;
        background-color: #f23030;
        color: #fff;
    }

    .user-management .user-list {
        padding-top: 100px;
        overflow: auto;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch
    }

    .user-management .user-item {
        padding: .3rem;
        overflow: hidden;
        border-bottom: .0222rem solid #e4e4e4;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        align-items: center;

    }
    .user-management .user-item:last-child{
        border-bottom: 0;
    }

    .user-management .item-left {
        width: 18%;
        height: 2.4rem;
        border-radius: 0.3rem;
        overflow: hidden;
    }

    .user-management .item-middle {
        padding-left: 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

    }

    .user-management .item-right {
        display: flex;
        justify-content: center;
        align-items: center;
    }



    .user-management .item-middle .user-name {
        font-size: .62rem;
        height: 1.2rem;
        display: flex;
        align-items: center;
    }

    .user-management .item-middle .user-name .active {
        font-size: .5rem;
        height: 0.8rem;
        line-height: 0.8rem;
        padding: 0 0.5rem;
        border-radius: .5rem;
        color: #fff;
        background-color: #FF6023FF;
        margin-left: 0.4rem;
    }

    .user-management .item-middle .name {
        display: inline-block;
        max-width: 4.4444rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
    }


    .user-management .user-tel,
    .user-management .time {
        color: #666;
        font-size: .52rem;
        text-align:left !important;
    }

    .user-management .user-tel {
        text-align: left;
    }

    .user-management .zhekou {
        width: 2.6667rem;
        background: #ff9f6e url("../../assets/images/zhekou-icon.png") no-repeat .3333rem center;
        background-size: .6222rem .4889rem;
        color: #fff;
        padding-left: 1rem;
        margin-right: .4444rem;
    }

    .user-management .agree {
        margin-left: .4444rem;
        background-color: #2acf2e;
    }

    .user-management .no-data {
        font-size: .7111rem;
        color: #999;
        text-align: center;
        padding: .6667rem 0;
    }

    .user-management .mint-loadmore-bottom {
        font-size: 0.6667rem;
    }

</style>
