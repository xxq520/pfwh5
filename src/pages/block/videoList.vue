<template>
    <div class="store-management">
        <mt-header title="视频教程" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div  class="fn-list">
            <p class="tem-tit">发展关系</p>
            <div class="fn-item" v-for="(item,index) in videoList">
                <router-link :to="'/block/video?id='+index" class="links">
                    <span class="fn-item-title">{{item}}</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import blockTabbar from '@/components/blockTabbar'
    import share from "@/components/share"
    import {Toast, Indicator} from 'mint-ui';
    import {setCookie} from '../../assets/js/common';
    import wx from 'weixin-sdk-js';
    import {mapActions} from 'vuex'
    export default {
        data() {
            return {
                videoList: [
                    '批发网用户如何生成供应链新批发角色？',
                    '供应链新批发管理角色如何发展其他统筹官关系',
                    '区域批发商如何订货的呢？',
                    '区域批发商如何发展下游商家的呢？',
                    '区域批发商如何上架商品的呢？',
                    '区域统筹管如何统筹区域批发商呢？',
                    '发展商如何发展区域批发商呢？'
                ]
            }
        },
        components: {
        },
        created() {

        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff"
        },
        watch: {
        },
        methods: {
            goBack(){
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
        }
    }
</script>
<style scoped>
    .fn-list {
        margin-top: 54px;
        background-color: #fff;
        padding-bottom: 0.2rem;
    }
    .fn-list .tem-tit{
        padding: 0 .4rem;
        padding-top: 0.2rem;
        font-size: .8rem;
        font-family: 'Heiti SC', 'Microsoft YaHei';
        font-weight: bold;

    }

    .fn-item {
        background-color: #fff;
        position: relative;
        height: 1.5rem;
        line-height: 1.5rem;
        border-bottom: .0222rem solid rgba(204, 204, 204, .9);
        padding: 0 1.2444rem 0 .5333rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.2rem;
    }

    .fn-item:after {
        display: block;
        content: "";
        position: absolute;
        right: .5333rem;
        top: 52%;
        margin-top: -.2222rem;
        width: .3556rem;
        height: .3556rem;
        transform: rotate(45deg);
        border-top: .0222rem solid #666;
        border-right: .0222rem solid #666;
    }

    .fn-item:last-child {
        border: 0;
    }

    .fn-item .links {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .fn-item span {
        font-size: .6222rem;
    }

    .fn-item .fn-item-title {
        color: #212121;
    }

    .fn-item .fn-item-con {
        color: #888;
    }

    .fn-item3 img {
        margin-top: 0.3rem;
        width: 2.4rem;
        height: 2.4rem;
    }

    .user-con img {
        float: left;
        width: 2.2222rem;
        height: 2.2222rem;
    }

    .user-con span {
        float: left;
        font-size: .6667rem;
        margin-left: .6rem;
    }

    .WholesaleAddress .fn-item-con {
        flex: 1.5;
        padding-left: 1.1111rem;
        line-height: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
</style>
