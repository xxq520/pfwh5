<template lang="html">
 <div class="service" v-drag>
     <router-link to="/notice"  class="links" >
         <img src="http://nfxts.520shq.com/localQuickPurchase/distributionApp/images/customer/icon_1.png" alt="">
     </router-link>
 </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {
        }
    },
    directives:{
        // 指令绑定元素，实现拖拽
        'drag':{
            bind: function (el, binding) {
                var touch,disX,disY
                el.ontouchstart = (e) => {
                    touch = e.touches ? e.touches[0] : e;
                    //鼠标位置X减去元素距离左边距离（鼠标到元素左边的距离）
                    disX = touch.clientX - el.offsetLeft;
                    //鼠标位置Y减去距离顶部距离（鼠标到元素顶部的高度）
                    disY = touch.clientY - el.offsetTop;
                }
                el.ontouchmove = (e)=>{
                    touch = e.touches ? e.touches[0] : e;
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let x = touch.clientX - disX;
                    let y = touch.clientY - disY;
                    // 限制可移动距离，不超出可视区域
                    x = x <= 0 ? 0 : x >= innerWidth - el.offsetWidth ? innerWidth - el.offsetWidth : x
                    y = y <= 0 ? 0 : y >= innerHeight - el.offsetHeight ? innerHeight - el.offsetHeight : y
                    //移动当前元素
                    el.style.left = x + 'px';
                    el.style.top = y + 'px';
                    //阻止页面的滑动默认事件
                    e.preventDefault();
                };
            }
        }
    },
}
</script>

<style scoped>
    .service {
        position: fixed;
        right: 0;
        width:2.3rem;
        height: 2.3rem;
        z-index: 1000;
        top: 63%;
    }
    .links{
        width:2.3rem;
        height: 2.3rem;
    }
</style>
