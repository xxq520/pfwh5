<template>
    <div class="uploading">
        <mt-header title="上传信息">
            <mt-button icon="back" @click="goBack" slot="left"></mt-button>
        </mt-header>
        <div class="user-content">
            <mt-field label="注册类型:" readonly="readonly">
                <span @click="isChoose?showSelect(1):''" class="select-list">{{merTypeName}}</span>
            </mt-field>
            <mt-field label="商户店铺名称:" placeholder="请输入商户店铺名称" v-model.trim="mercialName" type="text"></mt-field>
            <mt-field label="营业省:" readonly="readonly">
                <span @click="showSelect(2)" class="select-list">{{province.name}}</span>
            </mt-field>

            <mt-field label="营业市:" readonly="readonly">
                <span @click="showSelect(3)" class="select-list">{{city.name}}</span>
            </mt-field>
            <mt-field label="营业区/县:" readonly="readonly">
                <span @click="showSelect(4)" class="select-list">{{area.name}}</span>
            </mt-field>
            <mt-field label="营业地址街道:" placeholder="请输入营业街道" v-model.trim="road"></mt-field>
            <mt-field label="营业地址门牌:" placeholder="请输入详细地址至门牌号" v-model.trim="houseNo"></mt-field>
            <mt-field label="营业执照类型:" readonly="readonly" >
                <span @click="showSelect(9)" class="select-list">{{businessName}}</span>
            </mt-field>
            <!-- 账号类型 -->
            <mt-radio title="账户类型" v-model="bankType" :options="BToptions" @change="changeAcctType" class="radio_btn">
            </mt-radio>
            <mt-field label="开户账号姓名:" placeholder="请输入开户账号姓名" v-model.trim="bankUser"></mt-field>
            <mt-field label="开户行账号:" placeholder="请输入开户行账号" v-model.trim="bankCard" type="number"></mt-field>
            <mt-field label="开户行支行搜索:" placeholder="关键字搜索支行名称" v-model.trim="searchVal">
                <button @click="searchBank" class="search-btn">搜索</button>
            </mt-field>

            <mt-field label="开户行支行名称:" placeholder="请输入开户行支行名称" v-model.trim="bankName"></mt-field>
            <mt-field label="预留手机号码:" placeholder="请输入预留手机号码" v-model.trim="reseverPhonw" :attr="{maxlength:11}" type="tel">
            </mt-field>
            <mt-field label="法人性别:" readonly="readonly" v-show="merType == '02'">
                <span @click="showSelect(7)" class="select-list">{{legalSexName}}</span>
            </mt-field>
            <mt-field label="法人职业:" readonly="readonly" v-show="merType == '02'">
                <span @click="showSelect(8)" class="select-list">{{legalOccupationName}}</span>
            </mt-field>
            <mt-field label="行业类别编码:" readonly="readonly" >
                <span @click="showSelect(10)" class="select-list">{{mccCodeName}}</span>
            </mt-field>
            <mt-field label="开户行支行行号:" placeholder="请输入开户行支行行号" v-model.trim="bankNo"></mt-field>
            <mt-field label="营业地址补充信息:" placeholder="(选填)" v-model.trim="addrExt"></mt-field>
            <mt-field label="统一社会信用代码:" placeholder="请输入统一社会信用代码" v-model.trim="socialCode" v-show="merType != '02'">
            </mt-field>
            <div class="own" v-show="merType != '02'">
                <p class="title">统一社会信用代码有效期:</p>
                <div class="ownTime">
                    <div class="numipt">
                        <input type="text" placeholder='选择开始时间' v-model="licenseBegindate" @click="openPicker"
                               onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                        <img src="../../assets/images/filter_date.png" alt="">
                    </div>
                    <div id="zhi">至</div>
                    <div class="numipt">
                        <input type="text" placeholder='选择结束时间' v-model="licenseDeadline" @click="openPicker2"
                               onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                        <img src="../../assets/images/filter_date.png" alt="">
                    </div>
                </div>
                <el-checkbox v-model="changqi">长期有效</el-checkbox>
            </div>
            <!-- mint datepicker 开始时间-->
            <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" v-model="startTime" month-format="{value} 月"
                                date-format="{value} 日" @confirm="handleConfirm" :startDate="startDate1" :endDate="startDate2">
            </mt-datetime-picker>
            <!-- mint datepicker 结束时间-->
            <mt-datetime-picker ref="picker2" type="date" year-format="{value} 年" v-model="endTime" month-format="{value} 月"
                                date-format="{value} 日" @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
            </mt-datetime-picker>
            <mt-field label="营业执照注册地址:" placeholder="请输入营业执照注册地址" v-model.trim="registerAddress"></mt-field>


        </div>
        <div class="upload-cotent">
            <div class="upload-img" v-show="merType !='02'">
                <h5 class="title">上传营业执照</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend1"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading1"></mt-spinner>
                        <img :src="img4Url" alt="" v-if="img4.path">
                        <img src="@/assets/images/yy-img.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传营业执照证的正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading1 ? 'text':'file'" accept="image/*" @change="choseImg($event,1,'0002')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img">
                <h5 class="title">上传{{kh}}照</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend2"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading2"></mt-spinner>
                        <img :src="img5Url" alt="" v-if="img5.path">
                        <img src="http://dfs2.520shq.com:80/group1/M00/07/BD/wKgAC19I436AEYiMAAFGGgjIR2U752.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传{{kh}}正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading2?'text':'file'" accept="image/*" @change="choseImg($event,2,'0006')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="upload-img">
                <h5 class="title">上传收银台照</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend9"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading9"></mt-spinner>
                        <img :src="img9Url" alt="" v-if="img9.path">
                        <img src="@/assets/images/yy-img.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传收银台照正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading9 ? 'text':'file'" accept="image/*" @change="choseImg($event,1,'0008')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img">
                <h5 class="title">上传经营场景照</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend10"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading10"></mt-spinner>
                        <img :src="img10Url" alt="" v-if="img10.path">
                        <img src="@/assets/images/jycj.jpg" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传经营场景照正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading1 ? 'text':'file'" accept="image/*" @change="choseImg($event,1,'0099')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- v-show="merType == '02'" -->
            <div class="upload-img">
                <h5 class="title">上传门店照片</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend5"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading5"></mt-spinner>
                        <img :src="img8Url" alt="" v-if="img8.path">
                        <img src="http://dfs2.520shq.com:80/group1/M00/07/BD/wKgAC19I40mAYloeAAEKKEGiWXg247.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传门店正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading5?'text':'file'" accept="image/*" @change="choseImg($event,5,'0005')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--  v-show="merType = '02'" -->
            <div class="upload-img">
                <h5 class="title">上传法人正面照片</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend6"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading6"></mt-spinner>
                        <img :src="userImgUrl" alt="" v-if="userImg.path">
                        <img src="http://dfs2.520shq.com:80/group1/M00/07/BD/wKgAC19I4_yAb7faAAIQwZMob2s404.png" alt="" v-else>
                        <!-- <mt-progress :value="99" :bar-height="15"></mt-progress> -->
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传法人正面照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading6?'text':'file'" accept="image/*" @change="choseImg($event,3,'0007')"
                                   v-show="!imgloading3">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img">
                <h5 class="title">上传经营场所室内照</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend11"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading11"></mt-spinner>
                        <img :src="img11Url" alt="" v-if="img11.path">
                        <img src="@/assets/images/jycj.jpg" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传经营场所室内照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading1 ? 'text':'file'" accept="image/*" @change="choseImg($event,1,'0015')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="upload-img" v-show="merType =='02'">
                <h5 class="title">上传经营商品照片</h5>
                <div class="img-con">
                    <span class="legend" v-show="legend21"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading21"></mt-spinner>
                        <img :src="img21Url" alt="" v-if="img21.path">
                        <img src="@/assets/images/2b7ba8f9d1144201dc0174200702268.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传经营商品照片</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading21 ? 'text':'file'" accept="image/*" @change="choseImg($event,1,'0021')">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="upload-img" v-show="merType =='02'">

                <mt-field label="证明材料:" readonly="readonly">
                    <span @click="showSelect(6)" class="select-list">{{voucherName}}</span>
                </mt-field>
                <div class="img-con">
                    <span class="legend" v-show="legend20"><i class="legend-text">例</i></span>
                    <div class="img-box">
                        <mt-spinner :type="0" class="imgloading" color="#2696ff" v-show="imgloading20"></mt-spinner>
                        <img :src="img20Url" alt="" v-if="img20.path">
                        <img src="@/assets/images/de271f72741c2de34d357fb009eb68f.png" alt="" v-else>
                    </div>
                    <div class="upload-box">
                        <p class="upload-text">1.请上传证明材料</p>
                        <p class="upload-text">2.上传的照片必须清晰</p>
                        <div class="upload-btn">
                            <input :type="imgloading20? 'text':'file'" accept="image/*" @change="choseImg($event,1,voucherId)">
                            <button>上传</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="btns" @click="submitData">提交</button>
        <div class="select-box" v-show="isShow">
            <div class="select-con">
                <mt-picker :slots="slots" :showToolbar="showToolbar" ref="genderPicker" :value-key="areaname ">
                    <div class="select-btn">
                        <span class="cancle-btn" @click="closeSelect">取消</span>
                        <span class="sure-btn" @click="genderConfirm">确定</span>
                    </div>
                </mt-picker>

            </div>
        </div>
        <kf-con></kf-con>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        showToast
    } from '../../assets/js/common';
    import {
        Indicator
    } from 'mint-ui';
    import kfCon from "@/components/KF53";
    export default {
        data() {
            return {
                isChoose: true,
                // 企业商户
                merTypeName: '企业商户',
                // 00
                merType: '00', //注册类型
                mercialName: '', //商铺名称
                province: {
                    id: '',
                    name: ''
                }, //省
                city: {
                    id: '',
                    name: ''
                }, //市
                area: {
                    id: '',
                    name: ''
                }, //营业区
                road: '', //营业地址路名
                houseNo: '', //营业地址门牌
                searchVal: '', //搜索关键字
                bankUser: '', //开户户名
                bankCard: '', //银行卡卡号
                bankName: '', //银行支行名称
                bankNo: '', //开户行行号
                addrExt: '', //营业地址补充信息
                registerAddress:'',//营业执照注册地址
                socialCode: '', //统一社会信用代码
                licenseBegindate: '', //统一社会信用代码起始时间
                licenseDeadline: '', //统一社会信用代码结束时间
                isShow: false,
                businessType:'1',
                merTypeData: [{
                    values: [{
                        id: '00',
                        areaname: '企业商户'
                    }, {
                        id: '01',
                        areaname: '个人商户'
                    }, {
                        id: '02',
                        areaname: '微小商户'
                    }]
                }],
                businessName:'普通营业执照',

                businessData: [{
                    values: [{
                        id: '0',
                        areaname: '多合一营业执照'
                    }, {
                        id: '1',
                        areaname: '普通营业执照'
                    }, {
                        id: '2',
                        areaname: '无营业执照'
                    }]
                }],

                legalSexName:'男',
                legalSexType:1,
                legalSexData: [{
                    values: [ {
                        id: '1',
                        areaname: '男'
                    }, {
                        id: '2',
                        areaname: '女'
                    },{
                        id: '0',
                        areaname: '未知性别'
                    },]
                }],
                legalOccupationName:'技术人员',
                legalOccupation:0,
                legalOccupationData: [{
                    values: [{
                        id: '0',
                        areaname: '技术人员'
                    }, {
                        id: '1',
                        areaname: '事业单位'
                    }, {
                        id: '2',
                        areaname: '办事人员'
                    }, {
                        id: '3',
                        areaname: '商业人员'
                    }, {
                        id: '4',
                        areaname: '服务人员'
                    }, {
                        id: '4',
                        areaname: '农林牧渔劳'
                    }
                    ]
                }],
                voucherName: '租赁协议',
                voucherId: '0016',
                voucherData: [{
                    values: [{
                        id: '0016',
                        areaname: '租赁协议'
                    }, {
                        id: '0017',
                        areaname: '产权证明'
                    }, {
                        id: '0018',
                        areaname: '执业资质证照'
                    }, {
                        id: '0019',
                        areaname: '第三方证明'
                    }, {
                        id: '0020',
                        areaname: '其他证明材料'
                    }]
                }],
                //注册类型数据列表
                provinceData: [{
                    values: []
                }], //省数据列表
                cityData: [{
                    values: []
                }], //市数据列表
                areaData: [{
                    values: []
                }], //区数据列表
                bankData: [{
                    values: []
                }], //支行数据列表
                mccCodeName:'',
                mccCode:'',
                mccCodeData: [{
                    values: []
                }],
                areaname: 'areaname',
                slots: [],
                selectIndex: 0, //选择框类别
                showToolbar: true, //显示选择框
                param: {
                    type: '1',
                    id: '0'
                }, //省市区查询条件
                img4: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //营业执照
                img5: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //许可证照
                img6: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //税务登记证照
                img7: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //组织机构代码证照
                img8: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //门店照
                img9: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //门店照
                img10: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //门店照
                img11: {
                    type: '',
                    path: '',
                    fileSize: ''
                }, //室内照
                img20: {
                    type: '',
                    path: '',
                    fileSize: ''
                },
                img21: {
                    type: '',
                    path: '',
                    fileSize: ''
                },
                userImg: {
                    type: '',
                    path: '',
                    fileSize: ''
                },
                img4Url: '',
                img5Url: '',
                img6Url: '',
                img7Url: '',
                img8Url: '',
                img9Url: '',
                img10Url: '',
                img11Url: '',
                userImgUrl: '',
                img20Url: '',
                img21Url: '',
                datas: {
                    attachments: []
                },
                seq: '',
                legend1: true,
                legend2: true,
                legend3: true,
                legend4: true,
                legend5: true,
                legend6: true,
                legend9: true,
                legend10: true,
                legend11: true,
                legend20: true,
                legend21: true,
                imgloading1: false,
                imgloading2: false,
                imgloading3: false,
                imgloading4: false,
                imgloading5: false,
                imgloading6: false,
                imgloading9: false,
                imgloading10: false,
                imgloading11: false,
                imgloading20: false,
                imgloading21: false,
                kh: '开户许可证',
                startTime: new Date(),
                endTime: new Date(),
                licenseBegindate: null,
                licenseDeadline: null,
                startDate1: new Date('1980'),
                startDate2: new Date(), //开始时间
                changqi: false,
                endDate: new Date('2060'),
                isShow: false,
                reseverPhonw:'',//预留手机号
                cooType:1,


                handler: function (e) {
                    e.preventDefault()
                },
                bankType: '1', //账户类型
                BToptions: [{
                    label: '个人账户',
                    value: '0'
                },
                    {
                        label: '公司账户',
                        value: '1'
                    }
                ]
            }
        },
        components: {
            kfCon
        },
        mounted() {
            document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML = '银联商户入驻';
            this.defaultType();
            this.getSessionData();
            this. getCoo();
            // console.log(this.$moment().format());

        },
        methods: {
            //获取行业编码
            getCoo(){
                this.mccCodeData[0].values = [] ;
                axios.get(this.URL+'/User/GetmccCodeList',{params:{type:this.cooType}}).then(res => {
                    if(res.status == 200){
                        this.mccCodeData[0].values = res.data.data ;

                    }
                }).catch(err => {})
            },
            openPicker() {
                this.$refs.picker.open();
            },
            openPicker2() {
                this.$refs.picker2.open();
            },
            handleConfirm(data) {
                if (new Date(data).getTime() <= new Date(this.endTime).getTime()) {
                    const begindTime = this.$moment(data).format('YYYY-MM-DD');
                    console.log(begindTime);
                    this.licenseBegindate = begindTime;
                } else {
                    Toast({
                        message: '开始时间不能大于结束时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            handleConfirm2(data) {
                if (new Date(data).getTime() >= new Date(this.startTime).getTime()) {
                    const endTime = this.$moment(data).format('YYYY-MM-DD');
                    this.licenseDeadline = endTime;

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
                let from = sessionStorage.getItem("from");
                if (from != "undefined") {
                    this.$router.push({
                        path: "/wholesale/uploading",
                        query: {
                            from: from
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/wholesale/uploading"
                    });
                }
                this.saveSession();
            },
            closeTouch() {
                document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {
                    passive: false
                }); //阻止默认事件
            },
            openTouch() {
                document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {
                    passive: false
                }); //打开默认事件
            },
            //获取本地存储数据
            getSessionData() {
                let seq = sessionStorage.getItem('seq');
                let sessions = JSON.parse(sessionStorage.getItem('sessions'));
                if (seq) {
                    this.seq = seq;
                }
                if (sessions) {
                    this.datas = sessions;
                    this.readSessionData();
                    if (this.datas.province && this.datas.province.id != '') {
                        this.param.id = this.datas.province.id;
                        this.getRegionData(1, 'isStorage');
                    } else {
                        this.getRegionData(1);
                    }
                } else {
                    this.getRegionData(1);
                }
            },
            // 获取本地存储的填写信息
            readSessionData() {
                // this.merType = this.datas.merType;
                if (this.datas.merType) {
                    this.merType = this.datas.merType;
                    if (this.datas.merType == '00') {
                        this.merTypeName = '企业商户';
                        this.kh = '开户许可证';
                        this.bankType = this.datas.bankAcctType;
                        this.cooType = 1;
                    }
                    if (this.datas.merType == '01') {
                        this.merTypeName = '个人商户';
                        this.kh = '银行卡';
                        this.bankType = this.datas.bankAcctType;
                        this.cooType = 1;
                    }
                    if (this.datas.merType == '02') {
                        this.merTypeName = '微小商户';
                        this.kh = '银行卡';
                        this.bankType = '0';
                        this.cooType = 2;
                    }
                }
                this.mercialName = this.datas.mercialName;
                if (this.datas.province) {
                    this.province = this.datas.province;
                }
                if (this.datas.city) {
                    this.city = this.datas.city;
                }
                if (this.datas.area) {
                    this.area = this.datas.area;
                }
                this.road = this.datas.road;
                this.houseNo = this.datas.houseNo;
                this.bankUser = this.datas.bankUser;
                this.bankCard = this.datas.bankCard;
                this.bankName = this.datas.bankName;
                this.bankNo = this.datas.bankNo;
                this.addrExt = this.datas.addrExt;
                this.registerAddress = this.datas.registerAddress;
                this.socialCode = this.datas.socialCode;
                this.licenseBegindate = this.datas.licenseBegindate;
                this.licenseDeadline = this.datas.licenseDeadline;
                // 获取本地图片
                let img4Url = sessionStorage.getItem('img4Url');
                let img5Url = sessionStorage.getItem('img5Url');
                // let img6Url = sessionStorage.getItem('img6Url');
                // let img7Url = sessionStorage.getItem('img7Url');
                let img8Url = sessionStorage.getItem('img8Url');
                let img9Url = sessionStorage.getItem('img9Url');
                let img10Url = sessionStorage.getItem('img10Url');
                let img11Url = sessionStorage.getItem('img11Url');
                let img20Url = sessionStorage.getItem('img20Url');
                let img21Url = sessionStorage.getItem('img21Url');

                let userImgUrl = sessionStorage.getItem('userImgUrl');

                let img4 = sessionStorage.getItem('img4');
                let img5 = sessionStorage.getItem('img5');
                // let img6 = sessionStorage.getItem('img6');
                // let img7 = sessionStorage.getItem('img7');
                let img8 = sessionStorage.getItem('img8');
                let img9 = sessionStorage.getItem('img9');
                let img10 = sessionStorage.getItem('img10');
                let img11 = sessionStorage.getItem('img11');
                let img20 = sessionStorage.getItem('img20');
                let img21 = sessionStorage.getItem('img21');

                let userImg = sessionStorage.getItem('userImg');
                if (img4Url) {
                    this.img4Url = img4Url;
                } else {
                    this.getImgList();
                }
                if (img5Url) {
                    this.img5Url = img5Url;
                } else {
                    this.getImgList();
                }
                if (img21Url) {
                    this.img21Url = img21Url;
                } else {
                    this.getImgList();
                }
                if (img20Url) {
                    this.img20Url = img20Url;
                } else {
                    this.getImgList();
                }
                if (img8Url) {
                    this.img8Url = img8Url;
                } else {
                    this.getImgList();
                }
                if (img9Url) {
                    this.img9Url = img9Url;
                } else {
                    this.getImgList();
                }
                if (img10Url) {
                    this.img10Url = img10Url;
                } else {
                    this.getImgList();
                }
                if (img11Url) {
                    this.img11Url = img11Url;
                } else {
                    this.getImgList();
                }
                if (userImgUrl) {
                    this.userImgUrl = userImgUrl;
                } else {
                    this.getImgList();
                }
                if (img4) {
                    this.img4 = JSON.parse(img4);
                    this.legend1 = false;
                }
                if (img5) {
                    this.img5 = JSON.parse(img5);
                    this.legend2 = false;
                }
                if (img21) {
                    this.img21 = JSON.parse(img21);
                    this.legend21 = false;
                }
                if (img20) {
                    this.img20 = JSON.parse(img20);
                    this.legend20 = false;
                }
                if (img8) {
                    this.img8 = JSON.parse(img8);
                    this.legend5 = false;
                }
                if (img9) {
                    this.img9 = JSON.parse(img9);
                    this.legend9 = false;
                }
                if (img10) {
                    this.img10 = JSON.parse(img10);
                    this.legend10 = false;
                }
                if (userImg) {
                    this.userImg = JSON.parse(userImg);
                    this.legend6 = false;
                }
                if (img11) {
                    this.img11 = JSON.parse(img11);
                    this.legend11 = false;
                }
            },
            // 获取服务器返回图片
            getImgList() {
                let imgData = JSON.parse(sessionStorage.getItem('imgData'));
                if (!imgData) {
                    return false;
                }
                if (imgData.length == '0') {
                    return false;
                }
                for (let i = 0; i < imgData.length; i++) {
                    if (imgData[i].imgType == '0002') {
                        this.img4.type = imgData[i].imgType;
                        this.img4.path = imgData[i].bankImgpath;
                        this.img4.fileSize = imgData[i].bankImgfileSize;
                        this.img4Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img4', JSON.stringify(this.img4));
                        sessionStorage.setItem('img4Url', this.img4Url);
                        this.legend1 = false;
                    }
                    if (imgData[i].imgType == '0006') {
                        this.img5.type = imgData[i].imgType;
                        this.img5.path = imgData[i].bankImgpath;
                        this.img5.fileSize = imgData[i].bankImgfileSize;
                        this.img5Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img5', JSON.stringify(this.img5));
                        sessionStorage.setItem('img5Url', this.img5Url);
                        this.legend2 = false;
                    }
                    if (imgData[i].imgType == '0021') {
                        this.img21.type = imgData[i].imgType;
                        this.img21.path = imgData[i].bankImgpath;
                        this.img21.fileSize = imgData[i].bankImgfileSize;
                        this.img21Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img21', JSON.stringify(this.img21));
                        sessionStorage.setItem('img21Url', this.img21Url);
                        this.legend21 = false;
                    }
                    if (imgData[i].imgType == '0016' || imgData[i].imgType == '0017' || imgData[i].imgType ==
                        '0018' || imgData[i].imgType == '0019' || imgData[i].imgType == '0020') {
                        this.img20.type = imgData[i].imgType;
                        this.img20.path = imgData[i].bankImgpath;
                        this.img20.fileSize = imgData[i].bankImgfileSize;
                        this.img20Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img20', JSON.stringify(this.img20));
                        sessionStorage.setItem('img20Url', this.img20Url);
                        this.legend20 = false;

                    }
                    if (imgData[i].imgType == '0005') {
                        this.img8.type = imgData[i].imgType;
                        this.img8.path = imgData[i].bankImgpath;
                        this.img8.fileSize = imgData[i].bankImgfileSize;
                        this.img8Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img8', JSON.stringify(this.img8));
                        sessionStorage.setItem('img8Url', this.img8Url);
                        this.legend5 = false;

                    }
                    if (imgData[i].imgType == '0008') {
                        this.img9.type = imgData[i].imgType;
                        this.img9.path = imgData[i].bankImgpath;
                        this.img9.fileSize = imgData[i].bankImgfileSize;
                        this.img9Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img9', JSON.stringify(this.img9));
                        sessionStorage.setItem('img9Url', this.img9Url);
                        this.legend9 = false;;
                    }
                    if (imgData[i].imgType == '0099') {
                        this.img10.type = imgData[i].imgType;
                        this.img10.path = imgData[i].bankImgpath;
                        this.img10.fileSize = imgData[i].bankImgfileSize;
                        this.img10Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img10', JSON.stringify(this.img10));
                        sessionStorage.setItem('img10Url', this.img10Url);
                        this.legend10 = false;

                    }
                    if (imgData[i].imgType == '0007') {
                        this.userImg.type = imgData[i].imgType;
                        this.userImg.path = imgData[i].bankImgpath;
                        this.userImg.fileSize = imgData[i].bankImgfileSize;
                        this.userImgUrl = imgData[i].imgUrl;
                        sessionStorage.setItem('userImg', JSON.stringify(this.userImg));
                        sessionStorage.setItem('userImgUrl', this.userImgUrl);
                        this.legend6 = false;
                    }
                    if (imgData[i].imgType == '0015') {
                        this.img11.type = imgData[i].imgType;
                        this.img11.path = imgData[i].bankImgpath;
                        this.img11.fileSize = imgData[i].bankImgfileSize;
                        this.img11Url = imgData[i].imgUrl;
                        sessionStorage.setItem('img11', JSON.stringify(this.img11));
                        sessionStorage.setItem('img11Url', this.img11Url);
                        this.legend11 = false;
                    }
                }
            },
            // 获取省市区
            getRegionData(type, flag) {
                let self = this;
                axios.get(this.URL + '/User/GetRegion', {
                    params: this.param
                })
                    .then(res => {
                        let datas = JSON.parse(res.data);
                        //省
                        if (type && type == 1) {
                            this.provinceData[0].values = datas.Data;
                            if (!flag && flag != 'isStorage') {
                                this.province.id = datas.Data[0].areaid;
                                this.province.name = datas.Data[0].areaname;
                                this.param = {
                                    type: 2,
                                    id: this.province.id
                                };
                                this.getRegionData(2);
                            } else {
                                this.province.id = this.datas.province.id;
                                this.province.name = this.datas.province.name;
                                this.param = {
                                    type: 2,
                                    id: this.province.id
                                };
                                this.getRegionData(2, 'isStorage');
                            }
                        } else if (type && type == 2) {
                            this.cityData[0].values = datas.Data;
                            if (!flag && flag != 'isStorage') {
                                this.city.id = datas.Data[0].areaid;
                                this.city.name = datas.Data[0].areaname;
                                this.param = {
                                    type: 3,
                                    id: this.city.id
                                };
                                this.getRegionData(3);
                            } else {
                                this.city.id = this.datas.city.id;
                                this.city.name = this.datas.city.name;
                                this.param = {
                                    type: 3,
                                    id: this.city.id
                                };
                                this.getRegionData(3, 'isStorage');
                            }
                        } else if (type && type == 3) {
                            // 区
                            this.areaData[0].values = datas.Data;
                            if (!flag && flag != 'isStorage') {
                                this.area.id = datas.Data[0].areaid;
                                this.area.name = datas.Data[0].areaname;
                            } else {
                                this.area.id = this.datas.area.id;
                                this.area.name = this.datas.area.name;
                            }
                        }
                        this.areaname = 'areaname'
                    })
                    .catch(res => {
                        console.log(res);
                    })
            },
            defaultType() {
                let from = sessionStorage.getItem("from");
                if (from == "by") {
                    this.merType = "02";
                    this.merTypeName = "微小商户";
                    this.changeText();
                    this.isChoose = false;
                    this.bankType = '0';
                    this.datas.bankAcctType = this.bankType;
                }

            },
            // 账户类型选择
            changeAcctType(val) {
                this.bankType = val;
            },
            //显示选择框并且屏幕不能滚动
            showSelect(index) {
                switch (index) {
                    case 1:
                        this.slots = this.merTypeData;
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
                    case 6:
                        this.slots = this.voucherData;
                        break;
                    case 7:
                        this.slots = this.legalSexData;
                        break;
                    case 8:
                        this.slots = this.legalOccupationData;
                        break;
                    case 9:
                        this.slots = this.businessData;
                        break;
                    case 10:
                        this.slots = this.mccCodeData;
                        break;

                }
                this.isShow = true;
                this.selectIndex = index;
                document.body.style.overflow = "hidden";
            },
            // 关键字搜索支行名称
            searchBank() {
                if (this.searchVal == '' || this.searchVal == undefined) {
                    showToast('请输入关键字')
                    return false;
                }
                let param = {
                    keyword: this.searchVal,
                    id: this.city.id
                };
                axios.get(this.URL + '/User/GetBankBranch', {
                    params: param
                })
                    .then(res => {
                        let datas = JSON.parse(res.data);
                        if (datas.Bool) {
                            this.isShow = true;
                            this.bankData[0].values = datas.Data.branchBankList;
                            this.slots = this.bankData;
                            this.selectIndex = 5;
                            this.areaname = 'bankBranchName';
                        } else {
                            // showToast(datas.Msg)
                            showToast("查询失败，请手动输入支行名称及支行行号")
                        }

                    })
                    .catch(res => {
                        console.log(res);
                    })

            },
            //隐藏显示框且屏滚动
            closeSelect() {
                this.isShow = false;
                document.body.style.overflow = "auto";
                if (this.selectIndex == '5') {
                    this.areaname = 'areaname';
                }
            },
            genderConfirm() { // 类别选择确定
                let values = this.$refs.genderPicker.getValues()[0];
                switch (this.selectIndex) {
                    case 1:
                        this.merType = values.id;
                        this.merTypeName = values.areaname;
                        this.changeText();
                        break;
                    case 2:
                        this.province.name = values.areaname;
                        this.province.id = values.areaid;
                        this.param = {
                            type: 2,
                            id: values.areaid
                        }
                        this.getRegionData(2);
                        break;
                    case 3:
                        this.city.name = values.areaname;
                        this.city.id = values.areaid;
                        this.param = {
                            type: 3,
                            id: values.areaid
                        };
                        this.getRegionData(3);
                        break;
                    case 4:
                        this.area.name = values.areaname;
                        this.area.id = values.areaid;
                        this.param = {
                            type: 3,
                            id: values.areaid
                        };
                        // this.getRegionData();
                        break;
                    case 5:
                        this.bankName = values.bankBranchName;
                        this.bankNo = values.code;
                        this.areaname = 'areaname';
                        break;
                    case 6:
                        this.voucherName = values.areaname;
                        this.voucherId = values.id;
                        break;

                    case 7:
                        this.legalSexName = values.areaname;
                        this.legalSexType = values.id;
                        break;
                    case 8:
                        this.legalOccupationName = values.areaname;
                        this.legalOccupation = values.id;
                        break;
                    case 9:
                        this.businessName = values.areaname;
                        this.businessType = values.id;
                        break;
                    case 10:
                        this.mccCodeName = values.areaname;
                        this.mccCode = values.specificCategoriesId;
                        break;
                }
                this.isShow = false;
                document.body.style.overflow = "auto";
            },
            // 判断用户注册类型改变上传图片的标题文字
            changeText() {

                if (this.merType == '00' || this.merType == '01') {
                    this.kh = '开户许可证';
                    this.cooType=1;
                    this.getCoo();
                } else if (this.merType == '02') {
                    this.kh = '银行卡';
                    this.cooType=2;
                    this.getCoo();
                }
            },
            // 上传图片
            choseImg(e, type, imgType) {

                let self = this;
                let file = e.target.files[0];

                this.ImgToBase64(file, 720, function (base64) {
                    self.base64 = base64;
                    self.uploadImg(imgType);

                });

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
                console.log(imgType)
                if (imgType == '0002') {
                    this.imgloading1 = true;
                }
                if (imgType == '0006') {
                    this.imgloading2 = true;
                }

                // if(imgType == '0004'){
                //     this.imgloading4=true;
                // }
                if (imgType == '0005') {
                    this.imgloading5 = true;
                }
                if (imgType == '0007') {
                    this.imgloading6 = true;
                }
                if (imgType == '0008') {
                    this.imgloading9 = true;
                }
                if (imgType == '0099') {
                    this.imgloading10 = true;
                }
                if (imgType == '0015') {
                    this.imgloading11 = true;
                }
                if (imgType == '0021') {

                    this.imgloading21 = true;
                }
                if (imgType == '0016'||imgType == '0017'||imgType == '0018'||imgType == '0019'||imgType == '0020') {

                    this.imgloading20 = true;
                }
                axios.post(this.URL + '/User/UploadImg?seq=' + this.seq + '&imgType=' + imgType, {
                    base64Str: this.base64
                })
                    .then(res => {
                        let result = JSON.parse(res.data.data);
                        if (result.Bool) {
                            showToast("图片上传成功");
                            // else if(imgType == '0003'){
                            //     this.img6.type = imgType;
                            //     this.img6.path = result.Data.file_path;
                            //     this.img6.fileSize = result.Data.file_size;
                            //     this.legend3=false;
                            //     this.imgloading3=false;
                            //     sessionStorage.setItem('img6',JSON.stringify(this.img6));
                            // }else if(imgType == '0004'){
                            //     this.img7.type = imgType;
                            //     this.img7.path = result.Data.file_path;
                            //     this.img7.fileSize = result.Data.file_size;
                            //     this.legend4=false;
                            //     this.imgloading4=false;
                            //     sessionStorage.setItem('img7',JSON.stringify(this.img7));
                            // }
                            if (imgType == '0002') {
                                this.img4.type = imgType;
                                this.img4.path = result.Data.file_path;
                                this.img4.fileSize = result.Data.file_size;
                                this.legend1 = false;
                                this.imgloading1 = false;
                                sessionStorage.setItem('img4', JSON.stringify(this.img4));
                            } else if (imgType == '0006') {
                                this.img5.type = imgType;
                                this.img5.path = result.Data.file_path;
                                this.img5.fileSize = result.Data.file_size;
                                this.legend2 = false;
                                this.imgloading2 = false;
                                sessionStorage.setItem('img5', JSON.stringify(this.img5));
                            } else if (imgType == '0005') {
                                this.img8.type = imgType;
                                this.img8.path = result.Data.file_path;
                                this.img8.fileSize = result.Data.file_size;
                                this.legend5 = false;
                                this.imgloading5 = false;
                                sessionStorage.setItem('img8', JSON.stringify(this.img8));
                            } else if (imgType == '0007') {
                                this.userImg.type = imgType;
                                this.userImg.path = result.Data.file_path;
                                this.userImg.fileSize = result.Data.file_size;
                                this.legend6 = false;
                                this.imgloading6 = false;
                                sessionStorage.setItem('userImg', JSON.stringify(this.userImg));
                            } else if (imgType == '0008') {
                                this.img9.type = imgType;
                                this.img9.path = result.Data.file_path;
                                this.img9.fileSize = result.Data.file_size;
                                this.legend9 = false;
                                this.imgloading9 = false;
                                sessionStorage.setItem('img9', JSON.stringify(this.img9));
                            } else if (imgType == '0099') {
                                this.img10.type = imgType;
                                this.img10.path = result.Data.file_path;
                                this.img10.fileSize = result.Data.file_size;
                                this.legend10 = false;
                                this.imgloading10 = false;
                                sessionStorage.setItem('img10', JSON.stringify(this.img10));
                            } else if (imgType == '0015') {
                                this.img11.type = imgType;
                                this.img11.path = result.Data.file_path;
                                this.img11.fileSize = result.Data.file_size;
                                this.legend11 = false;
                                this.imgloading11 = false;
                                sessionStorage.setItem('img11', JSON.stringify(this.img11));
                            } else if (imgType == '0021') {
                                this.img21.type = imgType;
                                this.img21.path = result.Data.file_path;
                                this.img21.fileSize = result.Data.file_size;
                                this.legend21 = false;
                                this.imgloading21 = false;
                                sessionStorage.setItem('img21', JSON.stringify(this.img21));
                            } else if (imgType == '0016' || imgType == '0017' || imgType == '0018' || imgType == '0019' ||
                                imgType == '0020') {
                                this.img20.type = imgType;
                                this.img20.path = result.Data.file_path;
                                this.img20.fileSize = result.Data.file_size;
                                this.legend20 = false;
                                this.imgloading20 = false;
                                sessionStorage.setItem('img20', JSON.stringify(this.img20));
                            }
                            if (res.data.imgList.length == '0') {
                                return false;
                            }
                            for (let i = 0; i < res.data.imgList.length; i++) {
                                if (res.data.imgList[i].imgType == '0002') {
                                    this.img4Url = res.data.imgList[i].imgUrl
                                    sessionStorage.setItem('img4Url', this.img4Url);
                                }
                                if (res.data.imgList[i].imgType == '0006') {
                                    this.img5Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img5Url', this.img5Url);
                                }
                                // if(res.data.imgList[i].imgType == '0003'){
                                //     this.img6Url = res.data.imgList[i].imgUrl;
                                //     sessionStorage.setItem('img6Url',this.img6Url);
                                // }
                                // if(res.data.imgList[i].imgType == '0004'){
                                //     this.img7Url = res.data.imgList[i].imgUrl;
                                //     sessionStorage.setItem('img7Url',this.img7Url);
                                // }
                                if (res.data.imgList[i].imgType == '0005') {
                                    this.img8Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img8Url', this.img8Url);
                                }
                                if (res.data.imgList[i].imgType == '0008') {
                                    this.img9Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img9Url', this.img9Url);
                                }
                                if (res.data.imgList[i].imgType == '0099') {
                                    this.img10Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img10Url', this.img10Url);
                                }
                                if (res.data.imgList[i].imgType == '0007') {
                                    this.userImgUrl = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('userImgUrl', this.img8Url);
                                }
                                if (res.data.imgList[i].imgType == '0015') {
                                    this.img11Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img11Url', this.img11Url);
                                }
                                if (res.data.imgList[i].imgType == '0021') {
                                    this.img21Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img21Url', this.img21Url);
                                }
                                if (res.data.imgList[i].imgType == '0016' || res.data.imgList[i].imgType == '0017' || res.data
                                    .imgList[i].imgType == '0018' || res.data.imgList[i].imgType == '0019' || res.data.imgList[i]
                                    .imgType == '0020') {
                                    this.img20Url = res.data.imgList[i].imgUrl;
                                    sessionStorage.setItem('img20Url', this.img20Url);
                                }
                            }
                        } else {
                            showToast("图片上传失败");
                            if (imgType == '0002') {
                                this.imgloading1 = false;
                            }
                            if (imgType == '0006') {
                                this.imgloading2 = false;
                            }
                            // if(imgType == '0003'){
                            //     this.imgloading3=false;
                            // }
                            // if(imgType == '0004'){
                            //     this.imgloading4=false;
                            // }
                            if (imgType == '0005') {
                                this.imgloading5 = false;
                            }
                            if (imgType == '0007') {
                                this.imgloading6 = false;
                            }
                            if (imgType == '0008') {
                                this.imgloading9 = false;
                            }
                            if (imgType == '0099') {
                                this.imgloading10 = false;
                            }
                            if (imgType == '0015') {
                                this.imgloading11 = false;
                            }
                            if (imgType == '0021') {
                                this.imgloading21 = false;
                            }
                            if (imgType == '0016'||imgType == '0017'||imgType == '0018'||imgType == '0019'||imgType == '0020') {
                                this.imgloading20 = false;
                            }
                        }
                    })
                    .catch(res => {
                        showToast("图片上传失败");
                        if (imgType == '0002') {
                            this.imgloading1 = false;
                        }
                        if (imgType == '0006') {
                            this.imgloading2 = false;
                        }

                        // if(imgType == '0004'){
                        //     this.imgloading4=false;
                        // }
                        if (imgType == '0006') {
                            this.imgloading2 = false;
                        }
                        if (imgType == '0007') {
                            this.imgloading6 = false;
                        }
                        if (imgType == '0008') {
                            this.imgloading9 = false;
                        }
                        if (imgType == '0099') {
                            this.imgloading10 = false;
                        }
                        if (imgType == '0015') {
                            this.imgloading11 = false;
                        }
                        if (imgType == '0021') {
                            this.imgloading21 = false;
                        }
                        if (imgType == '0016'||imgType == '0017'||imgType == '0018'||imgType == '0019'||imgType == '0020') {
                            this.imgloading20 = false;
                        }
                    })
            },
            // 保存数据
            saveSession() {
                this.datas.seq = this.seq;
                this.datas.cooType = this.cooType;
                this.datas.mercialName = this.mercialName;
                Vue.set(this.datas, 'merType', this.merType);
                Vue.set(this.datas, "province", this.province);
                Vue.set(this.datas, "city", this.city);
                Vue.set(this.datas, "area", this.area);
                // this.datas.province = this.province;
                this.datas.reseverPhonw = this.reseverPhonw;
                this.datas.havingFixedBusiAddr = 1;
                this.datas.road = this.road;
                this.datas.houseNo = this.houseNo;
                this.datas.bankUser = this.bankUser;
                this.datas.bankCard = this.bankCard;
                this.datas.bankNo = this.bankNo;
                this.datas.bankName = this.bankName;
                this.datas.addrExt = this.addrExt;
                this.datas.registerAddress = this.registerAddress;
                this.datas.province = this.province;
                this.datas.city = this.city;
                this.datas.area = this.area;
                this.datas.bankAcctType = this.bankType;
                sessionStorage.setItem('sessions', JSON.stringify(this.datas))
            },
            // 提交信息
            submitData() {
                console.log(this)

                let self = this;
                if (this.merType == '' || this.merType == undefined) {
                    showToast('请选择注册类型');
                    return false;
                }
                if (this.mercialName == '' || this.mercialName == undefined) {
                    showToast('商户店铺名称不能为空');
                    return false;
                }
                if (this.province.name == '' || this.province.name == undefined) {
                    showToast('请选择省');
                    return false;
                }
                if (this.city.name == '' || this.city.name == undefined) {
                    showToast('请选择市');
                    return false;
                }
                if (this.area.name == '' || this.area.name == undefined) {
                    showToast('请选择县/区');
                    return false;
                }
                if (this.road == '' || this.road == undefined) {
                    showToast('请填写营业地址街道');
                    return false;
                }
                if (this.road.length > 10) {
                    showToast('请填写营业地址街道10字以内');
                    return false;
                }
                if (this.houseNo == '' || this.houseNo == undefined) {
                    showToast('请填写营业地址门牌号');
                    return false;
                }
                if (this.houseNo.length > 6) {
                    showToast('请填写营业地址门牌号6字以内');
                    return false;
                }
                if (this.bankUser == '' || this.bankUser == undefined) {
                    showToast('请填写开户账号姓名');
                    return false;
                }
                if (this.bankCard == '' || this.bankCard == undefined) {
                    showToast('请填写开户行账号');
                    return false;
                }
                if (this.bankName == '' || this.bankName == undefined) {
                    showToast('请选择开户行支行名称');
                    return false;
                }
                if (this.bankNo == '' || this.bankNo == undefined) {
                    showToast('请选择开户行支行行号');
                    return false;
                }
                if (this.reseverPhonw == '' || this.reseverPhonw == undefined) {
                    showToast('请输入预留手机号码');
                    return false;
                }

                if (this.mccCode == '' || this.mccCode == undefined) {
                    showToast('请选择行业编码');
                    return false;
                }
                if (this.addrExt != undefined) {
                    if (this.addrExt.length > 40) {
                        showToast('请填写营业地址补充信息40字以内');
                        return false;
                    }
                }
                if ((this.merType=='00'||this.merType=='01') && !this.registerAddress){
                    showToast('请填写营业执照注册地址');
                    return false;
                }
                // if ((this.merType=='00'||this.merType=='01')&&this.registerAddress.length > 40) {
                //     showToast('请填写营业执照注册地址40字以内');
                //     return false;
                // }
                this.datas.attachments = [];
                if (this.merType != '02') {
                    if (this.socialCode == '' || this.socialCode == null) {
                        showToast('请填写统一社会信用代码');
                        return false;
                    }
                    this.datas.socialCode = this.socialCode;
                    if (this.changqi == false) {
                        if (this.licenseBegindate == '' || this.licenseBegindate == undefined) {
                            showToast('请填写统一社会信用代码有效期起始时间');
                            return false;
                        }

                        if (this.licenseDeadline == '' || this.licenseDeadline == undefined) {
                            showToast('请填写统一社会信用代码有效期结束时间');
                            return false;
                        }

                        if ((this.licenseBegindate != undefined || this.licenseBegindate != '') &&
                            (this.licenseDeadline != undefined || this.licenseDeadline != '')) {
                            if (this.licenseBegindate >= this.licenseDeadline) {
                                showToast('填写统一社会信用代码结束时间不能早于开始时间');
                                return false;
                            }
                            this.datas.licenseBegindate = this.licenseBegindate;
                            this.datas.licenseDeadline = this.licenseDeadline;
                        }
                    } else {
                        this.datas.licenseBegindate = "1950-12-31";
                        this.datas.licenseDeadline = "9999-12-31";
                    }
                    if (this.img4.path == '' || this.img4.path == undefined) {
                        showToast('请先上传营业执照');
                        return false;
                    }
                    this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img4')));

                }

                if (this.img5.path == '' || this.img5.path == undefined) {
                    showToast('请先上传开户许可证照');
                    return false;
                }
                if (this.img9.path == '' || this.img9.path == undefined) {
                    showToast('请先上收银台照');
                    return false;
                }
                if (this.img10.path == '' || this.img10.path == undefined) {
                    showToast('请先上传经营场景照');
                    return false;
                }
                if (this.img8.path == '' || this.img8.path == undefined) {
                    showToast('请先上传门店照');
                    return false;
                }
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img8')));
                if (this.merType == '02') {
                    if (this.datas.socialCode) {
                        delete this.datas.licenseBegindate;
                        delete this.datas.licenseDeadline;
                    }
                }

                if (this.userImg.path == '' || this.userImg.path == undefined) {
                    showToast('请先上传法人正面照');
                    return false;
                }
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('userImg')));
                if (this.img11.path == '' || this.img11.path == undefined) {
                    showToast('请先上传营业场所室内照');
                    return false;
                }
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img11')));
                if (this.merType == '02') {
                    if (this.img21.path == '' || this.img21.path == undefined) {
                        showToast('请先上传经营商品照');
                        return false;
                    }
                    this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img21')));
                    if (this.img20.path == '' || this.img20.path == undefined) {
                        showToast('请先上传证明材料');
                        return false;
                    }
                    this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img20')));
                    this.datas.legalSexType = this.legalSexType;
                    this.datas.legalOccupation = this.legalOccupation;
                }

                console.log(this.datas )
                if (!this.businessType){
                    this.datas.businessType = 1;
                }else{
                    this.datas.businessType = this.businessType;
                }

                this.datas.mccCode = this.mccCode;
                this.saveSession();
                // if(this.img6.path==''){
                //     showToast('请先上税务登记证照');`
                //     return false;
                // }
                // if(this.img7.path==''){
                //     showToast('请先上传组织机构代码证照');
                //     return false;
                // }

                // merType:'',//注册类型
                //     mercialName:'',//商铺名称
                //     province:{id:'',name:''},//省
                //     city:{id:'',name:''},//市
                //     area:{id:'',name:''},//营业区
                //     road:'',//营业地址路名
                //     houseNo:'',//营业地址门牌
                //     bankUser:'',//开户户名
                //     bankCard:'',//银行卡卡号
                //     bankName:'',//银行支行名称
                //     bankNo:'',//开户行行号
                //     addrExt:'',//营业地址补充信息
                //     socialCode:'',//统一社会信用代码

                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img1')));
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img2')));
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img5')));
                // this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img6')));
                // this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img7')));
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img9')));
                this.datas.attachments.push(JSON.parse(sessionStorage.getItem('img10')));
                let model = this.datas;

                Indicator.open('加载中...');
                axios.post(this.URL + '/User/AddEnterMessage', model)
                    .then(res => {
                        Indicator.close();
                        if (res.data.retCode == '200' || res.data.retCode == '201') {
                            showToast('提交成功');
                            sessionStorage.removeItem('sessions');
                            sessionStorage.removeItem('imgData');
                            sessionStorage.removeItem('img1');
                            sessionStorage.removeItem('img2');
                            // sessionStorage.removeItem('img2');
                            if (sessionStorage.getItem('userImg')) {
                                sessionStorage.removeItem('userImg');
                            }
                            if (sessionStorage.getItem('img4')) {
                                sessionStorage.removeItem('img4');
                            }
                            sessionStorage.removeItem('img5');
                            // sessionStorage.removeItem('img6');
                            // sessionStorage.removeItem('img7');
                            if (sessionStorage.getItem('img8')) {
                                sessionStorage.removeItem('img8');
                            }
                            sessionStorage.removeItem('img9');
                            sessionStorage.removeItem('img10');
                            sessionStorage.removeItem('img21');
                            // if(sessionStorage.getItem('img11')){
                            sessionStorage.removeItem('img11');
                            // }
                            sessionStorage.removeItem('img1Url');
                            sessionStorage.removeItem('img2Url');
                            if (sessionStorage.getItem('userImgUrl')) {
                                sessionStorage.removeItem('userImgUrl');
                            }
                            if (sessionStorage.getItem('img4Url')) {
                                sessionStorage.removeItem('img4Url');
                            }
                            sessionStorage.removeItem('img5Url');
                            // sessionStorage.removeItem('img6Url');
                            // sessionStorage.removeItem('img7Url');
                            if (sessionStorage.getItem('img8Url')) {
                                sessionStorage.removeItem('img8Url');
                            }
                            sessionStorage.removeItem('img9Url');
                            sessionStorage.removeItem('img10Url');
                            sessionStorage.removeItem('img21Url');
                            let from = sessionStorage.getItem("from");

                            // if(sessionStorage.getItem('img11Url')){
                            sessionStorage.removeItem('img11Url');
                            // }
                            if (from && from == "by") {
                                setTimeout(() => {
                                    window.location.href = this.BYYL;
                                }, 1000);
                            } else {
                                this.$router.push('/wholesale/uploadf');
                            }

                        } else if (res.data.retCode == '400' || res.data.retCode == '301') {
                            // showToast(res.data.retMessage);
                            showToast('请核实您的身份证号码、开户行账号、开户行支行名称等信息是否正确，请勿重复提交，耐心等待');
                        } else if (res.data.retCode == '500') {
                            showToast('请勿重复提交，入驻信息正在审核中！！');
                        }
                    })
                    .catch(res => {
                        Indicator.close();
                        // console.log(res);
                    })
            },

        },
        watch: {
            isShow(val) {
                if (val) {
                    this.closeTouch()
                } else {
                    this.openTouch()
                }
            }
        }
    }

</script>
<style>
    body {
        background-color: #f5f5f5;
    }

    .uploading .user-content {
        margin: .6667rem 0;
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

    .uploading .select-list {
        position: relative;
        padding: 8px 30px 8px 10px;
        border: .0444rem solid #eee;
        border-radius: 5px;
    }
    .el-checkbox__inner{
        z-index: 0;
    }
    .uploading .select-list:after {
        display: block;
        content: "";
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -10px;
        width: 10px;
        height: 10px;
        border: #ccc solid;
        border-width: 1px 1px 0 0;
        transform: rotate(135deg);
        /* margin-bottom: 10px; */

    }

    .uploading .select-box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
    }

    .uploading .select-box .select-con {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #fff;
    }

    .uploading .select-box .select-btn {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        font-size: .6667rem;
        background-color: #e6e6e6
    }

    .uploading .select-box .sure-btn {
        color: #2696ff;
    }

    .uploading .select-box .cancle-btn {
        color: #4c4c4c;
    }

    .uploading .search-btn {
        border: 0 none;
        background-color: #f23030;
        color: #fff;
        font-size: .6222rem;
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

    /* 账户类型 */
    .radio_btn {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0 10px;
    }

    .radio_btn .mint-radiolist-title {
        width: 40%;
        font-size: 16px;
        margin: 0;
        color: #212121;
    }

    .radio_btn .mint-cell-wrapper {
        padding: 0;
        text-align: right;
    }

    .radio_btn .mint-radiolist-label {
        padding: 0;
    }

    .radio_btn .mint-radio-input:checked+.mint-radio-core {
        background-color: #f23030;
        border-color: #f23030;
    }

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

</style>
