<template>
    <div class="page">
        <div class="box">
            <div class="hd">
                <img class="icon_3"  @click="goBack" :src="require('../../assets/images/leftbtn.png')"/>
                <span class="txt" :lines="1">申请记录</span>
            </div>
            <div class="bd" v-if="apply.userRoleName">
                <div class="group">
                    <span class="label" :lines="1">申请时间</span>
                    <span class="text">{{apply.createTime}}</span>
                </div>
                <div class="group">
                    <span class="label" :lines="1">批发(负责)区域</span>
                    <span class="text line1">{{apply.regionDetails}}</span>
                </div>
                <div class="group">
                    <span class="label" :lines="1">申请人</span>
                    <span class="text">{{apply.name||'未填写'}}</span>
                </div>
                <div class="group">
                    <span class="label" :lines="1">手机号码</span>
                    <span class="text">{{apply.phone}}</span>
                </div>
                <div class="group">
                    <span class="label" :lines="1">身份证号码</span>
                    <span class="text">{{apply.identityCard||'未填写'}}</span>
                </div>
                <div class="group">
                    <span class="label" :lines="1">申请身份</span>
                    <span class="text" v-if="">{{apply.userRoleName}}</span>
                </div>
                <div class="group" >
                    <span class="label" :lines="1">行业</span>
                    <span class="text">{{apply.categoryName||'未填写'}}</span>
                </div>

                <div class="group" v-if="apply.licenseImg">
                    <span class="label" :lines="1">营业执照照片</span>
                    <div class="pic">
                        <img :src="apply.licenseImg" class="alertImg" alt="" preview="0" preview-text="营业执照照片">
                        <span class="text">{{'查看'}}</span>
                        <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                    </div>
                </div>
                <div class="group" v-if="apply.shopFacadeImg">
                    <span class="label" :lines="1">店铺门头照片</span>
                    <div class="pic">
                        <img :src="apply.shopFacadeImg" class="alertImg" alt="" preview="0" preview-text="店铺门头照片">
                        <span class="text">{{'查看'}}</span>
                        <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                    </div>
                </div>

                <div class="group">
                    <span class="label" :lines="1">状态</span>
                    <span class="text status">{{["审核中","申请成功","已撤销","已拒绝"][apply.applyStatus]}}</span>
                </div>
                <div class="group" v-if="apply.applyStatus==3">
                    <span class="label" :lines="1">备注</span>
                    <span class="text">{{apply.note}}</span>
                </div>
            </div>
            <img v-if="!apply.userRoleName" src="http://nfxts.520shq.com/static/fonts/liveNone.f74612e.png" class="none" alt="">
            <div v-if="apply.applyStatus==0" class="ft">
                <!--<p class="goback" :lines="1">撤销申请</p>-->
                <p class="login max loginTo" :lines="1"  @click="applyDel">撤销申请</p>
                <!--<p class="login" :lines="1" @click="goLogin">登录</p>-->
            </div>
            <div v-if="apply.applyStatus==2" class="ft" >
                <p class="login max" :lines="1" @click="submitTo">再次提交</p>
            </div>
            <div v-if="apply.applyStatus==3" class="ft">
                <p class="goback" :lines="1" @click="applyDel">撤销申请</p>
                <p class="login" :lines="1" @click="submitTo">修改提交</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast,Indicator,Popup } from 'mint-ui';
    import 'mint-ui/lib/style.css'
    import {phoneRuler,setCookie,getCookie} from "@/assets/js/common.js"
    export default {
        name: "applyRecord",
        data:()=>({
            apply:{},
            type: "",
            phone:sessionStorage.getItem("applyPhone"),
        }),
        props:{

        },
        created() {
            // 获取上一个页面传递过来的申请角色的类型
            this.type = this.$route.query.type;
            // 获取上一个页面传递过来的审核记录id
            this.auditId = this.$route.query.auditId;
            Indicator.open('加载中...');
            this.getApply();
        },
        mounted() {
            //private Integer WholesalerType;//1 普通批发商 2 区域批发商
            //private String  ApplyStatus;//区域批发商申请状态 0=待审核,1=审核中,2=审核通过,3=已拒绝,4=已撤销  null表示不是区域批发商身份，还是原来的身份
        },
        computed:{
        },

        filters:{
            formatTime (time) {
                return new Date(time).Format('yyyy-MM-dd')
            },
        },
        methods:{
            // 点击再次提交
            submitTo() {
                var {username,cartcode,phone} = this.$route.query;
                var type = 0;
                // 设置邀请入驻的身份标题
                switch (this.apply.userRoleName) {
                    case "总部统筹官":
                        type = 1;
                        break;
                    case "新发展商":
                        type = 2;
                        break;
                    case "发展商":
                        type = 3;
                        break;
                    case "区域统筹官":
                        type = 4;
                        break;
                    case "区域批发商":
                        type = 5;
                        break;
                    case "下游商家":
                        type = 6;
                        break;
                    case "省统筹官":
                        type = 7;
                        break
                }
                if (this.apply.shareIdentityType==4&&this.apply.registerIdentityType==5) {
                    delete this.apply.name;
                    delete this.apply.identityCard;
                }
                sessionStorage.removeItem("apply");
                sessionStorage.setItem("apply",JSON.stringify(this.apply));
                // 跳转到入驻页面
                this.$router.push({path:`/block/applyRecord?type=${type}&isReload=true`})
            },
            // 获取用户申请记录列表数据
            getApply(){
                axios.get(this.blockURL+`/qypfs-user/register/getAuditById?auditId=${this.auditId}`,{
                    // auditId : this.auditId,
                }).then((res)=>{
                    Indicator.close();
                    if (res.data.code==200&&res.data.data){
                        res.data.data.createTime =res.data.data.createTime.split("T")[0];
                        this.apply = res.data.data||{};
                        this.$previewRefresh()
                    } else {
                        if (!res.data.data){
                            Toast({message: "数据加载失败,稍后再试",position: 'bottom',duration: 2000});
                        }
                    }
                }).catch(err=>{
                    Indicator.close();
                })
            },
            // 点击返回上一页按钮的时候事件
            goBack(){
                history.go(-1);
            },
            // 点击撤销申请事件
            applyDel(){
                if (!this.apply.userRoleName) {
                    return false;
                }
                MessageBox({
                    title: '温馨提示',
                    message: '确定要撤销该用户申请吗？',
                    showCancelButton: true
                }).then(res=>{
                    if (res == "confirm") {
                        axios.post(this.blockURL+`/qypfs-user/register/undo?auditId=${this.apply.auditId}`,{
                            auditId:this.apply.auditId,
                        }).then((res)=>{
                            if (res.data.code==200){
                                Toast({message: "撤销成功",position: 'middle',duration: 2000});
                                this.getApply();
                            }
                        }).catch(err=>{
                        })
                    }
                })
            },
            // 跳转到登录页面事件
            goLogin(){
                setCookie('isAuto',false);
                Toast({message: "登录后即可操作",position: 'bottom',duration: 2000});
                sessionStorage.setItem('selected','供应链新批发');
                this.$router.push({path:"/login"})
            }
        },
    }
