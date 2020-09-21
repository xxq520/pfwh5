<template>
    <div class="uploading">
        <mt-header title="上传信息">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <p class="tipss">注：请您务必认真填写您的个人入驻申请资料，否则会对您的生意造成时间上一定的影响，谢谢您的合作！
            如：身份证号码、开户行账号、开户行支行名称...</p>
        <div class="user-content">
            <mt-field label="法人姓名:" placeholder="法人姓名" v-model.trim="legalName"></mt-field>
            <mt-field label="法人身份证号码:" placeholder="法人身份证号码" v-model.trim="idCard"></mt-field>
            <mt-field label="法人手机号码:" placeholder="法人手机号码" v-model.trim="legalMobile" :attr="{maxlength:11}" type="tel">
            </mt-field>
            <mt-field label="法人邮箱:" placeholder="法人邮箱" v-model.trim="legalEmail" :readonly="isReady"></mt-field>

            <div class="own">
                <p class="title">法人证件有效期:</p>
                <div class="ownTime">
                    <div class="numipt">
                        <input type="text" placeholder='选择开始时间' v-model="legalCardBegindate" @click="openPicker"
                               onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                        <img src="../../assets/images/filter_date.png" alt="">
                    </div>
                    <div id="zhi">至</div>
                    <div class="numipt">
                        <input type="text" placeholder='选择结束时间' v-model="legalCardDeadline" @click="openPicker2"
                               onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                        <img src="../../assets/images/filter_date.png" alt="">
                    </div>
                </div>
                <el-checkbox v-model="changqi" >长期有效</el-checkbox>

            </div>

            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date"   year-format="{value} 年" v-model="startTime"
                                month-format="{value} 月"
                                date-format="{value} 日" @confirm="handleConfirm" :startDate="startDate1" :endDate="startDate2">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2"   type="date" year-format="{value} 年" v-model="endTime"
                                month-format="{value} 月"
                                date-format="{value} 日" @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate" >
            </mt-datetime-picker>
        </div>
        <div class="upload-cotent">
            <div class="upload-img">
                <h5 class="title">上传法人身份证正面照</h5>
                <div class="img-con">
                    <span class="legend" ref='legend1'><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading1"></mt-spinner>
                        <img :src="IDimg1Url" alt="" v-if="IDimg1.path">
                        <img src="@/assets/images/id-img1.jpg" alt="" v-else>
                        <!-- <mt-progress :value="99" :bar-height="15" v-if="progressShow"></mt-progress> -->
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传身份证的正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading1?'text':'file'" accept="image/*" @change="choseImg($event,1,'0001')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img">
                <h5 class="title">上传法人身份证反面照</h5>
                <div class="img-con">
                    <span class="legend" ref='legend2'><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading2"></mt-spinner>
                        <img :src="IDimg2Url" alt="" v-if="IDimg2.path">
                        <img src="http://dfs2.520shq.com:80/group1/M00/07/BD/wKgAC19I47aAM5hCAAFS-G5H5Qg407.png" alt="" v-else>
                        <!-- <mt-progress :value="99" :bar-height="15"></mt-progress> -->
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传身份证的反面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading2?'text':'file'" accept="image/*" @change="choseImg($event,2,'0011')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <button class="btns" @click="submitFn">下一页</button>
        <kf-con></kf-con>
    </div>
</template>
<script>
    import {
        showToast,
        phoneRuler,
        isCardNo,
        isEmail
    } from '@/assets/js/common.js';
    import kfCon from "@/components/KF53";
    import {loginApi} from "../../assets/js/interface";
    export default {
        data() {
            return {
                isReady: false,
                legalName: '',
                idCard: '',
                legalMobile: '',
                legalEmail: '',
                IDimg1: {
                    type: '',
                    path: '',
                    fileSize: ''
                },
                IDimg2: {
                    type: '',
                    path: '',
                    fileSize: ''
                },

                IDimg1Url: '',
                IDimg2Url: '',
                // userImgUrl:'',
                base64: '',
                changqi:false,
                seq: '',
                imgloading1: false,
                imgloading2: false,
                imgloading3: false,
                datas: {
                    attachments: []
                },
                startTime: new Date(),
                endTime: new Date(),
                legalCardBegindate: null,
                legalCardDeadline: null,
                startDate1: new Date('1980'),
                startDate2: new Date(), //开始时间

                endDate: new Date('2060'),
            }
        },
        components: {
            kfCon
        },
        mounted() {
            document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML = '银联商户入驻';
            this.getSeq();
        },
        methods: {

            // 时间筛选
            openPicker() {
                this.$refs.picker.open();
            },
            openPicker2() {
                this.$refs.picker2.open();
            },
            handleConfirm(data) {
                if (new Date(data).getTime() <= new Date(this.endTime).getTime()) {
                    const startTime = this.$moment(data).format('YYYY-MM-DD');
                    this.legalCardBegindate = startTime;

                } else {
                    Toast({
                        message: '开始时间不能大于结束时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            handleConfirm2(val) {
                if (new Date(val).getTime() >= new Date(this.startTime).getTime()) {
                    const endTime = this.$moment(val).format("YYYY-MM-DD");
                    this.legalCardDeadline = endTime;

                } else {
                    Toast({
                        message: '结束时间不能小于开始时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },

            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes();
                var s = date.getSeconds();
                return Y + M + D;
            },
            // 返回按钮
            goBack() {

                try {
                    window.action.app_back()
                } catch (err) {
                    let from = sessionStorage.getItem("from");
                    let app = sessionStorage.getItem("isApp");

                debugger;
                    if (from == 'home') {
                        this.$router.push({
                            path: "/wholesale/business?",
                            query: {
                                wholesaler: this.seq
                            }
                        });
                    } else if (from && from == "by" && from != "undefined") {
                        if (app && app == "ios") {
                            window.location.href = this.BYYL + '?platform=ios';
                        } else if (app && app == 'android') {
                            window.location.href = this.BYYL + '?platform=android';
                        }

                        else {
                            window.location.href = this.BYYL;
                        }

                    } else if (from && from == "bh" && from != "undefined") {

                        window.location.href = this.BaiYeGoodsManage + this.seq
                    }else {
                        this.$router.push("/wholesale/storeManagement")
                    }
                }
            },
            // 查询数据
            queryData() {
                // 5761984
                axios.get(this.URL + '/User/GetEnterMessage', {
                    params: {
                        seq: this.seq
                    }
                })
                    .then(res => {
                        let result = res.data.data;
                        let imgList = res.data.imgList;
                        if (res.data.success) {
                            this.legalName = result.legalName;
                            this.idCard = result.idCard;
                            this.legalMobile = result.legalMobile;
                            this.legalEmail = result.legalEmail;
                            this.legalCardBegindate = this.$moment(result.legalCardBegindate).format("YYYY-MM-DD");
                            this.legalCardDeadline = this.$moment(result.legalCardDeadline).format("YYYY-MM-DD");
                            this.datas.merType = result.merType;
                            this.datas.mercialName = result.mercialName;
                            this.datas.province = result.province;
                            this.datas.city = result.city;
                            this.datas.area = result.area;
                            this.datas.road = result.road;
                            this.datas.houseNo = result.houseNo;
                            this.datas.bankUser = result.bankUser;
                            this.datas.bankCard = result.bankCard;
                            this.datas.bankName = result.bankName;
                            this.datas.bankNo = result.bankNo;
                            this.datas.addrExt = result.addrExt;
                            this.datas.socialCode = result.socialCode;
                            this.datas.licenseBegindate = result.licenseBegindate;
                            this.datas.licenseDeadline = result.licenseDeadline;
                            this.datas.dataSource = result.dataSource;
                            sessionStorage.setItem('imgData', JSON.stringify(imgList));
                            if (imgList.length == '0') {
                                return false;
                            }
                            for (let i = 0; i < imgList.length; i++) {
                                if (imgList[i].imgType == '0001') {
                                    this.IDimg1.type = imgList[i].imgType;
                                    this.IDimg1.path = imgList[i].bankImgpath;
                                    this.IDimg1.fileSize = imgList[i].bankImgfileSize;
                                    this.IDimg1Url = imgList[i].imgUrl;
                                    this.$refs.legend1.style.display = 'none';
                                }
                                if (imgList[i].imgType == '0011') {
                                    this.IDimg2.type = imgList[i].imgType;
                                    this.IDimg2.path = imgList[i].bankImgpath;
                                    this.IDimg2.fileSize = imgList[i].bankImgfileSize;
                                    this.IDimg2Url = imgList[i].imgUrl;
                                    this.$refs.legend2.style.display = 'none';
                                }
                                // if(imgList[i].imgType == '0007'){
                                //     this.userImg.type = imgList[i].imgType;
                                //     this.userImg.path = imgList[i].bankImgpath;
                                //     this.userImg.fileSize = imgList[i].bankImgfileSize;
                                //     this.userImgUrl = imgList[i].imgUrl;
                                //     this.$refs.legend3.style.display='none';
                                // }
                            }
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    })
            },

            // 获取本地存储数据
            getSeq() {
                let sessions = sessionStorage.getItem('sessions');
                let from = this.$route.query.from; //从哪个页面进入
                this.seq = this.$route.query.seq;
                sessionStorage.setItem("from", from); //保存标识方便返回使用
                if (from == "by") {
                    this.datas.dataSource = 4;
                    this.isReady = false;
                    this.seq = this.$route.query.seq;
                    sessionStorage.setItem("seq", this.seq);
                    // console.log( this.$route.query.isApp);

                    if (this.$route.query.isApp) {
                        let frombyApp = this.$route.query.isApp;
                        sessionStorage.setItem("isApp", frombyApp);
                    }

                    // this.legalEmail = "3530824901@qq.com";
                } else {
                    this.datas.dataSource = 2;
                    this.seq = sessionStorage.getItem('seq');
                }
                if (sessions) {
                    this.datas = JSON.parse(sessions);
                    this.readSessionData();
                } else {
                    this.queryData();
                }

            },
            // 读取本地
            readSessionData() {
                if (this.datas) {
                    let img1Url = sessionStorage.getItem('img1Url');
                    let img2Url = sessionStorage.getItem('img2Url');
                    // let userImgUrl = sessionStorage.getItem('img3Url');
                    let IDimg1 = sessionStorage.getItem('img1');
                    let IDimg2 = sessionStorage.getItem('img2');
                    // let userImg = sessionStorage.getItem('img3');
                    this.seq = this.datas.seq;
                    this.legalName = this.datas.legalName;
                    this.idCard = this.datas.idCard;
                    this.legalMobile = this.datas.legalMobile;
                    this.legalEmail = this.datas.legalEmail;
                    this.legalCardBegindate = this.datas.legalCardBegindate;
                    this.legalCardDeadline = this.datas.legalCardDeadline;
                    if (img1Url) {
                        this.IDimg1Url = img1Url;
                    }
                    if (img2Url) {
                        this.IDimg2Url = img2Url;
                    }
                    // if(userImgUrl){
                    //     this.userImgUrl = userImgUrl;
                    // }
                    if (IDimg1) {
                        this.IDimg1 = JSON.parse(IDimg1);
                        this.$refs.legend1.style.display = 'none';
                    }
                    if (IDimg2) {
                        this.IDimg2 = JSON.parse(IDimg2);
                        this.$refs.legend2.style.display = 'none';
                    }
                    // if(userImg){
                    //     this.userImg = JSON.parse(userImg);
                    //     this.$refs.legend3.style.display='none';
                    // }

                } else {
                    this.queryData();
                }
            },
            // 上传图片
            choseImg(e, type, imgType) {
                let self = this;
                let file = e.target.files[0];
                    /*  new */

                this.ImgToBase64(file, 720, function (base64) {
                    self.base64 = base64;
                    self.uploadImg(imgType);

                });


                    /*   old   */
                // let reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onloadend = (e) => {
                //     self.base64 = reader.result;
                //     // let isJPG = file.type === 'image/jpeg';
                //     // if(!isJPG){
                //     //     showToast('上传图片只能是JPG格式');
                //     //     return false;
                //     // }
                //     this.uploadImg(e, type, imgType);
                // }
            },
            //将图片压缩转成base64
            ImgToBase64(file, maxLen, callBack) {
                var img = new Image();
                var reader = new FileReader();//读取客户端上的文件
                reader.onload = function () {
                    var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
                    img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
                };
                img.onload = function () {
                    //生成比例
                    var width = img.width, height = img.height;
                    //计算缩放比例
                    var rate = 1;
                    if (width >= height) {
                        if (width > maxLen) {
                            rate = maxLen / width;
                        }
                    } else {
                        if (height > maxLen) {
                            rate = maxLen / height;
                        }
                    };
                    img.width = width * rate;
                    img.height = height * rate;
                    //生成canvas
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var base64 = canvas.toDataURL('image/jpeg', 0.9);
                    callBack(base64);
                };
                reader.readAsDataURL(file);
            },

            uploadImg(imgType) {
                if (imgType == '0001') {
                    this.imgloading1 = true;
                }
                if (imgType == '0011') {
                    this.imgloading2 = true;
                }
                if (imgType == '0007') {
                    this.imgloading3 = true;
                }
                axios.post(this.URL + '/User/UploadImg?seq=' + this.seq + '&imgType=' + imgType, {
                    base64Str: this.base64
                })
                    .then(res => {
                        let result = JSON.parse(res.data.data);
                        console.log(result,'6')
                        if (result.Bool) {
                            showToast("图片上传成功");
                            if (imgType == '0001') {
                                this.IDimg1.type = imgType;
                                this.IDimg1.path = result.Data.file_path;
                                this.IDimg1.fileSize = result.Data.file_size;
                                this.imgloading1 = false;
                                this.$refs.legend1.style.display = 'none';
                            }
                            if (imgType == '0011') {
                                this.IDimg2.type = imgType;
                                this.IDimg2.path = result.Data.file_path;
                                this.IDimg2.fileSize = result.Data.file_size;
                                this.imgloading2 = false;
                                this.$refs.legend2.style.display = 'none';
                            }
                            // if(imgType == '0007'){
                            //     this.userImg.type = imgType;
                            //     this.userImg.path = result.Data.file_path;
                            //     this.userImg.fileSize = result.Data.file_size;
                            //     this.imgloading3=false;
                            //     this.$refs.legend3.style.display='none';
                            // }
                            if (res.data.imgList.length == '0') {
                                return false;
                            }
                            for (let i = 0; i < res.data.imgList.length; i++) {
                                if (res.data.imgList[i].imgType == '0001') {
                                    this.IDimg1Url = res.data.imgList[i].imgUrl
                                }
                                if (res.data.imgList[i].imgType == '0011') {
                                    this.IDimg2Url = res.data.imgList[i].imgUrl
                                }
                                // if(res.data.imgList[i].imgType == '0007'){
                                //     this.userImgUrl = res.data.imgList[i].imgUrl
                                // }
                            }
                        } else {
                            // alert(JSON.stringify(res.data))
                            showToast("图片上传失败");
                            // e.target.files[0] = '';
                            if (imgType == '0001') {
                                this.imgloading1 = false;
                            }
                            if (imgType == '0011') {
                                this.imgloading2 = false;
                            }
                            // if(imgType == '0007'){
                            //     this.imgloading3=false;
                            // }
                        }
                    })
                    .catch(res => {
                        showToast("图片上传失败");
                        if (imgType == '0001') {
                            this.imgloading1 = false;
                        }
                        if (imgType == '0011') {
                            this.imgloading2 = false;
                        }
                        // alert(res);
                        // if(imgType == '0007'){
                        //     this.imgloading3=false;
                        // }
                    })
            },
            //下步按钮
            submitFn() {
                if (this.legalName == '' || this.legalName == undefined) {
                    showToast('法人姓名不能为空');
                    return false;
                }
                if (this.idCard == '' || this.idCard == undefined || this.idCard.length < 15 || this.idCard.length > 18 || !
                    isCardNo(this.idCard)) {
                    showToast('请输入有效的身份证号');
                    return false;
                }
                if (this.legalMobile == '' || this.legalMobile == undefined || !phoneRuler(this.legalMobile) || this.legalMobile
                    .length != 11) {
                    showToast('请输入有效的手机号码');
                    return false;
                }
                if (this.legalEmail == '' || this.legalEmail == undefined || !isEmail(this.legalEmail)) {
                    showToast('请输入有效的邮箱');
                    return false;
                }
                if(this.changqi==false){
                    if (this.legalCardBegindate == '' || this.legalCardBegindate == undefined) {
                        showToast('请填写法人证件有效期起始时间');
                        return false;
                    }

                    if (this.legalCardDeadline == '' || this.legalCardDeadline == undefined) {
                        showToast('请填写法人证件有效期结束时间');
                        return false;
                    }

                    if ((this.legalCardBegindate != undefined || this.legalCardBegindate == '') &&
                        (this.legalCardDeadline != undefined || this.legalCardDeadline == '')) {
                        if (this.legalCardBegindate >= this.legalCardDeadline) {
                            showToast('填写法人证件结束时间不能早于开始时间');
                            return false;
                        }
                        //   console.log(this.legalCardBegindate,this.legalCardDeadline)
                    }
                }else {
                    this.legalCardBegindate="1950-12-31";
                    this.legalCardDeadline="9999-12-31";
                    //   console.log(this.legalCardBegindate,this.legalCardDeadline)
                }

                // if (this.IDimg1.path == '' || this.IDimg1.path == undefined) {
                //   showToast('请先上传法人身份证正面照');
                //   return false;
                // }
                // if (this.IDimg2.path == '' || this.IDimg2.path == undefined) {
                //   showToast('请先上传法人身份证反面照');
                //   return false;
                // }

                this.datas.legalName = this.legalName;
                this.datas.idCard = this.idCard;
                this.datas.legalMobile = this.legalMobile;
                this.datas.legalEmail = this.legalEmail;
                this.datas.attachments = [];
                this.datas.legalCardBegindate = this.legalCardBegindate;
                this.datas.legalCardDeadline = this.legalCardDeadline;
                console.log(this.datas.licenseBegindate);
                sessionStorage.setItem('img1', JSON.stringify(this.IDimg1));
                sessionStorage.setItem('img2', JSON.stringify(this.IDimg2));
                // sessionStorage.setItem('img3',JSON.stringify(this.userImg));
                sessionStorage.setItem('img1Url', this.IDimg1Url);
                sessionStorage.setItem('img2Url', this.IDimg2Url);
                // sessionStorage.setItem('img3Url',this.userImgUrl);

                sessionStorage.setItem('sessions', JSON.stringify(this.datas));
                this.$router.push({
                    path: '/wholesale/uploadings'
                });
            },
        }
    }

