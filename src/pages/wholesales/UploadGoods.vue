<template>
    <div class="UploadGoods">
        <div class="main" v-if="isShow">
            <topnav :top="topnav" ></topnav>
            <ul class="goodsDesc">
                <li class="title">商品信息</li>
                <li class="goodsFilter">
                    <span class="liTitle">商品分类：</span>
                    <div class="liMain rightIcon">
                        <span class="filterOption"><input type="text"  placeholder="没有..."></span>
                    </div>
                </li>
                <li class="goodsName">
                    <span class="liTitle">商品名称：</span>
                    <div class="liMain">
                        <input type="text" v-model="proName" placeholder="请输入商品名称(5-20个字符，特殊字符除外)">
                    </div>
                </li>
                <li class="goodsInfo">
                    <span class="liTitle">商品简介：</span>
                    <div class="liMain"><input type="text" v-model="proInfo" placeholder="请输入商品名称(5-20个字符，特殊字符除外)"></div>
                </li>
                <li class="keyWords">
                    <span class="liTitle">关键字：</span> 
                    <div class="liMain"><input type="text" v-model="proKeyWords" placeholder="请输入商品名称(3-5个字符，特殊字符除外)"></div>
                </li>
                <li class="keyWords">
                    <span class="liTitle">成品包装：</span> 
                    <div class="liMain"><input type="text" v-model="proPack" placeholder="请输入商品名称(3-5个字符，特殊字符除外)"></div>
                </li>
                <li class="keyWords">
                    <span class="liTitle">商品单位：</span> 
                    <div class="liMain"><input type="text" v-model="proUnit" placeholder="请输入商品名称(3-5个字符，特殊字符除外)"></div>
                </li>
            </ul>
            <ul class="specSetting">
                <li class="title">规格设置</li>
                <li class="specItem">
                    <span class="liTitle">规格：</span>
                    <div class="liMain">
                        <p class="text">
                            <span>
                                
                            </span>
                        </p>
                        <i class="hidePage el-icon-arrow-right"></i>
                    </div>
                    <li class="specAddBtn" @click="addSpecShow">
                        <img src="@/assets/images/wholesale/add.png"><span>添加新规格</span>
                    </li>
                </li>
                <!-- <li class="specAddBtn">
                    <img src="@/assets/images/wholesale/add.png"><span>添加新参数</span>
                </li> -->
            </ul>
            <ul class="paramSetting">
                <li class="title">参数设置</li>
                <li class="produceDate">
                    <span class="liTitle">生产日期：</span>
                    <div class="liMain produceDatePick"><input style="background:#fff;" readonly @click="openPicker" type="button" :value="produceDate==''?'选择日期':produceDate"><i class="el-icon-date"></i></div>
                </li>
                <li class="releaseDate">
                    <span class="liTitle">保质期：</span>
                    <div class="releaseDateBox"><span class="reduce" @click="reduceMonth">-</span><span class="count">{{releseMonth}}月</span><span class="add" @click="addMonth">+</span></div>
                </li>
                <li class="factory">
                    <span class="liTitle">生产厂家：</span>
                    <div class="liMain"><input type="text" placeholder="请输入生产厂家名"></div>
                </li>
                <li class="specAddBtn" @click="addParam">
                    <img src="@/assets/images/wholesale/add.png"><span>添加新参数</span>
                </li>
            </ul>
            <ul class="imgManagement">
                <li class="title">图片管理</li>
                <li class="goodsImg">
                    <span class="liTitle">商品图：</span>
                    <div class="liMain">
                        <ul class="goodsImgList">
                            <li class="goodsImgItem"><img src="@/assets/images/wholesale/user-icon.png"></li>
                            <li class="addImg"><span class="addImgBtn">+</span><input type="file" class="upLoadImg"></li>
                        </ul>
                    </div>
                </li>
            </ul>
            <div class="submitBox"><button>提交</button></div>
        </div>
        <!---->
        <div class="addSpec" v-else>
            <mt-header title="商品规格设置" ref="header" :fixed='true' style="font-size:0.7556rem;">
                <mt-button icon="back" slot="left" @click="addSpecHide"></mt-button>
            </mt-header>
            <div class="addSpecMain">
                <ul class="specList">
                    <li class="specItem size">
                        <p class="title"></p>
                        <ul class="sizeList list">
                            <!--<li class="sizeItem item" v-for="(post,i) in Standard" :key="i" v-if="post.ParamterId == item.Id || post.ParameterId == item.Id"  :class="{'sizehover':propertyOBJ['StandardName'+(index+1)]==post.Name}" @click="itemsize(index,post.Name)">-->
                            <li class="sizeItem item">
                                <p></p>
                            </li>
                        </ul>
                    </li>
                    <li class="specItem priceAndStock">
                        <p class="title">价格/库存</p>
                        <ul class="list" style="width:calc(100% + 0.4rem);">
                            <li class="storePrice inputStyle">
                                <p>成本价:</p>
                                <input type="number" placeholder="无成本价">
                            </li>
                            <li class="wholesalePrice inputStyle">
                                <p>销售价:</p>
                                <input type="number" placeholder="输入销售价">
                            </li>
                            <li class="storePrice inputStyle">
                                <p>零售价:</p>
                                <input type="number" placeholder="输入零售价">
                            </li>
                            <li class="stock inputStyle">
                                <p>库存量:</p>
                                <input type="number" placeholder="输入库存量">
                            </li>
                            <li class="stock inputStyle">
                                <p>起订量:</p>
                                <input type="number" placeholder="输入起订量">
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="saveSpec">
                <span class="saveSpecBtn">确定</span>
            </div>
        </div>

        <mt-datetime-picker ref="picker" type="date" v-model="startTime" :startDate="startDate" year-format="{value} 年"  month-format="{value} 月" date-format="{value} 日"
            @confirm="handleConfirm" :endDate="endDate">
        </mt-datetime-picker>
    </div>
