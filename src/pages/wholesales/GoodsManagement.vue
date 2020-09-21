<template>
    <div class="goods-management">
        <!-- search -->
        <header class="mint-header" v-if="!userBlock">
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input type="search" v-model="keywords" placeholder='请输入需要搜索的商品名称'>
                    <span class="search" @click="searchKeywords">搜索</span>
                </div>
            </h1>
            <!-- <div class="mint-header-button is-right" @click="editHandle">{{operationTitle}}</div> -->
        </header>
        <!-- 滑动菜单栏 -->
        <div class="operationTab" v-if="!userBlock" ref="operationTab">
            <button class="tab" @click="chooseOperation(0)">商品库</button>
            <!-- <button class="tab" @click="chooseOperation(1)">商品上传</button> -->
            <button class="tab" @click="chooseOperation(2)" :class="i==1?'choosed':''">批量上/下架</button>
            <!-- <button class="tab"><router-link to="/wholesale/addGood">添加新商品</router-link></button> -->
        </div>
        <div class="topwrap" ref="topwrap">
            <div class="topnav">
                <ul>
                    <li v-for="(item,index) in filter" :title="item.Id" :key="index" :class="{'lihover':index === navIndex}" @click="navClick(index,item.Id)">{{item.Name}}<i></i></li>
                </ul>
            </div>
        </div>
        <div class="UpperTab" v-if="!userBlock" ref="UpperTab">
            <button class="tab choosed" @click="chooseTab(true)" :style="{color:(isShow?choosed:unChoose)}">待上架</button>
            <button class="tab" @click="chooseTab(false)" :style="{color:(isShow?unChoose:choosed)}">已上架</button>
        </div>
        <div class="main" :style="{height:mainHeight1+'px',paddingBottom:isUp?'2.4rem':'0'}">
            <ul class="pro-list"
             v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="5">
                <li class="pro-item" v-for="(item,index) in datas" :key="index" :style="isUp?'padding-left:2.0667rem;':'padding-left:0.5333rem;'">
                    <div class="pro-main" @click="isEdit?'':editPro(item.Code,item.IsUpper,item.SourceType)">
                        <div class="pro-img"><img :src="item.PriductImg"></div>
                        <div class="pro-desc">
                            <p class="pro-title">{{item.Name}}</p>
                            <p class="pro-price">￥{{ item.ShopPrice | formatPrice }}</p>
                            <p class="pro-stock"><span>库存：{{item.StockCount>0?countSale(item.StockCount):0}}{{item.Unit}}，</span><span>起订量：{{item.Moq>0?countSale(item.Moq):0}}{{item.Unit}}</span></p>
                        </div>
                    </div>
                    <i class="checked" @click="listAll($event, index,item)" v-if="isUp"></i>
                    <div v-if="!userBlock">
                        <div v-if="item.IsUpper==0 || item.IsUpper==2" class="isUp" @click="isEdit?'':isUpGoods(item.Code)">
                            <span class="isUpIcon"><img src="../../assets/images/wholesale/grounding-icon.png"></span>
                            <span class="isUpTitle">上架</span>
                        </div>
                        <div v-if="item.IsUpper==1" class="isUp" @click="isEdit?'':isDownGoods(item.Code)">
                            <span class="isUpIcon"><img src="../../assets/images/wholesale/undercarriage-icon.png"></span>
                            <span class="isUpTitle">下架</span>
                        </div>
                    </div>
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
        <wholesale-nav v-if="userType == 2||userType == 7||userType == 8||userBlock"></wholesale-nav>
    </div>
</template>
<script>
import wholesaleNav from '@/components/WholesaleNav'
import {showToast} from '@/assets/js/common.js'
export default {
    data () {
        return {
            filter:[
                {
                    Id:0,
                    Name:"全部"
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
            choosed:'#FF0025',
            unChoose:'#939397',
            checklist:0,
            order:[],
            codeArr:[],
            IsUpper:1,
            isOperation:false,
            i:0,
            userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
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
        clearZeroGoods(){
            for(var i =0;i<this.datas.length;i++){
                if((this.datas[i].StockCount<this.datas[i].Moq || this.datas[i].StockCount ==0 || this.datas[i].StockCount ==null) && this.datas[i].IsUpper){
                    let post = {
                        iSeq:this.iSeq,
                        arrCode:[this.datas[i].Code]
                    }
                    axios.post(this.URL + '/Product/UpperLowerShelfProducts',post)
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
            if(that.index == 0){
                this.$router.push('/wholesale/addToStore');
            }else if(that.index == 2){
                if(that.i == 0){
                    that.isUp = true;
                    that.i++;
                }else{
                    that.isUp = false;
                    that.i--;
                }
            }else{
                this.$router.push('/wholesale/uploadGoods');
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
            var params={
                iSeq:that.iSeq
            }
            //判断如果是登录的区域批发商的身份则加加上字段
             if(this.userBlock){
                params.wholesalerType=2
                }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                params.wholesalerType=1
                }else{
                params.wholesalerType=0
            }
            axios.get(this.URL + '/Product/GetListWholesaleProductClass',{params:params})
            .then((res)=>{
                if(res.data.Code == 200){
                    let data = res.data.Resultdata;
                    data.forEach(post => {
                        that.filter.push(post);
                    })
                    that.iOneId = that.filter[0].Id;
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
                iSeq:that.iSeq,iPageIndex:that.page,strCondition:that.Name,strKeyword:that.keywords,iPageSize:5,iOneId:that.iOneId,IsUpper:that.IsUpper
            }
            //判断如果是登录的区域批发商的身份则加加上字段
             if(this.userBlock){
                objData.wholesalerType=2
                }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                objData.wholesalerType=1
                }else{
                objData.wholesalerType=0
            }
            axios.get(this.URL + '/Product/GetListProductPage',{params:objData,timeout:5000})
            .then((res)=>{
                Indicator.close();
                if(res.data.Resultdata != null){
                    that.datas = that.datas.concat(res.data.Resultdata);
                    (that.page)++;
                    that.allLoaded = false;
                }else{
                    that.allLoaded = true;
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
                    axios.post(this.URL + '/Product/UpperLowerShelfProducts',post)
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
        editPro(code,isUp,type){
            if(isUp == 1){
                showToast('请先下架商品，再进行编辑!','center');
                return false;
            }else{
                if(type||this.userBlock){
                    this.$router.push({path: '/wholesale/addNewGoods',query:{ code:code}});
                }else{
                    this.$router.push({path: '/wholesale/addGood',query:{ code:code}});
                }
            }
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
                axios.post(this.URL + '/Product/UpperLowerShelfProducts',post)
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
                        axios.post(this.URL + '/Product/UpperLowerShelfProducts',post)
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
    .more_loading >>> .mint-spinner-fading-circle{
        margin: 0 auto;
    }
    .operationTab .tab a{
        color: #939397;
    }
</style>
