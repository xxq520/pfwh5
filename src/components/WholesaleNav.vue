<template>
    <div >
        <div class="nav-box Two" v-if="userBlock">
            <router-link :to='indexUrl' class="nav-item" :class="myStoreNav() ? 'router-link-active':''">
            <div class="img-box homeT"><div>首</div></div>
            <div class="nav-text">
                <span>我的店铺</span>    
            </div>
            </router-link>
            <router-link to='/wholesale/orderManagement' class="nav-item" :class="OrderNav()? 'router-link-active':''"  v-if='userType != 6&&userType != 7&&userType!=4'>
            <!-- <router-link :to='orderManageUrl' class="nav-item" :class="OrderNav()? 'router-link-active':''" v-if='userType != 7'> -->
                <div class="img-box ddT"><div>订</div></div>
                <div class="nav-text">
                    <span>订单管理</span>    
                </div>   
            </router-link>
            <router-link to='/wholesale/orderManagement' class="nav-item" :class="OrderNav()? 'router-link-active':''"  v-else>
            <!-- <router-link :to='orderManageUrl' class="nav-item" :class="OrderNav()? 'router-link-active':''" v-if='userType != 7'> -->
                 <div class="nav-item" >
                    <div class="img-box ddT"><div>订</div></div>
                    <div class="nav-text">
                        <span>订单管理</span>    
                    </div>   
                </div>
            </router-link>
            <router-link to='/wholesale/goodsManagement' class="nav-item" v-if="(userType != 6&&userType != 7&&userType!=3&&userType!=4)||userBlock">
                <div class="img-box spT"><div>商</div></div>
                <div class="nav-text">
                    <span>商品管理</span>    
                </div>   
            </router-link>
            <div class="nav-item" v-else>
                <div class="img-box spT"><div>商</div></div>
                <div class="nav-text">
                    <span>商品管理</span>    
                </div>   
            </div>
            <!-- <router-link to='/wholesale/userManagement' class="nav-item">
                <div class="img-box yh"></div>
                <div class="nav-text">
                    <span>用户管理</span>    
                </div> 
            </router-link> -->
            <router-link to='/wholesale/storeManagement' class="nav-item" :class="storeNav() ? 'router-link-active':''">
                <div class="img-box dpT"><div>店</div></div>
                <div class="nav-text">
                    <span>店铺管理</span>    
                </div>
            </router-link>
        </div>
        <div class="nav-box" v-else>
            <router-link :to='indexUrl' class="nav-item" :class="myStoreNav() ? 'router-link-active':''">
            <div class="img-box home"></div>
            <div class="nav-text">
                <span>我的店铺</span>    
            </div>
            </router-link>
            <router-link to='/wholesale/orderManagement' class="nav-item" :class="OrderNav()? 'router-link-active':''"  v-if='userType != 6&&userType != 7&&userType!=4'>
            <!-- <router-link :to='orderManageUrl' class="nav-item" :class="OrderNav()? 'router-link-active':''" v-if='userType != 7'> -->
                <div class="img-box dd"></div>
                <div class="nav-text">
                    <span>订单管理</span>    
                </div>   
            </router-link>
            <div class="nav-item" v-else>
                <div class="img-box dd"></div>
                <div class="nav-text">
                    <span>订单管理</span>    
                </div>   
            </div>
            <router-link to='/wholesale/goodsManagement' class="nav-item" v-if="userType != 6&&userType != 7&&userType!=3&&userType!=4">
                <div class="img-box sp"></div>
                <div class="nav-text">
                    <span>商品管理</span>    
                </div>   
            </router-link>
            <div class="nav-item" v-else>
                <div class="img-box sp"></div>
                <div class="nav-text">
                    <span>商品管理</span>    
                </div>   
            </div>
            <!-- <router-link to='/wholesale/userManagement' class="nav-item">
                <div class="img-box yh"></div>
                <div class="nav-text">
                    <span>用户管理</span>    
                </div> 
            </router-link> -->
            <router-link to='/wholesale/storeManagement' class="nav-item" :class="storeNav() ? 'router-link-active':''">
                <div class="img-box dp"></div>
                <div class="nav-text">
                    <span>店铺管理</span>    
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
                isTure:0,
                path:'',
                disabled:true,
                seq:'',
                userType:'',
                indexUrl:'',
                goodsManageUrl:'',
                orderManageUrl:'',
                userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
            }
        },
        created(){
            let userType = sessionStorage.getItem('userType');
            if(userType){
                this.userType = userType;
                if(userType == 7){
                    this.goodsManageUrl = '';
                    this.orderManageUrl = '';
                }else{
                    this.goodsManageUrl = '/wholesale/goodsManagement';
                    this.orderManageUrl = '/wholesale/orderManagement';
                }
            } 
        },
        mounted(){
            // 判断路由选中相应的底部导航
            let Wseq = sessionStorage.getItem('seq');
                if(Wseq){
                    this.indexUrl = '/wholesale/business?wholesaler='+Wseq;
                }
        },
        watch:{
            '$store.state.userBlock'(){
                this.userBlock=this.$store.state.userBlock;
            }
        },
        methods:{
            myStoreNav(){
                this.path = this.$route.path
                if(this.path === '/wholesale/business' || this.path === '/details'){
                    return true;
                }else{
                    return false;
                }
            },
            OrderNav(){
                this.path = this.$route.path
                if(this.path === '/wholesale/orderManagement' || this.path === '/myorder'){
                    // if(this.userType!=7){
                        return true;
                    // }
                    // else{
                    //     return false;
                    // }
                }else{
                    return false;
                }
            },
            storeNav(){
                this.path = this.$route.path
                if(this.path === '/wholesale/userManagement' || this.path === '/supplier' || this.path === '/shoppingCart' || this.path === '/wholesale/invitation'){
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
    .nav-box .router-link-active .nav-text{
        color:#ff0025
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
