<!--
 * author Robert 20200828
 * loadingGif组件--"数据请求中"
 * 使用方法：
 * <loading-gif :show-loading="showLoaddingGif" title="加载中"></loading-gif>
 *  通过修改showLoaddingGif的true或者false 来控制loading的显示和隐藏!
 -->
<template>
   <div class="loadingBox" v-if="showLoading">
       <div class="loadEffect">
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
       </div>
       <p>{{title}}</p>
   </div>
</template>

<script>
    export default {
        props: ["showLoading","title"]
    }
</script>

<style scoped>
    .loadingBox {
        display: flex;
        align-items: center;
        width: 100%;
        height: 2rem;
        justify-content: center;
    }
    .loadingBox >p{
        font-size: 0.68rem;
        color: #7d7d7d;
    }
    .loadEffect{
        width: 1.2rem;
        height: 1.2rem;
        position: relative;
        margin-right: 0.6rem;
    }
    .loadEffect span{
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 50%;
        background: #7d7d7d;
        position: absolute;
        -webkit-animation: load 0.8s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    .loadEffect span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-0.08rem;
        -webkit-animation-delay:0.13s;
    }
    .loadEffect span:nth-child(2){
        left: 0.15rem;
        top: 0.15rem;
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3){
        left: 50%;
        top: 0;
        margin-left: -0.1rem;
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4){
        top: 0.15rem;
        right:0.15rem;
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-0.1rem;
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6){
        right: 0.15rem;
        bottom:0.15rem;
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7){
        bottom: 0;
        left: 50%;
        margin-left: -0.1rem;
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8){
        bottom: 0.12rem;
        left: 0.15rem;
        -webkit-animation-delay:1.04s;
    }
</style>
