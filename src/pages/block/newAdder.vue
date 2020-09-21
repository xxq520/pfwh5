<template>
    <div class="globaleditaddr">
        <mt-header title="修改收货地址" ref="header" :fixed="true" v-if="dzid">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            <mt-button slot="right" @click="updataAdder">保存</mt-button>
        </mt-header>
        <mt-header title="新增收货地址" ref="header" :fixed="true" v-else>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            <mt-button slot="right" @click="uploadNewAddr">保存</mt-button>
        </mt-header>

        <div class="wrap2">
            <mt-field label="收货人：" placeholder="请输入收货人" v-model="name"></mt-field>
            <mt-field label="电话：" placeholder="请输入电话号码" type="tel" :attr="{ maxlength:11}" v-model="phone"></mt-field>
            <mt-field label="选择地址：" placeholder="请选择城市所在地址" v-model="cities" @click.native="showcities">
                <i class="mint-cell-allow-right"></i>
            </mt-field>
            <mt-field label="详细地址：" placeholder="请输入详细地址" v-model="address"></mt-field>
        </div>

        <!-- 城市弹出框 -->
        <div v-if="showAddress">
            <addressa @bindtap="bindtap"></addressa>
        </div>
    </div>
</template>

<script type="text/javascript">
    import s from "../../assets/js/ProvinceCityAreaList.json";
    import {
        showToast
    } from "../../assets/js/common";
    import {
        phoneRuler
    } from "../../assets/js/common";
    import addressa from './zjAddress';
    export default {
        name: "addNewAddr",
        data() {
            return {
                topnav: {
                    title: "新增地址"
                },
                name: "",
                phone: "",
                telPhone: "0",
                idcard: "",
                parentId: 1,
                id: 1, //id=1表示新增一条地址数据
                address: "",
                cities: "",
                zipCode: "0", //邮编
                addTime: "00",
                showAddress: false, //城市弹窗隐藏
                mapJson: s, //省市数据json文件
                sheng: "", //区级双向绑定数据
                shi: "", //市级选择双向数据绑定
                qu: "", //县级选择双向数据绑定
                regionProvinceId: "",
                regionCityId: "",
                regionDistrictId: "",
                province: [], //省返回数组
                city: [], //市区返回数据数组
                block: [], //区返回数据数组
                area: [], //区县返回数据数组
                erjidata: [], //三级数据所需二级数据暂存
                uSeq: this.$store.state.userInfo.seq,
                userId: this.$store.state.userInfo.userId,
                dzid: this.$route.query.id,
                addressList: [],


            };
        },
        components: {
            "addressa": addressa,

        },
        created() {

        },
        mounted() {
            if (this.dzid) {
                this.getInfo()
            };
            this.$refs.header.$el.style.background =
                "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
            document
                .querySelector("body")
                .setAttribute("style", "background-color:#f5f5f5");
        },
        methods: {
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            //获取修改地址的信息
            getInfo() {
                axios({
                    url: this.blockURL + '/qypfs-user/userShippingAddress/get',
                    method: 'get',
                    params: {
                        shippingAddressId: this.dzid,
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.name = data.userName;
                        this.address = data.address;
                        this.phone = data.mobileNumber;
                        this.regionProvinceId = data.regionProvinceId;
                        this.sheng = data.regionProvinceName;
                        this.shi = data.regionCityName;
                        this.regionCityId = data.regionCityId;
                        this.qu = data.regionDistrictName;
                        this.regionDistrictId = data.regionDistrictId;
                        this.cities = this.sheng + this.shi + this.qu;
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //修改地址
            updataAdder() {
                let amodel = {
                    userId: this.userId,
                    userName: this.name,
                    address: this.address,
                    mobileNumber: this.phone,
                    regionProvinceId: this.regionProvinceId,
                    regionProvinceName: this.sheng,
                    regionCityName: this.shi,
                    regionCityId: this.regionCityId,
                    regionDistrictName: this.qu,
                    regionDistrictId: this.regionDistrictId,
                    shoppingAddressId: this.dzid
                };
                this.cities = this.sheng + this.shi + this.qu;
                var input = /^[\s]*$/;
                if (input.test(this.cities)) {
                    showToast("地址不能为空", "middle");
                } else if (this.address == "") {
                    showToast("详细地址不能为空", "middle");
                } else if (this.name == "") {
                    showToast("收货人不能为空", "middle");
                } else if (!phoneRuler(this.phone) || this.phone == "") {
                    showToast("请输入正确的手机号码", "middle");
                } else {
                    axios.post(
                            this.blockURL + "/qypfs-user/userShippingAddress/update",
                            amodel
                        )
                        .then(res => {
                            if ((res.data.code = 200)) {
                                showToast(res.data.message, "middle");
                                 sessionStorage.removeItem("cityAddress")
                                setTimeout(() => {
                                    this.$router.go(-1);
                                }, 1000);
                            } else {
                                showToast("网络开小差啦", "middle");
                            }
                        });
                }
            },
            //新增地址
            uploadNewAddr() {
                let amodel = {
                    userId: this.userId,
                    userName: this.name,
                    address: this.address,
                    mobileNumber: this.phone,
                    regionProvinceId: this.regionProvinceId,
                    regionProvinceName: this.sheng,
                    regionCityName: this.shi,
                    regionCityId: this.regionCityId,
                    regionDistrictName: this.qu,
                    regionDistrictId: this.regionDistrictId
                };
                this.cities = this.sheng + this.shi + this.qu;
                var input = /^[\s]*$/;
                if (input.test(this.cities)) {
                    showToast("地址不能为空", "middle");
                } else if (this.address == "") {
                    showToast("详细地址不能为空", "middle");
                } else if (this.name == "") {
                    showToast("收货人不能为空", "middle");
                } else if (!phoneRuler(this.phone) || this.phone == "") {
                    showToast("请输入正确的手机号码", "middle");
                } else {
                    axios.post(
                            this.blockURL + "/qypfs-user/userShippingAddress/insert",
                            amodel
                        )
                        .then(res => {
                            if ((res.data.code = 200)) {
                                showToast(res.data.message, "middle");
                                sessionStorage.removeItem("cityAddress")
                                setTimeout(() => {
                                    this.$router.go(-1);
                                }, 1000);
                            } else {
                                showToast("网络开小差啦", "middle");
                            }
                        });
                }
            },
            //城市选择弹窗
            showcities() {
                this.showAddress = true;

            },
            bindtap(e) {

             
                this.showAddress = !this.showAddress;
                var str = "";
                var address =
                    sessionStorage.getItem("cityAddress") ? JSON.parse(sessionStorage.getItem("cityAddress")) : [];
                var arr = [];
                Object.keys(address).map((item, index) => {
                    str += address[item].name || "";
                    if (address[item].name) {
                        arr.push(address[item])
                    }
                });
                this.addressList = arr;
                this.cities = str;

              this.regionProvinceId =this.addressList[0].id;
              this.sheng =this.addressList[0].name;
              this.shi = this.addressList[1].name;
              this.regionCityId = this.addressList[1].id;
              this.qu = this.addressList[2].name;
              this.regionDistrictId = this.addressList[2].id;

            },
        }
    };

</script>

<style scoped>
    .el-select-dropdown {
        z-index: 1000000 !important;
    }

    .globaleditaddr {
        padding-top: 2rem;
    }

    .myToast {
        z-index: 999999999;
    }

    .globaleditaddr .wrap2 {
        margin-top: 0.3333rem
            /* 15/45 */
        ;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background: #fff;
        position: relative;
    }

    .globaleditaddr>>>.mint-field-core {
        font-size: 0.58rem;
        color: #666;
    }

    .globaleditaddr>>>.mint-cell-text {
        font-size: 0.62rem;
        color: #666;
    }

    .globaleditaddr .wrap2 .mint-cell-value.is-link {
        width: 70%;
        margin-right: 0px;
    }

    .globaleditaddr .wrap2 .mint-cell-value.is-link span {
        font-size: 0.7111rem
            /* 32/45 */
        ;
        color: #212121;
    }

    .globaleditaddr .wrap2 .mint-cell-wrapper {
        padding: 0;
    }

    .globaleditaddr .wrap2 .mint-cell-title {
        font-size: 0.7111rem
            /* 32/45 */
        ;
        color: #212121;
    }

    .globaleditaddr .wrap2 .mint-field,
    .globaleditaddr .mint-cell {
        border-bottom: 1px solid #e9e9e9;
    }

    .globaleditaddr .wrap2 .mint-field .mint-cell-title {
        width: 3.5556rem
            /* 160/45 */
        ;
    }

    /* 地址选择弹窗 */
    .globaleditaddr .mint-popup-bottom {
        width: 100%;
    }

    .globaleditaddr .addrpop .btntop {
        background: #e6e6e6;
        display: flex;
        justify-content: space-between;
        height: 1.7778rem
            /* 80/45 */
        ;
        line-height: 1.7778rem
            /* 80/45 */
        ;
        padding: 0 0.5rem;
    }

    .globaleditaddr .addrpop .btntop span {
        display: block;
        font-size: 0.7111rem
            /* 32/45 */
        ;
        color: #4c4c4c;
    }

    .globaleditaddr .addrpop .btntop span:nth-child(2) {
        color: #2696ff;
    }

    .globaleditaddr .addrpop .content {
        font-size: 0.7111rem
            /* 32/45 */
        ;
        color: #212121;
        padding-left: 0.5rem;
        margin: 2.2222rem
            /* 100/45 */
            0;
    }

    .globaleditaddr .addrpop .content .city {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 1.5556rem
            /* 70/45 */
        ;
        height: 1.5556rem
            /* 70/45 */
        ;
        line-height: 1.5556rem
            /* 70/45 */
        ;
    }

    .globaleditaddr .addrpop .content .area {
        margin-bottom: 1.5556rem
            /* 70/45 */
        ;
    }

    .globaleditaddr .addrpop .content .el-select {
        z-index: 99999;
    }

    .globaleditaddr .addrpop .content .area {
        display: flex;
        flex-wrap: nowrap;
        height: 1.5556rem
            /* 70/45 */
        ;
        line-height: 1.5556rem
            /* 70/45 */
        ;
    }

</style>
