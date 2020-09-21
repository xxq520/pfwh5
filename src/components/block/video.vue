<template lang="html">
 <div class="videoBox" v-show="showVideo">
     <mt-header title="视频播放" ref="header" :fixed='true'>
         <mt-button icon="back" slot="left" @click="goBack"></mt-button>
     </mt-header>
     <div class="video">
         <video id="video" ref="playvideo" class="videoSrc" controls="" preload="auto" data-setup="{}" :src="videoSrc"></video>
     </div>
 </div>
</template>

<script>
export default {
    props:["videoSrc","showVideo"],
    data () {
        return {
        }
    },
    methods:{
        goBack() {
            this.$emit("update:showVideo",false);
        }
    },
    mounted() {
        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff"
        this.$refs.header.$el.style.zIndex = "10000"
    },
    watch: {
        // 监听显示隐藏播放
        showVideo: function(newVal) {
            if (newVal == true) {
                this.$refs['playvideo'].play();
            } else {
                this.$refs['playvideo'].pause();
            }
        }
    },
    computed:{
    }
}
</script>

<style lang="css" scoped>
    .videoBox{
        background: #000;
        position: fixed;
        z-index: 1000;
        width: 100%;
        height: 100%;
    }
    .video{
        background: #000;
        position: fixed;
        z-index: 1000;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .video video{
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
        display: block;
        margin-top: 44px;
    }
</style>
