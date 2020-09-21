<template>
    <div>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="订单管理">
                <order-management></order-management>
            </mt-tab-container-item>
            <mt-tab-container-item id="商品管理">
                <goods-management></goods-management>
            </mt-tab-container-item>
            <!-- <mt-tab-container-item id="用户管理">
                <user-management></user-management>
            </mt-tab-container-item>
            <mt-tab-container-item id="店铺管理">
                <store-management></store-management>
            </mt-tab-container-item> -->
        </mt-tab-container>
        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="订单管理">
                <img v-show="selected == '订单管理'" slot="icon" src="../../assets/images/wholesale/nav/ddgl_icon2.png">
                <img v-show="selected != '订单管理'" slot="icon" src="../../assets/images/wholesale/nav/ddgl_icon.png">
                订单管理
            </mt-tab-item>
            <mt-tab-item id="商品管理">
                <img v-show="selected == '商品管理'" slot="icon" src="../../assets/images/wholesale/nav/spgl_iocn2.png">
                <img v-show="selected != '商品管理'" slot="icon" src="../../assets/images/wholesale/nav/spgl_iocn.png">
                商品管理
            </mt-tab-item>
            <mt-tab-item id="用户管理">
                <img v-show="selected == '用户管理'" slot="icon" src="../../assets/images/wholesale/nav/yhgl_icon2.png">
                <img v-show="selected != '用户管理'" slot="icon" src="../../assets/images/wholesale/nav/yhgl_icon.png">
                用户管理
            </mt-tab-item>
            <mt-tab-item id="店铺管理">
                <img v-show="selected == '店铺管理'" slot="icon" src="../../assets/images/wholesale/nav/dpgl_icon2.png">
                <img v-show="selected != '店铺管理'" slot="icon" src="../../assets/images/wholesale/nav/dpgl_icon.png">
                店铺管理
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
import orderManagement from "./orderManage"
import userManagement from "./UserManagement"
import goodsManagement from "./GoodsManagement"
import storeManagement from "./StoreManagement"
export default {
    data () {
        return {
            selected:"订单管理"
        }
    },
    components:{
        orderManagement,
        userManagement,
        goodsManagement,
        storeManagement
    },
    created(){
        //判断菜单栏
        let nav = sessionStorage.getItem('nav');
        if(nav){
            this.selected = nav;
        }
    },
    watch:{
        selected(val,oldVal){
            sessionStorage.setItem('nav',val);
        }
    }
}
</script>
<style scoped>

.mint-tabbar > .mint-tab-item.is-selected{
    background:	transparent !important;
    color:#ff0025;
}
</style>