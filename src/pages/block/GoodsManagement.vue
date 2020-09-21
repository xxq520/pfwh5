<template>
    <div class="goods-management">
        <!-- 导航 -->
        <mt-header fixed title="下游特殊价格设置" ref="header" v-show="specialPrice">
            <mt-button icon="back" slot="left" @click="onSpecialPrice"></mt-button>
        </mt-header>
        <!-- search -->
        <header class="mint-header">
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input type="search" v-model="keywords" placeholder='搜索你想要的商品'>
                    <span class="search" @click="searchKeywords">搜索</span>
                </div>
            </h1>
        </header>
        <!-- 滑动菜单栏 -->
        <div class="operationTab" ref="operationTab" v-show="!specialPrice">
            <button class="tab utilBtn" @click="chooseOperation(0)">新增自营商品</button>
            <button class="tab utilBtn" @click="onSpecialPrice">下游特殊价格</button>
            <!-- <button class="tab utilBtn" @click="onClassification">自定义分类管理</button> -->
        </div>
        <div class="topwrap" ref="topwrap">
            <div class="topnav">
                <ul>
                    <li v-for="(item,index) in filter" :title="item.categoryId" :key="index" :class="{'lihover':index === navIndex}" @click="navClick(index,item.categoryId)">{{item.categoryName}}<i></i></li>
                </ul>
            </div>
        </div>
        <div class="UpperTab" ref="UpperTab">
            <button class="tab choosed" @click="chooseTab(true)" :style="{color:(isShow?choosed:unChoose)}">待上架</button>
            <button class="tab" @click="chooseTab(false)" :style="{color:(isShow?unChoose:choosed)}">已上架</button>
        </div>

        <!-- 设置价格时展示的搜索 -->
        <div class="search-box" v-show="specialPrice">
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input type="search" v-model="keywords" @keyup.13="searchKeywords" placeholder='请输入用户名或者手机号'>
                    <img :src="require('../../assets/images/block/icon-btn-search.png')" alt="" class="search-btn" @click="searchKeywords">
                </div>
            </h1>
        </div>

        <p v-if="remindCount" class="await">
            供应链有{{remindCount}}款商品的规格待更新上架
        </p>
        <div class="main" :style="{height:mainHeight1+'px',paddingBottom:'2.4rem'}">
            <ul class="pro-list"
             v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="5">
                <li class="pro-item" v-for="(item,index) in datas" :key="index" :style="isUp?'padding-left:2.0667rem;':'padding-left:0.5333rem;'">
                    <div class="pro-main" @click="editPro(item)">
                        <div class="pro-img">
                            <img :src="item.img">
                            <img v-if="item.remind" :src="require('../../assets/images/block/bg_tag.png')" class="awaitUpdate"/>
                        </div>
                        <div class="pro-desc">
                            <p class="pro-title">{{item.name}}</p>
                            <p class="pro-price">￥{{ item.price | formatPrice }}<span v-if="item.typeValue" class="tagIocn">{{item.typeValue}}</span></p>
                            <p class="pro-stock"><span>库存{{countSale(item.stock)}}{{item.unit || '件'}} /</span><span> 起订量{{item.minimumQuantity>0?countSale(item.minimumQuantity):0}}{{item.Unit}}件</span></p>
                        </div>
                    </div>
                    <i class="checked" @click="listAll($event, index,item)" v-if="isUp"></i>
                    <div v-show="!specialPrice">
                        <div v-if="isShow" class="isUp" @click="editPro(item)">
                            <span class="isUpIcon"><img src="../../assets/images/block/common_icon_shangjia.png"></span>
                            <span class="isUpTitle">上架</span>
                        </div>
                        <div v-else class="isUp" @click="optGoods(item)">
                            <span class="isUpIcon"><img src="../../assets/images/block/common_icon_xiajia.png"></span>
                            <span class="isUpTitle">下架</span>
                        </div>
                    </div>
                    <router-link :to="'/block/specialPrice?id=' + item.id" class="set-price" v-show="specialPrice">
                        设置价格
                    </router-link>
                </li>
                <li class="more_loading" v-show="allLoaded" style="background:#fff;text-align:center;">
                    <!-- <mt-spinner type="fading-circle" color="#26a2ff" :size="20"></mt-spinner> -->
                    <span style="font-size:0.6222rem;color:#999;">暂无更多数据~</span>
                </li>
            </ul>
        </div>
        <div class="goodsManagementBox" v-show="isEdit" :style="{bottom:bootmnavHeight+'px'}">
            <!-- <router-link to="/wholesale/addNewGoods" class="addNewGoods">添加新商品</router-link> -->
            <router-link to="/wholesale/addToStore" class="addGoods">添加商品库商品</router-link>
        </div>
        <div class="addToStoreBox" v-if="isUp">
            <div class="addToStoreCount">
                <div class="setcheck"><i class="checked" @click="allCheck($event)"></i><span>全选</span></div>
                <span class="totalCount">共计：{{checklist}}件</span>
            </div>
            <div class="addToStoreBtnBox">
                <span class="addToStoreBtn" @click="setbut()">{{isShow?'批量上架':'批量下架'}}</span>
            </div>
        </div>
        <block-Tabbar></block-Tabbar>
    </div>
