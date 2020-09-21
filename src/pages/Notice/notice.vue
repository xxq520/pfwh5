<template>
    <div class="order">
        <div class="top_nav" >
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="mainBox">
            <img src="http://dfs2.520shq.com/group1/M00/07/BD/wKgAC19I1HaAfG99AAJ2F4Pb1no678.png" alt>
        </div>
        <div class="closesw">
            <span class="closeBtn" @click="closeQuestionBox">联系人工客服</span>
        </div>
    </div>

</template>

<script>
    export default {

        name: "order",
        data() {
            return {

                topnav: {
                    title: '在线客服',
                },
                seq: this.$route.query.seq,
                orderCode: true,
                usre: this.$route.query.mobile

            };
        },
        created() {
            this.seq = this.seq?this.seq:sessionStorage.getItem('seq');
            this.usre = this.usre?this.usre:sessionStorage.getItem('mobile');
            // window.m7CardInfo = {
            // "left": {
            // "url": "https://www.7moor.com/wp-content/uploads/2017/03/publicT_03.png"
            // },
            // "right1": {
            // "text": "紧凑型SUV家庭首选旅行必备家用汽车紧凑型SUV家庭首选旅行必备家用汽车",
            // "color": "#595959",
            // "fontSize": 12
            // },
            // "right2": {
            // "text": "内饰做工精细，外观大气",
            // "color": "#595959",
            // "fontSize": 12
            // },
            // "right3": {
            // "text": "¥169997-210000",
            // "color": "#ff6b6b",
            // "fontSize": 14
            // },
            // "extraInfos": ["随时随地－连接企业与客户"],
            // "url": "https://www.7moor.com/"
            // }
            if (this.seq != null) {
                window.qimoClientId = {
                    userId: this.seq, // 自定义用户的唯一id，不能传空字符串、null、中文，id由字母大小写、数字及'-'和 '_'组成
                    priority: false, //是否优先进线设置，非必填，值为boolean类型的true或false
                    nickName: this.usre, //自定义用户昵称，定义用户昵称则userId必传
                };
            }
            console.log(this.seq,this.usre)
            $.getScript(

                'https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=96771720-740f-11ea-a661-919e3a6d58c6&autoShow=false&language=ZHCN',
            );
        },
        mounted() {
            Indicator.open();
            setTimeout(() => {
                Indicator.close();
            }, 500);
        },
        methods: {
            closeQuestionBox() {
                window.qimoChatClick()
                setTimeout(() => {

                }, 1000);

            },
            goback() {
                try {
                    window.action.app_back();
                } catch (err) {
                    // this.$router.push({path:'/wholesale/storeManagement'})
                    history.go(-1)
                }
            },


        },

    };

</script>

<style scoped>
    .order {
        width: 100%;
        height: 100%;
    }
    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #fff;
        color: #000;
        display: flex;
        line-height: 40px;
        text-align: center;

    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 16px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }


    .mainBox {

        width: 100%;
        height: 80%;
        background-color: #f5f5f5;
        box-sizing: border-box;
        overflow: auto;
        padding: 8%;

    }

    .mainBox img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .closesw {
        width: 100%;
        text-align: center;

    }

    .closeBtn {

        width: 7rem;
        height: 1.4rem;
        text-align: center;
        line-height: 1.4rem;
        color: #ffffff;
        background-color: #ff8624;
        border-radius: .7rem;
        font-size: .6rem;
        padding: 0.2rem 0.4rem;

    }

</style>
