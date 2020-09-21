<template>
    <div class="addGood">
        <mt-header title="添加新商品" fixed>
            <router-link slot='left' to="/wholesale/goodsManagement">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="wrap">


        <div class="info-wrap">
            <h1>商品信息</h1>
            <div class="search-con">
                <div class="search-wrap">
                    <span>商品分类：</span>
                    <el-input v-model="goodType.name" placeholder="一级分类" suffix-icon="el-icon-caret-bottom" @focus="showSelect(1)" readonly class="goodType"></el-input>
                    <el-input v-model="goodScendType.name" placeholder="二级分类" suffix-icon="el-icon-caret-bottom" @focus="showSelect(2)" readonly class="goodType"></el-input>
                    <el-input v-model="goodThirdType.name" placeholder="三级分类" suffix-icon="el-icon-caret-bottom" @focus="showSelect(3)" readonly class="goodType"></el-input>
                </div>
                <div class="search-wrap">
                    <span>商品名称：</span>
                    <el-input v-model="name" placeholder="请输入商品名称(5-20个字符，特殊字符除外)" minlength="5" maxlength="20"></el-input>
                </div>
                <div class="search-wrap">
                    <span>商品简介：</span>
                     <el-input v-model="desc" placeholder="请输入商品简介(5-20个字符，特殊字符除外)" minlength="5" maxlength="20"></el-input>
                </div>
                <div class="search-wrap">
                    <span>关键字：</span>
                     <el-input v-model="keyword" placeholder="请输入关键字(3-5个字符，特殊字符除外)" minlength="3" maxlength="5"></el-input>
                </div>
                <div class="search-wrap">
                    <span>成品包装：</span>
                    <el-input v-model="packaged" placeholder="请输入成品包装" minlength="3" maxlength="5"></el-input>
                </div>
                <div class="search-wrap">
                    <span>商品单位：</span>
                    <el-input v-model="unit" placeholder="请输入商品单位" minlength="3" maxlength="5"></el-input>
                </div>
            </div>
        </div>
        <div class="info-wrap spec-wrap">
            <h1>规格设置</h1>
            <div class="search-con">
                <div class="search-wrap" @click="linkToSpec">
                    <span class="name">规格：</span>
                    <div v-if="JSON.stringify(spec) != '{}'">
                        <p class="spec">
                            <span v-for="(item, index) in spec.specList" :key="index">{{item.name}}：{{item.val}}+</span>销售价：{{spec.salesPrice}}元+成本价：{{spec.costPrice}}元+建议零售价：{{spec.retailPrice}}元+库存：{{spec.stock}}
                        </p>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <el-input placeholder="去设置" suffix-icon="el-icon-arrow-right" readonly v-else></el-input>
                </div>
            </div>
        </div>
        <div class="info-wrap">
            <h1>参数设置</h1>
            <div class="search-con">
                <!-- <div class="search-wrap">
                    <span>生产日期：</span>
                    <el-input v-model="productionDate" placeholder="请选择日期" suffix-icon="el-icon-date" @focus="openPicker(1)" readonly class="productionDate"></el-input>
                </div>
                <div class="search-wrap">
                    <span>保质期：</span>
                    <div class="cartcontrol">
                        <div class="cart-decrease icons" @click="decreaseCart">
                            <span class="inner">-</span>
                        </div>
                        <input class="cart-count" type="number" v-model="num" @input="handleInput">
                        <div class="cart-add icons" @click="addCart"><span>+</span></div>
                    </div>
                    <span>月</span>
                </div>
                <div class="search-wrap">
                    <span>生产厂家：</span>
                    <el-input v-model="manufactor" placeholder="请输入生产厂家名称" class="paramInput"></el-input>
                </div> -->
                <div class="search-wrap">
                    <span>厂家编码：</span>
                    <el-input v-model="factoryCode" placeholder="请输入厂家编码" class="paramInput" maxlength="200"></el-input>
                </div>
                <div class="search-wrap">
                    <span>商品编码：</span>
                    <el-input v-model="barcode" placeholder="请输入商品编码" class="paramInput" maxlength="200"></el-input>
                </div>
                <div class="search-wrap">
                    <span>商品排序：</span>
                    <el-input v-model="sort" placeholder="请输入数字" class="paramInput" maxlength="9"></el-input>
                </div>
                <div class="search-wrap" v-for="(item, index) in parameter" :key="index">
                    <span>{{item.PName}}：</span>
                    <el-input v-model="item.PDName" placeholder="请选择日期" suffix-icon="el-icon-date" @focus="openPicker(1)" readonly class="productionDate" v-if="item.PName == '生产日期'"></el-input>
                    <!-- <el-input v-model="item.PDName" :placeholder="'请输入'+item.PName" class="paramInput" ></el-input> -->
                    <el-input v-model="item.PDName" :placeholder="'请输入'+item.PName" class="paramInput" v-else></el-input>
                </div>
                 <div class="search-wrap" @click="addParameter">
                    <p><i class="el-icon-circle-plus-outline"></i>添加新参数</p>
                </div>
            </div>
        </div>
        <div class="info-wrap spec-wrap">
            <h1>图文说明</h1>
            <richTextTest @getContent="getContent" type="1" :con="details"></richTextTest>
        </div>
        <div class="info-wrap spec-wrap">
            <h1>购买须知</h1>
            <richTextTest @getContent="getContent" type="2" :con="buyersGuide"></richTextTest>
        </div>
        <div class="info-wrap good_pic">
            <h1>图片管理<span> ( 第一张为商品主图 ) </span></h1>
            <div class="search-con">
                <div class="search-wrap">
                    <span class="picTitle">商品图：</span>

                    <div class="img-wrap">

                        <div v-for="(item,index) in shopImg" :key="index" class="img">
                            <img :src="item.url" alt="">
                            <i class="el-icon-error imgClear" @click="closeUpload(index)"></i>
                        </div>

                        <!-- <template v-if="shopImg.length > 0">
                            <imgUpload :delete="false" v-for="(item,index) in shopImg" :key="index" :img.sync="item.url" @img-upload="shopImgChange" @click.native="shopImgfn($event,index)"></imgUpload>
                        </template> -->
                        <imgUpload :add="true" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange"></imgUpload>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-btn" @click="sure">
            <span>确认</span>
        </div>
        <template>
            <mt-datetime-picker
            v-model="pickerVisible"
            type="date"
            ref="picker"
            year-format="{value}"
            month-format="{value}"
            date-format="{value}"
            @confirm="handleConfirm"
            >
            </mt-datetime-picker>
        </template>
        <template>
            <mt-popup
            v-model="isShow"
            class="popup"
            position="bottom">
                <mt-picker :slots="slots" :showToolbar="showToolbar" ref="genderPicker" valueKey="Name">
                    <div class="select-btn">
                        <span class="cancle-btn" @click.stop="closeSelect">取消</span>
                        <p>{{selectTitle}}</p>
                        <span class="sure-btn" @click="genderConfirm">确定</span>
                    </div>
                </mt-picker>
            </mt-popup>
        </template>
        </div>
    </div>