</script>
<style>
    .own {
        padding: 0.4rem;
    }

    .own .ownTime {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }

    .own .ownTime #zhi {
        font-size: .6667rem;
        margin: .4444rem;
        padding-top: 7px;
    }

    .own .ownTime .numipt {
        border-radius: 5px;
        border: 1px solid #c6c6c6;
        width: 43%;
        height: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .1111rem .2222rem;
        margin-top: .444rem;
    }

    .own .ownTime .numipt input {
        width: 90%;
    }

    .own .ownTime .numipt img {
        width: .69rem;
        height: .69rem;
    }

    .own .title {
        font-size: .5778rem;
    }

    body {
        background-color: #f5f5f5;
    }

    .uploading .user-content {
        margin-bottom: .6667rem;
    }

    .uploading .mint-cell {
        /* border-bottom:.0444rem solid #eee; */
    }

    .uploading .mint-cell:last-child {
        border: none;
    }

    .uploading .mint-cell-title {
        width: 140px;
    }
    .picker-items{
        width: 100%;
    }
    /* .uploading .mint-field-core */
    .uploading .mint-cell-value .mint-field-core {
        text-align: right;
        padding-right: 10px;
    }

    .uploading .upload-cotent {
        margin-bottom: 2.2222rem;
        background-color: #fff;
    }

    .uploading .upload-img {
        padding: 10px;
        border-top: .0444rem solid #eee;
    }

    .uploading .upload-img:first-child {
        border: 0 none;
    }

    .uploading .upload-img .title {
        font-weight: normal;
        font-size: .6667rem;
        color: #333;
        margin-bottom: 10px;
    }

    .uploading .img-con {
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .uploading .img-con img {
        height: 100%;
    }

    .uploading .legend {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        border-width: 1.2rem 1.2rem 0 0;
        border-style: solid;
        border-color: #f23030 transparent transparent transparent;
    }

    .uploading .legend .legend-text {
        position: absolute;
        top: -1.2rem;
        left: 0;
        font-size: .5333rem;
        color: #fff;
    }

    .uploading .img-box {
        position: relative;
        width: 6.6667rem;
        height: 4.4444rem;
        border: .0444rem solid #eee;
        padding: .4444rem;
        overflow: hidden;
    }

    .uploading .mt-progress {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
    }

    .uploading .mt-progress-runway {
        border-radius: 25px;
    }

    .uploading .mt-progress-progress {
        border-radius: 25px;
    }

    .uploading .upload-box {
        width: 7.3111rem;
    }

    .uploading .upload-text {
        font-size: .5333rem;
        color: #666;
    }

    .uploading .upload-btn {
        position: relative;
    }

    .uploading .upload-btn input {
        position: absolute;
        left: 0;
        top: .8444rem;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .uploading .upload-btn button {
        width: 5.5556rem;
        height: 1.5111rem;
        background-color: #f23030;
        color: #fff;
        font-size: .7111rem;
        border: 0 none;
        border-radius: 5px;
        margin-top: .8444rem;
    }

    .uploading .btns {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.7778rem;
        background-color: #f23030;
        color: #fff;
        font-size: .7556rem;
        border: 0 none;
    }

    .uploading .imgloading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3)
    }

    .uploading .mint-spinner-snake {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -14px;
        margin-top: -14px;
    }

    .uploading .tipss {
        font-size: 0.5778rem;
        color: #f00;
        padding: 0 .4444rem;
        margin-top: 0.4444rem;
    }

</style>
