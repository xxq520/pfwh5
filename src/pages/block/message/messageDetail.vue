<template>
    <div class="msg-detail">
        <!-- 导航 -->
        <mt-header fixed title="消息详情" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div class="t">
            <span class="l">{{ messageDetail.title }}</span>
            <span class="r" v-if="messageDetail.createTime">{{ getTime(messageDetail.createTime) }}</span>
        </div>
        <p class="b" v-html="messageDetail.content"></p>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                messageDetail: ''
            }
        },
        created() {
            this.getMessage();
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
            // 消息详情
            getMessage() {
                Indicator.open();
                let params = {
                    messageId: this.$route.query.messageId
                }
                axios.get(this.blockURL + '/qypfs-message/api/message/get',{ params: params }).then(res =>{
                    console.log('read', res);
                    if (res.data.code == 200 && res.data.data) {
                        let data = res.data.data
                        this.messageDetail = data;
                        if (!data.messageRead) this.del();
                    } else {
                        Toast(res.data.message)
                    }
                    Indicator.close();
                }).catch(error =>{
                    Indicator.close();
                })
            },
            // 标记为已读
            del() {
                let params = {
                    messageId: this.$route.query.messageId
                }
                axios.get(this.blockURL + '/qypfs-message/api/message/read',{ params: params }).then(res =>{
                    if (res.data.code == 200 && res.data.data) {
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
        }
    }
</script>
<style coped>
    .msg-detail{
        height: 100vh;
        background: #fff;
        overflow-y: scroll;
    }
    .msg-detail .t{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2.4rem .5rem .26rem .5rem;
    }
    .msg-detail .t .l{
        font-size: .585rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(52,52,52,1);
        display: inline-block;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .msg-detail .t .r{
        font-size: .5rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .msg-detail .b{
        /* text-indent: 2em; */
        font-size: .5rem;
        font-family: PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height: .78rem;
        padding: 0 .5rem;
    }
</style>
