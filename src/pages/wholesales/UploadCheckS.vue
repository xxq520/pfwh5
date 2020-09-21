<template>
    <div class="uploading">
        <mt-header title="查询信息">
            <!-- <router-link to="/wholesale/storeManagement" slot="left"> -->
                <mt-button icon="back" @click="$router.go(-1)" slot="left"></mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="user-content">
            <mt-field label="注册类型:" v-model="datas==''?'':datas.merType == '00'?'企业商户':datas.merType == '01'?'个人商户':'小微商户'" readonly="readonly"></mt-field>
            <mt-field label="商户店铺名称:" readonly="readonly" v-model="datas==''?'':datas.mercialName" type="text"></mt-field>
            <mt-field label="营业省:" v-model="datas==''?'':datas.province.name" type="text" readonly="readonly"></mt-field>
            <mt-field label="营业市:" v-model="datas==''?'':datas.city.name" type="text" readonly="readonly"></mt-field>
            <mt-field label="营业区/县:" v-model="datas==''?'':datas.area.name" type="text" readonly="readonly"></mt-field>
            <mt-field label="营业地址街道:" v-model="datas==''?'':datas.road" type="text" readonly="readonly"></mt-field>
            <mt-field label="营业地址门牌:" v-model="datas==''?'':datas.houseNo" readonly="readonly"></mt-field>
            <mt-field label="账户类型:" v-model="datas==''?'':datas.bankAcctType == '0'?'个人账户':datas.bankAcctType == '1'?'公司账户':''" readonly="readonly"></mt-field>
            <mt-field label="开户账号姓名:" v-model="datas==''?'':datas.bankUser" readonly="readonly"></mt-field>
            <mt-field label="开户行账号:" v-model="datas==''?'':datas.bankCard" readonly="readonly"></mt-field>
            <mt-field label="开户行支行名称:" v-model="datas==''?'':datas.bankName" readonly="readonly"></mt-field>
            <mt-field label="开户行支行行号:" v-model="datas==''?'':datas.bankNo" readonly="readonly"></mt-field>
            <mt-field label="营业地址补充信息:" v-model="datas==''?'':datas.addrExt" readonly="readonly"></mt-field>
            <mt-field label="统一社会信用代码:" v-model="datas==''?'':datas.socialCode" readonly="readonly" v-if="datas.merType=='00'||datas.merType=='01'"></mt-field>
          <mt-field label="统一社会信用代码有效期:" v-if="datas.merType=='00'||datas.merType=='01'">
            <span><input type="text"  style="width:100px;" readonly="readonly" v-model="datas==''?'':datas.licenseBegindate"></span><span style="margin-right: 8px;">至</span><span><input type="text"  readonly="readonly" style="width:100px;" v-model="datas==''?'':datas.licenseDeadline"></span></mt-field>

            <mt-field label="营业执照注册地址:" readonly="readonly" v-model="datas==''?'':datas.registerAddress" ></mt-field>
        </div>
        <div class="upload-cotent">
            <div class="upload-img" v-if="img0002!=''&&(datas.merType=='00'||datas.merType=='01')">
                <h5 class="title">营业执照</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0002" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传营业执照证的正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0002)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0006!=''&&(datas.merType=='00')">
                <h5 class="title">开户许可证</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0006" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传开户许可证正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0006)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0008!=''">
                <h5 class="title">收银台照</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0008" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传收银台照正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0008)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0099!=''">
                <h5 class="title">经营场景照</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0099" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传经营场景照正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0099)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="upload-img" v-if="img0003!=''">
                <h5 class="title">税务登记证</h5>
                <div class="img-con">
                    <div class="img-box">
                        <img :src="img0003" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传税务登记证正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0003)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0004!=''">
                <h5 class="title">组织机构代码证</h5>
                <div class="img-con">
                    <div class="img-box">
                        <img :src="img0004" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传组织机构代码证正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0004)">查看</button>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="upload-img" v-if="img0005!=''&&(datas.merType=='00'||datas.merType=='01')">
                <h5 class="title">门店照片</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0005" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传门店正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0005)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0007!=''&&(datas.merType=='02')" >
                <h5 class="title">法人正面照片</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0007" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传法人正面照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0007)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-if="img0015!=''" >
                <h5 class="title">经营场所室内照片</h5>
                <div class="img-con">
                    <!-- <span class="legend"><i class="legend-text">例</i></span> -->
                    <div class="img-box">
                        <img :src="img0015" alt="">
                    </div>
                    <div class="upload-box">
                        <div class="upload-btn">
                            <p class="upload-text">1.请上传经营场所室内照片</p>
                            <p class="upload-text">2.上传的照片必须清晰</p>
                            <button @click="enlargeImg(img0015)">查看</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <button class="btns">提交</button>
        <div class="select-box" v-show="isShow">
            <div class="select-con">
                <mt-picker :slots="slots" :showToolbar="showToolbar" ref="genderPicker">
                    <div class="select-btn">
                        <span class="cancle-btn" @click="closeSelect">取消</span>
                        <span class="sure-btn" @click="genderConfirm">确定</span>
                    </div>
                </mt-picker>
            </div>
        </div> -->
        <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade" style="width:90%">
            <img :src="largeImg">
        </mt-popup>
        <kf-con></kf-con>
    </div>
