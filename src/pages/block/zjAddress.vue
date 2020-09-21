<template>
    <div class="areaWholesales">
        <div class="hd">
            <img class="icon_3" @click="goBack" :src="require('../../assets/images/leftbtn.png')"/>
            <span class="txt" :lines="1">选择批发区域</span>
        </div>
        <div class="windowArea" v-if="modalBox">
            <div class="region_box region_box1">
                <ul class="region setup1">
                    <li :class="{'finish':areaType > index}"
                            v-for="(item,index) in areaStatus"
                            @click="getSubLocation(index)"
                            :key="index">
                        <i :class="{'last':index == 2}"></i>
                        <span>{{ selectLocation[index+1].name || item }}</span>
                    </li>
                </ul>
                <div class="Selection">
                    <div class="title">
                        <p :class="{'isShow':areaType === (index + 1)}"
                           v-for="(item,index) in areaStatus"
                           :key="index">{{ item }}</p>
                    </div>
                    <div class="box">
                        <ul class="provinceData" :class="{'isShow':areaType === 1}" type="1">
                            <li v-if="province.id!=1" v-for="(province,index) in provinceData"
                                @click="handleSelect(2,province)"
                                :key="index">{{ province.name }}
                            </li>
                            <li class="current" v-if="!provinceData.length"> 暂不选择</li>
                        </ul>
                        <ul class="cityData" :class="{'isShow':areaType === 2}" type="2">
                            <li v-for="(city,index) in cityData"
                                @click="handleSelect(3,city)"
                                :key="index">{{ city.name }}
                            </li>
                            <li class="current" v-if="!cityData.length"> 暂不选择</li>
                        </ul>
                        <ul class="areaData" :class="{'isShow':areaType === 3}" type="3">
                            <li v-for="(area,index) in areaData"
                                @click="handleSelect(null,area)"
                                :key="index">{{ area.name }}
                            </li>
                            <li class="current" v-if="!areaData.length"> 暂不选择</li>
                        </ul>
                        <!-- <ul class="streetData" :class="{'isShow':areaType === 4}" type="4">
                            <li v-for="(street,index) in streetData"
                                @click="handleSelect(null,street)"
                                :key="index">{{ street.name }}
                            </li>
                            <li class="current" v-if="!streetData.length"> 暂不选择</li>
                        </ul> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {showToast} from "../../assets/js/common";
    import {get, post} from "../../assets/js/http";

    export default {
        //区域批发商
        name: "addressa",
        data: () => ({
            // topnav:{
            //   title:'平台级区域批发'
            // },
            modalBox: true,
            areaStatus: ['选择省份', '选择城市', '选择县/区'],
            areaType: 1,//show provinceData
            provinceData: [],//省份
            cityData: [],//市区
            areaData: [],//县区
            streetData: [],//街道
            selectLocation: {
                1: '',//province
                2: '',//city
                3: '',//area
                4: '',//street
            },
            options: [],//经营类型s
            //value: '',//当前经营类型
            checked: false,//协议
            isShow:true,//协议动画
        }),
        created() {
            //Wseq
            this.UserSEQ = sessionStorage.getItem('seq');            // this.getGetdictData(this.UserSEQ);
            this.toggleModalBox(true)
        },

        mounted() {
            const self = this;
            function delayRun() {
                const {applyData,againApply} = self.$route.query;
                if (againApply && applyData) {//修改申请 数据回填
                    const preApplyData = JSON.parse(applyData);
                    const {Province,City,Area,Street} = preApplyData;
                    const temArr = [Province,City,Area,Street];
                    for (let key in self.selectLocation) {
                        self.selectLocation[key] = {value:temArr[key-1]}
                    }
                }
            }
            setTimeout(delayRun,400);
        },
        computed: {
            ...mapState(['userInfo']),
        },
        methods: {
            goBack(){
                this.$emit('bindtap',1);
            },
            /**
             * 显示地区模态框
             * @param isShow
             */
            toggleModalBox(isShow) {
                this.modalBox = isShow;
                this.getAreaData(1);
                this.areaType = 1;
            },
            /**
             * 处理上方select点击事件wholesaleCheckProgress
             * type 0 1 2 3
             */
            getSubLocation(type) {
                switch (type + 1) {
                    case 1:
                        if (!this.selectLocation[type]) {
                            this.getAreaData(type + 1);
                        }
                        break
                    case 2:
                        if (!this.selectLocation[type]) {
                            showToast('请先选择省份！', 'center');
                            return
                        }
                        break
                    case 3:
                        if (!this.selectLocation[type]) {
                            showToast('请先选择市区！', 'center');
                            return
                        }
                        break
                    case 4:
                        if (!this.selectLocation[type]) {
                            showToast('请先选择县！', 'center');
                            return
                        }
                        break
                    default:
                        break
                }
                if (type) {
                    const id = this.selectLocation[type].id;
                    this.getAreaData(type + 1, id);
                }
                //显示下列地区数据
                this.areaType = type + 1;
            },
            /**
             * 处理选中地区点击事件
             * @param type
             * @param item 具体地区
             */
            handleSelect(type, item) {
                if (type !== null) {
                    //获取后台地区数据
                    this.getAreaData(type, item.id);
                    //保存已选地区
                    this.selectLocation[type - 1] = item;
                    //显示下列地区数据
                    this.areaType = type;
                    sessionStorage.setItem("cityAddress",JSON.stringify(this.selectLocation));
                } else {
                    //保存已选地区
                    this.selectLocation[4] = item;
                    this.areaType = 4;
                    sessionStorage.setItem("cityAddress",JSON.stringify(this.selectLocation));
                    this.$emit('bindtap',1);
                }
            },
            /**
             * 获取地区接口
             * @param type
             * @param pid
             * @returns {Promise<void>}
             */
            async getAreaData(type = 1, pid = 1) {
                // const res = await get(`http://nfxts.520shq.com/localQuickPurchase/brandSquare/region?type=${type}&pid=${pid}`)
                const res = await get(this.blockURL+`/qypfs-user/region?type=${type}&pid=${pid}`);
                if (res.code === 200) {
                    switch (type) {
                        case 1:
                            this.provinceData = res.data;
                            break
                        case 2:
                            this.cityData = res.data;
                            break
                        case 3:
                            this.areaData = res.data;
                            break
                        case 4:
                            this.streetData = res.data;
                            break
                        default:
                            break
                    }
                }
            },
            /**
             * 获取经营类型
             * @param seq
             * @returns {Promise<void>}
             */
            async getGetdictData(seq) {
                const res = await get(this.URL + '/WholesaleManage/GetdictData', {seq});
                this.options = res.data.map(item => {
                    return {
                        value: item.id,
                        label: item.lable
                    }
                });
            },
            /**
             * 申请入驻
             * @returns {Promise<void>}
             */
            async applySubmit() {
                //1：商家；2：批发商；3：线下服务中心；4：代理商；5：普通用户；6：供货商；7：批发商代理商；8：批发网品牌商；
                //1 3 4 7
                if (!this.selectLocation[4]) {
                    Toast('请选择详细地区!');
                    return
                }

                if (!this.checked) {
                    this.isShow = false
                    setTimeout(()=>{
                        this.isShow = true;
                    },450);
                    return
                }

                const {accountType} = this.userInfo;
                ///AreaWholesaler/Apply
                let url = '/AreaWholesaler/Apply'

                let formData = {
                    UserSEQ: this.UserSEQ,
                    WholesalerSEQ: this.UserSEQ,
                    Province: this.selectLocation[1].value,
                    accountType: +accountType,
                    OperationType: this.value + ''//经营类型
                }
                ;
                if (this.$route.query.againApply) {//更新申请
                    url = '/AreaWholesaler/UpdateApply';
                    formData.ApplyStatus = 0;
                    formData.IsAgree = true;
                    delete formData.UserSEQ;
                    delete formData.accountType;
                }

                if (this.selectLocation[2]) formData.City = this.selectLocation[2].value;
                if (this.selectLocation[3]) formData.Area = this.selectLocation[3].value;
                if (this.selectLocation[4]) formData.Street = this.selectLocation[4].value

                const res = await post(this.URL + url, formData);

                if (res.Success) {
                    //跳转
                    this.$router.push({
                        path: '/wholesale/applyRecord',
                        query: {selectLocation: this.selectLocation,OperationType:this.value}
                    });
                } else {
                    showToast(res.Msg)
                }


            },


        }
    }


