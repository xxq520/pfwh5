<template>
    <div class="peopleManage">
        <mt-header :title="top?'我的上级统筹官':'详情'" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goback()"></mt-button>
        </mt-header>
        <div class="mainBox">
            <ul class="list">
                <li>
                    <p class="boex">
                        <span class="left">姓名:</span>
                        <span v-if="list.nickname" class="right">{{list.nickname}}</span>
                        <span v-if="list.nickName" class="right">{{list.nickName}}</span>
                        <span v-if="list.name" class="right">{{list.name}}</span>
                        <span v-if="!list.nickname&&!list.name&&!list.nickName" class="right">未填写</span>
                    </p>
                    <p>
                        <span class="left">角色:</span>
                        <span class="right" >{{list.roleName||userCheckRole.name||'未填写'}}</span>
                    </p>
                    <p>
                        <span class="left">手机号:</span>
                        <span class="right"> <span v-show="list.discounts">￥</span>{{list.phone||'未填写'}}</span>
                    </p>
                    <p>
                        <span class="left">申请时间:</span>
                        <span class="right">{{list.createTime||'未填写'}}</span>
                    </p>
                    <p>
                        <span class="left">批发(负责)区域:</span>
                        <span v-if="userCheckRegion[0]" class="right">{{userCheckRegion[0].regionDetails||"未填写"}}</span>
                        <span v-else class="right" >{{list.address||'未填写'}}</span>
                    </p>
                    <p>
                        <span class="left">行业:</span>
                        <span class="right">{{list.categoryName||userCheckRole.categoryName||'未填写'}}</span>
                    </p>
                </li>
            </ul>

        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '订单详情',
                    back: true
                },
                isShowBox: false,
                level: this.$cookie.get('level_id'), //0 潜在用户、1 一级用户和 2二级用户
                userid: this.$cookie.get('userid'), //用户id
                sidx: '', //排序字段
                sort: '', //排序方式
                list: {},
                total: '',
                type: 0,
                seq: this.$route.query.seq,
                // 角色的id
                id: this.$route.query.id,
                // 用户的user id
                userId: this.$route.query.userId,
                // 是否是查看上级详情
                top: this.$route.query.top,
                userCheckRole: {}, // 角色的数据
                userCheckRegion:[], // 批发负责区域
            }
        },
        created(){

        },
        mounted() {

            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.getToken()
        },
        methods: {
            getToken(){
                var that =this;
                var  fromApp = that.$route.query;
                // app=true&userId=用户id&top=true&id=角色id;
                if (fromApp.app){
                    that.seq = fromApp.seq;
                    that.id = fromApp.id;
                    that.userId = fromApp.userId;
                    // that.mobile = query.mobile||"";
                    // 在global中挂载方法
                    window['getAppLogin'] = function(json) {
                        sessionStorage.setItem("bearer",json);
                        that.getdis();
                    };
                    if (sessionStorage.getItem("bearer")){
                        that.getdis();
                    }
                }else{
                    that.getdis();
                }
            },
            //返回
            goback() {
                history.go(-1);
            },
            //获取订单详情信息
            getdis() {
                // 如果是查询我的上级统筹官的话
                if (this.top){
                    axios({
                        url: this.blockURL +`/qypfs-user/userManage/findUserSuperiorShow`,
                        data:{
                            roleId: this.id,  // 角色的id
                            userId: this.userId // 当前查看详情的的用户userid
                        },
                        method: "post",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            this.list = data;
                        }
                    })
                // 查看旗下发展人数的话
                } else if(!this.userId) {
                    let post = {
                        roleId: this.id, // 角色的id
                        userSeq: this.seq, // 当前查看详情的的用户seq
                    };
                    axios({
                        url: this.blockURL +'/qypfs-user/user/findUserRoleChecked',
                        data: post,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            this.list = data;
                            this.userCheckRegion = data.userCheckRegion;
                            this.userCheckRole = data.userCheckRole;
                        }
                    })
                // 如果是查看推荐列表的话
                } else {
                    let post = {
                        roleId: this.id,
                        userId:this.userId,
                        // userSeq: this.seq
                    };
                    axios({
                        url: this.blockURL +'/qypfs-user/userManage/findLowerShow',
                        data: post,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            this.list = data;
                        }
                    })
                }

            },

        }
    }

</script>
<style scoped>
    .peopleManage {
        min-height: 100vh;
        background-color: #eee;
        overflow: hidden;
        padding-top: 50px;

    }

    .mint-header {
        background-color: #f23030;
        color: #fff;
        height: 44px;
        font-size: 16px;

    }

    .mainBox {
        background-color: #f6f6f6;

    }

    .mainBox .list li {
        background-color: #fff;
        padding: 0 0.5rem;
        font-size: .5333rem;
        color: #666666;
        margin-bottom: 0.5rem;
    }


    .mainBox .list li p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2.1rem;
        border-bottom: 1px solid #eee;
    }

    .mainBox .list li p:first-child {
        font-size: .5778rem;
        color: #333333;
    }

    .mainBox .list li p:last-child {
        border: none;
    }

    .mainBox .list li p .phoneIcon {
        width: .8444rem;
        height: .8444rem;

    }

    .mainBox .list li p .Label {
        height: .8444rem;
        line-height: .8444rem;
        padding: 0 .3111rem;
        font-size: .4889rem;
        border-radius: .4rem;
        background-color: #ff6e04;
        color: #fefefe;
    }

</style>
