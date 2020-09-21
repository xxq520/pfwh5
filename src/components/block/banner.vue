<template lang="html">
    <!-- 邀请区域批发商需要展示海报 3.0.1需求 -->
    <div v-if="showBanner" class="banner">
        <img class="bannerBg" :src="isIOS ? 'http://dfs2.520shq.com:80/group1/M00/07/DB/wKgAC19YLDmATgmTABzcll7Hr8o713.png' : 'http://dfs2.520shq.com:80/group1/M00/07/DB/wKgAC19YKvaANpu8AAxhCE3KyXQ690.png'"
             alt="">
        <p class="bannerBtn" @click="goBack"></p>
    </div>
</template>

<script>

    export default {
        props: ["showBanner"],
        data() {
            return {
                isIOS: false, // 是否是ios
            }
        },
        mounted() {
            let that = this;
            this.isIPhoneX();
            // 监听屏幕宽度变化
            window.onresize = function(){
                console.log(123)
                that.isIPhoneX()
            };
        },
        methods: {
            // 获取当前设备是否是ios设备
            isIPhoneX(fn) {
                var u = navigator.userAgent;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isIOS) {
                    this.isIOS = (screen.height == 812 && screen.width == 375) ? true : false;
                }
            },
            // 点击立即申请按钮
            goBack() {
                this.$emit("update:showBanner", false);
            },
        }
    }
</script>

<style scoped>
    .banner {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 5000;
        background: #01015e;
        box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 28, 0.29);
    }

    .banner .bannerBg {
        width: 100%;
        max-height: 100%;
    }

    .bannerBtn {
        position: absolute;
        bottom: 0;
        width: 100vw;
        height: 8rem;
        z-index: 50001;
    }
</style>
