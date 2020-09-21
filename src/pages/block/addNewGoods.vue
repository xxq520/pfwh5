<template>
    <div class="addNewGoods" :style="{height:addNewGoodsHeight+'px'}">
        <!-- <div class="main" v-show="!isAddSpec"> -->
        <div class="main">
            <mt-header title="商品编辑" ref="header" :fixed='true'>
                <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            </mt-header>
            <ul class="goodsDesc">
                <li class="title">商品信息</li>
                <li class="goodsFilter">
                    <span class="liTitle">商品分类：</span>
                    <div class="liMain rightIcon">
                        <span class="filterOption"><input type="text" v-model="classify" placeholder="没有..."
                                                          readonly></span>
                    </div>
                </li>
                <li class="goodsName">
                    <span class="liTitle">商品名称：</span>
                    <input type="text" v-model="Name" placeholder="请输入商品名称(5-20个字符，特殊字符除外)">
                    <div class="liMain">
                    </div>
                </li>
                <li class="goodsInfo">
                    <span class="liTitle">商品简介：</span>
                    <div class="liMain"><input type="text" v-model="Crime" placeholder="没有..." readonly></div>
                </li>
                <li class="keyWords">
                    <span class="liTitle">关键字：</span>
                    <div class="liMain"><input type="text" v-model="Keywords" placeholder="没有..." readonly></div>
                </li>
            </ul>
            <ul class="specSetting">
                <li class="title">规格设置</li>
                <li class="specItem" v-for="(item,idx) in standard" :key="idx">
                    <p class="liTitle">规格{{ idx + 1 }}：</p>
                    <span class="text" @click="property2(item)">{{ item.name }}</span>
                    <span :class="item.isSetting == 1 ? 'status'  : 'status noSet'" @click="property2(item)"
                          v-text="item.isSetting == 1 ? '已设置' : '未设置'"></span>
                </li>
            </ul>
            <ul class="paramSetting">
                <li class="title">参数设置</li>
                <li class="factory" v-for="(item,index) in listProParameter" :key="index">
                    <span class="liTitle">{{item.parameter}}：</span>
                    <div class="liMain"><input type="text" v-model="item.parameterValue" placeholder="没有..." readonly>
                    </div>
                </li>
            </ul>
            <ul class="imgManagement">
                <li class="title">图片管理 <span>(第一张为商品主图)</span></li>
                <li class="goodsImg">
                    <span class="liTitle">商品图：</span>
                    <div class="liMain" v-if="listimg.length > 0">
                        <ul class="goodsImgList">
                            <li class="goodsImgItem" v-for="(item, index) in listimg" :key="index">
                                <img :src="item" preview="0" preview-text="商品图">
                                <img v-if="initData.product&&initData.product.videoUrl && index==0" @click="play" class="playIcon"
                                     :src="require('../../assets/images/block/icon_live.png')" alt="">
                            </li>
                        </ul>
                    </div>
                    <div class="liMain" v-else style="font-size:0.6rem;">没有</div>
                </li>
            </ul>
            <!--已上传商品不展示上传按钮，及修改信息-->
            <div v-if="!this.$route.query.noUp" class="submitBox">
                <button class="submitBtn" @click="optGoods" :class="{'submit-active': !ableSave}">
                    {{updateGoods==1?'更新上架':'上架'}}
                </button>
            </div>
        </div>
        <!--一批二批批发商-->
        <div class="addSpec" v-show="isAddSpec">
            <div class="addSpecMain">
                <span class="addSpec-close" @click="isAddSpec = false">X</span>
                <p class="addSpec-title">商品规格设置</p>
                <ul class="specList">
                    <li class="specItem size" v-for="(item,index) in Property" :key="index">
                        <p class="title">{{ item.Name }}</p>
                        <ul class="sizeList list">
                            <template v-for="(item, idx) in Standard">
                                <li class="sizeItem item"
                                    :key="idx"
                                    v-if="item.ParamterId == item.Id || item.ParameterId == item.Id"
                                    :class="{'sizehover':propertyOBJ['StandardName'+(index+1)] == item.Name}">
                                    <p>{{item.Name}}</p>

                                </li>
                            </template>

                        </ul>
                    </li>
                    <li class="specItem priceAndStock">
                        <p class="title">价格/库存</p>
                        <ul v-if="propertyOBJ.type==1" class="list" style="width:calc(100% + 0.4rem);">
                            <li class="storePrice inputStyle">
                                <p>平台价:</p>
                                <!--判断是否是区域批发商，如果是则禁止输入成本价-->
                                <input type="number" :disabled="userBlock" placeholder="输入平台价"
                                       v-model="propertyOBJ.factoryPrice" style="color: #999;">
                            </li>
                            <li class="salePrice inputStyle">
                                <p>销售价:</p>
                                <input type="number" placeholder="输入销售价" v-model="propertyOBJ.salePrice">
                                <span><em class="em-1" @click="optNumber('+', 'salePrice')"></em> <em class="em-2"
                                                                                                      @click="optNumber('-', 'salePrice')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>建议零售价:</p>
                                <input type="number" placeholder="输入建议零售价" v-model="propertyOBJ.retailPrice">
                                <span><em class="em-1" @click="optNumber('+', 'retailPrice')"></em> <em class="em-2"
                                                                                                        @click="optNumber('-', 'retailPrice')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>起订量:</p>
                                <input type="number" placeholder="输入起订量" v-model="propertyOBJ.minimumQuantity"
                                       @blur="inputnige($event,'minimumQuantity')">
                                <span><em class="em-1" @click="optNumber('+', 'minimumQuantity')"></em> <em class="em-2"
                                                                                                            @click="optNumber('-', 'minimumQuantity')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>库存量:</p>
                                <input type="number" placeholder="输入库存量" v-model="propertyOBJ.stock"
                                       @blur="inputnige($event,'stock')" readonly>
                                <!--                                @click="optNumber('-', 'stock')"-->
                                <span><em class="em-1"></em> <em class="em-2"></em></span>
                            </li>
                        </ul>
                        <!-- 自营商品设置商品信息 -->
                        <ul v-if="propertyOBJ.type==2" class="list" style="width:calc(100% + 0.4rem);">
                            <li class="salePrice inputStyle">
                                <p>批发价:</p>
                                <input type="number" placeholder="输入批发价" v-model="propertyOBJ.salePrice">
                                <span><em class="em-1" @click="optNumber('+', 'salePrice')"></em> <em class="em-2"
                                                                                                      @click="optNumber('-', 'salePrice')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>建议零售价:</p>
                                <input type="number" placeholder="输入建议零售价" v-model="propertyOBJ.retailPrice">
                                <span><em class="em-1" @click="optNumber('+', 'retailPrice')"></em> <em class="em-2"
                                                                                                        @click="optNumber('-', 'retailPrice')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>起订量:</p>
                                <input type="number" placeholder="输入起订量" v-model="propertyOBJ.minimumQuantity"
                                       @blur="inputnige($event,'minimumQuantity')">
                                <span><em class="em-1" @click="optNumber('+', 'minimumQuantity')"></em> <em class="em-2"
                                                                                                            @click="optNumber('-', 'minimumQuantity')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>成本价:</p>
                                <input type="number" placeholder="成本价" v-model="propertyOBJ.costPrice"
                                       @blur="inputnige($event,'costPrice')">
                                <span><em class="em-1" @click="optNumber('+', 'costPrice')"></em> <em class="em-2"
                                                                                                      @click="optNumber('-', 'costPrice')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>库存量:</p>
                                <input type="number" placeholder="库存量" v-model="propertyOBJ.stock"
                                       @blur="inputnige($event,'stock')" readonly>
                                <span><em class="em-1" @click="optNumber('+', 'stock')"></em> <em class="em-2"
                                                                                                  @click="optNumber('-', 'stock')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>安全库存量:</p>
                                <input type="number" placeholder="安全库存量" v-model="propertyOBJ.safeStock"
                                       @blur="inputnige($event,'safeStock')" readonly>
                                <span><em class="em-1" @click="optNumber('+', 'safeStock')"></em> <em class="em-2"
                                                                                                      @click="optNumber('-', 'safeStock')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>整件数量:</p>
                                <input type="number" placeholder="整件数量" v-model="propertyOBJ.count"
                                       @blur="inputnige($event,'count')" readonly>
                                <span><em class="em-1" @click="optNumber('+', 'count')"></em> <em class="em-2"
                                                                                                  @click="optNumber('-', 'count')"></em></span>
                            </li>
                            <li class="stock inputStyle">
                                <p>内包装:</p>
                                <input type="text" placeholder="内包装" v-model="propertyOBJ.unit"
                                       @blur="inputnige($event,'unit')">
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="saveSpec">
                <span class="saveSpecBtn" @click="confirm">保存</span>
            </div>
        </div>
        <!-- 判断是否有主图视频 -->
        <div v-if="initData.product&&initData.product.videoUrl">
            <playvideo :video-src="initData.product.videoUrl" :showVideo.sync="isShow"></playvideo>
        </div>
    </div>
