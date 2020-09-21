<template>
    <div class="page">
        <div class="box">
            <div class="hd">
                <img @click="goBack" :src="require('../../assets/images/leftbtn.png')" class="icon_3"/>
                <span class="txt" :lines="1">{{['总部统筹官入驻','新发展商入驻','发展商入驻','区域统筹官入驻','区域批发商入驻','下游商家入驻','入驻省统筹官'][(Number(applyType)-1)]}}</span>
            </div>
            <!-- 发展线需要填入的内容 -->
            <!-- 1总部统筹官,2新发展商,3发展商  4区域统筹官,5区域批发商 -->
            <div v-if="applyType==2||applyType==3||(applyType==5&&sharetype!=4)">
                <div class="bd">
                    <div class="group" >
                        <span class="label" :lines="1">申 请 人 ：</span>
                        <input v-model="username" class="text"  type="text" value="" placeholder="请输入您的姓名" />
                    </div>
                    <div class="group" >
                        <span class="label" :lines="1">身份证号：</span>
                        <input v-model="cartCode" class="text"  type="text" value="" placeholder="请输入身份证号码" />
                    </div>
                    <div class="group">
                        <span class="label" :lines="1">手 机 号 ：</span>
                        <input v-model="phone" class="text" :readonly="isReload" @blur="phoneRegister"  type="text" value="" placeholder="请输入手机号码" />
                        <p v-if="!isRegisterPhone" class="icon tuxing" @click="getCode(1)">获取图形码</p>
                    </div>
                    <div  v-if="!isRegisterPhone" class="group"  >
                        <span class="label" :lines="1">图形验证：</span>
                        <input v-model="imgcode" class="text codeInput"  type="text"   value="" placeholder="请输入图像验证码" />
                        <img  :src="imgCode" class="valcode" alt="">
                    </div>
                    <div v-if="!isRegisterPhone" class="group" >
                        <span class="label" :lines="1">验 证 码 ：</span>
                        <input v-model="code" class="text"  type="text"  value="" placeholder="请输入验证码" />
                        <p class="icon" @click="getCode(2)" >{{second||'获取验证码'}}{{second?"s":""}}</p>
                    </div>
                    <div class="group">
                        <span class="label" :lines="1">密 码 ：</span>
                        <input  v-model="password" class="text" type="password" ref="psd" value="" placeholder="请输入密码" />
                        <img  :src="require('../../assets/images/look1.png')" @click="lookPsd('psd')" class="icon-img">
                    </div>
                    <!--判断当前账号是否已经注册过账号-->
                    <div v-if="!isRegisterPhone" class="group none-b" >
                        <span class="label" :lines="1">确认密码：</span>
                        <input v-model="passwordTwo"  class="text" ref="psd2" type="password" value="" placeholder="请再次输入密码" />
                        <img  @click="lookPsd('psd2')" :src="require('../../assets/images/look2.png')" class="icon-img">
                    </div>
                </div>
                <p v-if="isRegisterPhone" class="isRegisterPhone">当前手机号已注册过，请输入密码</p>
            </div>
            <!-- 管理线需要填入的内容 -->
            <div v-else class="Administration">
                <div class="bd">
                    <div class="group">
                        <span class="label" :lines="1">手 机 号 ：</span>
                        <input v-model="phone" class="text" :readonly="identity.roleType||isReload" @blur="phoneRegister"  type="text" value="" placeholder="请输入手机号码" />
                    </div>
                    <!--判断当前账号是否已经注册过账号-->
                    <div class="group">
                        <span class="label" :lines="1">确认密码：</span>
                        <input  v-model="password" :readonly="identity.roleType" class="text" type="password" ref="psd" value="" placeholder="请输入供应链密码" />
                        <p v-if="!identity.roleType" @click="getCode(3)"  class="icon tuxing">查询身份</p>
                    </div>
                    <div class="group identity" >
                        <span class="label" :lines="1">当前身份：</span>
                        <div v-if="!identity.roleType" class="text">验证身份</div>
                        <div v-else class="text">{{identity.roleName}}</div>
                    </div>
                    <div class="group" >
                        <span class="label" :lines="1">申 请 人 ：</span>
                        <input v-model="username" :readonly="identity.name" :placeholder="identity.roleType&&!identity.name?'请填写':'请验证手机号'" class="text"  type="text" value=""/>
                    </div>
                    <div class="group" >
                        <span class="label" :lines="1">身份证号：</span>
                        <input v-model="cartCode" :readonly="identity.identityCard" :placeholder="identity.roleType&&!identity.identityCard?'请填写':'请验证手机号'" class="text" type="text" value=""/>
                    </div>
                </div>
                <p v-if="isRegisterPhone" class="isRegisterPhone">当前手机号已注册过，请输入密码</p>
            </div>
            <div v-if="applyType==5&&sharetype!=4" class="main upload">
                <span class="label" :lines="1">营业执照照片：</span>
                <div class="text">
                    <!-- 点击放大图片 -->
                    <img v-if="licenseImg" :src="licenseImg" class="alertImg" alt="" @click="showImg('licenseImg')">
                    <input @change="upImg('licenseImg')" accept="image/*" type="file"  ref="licenseImg" class="img-file">
                    <span class="title_6 line1" :lines="1">{{licenseImg?'查看':'请上传'}}</span>
                    <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                </div>
            </div>
            <div v-if="applyType==5&&sharetype!=4" class="main noneTop upload" >
                <span class="label" :lines="1">店铺门头照片：</span>
                <div class="text">
                    <!-- 点击放大图片 -->
                    <img v-if="shopFacadeImg" :src="shopFacadeImg" class="alertImg"  alt="" @click="showImg('shopFacadeImg')">
                    <input @change="upImg('shopFacadeImg')" accept="image/*" type="file"  ref="shopFacadeImg" class="img-file">
                    <span class="title_6 line1" :lines="1">{{shopFacadeImg?'查看':'请上传'}}</span>
                    <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                </div>
            </div>
            <!-- 负责区域选择dom -->
            <div @click="bindtap" v-if="applyType!=1" class="main">
                <span class="label" :lines="1">申请负责区域：</span>
                <div class="text">
                    <span class="title_6 line1" :lines="1">{{cityAddress||'请选择负责区域'}}</span>
                    <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                </div>
            </div>
            <!-- 区域选择dom -->
            <div  @click="bankfn()" :class="applyType==1?'main':'main type'">
                <span class="label" :lines="1">行 业 ：</span>
                <div class="text">
                    <span class="title_6 line1" :lines="1">{{bank||'请选择'}}</span>
                    <img :src="require('../../assets/images/right2.png')" class="icon-img" >
                </div>
            </div>
            <div class="submain">
                <span class="word_6" :lines="1">入驻流程:</span>
                <p class="title_7" :lines="1"
                >用户邀请-平台审核-签约-开户赚钱之路</p>
            </div>
            <div class="row">
                <img @click="handleChange" v-if="checked" :src="require('../../assets/images/button_def_choose.png')" alt="" class="checked" >
                <img  @click="handleChange" v-else="checked" :src="require('../../assets/images/button_del_choose.png')" alt="" class="checked">
                <span @click="handleChange" :lines="1" class="info" >我已阅读并同意</span>
                <span class="info_2" :lines="1" @click="changePdfShow">《区域批发用户协议》</span>
            </div>
            <!--1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官-->
            <!-- 2 3 -->
            <el-button v-if="applyType==2||applyType==3||(applyType==5&&sharetype!=4)"  @click="submit"  class="ft"  v-preventReClick><span class="text_4" :lines="1">抢先申请</span></el-button>
            <el-button v-else @click="adminSubmit"  :class="!identity.roleType?'ftActive':'ft'"  v-preventReClick><span class="text_4" :lines="1">抢先申请</span></el-button>
        </div>
        <!--行业弹窗-->
        <mt-popup v-model="bankVisible" position="bottom" :closeOnClickModal="false">
            <div class="visiblebtn">
                <!--<mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>-->
                <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="bankslots" value-key="name" @change="bankchange" ></mt-picker>
        </mt-popup>
        <!-- 是否显示地址选择 -->
        <div v-if="showAddress">
            <addressa @bindtap="bindtap"></addressa>
        </div>
        <div v-if="pdfShow" class="show" @click="changePdfShow"></div>
        <!-- 是否显示协议内容 -->
        <div v-if="pdfShow" class="pdfShow">
            <p class="arrow">
                <!-- // 上一页 -->
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
                {{currentPage}} / {{pageCount}}
                <!-- // 下一页 -->
                <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">下一页</span>
            </p>
            <div @click="changePdfShow">
                <pdf :src="xieyiUrl"
                     :page="currentPage"
                     @num-pages="pageCount=$event"
                     @page-loaded="currentPage=$event"
                     @loaded="loadPdfHandler"
                ></pdf>
            </div>
        </div>
        <!-- 显示图片大图 -->
        <transition name="show">
            <div class="alert" v-if="showImgUrl">
                <div @click="delImg" class="bgc"></div>
                <img @click="delImg" class="close" src="../../assets/images/wholesale/close-icon.png" alt="">
                <div class="img-box" @click="delImg">
                    <img v-if="showImgUrl=='shopFacadeImg'" :src="shopFacadeImg" alt="">
                    <img v-if="showImgUrl=='licenseImg'" :src="licenseImg" alt="">
                    <p @click="delImg(showImgUrl)">删除图片</p>
                </div>
            </div>
        </transition>
        <banner :showBanner.sync="isShow"></banner>
    </div>
