<template>
    <div class="glode"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="3"
    >
       <div class="header-top">
           <header :class="topHidden?'scrollHidden mint-header':'mint-header'">
               <mt-button icon=""></mt-button>
               <h1 class="mint-header-title">
                   <div class="searhed">
                       <i class="mint-toast-icon mintui mintui-search"></i>
                       <input type="text" v-model="keywords" placeholder='搜索你想要的商品' @keyup.13="handleKeyUp">
                   </div>
                   <span @click="handleKeyUp" class="search">搜索</span>
                   <!-- <span @click="handleKeyUp" class="searchBtn">搜索</span> -->
                   <router-link to="/block/message" class="msg-box" v-if="Blocktype && Blocktype != 6">
                       <img class="msg" :src="require('../../assets/images/block/icon-msg.png')" alt="">
                       <i v-show="unreadCount">{{ unreadCount > 9 ? '9+' :  unreadCount }}</i>
                   </router-link>
               </h1>
               <!--消息中心-->
           </header>
       </div>
        <div class="shopxx">
            <div class="column-img">
                <mt-swipe :auto="4000" :show-indicators="false">
                    <mt-swipe-item v-for="(item,i) in banner" :key="i">
                        <!-- <a @click="bannerLink(item.directUrl)"><img :src="item.imgUrl"></a> -->
                        <a @click="bannerLink(item.url)"><img :src="item.imgPath"></a>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!-- 跳转区域批发商 -->
            <block-area></block-area>
            <!-- 如果是区域批发商则展示分享按钮，不展示平台订货入口 -->
        </div>
        <div >
            <div class="topnav">
                <ul>
                    <li v-for="(item,index) in classify" :class="{lihover:classli==index}" @click="lihover(index,item.categoryId)"
                        :key="index">{{ item.categoryName || item.Name }}<i></i></li>
                </ul>
            </div>
            <div class="shoppin">
                <div class="shopChange">
                    <el-row>
                        <el-col :span="12" @click.native.capture="synthesis" :class="{'shop-active': categoryActive == 1}">推荐<i
                                :class="Sort==1?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
                        <el-col :span="12" @click.native.capture="pricefn" :class="{'shop-active': categoryActive == 2}">价格<i
                                :class="Sort==3?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
                    </el-row>
                </div>
                <div class="shopmain">
                    <div class="shoplist" v-for="(item,index) in product" :key="index" @click="linkTo(item.Code)">
                        <div class="shopimg"><img :src="item.ProductImg"></div>
                        <div class="shoptext">
                            <div class="shopname">{{ item.Name }}</div>
                            <div class="shopdeal">
                                <p>
                                    <i class="order">{{ countSale(item.Moq) }}{{item.Unit}}起订</i>
                                    <span class="money" v-if="[5, 6].indexOf(Number(Blocktype)) > -1">￥{{item.Price | formatPrice}} <span class="smallFs">({{ item.productPackage }})</span></span>
                                    <span class="money" v-else>￥**.**/{{ item.Unit2 }}</span>
                                    <span class="money-2" v-if="Blocktype == 5 || Blocktype == 6"> 建议零售价：￥{{ item.linePrice  | formatPrice}}/{{ item.Unit2 }}</span>
                                    <span class="money-2" v-else> 建议零售价：￥**.**/{{ item.Unit2 }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 是否已经加载完全部并且 -->
                <loading-gif :show-loading="!loading" title="加载中..."></loading-gif>
                <img v-if="loading && !product.length" class="noData"  src="../../assets/images/block/img_bg_zw.png" alt="a">
            </div>
        </div>
        <block-tabbar></block-tabbar>
        <!-- 客服悬浮窗 -->
        <customer></customer>
    </div>
</template>
<script>
    import wholesaleNav from "@/components/WholesaleNav";
    import loadingGif from "@/components/block/loading";
    import customer from "@/components/block/customer";
    //引入分享组件
    import blockTabbar from '@/components/blockTabbar';
    import blockArea from '@/components/blockArea';
    import {
        showToast,
        getCookie,
        setCookie,
        loginFn,
        throttle
    } from '../../assets/js/common';
    import {mapActions} from 'vuex'
    import {Toast} from "mint-ui";

    export default {
        data() {
            return {
                loading: false,
                classify: [{
                    categoryId: 0,
                    categoryName: "全部"
                }],
                keywords: '',
                classli: 0,
                url: this.URL + '/MerchantPage/MerchantPageList',
                product: [],
                banner: [],
                wholesaler: '',
                page: 1,
                rows: 50,
                Sort: 0,
                keyword: '',
                classifyID: 0,
                userType: '',
                mobile: '',
                shopname: '',
                address: '',
                seq: '',
                IsServicer: '',
                system: '',
                isLoading: true, //是否继续加载
                userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
                share:{sites: ['weixin', 'weixintimeline', 'qq', 'qzone']},
                shareIstrue:false,//是否是分享进来的
                Blocktype:this.$store.state.userInfo.Blocktype, // 当前角色的身份
                categoryActive: 1, // 当前选中类别
                business: this.$store.state.userInfo.business,
                userInfo: this.$store.state.userInfo,
                selectAuth: '',
                // 滚动条是否超过头部
                topHidden: true,
                unreadCount: 0,// 未读消息数量
            }
        },
        components: {
            blockTabbar,
            blockArea,
            loadingGif,
            customer
        },
        created() {
            this.saveData();
            if (!this.userInfo.invitationCode) {
                this.login()
            }
            //如果是分享进来的话就执行下面的代码
        },
        updated() {
            this.Blocktype=this.$store.state.userInfo.Blocktype // 当前角色的身份
            this.$nextTick(function () {
                // 产品图片固定高度
                $('.shopimg').each(function (i, e) {
                    $(e).css('height', $(e).width() + 'px');
                })
            })
        },
        mounted() {
            let that = this;
            this.getFenlei2();
            this.getBanner(); // banner
            this.queryMessage();
        },
        filters:{
            formatPrice(val){
                let num = Math.abs(val);
                num = num.toFixed(2);
                return num
            }
        },
        methods: {
            ...mapActions([
                "saveRole",
            ]),
            // 批发网区域批发商个人中心登录
            login() {
                loginFn().then(data =>{
                    console.log('userInfo==',data);
                    this.selectAuth = data.Blocktype;
                    this.userInfo = data;
                    this.seq = data.seq;
                    this.saveRole(data || {});
                })
            },
            // 确认搜索
            handleKeyUp(key) {
                this.page = 1;
                this.product = []
                this.loading = false;
                this.getProduct2();
            },
            // banner跳转
            bannerLink(url) {
                if (url === '#' || !url) return;
                location.href = 'url';
            },
            // 获取banner
            getBanner() {
                axios.get(this.blockURL + '/qypfs-base/banner/getBanner', {params: { deviceType: 'H5'}}).then(res => {
                    console.log('getBannaer', res);
                    if(res.data.code == 200){
                        let banner = res.data.data;
                        banner.sort((a,b) =>{
                            return a.sort - b.sort;
                        })
                        this.banner = banner;
                    } else {
                        showToast(res.data.msg || '系统错误')
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            // 保存数据
            saveData() {
                let seq = sessionStorage.getItem('seq');
                let IsServicer = sessionStorage.getItem('IsServicer');
                if (IsServicer) {
                    this.IsServicer = IsServicer;
                }
                if (seq) {
                    this.seq = seq;
                }
                if (this.$route.query.wholesaler) {
                    console.log(this.$route.query.wholesaler,"ll")
                    sessionStorage.setItem('Wseq', this.$route.query.wholesaler);
                }
                let userType = sessionStorage.getItem('userType');
                if (userType) {
                    this.userType = userType;
                }
                if (sessionStorage.getItem('Wseq')) {
                    this.wholesaler = sessionStorage.getItem('Wseq');
                } else {
                    this.wholesaler = sessionStorage.getItem('seq');
                }
                this.configSystem();
            },
            //获取分类数据
            getFenlei2() {
                if (this.Blocktype == 5 && this.business == 1) return this.getFenlei();
                // 下游商家或区域批发商身份需要传递指定店铺id 其余角色获取所有分类
                let storeId = [5,6].indexOf(Number(this.userInfo.Blocktype))!=-1?this.$store.state.storeId:0;
                let params = {
                    level: 1,
                    parentId: 0,
                    userId: storeId
                };
                axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList',params)
                .then((res)=>{
                    console.log(res);

                    if(res.data.code == 200){
                        let data = res.data.data;
                        data.categoryList.forEach(post => {
                            this.classify.push(post);
                        })
                    }
                }).catch(err=>{
                    console.log(err);

                    showToast('请求超时','center');
                    Indicator.close();
                })
            },
            getFenlei() {
                let params = {
                    // parentId: 0,
                    level: 2
                };
                axios.get(this.blockURL + '/qypfs-product/ic/product/icList',{ params: params})
                .then((res)=>{
                    console.log('getCategoryList===', res);
                    if(res.data.code == 200){
                        let data = res.data.data;
                        data.list.forEach(post => {
                            let item = {
                                categoryId: post.id,
                                categoryName: post.name
                            }
                            this.classify.push(item);
                        })
                    }
                }).catch(err=>{
                    showToast('请求超时','center');
                    Indicator.close();
                })
            },
            // 分类点击获取
            lihover(i, Id) {
                this.classli = i;
                this.page = 1;
                this.classifyID = Id;
                this.product = [];
                this.prodblur = false;
                this.isLoading = true;
                this.getProduct2();
            },
            // 获取产品数据
            getProduct2() { // 角色5
                if (!this.isLoading) return;
                this.loading = true;
                var that = this;
                var objData = {
                    userId: that.$store.state.storeId,
                    pageNum:that.page,
                    keyword:that.keywords,
                    pageSize:10,
                    // categoryId: that.iOneId,
                    sortType: that.Sort,
                    categoryId: this.classifyID,
                    operation: this.getOperation()
                }
                if (this.Blocktype == 5 && this.business == 1) {
                    objData.classifyId = this.classifyID;
                }
                if(objData.operation == 1) { // 根据operation获取
                    objData.status = 1
                }
                if (this.Blocktype == 6) objData.downstreamId = this.userInfo.userId; // 下游商家特殊价格需求
                axios.post(this.blockURL + '/qypfs-product/admin/mobile/product/list',objData)
                .then((res)=>{
                    console.log('product/list==', res);
                    if(res.data.data != null && res.data.data.list.length > 0){
                        let list = res.data.data.list;
                        list.forEach(item => {
                            item.Name = item.name;
                            item.Price = item.price;
                            item.ProductImg = item.img;
                            item.Moq = item.minimumQuantity;
                            item.Code = item.id;
                            item.Unit = item.unit;
                            item.Unit2 = item.unit2;
                        });
                        that.product = that.product.concat(list);
                        (that.page)++;
                        if (res.data.data.list.length!=10) {
                            this.loading = true;
                        } else {
                            this.loading = false;
                        }
                    }else{
                        this.loading = true;
                        this.isLoading = false
                        // that.spinner = false;
                        return false;
                    }
                    // this.clearZeroGoods();
                }).catch(function (error) {
                    console.log(error);
                    showToast('请求超时','center');
                });
            },
            // 根据角色获取operation
            getOperation() {
                let operation = 3;
                if (this.Blocktype == 6) {
                    operation = 1
                } else if(this.Blocktype == 5) {
                    operation = this.business == 1 ? 2 : 1
                }
                return operation;
            },
            loadMore() {
                this.getProduct2();
            },
            // 综合排序
            synthesis() {
                this.categoryActive  = 1;
                switch (this.Sort) {
                    case 1:
                        this.Sort = 2;
                        break;
                    default:
                        this.Sort = 1;
                        break;
                };
                this.loadfn();
            },
            // 价格排序
            pricefn() {
                this.categoryActive = 2;
                switch (this.Sort) {
                    case 3:
                        this.Sort = 4;
                        break;
                    default:
                        this.Sort = 3;
                        break;
                };
                this.loadfn();
            },
            // 销量排序
            salesfn() {
                switch (this.Sort) {
                    case 5:
                        this.Sort = 6;
                        break;
                    default:
                        this.Sort = 5;
                        break;
                };
                this.loadfn();
            },
            // 未读消息数量
            queryMessage() {
                if (this.Blocktype == 6) return;
                axios.get(this.blockURL+'/qypfs-message/api/message/unreadCount', { }).then(res => {
                    res.data.code == 200 ? this.unreadCount = res.data.data || 0 : Toast(res.data.message || '系统错误')
                })
            },
            loadfn() {
                this.isLoading = true;
                this.page = 1;
                this.product = [];
                this.prodblur = false;
                this.getProduct2();
            },
            linkTo(code) {
                var objData={strCode: code}
                this.$router.push({
                    path: 'details',
                    query: objData
                });
            },
            // 防止购买数量过多用计算单位来替换
            countSale(count) {
                let countext = count;
                if (count / 10000 >= 1 && count / 1000000 < 1) {
                    countext = Math.round(count / 10000) + '万';
                } else if (count / 1000000 >= 1 && count / 10000000 < 1) {
                    countext = Math.round(count / 1000000) + '百万';
                } else if (count / 10000000 >= 1 && count / 100000000 < 1) {
                    countext = Math.round(count / 10000000) + '千万';
                } else if (count / 100000000 >= 1) {
                    countext = Math.round(count / 100000000) + '亿';
                };
                return countext;
            },
            // 判断手机系统
            configSystem() {
                let ua = navigator.userAgent.toLowerCase();
                //Android终端
                let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
                //Ios终端
                let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (this.isWeixinBrowser(ua)) {
                    this.system = 'wx';
                } else {
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        this.system = 'ios';
                    } else if (/(Android)/i.test(navigator.userAgent)) {
                        this.system = 'android';
                    }
                }
            },
            // 判断是否是微信浏览器
            isWeixinBrowser(ua) {
                return (/micromessenger/.test(ua)) ? true : false;
            },
        }
    }

</script>

<style scoped>
    .header-top{
        height: 41px;
        width: 100%;
    }
    .scrollHidden{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1001;
    }
    .search{
        font-size: 0.58rem;
        color: #fff;
        padding: 0 0.5rem;
    }
    .noData {
        margin: 0 auto;
        text-align: center;
        color: #555;
        font-size: 0.7rem;
        padding: 2rem;
        padding-top: 0;
    }
    .searchBtn{
        float: right;
        margin-top: 0.28rem;
        font-size: 0.6rem;
        color: #fff;
    }
    .xx {
        text-align: center;
        background: url('../../assets/images/ICON.png') no-repeat center 1rem;
        background-size: 9.1111rem 7.5111rem;
        /* padding:11.1556rem 0 0; */
        padding-top: 9.4444rem
    }
    div.share{
        right: 0 !important;
        border-radius: 25px 0px 0 25px
    }
    .share img{
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.2rem
    }
    .xx p {
        overflow: hidden;
        font-size: .6667rem;
        color: #9ea0a0;
        /* margin-bottom:2.8222rem; */
        margin-bottom: .4444rem;
    }

    .xx a {
        color: #ff0000;
        display: block;
        width: 4.4444rem;
        height: 1.5111rem;
        line-height: 1.5556rem;
        border-radius: 3px;
        font-size: .7111rem;
        border: 1px solid #d83232;
        margin: 0 auto;
    }

    .Dls .DlsTitle {
        font-size: 0.6667rem;
        font-weight: 700;
        margin: 1.3333rem 0;
        color: #BCA98B;
        text-align: center;
    }

    .DlsCentent {
        width: 85%;
        margin: 0 auto;
        background: url('../../assets/images/wholesale/pfDls.png')no-repeat 0 0;
        background-size: 100% 100%;
        padding: 0.8889rem;
    }

    .DlsCentent:nth-child(3),
    .DlsCentent:nth-child(4) {
        margin-top: 0.4444rem;
    }

    .DlsCentent p {
        color: #5C5F6A;
        font-size: 0.5778rem;
        text-indent: 1.1556rem;
    }

    .Dls a {
        color: #ff0000;
        display: block;
        width: 4.4444rem;
        height: 1.5111rem;
        line-height: 1.5556rem;
        border-radius: 3px;
        font-size: .7111rem;
        border: 1px solid #d83232;
        margin: 0 auto;
        margin-top: 0.8889rem;
        text-align: center;
    }

    .orderStatus {
        display: inline-block;
        background: red;
        color: #fff;
        padding: 0.2222rem 0.4444rem;
        border-radius: 25px;
        float: right;
    }

    .glode {
        padding-bottom: 60px;
        min-height: 100vh;
        height: 100vh;
        overflow-y: auto;
    }

    /* header */
    .mint-header {
        background: -webkit-linear-gradient(left top,rgba(124, 25, 38,1),rgb(112, 37, 80,1));
        height: auto;
        border-bottom: none;
        padding-left: .65rem;
    }
    .mint-header-title{
        display: flex;
        align-items: center;
        overflow: visible;
    }
    .mint-header-title .msg-box{
        position: relative;
    }
    .mint-header-title .msg-box i{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .55rem;
        transform: scale(.7);
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        background:rgba(255,0,0,1);
        width: .95rem;
        height: .95rem;
        border-radius: 50%;
        position: absolute;
        top: -43%;
        right: -54%;
    }
    .mint-header .msg{
        width: .975rem;
        height: .875rem;
    }
    .mint-header-button {
        -webkit-box-flex: .12;
        -ms-flex: .12;
        flex: .12;
    }

    .searhed {
        float: left;
        padding: 6px 0.5rem;
        background: #ebebeb;
        border-radius: 2em;
        width: calc(100% - 1.8rem);
    }

    .searhed input {
        background: transparent;
        float: left;
        width: calc(100% - 1.6rem - 1em);
    }

    .searhed i {
        float: left;
        color: #9c9c9c;
        padding-right: 0.2rem;
    }

    .send {
        width: 30px;
        position: relative;
        z-index: 1;
        font-size: 0.6rem;
    }

    .send img {
        display: block;
    }

    .send .right-list {
        position: absolute;
        right: -8px;
        top: -0.4em;
        font-size: 12px;
        color: red;
        line-height: 1.4em;
        min-width: 1.4em;
        background: white;
        border-radius: 2rem;
    }

    /* shop */
    .shopxx {
        background: -webkit-linear-gradient(left top,rgba(124, 25, 38,1),rgb(112, 37, 80,1));
        padding: 5px .48rem;
        font-size: 0.62rem;
        line-height: 1.4em;
        position: relative;
    }

    .shopxx .column-img>>>.mint-swipe {
        height: calc(100vw*0.46) !important;
        max-height: 134px;
        border-radius: 10px;
    }
    .shopxx .column-img>>>.mint-swipe-item a{
        display: inline-block;
        height: 100%;
    }
    .shopxx .column-img>>>.mint-swipe-item img {
        width: 100%;
        object-fit: cover;
        height: 129PX;
        border-radius: 10px;
    }

    .shopxx .orderStatus {

        padding: 4px 15px;
        font-size: 0.62rem;
        position: absolute;
        right: 3px;
        bottom: 5px;
    }

    .shoplogo {
        float: left;
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        background: #ebebeb;
        position: absolute;
        top: 50%;
        left: 10px;
        margin-top: -1.5rem;
    }

    .shoplogo img {
        height: 100%;
    }

    .describe {
        float: right;
        width: calc(100% - 3.5rem);
        color: white;
    }

    .describe h1 {
        font-size: 0.7rem;
        line-height: 1.2em;
        padding-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .describe p {
        overflow: hidden;
        text-overflow: ellipsis;
        /* white-space:nowrap; */
        margin-bottom: 0.2rem;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }

    .describe span {
        font-size: 0.6rem;
        line-height: 1.2em;
    }

    .topnav {
        background: white;
        overflow: auto;
        font-size: 0.7rem;
        margin-bottom: 0.5rem;
        background: -webkit-linear-gradient(left top,rgba(124, 25, 38,1),rgb(112, 37, 80,1));

    }

    .topnav ul {
        white-space: nowrap;
    }

    .topnav::-webkit-scrollbar {
        display: none
    }

    /* 影藏滚动条 */
    .topnav ul li {
        display: inline-block;
        height: 3em;
        line-height: 3em;
        position: relative;
        /* color: #666; */
        color: #ffffff;
        margin: 0 10px;
        font-size: .584rem;
    }

    .topnav ul li.lihover {
        color: #ffffff;
    }

    .topnav ul li i {
        position: absolute;
        left: 0;
        bottom: 7px;
        width: 100%;
        height: 2px;
        background: #ffffff;
        display: none;
    }

    .topnav ul li.lihover i {
        display: block;
    }

    .shoppin {
        overflow: hidden;
    }

    .shopChange {
        overflow: hidden;
        background: white;
    }

    .shopChange .el-col {
        float: left;
        text-align: center;
        font-size: 0.65rem;
        color: #2E2D2D;
        line-height: 3em;
        font-size: .584rem;
    }
    .shopChange .el-col.shop-active{
        color: #FF6023;
        background: 0 none;
    }

    .shopbox {
        overflow: hidden;
        padding: 0 10px;
        margin-top: 0.5rem;
        height: auto;
        overflow-y: auto;
    }

    .shopmain {
        overflow-y: auto;
        /* width: calc(100% + 0.5rem); */
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 .35rem;
    }

    .shoplist {
        float: left;
        /* width: calc(50% - 0.5rem); */
        width: 48.6%;
        background: white;
        margin-top: .5rem;
    }

    .shoplist .shopimg {
        overflow: hidden;
        border: 1px solid #e9e9e9;
        border-bottom: none;
    }

    .shoplist .shopimg img {
        display: block;
        height: 100%;
    }

    .shoplist .shoptext {
        overflow: hidden;
        border: 1px solid #e9e9e9;
        padding: 0.4rem 0.2rem;
    }

    .shoplist .shoptext .shopname {
        overflow: hidden;
        font-size: 0.65rem;
        line-height: 1.2em;
        height: calc(2.4em - 1px);
        margin-bottom: 0.3rem;
        color: #333;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .shoplist .shoptext .shopdeal {
        overflow: hidden;
        font-size: 0.57rem;
        line-height: 1.2em;
    }

    .shoplist .shoptext .shopdeal p {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .shoplist .shoptext .shopdeal .money {
        float: left;
        /* color: #df2211; */
        color: #FF6023;
        font-size: 0.68rem;
        margin-top: 5px;
    }

    .shoplist .shoptext .shopdeal .money i {
        color: white;
        font-size: 0.7rem;
        background: #df2211;
    }

    .shoplist .shoptext .shopdeal .money-2 {
        color: #666;
        margin-top: .1rem;
        font-size: .51rem;
    }

    .shoplist .shoptext .shopdeal .order {
        float: right;
        color: #999;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #999999;
    }

    .shoplist .shoptext .shopdeal .letter {
        float: left;
        text-align: left;
        color: #999;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: none;
    }

    .loadings {
        overflow: hidden;
        padding: 1rem;
        text-align: center;
    }

    .msg-mask {
        height: 100vh;
        width: 100%;
        background: rgba(0, 0, 0, .3);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .messagebox {
        height: 7.6667rem;
        width: 70%;
        margin-top: -3.8888rem;
        margin-left: -35%;
        background: #fff;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
    }

    .messageContent {
        position: relative;
        height: 7.6667rem;
        overflow: hidden;
    }

    .messagebox .text {
        font-size: 0.6667rem;
        line-height: 1rem;
        padding: 1.3889rem 0.8888rem 1.3333rem;
        text-align: center;
        color: #333;
    }

    .btn-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.5111rem;
        line-height: 1.5111rem;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #ddd;
    }

    .btn-box span {
        flex: 1;
        height: 100%;
        text-align: center;
        font-size: 0.6222rem;
        color: #999;
    }
    .smallFs{
        font-size: 0.52rem;
    }

    .btn-box span:last-child {
        color: #f00;
        border-left: 1px solid #ddd;
    }

</style>