</script>

<style scoped>
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
    .areaWholesales {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10000;
    }

    .areaWholesales .icon-back {
        position: absolute;
        top: .28rem;
        left: .28rem;
        width: 1.16rem;
        height: 1.16rem;
    }

    .areaWholesales .bg-desc {
        position: absolute;
        top: 37vh;
        left: 50%;
        transform: translateX(-50%);
        width: 11.4rem;
        height: 7rem;
    }

    .areaWholesales .bg-flow {
        position: absolute;
        top: 63vh;
        left: 50%;
        transform: translateX(-50%);
        width: 15.14rem;
        height: 1.95rem;
    }

    .opt-wrapper {
        position: absolute;
        top: 71vh;
        width: 100%;
    }

    .opt-wrapper .cell-type {
        text-align: center;
        font-size: 0.6rem;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #fff;
    }

    .opt-wrapper .el-select {
        margin-top: .15rem;
        padding: 0 .5rem;
        width: 100%;
        text-align: center;
    }

    .opt-wrapper .area-wrap {
        position: relative;
        margin-top: .3rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 .9rem;
    }

    .opt-wrapper .area-wrap .icon-adress {
        position: absolute;
        left: 0;
        top: .22rem;
        width: .9rem;
        height: .9rem;
    }

    .opt-wrapper .area-wrap .area-item {
        position: relative;
        margin-bottom: .2rem;
        width: 45%;
        height: 1.3rem;
        line-height: 1.3rem;
        font-size: 0.56rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333;
        text-align: center;
        white-space: nowrap;
        /*overflow: hidden;*/
        text-overflow: ellipsis;
        background-color: #fff;
    }

    .top-line:before{
        display: block;
        content: '';
        position: absolute;
        top: .6rem;
        left: 7.3rem;
        width: 1rem;
        height: .11rem;
        border-radius: .02rem;
        background-color: #fff;
    }

    .sub-line:after{
        display: block;
        content: '';
        position: absolute;
        top: 2.1rem;
        left: 7.3rem;
        width: 1rem;
        height: .11rem;
        border-radius: .02rem;
        background-color: #fff;
    }


    .opt-wrapper .btn-box {
        /*margin-top: 1.2rem;*/
        width: 100%;
        text-align: center;
    }

    .opt-wrapper .submit-wrap {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0.1rem;
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .opt-wrapper .btn-apply {
        margin: 0 auto;
        width: 6.98rem;
        height: 1.4rem;
        background: rgba(181, 51, 255, 1);
        border-radius: 1rem;
        text-align: center;
        line-height: 1.4rem;
        font-size: 0.84rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 254, 254, 1);
    }

    .agreement {
        margin-top: 10px;
        text-align: center;
    }

    .agreement span {
        font-size:0.6rem;
        font-family:PingFang SC;
        font-weight:400;
        color:#2879FF;
    }

    .agreement .is-agre {
        color: #212121;
    }

    .agreement .el-checkbox .el-checkbox__label {
        font-size: .59rem;
        color: #169BD5;
    }

    /*动画*/
    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.4);
        }
        100% {
            transform: scale(1);
        }
    }

    .areaWholesales-tilte {
        font-size: .7rem;
        color: #fe6f37;
        text-align: center;
    }

    .cell {
        margin-top: .36rem;
        width: 100%;
        padding: 0 .4rem;
        /*background: #00AFFF;*/
    }

    .cell-nav {
        font-size: .65rem;
        color: #000000;
    }

    .cell-content {
        font-size: .62rem;
        padding: .3rem 0;
        color: #333;
        line-height: 1rem;
        /*background-color: #2acf2e;*/
    }

    .submit-btn {
        margin: 3rem auto 0;
        border-radius: 4px;
        font-size: .65rem;
        width: 5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        color: #fff;
        text-align: center;
        background-color: #fe6f37;
    }

    .active-color {
        color: #fe6f37;
    }

    .area-location {
        margin-top: .3rem;
        padding: .3rem .3rem;
        display: flex;
        justify-content: space-between;
        font-size: .65rem;
        color: #333;
        line-height: 1rem;
        /*background-color: #fff;*/
    }


    /* 选择区域模态框 */
    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 66;
        /*display: none;*/
    }

    .windowArea .region_box {
        width: 100%;
        height: 92%;
        position: absolute;
        top: 7.2%;
        left: 0;
        background-color: #fff;
        border-radius: .4444rem .4444rem 0 0;
        box-sizing: border-box;
        z-index: 999;
    }

    .windowArea .region_box .title {
        height: 1.5333rem;
        line-height: 1.5333rem;
        text-align: center;
        font-size: .5333rem;
        color: #333333;

    }


    .windowArea .region_box ul.region {
        width: 100%;
        padding: 0 .5333rem;
        padding-bottom: .5333rem;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
    }

    .windowArea .region_box ul.region li {
        width: 100%;
        display: -moz-box; /* Firefox */
        display: -ms-flexbox; /* IE10 */
        display: -webkit-box; /* Safari */
        display: -webkit-flex; /* Chrome, WebKit */
        display: box;
        display: flexbox;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 1.7778rem;
        line-height: 1.7778rem;
        color: #ec0746;
    }

    .windowArea .region_box ul.region li i {
        width: .2222rem;
        height: .2222rem;
        border: 1px solid #ec0746;
        border-radius: 50%;
        position: relative;
    }

    .windowArea .region_box ul.region li i::after {
        content: '';
        width: 1px;
        height: 1.5111rem;
        position: absolute;
        top: .2222rem;
        left: 50%;
        background-color: #ec0746;
    }

    .windowArea .region_box ul.region li i.last::after {
        content: "";
        width: 0;
        height: 0;
        background-color: #fff;
    }


    .windowArea .region_box ul.region li span {
        padding-left: 1.0222rem;
        color: #999999;
        font-size: .6222rem;

    }

    .windowArea .region_box ul.region li.act span {
        /*color: #ec0746;*/
        color: #333;

    }

    /* 选择后 */
    .windowArea .region_box ul.region li.finish span {
        color: #333;

    }

    /* 当前状态 */
    .windowArea .region_box ul.region li.finish i,
    .windowArea .region_box ul.region li.act i {
        background-color: #ec0746;
    }

    /* 城市县区街道选择 */
    .windowArea .region_box .Selection {
        width: 100%;
        box-sizing: border-box;
        padding: .5778rem 0 0 0;
        height: 14rem;
    }

    .windowArea .region_box .Selection p {
        font-size: .6222rem;
        color: #999999;
        padding: 0 .5333rem .2222rem;
        display: none;
        text-align: left;
    }

    .windowArea .region_box .Selection p.isShow {
        display: block;
    }


    /* 所有ul 可滚动的样式 */
    .windowArea .region_box .Selection .box {
        height: 15rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .windowArea .region_box .Selection ul {
        display: none;
        width: 100%;
        /*overflow: auto;*/
        /*overflow-y:scroll;*/
        padding-bottom: 2rem;
    }

    .windowArea .region_box .Selection ul.isShow {
        display: block;
    }

    .windowArea ul.hidden {
        display: none;
    }

    .windowArea ul.isShow {
        display: block;
    }

    .windowArea .region_box ul.province {

    }

    .windowArea .region_box .Selection ul li {
        height: 1.9556rem;
        line-height: 1.9556rem;
        /* padding-left: 1.3333rem;  */
        position: relative;
        padding: 0 .5333rem 0 1.9556rem;
        font-size: 15px;

    }

    .windowArea ul li span {
        position: absolute;
        left: .5333rem;
        color: #999999;
    }

    /* 选择当前样式 */
    .windowArea .region_box .Selection ul li.current {
        background-color: #fff;

    }

    .windowArea .region_box ul li.current::after {
        content: "";
        width: .6667rem;
        height: .6667rem;
        /*background: url('../img/android/drawable-hdpi/icon.png') no-repeat;*/
        position: absolute;
        top: 50%;
        margin-top: -.3333rem;
        right: .5333rem;
        background-size: 100%;
        background-position: center;
        /* background-color: #e4393c; */


    }

    /*  模态框end  */

</style>
