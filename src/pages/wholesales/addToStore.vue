<template>
    <div class="addToStore">
        <!-- search -->
        <header class="mint-header">
            <div class="back" @click="back"><i class="el-icon-arrow-left"></i></div>
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input v-model="keywords" type="search" placeholder='请输入需要搜索的商品名称'>
                </div>
            </h1>
            <div class="mint-header-button is-right" @click="searchGoods()">搜索</div>
        </header>
        <!-- 滑动菜单栏 -->
        <div class="topwrap">
            <div class="topnav">
                <ul>
                    <li v-for="(item,key) in filter" :class="{'lihover': key === curNav}" :title="item.Id" @click="navClick(key,item.Id)" :key="key">{{item.Name}}<i></i></li>
                </ul>
            </div>
        </div>
        <div class="main" :style="{height:mainHeight+'px'}">
            <ul class="pro-list"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="5">
                <li v-for="(proItem,index) in datas" :key="index" class="pro-item">
                    <div class="pro-img"><img :src="proItem.ProductImgUrl"></div>
                    <div class="pro-desc" @click="jumpToDetails(proItem.Code)">
                        <p class="pro-title2">{{proItem.Name}}</p>
                        <p class="pro-info">{{proItem.Crime}}</p>
                    </div>
                    <i class="checked" @click="listAll($event, index,proItem)"></i>
                    <span class="goToDetail"><i class="el-icon-arrow-right"></i></span>
                </li>
                <li class="more_loading" v-show="allLoaded" style="background:#fff;text-align:center;">
                    <span style="font-size:0.6222rem;color:#999;">暂无更多数据~</span>
                </li>
            </ul>
        </div>
        <div class="addToStoreBox">
            <div class="addToStoreCount">
                <div class="setcheck"><i class="checked" @click="allCheck($event)"></i><span>全选</span></div>
                <span class="totalCount">共计：{{checklist}}件</span>
            </div>
            <div class="addToStoreBtnBox">
                <span class="addToStoreBtn" @click="setbut()">添加到我的店铺</span>
            </div>
        </div>
    </div>
</template>
<script>
import {showToast} from '@/assets/js/common.js';
export default {
    data(){
        return {
            filter:[
                {
                    Id:0,
                    Name:"全部"
                }
            ],
            mainHeight:0,
            curNav:0,
            loading:true,
            iSeq:sessionStorage.getItem('seq'),
            iOneId:0,
            iPageIndex:1,
            iPageSize:8,
            datas:[],
            allLoaded:false,
            order:[],
            codeArr:[],
            checklist:0,
            keywords:'',
            Name:'',
            strUserName:sessionStorage.getItem(''),
            
        }
    },
    created(){
        this.getFilterList();
    },
    mounted(){
    //     this.mainHeight = document.documentElement.clientHeight
    //   -document.querySelector('.mint-header').clientHeight
    //   -document.querySelector('.topwrap').clientHeight-1;
        this.getHeight2();
        // Indicator.open();
    },
    methods:{
        back(){
            this.$router.go(-1);
        },
        navClick(index,id){
            var that = this;
            that.datas=[];
            that.iPageIndex = 1;
            that.curNav = index;
            that.iOneId = id;
            that.Name = '';
            that.getGoodsList();
            that.order=[]; 
            that.codeArr=[];
            $('.checked').removeClass('hover el-icon-check');
        },
        getHeight2(){
            let self = this;
            let height2 = sessionStorage.getItem("mainHeight2");
            if(height2){
                this.mainHeight = height2;
            }else{
                self.height2();
            }
        },
        jumpToDetails(code){
            this.$router.push({path:'/details?strCode='+code+'&type=1'});
        },
        height2(){
            this.mainHeight = document.documentElement.clientHeight
            -44
            -document.querySelector('.topwrap').clientHeight
            -document.querySelector('.addToStoreBox').clientHeight;
            sessionStorage.setItem("mainHeight2",this.mainHeight);
        },
        getFilterList(){
            var that = this;
            axios.get(this.URL+'/Product/GetListProductClass',{params:{
                iSeq:that.iSeq
            }})
            .then((res)=>{
                if(res.data.Code == 200){
                    let data = res.data.Resultdata;
                    data.forEach(post => {
                        that.filter.push(post);
                    })
                    that.iOneId = that.filter[0].Id;
                    that.getGoodsList();
                }
            })
        },
        searchGoods(){
            var that = this;
            that.iPageIndex = 1;
            that.datas = [];
            that.curNav = 0;
            that.iOneId = 0;
            that.Name = 'Name';
            that.getGoodsList();
        },
        getGoodsList(){
            Indicator.open();
            var that = this;
            this.loading = true;
            var objData={
                // iOneId:that.iOneId,
                iSeq:that.iSeq,strCondition:that.Name,strKeyword:that.keywords,iOneId:that.iOneId,iPageIndex:that.iPageIndex,iPageSize:that.iPageSize
            }
            if(this.$store.state.userBlock){
                objData.wholesalerType=2
            }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                objData.wholesalerType=1
            }else{
                objData.wholesalerType=0
            }
            axios.get(this.PRODUCT+'/Product/GetProductDetailsInfo',{params:objData,timeout:5000})
            .then((res)=>{
                Indicator.close();
                if(res.data.Resultdata.length != 0){
                    that.datas = that.datas.concat(res.data.Resultdata);
                    (that.iPageIndex)++;
                    Indicator.close();
                    that.allLoaded = false;
                    $('.addToStoreBox .checked').removeClass('hover el-icon-check');
                }else{
                    that.allLoaded = true;
                    return false;
                }
                this.loading = false;
            })
            .catch(err => {
                showToast('请求超时');
                Indicator.close();
            })
        },
        loadMore() {
            let self = this;
            self.getGoodsList();
        },
        // 添加选中的商品
        addArr(obj){
            // console.log(obj);
            for(var i=0;i<this.codeArr.length;i++){
                if(this.codeArr[i] == obj.Code) return false;
            };
                this.codeArr.push(obj.Code);
            console.log(obj,this.codeArr);
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
        // 添加选择的商品
        setbut(){
            if(this.codeArr.length == 0){
                Toast('请选择要添加的产品！');
                return false;
            }else{
                var that = this;
                MessageBox({
                    title:"",
                    message: '是否确定添加产品?',
                    showCancelButton: true
                }).then(action => {
                    if(action == 'confirm'){
                        var WholesaleName = sessionStorage.getItem('WholesaleName');
                        // axios.post(this.PRODUCT + '/Product/AddDHProduct',{
                        axios.post(this.MS + '/Product/AddDHProduct',{
                            iSeq:that.iSeq,
                            strUserName:WholesaleName,
                            strArrCode:that.codeArr
                        })
                        .then((res)=>{
                            if(res.data.Code == 200){
                                Toast({
                                    message: res.data.Msg,
                                    duration: 1000
                                });
                                setTimeout(function(){
                                    $('.checked').removeClass('hover el-icon-check');
                                    that.$router.push('/wholesale/goodsManagement');
                                },1000);
                            }else{
                                Toast({
                                    message: res.data.Msg,
                                    duration: 2000
                                });
                                return false;
                            }
                        });
                    }
                });
            }
        }
    },
    // 判断返回页面不刷新
    beforeRouteLeave(to,from,next){
        if(to.name == 'details'){
            from.meta.keepAlive = true;
        }else{
            from.meta.keepAlive = false;
        };
        next();
    }
}
</script>
<style scoped>
@import '../../assets/css/addToStore.css';

</style>