</template>

<script>
    import pdf from 'vue-pdf'
    import { Toast,Indicator,Popup} from 'mint-ui';
    import 'mint-ui/lib/style.css'
    import addressa from './blockAddress';
    import banner from '@/components/block/banner';
    var verification = {
        nameReg: /^[\u4E00-\u9FA5]{2,6}$/,
        phoneReg:/^1(3|4|5|6|7|8|9)\d{9}$/,
        cartCode: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    };
    export default {
        name: "applyRecord",
        data:()=>({
            xieyiUrl:"http://dfs2.520shq.com:80/group1/M00/07/8C/wKgAC18tLD6AVdpKAAJAd0N-Ujo688.pdf",
            currentPage: 1, // pdf文件页码
            pageCount: 12, // pdf文件总页数
            // 是否显示pdf
            pdfShow : false,
            // 是否显示行业弹窗
            bankVisible: false,
            // 当前选中的行业
            bankModel: {},
            bank:"",
            // 申请人名称
            username: "",
            // 身份证号码
            cartCode: "",
            // 手机号
            index :0,
            phone: "",
            // 验证码
            code: "",
            // 密码
            password:"",
            // 确认密码
            passwordTwo: "",
            // 2.0 申请入驻的类型 例如： 1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官
            // 1.0                   1总部统筹官,2新发展商,3发展商,4统筹官,5区域批发商,6下游商家
            applyType: 4,
            // 是否阅读协议
            checked: false,
            // 验证码图片
            imgCode: "",
            // 验证码号
            imgcode: "",
            // 负责的批发区域
            cityAddress: "",
            // 是否显示地址
            showAddress: false,
            // 省市区列表
            addressList: [],
            // 短信发送倒计时
            second: 0,
            // 是否显示已经注册过手机号
            isRegisterPhone: false,
            // 分享者的seq
            shareSeq: "",
            // 行业弹窗设置
            bankslots:[
                {
                    flex: 1,
                    values: [],
                    className: 'bankslot',
                    textAlign: 'center',
                    defaultIndex:5
                }
            ],
            model:{},
            // 分享者的身份类型
            sharetype: 0,
            // 是否是重新修改提交
            isReload: false,
            // 管理线获取当前身份信息
            identity:{},
            // 营业执照
            // http://ndhimg.520shq.com//UploadFile/YY/20191118/2019111817321588507.jpeg
            licenseImg: "",
            // 店铺门头图片
            // http://ndhimg.520shq.com//UploadFile/YY/20191118/2019111817321588507.jpeg
            shopFacadeImg: "",
            // 是否显示查看大图
            showImgUrl: "",
            // 如果是区域批发商入驻则展示海报
            isShow: false
        }),
        components:{
            addressa: addressa,
            pdf,
            banner
        },
        created() {
            // 获取当前url中参数
            var {
                shareId,  // 分享者的seq 从分享进入的会有值
                type,
                isReload,
                sharetype
            } = this.$route.query;
            this.shareSeq = shareId || "";
            this.applyType = type || "";
            this.sharetype = sharetype || "";
            if (this.applyType==5) {
                this.isShow = true
            }
            // 判断是否是重新提交审核数据
            if (sessionStorage.getItem("apply") && JSON.parse(sessionStorage.getItem("apply"))&&isReload){
                var apply = JSON.parse(sessionStorage.getItem("apply"));
                // 获取身份证号码
                this.cartCode = apply.identityCard;
                // 获取用户用户姓名
                this.username = apply.name;
                this.isReload = true;
                // 获取手机号
                this.phone = apply.phone;
                this.phoneRegister();
                this.sharetype = apply.shareIdentityType;
                this.shareSeq = apply.shareSeq;
                // 营业执照照片
                if (apply.licenseImg) {
                    this.licenseImg = apply.licenseImg;
                }
                // 营业执照照片
                if (apply.shopFacadeImg) {
                    this.shopFacadeImg = apply.shopFacadeImg;
                }
                var arr = [];
                var str = "";
                str += apply.regionCityName+apply.regionProvinceName+apply.regionDistrictName+apply.regionStreetName;
                arr[0] = {
                    name: apply.regionCityName,
                    id: apply.regionCityId
                };
                arr[1] = {
                    name: apply.regionProvinceName,
                    id: apply.regionProvinceId
                };
                arr[2] = {
                    name: apply.regionDistrictName,
                    id: apply.regionDistrictId
                };
                arr[3] = {
                    name: apply.regionStreetName,
                    id: apply.regionStreetId
                };
                this.addressList = arr;
                this.cityAddress = apply.regionDetails;
                this.bankModel = {
                    id : apply.categoryId,
                    name : apply.categoryName,
                };
                this.bank = apply.categoryName
            } else {
                var str = "";
                var address = sessionStorage.getItem("cityAddress")?JSON.parse(sessionStorage.getItem("cityAddress")):[];
                var arr = [];
                Object.keys(address).map((item,index)=>{
                    str += address[item].name||"";
                    if (address[item].name) {
                        arr.push(address[item])
                    }
                });
                this.addressList = arr;
                this.cityAddress = str;
            }

            this.getType();
        },

        mounted() {
            // 2.0版本： 1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官
        },
        computed:{
        },
        filters:{
            formatTime (time) {
                return new Date(time).Format('yyyy-MM-dd')
            },
        },
        methods:{
            // 删除图片
            delImg(type) {
                if (type){
                    this[type] = "";
                }
                this.showImgUrl = ""
            },
            // 点击图片放大
            showImg(type) {
                this.showImgUrl = type;
            },
            // 更改协议的显示隐藏
            changePdfShow(){
              this.pdfShow = !this.pdfShow
            },
            // pdf加载时
            loadPdfHandler (e) {
                this.currentPage = 1 // 加载的时候先加载第一页
            },
            // 点击上一页和下一页协议事件
            changePdfPage (val) {
                if (val === 0 && this.currentPage > 1) {
                    this.currentPage--
                }
                if (val === 1 && this.currentPage < this.pageCount) {
                    this.currentPage++
                }
            },
            // 获取行业数据
            getType() {
                axios.get(this.blockURL + '/qypfs-user/currency/category').then(res => {
                    if (res.data.code == 200) {
                        var bankslots = this.bankslots;
                        bankslots[0].values = res.data.data || [];
                        this.bankslots = bankslots;

                    }
                });
            },
            // 点击行业显示行业弹窗
            bankfn(){
                // 如果是合并管理和统筹的话
                if (this.applyType==5&&this.sharetype==4&&this.bank) {
                    return false;
                }
                this.bankVisible = true;
            },
            bankzhfn(){
                if(this.bankname==''){
                    return false;
                }
                return true;
            },
            // 点击行业中的确定按钮
            quedingfn(){
                if(this.bankVisible){
                    this.bankVisible = false;
                    this.bankId = this.bankModel?this.bankModel.id:'';
                    this.bank = this.bankModel?this.bankModel.name:'';
                    return true;
                }else if(this.typeVisible){
                    this.typeVisible = false;
                    this.type = this.typeModel;
                    return true;
                }
            },
            // 点击行业中的取消按钮
            quxiaofn(){
                if(this.bankVisible){
                    this.bankVisible = false;
                    if (this.bankId=='') {
                        return false;
                    }
                }else if(this.typeVisible){
                    this.typeVisible = false;
                    if(this.bank==''){
                        return false;
                    }
                }
            },
            // 更改行业事件
            bankchange(picker, values){
                var {
                    isReload,
                } = this.$route.query;
                    // 判断是否是重新提交审核数据
                if (this.bankslots[0].values.length){
                    let index = this.index;
                    if (sessionStorage.getItem("apply") && JSON.parse(sessionStorage.getItem("apply"))&&isReload&&index==0){
                        var apply = JSON.parse(sessionStorage.getItem("apply"));
                        var data = this.bankslots[0].values;
                        for (let i=0;i<data.length; i++){
                            if (data[i].name==apply.categoryName){
                                this.bankModel = data[i];
                                if(this.bankslots[0].values.length){
                                    this.bankModel = data[i];
                                    this.index = 1;
                                }
                                break;
                            }
                        }
                    } else{
                        this.bankModel = values[0];
                        return true;
                    }
                }

            },
            // 是否已经注册
            phoneRegister() {
                var isNofilterType = [1,4,7].indexOf(Number(this.applyType))==-1;
                if (verification.phoneReg.test(Number(this.phone)) && isNofilterType && !(this.applyType==5&&this.sharetype==4)) {
                    axios.get(this.blockURL+`/qypfs-user/auth/ifRegister?mobile=${this.phone}`,{}).then((res)=>{
                        if (res.data.code==200){
                            this.isRegisterPhone = res.data.data;
                        } else {
                            this.isRegisterPhone = false;
                        }
                    }).catch(err=>{
                    })
                }
            },
            // 子组件选择负责区域点击返回的时候
            bindtap() {
                // 如果是合并管理和统筹的话
                if (this.applyType==5&&this.sharetype==4) {
                    return false;
                }
                this.showAddress = !this.showAddress;
                var str = "";
                var address = sessionStorage.getItem("cityAddress")?JSON.parse(sessionStorage.getItem("cityAddress")):[];
                var arr = [];
                Object.keys(address).map((item,index)=>{
                    str += address[item].name||"";
                    if (address[item].name) {
                        arr.push(address[item])
                    }
                });
                this.addressList = arr;
                this.cityAddress = str;
            },
            // 点解阅读协议切换协议
            handleChange(){
               this.checked = !this.checked;
            },
            // 获取验证码
            getCode(type) {
                // 请求获取随机图形验证码
                if (!verification.phoneReg.test(Number(this.phone))){
                    Toast({message: "手机号格式有误",position: 'bottom',duration: 2000});
                    return false
                }
                // 发送随机图形码
                const getValidateCode =() => {
                    axios.get(this.blockURL+`/qypfs-user/currency/validateCode?mobile=${this.phone}`,{
                        responseType: 'arraybuffer'
                    }).then(res=>{
                        this.imgCode = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                    }).catch(err=>{

                    })
                };
                // 发送短信验证码
                const sendCode = () =>{
                    if (this.second){
                        return false;
                    }
                    // 验证码图形验证码的合法性
                    if (this.imgcode.length!=4||!/^\d{4}$/.test(this.imgcode)){
                        Toast({message: "图形码有误",position: 'bottom',duration: 2000});
                        return false
                    }
                    axios.post(this.blockURL+`/qypfs-user/currency/sendCode`,{
                        code: this.imgcode,
                        mobile: this.phone,
                        state: 0
                    }).then(res=>{
                        if (res.data.code == 200){
                            Toast({message: "验证码发送成功",position: 'middle',duration: 2000});
                            var that = this;
                            this.second = 60;
                            var timer = setInterval(()=>{
                                that.second = that.second-1<0?0:that.second-1;
                                if (that.second==0){
                                    clearInterval(timer);
                                }
                            },1000)

                        } else {
                            Toast({message:res.data.message ,position: 'bottom',duration: 2000});
                        }
                    }).catch(err=>{});
                };
                // 查询用户的身份
                const getIdentity = () =>{
                    if (!this.password){
                        this.alertToast("请输入密码");
                        return false
                    }
                    Indicator.open();
                    // 1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官
                    var type = 1;
                    let obj=['5&4','4&1','4&7'];
                    let isGet = obj.filter(item=>item==this.applyType+"&"+this.sharetype);
                    type = isGet.length?2:1;
                    if (this.applyType==7&&this.sharetype==1) {
                        type = 1
                    }
                    axios.post(this.blockURL+`/qypfs-user/auth/query/user`,{
                        password: this.password,
                        phone:this.phone,
                        // 判断是统筹线还是管理线
                        type: type
                    }).then(res=>{
                        if (res.data.code == 200){
                            var data = res.data.data;
                            this.identity = data;
                            // 回显申请人名称
                            this.username = data.name;
                            // 回显身份证号码
                            this.cartCode = data.identityCard;
                            // 回显行业
                            this.bankModel = {
                                id : data.categoryId,
                                name : data.categoryName,
                            };
                            // 重新赋值地址
                            var arr = [
                                {   name: data.regionProvinceName,
                                    id: data.regionProvinceId
                                },
                                {   name: data.regionCityName,
                                    id: data.regionCityId
                                },
                                {   name: data.regionDistrictName,
                                    id: data.regionDistrictId
                                },
                                {   name: data.regionStreetName,
                                    id: data.regionStreetId
                                }
                            ];
                            var newArr = [];
                            var str = "";
                            for (var i=0; i<arr.length; i++){
                                if (arr[i].name) {
                                    str += arr[i].name||"";
                                    newArr.push(arr[i])
                                }
                            }
                            Indicator.close();
                            this.addressList = newArr;
                            this.cityAddress = str;
                            // this.cityAddress = data.regionDetails;
                            this.index = 1;
                            this.bank = data.categoryName
                        } else {
                            Indicator.close();
                            Toast({message:res.data.message ,position: 'bottom',duration: 2000});
                        }
                    }).catch(err=>{
                        Indicator.close();
                    });
                };
                // 参数说明：
                 // 1 请求获取图形验证码图片
                 // 2 请求发送短信验证码
                 // 3 发展线中查询身份信息
                switch (type) {
                    case 1:
                        getValidateCode();
                        break;
                    case 2:
                        sendCode();
                        break;
                    case 3:
                        getIdentity();
                        break;
                }
            },
            alertToast(message){
                Toast({message: message,position: 'bottom',duration: 2000});
            },
            // 管理线入驻提交数据
            async adminSubmit(){
                // 是否已经查询身份
                if (!this.identity.roleType){
                    this.alertToast("请先验证身份");
                    return false;
                }
                var {username,cartCode,phone,password} = this;
                if (!verification.phoneReg.test(Number(phone))){
                    this.alertToast("手机号格式有误");
                    return false
                }
                if (!password){
                    this.alertToast("请输入密码");
                    return false
                }
                // // 姓名验证规则
                if (!verification.nameReg.test(username)){
                    this.alertToast("申请人姓名格式有误");
                    return false
                }
                if (!verification.cartCode.test(cartCode) ){
                    this.alertToast("身份证号码格式有误");
                    return false
                }
                // 入驻总部统筹官不需要填写区域
                if (!this.addressList.length&&this.applyType!=1){
                    // 13500002037
                    this.alertToast("请选择负责区域");
                    return false
                }
                if (!this.checked){
                    this.alertToast("请阅读并同意相关协议");
                    return false
                }
                if (!this.shareSeq||!this.sharetype||!this.applyType) {
                    this.alertToast("缺少推荐人信息");
                    return false
                }
                if (!this.bank||!this.bankModel||!this.bankModel.id) {
                    this.alertToast("请选择行业");
                    return false
                }
                // 统筹线入驻
                if (this.applyType==5&&this.sharetype==4) {
                    Indicator.open();
                    // 提交注册的信息
                    axios.post(this.blockURL+`/qypfs-user/auth/govern?mobile=${phone}&shareSeq=${this.shareSeq}`).then((res)=>{
                        Indicator.close();
                        if (res.data.code==200){
                            this.$router.push({path:`/block/applylist`});
                            sessionStorage.setItem("applyPhone",phone);
                            sessionStorage.setItem("cityAddress","");
                        } else {
                            Toast({message: res.data.message,position: 'middle',duration: 2000});
                        }
                    }).catch(err=>{
                        Indicator.close();
                    })
                // 管理线入驻
                } else {
                    let data = {
                        phone: phone, // 手机号
                        regionProvinceId: this.addressList[0].id, // 省id
                        regionProvinceName: this.addressList[0].name, // 省
                        registerIdentityType: this.applyType, //1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官
                        shareIdentityType: this.sharetype,  // 分享的身份类型 1总部统筹官,2新发展商,3发展商,4区域统筹官,5区域批发商,6下游商家,7省统筹官
                        shareSeq: this.shareSeq, // 分享人 5761040
                        categoryId: this.bankModel.id, // 行业的id
                        categoryName: this.bankModel.name, // 行业名称
                        nickname: username, // 用户昵称
                        identityCard: cartCode, // 身份证
                    };
                    // 是否是总部统筹官邀请总部统筹官
                    if (this.sharetype==1&&this.applyType==1){
                        data.regionProvinceId = 1; // 省id
                        data.regionProvinceName = "全国"; // 省
                    } else {
                        if (this.addressList[1]){
                            data.regionCityId = this.addressList[1].id; // 市id
                            data.regionCityName = this.addressList[1].name;// 市id
                        }
                        if (this.addressList[2]){
                            data.regionDistrictId = this.addressList[2].id;// 区id
                            data.regionDistrictName = this.addressList[2].name; //区
                        }
                        if (this.addressList[3]){
                            data.regionStreetId = this.addressList[3].id; // 街道id
                            data.regionStreetName = this.addressList[3].name; // 街道
                        }
                    }
                    Indicator.open();
                    // 提交注册的信息
                    axios.post(this.blockURL+`/qypfs-user/auth/manage/apply`,data).then((res)=>{
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
                }
            },
            // 发展线点击申请提交表单 2 3
            async submit() {
                // 入驻信息验证
                var {username,cartCode,phone,code,password,passwordTwo} = this;
                // 姓名验证规则
                if (!verification.nameReg.test(username)){
                    this.alertToast("申请人姓名格式有误");
                    return false
                }
                if (!verification.phoneReg.test(Number(phone))){
                    Toast({message: "手机号格式有误",position: 'bottom',duration: 2000});
                    return false
                }
                // 验证手机号是否已经注册
                var isRegister =  new Promise(resolve => {
                    axios.get(this.blockURL+`/qypfs-user/auth/ifRegister?mobile=${this.phone}`,{}).then((res)=>{
                        if (res.data.code==200){
                            this.isRegisterPhone = res.data.data;
                            resolve(res.data.data);
                        } else {
                            this.isRegisterPhone = false;
                            resolve(res.data.data);
                        }
                    }).catch(err=>{});
                });
                isRegister.then(res=>{
                    var isRegisterPhone = res;
                    if (!verification.cartCode.test(cartCode) ){
                        this.alertToast("身份证号码格式有误");
                        return false
                    }
                    if (!code && !isRegisterPhone){
                        this.alertToast("请输入验证码");
                        return false
                    }
                    if (!password){
                        this.alertToast("请输入密码");
                        return false
                    }
                    if (!passwordTwo && !isRegisterPhone){
                        this.alertToast("请输入确认密码");
                        return false
                    }
                    if (passwordTwo!=password && !isRegisterPhone){
                        this.alertToast("两次密码格式不相同");
                        return false
                    }
                    if (this.addressList.length!=4){
                        this.alertToast("请选择完整的负责区域");
                        return false
                    }
                    if (!this.checked){
                        this.alertToast("请阅读并同意相关协议");
                        return false
                    }
                    if (!this.shareSeq||!this.sharetype||!this.applyType) {
                        this.alertToast("缺少推荐人信息");
                        return false
                    }
                    if (!this.bank||!this.bankModel||!this.bankModel.id) {
                        Toast({message: "请选择行业",position: 'bottom',duration: 2000});
                        return false
                    }
                    let data = {
                        nickname: username, // 用户昵称
                        identityCard: cartCode, // 身份证
                        phone: phone, // 手机号
                        code: code||"", // 验证码
                        password: password, // 密码
                        regionCityId: this.addressList[1].id, // 市id
                        regionCityName: this.addressList[1].name ,// 市id
                        regionDistrictId: this.addressList[2].id ,// 区id
                        regionDistrictName: this.addressList[2].name, //区
                        regionProvinceId: this.addressList[0].id, // 省id
                        regionProvinceName: this.addressList[0].name, // 省
                        regionStreetId: this.addressList[3].id, // 街道id
                        regionStreetName: this.addressList[3].name, // 街道
                        registerIdentityType: this.applyType, //1.总部统筹官,新发展商,3.发展商,4统筹官,5区域批发商,6下游商家
                        shareIdentityType: this.sharetype,  // 分享的身份类型 1.总部统筹官,新发展商,3.发展商,4统筹官,5区域批发商,6下游商家
                        shareSeq: this.shareSeq, // 分享人 5761040
                        categoryId: this.bankModel.id, // 行业的id
                        categoryName: this.bankModel.name // 行业名称
                    };
                    // 2020.07.13  区域批发商2.1版本新增
                    // 判断是否入驻区域批发商
                    // 需要传递营业执照和门店照片
                    if (this.applyType==5){
                        let {licenseImg,shopFacadeImg} = this;
                        if (!licenseImg) {
                            this.alertToast("请上传营业执照");
                            return false;
                        }
                        if (!shopFacadeImg) {
                            this.alertToast("请上传店铺门头照片");
                            return false;
                        }
                        data.licenseImg = licenseImg;
                        data.shopFacadeImg = shopFacadeImg;
                    }
                    Indicator.open();
                    // 提交注册的信息
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
                }).catch(err=>{})
            },
            // 图片上传
            upImg(type){
                console.log(66)
                let f = this.$refs[type].files[0];
                let param = new FormData();
                param.append('file',f);
                Indicator.open();
                axios.post('http://upload.520shq.com/upload',param).then(res => {
                    if(res.data.code == 200){
                        this[type] = res.data.data.url;
                        this.$previewRefresh()
                    }else{
                        showToast(res.data.message)
                    }
                    Indicator.close();
                }).catch(()=>{Indicator.close();});
            },
            // 点击返回按钮事件
            goBack() {
                if (history.length>1){
                    history.go(-1)
                } else {
                    this.$router.push({path:'/login'});
                }
            },
            // 点击展示密码按钮事件
            lookPsd(type) {
                this.$refs[type].type = this.$refs[type].type=="text"?"password":"text";
            }
        },
    }
</script>

<style scoped>
    .ftActive{
        height: 2.27rem;
        background:rgba(209,209,209,1) !important;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        color:rgba(102,102,102,1) !important;
        text-align: center;
    }
    .title_6{
        color: rgba(100,100,100,1);
    }
    .Administration .group .icon{
        height: 1.36rem;
        line-height: 1.36rem;
        width:3.18rem;
        height:1.36rem;
        border:0.03rem solid rgba(255,96,35,1) !important;
        border-radius: 0.2rem;
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,96,35,1) !important;
        right: 0;
    }
    .identity{
        display: flex;
        justify-content: space-between;
    }
    .identity .text{
        color: rgba(100,100,100,1) !important;
    }
    .arrow{
        margin-top: 10px;
        color: #fff;
        text-align: center;
        margin-bottom: 10px;
    }
    .show{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.5);
        z-index: 1000;
    }
    .pdfShow{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.5);
        z-index: 1001;
    }
    .isRegisterPhone{
        font-size:0.59rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,95,35,1);
        padding: 0.2rem 0 0 0.45rem;
    }
    .tuxing{
        background-color: transparent !important;
        color: rgba(255,0,0,1) !important;
    }
    .codeInput{
        width: 7rem;
    }
    .valcode{
        width: 4rem;
        height: 1.5rem;
        position: absolute;
        right: 0.45rem;
        top: 0.3rem;
        border: none;
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
    }
    .group .label{
        width: 3.4rem;
        font-size: 0.68rem;
    }
    .group .text{
        font-size:0.68rem;
        font-weight:normal;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        padding-left: 0.5rem;
    }
    .group .text:placeholder{
        color:#666666FF
    }
    .group .icon{
        width:3.86rem;
        height:1.36rem;
        line-height: 1.36rem;
        background:rgba(255,0,0,1);
        border-radius:0.18rem;
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
        position: absolute;
        right: 0.4rem;
        margin-top: -0.2rem;
    }
    .group .icon-img{
        width:1.1rem;
        height:0.6rem;
        line-height: 1.36rem;
        position: absolute;
        right: 0.4rem;
        margin-top: 0.1rem;
    }
    .none-b{
        border-bottom: 0;
    }
    .main{
        margin-top: 0.45rem;
        height:2.25rem;
        background:rgba(255,255,255,1);
        display: flex;
        align-items: center;
        padding: 0 0.61rem;
        justify-content: space-between;
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
    .line1{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .submain{
        margin-top: 0.45rem;
        background:rgba(255,255,255,1);
        padding: 0.48rem 0.52rem;
    }
    .submain .word_6{
        font-size:0.68rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,168,0,1);
    }
    .submain .title_7{
        font-size:0.64rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        padding-top: 0.3rem;
    }
    .row{
        display: flex;
        align-items: center;
        padding: 0.51rem;
    }
    .row .checked{
        width: 0.6rem;
        height: 0.61rem;
        margin-right: 0.2rem;
    }
    .row .info_2,.row .info{
        font-size:0.58rem;
        font-family:PingFang SC;
    }
    .row .info_2{
        color:#FF6023FF;
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
    .type{
        margin-top: 0;
        border-top: 0.02rem solid rgba(230,230,230,1);
    }
    .bank-btn{
        position:fixed;
        left:0;
        bottom:0;
        width:100%;
        font-size:0.65rem;
        color:white;
        background:#ff0000;
        line-height:3em;
        text-align: center;
    }
    .mint-popup{
        width:100%;
    }
    .visiblebtn{
        padding:0.5rem;
        border-bottom:1px solid #eaeaea;
        overflow:hidden;
    }
    .visiblebtn .quxiao{
        float:left;
        border:1px solid #ccc;
    }
    .visiblebtn .queding{
        float:right;
        background: rgba(255,96,35,1);
    }
    .noneTop{
        margin-top: 0;
        border-top: 0.02rem solid rgba(230,230,230,1);
    }
    .upload{
        position: relative;
    }
    .upload img.alertImg{
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
    .img-file{
        width: 3.3rem;
        position:absolute;
        top:0;
        right:0;
        height:100%;
        opacity: 0;
        filter:Alpha(opacity=0);
        z-index:1;
    }
    .alert{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100vw;
        height: 100vh;
    }
    .bgc{
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,1);
    }
    .img-box{
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100001;
        width: 80vw;
    }
    .img-box img{
        max-width: 80vw;
        max-height: 70vh;
    }
    .img-box p{
        margin: 0 auto;
        margin-top: 4rem;
        color: #fff;
        text-align: center;
        border-radius:20px ;
        border: 1px solid #fff;
        width: 120px;
        padding: 4px 0;
    }
    .close{
        width: 32px;
        height: 32px;
        position: fixed;
        z-index: 100002;
        top: 20px;
        right: 20px;
    }
    .show-enter-active, .show-leave-active {
        transition: opacity 0.2s;
    }
    .show-enter, .show-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
