<template>
    <div class="user-management">
        <!-- header -->
        <mt-header :title="typeOne?'旗下总部统筹官':userId?'旗下管理人员':'旗下发展人数'" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            <mt-button v-if="selectAuth==4" slot="right" class="send" @click="goTixin">推荐提醒</mt-button>
        </mt-header>
        <!-- search -->
        <div class="search-box">
            <div class="search-con" ref="search">
                <input type="text" placeholder="姓名/手机号" class="search-input" v-model="searchText">
                <p class="submit" @click="searchFn">搜索</p>
            </div>
        </div>
        <div class="user-list">
            <ul>
                <li v-for="(item,index) in list" :key="index" class="user-item"
                    @click.stop="record(item.lowerSeq||item.userSeq,item.lowerRoleId||item.roleId,item.userId)">
                    <div class="item-left">
                        <img v-if="item.HeadPortraitURL" :src="item.lowerIcon" alt="">
                        <img v-else src="@/assets/images/wholesale/user-icon.png" alt="">
                    </div>
                    <div class="item-middle">
                        <div class="user-name">
                            <p>{{item.userNickName||item.lowerNickName ||item.name ||"匿名"}}</p>
                            <p class="active">{{item.lowerRoleName||item.roleName}}</p>
                        </div>
                        <p class="user-tel">{{item.userName||item.lowerPhone||item.phone}}</p>
                        <p class="time">创建时间: {{item.createTime}}</p>
                    </div>
                    <div class="item-right">
                        <p class="time"> <i class="el-icon-arrow-right mr-l- 14"
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
    export default {
        data() {
            return {
                searchText: "",
                seq: '',
                list: [],
                search: "",
                conHeight: "",
                pages: 1,
                isLoading: true,
                allLoaded: false,
                noData: false,
                noDataText: "暂无数据",
                selectAuth:this.$store.state.userInfo&&this.$store.state.userInfo.Blocktype,
                // 区域批发商2.0 查询管理人员需要传入userId
                userId: "",
                // 是否查看平台下的总部统筹官
                typeOne: "",
                userInfo: this.$store.state.userInfo || {},
            }
        },
        components: {
            wholesaleNav,
        },
        created() {
            this.seq = this.userInfo.seq ||  sessionStorage.getItem('seq');
            var  query = this.$route.query;
            // 判断是发是管理旗下发展人员
            this.userId = query.userId||"";
            this.typeOne = query.typeOne||"";
        },
        mounted() {
            Indicator.open();
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.getToken()
        },
        methods: {
            // 点击推荐提醒
            goTixin(){
                this.$router.push({
                    path: "/block/recommend",
                    query: {
                        seq:this.seq
                    }
                });
            },
            getToken(){
                var that =this;
                var  fromApp = that.$route.query;
                if (fromApp.app) {
                    that.seq = fromApp.userSeq;
                    that.selectAuth = fromApp.roleId;
                    that.userId = fromApp.userId||"";
                    that.typeOne = fromApp.typeOne||"";
                    // 在global中挂载方法
                    window['getAppLogin'] = function(json) {
                        sessionStorage.setItem("bearer",json);
                        that.getUserlist();
                    };
                    if (sessionStorage.getItem("bearer")){
                        this.getUserlist();
                    }
                } else {
                    this.getUserlist();
                }
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
            // 插入数据
            setDate(res) {
                if (res.data.code == 200) {
                    let data = res.data.data.list;
                    // 是否是旗下发展人数
                    if (data.length != 0) {
                        this.list = data;
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
            },
            //获取用户列表
            getUserlist() {
                // 查询平台旗下管理的总部统筹官
                if (this.typeOne) {
                    let post = {
                        nickNameOrPhone: this.searchText, // 按用户名或者手机号查询
                        page: 0,
                        pageSize: 1000,
                        roleId: Number(this.selectAuth), // 角色的id
                        userId: Number(this.userId),     // 当前用户的userId 可以vuex中userInfo中获取
                        userSeq: Number(this.seq),        // 当前用户的seq
                    };
                    axios.post(this.blockURL +'/qypfs-user/userManage/findHQLowerList',post)
                        .then((res) => {
                            Indicator.close();
                            this.setDate(res);
                        }).catch(err=>{
                        Indicator.close();
                    });
                    // 是否是获取旗下发展管理人员
                } else if (this.userId){
                    let post = {
                        nickNameOrPhone: this.searchText, // 按用户名或者手机号查询
                        page: 0,
                        pageSize: 1000,
                        roleId: Number(this.selectAuth), // 角色的id
                        userId: Number(this.userId),     // 当前用户的userId 可以vuex中userInfo中获取
                        userSeq: Number(this.seq)        // 当前用户的seq
                    };
                    axios.post(this.blockURL +'/qypfs-user/userManage/findCommanderLowerUser',post)
                        .then((res) => {
                            Indicator.close();
                            this.setDate(res);
                        }).catch(err=>{
                        Indicator.close();
                    });
                    // 获取旗下发展人数
                } else {
                    let post = {
                        isInterest: 0,
                        roleId: this.selectAuth,
                        type: 3,
                        userName: this.searchText,
                        userSeq: this.seq,
                        page: 0,
                        pageSize: 1000,
                    };
                    axios.post(this.blockURL +'/qypfs-user/user/findUserLower',post)
                        .then((res) => {
                            Indicator.close();
                            this.setDate(res);
                        }).catch(err=>{
                        Indicator.close();
                    });
                }
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
                this.$router.push({
                    path: "/block/UserDetalis",
                    query: {
                        seq: seq ,
                        id:id,
                        userId:userId||this.userId
                    }
                });
            }
        }
    }

</script>
<style scoped>
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
        width: 2.4rem;
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