</template>

<script>
import imgUpload from './imgUpload'
import RichTextTest from '../../components/richTextTest'
export default {
    data () {
        return {
            seq: '',
            shopImg: [],                                //产品图
            shopImgIndex: 0,
            imgUploadStopAdd: false,
            goodType: {name: '', id: ''},                               //商品分类
            name: '',                                   //商品名称
            desc: '',                                   //商品简介
            keyword: '',                                //关键字
            packaged: '',                                //成品包装
            unit: '',                                   //商品单位
            spec: {},                                   //规格
            productionDate: '',                         //生产日期
            num: 1,                                     //保质期
            manufactor: '',                             //生产厂家
            parameter: [],//[{PName:"生产日期",PDName:""},{PName:"保质期",PDName:this.num},{PName:"生产厂家",PDName:this.manufactor}],                              //新参数
            pickerVisible: new Date(),                  //初始化日期
            isShow:false,                               //下拉框控制器
            showToolbar:true,                           //显示选择框
            slots: [],                                  //选择框数据
            selectIndex: 0,                             //选择框类别
            selectTitle: '',                            //选择框标题
            selectTimeIndex: 0,
            factoryCode: '', // 厂家编码
            barcode: '', //商品条形码
            goodScendType: {name: '', id: ''},
            goodThirdType: {name: '', id: ''},
            sort: '',
            details: '',
            buyersGuide: ''
        }
    },
    components:{
        imgUpload,
        RichTextTest
    },
    mounted() {
        let seq = JSON.parse(sessionStorage.getItem('seq'));
        let spec = JSON.parse(sessionStorage.getItem('specData'));
        let data = JSON.parse(sessionStorage.getItem('goodDetail'));
        if(seq) {
            this.seq = seq;
        }
        if(spec) {
            this.spec = spec;
        }
        if(data) {
            this.goodType = data.goodType;
            this.name = data.name;
            this.desc = data.desc;
            this.keyword = data.keyword;
            this.packaged = data.packaged;
            this.unit = data.unit;
            this.productionDate = data.productionDate;
            this.num = data.num;
            this.manufactor = data.manufactor;
            this.parameter = data.parameter;
            this.shopImg = data.shopImg;
            this.factoryCode = data.factoryCode;
            this.barcode = data.barcode;
            this.goodScendType = data.goodScendType;
            this.goodThirdType = data.goodThirdType;
            this.sort = data.sort;
            this.details = data.details;
            this.buyersGuide = data.buyersGuide;
        }
    },
    methods:{
        getGoodType(type, parentid) {
            axios.get(this.PRODUCT + '/Product/GetListProductClass?iSeq=' + this.seq + '&iType=' + type + '&iParentid=' + parentid)
            .then((res)=>{
                if(res.data.Code == 200) {
                    let data =  res.data.Resultdata;
                    this.slots = [{values: data}];
                    this.selectTitle = '请选择';
                }
            })
        },
        closeUpload(index) {
            MessageBox({
                title:"",
                message: '是否确定删除此图片？',
                showCancelButton: true
            }).then(action => {
                if(action ==='confirm'){
                    this.shopImg.splice(index, 1);
                    Toast('图片删除成功')
                }
            });
        },
        // shopImgfn(ev, i) {
        //     // 点击当前图片
        //     this.shopImgIndex = i;
        // },
        // shopImgAdd() {
        //     this.shopImgIndex = this.shopImg.length;
        // },
        shopImgChange(val){
            console.log(val)
            // if(this.shopImgIndex == this.shopImg.length) {
                let data = {
                    id: val.id,
                    ImgName: val.ImgName,
                    ImgUrl: val.ImgUrl,
                    url: val.strLitimg
                }
                const index = this.shopImg.findIndex((item) => {
                    return item.id === val.id
                })
                if(index >= 0 ) {
                    Toast('请勿重复添加相同的商品图。')
                    // this.shopImg[index].url = val.strLitimg;
                } else {
                    this.shopImg.push(data);
                }
            // } else {
            //     // 点击当前图片再次上传
            //     if(val.strLitimg) {
            //         this.shopImg[this.shopImgIndex].url = val.strLitimg;
            //     } else {
            //         this.shopImg.splice(this.shopImgIndex, 1);
            //     }
            //     this.shopImgIndex = null;
            // }
        },
        //开启时间选择
        openPicker(index) {
            this.$refs.picker.open();
            this.selectTimeIndex = index;
            let box = document.getElementsByClassName("picker-title")[0];
            if(!box) {
                let node = document.createElement("span");
                node.innerHTML='<span class="picker-title">请选择日期</span>';
                let box = document.getElementsByClassName("picker-toolbar")[0]
                let cancle = document.getElementsByClassName("mint-datetime-cancel")[0];
                box.insertBefore(node,cancle); //新建的元素节点插入到 id为p1的元素前面
            }
        },
        // 时间格式化
        formatDate(date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            return y+ '-' + m + '-' + d;
        },
        // 获取选中时间
        handleConfirm (data) {
            let date = this.formatDate(this.$refs.picker.value);
            switch(this.selectTimeIndex){
                case 1:
                    this.parameter[0]["PDName"] = date;
                    break;
            }
        },
        // 下拉选择框显示 禁止页面拖动
        closeTouch () {
            document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive:false});//阻止默认事件
        },
        openTouch () {
            document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive:false});//打开默认事件
        },
        //显示选择框并且屏幕不能滚动
        showSelect(index){
            switch(index){
                case 1:
                    this.getGoodType(1, 0);
                    this.isShow = true;
                    break;
                case 2:
                    if(this.goodType.id != '') {
                        this.getGoodType(2, this.goodType.id);
                        this.isShow = true;
                    } else {
                        Toast({
                            message: '请选择一级分类',
                            duration: 2000
                        });
                    }
                    break;
                case 3:
                    if(this.goodScendType.id != '') {
                        this.getGoodType(3, this.goodScendType.id);
                        this.isShow = true;
                    } else {
                        Toast({
                            message: '请选择二级分类',
                            duration: 2000
                        });
                    }
                    break;
            }
            this.selectIndex = index;
        },
        //隐藏显示框且屏滚动
        closeSelect(){
            this.isShow = false;
        },
        // 类别选择确定
        genderConfirm (picker) {
            let values = this.$refs.genderPicker.getValues()[0];
            switch(this.selectIndex){
                case 1:
                    this.goodType.name = values.Name;
                    this.goodType.id = values.Id;
                    this.goodScendType.name = '';
                    this.goodScendType.id = '';
                    this.goodThirdType.name = '';
                    this.goodThirdType.id = '';
                    break;
                case 2:
                    this.goodScendType.name = values.Name;
                    this.goodScendType.id = values.Id;
                    this.goodThirdType.name = '';
                    this.goodThirdType.id = '';
                    break;
                 case 3:
                    this.goodThirdType.name = values.Name;
                    this.goodThirdType.id = values.Id;
                    break;
            }
            this.isShow = false;
        },
        // 跳转到规格详情
        linkToSpec() {
            console.log(this.shopImg)
            let data = {
                goodType: this.goodType,
                name: this.name,
                desc: this.desc,
                keyword: this.keyword,
                packaged: this.packaged,
                unit: this.unit,
                productionDate: this.productionDate,
                num: this.num,
                manufactor: this.manufactor,
                parameter: this.parameter,
                shopImg: this.shopImg,
                factoryCode: this.factoryCode,
                barcode: this.barcode,
                goodScendType: this.goodScendType,
                goodThirdType: this.goodThirdType,
                sort: this.sort,
                details: this.details,
                buyersGuide: this.buyersGuide
            }
            sessionStorage.setItem('goodDetail', JSON.stringify(data));
            this.$router.push({
                path: '/wholesale/goodSpec'
            })
        },
        // 购物车数量+
        addCart() {
            this.num ++;
        },
        // 购物车数量-
        decreaseCart() {
            if(this.num == 1) return false;
            this.num --;
        },
        // 填写购物车数量
        handleInput(e) {
            let val = e.target.value.replace(/[^0-9-]+/,'');
            this.num = parseInt(val) ? parseInt(val) : 1;
        },
        // 添加新参数
        addParameter() {
            MessageBox.prompt('', {
                title: '',
                message: '添加新参数',
                closeOnClickModal: false,
            }).then(({ value }) => {
                if(value) {
                    const index = this.parameter.findIndex((list) => {
                        return list.PName === value;
                    })
                    if(index < 0) {
                        let data = {
                            Id: 0,
                            PName: value,
                            PDName: ""
                        }
                        this.parameter.push(data)
                    }
                }
            }).catch(() => {});
        },
        getContent(con, type) {
            if(type == 1) {
                this.details = con;
            } else {
                this.buyersGuide = con;
            }
        },
        // 确认
        sure() {
            if(!this.goodType.name) {
                Toast({
                    message: '请选择商品一级分类',
                    duration: 2000
                });
                return false;
            }
            if(!this.goodScendType.name) {
                Toast({
                    message: '请选择商品二级分类',
                    duration: 2000
                });
                return false;
            }
            if(!this.goodThirdType.name) {
                Toast({
                    message: '请选择商品三级分类',
                    duration: 2000
                });
                return false;
            }
            if(!this.name || this.name.length < 5 || this.name.length > 20) {
                Toast({
                    message: '请输入商品名称5-20个字符',
                    duration: 2000
                });
                return false;
            }
            if(!this.desc || this.desc.length < 5 || this.desc.length > 20) {
                Toast({
                    message: '请输入商品简介5-20个字符',
                    duration: 2000
                });
                return false;
            }
            if(!this.keyword || this.keyword.length < 3 || this.keyword.length > 5) {
                Toast({
                    message: '请输入关键字3-5个字符',
                    duration: 2000
                });
                return false;
            }

            if(JSON.stringify(this.spec) == "{}") {
                Toast({
                    message: '请设置规格',
                    duration: 2000
                });
                return false;
            }
            if(!this.factoryCode) {
                Toast({
                    message: '请输入厂家编码',
                    duration: 2000
                });
                return false;
            }
            if(!this.barcode) {
                Toast({
                    message: '请输入商品编码',
                    duration: 2000
                });
                return false;
            }
            if(JSON.stringify(this.shopImg) == "[]") {
                Toast({
                    message: '请上传商品图',
                    duration: 2000
                });
                return false;
            }
            let data = {
                arrListProStandAttached: [
                    {
                        StockCount: this.spec.stock,       //库存量
                        Moq: this.spec.moq, 		//起订量
                        ShopPrice: this.spec.salesPrice,	//销售价
                        WholesalePrice: this.spec.retailPrice,	//建议零售价
                        proId: 0,		//不同规格不同价格的ID,如果 是新增就给 0,
                        FactoryPrice: this.spec.costPrice	//成本价
                    }
                ],
                arrListCustomizeStandards: [],
                arrListProStandardJoint: [],
                arrListCustomizeProperty: [],
                arrListProParameter: this.parameter,
                product: {
                    SEQ: this.seq,  //添加用户的SEQ
                    CategoryId: this.goodType.id, //一级分类ID
                    GenreId: this.goodScendType.id,  //二级分类ID
                    ThreeId: this.goodThirdType.id,  //三级分类ID
                    Name: this.name,   //商品名称
                    Crime: this.desc,    //商品的描述
                    Sort: this.sort ? this.sort : 0 , //商品排序
                    Package: this.packaged, //商品的包装
                    Unit: this.unit,  //商品的单位
                    Keywords: this.keyword, //商品关键词
                    FactoryCode: this.factoryCode, //工厂编码
                    Barcode: this.barcode,  //商品编码
                    Description: this.details,  //商品的详情
                    BuyersGuide: this.buyersGuide //商品的购买须知
                },
                arrListProductImg: [],
                arrListAuthorizationImg: []
            }
            this.spec.specList.forEach(function(value,index,array){
                let StandardData = {
                    rowIndex: index,
                    parentId: 0,
                    name: value.name
                }
                let PropertyData = {
                    rowIndex: index,
                    parentId: 0,
                    name: value.val
                }
                data.arrListProStandAttached[0]['parentId'+(index+1)] = 0;
                data.arrListProStandAttached[0]['prop'+(index+1)] = value.val;
                data.arrListCustomizeStandards.push(PropertyData);
                data.arrListCustomizeProperty.push(StandardData);
            });
            this.shopImg.forEach(function(value,index,array){
                let ImgData = {
                    ImgName: value.ImgName,
                    ImgUrl: value.ImgUrl
                }
                data.arrListProductImg.push(ImgData);
            });

            axios.post(this.PRODUCT + '/Product/AndOrEditProductInfo', data)
            .then((res)=>{
                if(res.data.Code == 200) {
                    Toast('添加商品成功');
                    this.$router.push({
                        path: '/wholesale/goodsManagement'
                    })
                }
            })
        }
    },
    watch:{
        isShow (val){
            if(val) {
                this.closeTouch()
                document.body.style.overflow="hidden";
            } else {
                this.openTouch()
                document.body.style.overflow="auto";
            }
        }
    }
}
</script>

