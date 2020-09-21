<template>
    <div class="msg-list">
        <!-- 导航 -->
        <mt-header fixed :title="title" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <!-- 列表 -->
        <div class="list-box"
            v-infinite-scroll="queryMessage"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="30"
            infinite-scroll-throttle-delay="500">
            <template v-for="(item, idx) in list">
                <mt-cell-swipe
                    class="list-item"
                    @click.native="goDetail(item)"
                    v-if="item.messageType == messageType"
                    :key="idx"
                    :right="item.messageRead ? [] : [
                        {
                            content: htmlDom,
                            style: { },
                            handler: () => del(item)
                        }
                    ]">
                    <div slot="title">
                        <div class="t">
                            <span class="l">
                                <i :style="{'opacity': item.messageRead ? 0 : 1}"></i>
                                <span class="l-t">{{ item.title }}</span>
                            </span>
                            <span class="r">{{ getTime(item.createTime) }}</span>
                        </div>
                        <p class="b" v-html="item.content"></p>
                    </div>

                </mt-cell-swipe>
            </template>
        </div>
        <!-- 无数据 -->
        <img v-show="messageData && !list.length" class="no-data" :src="require('../../../assets/images/img_zw.png')" alt="">
    </div>
</template>
<script>
    export default {
        data() {
            return {
                title: this.$route.query.title,
                htmlDom: '<div class="bg"></div>',
                messageData: '',
                list: [],
                messageType: this.$route.query.messageType, // 消息类型：1系统公告;2供应链助手;3订单助手;4补货提醒
                loading: false,
                pageIndex: 1,
                pageSize: 11
            }
        },
        created() {
            this.queryMessage();
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            getTime(time) {
                let nowTime = new Date();
                let toDay = nowTime.Format('MM月dd日');
                let yesterDay = new Date(nowTime.getTime() - 24 * 60 * 60 * 1000 ).Format('MM月dd日');
                let createTime = new Date(Number(time)).Format('MM月dd日');
                if (toDay === createTime) {
                    return new Date(Number(time)).Format('hh:mm');
                } else if(yesterDay === createTime) {
                    return '昨天' + new Date(Number(time)).Format('hh:mm');
                } else{
                    return createTime;
                }
            },
            queryMessage() {
                this.loading = true;
                Indicator.open();
                let params = {
                    // messageRead: true,
                    messageType: this.messageType,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }
                axios.post(this.blockURL+'/qypfs-message/api/message/list', params).then(res => {
                    Indicator.close();
                    console.log(res, 'messageCenter');
                    let data = res.data.data;

                    if(res.data.code == 200) {
                        this.messageData = data;
                        this.list = this.list.concat(data.list);
                        this.pageIndex += 1;
                        if (this.pageIndex <= data.totalPage) this.loading = false;
                    } else {
                        Toast(res.data.message || '系统错误')
                    }
                }).catch(error =>{
                    Indicator.close();
                })

            },
            // 标记为已读
            del(item) {
                if (item.messageRead) return;
                Indicator.open();
                let params = {
                    messageId: item.messageId
                }
                axios.get(this.blockURL + '/qypfs-message/api/message/read',{ params: params }).then(res =>{
                    console.log('read', res);
                    if (res.data.code == 200 && res.data.data) {
                        item.messageRead = true;
                        Toast('操作成功');
                    } else {
                        Toast(res.data.message)
                    }
                    Indicator.close();
                }).catch(error =>{
                    Indicator.close();
                })
            },
            goDetail(item) {
                this.$router.push({
                    path: '/block/messageDetail',
                    query: {
                        messageId: item.messageId
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .list-box /deep/ .mint-cell:last-child{
        background: 0 none;
    }
    .list-box /deep/ .mint-cell-wrapper{
        background: 0 none;
        border: 0 none;
    }
    .list-box /deep/ .mint-cell-title{
        max-width: 100%;
    }
    .list-box /deep/ .bg{
        width: 2.5rem;
        height: 2.71rem;
        background: url('../../../assets/images/block/icon-read.png');
        background-size: 2.5rem 2.71rem;
    }
    .msg-list{
        background: #fff;
        height: 100vh;
        overflow-y: auto;
        position: relative;
    }
    .msg-list .no-data{
        width: 60%;
        display: block;
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translate(-50%, -50%);
    }

    .list-box{
        padding-top: 1.7rem;
    }
    .list-box .list-item{
        height: 2.61rem;
        padding: 0.1rem 1px;
        border-bottom: 1px solid #E6E6E6;
    }
    .list-box .list-item .t{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .list-box .list-item .t .l{
        font-size: .585rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(52,52,52,1);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 82%;
        padding-top:0.1rem;
    }
    .list-box .list-item .t .l .l-t{
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .list-box .list-item .t .l i{
        display: inline-block;
        width: .3rem;
        height: .3rem;
        border-radius: 50%;
        background: red;
        margin-right: .17rem;
    }
    .list-box .list-item .t .r{
        font-size: .5rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .list-box .list-item .b{
        font-size: .5rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-top: .28rem;
        max-height: 0.5rem;
        padding-left: .5rem;
    }

</style>
