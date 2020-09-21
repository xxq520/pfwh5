<template>
    <div class="store-info">
        <!-- header -->
        <mt-header title="补充店铺信息" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            <span @click="edit" v-if="!isEdit" slot="right" style="font-size: 0.6rem">编辑</span>
        </mt-header>
        <!-- 内容 -->
        <div class="box">
            <div class="content">
                <div class="content-item avartBox">
                    <span class="item-left">头像</span>
                    <div class="item-right">
                        <img v-if="storeInfo.icon||userInfo.icon" :src="storeInfo.icon||userInfo.icon" class="alertImg" alt="">
                        <input v-if="isEdit" @change="upImg('icon')" accept="image/*" type="file" ref="icon"
                               class="img-file avart">
                        <img class="shopPic" :src="storeInfo.icon||userInfo.icon" alt="">
                        <img :src="require('../../assets/images/right2.png')" class="icon-img">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">法人姓名</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.shopGuaranteeName" type="text"
                               placeholder="请补充法人姓名">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">手机号</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.phone" type="text" placeholder="请补充手机号">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">身份证号</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.identityCard" type="text" placeholder="请补充身份证号">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">营业执照编号</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.licenseCode" type="text" placeholder="请补充营业执照编号">
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="content-item">
                    <span class="item-left">店铺名称</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.storeName" type="text" placeholder="请补充店铺名称">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">所在市区</span>
                    <div class="item-right">
                        <input v-model="storeInfo.storeRegion" readonly="readonly"  type="text" placeholder="请补充所在市区">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">详细地址</span>
                    <div class="item-right">
                        <input :readonly="!isEdit" v-model="storeInfo.address" type="text" placeholder="请补充详细地址">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">行业</span>
                    <div class="item-right" @click="bankfn()">
                        <input v-model="storeInfo.categoryName" readonly="readonly" type="text" placeholder="请选择行业">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">审核状态</span>
                    <div class="item-right">
                        <input :value="['已通过','未通过'][storeInfo.status]" readonly="readonly" type="text" >
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="content-item">
                    <span class="item-left">营业执照照片</span>
                    <div class="item-right">
                        <img v-if="storeInfo.licenseImg" :src="storeInfo.licenseImg" class="alertImg" alt="" preview="1"
                             preview-text="店铺门头照片">
                        <input v-if="isEdit" @change="upImg('licenseImg')" accept="image/*" type="file" ref="licenseImg"
                               class="img-file">
                        <input :value="storeInfo.licenseImg?'点击查看':'点击上传'" type="text" readonly="readonly">
                        <img :src="require('../../assets/images/right2.png')" class="icon-img">
                    </div>
                </div>
                <div class="content-item">
                    <span class="item-left">店铺门头照片</span>
                    <div class="item-right">
                        <img v-if="storeInfo.shopFacadeImg" :src="storeInfo.shopFacadeImg" class="alertImg" alt=""
                             preview="1" preview-text="店铺门头照片">
                        <input v-else @change="upImg('shopFacadeImg')" accept="image/*" type="file" ref="shopFacadeImg"
                               class="img-file">
                        <input :value="storeInfo.shopFacadeImg?'点击查看':'点击上传'" type="text" readonly="readonly">
                        <img :src="require('../../assets/images/right2.png')" class="icon-img">
                    </div>
                </div>
            </div>
            <!--行业弹窗-->
            <mt-popup v-model="bankVisible" :closeOnClickModal="false" position="bottom" >
                <div class="visiblebtn">
                    <mt-button  @click="quedingfn" size="small" type="primary" class="queding">确定</mt-button>
                </div>
                <mt-picker :slots="bankslots" @change="bankchange" value-key="name" ></mt-picker>
            </mt-popup>
            <button v-if="isEdit&&storeInfo.userId" @click="saveStoreInfo" class="btn">保存</button>
        </div>
    </div>
