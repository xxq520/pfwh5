<template>
    <div class="page">
        <div class="box">
            <div class="hd">
                <img class="icon_3" @click="goBack" :src="require('../../assets/images/leftbtn.png')"/>
                <span class="txt" :lines="1">申请记录</span>
            </div>
            <div class="body">
                <div class="bd" v-for="(item,index) in apply" @click="goApplyDetail(item)">
                    <div class="group">
                        <span class="label" :lines="1">申请时间</span>
                        <span class="text">{{item.createTime}}</span>
                    </div>
                    <div class="group">
                        <span class="label" :lines="1">申请身份</span>
                        <span class="text">{{item.userRoleName}}</span>
                    </div>
                    <div class="group" >
                        <span class="label" :lines="1">行业</span>
                        <span class="text">{{item.categoryName||'未填写'}}</span>
                    </div>
                    <div class="group">
                        <span class="label" :lines="1">状态</span>
                        <span class="text status">{{['审核中','申请成功','已撤销','已拒绝'][item.applyStatus]}}></span>
                    </div>
                </div>
            </div>
            <img v-if="!apply.length" src="http://nfxts.520shq.com/static/fonts/liveNone.f74612e.png" class="none" alt="">
        </div>
    </div>
</template>

<script>
    import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
    import { MessageBox,Indicator } from 'mint-ui';
    export default {
        name: "applyRecord",
        data:()=>({
            apply: [],
            // 登录的手机号
            phone:sessionStorage.getItem("applyPhone")
        }),
        created() {
            Indicator.open('加载中...');
            var {phone} = this.$route.query;
            // 判断是否是app跳转过来的
            if (phone) {
                this.phone = phone
            }
            // 获取用户申请区域批发商的记录
            this.getApply();
        },
        mounted() {
            //private Integer WholesalerType;//1 普通批发商 2 区域批发商
            //private String  ApplyStatus;//区域批发商申请状态 0=待审核,1=审核中,2=审核通过,3=已拒绝,4=已撤销  null表示不是区域批发商身份，还是原来的身份
        },
        computed:{},

        filters:{
            formatTime (time) {
                return new Date(time).Format('yyyy-MM-dd')
            },
        },
        methods:{
            // 点击某一项申请记录的时候
            goApplyDetail(e){
                var type = 0;
                switch (e.userRoleName) {
                    case "总部统筹官":
                        type = 1;
                        break;
                    case "新发展商":
                        type = 2;
                        break;
                    case "发展商":
                        type = 3;
                        break;
                    case "统筹官":
                        type = 4;
                        break;
                    case "区域批发商":
                        type = 5;
                        break;
                    case "下游商家":
                        type = 6;
                        break
                }
                this.$router.push({path:`/block/applyStatus?auditId=${e.auditId}`});
                sessionStorage.setItem("applyPhone",e.phone)
            },
            // 获取用户申请记录列表数据
            getApply(){
                axios.post(this.blockURL+`/qypfs-user/register/getRegisterLog`,{
                    phone:this.phone,
                    type:0
                }).then((res)=>{
                    Indicator.close();
                    if (res.data.code==200&&res.data.data[0]){
                        for(var i=0; i<res.data.data.length; i++){
                            res.data.data[i].createTime =res.data.data[i].createTime.split("T")[0]
                        }
                        this.apply = res.data.data||[];
                    } else {
                        if (!res.data.data){
                            Toast({message: "数据加载失败,稍后再试",position: 'bottom',duration: 2000});
                        }
                    }
                }).catch(err=>{
                    Indicator.close();
                })
            },
            goBack(){
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
        },
    }
</script>

<style scoped>
    .none{
        max-width: 70%;
        height: 8rem;
        margin: 1rem auto;
        display: block;
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
        text-align: center;
        z-index: 1000;
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
    .body{
        margin-top: 2.43rem;
    }
    .bd{
        background-color: #fff;
        margin-bottom: 0.45rem;
    }
    .group{
        padding: 0.6rem;
        border-bottom: 0.02rem solid rgba(230,230,230,0.9);
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    .group .label{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .group .text{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .line1{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    span.status{
        color:rgba(255,96,35,1) !important;
        padding: 0;
    }
    .ft{
        height:2.2rem;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        line-height: 2.27rem;
        font-size:0.77rem;
        color: #fff;
        text-align: center;
        display: flex;
    }
    .ft .goback{
        width: 50%;
        height: 2.2rem;
        background:rgba(255,0,5,1);
    }
    .ft .login{
        width: 50%;
        height: 2.2rem;
        background:rgba(255,96,35,1);
    }
</style>
