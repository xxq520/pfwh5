<template>
    <div class="wholesale-setting">
        <mt-header title="店铺设置">
            <router-link to="/wholesale/storeManagement" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="content">
            <mt-cell title="绑定号码" :value='mobile' class="item"></mt-cell>
            <mt-cell title="修改密码" is-link to="/changecode" class="item"></mt-cell>
            <!-- <mt-cell title="我的收货地址" is-link to="/myaddress" class="item"></mt-cell> -->
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            mobile:''
        }
    },
    created(){
        this.getSession();
    },
    methods:{
        //获取本地缓存数据
        getSession(){
            let mobile = sessionStorage.getItem('mobile');
            if(mobile){
                this.mobile = mobile;
            }
        },
        loginOut(){
            let app = sessionStorage.getItem('app');
            if(app){
                window.action.loginOut();
            }else{
                MessageBox({
                    title:"",
                    message: '确定退出登录?',
                    showCancelButton: true
                }).then(action => {
                    if(action ==='confirm'){
                        sessionStorage.removeItem('seq');
                        this.$router.push({path:'/login'});
                    }
                });
            }
        }
    }
}
</script>

<style>
    .wholesale-setting .content{
        margin-top:.4444rem;
    }
    .wholesale-setting .item{
        border-bottom:.0444rem solid #ccc;
    }
    .wholesale-setting .item:last-child{
        border:0 none;
    }
    .wholesale-setting .login-btn{
        position:fixed;
        left:50%;
        bottom:0;
        margin-left:-7.2222rem;
        width:14.4444rem;
        border-radius:5px;
    }
</style>