<style scoped>
    .wrap{
        padding-top:1.7778rem;
    }
    .addGood {
        padding-bottom: 2.8889rem /* 130/45 */;
    }
    .info-wrap {
        overflow: hidden;
        margin-top: .4444rem /* 20/45 */;
        background: #fff;
    }
    .info-wrap h1 {
        font-size: .7111rem /* 32/45 */;
        color: #333;
        line-height: 1.9556rem /* 88/45 */;
        padding: 0 .5556rem /* 25/45 */;
        border-bottom: 1px solid #ededed;
    }
    .info-wrap h1 span {
        font-size: .5333rem /* 24/45 */;
        color: #999;
    }
    .search-con {
        margin: 0 .5556rem /* 25/45 */;
    }
    .search-wrap{
        overflow: hidden;
        padding: .4444rem /* 20/45 */ 0;
        border-bottom: 1px solid #ededed;
        display: flex;
        align-items: center;
    }
    .spec-wrap .search-con {
        padding: .4444rem /* 20/45 */ 0;
    }
    .spec-wrap .search-wrap{
        padding: 0;
        height: 1.4222rem /* 64/45 */;
    }
    .spec-wrap .search-wrap div {
        width: 80%;
        display: flex;
    }
    .spec-wrap .search-wrap div i {
        height: 1.4222rem /* 64/45 */;
        line-height: 1.4222rem /* 64/45 */;
        font-size: .6222rem /* 28/45 */;
    }
    .spec-wrap .search-wrap .spec {
        color: #333;
        height: 1.4222rem /* 64/45 */;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 1.4222rem /* 64/45 */;
        font-size: .5333rem /* 24/45 */;
    }
    .spec-wrap .search-wrap .spec span {
        font-size: .5333rem /* 24/45 */;
    }
    .search-wrap p {
        text-align: center;
        display: block;
        width: 100%;
        font-size: .6222rem /* 28/45 */;
        color: #2eb0fb;
    }
    .search-wrap:nth-last-of-type(1) {
        border-bottom: 0;
    }
    .search-wrap .el-input {
        flex: 1;
    }
    .search-wrap .el-input.goodType {
        width: 25%;
        flex: initial;
        margin-right: 2%;
    }
    .search-wrap .el-input.goodType:nth-last-of-type(1) {
        margin-right: 0;
    }
    .search-wrap span{
        font-size: .6222rem /* 28/45 */;
        width: 3.3333rem /* 150/45 */;
    }
    .cartcontrol {
        overflow: hidden;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        border-radius: .2222rem /* 10/45 */;
        margin-right: .4444rem /* 20/45 */;
    }
    .cartcontrol >* {
        float: left;
    }
    .cartcontrol .icons {
        width: 1.3333rem /* 60/45 */;
        text-align: center;
        height: 1.2889rem /* 58/45 */;
        line-height: 1.2889rem /* 58/45 */;
    }
    .cartcontrol .icons span {
         font-size: .7111rem /* 32/45 */;
         display: block;
         width: initial;
    }
    .cartcontrol input {
        width: 2.6667rem /* 120/45 */;
        border-right: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        text-align: center;
        height: 1.2889rem /* 58/45 */;
        line-height: 1.2889rem /* 58/45 */;
    }
    .good_pic .search-wrap {
       align-items: flex-start;
       padding-bottom: 0;
       padding-top: .5556rem /* 25/45 */;
    }
    .good_pic .search-wrap span {
        line-height: 3.3333rem /* 150/45 */;
    }
    .good_pic .search-wrap .img-wrap {
        width: 80%;
    }
    .img-wrap .img {
        width: 3.3333rem /* 150/45 */;
        height: 3.3333rem /* 150/45 */;
        margin-right: .4444rem /* 20/45 */;
        margin-bottom: .5556rem /* 25/45 */;
        position: relative;
    }
    .imgClear {
        position: absolute;
        top: -8%;
        right: -5%;
        color: red;
        background: #fff;
        font-size: .7778rem /* 35/45 */;
        border-radius: 10px;
    }
    .img-wrap img {
        width: 100%;
        height: 100%;
    }
    .img-wrap .img:nth-of-type(3n) {
        margin-right: 0;
    }
    .img-wrap >*{
        float: left;
    }
    .select-btn {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        font-size: .6667rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }
    .sure-btn {
        color: #00dd5e;
    }
    .cancle-btn {
        color: red;
    }
    .submit-btn {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: .7111rem /* 32/45 */;
        color: #fff;
        height: 2.1778rem /* 98/45 */;
        line-height: 2.1778rem /* 98/45 */;
        background: #ef4628;
        z-index: 1002;
    }
    .addGood >>> .popup {
        width: 100%;

    }
