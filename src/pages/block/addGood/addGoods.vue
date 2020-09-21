<template>
    <div class="ChangeCode">
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span style="flex: 1;">{{topnav.title}}</span>
        </div>
        <div class="telwraps">
            <!-- 第一页基本信息设置 -->
            <div v-if="step ==1">
                <div class="formwrap2">
                    <div class="cart-list">
                        <label>
                            商品名称
                            <span class="f1">*</span>:
                        </label>
                        <p class="lmain">
                            <input type="text" placeholder="请输入" v-model="goodsName"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>
                            商品分类
                            <span class="f1">*</span>:
                        </label>
                        <p class="lmain" @click="goclass">
                            <input type="text" placeholder="请选择商品分类" readonly v-model="ftsname"/>
                            <i class="el-icon-arrow-right"></i>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>商品简介:</label>
                        <p class="lmain">
                            <input type="text" placeholder="用于介绍商品的描述信息" v-model="Descrip"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>商品关键字</label>
                        <p class="lmain">
                            <input type="text" placeholder="多个关键字请用分割符分割" v-model="introduct"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>
                            产品包装
                            <span class="f1">*</span>:
                        </label>
                        <p class="lmain">
                            <input type="text" placeholder="如箱、包、件等" v-model="Packing"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>
                            商品单位
                            <span class="f1">*</span>:
                        </label>
                        <p class="lmain">
                            <input type="text" placeholder="如个、只、袋等" v-model="goodsUnit"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>原厂编号</label>
                        <p class="lmain">
                            <input type="text" placeholder="请输入" v-model="Serial"
                                   onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"/>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>商品条形码:</label>
                        <p class="lmain">
                            <input type="text" placeholder="只能包含数字和字母和特殊符号" v-model="Barcode"
                                   onkeyup="value=value.replace(/[^\w\/]/ig,'')"/>
                        </p>
                    </div>
                </div>
                <p class="spec-title">商品规格设置</p>
                <div class="formwrap2 Spec">
                    <div v-if="roluslist.length>0" style="padding: 0.5rem; background-color: #fff;">
                        <div class="rolus" v-for="(item,idx) in roluslist">
                            <div class="cart-list">
                                <label>规格名称:</label>
                                <p class="lmain">
                                    <input type="text" placeholder="如颜色码数等规格名称" v-model="item.attrName"/>
                                    <img src="../../../assets/images/block/by_page1.png" @click="clearspec(idx)"/>
                                </p>
                            </div>
                            <div class="cart-list" v-if="item.attrValueList.length>0"
                                 v-for="(b,i) in item.attrValueList"
                                 style="background-color: #f5f5f5;">
                                <label>规格{{i+1}}:</label>
                                <p class="lmain">
                                    <input type="text" placeholder="如大码小码红色蓝色等规格" v-model="item.attrValueList[i]"
                                           @blur="addrlurs" style="background-color: #f5f5f5;"/>
                                    <img src="../../../assets/images/block/by_page2_ix.png" @click="clearrolus(idx,i)"/>
                                </p>
                            </div>
                            <div class="add addAttr">
                                <span @click="addrolus(idx)">添加规格值</span>
                                <input type="text" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="cart" style="justify-content: center;" @click="Addspec()">
                        <img src="../../../assets/images/block/by_page2_ic.png" style="margin-right: 0.5rem;"/>
                        <p style="color:#FF4400;">添加新规格</p>
                    </div>
                    <p class="toast">提示：单规格产品默认可不添加，可进行下一步。</p>
                </div>
            </div>
            <!-- 第2页规格信息设置-->
            <div v-if="step==2">
                <div class="formwrap2">
                    <div class="More" v-show="zuilist.length>0">
                        <div class="ruless" v-for="(m,idx) in zuilist">
                            <div class="rname">
                            <span>
                                规格{{idx+1}}：
                                <span v-for="(n,itemIndex) in m.propertyInfoList">
                                    {{n.propertyValueName}}&nbsp;{{itemIndex==m.propertyInfoList.length-1?'':'|'}}
                                </span>
                            </span>
                                <!--                                <span style="color: #FF6023;" @click="deleteR(idx)">删除</span>-->
                            </div>
                            <div class="rval">
                                <div class="priceBox">
                                    <span>批发价<i class="iconYes">*</i>:</span>
                                    <input type="text" v-model="m.salePrice" class="abs"
                                           @keyup="rex2($event)" @afterpaste="rsx2($event)"/>
                                </div>
                                <div class="priceBox">
                                    <span>建议零售价<i class="iconYes">*</i>:</span>
                                    <input type="text" v-model="m.retailPrice" class="abs"
                                           @keyup="rex2($event)" @afterpaste="rsx2($event)"/>
                                </div>
                                <div class="numBox">
                                    <span>整件数量<i class="iconYes">*</i>:</span>
                                    <input type="text" v-model="m.count" class="abs" @keyup="rex($event)"
                                           @afterpaste="rsx2($event)"/>
                                </div>
                                <div class="numBox">
                                    <span>内包装<i class="iconYes">*</i>:</span>
                                    <input type="text" v-model="m.unit" class="abs"/>
                                </div>
                                <div class="numBox">
                                    <span>起订量:</span>
                                    <input type="text" v-model="m.minimumQuantity" class="abs"
                                           @keyup="rex($event)" @afterpaste="rsx($event)"/>
                                </div>
                                <div class="numBox">
                                    <span>成本价:</span>
                                    <input type="text" v-model="m.costPrice" class="abs" @keyup="rex2($event)"
                                           @afterpaste="rsx2($event)"/>
                                </div>
                                <div class="numBox">
                                    <span>库存量:</span>
                                    <input type="text" v-model="m.stock" class="abs" @keyup="rex($event)"
                                           @afterpaste="rsx($event)"/>
                                </div>
                                <div class="numBox">
                                    <span>安全库存量:</span>
                                    <input type="text" v-model="m.safeStock" class="abs" @keyup="rex($event)"
                                           @afterpaste="rsx2($event)"/>
                                </div>
                            </div>
                            <div class="name">
                                <div class="fs">
                                    <p>规格主图 <span class="noActive">请上传一张本规格商品主图 （非必传）</span></p>
                                </div>
                            </div>
                            <div class="cart-list1">
                                <div class="shop">
                                    <template v-if="m.skuImg">
                                        <imgUpload @click.native="selectSpec(idx)" text="720x400" :img.sync="m.skuImg"
                                                   @img-upload="shopImgSkuImg"></imgUpload>
                                    </template>
                                    <template v-else>
                                        <imgUpload @click.native="selectSpec(idx)" :add="true" text="上传图片"
                                                   :stop.sync="m.skuImg" @img-upload="shopImgSkuImg"></imgUpload>
                                    </template>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--商品主图视频设置-->
                <div class="formwrap2">
                    <div class="name">
                        <div class="fs">
                            <p>商品图片</p>
                            <p style="color: #999 ;font-size:0.58rem;margin-left: 0.5rem;">至少需上传一张图片</p>
                        </div>
                    </div>
                    <div class="cart-list1">
                        <div class="shop">
                            <template v-if="shopImg.length > 0">
                                <imgUpload text="720x400" v-for="(item,index) in shopImg" :key="index"
                                           :img.sync="item.strLitimg" @img-upload="shopImgChange"
                                           @click.native="shopImgfn(index)">
                                </imgUpload>
                            </template>
                            <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange"
                                       @click.native="shopImgAdd"></imgUpload>
                        </div>
                    </div>

                    <div class="name">
                        <div class="fs">
                            <p>商品主图视频 <span class="noActive">非必传</span></p>
                        </div>
                    </div>
                    <div class="cart-list1">
                        <div class="shop videoBox1">
                            <div>
                                <template v-if="shopImg4.length > 0">
                                    <imgUpload text="720x400" v-for="(item,index) in shopImg4" :key="index"
                                               :img.sync="item.strLitimg" :video="item.video"
                                               @img-upload="shopImgChange4"
                                               @click.native="shopImgfn4(index)"></imgUpload>
                                </template>
                                <template v-if="!shopImg4.length">
                                    <imgUpload :add="true" text="上传视频" :stop.sync="imgUploadStopAdd1"
                                               @img-upload="shopImgChange4"
                                               @click.native="shopImgAdd4" isVideo="true"></imgUpload>
                                </template>
                            </div>
                            <div class="showToast">
                                <p>1.时长：仅支持60秒以内</p>
                                <p>2.尺寸：推荐1:1或3:4尺寸更利于观看体验</p>
                                <p>3.内容：突出商品1-2个核心卖点</p>
                            </div>
                        </div>
                    </div>
                    <div class="name">
                        <div class="fs">
                            <p>商品详情图 <span class="noActive">非必传</span></p>
                        </div>
                    </div>
                    <div class="cart-list1">
                        <div class="shop">
                            <template v-if="shopImg3.length > 0">
                                <imgUpload text="720x400" v-for="(item,index) in shopImg3" :key="index"
                                           :img.sync="item.strLitimg" @img-upload="shopImgChange3"
                                           @click.native="shopImgfn3(index)"></imgUpload>
                            </template>
                            <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd3"
                                       @img-upload="shopImgChange3"
                                       @click.native="shopImgAdd3"></imgUpload>
                        </div>
                    </div>
                    <div class="name">
                        <div class="fs">
                            <p>商品检测报告图片 <span class="noActive">非必传</span></p>
                        </div>
                    </div>
                    <div class="cart-list1">
                        <div class="shop">
                            <template v-if="shopImg1.length > 0">
                                <imgUpload text="720x400" v-for="(item,index) in shopImg1" :key="index"
                                           :img.sync="item.strLitimg" @img-upload="shopImgChange1"
                                           @click.native="shopImgfn1(index)"></imgUpload>
                            </template>
                            <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd1"
                                       @img-upload="shopImgChange1"
                                       @click.native="shopImgAdd1"></imgUpload>
                        </div>
                    </div>
                    <div class="name">
                        <div class="fs">
                            <p>商品授权书图片 <span class="noActive">非必传</span></p>
                        </div>
                    </div>
                    <div class="cart-list1">
                        <div class="shop">
                            <template v-if="shopImg2.length > 0">
                                <imgUpload text="720x400" v-for="(item,index) in shopImg2" :key="index"
                                           :img.sync="item.strLitimg" @img-upload="shopImgChange2"
                                           @click.native="shopImgfn2(index)"></imgUpload>
                            </template>
                            <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd2"
                                       @img-upload="shopImgChange2"
                                       @click.native="shopImgAdd2"></imgUpload>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 底部操作按钮 -->
            <div class="bottomBox">
                <div class="btnwrap">
                    <div class="btn prev" type="default" @click="goshang()" v-if="step != 1">上一步</div>
                    <div class="btn save" type="default" @click="Preservation" v-if="step==2">保存</div>
                    <div class="btn" type="default" @click="sureChange" v-else>下一步</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import imgUpload from "./imgUpload";
    import RichTextTest from "../../../components/richTextTest";

    export default {
        name: "addGoods",
        data() {
            return {
                topnav: {
                    title: "基本信息"
                },
                goodsName: "",
                shopImg: [],
                shopImgIndex: null,
                imgUploadStopAdd: false,
                shopImgShow: false,
                shopImg1: [],
                shopImgIndex1: null,
                imgUploadStopAdd1: false,
                shopImgShow1: false,
                shopImg2: [],
                imgUploadStopAdd2: false,
                shopImg3: [],
                shopImgIndex3: null,
                imgUploadStopAdd3: false,
                shopImgShow3: false,
                shopImg4: [],
                shopImgIndex4: 0,
                imgUploadStopAdd4: false,
                shopImgShow4: false,
                roluslist: [],
                skuList: [],
                skuArray: [],
                skuName: [],
                zuilist: [],
                step: 1,
                Descrip: "", //商品简介
                introduct: "", //商品关键字
                Packing: "", //商品包装
                goodsUnit: "", //商品单位
                Serial: "", //原厂编号
                Barcode: "", //条形码
                fflId: "",
                tflId: "",
                sflId: "",
                ftsname: "",
                imageUrl: '', //商品详情
                userInfo: this.$store.state.userInfo, // 用户信息
                // 当前选中上传规格主图的下标 用于上传时候set图片地址和删除某个规格图片
                specIndex: 0
            };
        },
        components: {
            imgUpload,
            RichTextTest
        },
        watch: {
            step(newVal) {
                this.topnav = {
                    title: ['基本信息', '价格、图片'][newVal - 1]
                }
            },
        },
        activated() {
            if (sessionStorage.getItem("fflId")) {
                this.fflId = sessionStorage.getItem("fflId");
            }
            if (sessionStorage.getItem("tflId")) {
                this.tflId = sessionStorage.getItem("tflId");
            }
            if (sessionStorage.getItem("sflId")) {
                this.sflId = sessionStorage.getItem("sflId");
            }
            if (sessionStorage.getItem("ftsname")) {
                this.ftsname = sessionStorage.getItem("ftsname");
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name != "selectGoodsType") {
                this.$route.meta.keepAlive = false;
            } else {
                this.$route.meta.keepAlive = true;
            }
            next();
        },
        mounted() {
        },
        methods: {
            shopImgAdd2() {
                if (this.shopImg2.length >= 8) {
                    Toast("图片限制在8张以内！");
                } else {
                    this.shopImgIndex2 = this.shopImg2.length;
                }
            },
            facadeChange(val) {
                this.imageUrl = val;
            },
            shopImgChange2(val) {
                if (this.shopImgIndex2 == this.shopImg2.length) {
                    this.shopImg2.push({
                        UrlType: 2,
                        ImgUrl: val.ImgUrl + val.ImgName,
                        strLitimg: val.strLitimg
                    });
                    if (this.shopImg2.length >= 8) {
                        this.imgUploadStopAdd2 = true;
                    }
                } else {
                    if (val.strLitimg) {
                        this.shopImg2[this.shopImgIndex2] = val.strLitimg;
                    } else {
                        this.shopImg2.splice(this.shopImgIndex2, 1);
                        if (this.shopImg2.length < 8) {
                            this.imgUploadStopAdd2 = false;
                        }
                    }
                    this.shopImgIndex2 = null;
                }
            },
            shopImgAdd1() {
                if (this.shopImg1.length >= 8) {
                    Toast("图片限制在8张以内！");
                } else {
                    this.shopImgIndex1 = this.shopImg1.length;
                }
            },
            shopImgfn1(i) {
                this.shopImgIndex1 = i;
            },
            shopImgChange1(val) {
                if (this.shopImgIndex1 == this.shopImg1.length) {
                    this.shopImg1.push({
                        UrlType: 1,
                        ImgUrl: val.ImgUrl + val.ImgName,
                        strLitimg: val.strLitimg
                    });
                    if (this.shopImg1.length >= 8) {
                        this.imgUploadStopAdd1 = true;
                    }
                } else {
                    if (val.strLitimg) {
                        this.shopImg1[this.shopImgIndex1] = val.strLitimg;
                    } else {
                        this.shopImg1.splice(this.shopImgIndex1, 1);
                        if (this.shopImg1.length < 8) {
                            this.imgUploadStopAdd1 = false;
                        }
                    }
                    this.shopImgIndex1 = null;
                }
            },
            // 点击规格主图的上传图片按钮保存当前点击的规格下标
            selectSpec(index) {
                this.specIndex = index;
            },
            //   去选择分类
            goclass() {
                this.$router.push({
                    path: "/block/selectgoodstype"
                });
            },

            //返回上一步
            goshang() {
                this.step = this.step - 1;
            },
            // 正则限制输入
            rex(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, "");
                } else {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }
            },
            rsx(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, "0");
                } else {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }
            },
            rex2(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^\d.]/g, "");
                } else {
                    e.target.value = e.target.value.replace(/[^\d.]/g, "");
                }
            },
            rsx2(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^\d.]/g, "");
                } else {
                    e.target.value = e.target.value.replace(/[^\d.]/g, "");
                }
            },
            //多规格数据处理
            addrlurs() {
                // 先清空数据，保证连续点击按钮，数据不会重复
                this.skuArray = [];
                this.skuName = [];
                this.skuList = [];

                // 将选中的规格组合成一个大数组 [[1, 2], [a, b]...]
                this.roluslist.forEach(element => {
                    element.attrValueList.length > 0 ?
                        this.skuArray.push(element.attrValueList) :
                        "";
                    this.skuName.push(element.attrName);
                });
                // 勾选了规格，才调用方法

                if (this.skuArray.length > 0) {
                    this.getSkuData([], 0, this.skuArray);
                }
            },
            // 递归获取每条SKU数据
            getSkuData(skuArr = [], i, list) {
                for (let j = 0; j < list[i].length; j++) {
                    if (i < list.length - 1) {
                        skuArr[i] = list[i][j];
                        this.getSkuData(skuArr, i + 1, list); // 递归循环
                    } else {
                        this.skuList.push({
                            name: [...skuArr, list[i][j]]
                        }); // 扩展运算符，连接两个数组
                    }
                }
                let arr = this.zuilist;
                this.zuilist = [];
                for (let d = 0; d < this.skuList.length; d++) {
                    arr[d] ? delete arr[d].propertyInfoList : "";
                    this.zuilist.push({
                        propertyInfoList: [],
                        ...arr[d]
                    });
                    for (let e = 0; e < this.skuList[d].name.length; e++) {
                        this.zuilist[d].propertyInfoList.push({
                            propertyName: this.skuName[e],
                            propertyValueName: this.skuList[d].name[e],
                        });
                    }
                }
            },
            //删除规格组合的输入组合
            deleteR(idx) {
                if (this.zuilist.length > 1) {
                    this.zuilist.splice(idx, 1);
                } else {
                    Toast("请至少填写一个规格的商品数据");
                }
            },
            //添加规格值
            addrolus(idx) {
                this.roluslist[idx].attrValueList.push("");
            },
            //删除规格值
            clearrolus(idx, i) {
                this.roluslist[idx].attrValueList.splice(i, 1);
                this.addrlurs();
            },

            //添加规格
            Addspec() {
                for (let k = 0; k < this.roluslist.length; k++) {
                    if (this.roluslist[k].attrName == "") {
                        Toast("请先填写完整添加的规格");
                        return;
                    }
                }
                this.roluslist.push({
                    attrName: "",
                    attrValueList: []
                });
            },
            //删除规格
            clearspec(idx) {
                this.roluslist.splice(idx, 1);
                this.addrlurs();
            },
            //返回
            goback() {
                if (this.step == 1) {
                    this.$router.go(-1);
                } else {
                    this.step = this.step - 1;
                }
            },
            //下一步
            sureChange() {
                var that = this;
                if (this.step == 1) {
                    if (that.goodsName == null || that.goodsName == "") {
                        Toast("请填写商品名称");
                        return false;
                    }
                    if (this.ftsname == null || this.ftsname == "") {
                        Toast("请选择商品分类");
                        return false;
                    }
                    if (that.Packing == null || that.Packing == "") {
                        Toast("请选填写商品包装");
                        return false;
                    }
                    if (that.goodsUnit == null || that.goodsUnit == "") {
                        Toast("请选填写商品单位");
                        return false;
                    }
                    // 当规格数据一条规格都没有的情况下就默认为常规和标准
                    if (!this.roluslist.length) {
                        this.roluslist.push({attrName: "常规", attrValueList: ["标准"]})
                    } else {
                        // 筛选用户添加了新规格未设置新规格名称或值得数据
                        let filterAttr = this.roluslist.filter((item, index) => {
                            return !item.attrName || !item.attrValueList[0];
                        })
                        if (filterAttr.length && !filterAttr[0].attrName) {
                            Toast("请填写规格名称");
                            return;
                        }
                        if (filterAttr.length && !filterAttr[0].attrValueList[0]) {
                            Toast(`请填写${filterAttr[0].attrName}的规格值`);
                            return;
                        }
                    }
                    // 验证是否有重复的规格名称
                    for (let i = 0; i < this.roluslist.length; i++) {
                        let hasattrName = this.roluslist.filter((item, index) => {
                            return item.attrName == this.roluslist[i].attrName && index != i;
                        })
                        if (hasattrName.length) {
                            Toast("规格名称不可重复!");
                            return
                        }
                    }
                    this.addrlurs();
                    this.step = 2;
                }
            },
            //保存
            Preservation() {
                let ProductImg = {};
                var that = this;
                if (this.shopImg.length == 0) {
                    Toast("请至少上传一张商品图片");
                    return false;
                }

                // 验证是否为数字
                function isNone(num) {
                    let isTrue = false;
                    if (num == null || num == "" || isNaN(num) || num == 0) {
                        isTrue = true;
                    }
                    return isTrue;
                }

                // 验证每个规格的规则是否通过
                for (let i = 0; i < this.zuilist.length; i++) {
                    if (isNone(this.zuilist[i].salePrice)) {
                        Toast(this.zuilist[i].salePrice ? `规格${i + 1}批发价不能小于等于0` : `请填写规格${i + 1}的批发价`);
                        return;
                    }
                    if (isNone(this.zuilist[i].retailPrice)) {
                        Toast(this.zuilist[i].retailPrice ? `规格${i + 1}建议零售价不能小于等于0` : "请填写规格" + (i + 1) + "的建议零售价");
                        return;
                    }
                    if (isNone(this.zuilist[i].count)) {
                        Toast(this.zuilist[i].count ? `规格${i + 1}数量不能小于等于0` : "请填写规格" + (i + 1) + "的整件数量");
                        return;
                    }
                    if (this.zuilist[i].unit == null || this.zuilist[i].unit == "") {
                        Toast("请填写规格" + (i + 1) + "的内包装");
                        return;
                    }
                    if (isNone(this.zuilist[i].minimumQuantity)) {
                        this.zuilist[i].minimumQuantity = 1;
                    }
                    if (isNone(this.zuilist[i].costPrice)) {
                        this.zuilist[i].costPrice = this.zuilist[i].salePrice;
                    }
                    if (isNone(this.zuilist[i].stock)) {
                        this.zuilist[i].stock = 100;
                    }
                    if (isNone(this.zuilist[i].safeStock)) {
                        this.zuilist[i].safeStock = 100;
                    }
                }

                for (let i = 0; i < this.shopImg3.length; i++) {
                    this.imageUrl += '<img style="width:100%" src="' + this.shopImg3[i].strLitimg + '"><br/>'

                }

                function filterArr(arr) {
                    let newArr = [];
                    for (let i = 0; i < arr.length; i++) {
                        newArr.push(arr[i].strLitimg)
                    }
                    return newArr
                }

                ProductImg.authorizationImgList = filterArr(this.shopImg2);// 认证图片
                ProductImg.productImgList = filterArr(this.shopImg);// 商品主图
                ProductImg.testImgList = filterArr(this.shopImg1); // 商品测试报告图片

                let strJsonParameter = {
                    product: {
                        firstCategoryId: this.fflId, // 一级类目id
                        secondCategoryId: this.tflId, // 二级类目id
                        thirdCategoryId: this.sflId, // 三级类目id
                        name: this.goodsName, // 商品名称
                        productPackage: this.Packing, // 产品包装
                        unit: this.goodsUnit, // 商品的单位
                        description: this.imageUrl // 商品详情
                    },
                    skuInfoList: this.zuilist,
                    url: ProductImg,
                    userId: this.userInfo.userId
                };

                if (this.Descrip != "") {
                    // 产品简介
                    strJsonParameter.product.crime = this.Descrip;
                }
                if (this.introduct != "") {
                    // 商品关键字
                    strJsonParameter.product.keyword = this.introduct;
                }
                if (this.Serial != "") {
                    // 原厂编码
                    strJsonParameter.product.factoryCode = this.Serial;
                }
                if (this.Barcode != "") {
                    // 条形码
                    strJsonParameter.product.barcode = this.Barcode;
                }
                if (this.shopImg4[0]) {
                    // 主图视频
                    strJsonParameter.url.videoUrl = this.shopImg4[0].video
                }
                axios.post(this.blockURL + '/qypfs-product/admin/mobile/product/generation', strJsonParameter)
                    .then((res) => {
                            if (res.data.code == 200) {
                                Toast("创建商品成功");
                                sessionStorage.removeItem("fflId");
                                sessionStorage.removeItem("tflId");
                                sessionStorage.removeItem("sflId");
                                sessionStorage.removeItem("ftsname");
                                that.$destroy();
                                setTimeout(() => {
                                    history.go(-1);
                                }, 1500);
                            } else {
                                Toast(res.data.message);
                            }
                        }
                    )
            },

            shopImgAdd() {
                if (this.shopImg.length >= 8) {
                    Toast("图片限制在8张以内！");
                } else {
                    this.shopImgIndex = this.shopImg.length;
                }
            },

            shopImgfn(i) {
                this.shopImgIndex = i;
            },

            shopImgChange(val) {
                if (this.shopImgIndex == this.shopImg.length) {
                    this.shopImg.push({
                        ImgName: val.ImgName,
                        ImgUrl: val.ImgUrl,
                        strLitimg: val.strLitimg
                    });
                    if (this.shopImg.length >= 8) {
                        this.imgUploadStopAdd = true;
                    }
                } else {
                    if (val.strLitimg) {
                        this.shopImg[this.shopImgIndex] = val.strLitimg;
                    } else {
                        this.shopImg.splice(this.shopImgIndex, 1);
                        if (this.shopImg.length < 8) {
                            this.imgUploadStopAdd = false;
                        }
                    }
                    this.shopImgIndex = null;
                }
            },
            // 商品规格主图上传
            shopImgSkuImg(val) {
                // 判断是删除图片还是新增图片
                this.$set(this.zuilist[this.specIndex], 'skuImg', val.strLitimg ? val.strLitimg : "");
            },

            shopImgAdd4() {
                if (this.shopImg1.length >= 8) {
                    Toast("图片限制在8张以内！");
                } else {
                    this.shopImgIndex1 = this.shopImg1.length;
                }
            },
            shopImgfn4(i) {
                this.shopImgIndex4 = i || 0;
            },

            shopImgChange4(val) {
                if (this.shopImgIndex4 == this.shopImg4.length) {
                    this.shopImg4.push({
                        UrlType: 1,
                        ImgUrl: val.ImgUrl + val.ImgName,
                        video: val.video,
                        strLitimg: val.strLitimg
                    });
                    if (this.shopImg4.length >= 8) {
                        this.imgUploadStopAdd4 = true;
                    }
                } else {
                    if (val.strLitimg) {
                        this.shopImg4[this.shopImgIndex4] = val.strLitimg;
                    } else {
                        this.shopImg4.splice(this.shopImgIndex4, 1);
                        if (this.shopImg4.length < 8) {
                            this.imgUploadStopAdd4 = false;
                        }
                    }
                    this.shopImgIndex4 = 0;
                }
            },

            shopImgAdd3() {
                if (this.shopImg3.length >= 8) {
                    Toast("图片限制在8张以内！");
                } else {
                    this.shopImgIndex3 = this.shopImg3.length;
                }
            },

            shopImgfn3(i) {
                this.shopImgIndex3 = i;
            },

            shopImgChange3(val) {
                if (this.shopImgIndex3 == this.shopImg3.length) {
                    this.shopImg3.push({
                        UrlType: 2,
                        ImgUrl: val.ImgUrl + val.ImgName,
                        strLitimg: val.strLitimg
                    });
                    if (this.shopImg3.length >= 8) {
                        this.imgUploadStopAdd3 = true;
                    }
                } else {
                    if (val.strLitimg) {
                        this.shopImg3[this.shopImgIndex3] = val.strLitimg;
                    } else {
                        this.shopImg3.splice(this.shopImgIndex3, 1);
                        if (this.shopImg3.length < 8) {
                            this.imgUploadStopAdd3 = false;
                        }
                    }
                    this.shopImgIndex3 = null;
                }
            }
        },
        created() {
        }
    };

