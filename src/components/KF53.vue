<template>
    <div class="kf-con" id="kf-con" v-drag>
        <div v-drag class="kf-img" @click="tokefu" >
            <img src="@/assets/images/kefu-icon.png" alt="">
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return{
                mobile:sessionStorage.getItem("mobile"),
                userName:sessionStorage.getItem("shopName"),
                positionX:0,
                positionY:0,
            }
        },
        methods: {
            tokefu(){
                this.$router.push({path:'/notice'});
            }
        },
        directives: {
            drag: {
                // 指令的定义
                bind: function (el) {
                    let odiv = el;   //获取当前元素
                    console.log(11111)
                    odiv.onmousedown = (e) => {
                        console.log(22222)
                        //算出鼠标相对元素的位置
                        let disX = e.clientX - odiv.offsetLeft;
                        let disY = e.clientY - odiv.offsetTop;

                        document.onmousemove = (e) => {
                            console.log(3333)
                            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                            let left = e.clientX - disX;
                            let top = e.clientY - disY;

                            //绑定元素位置到positionX和positionY上面
                            this.positionX = top;
                            this.positionY = left;

                            //移动当前元素
                            odiv.style.left = left + 'px';
                            odiv.style.top = top + 'px';
                        };
                        document.onmouseup = (e) => {
                            console.log(44444)
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    };
                }
            }
        },
        mounted() {}
    }
</script>
<style>
    .kf-con .kf-img{
        position:fixed;
        top:70%;
        right:.5rem;
        margin-top:-1rem;
        width:2rem;
        height:2rem;
        z-index: 100;
    }
</style>
