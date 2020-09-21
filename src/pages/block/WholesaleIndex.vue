<template>
    <div class="glode">
        <header class="mint-header" v-if="(userType != 3&&userType !=4&&userType !=6&&userType !=7&&!shareIstrue)||userBlock">
            <mt-button icon=""></mt-button>
            <h1 class="mint-header-title">
                <router-link :to="'/search?wholesaler='+wholesaler" class="searhed">
                    <i class="mint-toast-icon mintui mintui-search"></i>
                    <input type="text" placeholder='请输入需要搜索的商品名称' readonly>
                </router-link>
            </h1>
            <!--消息中心-->
            <!--<div slot="right" class="send" @click="uInfo">-->
                <!--<img :src="shopData.HeadPortraitURL" v-if="shopData.HeadPortraitURL">-->
                <!--<img src="@/assets/images/wholesale/user-icon.png" v-else>-->
            <!--</div>-->
        </header>
        <div class="shopxx">
            <!-- <div class="describe">
              <h1>{{ shopData.storeName || shopData.shopname ||shopData.username }}</h1>
              <p v-if="userType != 3&&userType !=4&&userType !=6&&userType !=7">{{ (shopData.province!=null?shopData.province:'')+(shopData.city!=null?shopData.city:'')+(shopData.area!=null?shopData.area:'')+(shopData.street!=null?shopData.street:'')+(shopData.address!=null?shopData.address:'')}}</p>
              <p v-else>{{(shopData.provice!=null?shopData.provice:'')+(shopData.city!=null?shopData.city:'')+(shopData.area!=null?shopData.area:'')+(shopData.street!=null?shopData.street:'')+(shopData.adressdetail!=null?shopData.adressdetail:'')}}</p>
            </div> -->
            <div class="column-img">
                <mt-swipe :auto="4000" :show-indicators="false">
                    <mt-swipe-item v-for="(item,i) in banner" :key="i">
                        <a @click="bannerLink(item.directUrl)"><img :src="item.imgUrl"></a>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!-- 如果是区域批发商则展示分享按钮，不展示平台订货入口 -->
            <!--<div class="orderStatus share" v-if="userBlock||shareIstrue" @click="changeShare"><img src="../../assets/images/dh_icon_sharebtn.png" alt=""><span>分享</span></div>-->
            <!--<span class="orderStatus"  v-show="userType != 5 && userType != 6&&!userBlock&&!shareIstrue" @click="OrderState">平台订货</span>-->
        </div>

        <div v-if="(userType != 3&&userType !=4&&userType !=6&&userType !=7)||userBlock">
            <div class="topnav">
                <ul>
                    <li v-for="(item,index) in classify" :class="{lihover:classli==index}" @click="lihover(index,item.categoryId)"
                        :key="index">{{ item.Name || item.categoryName }}<i></i></li>
                </ul>
            </div>
            <div class="shoppin">
                <div class="shopChange">
                    <el-row>
                        <el-col :span="12" @click.native.capture="synthesis" :class="{active: categoryActive == 1}">推荐<i
                                :class="Sort==1?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
                        <el-col :span="12" @click.native.capture="pricefn" :class="{active: categoryActive == 2}">价格<i
                                :class="Sort==3?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col>
                        <!-- <el-col :span="8" @click.native.capture="salesfn">销量<i :class="Sort==5?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-col> -->
                    </el-row>
                </div>
                <div class="shopbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                     infinite-scroll-distance="10" infinite-scroll-throttle-delay="500">
                    <div class="shopmain">
                        <!--list-->
                        <div class="shoplist" v-for="(item,index) in product" :key="index" @click="linkTo(item.Code)">
                            <div class="shopimg"><img :src="item.ProductImg"></div>
                            <div class="shoptext">
                                <div class="shopname">{{ item.Name }}</div>
                                <div class="shopdeal" v-if="sales">
                                    <p style="margin-bottom:0.4rem"><i class="letter">已售{{ countSale(item.CountSale) }}{{item.Unit}}</i><i
                                            class="order">{{ countSale(item.Moq) }}{{item.Unit}}起订</i></p>
                                    <p><span class="money">
                      <!--<i>促</i>-->￥{{ Blocktype==5?(item.Price | formatPrice):"**.**" }}</span></p>
                                </div>
                                <div class="shopdeal" v-else>

                                    <p><i class="order">{{ countSale(item.Moq) }}{{item.Unit}}起订</i>
                                        <span class="money">
                      <!--<i>促</i>-->￥{{ Blocktype==5?(item.Price | formatPrice):"**.**" }}</span>
                                    </p>
                                </div>
                            </div>
                            <!--list end-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="xx" v-if="status=='-1'&&(userType == 3||userType == 4||userType == 6)&&!userBlock">
            <p>您还不是批发商，请先入驻成批发商</p>
            <a :href="hrefs">前往入驻</a>
        </div>
        <div class="xx" v-if="status!='-1'&&(userType == 3||userType == 4||userType == 6)&&!userBlock">
            <p>您已入驻批发商，正在审核中...</p>
            <router-link :to="hrefs">查看入驻进度</router-link>
        </div>
        <div class="Dls" v-if="(userType == 3||userType == 4||userType==7)&&!userBlock">
            <p class="DlsTitle">进入店铺管理————我的邀请中有五种邀请方式</p>
            <div class="DlsCentent">
                <p>3种缴年费方式：1080元年费、1825元年费、3888元年费，点击不同的年费，生成不同的链接，发送给被邀请人。(年费总额的60%归推荐人）</p>
            </div>
            <div class="DlsCentent">
                <p>1种扣点方式：点击扣点，输入扣点百分比，生成链接发送给被邀请人。（最高不超过15%,平台只收1%，另1%或以上的归代理商自己所有，代理商自己要缴税）</p>
            </div>
            <div class="DlsCentent">
                <p>还有一种“免费使用三个月”，代理商发此链接给被邀请人，被邀请人可免费使用本系统功能三个月，三个月到期前需按上述方案重发链接让被邀请人缴付使用费。</p>
            </div>
            <router-link to="/wholesale/storeManagement">前往邀请</router-link>
        </div>

        <bottomnav :bottom="bottomnav" v-if="userType == 1&&!userBlock"></bottomnav>
        <block-tabbar v-if="true"></block-tabbar>
        <div class="msg-mask" v-if="isDinghuo">
            <div class="messagebox">
                <div class="messageContent">
                    <div class="text">您提交的批发商入驻资料被驳回，是否前往重新填写资料?</div>
                    <div class="btn-box">
                        <span @click="OrderState">平台订货</span>
                        <span @click="goRewrite">立即前往</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 客服悬浮窗 -->
        <router-link to="/notice" class="links" >
            <img src="http://nfxts.520shq.com/localQuickPurchase/distributionApp/images/customer/icon_1.png" alt="">
        </router-link>
        <!-- 分享组件 -->
        <!-- 跳转区域批发商 -->
        <block-area></block-area>
    </div>
</template>
<script>
    import wholesaleNav from "@/components/WholesaleNav";
    //引入分享组件
    import blockTabbar from '@/components/blockTabbar';
    import blockArea from '@/components/blockArea';
    import {
        showToast,
        getCookie,
        setCookie
    } from '../../assets/js/common';

    export default {
        data() {
            return {
                bottomnav: {
                    index: '首页'
                },
                shopData: '',
                sales: false,
                loading: false,
                classify: [{
                    Id: 0,
                    Name: "全部"
                }],
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
                isUploadInfo: false,
                applay: '',
                hrefs: '',
                isDinghuo: false,
                status: '', //批发网批发商入驻审核状态
                ApplyStatus: '', //银联入驻审核状态
                agentType: "", //批发网代理商入驻审核状态
                brandSquareStatus: "", //品牌广场入驻审核状态
                isLoading: true, //是否继续加载
                isPopupShow: true, //试用期提示弹框展示
                userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
                share:{sites: ['weixin', 'weixintimeline', 'qq', 'qzone']},
                shareIstrue:false,//是否是分享进来的
                Blocktype:this.$store.state.userInfo.Blocktype, // 当前角色的身份
                categoryActive: 1, // 当前选中类别
                business: this.$store.state.userInfo.business,
            }
        },
        components: {
            blockTabbar,
            blockArea
        },
        created() {
            this.saveData();
            //如果是分享进来的话就执行下面的代码
            var url = location.href;
            var params = url.split("?")
            if(params.length>=3){
                if(params[2]&&params[2].indexOf("&")>-1){
                    params=params[2].split("&")
                }
            }else{
                if(params[1]&&params[1].indexOf("&")>-1){
                    params=params[1].split("&")
                }
            }
            var searchData = {}
            params.map(v => searchData[v.split("=")[0]] = v.split("=")[1])
            this.shareIstrue=searchData.share?searchData.seq:false
            if(searchData.share){
                this.wholesaler=searchData.wholesaler?searchData.wholesaler:''
            }
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
            if (this.userType == 3 || this.userType == 4 || this.userType == 6 || this.userType == 7) {
                this.getUserInfo();
            } else {
                this.getStoreInfo();
            }
            if(this.Blocktype == 5){ // 角色5
                this.getFenlei2();
            } else {
                this.getFenlei();
            }
            this.huoBanner();
        },
        filters:{
            formatPrice(val){
                let num = Math.abs(val);
                num = num.toFixed(2);
                return num
            }
        },
        methods: {
            //区域批发商点击分享时的分享事件
            //分享商品事件
            changeShare(){
                this.$refs.share.changeShare()
            },
            //获取轮播图
            huoBanner() {
                var url=this.URL + '/WholesaleManage/GetWholesaleBannerList?seq='+(this.seq||this.wholesaler)
                //判断商户的身份是否为区域批发商
                if(this.userBlock){
                    url+=`&wholesalerType=0`
                }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                    url+=`&wholesalerType=1`
                }else{
                    url+=`&wholesalerType=0`
                }
                axios.get(url).then(res => {
                    this.banner = res.data.dataList
                    console.log(this.banner)

                }).catch(function (error) {
                    console.log(error);
                });
            },
            bannerLink(links) {

                if (links.indexOf('http') >= 0 || links.indexOf('https') >= 0) {
                    window.location.href = links;
                } else {
                    this.$router.push({
                        path: links
                    })
                }
            },
            //跳转个人信息
            uInfo() {
                this.$router.push('/wholesale/wholesaleAddress');
            },
            goRewrite() {
                location.href = this.SETTLED + '?wholesaler=' + this.seq + '&rewrite=true&isIndex=true';
            },
            // 批发商入驻页面跳转
            isPassSettled() {
                if (this.status == 0) {
                    var url = location.href;
                    var params = url.split("?")
                    if(params.length>=3){
                        if(params[2]&&params[2].indexOf("&")>-1){
                            params=params[2].split("&")
                        }
                    }else{
                        if(params[1]&&params[1].indexOf("&")>-1){
                            params=params[1].split("&")
                        }
                    }
                    var obj = {}
                    params.map(v => obj[v.split("=")[0]] = v.split("=")[1])
                    if (!this.$route.query.from && this.$route.query.from != 'progress'&&!this.userBlock&&!obj.share) {
                        this.$router.push({
                            path: '/wholesaleCheckProgress',
                            query: {
                                seq: this.seq
                            }
                        })
                    }
                } else if (this.IsServicer == 'true' && this.userType == 2 && (this.status == 2 || this.status == 5)) {
                    this.isDinghuo = true;
                } else if (this.userType == '2' && (this.status == 2 || this.status == 5)) {
                    MessageBox({
                        title: "",
                        message: '您提交的批发商入驻资料被驳回，是否前往重新填写资料?',
                        showCancelButton: true,
                        confirmButtonText: '立即前往',
                        cancelButtonText: '退出登录',
                        closeOnClickModal: false
                    }).then(action => {
                        if (action == 'confirm') {
                            location.href = this.SETTLED + '?wholesaler=' + this.seq + '&rewrite=true&isIndex=true';
                        } else {
                            this.loginOut();
                        }
                    })
                } else if (this.status == 2 || this.status == 5) {
                    MessageBox({
                        title: "",
                        message: '您提交的批发商入驻资料被驳回，是否前往重新填写资料?',
                        showCancelButton: true,
                        confirmButtonText: '立即前往',
                        cancelButtonText: '放弃入驻'
                    }).then(action => {
                        if (action == 'confirm') {
                            location.href = this.SETTLED + '?wholesaler=' + this.seq + '&rewrite=true&isIndex=true';
                        }
                    })
                }
            },
            // 批发网代理商入驻跳转页面
            agentLink() {
                if (this.agentType == "0") {
                    let from = this.$route.query.from;
                    let mobile = sessionStorage.getItem("mobile");
                    if (mobile) {
                        if (from != 'prograss') {
                            location.href = this.AGENTCHECK + '?mobile=' + mobile + "&from=" + this.seq;
                        }
                    }
                }
            },
            // 品牌商入驻
            brandSqueryLink() {
                // let from = sessionStorage.getItem("isFrom");
                // alert(from + '123');
                if (this.brandSquareStatus == 0 || this.brandSquareStatus == 4 || this.brandSquareStatus == 5 || this
                    .brandSquareStatus == 6) {
                    // window.location.href = this.BRANDSQUAREPROGRESS + "?id="+this.seq + "&status=" + this.brandSquareStatus+"&type="+from;
                    window.location.href = this.BRANDSQUAREPROGRESS + "?s=" + this.seq + "&status=" + this.brandSquareStatus;
                }
            },
            // 退出登录
            loginOut() {
                let isFrom = sessionStorage.getItem("isFrom");
                if (isFrom == "app") {
                    window.action.backPageLogin();
                } else {
                    this.$router.push({
                        path: '/login'
                    });
                }
                setCookie('seq', '');
                setCookie('isAuto', this.$base64.encode("false"));
                sessionStorage.clear();
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
            //获取店铺信息
            getStoreInfo() {
                axios.get(this.URL + '/WholesaleManage/GetWholesalerInfoDetail', {
                    params: {
                        WholesaleSEQ: this.wholesaler
                    }
                }).then(res => {
                    this.shopData = res.data;
                    this.status = res.data.auditStatus; //银联审核状态
                    this.agentType = res.data.AgentStatus; //代理商审核状态
                    this.ApplyStatus = res.data.ApplyStatus; //银行审核状态
                    //初始化分享的内容
                    var shareObj={
                        // 分享的链接，默认使用location.href
                        url:location.origin+location.pathname+`#/wholesale/business?wholesaler=${this.wholesaler}&share=true&seq=${this.seq||this.shareIstrue}`,
                        // 分享的标题，默认使用document.title
                        title: "520批发网花更少的钱，买更优质的商品",
                        // 分享的摘要，默认使用<meta name="description" content="">content的值
                        digest: res.data.storeName,
                        // 分享的图片，默认获取本页面第一个img元素的src
                        pic:this.shopData.HeadPortraitURL||"",
                        // 默认显示的网站为以下六个个,支持设置的网站有
                        // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                        sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                    };
                    console.log(shareObj)
                    this.share=shareObj
                    this.isOverdue(res.data.certificate_type, res.data.IsExpired, false);
                    // 批发商入驻审核过程
                    if (res.data.MarketAuditStatus == 0 && res.data.FinanceAuditStatus == 0) { //批发商入驻/--市场待审
                        this.status = 0;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 0) { //批发商入驻/品牌商入驻--财务待审
                        this.status = 1;
                    } else if (res.data.MarketAuditStatus == 2 && res.data.FinanceAuditStatus == 0) { //批发商入驻/品牌商入驻--市场驳回
                        this.status = 2;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 1) { //批发商入驻/品牌商入驻--财务通过
                        this.status = 4;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 2) { //批发商入驻/品牌商入驻--财务驳回
                        this.status = 5;
                    }
                    // 品牌商入驻审核过程
                    if (res.data.MarketAuditStatus == 0 && res.data.FinanceAuditStatus == 0 && res.data.HQAuditStatus ==
                        0) { //品牌商入驻/--市场待审
                        this.brandSquareStatus = 0;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 0 && res.data
                        .HQAuditStatus == 0) { //品牌商入驻--财务待审
                        this.brandSquareStatus = 1;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 1 && res.data
                        .HQAuditStatus == 0) { //品牌商入驻--总经办待审
                        this.brandSquareStatus = 2;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 1 && res.data
                        .HQAuditStatus == 1) { //品牌商入驻--总经办通过
                        this.brandSquareStatus = 3;
                    } else if (res.data.MarketAuditStatus == 2 && res.data.FinanceAuditStatus == 0 && res.data
                        .HQAuditStatus == 0) { //品牌商入驻--市场驳回
                        this.brandSquareStatus = 4;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 2 && res.data
                        .HQAuditStatus == 0) { //品牌商入驻--财务驳回
                        this.brandSquareStatus = 5;
                    } else if (res.data.MarketAuditStatus == 1 && res.data.FinanceAuditStatus == 1 && res.data
                        .HQAuditStatus == 2) { //品牌商入驻--总经办驳回
                        this.brandSquareStatus = 6;
                    }
                    // 品牌商(8)不需要检验批发商入住状态
                    if (this.userType != '8') {
                        this.isPassSettled();
                    }
                    // 批发商角色/品牌商角色(需任意审核通过)需校验银行入驻审核状态
                    if (((this.userType == 2 && this.status == 4) || this.userType == 8) && !res.data.IsExpired) {
                        this.checkUpload();
                    }
                    // 校验品牌商入驻状态(暂停使用)
                    if (this.userType == '8') {
                        this.brandSqueryLink();
                    }
                });
            },
            //获取分类数据
            getFenlei() {
                var url=this.URL + '/MerchantPage/GetProductCategory?WholesaleSEQ=' + this.wholesaler
                //判断商户的身份是否为区域批发商
                axios.get(url).then(res => {
                    let data = res.data;
                    data.forEach(post => {
                        this.classify.push(post)
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            //获取分类数据2
            getFenlei2() {
                let params = {
                    level: 1,
                    parentId: 0
                }
                axios.post(this.blockURL + '/admin/super/product/getCategoryList',params)
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
            // 返回到h5//app
            backPage() {
                let fromApp = sessionStorage.getItem('app');
                if (fromApp) {
                    window.action.backPageLogin();
                } else {
                    this.$router.push('/login');
                }
            },
            // 批发商入驻状态判断入驻//进度页
            goSettled() {
                if (this.status == '-1') {
                    this.hrefs = this.SETTLED + '?isServicer=true&usertype=' + this.userType + '&wholesaler=' + this.wholesaler +
                        '&phone=' + this.shopData.mobile + '&isIndex=true';
                } else {
                    this.hrefs = '/wholesaleCheckProgress?seq=' + this.seq;
                }
            },
            // 不是批发商  获取个人信息
            getUserInfo() {
                let that = this;
                axios.get(this.URL + '/User/GetUserInfoBySeq', {
                    params: {
                        seq: this.seq
                    }
                })
                    .then((res) => {
                        Indicator.close();
                        if (res.data) {
                            that.shopData = res.data;
                            this.status = res.data.auditStatus;
                            this.agentType = res.data.AgentStatus;
                            if (that.seq == res.data.seq) {
                                that.certificate_type = res.data.certificate_type;
                            }
                            that.isOverdue(res.data.certificate_type, res.data.IsExpired, true)
                            that.goSettled();
                            if (this.userType != '7') {
                                this.isPassSettled();
                            } else if (this.userType == '7') {
                                this.agentLink();
                            }
                        } else {
                            // showToast("请先登录");
                            // setTimeout(()=>{
                            //   this.$router.push('/login');
                            // },2000);
                        }
                    });
            },
            // 判断试用账号是否过期
            isOverdue(certificate_type, IsExpired, notCancel) {
                // 创建保存弹框显示标志
                // 判断标识是否存在  不存在  创建  存在  读取
                let isShow = sessionStorage.getItem("isPopupShow");
                if (!isShow) {
                    sessionStorage.setItem("isPopupShow", 1);
                }
                if (certificate_type == "4" && IsExpired && this.isPopupShow) {
                    if (isShow == 0) return;
                    MessageBox({
                        title: "",
                        message: '您的批发商账号免费试用三个月已到期，是否需要继续使用？',
                        showCancelButton: notCancel,
                        confirmButtonText: '是',
                        cancelButtonText: '否'
                    }).then(action => {
                        if (action == 'confirm') {
                            this.$router.push("/cooperation");
                            sessionStorage.setItem("isPopupShow", 0);
                        }
                        if (action == 'cancel') { //取消的回调
                            sessionStorage.setItem("isPopupShow", 0);
                        }
                    });
                }
            },
            // 分类点击获取
            lihover(i, Id) {
                this.classli = i;
                this.page = 1;
                this.classifyID = Id;
                this.product = [];
                this.prodblur = false;
                this.isLoading = true;
                this.getProduct();
            },
            // 跳转到自己的店铺
            toUsStore() {
                // let se
                let wholesaler = this.$route.query.wholesaler;
                if (wholesaler == this.seq) {
                    this.getProduct();
                }
            },
            // 获取产品数据
            getProduct() {
                if (!this.isLoading) return;
                if(this.Blocktype == 5 ){
                     return this.getProduct2(); // 角色5
                }
                Indicator.open();
                this.loading = true;
                let that = this;
                let post = {
                    SEQ: getCookie("seq")||this.shareIstrue,
                    WholesaleSEQ: this.wholesaler,
                    classifyID: this.classifyID,
                    page: this.page,
                    rows: this.rows,
                    keyword: this.keyword,
                    Sort: this.Sort
                };
                //判断商户的身份是否为区域批发商
                if(this.userBlock){
                    post.wholesalerType=1
                }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                    post.wholesalerType=1
                }else{
                    post.wholesalerType=0
                }
                //判断是否分享进来的，如果是则也展示区域批发商的商品
                if(this.shareIstrue) {
                    post.wholesalerType=2
                }
                axios.get(that.url, {
                    params: post,
                    timeout: 30000
                }).then(res => {
                    Indicator.close();
                    if (res.data.MerchantPageVM.length == 0) {
                        this.isLoading = false;
                        // that.loading = true;
                        return false;
                    };
                    that.product = that.product.concat(res.data.MerchantPageVM);
                    this.page++;
                    this.isLoading = true
                    this.loading = false;
                }).catch(function (error) {
                    showToast('请求超时', 'center');
                    Indicator.close();
                });
            },
            getProduct2() { // 角色5
                this.loading = true;
                var that = this;
                var objData={
                    userId: 114 || that.$store.state.userInfo.userId,
                    pageNum:that.page,
                    keyword:that.keywords,
                    pageSize:5,
                    categoryId: that.iOneId,
                    sortType: that.Sort,
                    categoryId: this.classifyID,
                    operation: this.business == 1 ? 2 : 1
                }
                if(objData.categoryId == 0) delete objData.categoryId;
                //判断如果是登录的区域批发商的身份则加加上字段
                if(this.userBlock){
                    objData.wholesalerType=2
                    }else if(this.$store.state.userInfo&&this.$store.state.userInfo.userType==2){
                    objData.wholesalerType=1
                    }else{
                    objData.wholesalerType=0
                }
                axios.post(this.blockURL + '/admin/mobile/product/list',objData)
                .then((res)=>{
                    console.log('product/list==', res);
                    Indicator.close();
                    if(res.data.data != null && res.data.data.list.length > 0){
                        let list = res.data.data.list;
                        list.forEach(item => {
                            item.Name = item.name;
                            item.Price = item.price;
                            item.ProductImg = item.img;
                            item.Moq = item.minimumQuantity;
                            item.Code = item.id;
                            item.Unit = '件';
                        });
                        that.product = that.product.concat(list);
                        (that.page)++;
                        that.allLoaded = false;
                    }else{
                        that.allLoaded = true;
                        this.loading = true;
                        // that.spinner = false;
                        return false;
                    }
                    // this.clearZeroGoods();
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                    showToast('请求超时','center');
                    Indicator.close();
                });
            },
            loadMore() {
                this.getProduct();

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
            loadfn() {
                this.isLoading = true;
                this.page = 1;
                this.product = [];
                this.prodblur = false;
                this.getProduct();
            },
            linkTo(code) {
                var objData={strCode: code}
                //如果是区域批发商带分享的功能添加分享表示字段
                if(this.shareIstrue){
                    objData.seq=this.shareIstrue,
                        objData.share=true,
                        objData.wholesaler=this.wholesaler||this.shareIstrue
                }
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
            // 跳转到订货平台
            OrderState() {
                let fromApp = sessionStorage.getItem('app');
                if (fromApp) {
                    window.action.toDingHuo()
                } else {
                    let androidDownUrl = 'http://dh.520shq.com/dowAPK/shq_business_v1.0.0.apk';
                    let iosDownUrl = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1243425475';
                    this.configSystem()
                    if (this.system == 'android') {
                        this.checkAppExit(androidDownUrl);
                        window.location.href = 'order://order.app/openwith';
                    } else if (this.system == 'ios') {
                        // window.location.href='lovefenxiao://';
                        this.checkAppExit(iosDownUrl);
                        window.location.href = 'ordersys://';
                    } else if (this.system == 'wx') {
                        showToast('微信不支持，请使用第三方浏览器打开！', 'center')
                    }
                }
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
            // 检查是否填写自动分账信息
            checkUpload() {
                let btnText = '';
                let cancelBtn = true; //关闭按钮
                let closeModal = true; //点击是否可以关闭弹框
                let cancelText = "取消"
                // 单纯品牌商进入批发商只有入驻资金管理操作
                if (this.userType == "8") {
                    closeModal = false;
                    cancelText = "退出登录"
                }
                if (this.ApplyStatus == '' || this.ApplyStatus == null) {
                    btnText = '立即前往';
                    MessageBox({
                        title: "",
                        message: '为了保障您的资金权益，银行需要对您的交易帐户和身份等信息进行认证，请点击立即前往进行认证资料填写，感谢您的配合，谢谢！',
                        showCancelButton: true,
                        confirmButtonText: btnText,
                        cancelButtonText: cancelText,
                        closeOnClickModal: closeModal
                    }).then(action => {
                        if (action == 'confirm') {
                            this.$router.push({
                                path: '/wholesale/uploading',
                                query: {
                                    from: 'home'
                                }
                            });
                        } else {
                            if (this.userType == "8") {
                                this.loginOut();
                            }
                        }
                    })
                } else {
                    btnText = '查看进度';
                    // 单纯品牌商进入批发商只能看资金管理进度
                    if (this.userType == "8") {
                        MessageBox({
                            title: "",
                            message: '您的资金账户安全认证已提交，银行正在努力审核中。请查看审核进度，谢谢！',
                            showCancelButton: true,
                            confirmButtonText: btnText,
                            cancelButtonText: "退出登录",
                            closeOnClickModal: false
                        }).then(action => {
                            if (action == 'confirm') {
                                this.$router.push('/wholesale/uploadf');
                            } else {
                                if (this.userType == "8") {
                                    this.loginOut();
                                }
                            }
                        })
                        return;
                    }
                    // 批发商角色
                    if (this.ApplyStatus != '05') {
                        MessageBox({
                            title: "",
                            message: '您的资金账户安全认证已提交，银行正在努力审核中。请查看审核进度，谢谢！',
                            showCancelButton: true,
                            confirmButtonText: btnText,
                            closeOnClickModal: true
                        }).then(action => {
                            if (action == 'confirm') {
                                this.$router.push('/wholesale/uploadf');
                            }
                        })
                    }
                }
            },
            // 检查是否app存在
            checkAppExit(url) {
                var startTime = Date.now();
                var t = setTimeout(function () {
                    var endTime = Date.now();
                    //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
                    if ((endTime - startTime) < (800)) {
                        window.location.href = url
                    } else {
                        window.close();
                    }
                }, 600);
                window.onblur = function () {
                    clearTimeout(t);
                }
            },
            // 判断是否是微信浏览器
            isWeixinBrowser(ua) {
                return (/micromessenger/.test(ua)) ? true : false;
            },
        },
        // 判断返回页面不刷新
        beforeRouteLeave(to, from, next) {
            if (to.name == 'details') {
                from.meta.keepAlive = true;
            } else {
                from.meta.keepAlive = false;
            };
            next();
        },
    }

</script>

<style scoped>
    /* .test{
        width: 100%;
        height: 150px;
        background: -webkit-linear-gradient(left top,rgba(124, 22, 35, .8),rgb(95, 31, 69,.85));
    } */
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
    .share span{

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
        min-height: 100vh
    }

    /* header */
    .mint-header {
        /* background: -webkit-linear-gradient(left top,rgba(112, 37, 68,1),rgb(116, 38, 72,1)); */
        background: -webkit-linear-gradient(left top,rgba(124, 25, 38,1),rgb(112, 37, 80,1));

        height: auto;
        border-bottom: none;
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
        width: calc(100% - 1rem);
        margin-left: 0.5rem;
    }

    .searhed input {
        background: transparent;
        float: left;
        width: calc(100% - 0.5rem - 1em);
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
        /* background: rgba(96, 38, 84, 1); */
        background: -webkit-linear-gradient(left top,rgba(124, 25, 38,1),rgb(112, 37, 80,1));
        padding: 5px 10px;
        font-size: 0.62rem;
        line-height: 1.4em;
        overflow: hidden;
        position: relative;
    }

    .shopxx .column-img>>>.mint-swipe {
        height: calc(100vw*0.46) !important;
        max-height: 340px;
        border-radius: 10px;
    }
    .shopxx .column-img>>>.mint-swipe-item a{
        display: inline-block;
        height: 100%;
    }
    .shopxx .column-img>>>.mint-swipe-item img {
        width: 100%;
        object-fit: cover;
        height: 100%;
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
    .links{
        position: fixed;
        right: 0;
        width:2.3rem;
        height: 2.3rem;
        z-index: 1000;
        top: 63%;
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
        /* background: -webkit-linear-gradient(left top,rgba(110, 39, 76,1),rgb(96, 31, 69,1)); */
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
    .shopChange .el-col.active{
        color: #FF6023;
    }

    .shopbox {
        overflow: hidden;
        padding: 0 10px;
        margin-top: 0.5rem;
        height: auto;
        overflow-y: auto;
    }

    .shopmain {
        overflow: hidden;
        width: calc(100% + 0.5rem);
    }

    .shoplist {
        float: left;
        width: calc(50% - 0.5rem);
        margin: 0 0.5rem 0.5rem 0;
        background: white;
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
        font-size: 0.7rem;
        margin-top: 5px;
    }

    .shoplist .shoptext .shopdeal .money i {
        color: white;
        font-size: 0.7rem;
        background: #df2211;
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

    .btn-box span:last-child {
        color: #f00;
        border-left: 1px solid #ddd;
    }

</style>
