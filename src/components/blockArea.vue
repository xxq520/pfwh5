<template>
    <div>
        <div class="block-area" v-if="isShow==5" v-text="text[business - 1]" @click="navTo"></div>
        <div class="block-area" v-if="isShow==6" @click="navToSupplier">选择店铺</div>
    </div>
</template>
<script>
    export default {
        props:{ },
        data () {
            return {
               isShow: this.$store.state.userInfo.Blocktype,
               text: ['我要卖货', '我要订货'],
               business: this.$store.state.userInfo.business
            }
        },
        created(){

        },
        mounted(){

        },
        watch:{

        },
        methods:{
            navTo(){
                this.$store.commit('changeBus', this.business == 1 ? 2 : 1);
                this.$router.go(0);
            },
            // 跳转选择供应商页面
            navToSupplier() {
                this.$router.push({path:"/block/supplier"});
            }
        }
    }
</script>
<style>

</style>

<style scoped>
   .block-area{
        position: absolute;
        right: 0;
       bottom: -4%;
        width: 2.8rem;
        height: 1.21rem;
        background:rgba(245,67,0,1);
        border-radius: 1.21rem 0 0 1.21rem;
        font-size: .46rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255,255,255,1);
        display: flex;
        justify-content: center;
        align-items: center;
       z-index: 1000;
   }
</style>
