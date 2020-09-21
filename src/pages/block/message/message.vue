<template>
    <div class="message">
        <!-- 导航 -->
        <mt-header fixed title="消息中心" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <!-- 内容 -->
        <template v-for="(item, idx) in listData">
            <div class="msg-item"  :key="idx" @click="goList(item)">
                <div class="img-box">
                    <img class="l" :src="require(`../../../assets/images/block/${item.icon}`)" alt="">
                    <span v-if="messageData[item.messageType] && messageData[item.messageType].unreadCount">
                        {{ messageData[item.messageType].unreadCount > 9 ? '9+' :  messageData[item.messageType].unreadCount}}
                    </span>
                </div>
                <div class="r">
                    <p class="t">{{ item.title }}</p>
                    <p class="b" v-if="messageData[item.messageType]" v-html="messageData[item.messageType].content"></p>
                    <p class="b" v-else>暂无数据</p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
// 消息类型：1系统公告;2供应链助手;3订单助手;4补货提醒
let listData = [
    {
        icon: 'icon-system.png',
        title: '系统公告',
        messageType: 1
    },{
        icon: 'icon-supply.png',
        title: '供应链助手',
        messageType: 2
    },{
        icon: 'icon-order.png',
        title: '订单助手',
        messageType: 3
    },{
        icon: 'icon-remind.png',
        title: '补货提醒',
        messageType: 4
    },
]
export default {
    data() {
        return {
            listData: listData,
            messageData: ''
        }
    },
    created() {
        // this.test2();
    },
    mounted() {
        let token = this.$route.query.token;
        if (token) {
            sessionStorage.setItem("bearer", token);
            this.queryMessage();
        } else {
            this.queryMessage();
        }

        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff";
    },
    methods: {
        test2() {
            let params = {
                "title": "这是一条供应链助手消息",
                "content": "尊敬的新供应链用户，新年好！感谢你们一直以来的支持和信,感谢你们一直以来的支持和信",
                "userId": 7798
            }
            axios.post(this.blockURL+'/qypfs-message/api/message/c/sc/assistant', params).then(res => { })
        },
        back() {
            try {
                window.action.app_back();
            } catch (err) {
                this.$router.go(-1);
            }
        },
        queryMessage() {
            Indicator.open();
            axios.post(this.blockURL+'/qypfs-message/api/message/messageCenter', { }).then(res => {
                Indicator.close();
                console.log(res, 'messageCenter');
                if(res.data.code == 200 && res.data.data) {
                    let list = res.data.data.list;
                    let messageData = { };
                    list.forEach((item, idx) => {
                        messageData[item.messageType] = item;
                    });
                    this.messageData = messageData;
                } else {
                    Toast(res.data.message || '系统错误')
                }
            }).catch(error =>{
                Indicator.close();
            })
        },
        goList(item) {
            console.log('跳转');
            this.$router.push({
                path: '/block/messageList',
                query: {
                    title: item.title,
                    messageType: item.messageType
                }
            })
        }
    }
}
</script>
<style scoped>
    .message{
        padding-left: .5rem;
        padding-top: 1.84rem;
        background: #fff;
        height: 100vh;
        overflow-y: auto;
    }
    .msg-item{
        height: 4rem;
        width: 100%;
        border-bottom: 1px solid #E6E6E6;
        display: flex;
        align-items: center;
    }
    .msg-item .img-box{
        position: relative;
        width: 2.3rem;
        height: 2.3rem;
    }
    .msg-item .img-box span{
        position: absolute;
        top: -3%;
        right: -3%;
        width: .74rem;
        height: .74rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .459rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        background: #FF0000;
        transform: scale(.95);
    }
    .msg-item .img-box .l{
        width: 100%;
        height: 100%;
    }
    .msg-item .r{
        display: flex;
        flex: 1;
        flex-direction: column;
        padding-left: .625rem;
        padding-right: .38rem;
        max-width: 83.5%;
    }
    .msg-item .r .t{
        font-size: .667rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(52,52,52,1);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .msg-item .r .b{
        font-size: .584rem;
        line-height: .68rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        margin-top: .2rem;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        max-height: 1.3rem;
        -webkit-box-orient: vertical;
    }
</style>
