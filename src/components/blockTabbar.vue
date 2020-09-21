<template>
    <div >
        <div class="nav-box Two" >
            <!-- indexUrl -->
            <router-link to="/block/blockIndex" class="nav-item" :class="myStoreNav() ? 'router-link-active':''" >
               <div>
                   <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="myStoreNav()">
                   <div class="img-box homeT"><div>首</div></div>
                   <div class="nav-text">
                       <span v-if="Blocktype == 5">{{ business == 1 ? '首页' : '我的店铺' }}</span>
                       <span v-else>首页</span>
                   </div>
               </div>
            </router-link>

            <template v-if='Blocktype == 5 && this.$store.state.userInfo.business'>
                <router-link   :to="business == 1 ?'/block/blockMyorder' : '/block/orderManage'" class="nav-item" :class="OrderNav()? 'router-link-active':''">
                    <div>
                        <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="OrderNav()">
                        <div class="img-box ddT"><div>订</div></div>
                        <div class="nav-text">
                            <span>{{ business == 1 ? '我的订单' : '订单管理' }}</span>
                        </div>
                    </div>
                </router-link>
                <router-link :to="business == 1 ? '/blockShoppingCart' : '/block/GoodsManagement'" class="nav-item">
                    <div>
                        <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="shopping()">
                        <div class="img-box spT"><div>{{ business == 1 ? '购' : '商' }}</div></div>
                        <div class="nav-text">
                            <span>{{ business == 1 ? '购物车': '商品管理' }}</span>
                        </div>
                    </div>
                </router-link>
            </template>

            <template v-if='Blocktype == 6'>
                <router-link   to="/block/blockMyorder" class="nav-item" :class="OrderNav()? 'router-link-active':''">
                    <div>
                        <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="OrderNav()">
                        <div class="img-box ddT"><div>订</div></div>
                        <div class="nav-text">
                            <span>我的订单</span>
                        </div>
                    </div>
                </router-link>
                <router-link to="/blockShoppingCart" class="nav-item">
                    <div>
                        <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="shopping()">
                        <div class="img-box spT"><div>购</div></div>
                        <div class="nav-text">
                            <span>购物车</span>
                        </div>
                    </div>
                </router-link>
            </template>

            <!--区域批发商-->
            
            <router-link v-if="Blocktype == 6" to='/block/userinfo' class="nav-item" :class="storeNav() ? 'router-link-active':''" >
               <div>
                   <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="storeNav()">
                   <div class="img-box dpT"><div>我</div></div>
                   <div class="nav-text">
                       <span>个人中心</span>
                   </div>
               </div>
            </router-link>

            <router-link v-else to='/block/storeManagement' class="nav-item" :class="storeNav() ? 'router-link-active':''" >
               <div>
                   <img :src="require('../assets/images/tabicon.png')" alt="" class="icon" v-if="storeNav()">
                   <div class="img-box dpT"><div>我</div></div>
                   <div class="nav-text">
                       <span>个人中心</span>
                   </div>
               </div>
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {
        props:['Wseq'],
        data () {
            return {
                path:'',
                indexUrl:'',
                userInfo :this.$store.state.userInfo,
                Blocktype:this.$store.state.userInfo.Blocktype, // 当前角色的身份
                business: this.$store.state.userInfo.business, // 区域批发商 1买 2 卖
            }
        },
        created(){
            console.log("business===", this.$store.state.userInfo.business);
            // 判断路由选中相应的底部导航
            var that = this;
            function active(){
                var timer = setTimeout(()=>{
                    let Wseq = sessionStorage.getItem('Wseq');
                    if(Wseq){
                        that.indexUrl = '/block/wholesaleIndex?from=areaWholesaler&wholesaler='+Wseq;
                        clearTimeout(timer)
                    }else{
                        active()
                    }
                },100)
            }
            active()
        },
        mounted(){

        },
        watch:{
            '$store.state.userInfo.Blocktype'(){
                this.Blocktype = this.$store.state.userInfo.Blocktype
            }
        },
        methods:{
            myStoreNav(){
                this.path = this.$route.path
                if(this.path === '/block/blockIndex'){
                    return true;
                }else{
                    return false;
                }
            },
            shopping(){
                this.path = this.$route.path
                if(this.path === '/blockShoppingCart' || this.path === '/block/GoodsManagement'){
                    return true;
                }else{
                    return false;
                }
            },
            OrderNav(){
                this.path = this.$route.path
                if(this.path === '/block/blockMyorder' || this.path === '/block/orderManage'){
                        return true;
                }else{
                    return false;
                }
            },
            storeNav(){
                this.path = this.$route.path
                if(this.path === '/block/storeManagement' || this.path === '/supplier' || this.path === '/shoppingCart' || this.path === '/wholesale/invitation'){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }
</script>
<style>

</style>

<style scoped>
    .nav-box{
        position:fixed;
        bottom:0;
        left:0;
        display:flex;
        justify-content: space-between;
        width:100%;
        height:55px;
        background-color:#fff;
        border-top:.0444rem solid #ccc;
        padding:.2222rem 0;
        box-sizing:border-box;
        z-index: 9;
    }
    .nav-item{
        flex:1;
        text-align:center;
    }
    .nav-item>div{
        position: relative;
    }
    .nav-item .img-box{
        display:block;
        width:24px;
        height:24px;
        margin:0 auto 5px;
        background-position:center;
        background-repeat:no-repeat;
        background-size:contain;
    }
    .nav-item .home{
        background-image:url('../assets/images/wholesale/nav/dpgl_icon.png');
    }
    .nav-item .dd{
        background-image:url('../assets/images/wholesale/nav/ddgl_icon.png');
    }
    .nav-item .sp{
        background-image:url('../assets/images/wholesale/nav/spgl_iocn.png');
    }
    .nav-item .yh{
        background-image:url('../assets/images/wholesale/nav/yhgl_icon.png');
    }
    .nav-item .dp{
        background-image:url('../assets/images/wholesale/nav/store.png');
    }
    .Two .nav-item .img-box{
        width:1.3rem;
        height: 1.3rem;
        margin:0 auto 0;
    }
    .nav-item .homeT,.nav-item .dpT,.nav-item .ddT,.nav-item .spT,.nav-item .yhT{
        background:linear-gradient(-38deg,rgba(245,85,89,1),rgba(252,184,64,1),rgba(249,98,81,1));
        box-shadow:0px 0.05rem 0.1rem 0.03rem rgba(246,193,250,1);
        border-radius:50%;
        font-size:0.66rem;
        line-height:1.14rem;
        font-family:PingFang SC;
        font-weight:600;
        color:rgba(255,255,255,1);
        position: relative;
    }
    .nav-item .homeT div,.nav-item .dpT div,.nav-item .ddT div,.nav-item .spT div,.nav-item .yhT div{
        position: absolute;
        margin-top:5%;
        margin-left:5%;
        width:90%;
        height:90%;
        background:linear-gradient(-38deg,rgba(218,53,199,1),rgba(244,78,129,1),rgba(255,228,0,1));
        border-radius:50%;
    }
    .nav-item .nav-text{
        font-size:12px;
        color:#5c5f6a;
        font-family: "Microsoft YaHei", arial
    }
    .router-link-active{
        position: relative;
    }
    .router-link-active .icon{
        position: absolute;
        top: -0.25rem;
        margin: 0 auto;
        width: 0.7rem;
        left: 50%;
        transform: translateX(-50%);
        height: 0.5rem;
        z-index: 100;
    }
    .nav-box .router-link-active .nav-text{
        color:rgba(255,96,35,1)
    }
    .nav-box .router-link-active .home{
        background-image:url('../assets/images/wholesale/nav/dpgl_icon2.png');
    }
    .nav-box .router-link-active .dd{
        background-image:url('../assets/images/wholesale/nav/ddgl_icon2.png');
    }
    .nav-box .router-link-active .sp{
        background-image:url('../assets/images/wholesale/nav/spgl_iocn2.png');
    }
    .nav-box .router-link-active .yh{
        background-image:url('../assets/images/wholesale/nav/yhgl_icon2.png');
    }
    .nav-box .router-link-active .dp{
        background-image:url('../assets/images/wholesale/nav/store2.png');
    }
    .nav-box .router-link-active .homeT,.nav-box .router-link-active .ddT,.nav-box .router-link-active .spT,.nav-box .router-link-active .yhT,.nav-box .router-link-active .dpT{
        background:linear-gradient(-38deg,rgba(216,99,193,1),rgba(132,218,230,1),rgba(160,100,250,1));
        box-shadow:0px 0.05rem 0.1rem 0.03rem rgba(168,83,252,0.5);
    }
    .nav-box .router-link-active .homeT div,.nav-box .router-link-active .ddT div,.nav-box .router-link-active .spT div,.nav-box .router-link-active .yhT div,.nav-box .router-link-active .dpT div{
        background:linear-gradient(-38deg,rgba(130,104,252,1),rgba(159,75,250,1),rgba(221,28,251,1));
    }

</style>
