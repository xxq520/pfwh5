<template>
    <div class="page">
        <div class="box">
            <div class="hd">
                <img @click="goBack" :src="require('../../assets/images/leftbtn.png')" class="icon_3"/>
                <span  class="txt" :lines="1">基本信息</span>
            </div>
            <div class="bd">
                <div class="group" >
                    <span class="label" :lines="1">商品名称<span>*</span></span>
                    <input  class="text"  type="text" value="" placeholder="请输入" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">分类设置<span>*</span></span>
                    <p class="right">
                        <input  class="text"  type="text" value="" placeholder="请选择" />
                        <img :src="require('../../assets/images/right2.png')" alt="">
                    </p>
                </div>
                <div class="group" >
                    <span class="label" :lines="1">商品简介</span>
                    <input  class="text"  type="text" value="" placeholder="是用于介绍商品的描述信息" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">商品关键字</span>
                    <input  class="text"  type="text" value="" placeholder="多个关键字请用分隔符分割" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">商品排序</span>
                    <input  class="text"  type="text" value="" placeholder="0" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">产品包装<span>*</span></span>
                    <input  class="text"  type="text" value="" placeholder="请输入" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">商品单位<span>*</span></span>
                    <input  class="text"  type="text" value="" placeholder="请输入" />
                </div>
                <div class="group" >
                    <span class="label" :lines="1">原厂编号</span>
                    <input  class="text"  type="text" value="" placeholder="请输入" />
                </div>
                <div class="group borderNone">
                    <span class="label" :lines="1">商品条形码</span>
                    <input  class="text"  type="text" value="" placeholder="只能包含（字母、数字、特殊符号）" />
                </div>

                <el-button  class="ft"  v-preventReClick><span class="text_4" :lines="1">下一步</span></el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast,Indicator,Popup} from 'mint-ui';
    import 'mint-ui/lib/style.css'
    export default {
        name: "addNewGood",
        data:()=>({
        }),
        components:{
        },
        created() {
        },

        mounted() {
        },
        computed:{
        },
        filters:{
        },
        methods:{
            phoneRegister() {
                axios.get(this.blockURL+`/qypfs-user/auth/ifRegister?mobile=${this.phone}`,{}).then((res)=>{
                    if (res.data.code==200){
                        this.isRegisterPhone = res.data.data;
                    } else {
                        this.isRegisterPhone = false;
                    }
                }).catch(err=>{
                })
                axios.post(this.blockURL+`/qypfs-user/auth/register`,data).then((res)=>{
                    Indicator.close();
                    if (res.data.code==200){
                        this.$router.push({path:`/block/applylist`});
                        sessionStorage.setItem("applyPhone",phone);
                        sessionStorage.setItem("cityAddress","")
                    } else {
                        Toast({message: res.data.message,position: 'middle',duration: 2000});
                    }
                }).catch(err=>{
                    Indicator.close();
                })
            },
            // 点击返回按钮事件
            goBack() {
                if (history.length>1){
                    history.go(-1)
                } else {
                    this.$router.push({path:'/login'});
                }
            },
        },
    }
</script>

<style scoped>
    .right{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .right img{
        height: 0.48rem;
        width: 0.32rem;
        margin-left: 0.3rem;
    }
    .page{
        background-color: #f8f8f8;
        font-size: 0.7rem;
        color:rgba(51,51,51,1);
        padding-bottom: 2.27rem;
    }
    .hd{
        height:1.98rem;
        background:linear-gradient(-90deg,rgba(255,94,35,1),rgba(255,119,37,1));
        line-height: 1.98rem;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        text-align: center;
    }
    .hd .icon_3{
        position: absolute;
        left: 0.8rem;
        top: 0.62rem;
        width:0.43rem;
        height:0.84rem;
    }
    .hd .txt{
        width:0.33rem;
        height:0.61rem;
        color: #fff;
        font-size:0.77rem;
        font-family:PingFang SC;
        color:rgba(255,255,255,1);
    }
    .bd{
        background-color: #fff;
        margin-top: 0.4rem;
        padding:0 0.61rem;
    }
    .group{
        padding: 0.6rem 0;
        border-bottom: 0.02rem solid rgba(230,230,230,1);
        display: flex;
        position: relative;
        justify-content: space-between;
    }
    .borderNone{
        border-bottom: none;
    }
    .group .label{
        width: 3.4rem;
        font-size: 0.68rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .group .label>span{
        color: #EE0000FF;
    }
    .group .text{
        font-size:0.66rem;
        font-weight:normal;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        text-align: right;
        width:70%;
    }
    .group .text:placeholder{
        color:#666666FF;
        font-size:0.66rem;
    }
    .main .label{
        width: 4.8rem;
        font-size:0.66rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .bd{
        margin-top: 2.35rem;

    }
    .main .text{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        display: flex;
        align-items: center;
        margin-top: -0.1rem;
        max-width: 9.2rem;
    }
    .main .text img{
        width: 0.34rem;
        height: 0.59rem;
        margin-left: 0.3rem;
        margin-top: 0.1rem;
    }
    .ft{
        height:2.27rem;
        background:rgba(255,96,35,1);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        color: #fff;
        text-align: center;
    }
    .ft span{
        font-size: 0.66rem;
    }
</style>
