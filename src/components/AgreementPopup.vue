<template lang="html">
    <div class="agreement">
        <mt-popup v-model="show" :closeOnClickModal="false">
            <div class="agreement-con">
                <p class="agreemnt-title">用户协议</p>
                <div class="agreement-main">
                    <div v-if="userType == 3 || userType == 4">
                        <partner1080 v-if="type == 0"></partner1080>
                        <Partner1825 v-if="type == 2"></Partner1825>
                        <Partner3888 v-if="type == 3"></Partner3888>
                        <PartnerPoints v-if="type == 1"></PartnerPoints>
                    </div>
                    <div v-else-if="userType == 2||userType == 8||userType == 6">
                        <Ordinary1080 v-if="type == 0"></Ordinary1080>
                        <Ordinary1825 v-if="type == 2"></Ordinary1825>
                        <Ordinary3888 v-if="type == 3"></Ordinary3888>
                        <OrdinaryPoints v-if="type == 1"></OrdinaryPoints>
                    </div>
                    <div v-else-if="userType == 7">
                        <Agent></Agent>
                    </div>
                    <business v-else></business>
                </div>
                <button type="button" name="button" class="agreement-button" @click="knows">知道了</button>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import Partner1080 from "@/pages/Agreement/Partner1080.vue";
import Partner1825 from "@/pages/Agreement/Partner1825.vue";
import Partner3888 from "@/pages/Agreement/Partner3888.vue";
import PartnerPoints from "@/pages/Agreement/PartnerPoints.vue";
import Ordinary1080 from "@/pages/Agreement/Ordinary1080.vue";
import Ordinary1825 from "@/pages/Agreement/Ordinary1825.vue";
import Ordinary3888 from "@/pages/Agreement/Ordinary3888.vue";
import OrdinaryPoints from "@/pages/Agreement/OrdinaryPoints.vue";
import Agent from "@/pages/Agreement/Agent.vue";
import business from "@/pages/Agreement/business.vue";
export default {
    props:["show","type"],
    data () {
        return {
            userType:"",
            nowShow:false
        }
    },
    components:{
        Partner1080,
        Partner1825,
        Partner3888,
        PartnerPoints,
        Ordinary1080,
        Ordinary1825,
        Ordinary3888,
        OrdinaryPoints,
        Agent,
        business
    },
    mounted(){
        this.getUserType();
    },
    methods:{
        // 获取用户类型
        getUserType(){
            this.userType = sessionStorage.getItem("userType");
        },
        knows(){
            this.$emit("changeShow",this.nowShow);
        }
    }
}
</script>

<style lang="css" scoped>
.agreement .mint-popup{
    width:90%;
    height:90%;
    border-radius:5px;
    overflow:auto;
}
.agreement .agreemnt-title{
    text-align:center;
    font-size:.6667rem;
    height:1.7778rem;
    line-height: 1.7778rem;
    border-bottom:1px solid #ccc;
}
.agreement .agreement-button{
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:1.7778rem;
    font-size:.6667rem;
    border:0 none;
    border-top:1px solid #ccc;
    outline-style: none;
    background-color:transparent;
}
.agreement .agreement-con{
    height:100%;
}
.agreement .agreement-main{
    height:calc(100% - 3.5556rem);
    overflow:scroll;
    -webkit-overflow-scrolling: touch;
    padding:0 .5333rem;
    font-size:.5778rem;
}
.agreement .agreement-main h1,.agreement .agreement-main h2{
    font-size:.5778rem !important;
}
</style>
