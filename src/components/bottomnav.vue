<template>
    <mt-tabbar v-model="selected" class="bottomnav">
        <mt-tab-item id="首页" @click.native.capture="indexfn">
            <span slot="icon" class="bottom-icon" :class="{'iconhover':selected=='首页'}"><i class="icon-huiyuan"></i></span>
            <span class="bottom-text" :class="{'tabhover':selected=='首页'}">首页</span>
        </mt-tab-item>
        <mt-tab-item id="我的订单" @click.native.capture="myorder">
            <span slot="icon" class="bottom-icon" :class="{'iconhover':selected=='我的订单'}"></span>
            <span class="bottom-text" :class="{'tabhover':selected=='我的订单'}">我的订单</span>
        </mt-tab-item>
        <mt-tab-item id="购物车" @click.native.capture="shoppingCart">
            <span slot="icon" class="bottom-icon" :class="{'iconhover':selected=='购物车'}">
                <p v-if="list || list!=0"><i>{{ list }}</i></p>
            </span>
            <span class="bottom-text" :class="{'tabhover':selected=='购物车'}">购物车</span>
        </mt-tab-item>
        <mt-tab-item id="个人中心" @click.native.capture="mineindex">
            <span slot="icon" class="bottom-icon" :class="{'iconhover':selected=='个人中心'}"></span>
            <span class="bottom-text" :class="{'tabhover':selected=='个人中心'}">个人中心</span>
        </mt-tab-item>
    </mt-tabbar>
</template>

<script>
// carcount改变值刷新底部购物车数量
export default {
    props:['bottom','carcount'],
    data(){
        return{
            selected: this.bottom.index,
            list: 0,
            wholesaler:new Object()
        }
    },
    watch:{
        carcount(val){
           this.GetBuyCarCount(); 
        }
    },
    mounted() {
        if(sessionStorage.Wseq){
            this.wholesaler = sessionStorage.Wseq;
        };
        this.GetBuyCarCount();
    },
    methods:{
        indexfn(){
            this.$router.push({path:'/business',query:{wholesaler:this.wholesaler}});
        },
        myorder(){
            this.$router.push({path:'/myorder'});
        },
        shoppingCart(){
            this.$router.push({name:'shoppingCart',path:'/shoppingCart'});
        },
        mineindex(){
            this.$router.push({name:'mineindex',path:'/mineindex'});
        },
        GetBuyCarCount(){
            axios.get(this.URL + '/OrderNewBuycar/GetBuyCarCount?seq='+sessionStorage.seq).then(res => {
                this.list = res.data
            });
        }
    }
}
</script>

<style scoped>
.bottomnav{
    box-shadow:0 0 0.6rem #cbcbcb;
    position:fixed;
}
.mint-tab-item .bottom-icon{
    position:relative;
    background-image:url('../assets/images/bottom-icon.png');
    background-repeat: no-repeat;
    background-size:100% auto;
    z-index:1;
}
.mint-tab-item .bottom-icon.iconhover{
    background-image:url('../assets/images/bottom-icon-red.png');
}
.mint-tab-item:nth-child(1) .bottom-icon{
    background-position: center -1%;
}
.mint-tab-item:nth-child(2) .bottom-icon{
    background-position: center 33.5%;
}
.mint-tab-item:nth-child(3) .bottom-icon{
    background-position: center 67%;
}
.mint-tab-item:nth-child(4) .bottom-icon{
    background-position: center 102%;
}
.mint-tab-item .bottom-icon p{
    position:absolute;
    left:60%;
    top:-0.27rem;
    background:white;
    padding:3px;
    border-radius:2rem;
    font-size:0.4rem;
    overflow:hidden;
}
.mint-tab-item .bottom-icon p i{
    display:block;
    min-width:1.2em;
    line-height:1.2em;
    border:1px solid red;
    border-radius:2rem;
    padding:0 0.1rem;
    color:red;
}
.bottomnav .bottom-text{
    color:#5c5f6a;
}
.bottomnav .bottom-text.tabhover{
    color:#ff0025;
}
.mint-tabbar > .mint-tab-item.is-selected{
    background:	transparent !important;
}
</style>
