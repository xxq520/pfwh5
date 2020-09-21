<template>
    <div class="user-management">
        <mt-header title="视频教程" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="container video">
            <video id="video" class="videoSrc" controls="" preload="auto" data-setup="{}"  :src="video[num]">
                <source type="video/mp4" >
            </video>
            <div v-if="ua=='ios'" class="model" @click="playVideo"></div>
        </div>
    </div>
</template>
<script>
    import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
    import {
        showToast
    } from '@/assets/js/common.js';
    import {Toast, Indicator,MessageBox} from 'mint-ui';

    export default {
        data() {
            return {
                // 视频源
                video: [
                    "http://ndhimg.520shq.com/sp/azjczsz/video/quyupifa1.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/quyupifa2.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/qypf/ding_huo.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/qypf/fa_zhan.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/qypf/shang_pin.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/qypf/tong_chou.mp4",
                    "http://ndhimg.520shq.com/sp/azjczsz/video/fazhanquyupifas.mp4"
                ],
                // 播放视频的下标
                num: 0,
                // 设备标识
                ua: ""
            }
        },
        created() {
            var query = this.$route.query;
            this.num = query.id;
            var script = document.createElement("script");
            script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js";
            document.body.appendChild(script);
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) != 'micromessenger') { // 微信浏览器判断
                if (ua.match(/iPhone/i) != null) {
                    this.ua = 'ios'
                }
            }
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        methods: {
            playVideo() {
                var that = this;
                try {
                    window.action.playVideo(that.video[that.num]);
                }catch (e) {
                    var video = document.getElementById("video");
                    if (video.paused){
                        video.play()
                    } else {
                        video.pause()
                    }
                }
            },
            goBack(){
                history.go(-1);
            },
        }
    }

</script>
<style scoped>
    .model{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .video{
        margin-top: 2rem;
        position: relative;
        min-height: 200px;
    }
    .video video{
        margin-top: 0.2222rem;
        width: 100%;
        border-radius: 4px;
        border:1px solid #ddd;
    }
</style>