</template>
<script>
    import {showToast} from '@/assets/js/common.js';
    import {Toast,Indicator} from 'mint-ui';

    var verification = {
        nameReg: /^[\u4E00-\u9FA5]{2,6}$/,
        phoneReg: /^1(3|4|5|6|7|8|9)\d{9}$/,
        cartCode: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    };
    export default {
        data() {
            return {
                // 是否处于编辑状态
                isEdit: false,
                // 是否显示行业弹窗
                bankVisible: false,
                // 行业的信息
                bankslots: [
                    {
                        flex: 1,
                        values: [],
                        className: 'bankslot',
                        textAlign: 'center',
                        defaultIndex: 5
                    }
                ],
                // 用户信息
                userInfo: this.$store.state.userInfo || {},
                // 店铺信息
                storeInfo: {},
            }
        },
        components: {},
        created() {
            // 获取所有行业信息
            this.getType();
            // 获取当前需要修改的店铺信息
            this.getStoreInfo();
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
        },
        methods: {
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
            // 获取店铺信息
            getStoreInfo() {
                var userInfo = this.userInfo;
                axios.get(this.blockURL + `/qypfs-store/store/findStoreShow?roleId=${userInfo.Blocktype}&userId=${userInfo.userId}`).then(res => {
                    console.log(res.data);
                    if (res.data.code == 200) {
                        this.storeInfo = res.data.data;
                        this.$previewRefresh()
                    }
                });
            },
            // 点击行业显示行业弹窗
            bankfn() {
                // 已有行业信息不允许修改
                if (this.storeInfo.categoryName) {
                    return false
                }
                // 如果是合并管理和统筹的话
                this.bankVisible = true;
            },
            // 点击行业中的确定按钮
            quedingfn() {
                if (this.bankVisible) {
                    this.bankVisible = false;
                    this.$set(this.storeInfo, 'categoryName', this.bankModel.name);
                    this.$set(this.storeInfo, 'categoryId', this.bankModel.id);
                    return true;
                } else if (this.typeVisible) {
                    this.typeVisible = false;
                    this.type = this.typeModel;
                    return true;
                }
            },
            // 更改行业事件
            bankchange(picker, values) {
                // 判断是否是重新提交审核数据
                if (this.bankslots[0].values.length) {
                    this.bankModel = values[0];
                    return true;
                }

            },
            // 点击编辑按钮事件
            edit() {
                this.isEdit = true;
            },
            // 点击保存店铺信息
            saveStoreInfo() {
                var storeInfo = this.storeInfo;
                var params = {
                    shopGuaranteeName: storeInfo.shopGuaranteeName,  // 法人姓名
                    phone: storeInfo.phone,  // 法人手机号
                    identityCard: storeInfo.identityCard, // 身份证
                    licenseCode: storeInfo.licenseCode, // 营业执照编号
                    storeName: storeInfo.storeName,  // 店铺名称
                    address: storeInfo.storeRegion, // 所在市区
                    storeAddressDetails: storeInfo.address,// 店铺详细地址
                    categoryName: storeInfo.categoryName, // 行业名称
                    categoryId: storeInfo.categoryId, // 行业id
                    licenseImg: storeInfo.licenseImg, // 营业执照
                    shopFacadeImg: storeInfo.shopFacadeImg, // 店铺门头照
                    userId: storeInfo.userId || this.userInfo.userId, // 用户id
                    seq: "",
                };
                if (params.phone.trim() && !verification.phoneReg.test(Number(storeInfo.phone))) {
                    Toast({message: "手机号格式有误", position: 'bottom', duration: 2000});
                    return false
                }
                if (params.identityCard.trim() && !verification.cartCode.test(params.identityCard)) {
                    Toast({message: "身份证号码格式有误", position: 'bottom', duration: 2000});
                    return false
                }
                if (!storeInfo.licenseImg) {
                    Toast({message: "请上传营业执照", position: 'bottom', duration: 2000});
                    return false
                }
                if (!storeInfo.shopFacadeImg) {
                    Toast({message: "请上传店铺门头照", position: 'bottom', duration: 2000});
                    return false
                }
                // 判断是否上传头像
                if (storeInfo.icon){
                    axios.post(this.blockURL + `/qypfs-user/user/updateUserInfo`, {
                        "icon": storeInfo.icon,
                        "userId": this.userInfo.userId
                    }).then(res => {
                        this.$set(this.userInfo,"icon",storeInfo.icon)
                    }).catch();
                }
                Indicator.open();
                axios.post(this.blockURL + `/qypfs-store/store/replenishStore`, params).then(res => {
                    console.log(res.data);
                    if (res.data.code == 200) {
                        Toast({message: "保存成功", position: 'bottom', duration: 2000});
                        this.isEdit = !this.isEdit;
                        // 重新获取店铺信息
                        this.getStoreInfo();
                    }
                    Indicator.close();
                }).catch(()=>Indicator.close());
            },
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            // 图片上传
            upImg(type) {
                if (!this.isEdit) {
                    return false
                }
                // 有营业执照不允许修改
                if (this.storeInfo[type] && type!='icon') {
                    return false;
                }
                let f = this.$refs[type].files[0];
                let param = new FormData();
                param.append('file', f);
                Indicator.open();
                axios.post('http://upload.520shq.com/upload', param).then(res => {
                    if (res.data.code == 200) {
                        this.$set(this.storeInfo, type, res.data.data.url);
                        this.$previewRefresh()
                    } else {
                        showToast(res.data.message)
                    }
                    Indicator.close();
                }).catch(() => {
                    Indicator.close();
                });
            },
        }
    }

</script>
<style scoped>
    .mint-popup {
        width: 100%;
    }
    .avart{
        z-index: 5 !important;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
        background: rgba(255, 96, 35, 1);
    }

    .box {
        padding-top: 54px;
        padding-bottom: 3rem;
    }
    .item-right .shopPic{
        width: auto;
        height: auto;
        max-height: 1.8rem;
    }
    .content {
        background-color: #fff;
        margin-bottom: 0.45rem;
    }

    .content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 2.25rem;
        padding: 0 0.57rem;
        border-bottom: 1px solid rgba(235, 235, 235, .7);
    }
    .avartBox{
        height: 2.8rem;
    }
    .avartBox .shopPic{
        max-height: 2.2rem;
    }
    .avartBox .alertImg{
        top: 0;
    }

    .content-item .item-left {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .content-item .item-right {
        display: flex;
        align-items: center;
        position: relative;
    }

    .content-item .item-right input {
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        text-align: right;
        width: 8rem;
    }

    .item-right img {
        width: 0.37rem;
        height: 0.59rem;
        margin-left: 0.37rem;
    }

    .btn {
        width: 100%;
        height: 2.23rem;
        background: rgba(255, 96, 35, 1);
        color: #fff;
        border: none;
        font-size: 0.77rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;
    }

    .blank p {
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 0.75rem;
    }

    .blank p:last-child {
        width: 3.5rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        background: rgba(255, 96, 35, 1);
        color: #fff;
        margin: 0 auto;
        margin-top: 0.7rem;
    }

    .mint-header {
        background-color: #f23030;
        color: #fff;
        height: 44px;
        font-size: 16px;
    }

    img.alertImg {
        position: absolute;
        top: -0.7rem;
        right: 0;
        width: 5rem;
        height: 2.25rem;
        margin: 0;
        z-index: 3;
        opacity: 0;
        filter: Alpha(opacity=0);
    }

    .img-file {
        width: 3rem;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        opacity: 0;
        filter: Alpha(opacity=0);
        z-index: 1;
    }
</style>
