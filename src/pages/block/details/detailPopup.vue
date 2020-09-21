<template>
    <div class="popup-bg">
        <div class="popup-box">
            <!--单价信息-->
            <div class="popup-item" v-if="list">
                <div class="pop-img"><img v-if="bannerImg" :src="bannerImg"></div>
                <div class="pop-text">
                    <p v-if="business == 2">￥{{ curData.salePrice || list.salePrice }}</p>
                    <p v-else-if="business == 1||blockType==6">￥{{ curData.salePrice || list.platformPrice }}</p>

                    <template>
                        <span v-for="(value, key) in list.propertyList" :key="key + '_1'"
                              v-text="value.propertyName + '：' + (selectSku[value.propertyName] || '未选择')"></span>
                    </template>

                    <span v-show="curData.stock == undefined">数量：请选择规格</span>
                    <span v-show="curData.stock != undefined"
                          v-text="'数量：' + (curData.stock > 0 ? '有现货' : '暂无现货')"></span>
                </div>
            </div>
            <!--规格选择信息-->
            <template v-if="list.propertyList">
                <div class="popup-item" v-for="(item, index) in list.propertyList" :key="index">
                    <div class="list-title">{{ item.propertyName }}</div>
                    <div class="list-box">
                        <span v-for="(obj,idx) in item.propertyValueList" v-text="obj.value" :key="idx"
                              @click="selectProperty(item, obj.value)"
                              :class="{'active': selectSku[item.propertyName] === obj.value}"></span>
                    </div>
                </div>
            </template>

            <!--购买数量-->
            <div class="popup-item" style="padding:0.4rem 0;"
                 v-if="(blockType == 5 && business == 1) || blockType == 6">
                <div class="add-text">购买数量</div>
                <div class="add-box">
                    <el-input-number
                        :min="curData.minimumQuantity || 1"
                        :max="9999"
                        v-model="num"
                        size="small"
                        @change="handleChange">
                    </el-input-number>
                </div>
            </div>
        </div>
        <!--按钮-->
        <div class="popup-btn"
             v-if="(blockType == 5 && business == 1) || blockType == 6">
            <button @click="addCart" v-preventReClick class="addCart"><span>加入购物车</span></button>
            <button @click="setbut" v-preventReClick class="buy"><span>立即购买</span></button>
        </div>
    </div>
</template>
<script>
    import {showToast} from '@/assets/js/common'

    export default {
        props: ["shift", 'list', 'skuList', 'skuLen'],
        data() {
            return {
                num: 1,
                visible: this.shift,
                getData: {},
                listData: {},
                listProject: true,
                countChange: false,
                headimg: '',
                selectSku: {}, // 选中sku数据集
                curData: {},
                blockType: this.$store.state.userInfo.Blocktype,
                business: this.$store.state.userInfo.business, // 1角色5买家  2角色5卖家
                ableBuy: false, // 当前能否购买
                // 选择规格时的商品主图展示
                bannerImg: ""
            }
        },
        created() {
        },
        mounted() {
            this.$previewRefresh()
        },
        watch: {
            visible(val) {
                this.$emit("detail-change", val);
            },
            list(val) {
                console.log(this.curData.skuId)
                if (!this.curData.skuId) {
                    this.bannerImg = val.imgList[0]
                }
            },
            shift(val) {
                console.log(val);
                if (!val) { // 关闭弹窗触发选择规格完毕
                    let curData = JSON.parse(JSON.stringify(this.curData));
                    curData.ableBuy = this.ableBuy;

                    let unit = this.list.unit || '件';
                    let selectSku = JSON.parse(JSON.stringify(this.selectSku));
                    selectSku.num = this.num + unit;

                    this.$emit('select-over-change', selectSku, curData);
                }
                this.visible = val;
            },
            listData(val) {
                console.log(val);
                this.$emit("listData-change", val);
            }
        },
        methods: {
            handleChange(value) {
                this.num = value;
            },
            // 选择规格
            selectProperty(item, obj) {
                console.log(item, obj, this.curData);

                if (this.selectSku[item.propertyName] == obj) {
                    this.$delete(this.selectSku, item.propertyName)
                    this.curData = {};
                    this.ableBuy = false;
                    this.num = 1;

                    return false;
                }
                this.$set(this.selectSku, item.propertyName, obj)

                let arr1 = Object.keys(this.skuList[0].check);
                let arr2 = Object.keys(this.selectSku);
                if (arr1.length != arr2.length) {
                    // console.log(arr1, arr2,666666666666666);
                    this.ableBuy = false;
                    return false;
                }

                this.skuList.forEach(item => {
                    let flag = this.checkProperty(item.check, this.selectSku, arr2);
                    if (flag) {
                        console.log(item,778888)
                        // 有相应的规格图片展示规格图片否则展示商品主图
                        this.bannerImg = item.skuImg || this.bannerImg;
                        this.curData = item;
                        this.ableBuy = true;
                        if (this.num < item.minimumQuantity) this.num = item.minimumQuantity;
                    }
                });
            },
            // 规格校验
            checkProperty(obj1, obj2, arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (obj1[arr[i]] != obj2[arr[i]]) return false;
                }
                return true;
            },
            // 确认订单参数获取
            orderParams() {
                let params = {};
                let productAndSkuQueryList = [];
                productAndSkuQueryList.push({
                    goodsNum: this.num,
                    productId: this.list.productId,
                    skuId: this.curData.skuId,
                    wholesalerId: this.$store.state.storeId
                })
                params.productAndSkuQueryList = productAndSkuQueryList;
                return params;
            },
            // 立即购买
            setbut() {
                // 是否选择规格
                let propertyList = this.list.propertyList;
                for (let i = 0; i < propertyList.length; i++) {
                    if (!this.selectSku[propertyList[i].propertyName]) {
                        showToast(`请选择${propertyList[i].propertyName}`);
                        return false;
                    }
                }
                if (this.num < this.curData.minimumQuantity) return showToast(`单次起订量为${this.curData.minimumQuantity + this.list.unit}`);
                var payParams = {
                    "couponId": 0, // 优惠券ID
                    "fromDevice": "H5", // 来源设备
                    "productAndSkuQueryList": [ // 购物车选中的商品
                        {
                            "goodsNum": this.num, // 购买数量
                            "productId": this.list.productId, // 商品ID
                            "skuId": this.curData.skuId, // skuId
                            "wholesalerId": this.$store.state.storeId // 区域批发商ID
                        }
                    ],
                    "roleId": this.blockType, // 角色ID
                    "remarkList": [],
                };
                Indicator.open();
                axios.post(this.blockURL + '/qypfs-order/api/order/confirmOrder', payParams)
                    .then((res) => {
                        if (res.data.code == 200) {
                            sessionStorage.setItem("order", JSON.stringify(res.data.data));
                            sessionStorage.setItem("postOrder", JSON.stringify(payParams));
                            Indicator.close();
                            this.$router.push({
                                path: "/block/confirmorder",
                            })
                        } else {
                            showToast(res.data.message || '网络出错，稍后再试!')
                        }
                    }).catch(err => {
                    Indicator.close();
                })
            },
            // 加入购物车
            addCart() {
                if (!this.ableBuy) return showToast('请选择规格');
                if (this.num < this.curData.minimumQuantity) return showToast(`单次起订量为${this.curData.minimumQuantity + this.list.unit}`);
                let curData = {
                    ...this.curData,
                    ableBuy: this.ableBuy
                }
                let selectSku = {
                    ...this.selectSku,
                    num: this.num
                }
                this.visible = false;
                this.$emit('add-cart', selectSku, curData);
            }
        }
    }