</template>

<script>
import {showToast} from '@/assets/js/common.js'
import moment from 'moment'
export default {
    data(){
        return {
            topnav:{
               title:'商品上传',
            },
            isShow:true,
            showDatePick:false,
            produceDate:'',
            releseMonth:0,
            startDate:new Date('2018'),
            startTime:'',
            endDate:new Date()
        }
    },
    mounted(){

    },
    methods:{
        addSpecShow(){
            this.isShow = false;
        },
        addSpecHide(){
            this.isShow = true;
        },
        selectDate(){
            this.showDatePick = true;
        },
        addMonth(){
            this.releseMonth ++;
        },
        reduceMonth(){
            if(this.releseMonth == 0){
                this.releseMonth = 0;
            }else{
                this.releseMonth --;
            }
        },
        addParam(){

        },
        handleConfirm(data){
            let date = moment(data).format('YYYY/MM/DD');
            this.produceDate = date;
        },
        openPicker () {
            this.$refs.picker.open()
        },
    }
}
</script>

<style scoped>
.UploadGoods{
    position:relative;
    background: #f1f2f5;
}
/* main */
.main{
    position: relative;
    padding-bottom: 2.6667rem;
}
.main ul{
    margin-top:0.4444rem;
    background:#fff;
}
.main ul li{
    padding:0.3rem 0;
    margin: 0 0.5333rem;
    border-bottom:1px solid #f9f9f9;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
}
.main ul li:last-child{
    border-bottom:none;
}
.main ul .title{
    margin: 0;
    padding: 0.4444rem 0.5333rem;
    font-size: 0.7111rem;
    font-weight: 700;
}
.main ul .liTitle{
    font-size: 0.65rem;
    color:#333;
    width: 5em;
}
.main ul .liMain{
    flex: 1;
    font-size:0.65rem;
}
.main ul .liMain p{
    font-size:0.65rem;
}
.main ul .liMain span{
    font-size:0.65rem;
}
.main ul li input::placeholder{
    font-size: 0.5778rem;
    color:#999;
}
/* 商品信息 */
/* 商品分类 */
.main .rightIcon{
    display: flex;
    justify-content: space-between;
    align-items:center;
}
.main .goodsDesc .filterOption{
    display: flex;
    align-items:center;
    height: 1.1111rem;
    width:5.7778rem;
    font-size:0.6rem;
    border-radius:4px;
    align-items: center;
    position: relative;
}
.main .goodsDesc .filterOption input{
    font-size:0.65rem;
}
.main .goodsDesc .colorText{
    color:#999;
}
.el-icon-arrow-right{
    font-size:0.6rem;
}
        /* 商品名称 */
.main .goodsName input{
    width: 100%;
    font-size:0.65rem;
    outline: none;
    border: none;
    display: block;
}
        /* 商品简介 */
.main .goodsInfo input{
    width: 100%;
    font-size:0.65rem;
    outline: none;
    border: none;
    display: block;
}
        /* 关键字 */
.main .keyWords input{
    width: 100%;
    font-size:0.65rem;
    outline: none;
    border: none;
    display: block;
}
    /* 规格设置 */