</script>

<style scoped>
    .alertImg{
        position: absolute;
        top: 0;
        right: 0;
        width: 5rem;
        height: 2.25rem;
        margin: 0;
        z-index: 3;
        opacity: 0;
        filter:Alpha(opacity=0);
    }
    .group .icon-img{
        width:0.39rem;
        height:0.6rem;
        line-height: 1.36rem;
        margin-top: 0.1rem;
        margin-left: 0.32rem;
    }
    .pic{
        display: flex;
        align-items: center;
    }
    .page{
        background-color: #f8f8f8;
        font-size: 0.7rem;
        color:rgba(51,51,51,1);
        padding-bottom: 2.27rem;
    }
    .none{
        max-width: 70%;
        height: 8rem;
        margin: 1rem auto;
        display: block;
    }
    .loginTo{
        background-color: #ccc !important;
    }
    .hd{
        height:1.98rem;
        background:linear-gradient(-90deg,rgba(255,94,35,1),rgba(255,119,37,1));
        line-height: 1.98rem;
        position: relative;
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
        margin-top: 0.45rem;
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
        max-width: 9.6rem;
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
        height: 2.2rem;
        background:rgba(255,0,5,1);
        width: 50%;
    }
    .ft .login{
        height: 2.2rem;
        background:rgba(255,96,35,1);
        width: 50%;
    }
    .ft .max {
        width: 100%;
    }
</style>