</script>

<style>
    .myToast {
        z-index: 99999999;
    }

    .counttc {
        z-index: 999999
    }

    .v-modal {
        z-index: 100 !important;
    }

    .el-input-number--small {
        margin-top: 0.1rem;
        width: 114px;
        height: 1.2rem;
        overflow: hidden;
        line-height: 1.2rem;
    }

    .popup-bg .el-input-number .el-input__inner {
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.5rem;
    }
</style>

<style scoped>
    ::v-deep .pswp {
        z-index: 10000;
    }

    .popup-bg {
        width: 100%;
        overflow: auto;
        background: white;
        padding: 10px;
        height: 100%;
        padding-bottom: 0;
    }

    .popup-box {
        height: 100%;
        padding-bottom: 2.3rem;
        overflow-y: scroll;
    }

    .popup-item {
        overflow: hidden;
        padding: 0.5rem 0;
        font-size: 0.65rem;
        border-bottom: 1px solid rgba(230, 230, 230, .5);
    }

    .popup-item .pop-img {
        float: left;
        width: 4.5rem;
        height: 4.5rem;
    }

    .popup-item .pop-img img {
        height: 100%;
    }

    .popup-item .pop-text {
        float: right;
        width: calc(100% - 5rem);
        padding: 0.4rem 0;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    .popup-item .pop-text p {
        font-size: 0.7rem;
        color: #FF6023;
        line-height: 1.2em;
    }

    .popup-item .pop-text span {
        display: block;
        color: #666;
        padding-top: 0.17rem;
    }

    .list-title {
        overflow: hidden;
        color: #333;
        font-size: .542rem;
    }

    .list-box {
        overflow: hidden;
        width: calc(100% + 0.7rem);
    }

    .list-box span {
        float: left;
        min-width: 5em;
        padding: 1px 0.45rem;
        line-height: 2.1em;
        margin-right: 0.7rem;
        border-radius: .583rem;
        margin-top: 0.4rem;
        text-align: center;
        background: rgba(245, 245, 245, 1);
        color: #212121;
        font-size: .52rem;
    }

    .list-box span.active {
        color: #FFFFFF;
        background: #FF6023;
    }

    .list-box span.shover {
        background: #ff0025;
        color: white;
    }

    .add-text {
        float: left;
        line-height: 1.4rem;
        color: #333;
        font-size: .542rem;
    }

    .add-box {
        float: right;
    }

    .popup-btn {
        overflow: hidden;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: white;
        border-top: 1px solid #e0e0e0;
        z-index: 9999;
    }

    .popup-btn button {
        float: left;
        width: 50%;
        color: white;
        font-size: 16px;
        line-height: 100%;
        height: 50px;
        text-align: center;
        line-height: 45px;
        border: none;
    }

    .popup-btn button.addCart {
        background-color: #FFA800;
    }

    .popup-btn button.buy {
        background-color: #FF6023;
    }

    .popup-bg >>> .el-input-number span {
        border-color: #fff !important;
        background: #F5F5F5;
    }

    .popup-bg >>> .el-input-number .el-input__inner {
        padding-left: 40px;
        padding-right: 40px;
        border: 0 none;
        background: #F5F5F5;
    }

    .popup-bg >>> .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled), .popup-bg >>> .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
        border-color: #dcdfe6;
    }
</style>
