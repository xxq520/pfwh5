<template>
    <div class="shopbottom">
        <div class="cart" @click="gohome">
            <div class="mint-tab-item-icon">
                <span class="bottom-icon-home"></span>
            </div>
            <div class="mint-tab-item-label"><span class="bottom-text">进店</span></div>
        </div>
        <div class="cart" @click="cart">
            <div class="mint-tab-item-icon">
                <span class="bottom-icon-cart">
                    <p v-if="list || list!=0"><i>{{ list }}</i></p>
                </span>
            </div>
            <div class="mint-tab-item-label"><span class="bottom-text">购物车</span></div>
        </div>
        <div class="shopbut">
            <a href="javascript:" class="addCart" @click="openSpec"><span>加入购物车</span></a>
            <a href="javascript:" class="buy" @click="openSpec" ><span>立即购买</span></a>
        </div>
    </div>
</template>

<script>
import {showToast} from '@/assets/js/common'
export default {
    props:['shop','cartList','isMyStore','ApplyStatus','iSeq','Wseq','wholesaleSeq','selectSku','curData',],
    data(){
        return{
           list:0,
           shopMai:this.shop,
           //是否是分享进入的
           shareIstrue:false,
            applyStatus:'',
            blockType:this.$store.state.userInfo.Blocktype

        }
    },
    watch:{
        // 获取产品信息
        shopMai(val){
            this.$emit("shopMai-change",val);
        },
        shop(val){
            this.shopMai = val;
        },
        cartList(val){
            this.listfn();
        }
    },
    computed:{
        userBlock(){
            return this.$store.state.userBlock;
        }
    },
    created(){
        this.isApplyThrough = this.$store.state.userInfo.ApplyStatus == 2;
        // this.userBlock = this.$store.state.userBlock;
        this.applyStatus = this.ApplyStatus;

        if (this.isApplyThrough) {//区域批发商审核通过
            this.applyStatus = "1000";//只要不等5
        }
        this.findCart();
    },
    mounted() {
        this.listfn();
        var search=window.location.href.split("?")[1];
        var searchData={};
        var searchArr=search.split("&")
        for(var i=0;i<searchArr.length;i++){
            var str=searchArr[i].split("=")
            searchData[str[0]]=str[1];
        }
        this.shareIstrue=searchData.share?searchData.seq:false
    },
    methods:{
        findCart() {
            let that = this;
            var params = {
                "pageIndex": 1,
                "pageSize": 1000,
            };
            // 购物车集合
            axios.post(this.blockURL + '/qypfs-cart/cart/findCarts', params).then(res => {
                let data = res.data;
                if (data.code == 200) {
                    this.list = data.data.cartNumber;
                } else {
                    showToast(res.data.message);
                }
                Indicator.close();
                if (data.data.shopCarts.length == 0) {
                    this.list = data.data.cartNumber;
                };
            }).catch(err => {
                Indicator.close();
            });
        },
        cart(){
            // 如果是新版区域批发商
            if (this.blockType){
                this.$router.push('/blockShoppingCart');
            } else {
                this.$router.push('/shoppingCart');
            }
        },
        gohome(){
            // 如果是新版区域批发商
            this.$router.push({
                path:'blockIndex'
            });
        },
        // 添加商品到购物车
        addCart(){
            this.shopMai = true;
            if(this.applyStatus!=5){
                // showToast('您的上游批发商正在进行资金账户安全认证，银行审核通过后才可进行交易。请谅解，谢谢！');
            }else{
                this.shopMai = true;
            }
        },
        listfn(){
            Indicator.open();
        },
        // 立即购买
        buy(){
            if(this.curData && !this.curData.ableBuy){
                console.log(6666);
                
                return showToast('请选择商品规格');
            } 

            this.$router.push({
                path: 'confirmorder',
                query: {
                
                }
            })
            
        },
        openSpec() {
            this.$emit('open-spec');
        }
    }
}
</script>

<style scoped>

.shopbottom{
    overflow:hidden;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: stretch;
    align-items: stretch;
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    background:white;
    border-top:1px solid #e0e0e0;
    z-index:9;
}
.shopbottom .cart{
    float:left;
    text-align:center;
    width:3rem;
    padding:7px 0;
}
.cart .bottom-icon-cart{
    position:relative;
    background-image:url('../assets/images/bottom-icon.png');
    background-repeat: no-repeat;
    background-size:100% auto;
    z-index:1;
    background-position: center 67%;
}
.cart .bottom-icon-home{
    position:relative;
    background-image:url('../assets/images/bottom-home.png');
    background-repeat: no-repeat;
    background-size:100% auto;
    z-index:1;
    background-position: center 67%;
}
.cart .bottom-icon-cart p{
    position:absolute;
    left:60%;
    top:-0.3rem;
    background:white;
    padding:3px;
    border-radius:2rem;
    font-size:0.5rem;
    overflow:hidden;
}
.cart .bottom-icon-cart p i{
    display:block;
    min-width:1.2em;
    line-height:1.2em;
    border:1px solid red;
    border-radius:2rem;
    padding:0 0.1rem;
    color:red;
}
.shopbut{
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: stretch;
    align-items: stretch;
    float:left;
    width:calc(100% - 3rem);
}
.shopbut a{
    float:left;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content: center;
    justify-content: center;
    width:50%;
    color:white;
    font-size:16px;
    line-height:100%;
}
.shopbut a span{
    display:block;
    height:1.2em;
    line-height:1.2em;
}
.shopbut a.addCart{
    background-color: #FB7024;
}
.shopbut a.buy{
    background-color: #F23030;
}
</style>