.main .specSetting .liMain{
    /* width: calc(100% - 5em); */
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.main .specSetting .liMain i{
    display: block;
    position: relative;
    width: 1.1111rem;
    height:1.1111rem;
}
.main .specSetting .liMain >>> .el-icon-arrow-right:before{
    font-size: 0.5778rem;
    position: absolute;
    top: 30%;
    right: 0;
}
.main .specSetting .liMain .text{
    font-size: 0.5778rem;
    color:#666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    -webkit-line-clamp:1;
    -webkit-box-orient: vertical;
}
.main .specSetting .specAddBtn{
    height: 1.9778rem;
    justify-content: center;
    align-items: center;
}
.main .specSetting .specAddBtn span{
    font-size: 0.5778rem;
    color:#2EB0FB;
}
.main .specSetting .specAddBtn img{
    margin-right: 0.2222rem;
    height:0.5778rem;
    width:0.5778rem;
}
    /* 参数设置 */
        /* 商品类型 */
.main .goodsType .liMain{
    display: flex;
    align-items: center;
} 
.main .goodsType >>> .el-radio__label{
    font-size: 0.5778rem;
    color:#333;
}
.main .goodsType >>> .el-radio__inner::after{
    width: 100%;
    height: 100%;
    font-family: element-icons!important;
    content: '\E611';
    background: #ff0025;
    color:#fff;
}
.main .goodsType >>> .el-radio__input.is-checked+.el-radio__label{
    color: initial;
}
.main .goodsType >>> .el-radio__input.is-checked .el-radio__inner{
    border: none;
    background: initial;
}
        /* 生产日期 */
.main .produceDate .produceDatePick{
    display: flex;
    justify-content: space-between;
    align-items:center;
    height:1.1111rem;
    border:1px solid #f2f2f2;
    border-radius:4px;
    position: relative;
}
.main .produceDate .produceDatePick input{
    flex: 1;
    padding-left: 0.4444rem;
    text-align: left
}
.main .produceDate .produceDatePick >>>.el-icon-date:before{
    font-size: 0.8rem;
    position: absolute;
    top: 0.1rem;
    right:  0.4444rem;
}
        /* 保质期 */
.main .releaseDate .releaseDateBox{
    font-size: 0.65rem;
    position: relative;
    display: flex;
    justify-content: flex-start;
    height:1.1111rem;
    /* width:4.8889rem; */
    line-height: 1.1111rem;
    border:1px solid #f2f2f2;
    border-radius:4px;
}
.main .releaseDate .add,.main .releaseDate .reduce{
    font-size: 0.6667rem;
    width:1.1111rem;
    text-align: center;
}
.main .releaseDate .count{
    text-align: center;
    font-size: 0.5778rem;
    width:2.5111rem;
    border-left:1px solid #f2f2f2;
    border-right:1px solid #f2f2f2;
}
.main .liMain{position: relative;}
.main .month{
    font-size: 0.5778rem;
    position: absolute;
    left: 5.2rem;
    top: .2rem;
}
        /* 生产厂家 */
.main .factory input{
    font-size:0.65rem;
    height: 1.1111rem;
    border:1px solid #f2f2f2;
    border-radius:4px;
    display: block;
    width: 100%;
    padding-left: 0.4444rem;
}

.main .paramSetting .specAddBtn{
    height: 1.9778rem;
    justify-content: center;
    align-items: center;
}
.main .paramSetting .specAddBtn span{
    font-size: 0.5778rem;
    color:#2EB0FB;
}
.main .paramSetting .specAddBtn img{
    margin-right: 0.2222rem;
    height:0.5778rem;
    width:0.5778rem;
}
/* 商品长度 */
.main .goodsLength{
    overflow:hidden;
    width:100%;
}
.main .goodsLength .Lengthlist{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:100%;
    font-size: 0.5778rem;
    margin-bottom:0.4rem;
}
.main .goodsLength .Lengthlist:last-child{
    margin-bottom:0;
}
.main .goodsLength input{
    margin-right: 0.4444rem;
    height: 1.1111rem;
    border:1px solid #f2f2f2;
    border-radius:4px;
    display: inline-block;
    width: 100%;
    padding-left: 0.4444rem;
}
        /* 商品高度 */
.main .goodsHeight{
    font-size: 0.5778rem;
}
.main .goodsHeight input{
    margin-right: 0.4444rem;
    height: 1.1111rem;
    border:1px solid #f2f2f2;
    border-radius:4px;
    display: inline-block;
    width: 4.8889rem;
    padding-left: 0.4444rem;
}
        /* 新增参数 */
.main .addNewParam .newParamList{
    margin: 0;
    display:  flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    font-size: 0.5778rem;
}
.main .addNewParam .newParamList li{
   padding: 0;
   margin: 0;
}
.main .addNewParam .newParamItem span{
    color:#999;
    display: inline-block;
    height: 1.1111rem;
    line-height: 1.1111rem;
    border-radius: 4px;
    padding: 0 0.4444rem;
    border:1px solid #bdbdbd;
    background: #f3f3f3;
 }
    /* 图片管理 */
.main .imgManagement .goodsImgList{
    margin: 0;
    display:  flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    font-size: 0.5778rem;
}
.main .imgManagement .goodsImgList li{
    padding: 0;
    margin: 0;
    height: 3.3333rem;
    width:3.3333rem;
    margin-right: 0.4444rem;
    margin-bottom: 0.4444rem;
}
.main .imgManagement .goodsImgList li:nth-child(3n+3){
  margin-right: 0;
}
.main .imgManagement .goodsImgList img{
    height:100%;
    width:100%;
}
.main .imgManagement .goodsImgList .addImg{
    position: relative;
}
.main .imgManagement .goodsImgList .addImg .upLoadImg{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
}
.main .imgManagement .goodsImgList .addImgBtn{
    height:100%;
    width:100%;
    display: block;
    background: #f3f3f3;
    font-size: 2.2222rem;
    text-align: center;
}

/* 提交 */
.submitBox{
    position:fixed;
    bottom:0;
    left:0;
    height:2.1778rem;
    width:100%;
}
.submitBox button{
    display: block;
    height: 100%;
    width:100%;
    border: none;
    outline: none;
    color:#fff;
    background:#F23030;
    font-size: 0.7111rem;
}

/* 商品规格设置 */
.addSpec{
    position: relative;
    height: 100%;
    box-sizing: border-box;
}
.addSpec .addSpecHeader{
  height:44px;
  width: 100%;
  background:#fff;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom:1px solid #f3f3f3;
  z-index: 111;
}
.addSpec .addSpecHeader p{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
}
.addSpec .addSpecHeader i{
    position: absolute;
    left: 0.5333rem;
    top:20%;
}
.addSpec .addSpecHeader >>> .el-icon-arrow-left:before{
    font-size:0.7111rem;
}
.addSpec .addSpecHeader span {
  font-size: 0.7556rem;
}
.addSpec .addSpecMain{
    height: 100%;
    position: relative;
    background: #f1f2f5;
    padding: 2rem 0 2.6667rem;
    overflow: auto;
}
.addSpec .addSpecMain .specList .specItem{
    background: #fff;
    margin-top: 0.4444rem;
    padding: 0.6667rem 0.5333rem;
}
.addSpec .addSpecMain .specList .addSpecBtn{
    font-size: 0.4444rem;
}
.addSpec .addSpecMain .specList .addSpecBtn img{
    width: 0.4444rem;
    height: 0.4444rem;
}
.addSpec .addSpecMain .specList .specItem .title{
    font-size: 0.6667rem;
    color:#333;
    margin-bottom: 0.5333rem;
}
.addSpec .addSpecMain .specList .specItem .inputStyle{
    width: calc(25% - 0.4rem);
    font-size: 0.4889rem;
    float:left;
    margin:0 0.4rem 0.4rem 0;
}
.addSpec .addSpecMain .specList .specItem .inputStyle input{
    border:none;
    outline: none;
    background: #EEEEEE;
    width: 100%;
    line-height:1.8em;
    height: 100%;
    color: #666666;
    border-radius: 4px ;
    border:1px solid #DBDBDB;
    margin-top:0.3rem;
    padding:0.1rem 0.2rem;
    font-size:0.65rem;
}
.addSpec .addSpecMain .specList .specItem .list{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    /*max-height: 2.77rem;*/
    overflow: hidden;
}
.addSpec .addSpecMain .specList .specItem .list .item{
    height: 1.1111rem;
    min-width: 3.2222rem;
    border-radius: 4px;
    border:1px solid #DBDBDB;
    font-size:0.4889rem;
    margin-right: 0.4444rem;
    margin-bottom: 0.4444rem;
}
.addSpec .addSpecMain .specList .specItem .list .item:nth-child(4n+4){
    margin-right: 0;
}
.addSpec .addSpecMain .specList .specItem .colorList,
.addSpec .addSpecMain .specList .specItem .sizeList{
    margin-top: 0.4444rem;
}
.addSpec .addSpecMain .specList .specItem .colorList p,
.addSpec .addSpecMain .specList .specItem .sizeList p{
    font-size:0.65rem;
    color:#666;
    text-align: center;
    line-height: 1.1111rem;
}
.addSpec .addSpecMain .specList .specItem .sizehover{
    background:red;
    border:1px solid red;
}
.addSpec .addSpecMain .specList .specItem .sizehover p{
    color:white;
}
.addSpec .addSpecMain .specList .specItem .list .selected{
    background: #F23030;
    color: #fff;
}
.addSpec .addSpecMain .specList .specItem .list .selected p{
  color: #fff;
}
.addSpec .addSpecMain .specList .isShowMore{
    text-align: center;
    margin-top: 0.2222rem;
    margin-bottom: -0.5555rem;
}
/* 完成 */
.addSpec .saveSpec{
  height: 2.1778rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
.addSpec .saveSpec span {
  display: block;
  height: 100%;
  width: 100%;
  background: #F23030;
  color: #fff;
  font-size: 0.7556rem;
  text-align: center;
  line-height: 2.1778rem;
}
</style>