</template>
<script>
import {showToast} from '@/assets/js/common.js'
export default {
    data () {
        return {
            filter:[
                {
                    categoryId:0,
                    categoryName:"全部"
                }
            ],
            index:0,
            isUp:false,
            userType:'',
            isEdit:false,
            operationTitle:'编辑',
            mainHeight1:0,
            bootmnavHeight:0,
            navIndex:0,
            keywords:'',
            Name:'',
            iSeq:sessionStorage.getItem('seq'),
            datas:[],
            allLoaded:false,
            page:1,
            loading:true,
            spinner:true,
            iOneId:0,
            arrCode:[],
            isShow:true,
            choosed:'#333',
            unChoose:'#999',
            checklist:0,
            order:[],
            codeArr:[],
            IsUpper:1,
            isOperation:false,
            i:0,
            userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
            userInfo:this.$store.state.userInfo,
            // 商品待更新数量
            remindCount: 0,
            specialPrice: false, // 是否展示设置下游商家价格
        }
    },
    created(){
        let userType = sessionStorage.getItem('userType');
        if(userType){
            this.userType = userType;
        }
        let seq = this.$route.query.seq
        if(seq == null || seq == undefined){
            this.iSeq = sessionStorage.getItem('seq');
        }else{
            sessionStorage.setItem('seq',seq);
            this.iSeq =seq;
        }
        this.getFilterList();
    },
    mounted(){
        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff";
        this.specialPrice = this.$route.query.specialPrice == '1';

        sessionStorage.removeItem('specData');
        sessionStorage.removeItem('goodDetail');
        this.getHeight1();
        if(this.$route.query.seq==undefined||this.$route.query.seq==null||this.userType !=3){
            this.bootmnavHeight = document.querySelector('.nav-box').clientHeight;
        }
        Indicator.open();
    },
    filters:{
        formatPrice(val){
            let num = Math.abs(val);
            num = num.toFixed(2);
            return num
        }
    },
    methods:{
        // 切换到下游特殊价格设置
        onSpecialPrice() {
            this.specialPrice = !this.specialPrice;
            this.keywords= '';
            console.log(this.$router,this.$route);
            this.$router.push({
                path: this.$route.path,
                query: {
                    specialPrice: this.specialPrice ? 1 : 0
                }
            })
        },
        // 自定义分类管理
        onClassification() {
            console.log('自定义分类管理');
        },
        clearZeroGoods(){
            for(var i =0;i<this.datas.length;i++){
                if((this.datas[i].StockCount<this.datas[i].Moq || this.datas[i].StockCount ==0 || this.datas[i].StockCount ==null) && this.datas[i].IsUpper){
                    let post = {
                        iSeq:this.iSeq,
                        arrCode:[this.datas[i].Code]
                    }
                    axios.post(this.blockURL + '/Product/UpperLowerShelfProducts',post)
                    .then((res)=>{
                    })
                }
            }
        },
        chooseTab(isTrue){
            var that = this;
            that.isShow = isTrue;
            that.datas=[];
            that.page = 1;
            that.Name='',
            that.order=[];
            that.checklist = 0;
            that.codeArr = [];
            if(that.isShow){
                that.IsUpper = 1;
            }else{
                that.IsUpper = 0;
            }
            $('.checked').removeClass('hover el-icon-check');
            this.getGoodsList();
        },
        closefn:function(){
            $('.searhed input').val('').focus();
        },
        // 下架
        optGoods(item) {
            MessageBox.confirm('确认下架此商品?').then(action => {
                if(action === 'confirm'){
                    let params = {
                        id: item.id,
                        status: 2,
                        userId: this.userInfo.userId
                    }
                    axios.post(`${this.blockURL}/qypfs-product/admin/mobile/product/updateStatus`, params).then(res =>{
                    // axios.post(this.blockURL + '/admin/mobile/product/updateStatus', params).then(res =>{
                        console.log('updateStatus', res);
                        if (res.data.code == 200) {
                            showToast('操作成功');
                            setTimeout(() =>{
                                this.$router.go(0);
                            }, 1000)
                        } else {
                            showToast(res.data.message);
                        }

                    })
                }
            });
        },
        getHeight1(){
            let self = this;
            sessionStorage.removeItem("mainHeight1")
            let height1 = sessionStorage.getItem("mainHeight1");
            console.log(height1)
            if(height1){
                this.mainHeight1 = height1;
            }else{
                self.height1();
            }
        },
        height1(){
            console.log(this.$refs.UpperTab)
            this.mainHeight1 = document.documentElement.clientHeight
            -99;
            if(this.userBlock){
               this.mainHeight1+= 44
            }
            this.mainHeight1-=this.$refs.topwrap.offsetHeight;
            this.mainHeight1-=this.$refs.operationTab?this.$refs.operationTab.offsetHeight:0
             this.mainHeight1-=this.$refs.UpperTab?this.$refs.UpperTab.offsetHeight:0
            sessionStorage.setItem("mainHeight1",this.mainHeight1);

        },
        countSale(count){
            let countext = count;
            if(count/10000 >= 1 && count/1000000 < 1){
            countext = Math.round(count/10000)+'万';
            }else if(count/1000000 >= 1 && count/10000000 < 1){
            countext = Math.round(count/1000000)+'百万';
            }else if(count/10000000 >= 1 && count/100000000 < 1){
            countext = Math.round(count/10000000)+'千万';
            }else if(count/100000000 >= 1){
            countext = Math.round(count/100000000)+'亿';
            };
            return countext;
        },
        navClick(index,id){
            var that = this;
            that.datas=[];
            that.page = 1;
            that.navIndex = index;
            that.iOneId = id;
            // that.isShow = true;
            // that.IsUpper = 0;
            that.Name='';
            that.checklist = 0;
            that.order=[];
            that.codeArr=[];
            $('.checked').removeClass('hover el-icon-check');
            that.getGoodsList();
        },
        chooseOperation(index){
            var that = this;
            that.index = index;
            switch (that.index) {
                case 0:
                    this.$router.push('/block/addgoods');
                    break;
                case 1:
                    this.$router.push('/wholesale/uploadGoods');
                    break;
            }
        },
        editHandle:function(){
            if(this.operationTitle == '编辑'){
                this.operationTitle = '取消';
                this.isEdit = true;
            }else{
                this.operationTitle = '编辑';
                this.isEdit = false;
            }
        },
        searchKeywords(){
            var that = this;
            that.page = 1;
            that.datas = [];
            that.navIndex = 0;
            that.Name = 'Name';
            that.iOneId = 0;
            that.getGoodsList();
        },
        getFilterList(){
            var that = this;
            let storeId = [5,6].indexOf(Number(this.userInfo.Blocktype))!=-1?this.$store.state.storeId:0;
            var params={
                level: 1,
                parentId: 0,
                userId: storeId
            }
            axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList',params)
            // axios.post(this.blockURL + '/admin/super/product/getCategoryList',params)
            .then((res)=>{
                if(res.data.code == 200){
                    let data = res.data.data;
                    data.categoryList.forEach(post => {
                        that.filter.push(post);
                    })
                    that.iOneId = that.filter[0].categoryId;
                    that.getGoodsList();
                }
            }).catch(err=>{
                showToast('请求超时','center');
                Indicator.close();
            })

        },
        getGoodsList(){
            this.loading = true;
            var that = this;
            var objData={
                userId: that.$store.state.userInfo.userId,
                pageNum:that.page,
                keyword:that.keywords,
                pageSize: 10,
                categoryId: that.iOneId,
                operation: 1,
                status: this.isShow ? 0 : 1,
                // 商品待更新降序
                sortType: 5
            }

            axios.post(this.blockURL + '/qypfs-product/admin/mobile/product/list',objData)
            // axios.post(this.blockURL + '/admin/mobile/product/list',objData)
            .then((res)=>{
                Indicator.close();
                if(res.data.data != null && res.data.data.list.length > 0){
                    that.remindCount = res.data.data.remindCount;
                    that.datas = that.datas.concat(res.data.data.list);
                    (that.page)++;
                    that.allLoaded = false;
                }else{
                    that.allLoaded = true;
                    this.loading = true;
                    // that.spinner = false;
                    return false;
                }
                this.clearZeroGoods();
                this.loading = false;
            }).catch(function (error) {
                showToast('请求超时','center');
                Indicator.close();
            });
        },
        loadMore() {
            let self = this;
            $('.addToStoreBox .checked').removeClass('hover el-icon-check');
            self.getGoodsList();
        },
        isUpGoods(code){
            var that = this;
            let post = {
                iSeq:that.iSeq,
                arrCode:code
            }
            MessageBox({
                title:"",
                message: '确定商品上架?',
                showCancelButton: true
            }).then(action => {
                if(action == 'confirm'){
                    axios.post(this.blockURL + '/Product/UpperLowerShelfProducts',post)
                    .then((res)=>{
                        if(res.data.Code == 200){
                            showToast('商品已上架');
                            that.datas=[];
                            that.page = 1;
                            that.getGoodsList();
                        }else if(res.data.Code == 300){
                            showToast(res.data.Msg,'center');
                        }else{
                            showToast("请先完善商品信息",'center');
                        }
                    })
                }
            });
        },
        editPro(item){
            if (this.specialPrice) return;
            if(!this.isShow){
                item.noUp = true
            }
            this.$router.push({path: '/block/addNewGoods',query:item});
        },
        isDownGoods(code){
            var that = this;
            let post = {
                iSeq:that.iSeq,
                arrCode:code
            }
            MessageBox({
                title:"",
                message: '确定商品下架?',
                showCancelButton: true
            }).then(action => {
                if(action == 'confirm'){
                axios.post(this.blockURL + '/Product/UpperLowerShelfProducts',post)
                    .then((res)=>{
                        if(res.data.Code == 200){
                            showToast('商品已下架');
                            that.datas=[];
                            that.page = 1;
                            that.getGoodsList();
                        }else{
                            showToast('商品信息有误！','center');
                        }
                    })
                }
            });
        },
        // 添加选中的商品
        addArr(obj){
            // console.log(obj);
            for(var i=0;i<this.codeArr.length;i++){
                if(this.codeArr[i] == obj.Code) return false;
            };
                this.codeArr.push(obj.Code);
        },
        // 删除选中的商品
        removeArr(obj){
            for(var i=0;i<this.codeArr.length;i++){
                if(this.codeArr[i]== obj.Code){
                    this.codeArr.splice(i,1);
                    return false
                }
            }
        },
        // 商品列表全选
        listAll(event,p,data){
            let elem = event.currentTarget;
            let checked = $(elem).closest('.pro-item').find('.checked');
            if(elem.className.indexOf('hover') == -1){
                // data.ordersdtl.forEach(post => {
                this.addArr(data);
                // });
                $(elem).addClass('hover el-icon-check');
                checked.addClass('hover el-icon-check');
            }else{
                // data.ordersdtl.forEach(post => {
                this.removeArr(data);
                // });
                $(elem).removeClass('hover el-icon-check');
                checked.removeClass('hover el-icon-check');
            };
            this.judgeAllCheck();
            this.checklist = this.codeArr.length;
        },
        // 全选
        allCheck(event){
            let elem = event.currentTarget;
            if(elem.className.indexOf('hover') == -1){
                this.datas.forEach(post => {
                    this.addArr(post);
                });
                $('.checked').addClass('hover el-icon-check');
            }else{
                this.datas.forEach(post => {
                    this.codeArr=[],
                    this.checklist = 0;
                    this.removeArr(post);
                });
                $('.checked').removeClass('hover el-icon-check');
            };
            this.checklist = this.codeArr.length;
            console.log(this.codeArr);
        },
        // 判断是否所有商品已经选择
        judgeAllCheck(){
            let checkelem = $('.pro-list .checked');
            for(var i=0;i<checkelem.length;i++){
                if(checkelem.get([i]).className.indexOf('hover') == -1){
                $('.addToStoreBox .checked').removeClass('hover el-icon-check');
                return false;
                }
            };
            $('.addToStoreBox .checked').addClass('hover el-icon-check');
            return true;
        },
        setbut(){
            var that = this;
            let arrCode = that.codeArr.toString();
            let post = {
                iSeq:that.iSeq,
                arrCode:arrCode
            }
            if(that.checklist == 0){
                showToast(that.isShow?'请选择要上架的商品':'请选择要下架的商品')
            }else{
                MessageBox({
                    title:"",
                    message: that.isShow?'确定商品上架?':'确定商品下架?',
                    showCancelButton: true
                }).then(action => {
                    if(action == 'confirm'){
                        Indicator.open();
                        axios.post(this.blockURL + '/Product/UpperLowerShelfProducts',post)
                        .then((res)=>{
                            if(res.data.Code == 200){
                                showToast(that.isShow?'商品已上架':'商品已下架','center');
                                that.codeArr = [];
                                that.datas=[];
                                that.page = 1;
                                $('.checked').removeClass('hover el-icon-check');
                                that.checklist = 0;
                                that.getGoodsList();
                            }else if(res.data.Code == 300){
                                showToast('未上架成功的商品,请先完善商品信息再上架！','center');
                            }else if(res.data.Code == 500){
                                showToast('网络连接错误，请稍后重试~','center');
                            }
                            Indicator.close();
                        })
                    }
                });
            }
        },
    },
    // 判断返回页面不刷新
    beforeRouteLeave(to,from,next){
        // to.name == 'addNewGoods'||
        if(to.name == 'addToStore'){
            from.meta.keepAlive = true;
            this.codeArr=[];this.order=[];this.checklist = 0;$('.checked').removeClass('hover el-icon-check');
        }else{
            from.meta.keepAlive = false;
        };
        next();
    }
}
</script>
<style scoped>
@import '../../assets/css/GoodsManagement.css';
.main{
    padding-top: 0 !important;
}
.tagIocn{
    font-size: 0.5rem;
    color: #fff;
    background:rgb(255,119,37);
    border-radius: 0.5rem;
    padding: 0.05rem 0.3rem;
    margin-left: 0.5rem;
}
    .more_loading >>> .mint-spinner-fading-circle{
        margin: 0 auto;
    }
    .operationTab .tab a{
        color: #939397;
    }
    .mint-header.is-fixed{
        font-size: .7rem;
    }
    .mint-header {
        background:linear-gradient(-90deg,rgba(255,94,36,1),rgba(255,120,38,1));
    }
    .searhed{
        display: flex;
        align-items: center;
        width: 96%;
        position: relative;
    }
    .search{
        width: 2rem;
        text-align: right;
        font-size: 0.57rem;
        position: absolute;
        right: 0.5rem;
        top: 0.4rem;
    }
    .operationTab{
        padding: 0.3rem 0;
        margin-bottom: 0.4rem;
    }
    .operationTab .utilBtn{
        border:1px solid rgba(255,96,36,1);
        font-size:0.6rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,96,36,1);
        padding: 0.2222rem 0.4rem;
    }
    .topnav ul li.lihover {
        color: #FF6024;
        font-weight: bold;
        font-family:PingFang SC;
    }
    .topnav ul li i {
        background: #FF6024;
    }
    .await{
        font-size:0.55rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,96,35,1);
        text-align: center;
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
    }
    .pro-img{
        position: relative;
        overflow: hidden;
    }
    .pro-img .awaitUpdate{
        width: 1.91rem !important;
        height: 1.91rem !important;
        position: absolute;
        top: 0rem;
        left: 0rem;
    }
    .main .pro-item .set-price{
        position: absolute;
        right: 0.5333rem;
        bottom: 0.5889rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.3rem;
        height: .92rem;
        border:1px solid rgba(255,96,36,1);
        border-radius: .125rem;
        font-size: .459rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,96,36,1);
    }

    .search-box {
        background: #f5f5f5;
        height: 2.67rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .searhed{
        display: flex;
        align-items: center;
        width: 93.6%;
        position: relative;
        margin: 0 auto;
        border-radius: 2em;
        box-shadow: 1px 1px 3px #e3e3e3 inset;
        background:rgba(255,255,255,1);
        border:1px solid rgba(228,228,228,1);
        border-radius: .9rem;
        height: 1.38rem;
    }
    .searhed .search-btn{
        width: 2.91rem;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
    }
    .searhed i.el-icon-search{
        float: left;
        color: #9c9c9c;
        padding-right: 0.2rem;
        line-height: 1.2em;
        padding-left: 0.5333rem;
        font-size: .6rem;
    }
    .searhed input{
        background: transparent;
        float: left;
        width: 68%;
        height: 100%;
        font-size: 14px;
        color: #666;
    }
    .searhed input::-webkit-input-placeholder{
        font-size: .5rem;
        font-family: Hiragino Sans GB;
        font-weight: normal;
        color: rgba(153,153,153,1);
    }
    .search{
        width: 2rem;
        text-align: right;
        font-size: 0.57rem;
        position: absolute;
        right: 0.5rem;
        top: 0.4rem;
    }
</style>
