<template>
    <div class="uploading">
        <mt-header title="查询信息">
            <!-- <mt-button icon="back" slot="left" @click="()=>{return $router.go(-1)}"></mt-button> -->
            <mt-button icon="back" slot="left" @click="goback()"></mt-button>

            <!-- <router-link slot="right" v-if="this.applyStatus==null || this.applyStatus=='' ||this.applyStatus=='04'||this.applyStatus=='99'" to="/wholesale/uploading" class="resign">{{step==0?'前往填写':'重新填写'}}</router-link> -->
             <div  slot="right"  v-if="this.applyStatus==null || this.applyStatus=='' ||this.applyStatus=='04'||this.applyStatus=='99'" class="resign"  @click="linkToUploding">{{step==0?'前往填写':'重新填写'}}</div>
        </mt-header>
        <div class="progressbar">
            <p></p>
            <el-steps :active="step" finish-status="success">    
                <el-step title="提交资料"></el-step>
                <el-step title="审核中"></el-step>
                <el-step :title="isPass"></el-step>
            </el-steps>
        </div>
        <div @click="renzheng" v-show="Account" class="renzheng">             
                <button  class="bytn" @click="renzheng">账户认证</button>                  
        </div>
        <p class="tips marginB">注：请您务必认真填写您的个人入驻申请资料，否则会对您的生意造成时间上一定的影响，谢谢您的合作！
如：身份证号码、开户行账号、开户行支行名称...</p>
        <p class="tips comit-status" v-if="comitText">提交状态：{{comitText}}</p>
        <div class="user-content">
            <mt-field label="法人姓名:" v-model="datas==''?'':datas.legalName" readonly="readonly"></mt-field>
            <mt-field label="法人身份证号码:" v-model="datas==''?'':datas.idCard" readonly="readonly"></mt-field>
            <mt-field label="法人手机号码:" v-model="datas==''?'':datas.legalMobile" readonly="readonly"></mt-field>
            <mt-field label="法人邮箱:" v-model="datas==''?'':datas.legalEmail" readonly="readonly"></mt-field>
          <mt-field label="法人证件有效期:" >
            <input type="text" style="width:40%;float:left;" readonly="readonly"
              v-model="datas==''?'':datas.legalCardBegindate" >至<input type="text"
              readonly="readonly" style="width:40%;float:right;"
              v-model="datas==''?'':datas.legalCardDeadline"
              >
            </mt-field>
        </div>
        <div class="upload-cotent">
            <div class="upload-img" v-if="img0001!=''">
                <h5 class="title">法人身份证正面照</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0001" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传身份证的正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0001)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0011!=''">
                <h5 class="title">法人身份证反面照</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0011" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传身份证的反面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0011)">查看</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <button class="btns" @click="nextPage">下一页</button>
        <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade" style="width:90%">
            <img :src="largeImg">
        </mt-popup>
        <kf-con></kf-con>
    </div>