</script>

<style scoped>
    .ruless .name {
        padding: 0;
    }

    .ruless .cart-list1 {
        padding: 0;
        margin: 0;
    }

    .ruless .name .fs {
        padding-left: 0;
    }

    .Spec {

    }

    .spec-title {
        font-size: 0.6rem;
        text-align: center;
        line-height: 1.2rem;
    }

    .noActive {
        color: #7d7d7d;
        padding-left: 0.6rem;
        font-size: 0.58rem;
    }

    .iconYes {
        color: #FF0101;
    }

    .priceBox {
        background: #f5f5f5;
        margin-bottom: 0.42rem;
        width: 48.5%;
        border-radius: 0.1rem;
    }

    .priceBox span {
        padding-left: 0.3rem;
    }

    .numBox {
        background: #f5f5f5;
        margin-bottom: 0.42rem;
        width: 31.8%;
        border-radius: 0.1rem;
    }

    .More .ruless .numBox input.abs {
        width: 1.3rem;
    }

    .numBox span {
        padding-left: 0.3rem;
    }

    .bottomBox {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 100;
        width: 100%;
    }

    .bottomBox .btn {

    }

    .toast {
        padding-top: 0.3rem;
        color: #333;
        font-size: 14px;
        text-align: center;
    }

    .bottomBox .prev {
        border-right: 0.1rem solid #fff;
    }

    .addAttr {
        display: flex;
        justify-content: space-between;
    }

    .addAttr input {
        background: transparent;
        width: 60%;
        text-align: right;
    }

    .fourPage {
        border-bottom: 0.4rem solid #fff;
        margin-bottom: 0.4rem;
    }

    .noneImg img {
        opacity: 0;
    }

    .name {
        display: flex;
        justify-content: space-between;
    }

    .name img {
        width: 0.73rem;
        height: 0.73rem;
    }

    .videoBox1 {
        display: flex;
    }

    .videoBox1 .showToast {
        padding-left: 0.6rem;
        font-size: 0.5rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(154, 154, 154, 1);
        line-height: 0.41rem;
    }

    .videoBox1 .showToast p {
        margin-bottom: 0.5rem;
    }

    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        min-height: 100vh;
        padding-bottom: 3.5rem;
        position: relative;
        padding-top: 50px;
    }

    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff7725;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
        padding: 0 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .top_nav i {
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        font-size: 0.62rem;
        text-align: center;
        text-indent: -1em;
    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .btnwrap .btn {
        width: 100%;
        height: 1.7778rem;
        font-size: 0.7111rem;
        background-color: #ff7725;
        color: #fefefe;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btnwrap .btn img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.2rem;
    }

    .btnwrap .save {
        background: rgba(255, 96, 36, 1);
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: 0.416667rem;
    }

    .cart-list .lmain img {
        width: 0.8rem;
        height: 0.8rem;
        margin-left: 0.5rem;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
        overflow: hidden;
    }

    .cart {
        display: flex;
        display: flex;
        height: 2rem;
        background-color: #fff;
        justify-content: space-between;
        align-items: center;
        font-size: 0.62rem;
        padding: 0 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .cart .dijian {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cart .dijian .c1 {
        width: 3rem;
        margin: 0 0.5rem;
    }

    .cart img {
        width: 0.75rem;
        height: 0.75rem;
    }

    .bullet {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }

    .bullet .main {
        width: 76%;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 0.58rem;
    }

    .bullet .main .heads {
        line-height: 1.4rem;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }

    .bullet .main .conts {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 2rem;
    }

    .bullet .main .foots {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.65rem;
        border-top: 1px solid #eee;
    }

    .bullet .main .foots .c1 {
        width: 49%;
        border-right: 1px solid #eee;
        text-align: center;
    }

    .bullet .main .foots .c2 {
        flex: 1;
        text-align: center;
        color: #ff9d19;
    }

    .name {
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }

    .name .fs {
        padding-left: 0.5rem;
        position: relative;
        display: flex;

        align-items: center;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.1rem;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: 0.416667rem;
    }

    .cart-list .lmain .a2 {
        width: 3.5rem;
        text-align: center;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;

        color: #888;
    }

    .mint-popup {
        width: 100%;
    }

    .visiblebtn >>> .mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .visiblebtn >>> .mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .settings >>> .picker-items {
        width: 100%;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

    .cart-list1 {
        background-color: #fff;
        font-size: 0.62rem;
        line-height: 1.4em;
        align-items: center;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .shop {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .shop {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .lmain .uploadbox {
        position: relative;
    }

    .uploadbox >>> .upload {
        height: 100%;
    }

    .shop .uploadbox {
        margin-right: 0.5rem;

        width: 3rem;
        height: 3rem;
        position: relative;
    }

    .shop .upload {
        margin: 0 0 10px 0;
        color: #999999;
        width: 100%;
    }

    .rolus .add {
        height: 2rem;
        line-height: 2rem;
        color: #ff4400;
        background-color: #f5f5f5;
        font-size: 0.62rem;
        padding: 0 0.5rem;
    }

    .More {
        margin: 0 0 0.5rem 0;
        background-color: #fff;
        padding: 0.5rem;
        font-size: 0.55rem;
        color: #333;
        padding-bottom: 0;
    }

    .More .ruless {
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
    }

    .More .ruless:last-child {
        border: none;
    }

    .More .ruless .rname {
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .More .ruless .rval {
        flex-wrap: wrap;
        display: flex;
        align-items: stretch;
        height: 5rem;
        align-items: center;
        margin-top: 0.3rem;
        justify-content: space-between;
    }

    .More .ruless .rval .abs {
        border-radius: 0.3rem;
        height: 1.375rem;
        width: 3rem;
        text-align: center;
        background-color: #f5f5f5;
    }

    .ChangeCode >>> .uploadbox img {
        width: 3rem !important;
        height: 3rem !important;
    }

</style>
