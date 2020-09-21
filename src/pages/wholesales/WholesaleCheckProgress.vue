<template>
    <div class="wholesaleCheckProgress">
        <mt-header :title="topnav.title">
            <mt-button icon="back" @click="goBack" slot="left"></mt-button>
        </mt-header>
        <div class="progress">
            <!-- <div class="step" :class="status!=''?'stepPass':''">
                <img v-if="status==''" src="@/assets/images/wholesale/progress/zhiliao2@3x.png">
                <img v-else src="@/assets/images/wholesale/progress/ziliao@3x.png"> -->
            <div class="step" :class="status!='-1'?'stepPass':''">
                <img src="@/assets/images/wholesale/progress/ziliao@3x.png">
                <span>1</span>
                <span>提交资料</span>
            </div>
            <div class="line" :class="status!='-1'&&status>=0?'linePass':''">
                <img v-if="status!='-1'&&status>=0&&status!=2" src="@/assets/images/wholesale/progress/wancheng@3x.png">
                <img v-else-if="status!='-1'&&status<0" src="@/assets/images/wholesale/progress/wancheng2@3x.png">
                <img v-else-if="status!='-1'&&status==2" src="@/assets/images/wholesale/progress/shibai@3x.png">
            </div>
            <div class="step" :class="status!='-1'&&status>0&&status!=2?'stepPass':''">
                <img v-if="status!='-1'&&status>0&&status!=2" src="@/assets/images/wholesale/progress/shichang@3x.png">
                <img v-else src="@/assets/images/wholesale/progress/shichang2@3x.png">
                <span>2</span>
                <span>市场审核</span>
            </div>
            <div class="line" :class="status!='-1'&&status>=3?'linePass':''">
                <img v-if="status!='-1'&&status<3" src="@/assets/images/wholesale/progress/wancheng2@3x.png">
                <img v-else-if="status!='-1'&&status>=3&&status!=5" src="@/assets/images/wholesale/progress/wancheng@3x.png">
                <img v-else-if="status!='-1'&&status==5" src="@/assets/images/wholesale/progress/shibai@3x.png">
            </div>
            <div class="step" :class="status!='-1'&&status>3&&status!=5?'stepPass':''">
                <img v-if="status!='-1'&&status==4" src="@/assets/images/wholesale/progress/tongguo@3x.png">
                <img v-else src="@/assets/images/wholesale/progress/tongguo2@3x.png">
                <span>3</span>
                <span>财务审核</span>
            </div>
        </div>
        <div class="progressText" v-if="status!='-1'">
            <img v-if="status!='-1'&&(status==3||status==0||status==1)" src="@/assets/images/wholesale/progress/shizhong@3x.png">
            <img v-else-if="status!='-1'&&status == 4" src="@/assets/images/wholesale/progress/yinzhang@3x.png">
            <img v-else-if="status!='-1'&&(status==2||status==5)" src="@/assets/images/wholesale/progress/shenheshibai@3x.png">
            <p class="text">{{status!='-1'&&(status==2||status==5)?'审核失败':status==4?'审核已通过':'正在努力审核中...'}}</p>
            <p class="goWholesale" v-if="status!='-1'&&(status==2||status==5)" @click="goWhere">重新填写</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            topnav:{
                title:'审核进度'
            },
            status:'-1',
            seq:'',
            userType:"",
            IsServicer:""
        }
    },
    created(){
        // let auditStatus = sessionStorage.getItem('auditStatus');
        // let seq = sessionStorage.getItem('seq');
        let seq = this.$route.query.seq;
        let userType = sessionStorage.getItem('userType');
        let IsServicer = sessionStorage.getItem('IsServicer');
        if(userType){
            this.userType = userType;
        }
        if(IsServicer){
            this.IsServicer = IsServicer;
        }
        if(seq){
            this.seq = seq;
            this.getUserAuditStatus();
        }
    },
    mounted(){
    },
    methods:{
        // 返回
        goBack(){
            if(this.userType == '1' || this.userType == '5'|| this.userType == '6'){
                if(this.$route.query.from && this.$route.query.from == 'supplier'){
                    this.$router.push({path:"/supplier",query:{from:"progress"}});
                }else if(this.$route.query.from && this.$route.query.from == 'center'){
                    this.$router.push({path:"/mineindex"});
                }else{
                    this.$router.go(-1)
                }
            }else if((this.userType == '2' && this.IsServicer == 'true') || this.userType == '3' || this.userType == '4'){
                this.$router.push({path:"/wholesale/business",query:{wholesaler:this.seq,from:"progress"}});
            }else{
                this.$router.go(-1)
            }
        },
        getUserAuditStatus(){
            axios.get(this.URL + '/User/GetUserInfoBySeq',{params:{seq:this.seq}})
            // axios.get(this.URL + '/User/GetUserInfo',{params:{account:this.account,pwd:this.pwd}})
            .then((res) => {
                // console.log(res)
                Indicator.close();
                if(res.data){
                    this.status = res.data.auditStatus;
                }
            });
        },
        goWhere(){
            if(this.status==4){

            }else{
                let url = this.SETTLED+'?wholesaler='+this.seq+'&rewrite=true&progress=true';
                location.href = url;
            }
        }
    }
}
</script>

<style scoped>
    .progress{
        position:relative;
        display: flex;
        justify-content: space-between;
        padding: 1.3333rem;
    }
    
    .step{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.6222rem;
        color:#D8D8D8;
    }
    .stepPass{
        color:#FF5558;
    }
    .step img{
        width: 1.6rem;
        height: 1.6rem;
    }
    .line{
        border: 1px dashed #D8D8D8;
        position:relative;
        height: 0;
        margin-top: 0.8667rem;
        flex: 1;
    }
    .line img{
        height: 0.6667rem;
        width: 0.6667rem;
        position:absolute;
        top: 50%;
        left: 50%;
        margin-left: -0.3333rem;
        margin-top: -0.3333rem;
    }
    .linePass{
        border: 1px solid #FF5558;
        height: 0;
    }
    .progressText{
        margin-top:1.7778rem; 
        text-align: center;
    }
    .progressText img{
        width: 3.4222rem;
        height:3.4222rem;
        margin-bottom: 0.4444rem;
    }
    .text{
        font-size: 0.7556rem;
        margin-bottom: 1.7778rem;
    }
    .goWholesale{
        font-size: 0.7556rem;
        margin: 0 auto;
        width: 14.2222rem;
        padding: 0.4444rem 0;
        border-radius:25px;
        background:#FF5558;
        color:#fff;
        text-align: center;
    }
</style>