</template>
<script>
    import {showToast, floatAdd, floatSub} from '../../assets/js/common';
    import playvideo from "../../components/block/video"

    export default {
        data() {
            return {
                userId: this.$store.state.userInfo.userId,
                code: this.$route.query.id,
                isAddSpec: false,
                addNewGoodsHeight: 0,
                classify: '',        // 商品分类
                postData: {},
                Name: '',
                Crime: '',
                Keywords: '',
                CompanyName: '',
                listimg: [],
                Property: [],
                Standard: [],
                propertyOBJ: new Object(),
                listProParameter: [],
                initData: [],
                userBlock: this.$store.state.userBlock,//是否是区域批发商身份 true是,//用户的身份是否是区域批发商 true为开启区域批发  false为平台批发商
                standard: [], // 规格
                standardList: {}, // 规格更新暂存数据
                ableSave: false, // 能否保存
                isShow: false,
                updateGoods: 0
            }
        },
        created() {
            this.updateGoods = this.$route.query.remind;
        },
        components: {
            playvideo
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff"
            if (this.userBlock) {
                $('.goodsName').find('input').attr('readonly', '');
                $('.goodsName').find('input').css({color: '#666'})
            }
            Indicator.open();
            let that = this;
            var url = this.blockURL + '/qypfs-product/admin/mobile/product/manage/detail';
            this.addNewGoodsHeight = document.documentElement.clientHeight;
            let params = {
                productId: this.code,
                userId: this.userId
            }
            axios.post(url, params).then(res => {
                Indicator.close();
                let data = res.data.data;
                this.postData = data;
                this.initData = res.data.data
                this.$previewRefresh()
                if (!data || !data.id) {
                    MessageBox({
                        title: "温馨提示",
                        message: '亲，从商品库添加的商品由于没有商品属性和规格，需要您移步到电脑端的批发商后台进行完善才可上架使用。感谢您的理解，谢谢！',
                        showCancelButton: false
                    }).then(action => {
                        if (action == 'confirm') {
                            return false;
                        }
                    })
                    return false;
                }
                ;
                this.Name = data.product.name;
                this.classify = data.product.categoryName;
                this.Crime = data.product.crime;
                this.Keywords = data.product.keyword;
                this.listCustomizeStandard = data.listCustomizeStandard;

                this.standard = data.standard;
                this.listProParameter = data.parameter;
                this.listimg = data.product.imgUrlList;

                this.checkSave();
            });
        },
        methods: {
            // 返回按钮
            goBack() {
                history.go(-1)
            },
            play() {
                this.isShow = true;
            },
            addSpec(isSpec) {
                this.isAddSpec = isSpec;
            },
            closeAddSpec() {
                this.isAddSpec = false;
            },
            property(obj) {
                let that = this;
                this.isAddSpec = true;
                this.propertyOBJ = obj;
                inputChange();
                $('.inputStyle input').on('change', inputChange);

                function inputChange() {
                    that.propertyOBJ.factoryPrice = Math.round(that.propertyOBJ.factoryPrice * 100) / 100;
                    that.propertyOBJ.salePrice = Math.round(that.propertyOBJ.salePrice * 100) / 100;
                    that.propertyOBJ.saleLinePrice = Math.round(that.propertyOBJ.saleLinePrice * 100) / 100;
                    that.propertyOBJ.retailPrice = Math.round(that.propertyOBJ.retailPrice * 100) / 100;
                    that.propertyOBJ.stock = Math.floor(that.propertyOBJ.stock * 100 / 100);
                    that.propertyOBJ.minimumQuantity = Math.floor(that.propertyOBJ.minimumQuantity * 100 / 100);
                };
                console.log(that.propertyOBJ);

            },
            // 上架
            optGoods() {
                if (!this.ableSave) {
                    showToast('请操作规格设置价格后再上架');
                    return;
                }
                let params = {
                    id: this.$route.query.id,
                    status: 1,
                    userId: this.userId
                }
                axios.post(`${this.blockURL}/qypfs-product/admin/mobile/product/updateStatus`, params).then(res => {
                    // axios.post(this.blockURL + '/admin/mobile/product/updateStatus', params).then(res =>{
                    console.log('updateStatus', res);
                    if (res.data.code == 200) {
                        setTimeout(() => {
                            this.$router.push({path: '/block/GoodsManagement'});
                        }, 1000)
                    }
                    showToast(res.data.message);
                })
            },
            property2(obj) {
                // 已上传商品不允许修改规格
                if (this.$route.query.noUp) {
                    return false;
                }
                this.propertyOBJ = obj;
                let params = {
                    id: obj.id
                }
                axios.post(this.blockURL + '/qypfs-product/admin/mobile/sku/getStandardById', params).then(res => {
                    // axios.post(this.blockURL + '/admin/mobile/sku/getStandardById', params).then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        let item = Object.assign(obj, data)
                        this.property(item);
                    } else {
                        showToast('获取规格信息失败，请稍后再试!');
                    }
                });
            },
            inputnige(event, val) {
                let elem = event.currentTarget;
                let text = new String(elem.value);
                let texts = val == 'stock' ? '库存量' : val == 'minimumQuantity' ? '起订量' : '';
                if (elem.value > 1000000000) {
                    if (val == 'stock') {
                        showToast(texts + '不能输入太大！');
                        this.propertyOBJ.stock = new Number(text.substring(0, 9));
                    } else if (val == 'minimumQuantity') {
                        showToast(texts + '不能输入太大！');
                        this.propertyOBJ.minimumQuantity = new Number(text.substring(0, 9));
                    }
                    ;
                    return false;
                }
            },
            confirm() {
                // 是否是自营商品
                if (this.propertyOBJ.type == 2) {
                    this.confirmMygood();
                    return false;
                }
                if (this.propertyOBJ.factoryPrice == 0) {
                    showToast('平台价不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.salePrice == 0) {
                    showToast('销售价不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.stock == null) {
                    showToast('库存量不能为空');
                    return false;
                }
                if (this.propertyOBJ.minimumQuantity == null) {
                    showToast('起订量不能为空');
                    return false;
                }
                // if (this.propertyOBJ.minimumQuantity > this.propertyOBJ.stock) {
                //     showToast('起订量不能大于库存量');
                //     return false;
                // }

                if (this.propertyOBJ.salePrice < this.propertyOBJ.salePriceFrom || this.propertyOBJ.salePrice > this.propertyOBJ.salePriceTo) {
                    return showToast(`销售价需在平台设置的销售价范围内：${this.propertyOBJ.salePriceFrom}~${this.propertyOBJ.salePriceTo}`)
                }

                if (this.propertyOBJ.retailPrice < this.propertyOBJ.retailPriceFrom || this.propertyOBJ.retailPrice > this.propertyOBJ.retailPriceTo) {
                    return showToast(`建议零售价需在平台设置的销售价范围内：${this.propertyOBJ.retailPriceFrom}~${this.propertyOBJ.retailPriceTo}`)
                }

                let curItem = JSON.parse(JSON.stringify(this.propertyOBJ))
                delete curItem.factoryPrice;
                delete curItem.propertyList;
                delete curItem.name;
                delete curItem.isSetting;
                this.updateStandard(curItem); // 更新规格
            },
            confirmMygood() {
                if (this.propertyOBJ.salePrice == 0) {
                    showToast('售价不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.retailPrice == 0) {
                    showToast('建议零售价不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.minimumQuantity == 0) {
                    showToast('起订量不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.costPrice == 0 || !this.propertyOBJ.costPrice) {
                    showToast('成本价不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.stock == 0 || !this.propertyOBJ.stock) {
                    showToast('库存量不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.safeStock == 0 || !this.propertyOBJ.safeStock) {
                    showToast('安全库存量不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.count == 0 || !this.propertyOBJ.count) {
                    showToast('整件数量不能为空或0');
                    return false;
                }
                if (this.propertyOBJ.minimumQuantity > this.propertyOBJ.stock) {
                    showToast('起订量不能大于库存量');
                    return false;
                }
                if (this.propertyOBJ.safeStock > this.propertyOBJ.stock) {
                    showToast('安全库存量不能大于库存量');
                    return false;
                }
                if (!this.propertyOBJ.unit.trim()) {
                    showToast('子单位不能为空');
                    return false;
                }
                let curItem = JSON.parse(JSON.stringify(this.propertyOBJ))
                delete curItem.factoryPrice;
                delete curItem.propertyList;
                delete curItem.name;
                delete curItem.isSetting;
                this.updateStandard(curItem, 2); // 更新规格
            },
            // 更新规格  type 1.520供应商品  2.自营商品
            updateStandard(curItem, type) {
                let that = this;
                let params = {
                    userId: this.userId,
                    standard: curItem,
                    productId: Number(this.$route.query.id)
                }
                if (type) {
                    params.type = type
                }
                ;
                console.log(params);
                axios.post(this.blockURL + '/qypfs-product/admin/mobile/sku/updateSkuStandard', params).then(res => {
                    console.log('updateSkuStandard', res);
                    if (res.data.code == 200) {
                        this.checkSave(curItem);
                        showToast('更新成功');
                        setTimeout(() => {
                            that.isAddSpec = false;
                        }, 800)
                    } else {
                        showToast('更新失败，请稍后子再试!')
                    }
                })
            },
            checkSave(curItem) {
                let num = 0;
                this.standard.forEach(item => {
                    if (curItem && item.id == curItem.id) {
                        item.isSetting = 1;
                    }
                    if (item.isSetting) num++;
                });
                if (this.standard.length == num) this.ableSave = true;
            },
            optNumber(opt, key) {
                if (opt === '+') {
                    let propertyOBJ = JSON.parse(JSON.stringify(this.propertyOBJ));
                    propertyOBJ[key] = floatAdd(propertyOBJ[key], 1);
                    this.propertyOBJ = propertyOBJ;
                } else {
                    let propertyOBJ = JSON.parse(JSON.stringify(this.propertyOBJ));
                    if (propertyOBJ[key] > 1) {
                        propertyOBJ[key] = floatSub(propertyOBJ[key], 1);
                        this.propertyOBJ = propertyOBJ;
                    }
                }
            }
        }
    }
</script>
<style scoped>
    @import '../../assets/css/addNewGoods.css';

    .mint-popup {
        width: 100%;
    }
</style>
<style scoped>
    .addNewGoods{
        padding-top: 42px;
    }
    .goodsImgItem {
        position: relative;
    }

    .goodsImgItem .playIcon {
        position: absolute;
        width: 1.19rem !important;
        height: 1.19rem !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .main .submitBox .submitBtn {
        background: #FF6023;
    }

    .main .submitBox .submitBtn.submit-active {
        background: #ccc;
    }

    .main ul li .status {
        font-size: .6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
    }

    .main ul li .noSet {
        color: #FC0000;
    }

    .main ul li .status:after {
        content: "";
        display: inline-block;
        width: .32rem;
        height: .32rem;
        transform: translateY(-1px) rotate(45deg);
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        margin-left: .18rem;
    }

    .main .goodsName input {
        width: auto;
    }

    .main ul .liMain input {
        font-size: .6rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
    }

    .main ul .goodsImg .liTitle {
        align-self: flex-start;
    }

    .main .factory input {
        border: 0 none;
    }

    .main .imgManagement .title span {
        font-size: .5rem;
        padding-left: 3px;

        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 33px;
    }

    .main ul li {
        justify-content: flex-start;
    }

    .main ul li .text {
        color: #FF6023;
        font-size: .65rem;
        flex: 2;
    }

    .addSpec {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .addSpec .addSpecMain {
        height: 58%;
        position: absolute;
        bottom: 2rem;
        padding-top: .625rem;
    }

    .addSpec .addSpecMain .addSpec-title {
        color: #666666;
        font-size: .667rem;
        text-align: center;
    }

    .addSpec .addSpecMain .addSpec-close {
        color: #989898;
        font-size: .7rem;
        position: absolute;
        top: .625rem;
        right: .625rem;
        padding: 0 .35rem;
    }

    .addSpec .addSpecMain .specList .specItem .title {
        font-size: .98rem;
        color: #666666;
        margin-bottom: 1.17rem;
    }

    .addSpec .saveSpec {
        height: 2rem;
    }

    .addSpec .saveSpec .saveSpecBtn {
        height: 2rem;
        background: #FF6023;
        font-size: .667rem;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle {
        position: relative;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle input {
        border: 1px solid rgba(255, 96, 35, 1);
        border-radius: 3px;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle p {
        color: #666666;
        font-size: .625rem;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle span {
        position: absolute;
        right: .21rem;
        bottom: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: .88rem;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle span .em-1 {
        width: 0;
        height: 0;
        border-left: .15rem solid transparent;
        border-right: .15rem solid transparent;
        border-bottom: .3rem solid #B6B6B6;
    }

    .addSpec .addSpecMain .specList .specItem .inputStyle span .em-2 {
        width: 0;
        height: 0;
        border-left: .15rem solid transparent;
        border-right: .15rem solid transparent;
        border-top: .3rem solid #B6B6B6;
    }
</style>
