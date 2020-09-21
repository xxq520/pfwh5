<template>
    <div class="noticeDetails">
        <mt-header title="通知">
            <div slot='left' @click="back">
                <mt-button icon='back'></mt-button>
            </div>
        </mt-header>
        <div class="noticeList" v-if="content">
            <span class="time">{{formatTime(content.retTime)}}</span>
            <ul>
                <li>
                    <span class="type">【{{content.retTitle}}】</span>
                    <p class="con">{{content.retContent}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return  {
            content: {}
        }
    },
    methods: {
        getNoticeDetail(id) {
            const seq = sessionStorage.getItem("seq");
            axios.get(this.URL + '/User/GetDetails',{params:{seq: seq,titleId: id}})
            .then(res => {
                this.content = res.data.retModel;
            })
        },
        back() {
            this.$emit('hide', 1)
        },
        formatTime(val) {
            var d = new Date(val);
            var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            return times;
        }
    },
    watch: {
        id: {
        　　handler(newVal, oldVal) {
                this.getNoticeDetail(newVal)
        　　},
        　　immediate: true
        }
    }
}
</script>

<style scoped>
    .noticeDetails  {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: #f5f5f5;
    }
    .noticeList li{
        background: #fff;
        margin-top: .4444rem /* 20/45 */;
        padding: 0 .5333rem /* 24/45 */;
    }
    .noticeList li .type {
        font-size: .6667rem /* 30/45 */;
        line-height: .6667rem /* 30/45 */;
    }
    .noticeList li .con {
        font-size: .5333rem /* 24/45 */;
        color: #999;
        padding: .4889rem /* 22/45 */ 0 .5778rem /* 26/45 */;
    }
    .time {
        font-size: .4444rem /* 20/45 */;
        background: #e1e1e1;
        border-radius: .4rem /* 18/45 */;
        width: 4.8889rem /* 220/45 */;
        height: .8rem /* 36/45 */;
        line-height: .8rem /* 36/45 */;
        display: block;
        margin: .4444rem /* 20/45 */ auto;
        text-align: center;
        color: #fff;
    }
</style>

