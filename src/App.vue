<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex";

    export default {
        name: "App",
        data() {
            return {
            };
        },
        methods: {
            ...mapActions(["saveRole"]),
            getUserInfo() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then(res => {
                    if (res.data.code == 200) {
                        this.saveRole(data);
                    }
                });
            },
        },
        created() {
            //保存用户的数据到vuex中不会被销毁
            if (sessionStorage.getItem("userInfo")) {
                this.saveRole(JSON.parse(sessionStorage.getItem("userInfo")));
            }
            if (sessionStorage.getItem("storeId")) {
                this.$store.commit("saveStoreId", Number(sessionStorage.getItem("storeId"))
                );
            }
            //在页面刷新时将vuex里的信息保存到sessionStorage里
            window.addEventListener("beforeunload", () => {
                //保存用户的身份登录态  userBlock为区域批发商的登录状态
                sessionStorage.setItem("userBlock", this.$store.state.userBlock);
                sessionStorage.setItem("userInfo", JSON.stringify(this.$store.state.userInfo));
                sessionStorage.setItem("storeId", this.$store.state.storeId);
            });

        },
    };

</script>

<style>
    .alert{
        z-index: 10000;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 0.15s;
        width: 100vw;
        position: absolute;
    }

    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-to,
    .slide-left-leave-to {
        display: none;
    }

</style>