</template>
<script>
// import kf53 from "@/assets/js/53kf.js";
import kfCon from "@/components/KF53";
export default {
    data () {
        return {
            username:'',
            bankAccount:'',
            bankName:'',
            representative:'',
            IDNumber:'',
            phone:'',
            email:'',
            seq:'',
            datas:'',
            imgArr:[],
            img0001:'',
            img0011:'',
            popupVisible:false,
            largeImg:'' ,
            step:1,
            isPass:'入驻成功',
            applyStatus:'',//银行审核状态
            comitText:"",//推送状态文案
            merType:'', //商户类型
            Account:false

        }
    },
    components:{
        kfCon
    },
    created(){
        let seq = this.$route.query.seq;
        let from = this.$route.query.from;

        if(seq){
            this.seq = seq;
            sessionStorage.setItem("seq",seq);
        }else{
            this.seq = sessionStorage.getItem("seq");
        }

    },
    mounted(){
        document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML='银联商户入驻';
        this.getInfo();
    },
    methods:{
        //账户认证
        renzheng(){
            this.$router.push({path:'/wholesale/uploada',query:{seq:this.seq}});
        },
        // 重新按钮跳转到Uploading页面
        linkToUploding(){
            let sessions = sessionStorage.getItem('sessions');
            let from = this.$route.query.from;//从哪个页面进入
            sessionStorage.setItem("from",from);//保存标识方便返回使用
            if(from =='by'){
                this.$router.push('/wholesale/uploading?from=by&seq='+this.seq);
            }else{
                this.$router.push('/wholesale/uploading');
            }
        },
        // 查看审核状态
        getInfo(){
            let self = this;
            axios.get(this.URL+'/User/GetEnterMessage',{params:{
                seq:this.seq
                // seq:'5783585'
            }}).then((res)=>{
             console.log(res)
                let data = res.data.data;
            
                this.applyStatus=res.data.applyStatus;

                let applyStatus = res.data.applyStatus;
                 
                let imgList = res.data.imgList;
                this.applyStatus = applyStatus;
                if(data){

                    this.merType= data.merType;

                    if(!applyStatus){
                        this.step = 0;
                    }else if(applyStatus == '00'||applyStatus=='01'||applyStatus=='02'||applyStatus=='03'){
                        this.step = 1;
                    }else if(applyStatus=='04'||applyStatus=='99'){
                        this.step = 2;
                        this.isPass = '入网失败';
                    }else if(applyStatus=='99'){
                        this.step = 2;
                        this.isPass = '其他失败';
                    }
                    else if(applyStatus=='05'){        
                            this.step =3 ;
                            this.isPass = '入驻成功';       
                    }else if(applyStatus=='06'){
                    this.step =2 ;
                    this.isPass = '待认证';
                    this.Account= true;

                    } else if(applyStatus=='07'){               
                        this.step =3 ;
                        this.isPass = '认证失败';
                        Toast({
                        message: '您的对公账户已认证失败5次，请联系客服处理！',
                        position: 'bottom',
                        duration: 3000                 
                        })
                    }

                    if(imgList){
                        self.setImgArr(imgList);
                    }
                    this.datas = data;
                    sessionStorage.setItem('userInfo',JSON.stringify(data));
                }else{
                    sessionStorage.setItem('userInfo','');
                    self.step = 0;
                }
                 // 没有提交资料或者被银行驳回  才去查询推送状态接口
                if(this.applyStatus == '' || this.applyStatus == undefined || this.applyStatus == null || this.applyStatus == "04" || this.applyStatus == "99"){
                    this.checkPushStatus();
                }
            })

        },
        // 查看推送状态
        checkPushStatus(){
            axios.get(this.URL+'/User/GetPushResult',{params:{seq:this.seq}})
            .then(res => {
                if(res.data.retCode == 200){
                    this.comitText = res.data.pushResult;
                }
            }).catch(err => {})
        },
        nextPage(){
            this.$router.push('/wholesale/uploads');
        },
        // 查看大图
        enlargeImg(img){
            this.largeImg = img;
            this.popupVisible =true;
        },
        setImgArr(imgList){
            if(imgList){
                // let data = this.datas.attachments;
                // console.log(data)
                for(var i = 0;i<imgList.length;i++){
                    this.imgArr.push({type:imgList[i].imgType,url:imgList[i].imgUrl});
                    if(imgList[i].imgType=='0001'){
                        this.img0001 = imgList[i].imgUrl;
                    }else if(imgList[i].imgType=='0011'){
                        this.img0011 = imgList[i].imgUrl;
                    }
                }
                sessionStorage.setItem('imgArr',JSON.stringify(this.imgArr));
            }

        },
            goback() {

            // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
            // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
            // console.log(this.$route.query.from);
            // if (this.$route.query.platform == 'android') {
            //     window.action.backAPP();
            // } else
            //  if (this.$route.query.platform == 'ios'){
            //    alert("111")
            //     window.action.app_back();
            // } else {

            //     this.$router.go(-1)
            // }
            try {
                 window.action.app_back();
            } catch (err) {
                 this.$router.go(-1)
            }

        }
    }
}
</script>
<style>
    body{
        background-color:#f5f5f5;
    }
    .uploading .user-content{
        margin-bottom:.6667rem;
    }
  
    .uploading .mint-cell:last-child{
        border:none;
    }
    .uploading .mint-cell-title{
        width:140px;
    }
    .uploading .mint-cell-value .mint-field-core{
        text-align:right;
    }
    .uploading .upload-cotent{
        margin-bottom:2.2222rem;
        background-color:#fff;
    }
    .uploading .upload-img{
        padding:10px;
        border-top:.0444rem solid #eee;
    }
    .uploading .upload-img:first-child{
        border:0 none;
    }
    .uploading .upload-img .title{
        font-weight:normal;
        font-size:.6667rem;
        color:#333;
        margin-bottom:10px;
    }
    .uploading .img-con{
        position:relative;
        display:flex;
        justify-content: space-between;
    }
    .uploading .img-con img{
        height:100%;
    }
    .uploading .legend{
        display:block;
        position:absolute;
        left:0;
        top:0;
        width:0;
        height:0;
        border-width:1.2rem  1.2rem 0 0;
        border-style:solid;
        border-color:#f23030 transparent transparent transparent;
    }
    .uploading .legend .legend-text{
        position:absolute;
        top:-1.2rem;
        left:0;
        font-size:.5333rem;
        color:#fff;
    }
    .uploading .img-box{
        width:6.6667rem;
        height:4.4444rem;
        border:.0444rem solid #eee;
        padding:.4444rem;
        overflow:hidden;
    }
    .uploading .upload-box{
        width:7.3111rem;
    }
    .uploading .upload-text{
        font-size:.5333rem;
        color:#666;
    }
    .uploading .upload-btn{
        position:relative;
    }
    .uploading .upload-btn input{
        position:absolute;
        left:0;
        top:.8444rem;
        width:100%;
        height:100%;
        opacity:0;
    }
    .uploading .upload-btn button{
        width:5.5556rem;
        height:1.5111rem;
        background-color:#f23030;
        color:#fff;
        font-size:.7111rem;
        border:0 none;
        border-radius:5px;
        margin-top:.8444rem;
    }
    .renzheng {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px ;
    }
        .renzheng .bytn{
    color: #fff;
    background-color: #f23030;
    border-color: #f23030;
    border-radius: 18px;
    padding: 8px 15px;
    border: none;
    }
   
    .uploading .btns{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        height:1.7778rem;
        background-color:#f23030;
        color:#fff;
        font-size:.7556rem;
        border:0 none;
    }
    .progressbar{
        background: #f5f5f5;
        padding: .5rem 2.5rem;
        position: relative;
    }
    .progressbar .el-step__main{
        margin-left: -25px;
    }
    .progressbar .el-step__title{
        color: #999;
        font-size: .5778rem /* 26/45 */;
    }
    .progressbar .el-step.is-horizontal .el-step__line{
        top: .8rem
    }
    .progressbar .el-step__title{
        margin-left: 15px;
    }
    .resign{
        color:#fff !important;
        font-size: 0.5333rem;
        background: #f23030;
        padding:0.2222rem 0.4444rem;
        border-radius: 4px;
        position: absolute;
        top:50%;
        margin-top: -.4888rem;
        right: .4444rem;
    }
    .uploading .tips{
        font-size: 0.5778rem;
        color:#f00;
        padding:0 .4444rem;
        margin-bottom: 0.2222rem;
    }
    .uploading .marginB{
        margin-bottom:.4444rem;
    }
    .uploading .comit-status{
        font-weight:bold;
    }
</style>