</template>
<script>
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
            isShow:false,
            typeData:[{values: ['五金', '饰品', '视频', '食品', '时频']}],
            provinceData:[{values: ['年假', '事假', '病假', '婚假', '其他']}],
            cityData:[{values: ['湖北', '武汉', '皇室', '孝感', '孝昌']}],
            areaData:[{values: ['你好', '我好', '他好', '很好', '不好']}],
            slots:[],
            typeText:'企业商户',
            provinceText:'湖北省',
            cityText:'武汉市',
            areaText:'硚口区',
            selectIndex:0,
            showToolbar:true,
            imgArr:[],
            img0002:'',
            img0003:'',
            img0004:'',
            img0005:'',
            img0006:'',
            img0007:'',
            img0008:'',
            img0099:'',
            img0015:'',
            popupVisible:false,
            datas:'',
            largeImg:'',
            acct_type:'',
        }
    },
    components:{
        kfCon
    },
    created(){
        if(sessionStorage.getItem('userInfo')){
            this.datas = JSON.parse(sessionStorage.getItem('userInfo'));
        }
        if(sessionStorage.getItem('imgArr')){
            this.imgArr = JSON.parse(sessionStorage.getItem('imgArr'));
        }
    },
    mounted(){
        document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML='银联商户入驻';
        if(this.datas==''){
        }else{
            this.setImgArr();
        }
    },
    methods: {
        // 查看大图
        enlargeImg(img){
            this.largeImg = img;
            this.popupVisible =true;
        },
        //显示选择框并且屏幕不能滚动
        showSelect(index){
            switch(index){
                case 1:
                  this.slots = this.typeData;
                  break;
                case 2:
                  this.slots = this.provinceData;
                  break;
                case 3:
                  this.slots = this.cityData;
                  break;
                case 4:
                  this.slots = this.areaData;
                  break;
            }
            this.isShow = true;
            this.selectIndex = index;
            document.body.style.overflow="hidden";
        },
        setImgArr(){
            let data = this.imgArr;
            for(var i = 0;i<data.length;i++){
                if(data[i].type=='0002'){
                    this.img0002 = data[i].url;
                }else if(data[i].type=='0003'){
                    this.img0003 = data[i].url;
                }else if(data[i].type=='0004'){
                    this.img0004 = data[i].url;
                }else if(data[i].type=='0005'){
                    this.img0005 = data[i].url;
                }else if(data[i].type=='0006'){
                    this.img0006 = data[i].url;
                }else if(data[i].type=='0007'){
                    this.img0007 = data[i].url;
                }else if(data[i].type=='0008'){
                    this.img0008 = data[i].url;
                }else if(data[i].type=='0099'){
                    this.img0099 = data[i].url;
                }
                else if(data[i].type=='0015'){
                    this.img0015 = data[i].url;
                }
            }
            sessionStorage.setItem('imgArr',JSON.stringify(this.imgArr));
        },
        //隐藏显示框且屏滚动
        closeSelect(){
            this.isShow = false;
            document.body.style.overflow="auto";
        },
        genderConfirm () { // 性别选择确定
        let values = this.$refs.genderPicker.getValues()[0];
        switch(this.selectIndex){
            case 1:
                this.typeText = values;
                break;
            case 2:
                this.provinceText = values;
                break;
            case 3:
                this.cityText = values;
                break;
            case 4:
                this.areaText = values;
                break;
        }
        // this.userData.gender = this.$refs.genderPicker.getValues()[0]
        this.isShow = false;
         document.body.style.overflow="auto";
      }
    },
}
</script>
<style>
    body{
        background-color:#f5f5f5;
    }
    .uploading .user-content{
        margin:.6667rem 0;
    }
    .uploading .mint-cell{
        /* border-bottom:.0444rem solid #eee; */
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
        /* margin-bottom:2.2222rem; */
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
    .uploading .select-list{
        position:relative;
        padding:8px 30px 8px 10px;
        border:.0444rem solid #eee;
        border-radius:5px;
    }
    .uploading .select-list:after{
        display:block;
        content:"";
        position:absolute;
        right:10px;
        top:50%;
        margin-top:-10px;
        width: 10px;
        height: 10px;
        border:#ccc solid;
        border-width: 1px 1px 0 0;
        transform: rotate(135deg);
        /* margin-bottom: 10px; */

    }
    .uploading .select-box{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.5);
    }
    .uploading .select-box .select-con{
        position:absolute;
        left:0;
        bottom:0;
        width:100%;
        background-color:#fff;
    }
    .uploading .select-box .select-btn{
        display:flex;
        justify-content: space-between;
        padding:10px 20px;
        font-size:.6667rem;
        background-color:#e6e6e6
    }
    .uploading .select-box .sure-btn{
        color:#2696ff;
    }
    .uploading .select-box .cancle-btn{
        color:#4c4c4c;
    }
</style>