</style>

<style>

    .spec-wrap .search-wrap .el-input__inner {
        text-align: right;
        padding-right: 1.3333rem /* 60/45 */;
    }
    .search-wrap .el-input__icon {
        width: 20px;
        line-height: 1.3333rem /* 60/45 */;
    }
    .search-wrap .el-input__inner {
        border: none;
        border-radius: .2222rem /* 10/45 */;
        font-size: .5333rem /* 24/45 */;
        padding: 0 .4rem /* 30/75 */ 0 .2rem /* 15/75 */;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .search-wrap .el-input__suffix {
        right: 0;
    }
    .search-wrap .spec .el-input__inner {
        padding-right: 1.1111rem /* 50/45 */;
        text-align: right;
    }
    .search-wrap .goodType .el-input__inner,
    .search-wrap .productionDate .el-input__inner,
    .search-wrap .paramInput .el-input__inner
    {
        border: 1px solid #dcdfe6;
    }
    .addGood .picker-slot {
        font-size: .6222rem /* 28/45 */;
        font-weight: normal;
    }
    .addGood .picker-toolbar .picker-title{
        text-align: center;
        font-size: .6222rem /* 28/45 */;
        width: 40%;
        display: inline-block;
    }
    .addGood .mint-datetime-action {
        color: #00dd5e;
        width: 30%;
    }
    .addGood .mint-datetime-cancel{
        color: red;
    }
</style>
