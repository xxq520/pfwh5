<template>
    <div class="special-price">
        <!-- 导航 -->
        <mt-header fixed title="价格设置" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
            <div class="select-all" slot="right" @click="showSelectBtn">
                {{ showSelect ? '取消' :  '批量设置'}}
            </div>
        </mt-header>
        <!-- 搜索 -->
        <div class="search-box">
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input type="search" v-model="userNameOrPhone" @keyup.13="onSearch" placeholder='请输入用户名或者手机号'>
                    <img :src="require('../../assets/images/block/icon-btn-search.png')" alt="" class="search-btn" @click="onSearch">
                </div>
            </h1>
        </div>
        <!-- 商品 -->
        <div class="goods" v-if="detail.standardList">
            <img :src="detail.img" alt="">
            <div class="r">
                <p class="r-1">{{ detail.name }}</p>
                <p class="r-2">
                    <i v-for="(item, idx) in detail.standardList" :key="idx" :class="{'standard-act': idx == detail.standardAct}" @click="selectStandard(idx)">{{item.name}}</i>
                </p>
                <p class="r-3">
                    销售价￥
                    <i>{{ detail.standardList[detail.standardAct].salePrice }}</i>
                    <span>{{ detail.typeValue }}</span>
                </p>
            </div>
        </div>
        <!-- 下游列表 -->
        <div class="list-box">
            <div class="list"
                v-infinite-scroll="loadMore" 
                infinite-scroll-disabled="loading" 
                infinite-scroll-distance="30" 
                infinite-scroll-immediate-check="false"
                infinite-scroll-throttle-delay="500">
                <div class="l-item" v-for="(item, idx) in listData" :key="idx">
                    <div v-if="showSelect" class="select-box">
                        <img v-show="!item.select" :src="require('../../assets/images/block/pf_payment_icon_checkbox_n.png')" alt="" class="select" @click="onSelect(item)">
                        <img v-show="item.select" :src="require('../../assets/images/block/pf_payment_icon_checkbox_s.png')" alt="" class="select" @click="onSelect(item)">
                    </div>
                    <img class="l" v-if="item.headImg" :src="item.headImg" alt="">
                    <div class="m">
                        <p class="m-1">{{ item.downNickName || '匿名'}}</p>
                        <p class="m-2">{{ item.downUserName }}</p>
                    </div>
                    <div class="r">
                        <span>销售价：</span>
                        <i @click="setPrice(item, idx)">{{ item.salePrice }}</i>
                    </div>
                </div>
            </div>
            <img v-show="!listData.length" class="no-data" :src="require('../../assets/images/img_zw.png')" alt="">
        </div>

        <!-- 底部操作 -->
        <div class="bot" v-if="showSelect">
            <div class="l" @click="onSelectAll">
                <img v-show="!allData.selectAll" :src="require('../../assets/images/block/pf_payment_icon_checkbox_n.png')" alt="" class="select">
                <img v-show="allData.selectAll" :src="require('../../assets/images/block/pf_payment_icon_checkbox_s.png')" alt="" class="select">
                <i>全选</i>
            </div>
            <div class="m">
                合计:
                <i>{{ allData.selectNum }}</i>
                个
            </div>
            <div class="r" @click="showModel">
                设置价格
            </div>
        </div>
        <!-- 设置价格弹窗 -->
        <mt-popup
            v-model="isShow"
            >
            <div class="content" :class="{'cont-act': isShowTip}">
                <p class="title">设置销售价</p>
                <input type="text" v-model="price">
                <p class="tip" v-if="detail.standardList && isShowTip">{{ '销售价应该在：' +  detail.standardList[detail.standardAct].salePriceFrom + '~' + detail.standardList[detail.standardAct].salePriceTo + '区间'}}</p>
                <div class="btns">
                    <span @click="isShow = !isShow">取消</span>
                    <span @click="onSave">确定</span>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userId: this.$store.state.userInfo.userId,
            productId: this.$route.query.id,
            userNameOrPhone: '',
            detail: {
                standardAct: 0
            },
            listData: [],
            allData: {
                selectAll: false,
                selectNum: 0,
                allNumber: 0,
                total: 0
            },
            showSelect: false,
            isShow: false,
            isShowTip: false,
            loading: false,
            pageNum: 1,
            pageSize: 15,
            signleIdx: null,
            price: ''
        }
    },
    created() {
        this.queryDetail();
    },
    mounted() {
        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff";
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        loadMore() {
            this.queryList();
        },
        // 查询商品详情
        queryDetail() {
            Indicator.open();
            let params = {
                productId: this.productId,
                userId: this.userId
            }
            axios.post(this.blockURL+'/qypfs-product/admin/mobile/product/getProductAndSalePrice', params).then(res => {
                Indicator.close();
                if(res.data.code == 200) {
                    let data = res.data.data;
                    data.standardAct = 0;
                    this.detail = data;
                    this.queryList();
                } else {
                    Toast(res.data.message || '系统错误')
                }
            }).catch(error =>{
                Indicator.close();
            })
        },
        // 查询列表
        queryList() {
            this.loading = true;
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                skuId: this.detail.standardList[this.detail.standardAct].skuId,
                storeUserId: this.userId,
                userNameOrPhone: this.userNameOrPhone
            }
            axios.post(this.blockURL+'/qypfs-product/admin/mobile/product/getDownstreamProductPriceList', params).then(res => {
                if(res.data.code == 200) {
                    let data = res.data.data;
                    data.list.forEach((item, idx) => {
                        item.select = false;
                    });
                    this.listData = this.listData.concat(data.list);
                    this.allData.total = data.total;
                    this.allData.allNumber = this.listData.length;

                    if (this.listData.length < data.total) {
                        this.loading = false;
                        this.pageNum += 1;
                    }
                } else {
                    Toast(res.data.message || '系统错误')
                }
            })
        },
        // 更新下游价格
        onSave() {
            let price = Number(this.price);
            console.log('设置价格===', price);
            if ( this.detail.type == 1) { // type == 1为520专供，限定价格区间
                let salePriceFrom = Number(this.detail.standardList[this.detail.standardAct].salePriceFrom);
                let salePriceTo = Number(this.detail.standardList[this.detail.standardAct].salePriceTo);
                if (price < salePriceFrom || price > salePriceTo) return this.isShowTip = true;
            }
            Indicator.open();
            let params = {
                skuId: this.detail.standardList[this.detail.standardAct].skuId,
                wholesalerId: this.userId
            }
            let downstreamPriceList = [];
            this.listData.forEach((item,idx) => {
                if (item.select) {
                    let curItem = {
                        downstreamId: item.downswimId,
                        price: price
                    }
                    downstreamPriceList.push(curItem)
                }
            });
            params.downstreamPriceList = downstreamPriceList;
            axios.post(this.blockURL+'/qypfs-product/admin/mobile/product/updateDownstreamPrice', params).then(res => {
                Indicator.close();
                if(res.data.code == 200) {
                    this.isShow = !this.isShow;
                    Toast(res.data.message || '操作成功');
                    setTimeout(() =>{
                        this.$router.go(0);
                    }, 1200)
                } else {
                    Toast(res.data.message || '系统错误');
                }
            }).catch(error =>{
                Indicator.close();
            })
        },
        // 单个设置-显示设置价格弹窗
        setPrice(item, idx) {
            if (this.showSelect) return;
            this.price = item.salePrice;
            this.isShow = !this.isShow;
            item.select = true;
            this.signleIdx = idx;
            console.log(this.listData);
        },
        // 批量设置-显示设置价格弹窗
        showModel() {
            if (this.allData.selectNum == 0) return;
            this.price = this.detail.standardList[this.detail.standardAct].salePrice;
            this.isShow = !this.isShow;
        },
        // 显示设置多个价格的选框
        showSelectBtn() {
            if (this.signleIdx != null) {
                this.listData[this.signleIdx].select = false;
                this.signleIdx = null;
            }
            this.showSelect = !this.showSelect;
        },
        // 选择规格
        selectStandard(idx) {
            this.detail.standardAct = idx;
            this.initParams();
            this.queryList();
        },
        // 单选
        onSelect(item) {
            if (item.select) {
                this.allData.selectNum--;
            } else {
                this.allData.selectNum++;
            }
            item.select = !item.select;

            this.allData.selectAll = this.allData.selectNum == this.allData.allNumber ? true : false;
        },
        // 全选
        onSelectAll() {
            let select = this.allData.selectNum == this.allData.allNumber ? false : true;
            this.listData.forEach((item, idx) => {
                item.select = select;
            });

            if (this.allData.selectAll) {
                this.allData.selectNum = 0;
            } else {
                this.allData.selectNum = this.allData.allNumber;
            }

            this.allData.selectAll = !this.allData.selectAll;
        },
        // 搜索
        onSearch() {
            this.initParams();
            this.queryList();
            console.log('搜索', this.userNameOrPhone);
        },
        // 初始化参数
        initParams() {
            this.listData = [];
            this.pageNum = 1;
            this.loading = false;
            this.allData = {
                selectAll: false,
                selectNum: 0,
                allNumber: 0,
                total: 0
            }
        }
    }
}
</script>

<style scoped>
    .special-price{
        padding-top: 1.834rem;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .no-data{
        display: block;
        margin: 10% auto 0 auto;
        width: 54%;
    }
    .select-all{
        font-size: .55rem;
        font-family: PingFang SC;
        font-weight: 500;
        color:rgba(255,255,255,1);
        padding: .3rem 0.25rem .3rem 0;
    }
    .search-box {
        width: 100%;
        background: #f5f5f5;
        height: 2.21rem;
        /* margin-top: 1.834rem; */
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

    .goods{
        width: 100%;
        display: flex;
        align-items: center;
        padding: .55rem;
        background: #fff;
    }
    .goods img{
        width: 3.75rem;
        max-height: 3.75rem;
        object-fit: cover;
    }
    .goods .r{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: .65rem;
    }
    .goods .r .r-1{
        font-size: .625rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51,51,51,1);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding-bottom: .1rem;
    }
    .goods .r .r-2{
        font-size: .5rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101,101,101,1);
        display: flex;
        flex-wrap: wrap;
    }
    .goods .r .r-2 i{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: .48rem;
        padding: 2px .333rem;
        height: .666rem;
        background:rgba(235,235,235,1);
        border-radius: .333rem;
        margin-top: .25rem;
    }
    .goods .r .r-2 i.standard-act{
        background: #FFE2D7;
        color: #FF6023;
    }

    .goods .r .r-3{
        display: flex;
        align-items: center;
        font-size: .5rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255,95,35,1);
        margin-top: .34rem;
    }
    .goods .r .r-3 i{
        font-size: .625rem;
    }
    .goods .r .r-3 span{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 .3rem;
        font-size: .42rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        background:rgba(255,96,36,1);
        border-radius: .32rem;
        margin-left: .625rem;
    }

    .list-box{
        width: 100%;
        flex: 1;
        overflow-y: auto;
        margin-top: .42rem;
        background: #fff;
    }
    .list{
        display: flex;
        flex-direction: column;
    }
    .list .l-item{
        display: flex;
        align-items: center;
        padding: .42rem .5rem;
        border-bottom: 1px solid #E4E4E4;
    }
    .list .l-item:last-child{
        border: 0 none;
    }
    .list .l-item .select-box .select{
        margin-right: .6rem;
    }
    .list .l-item .select{
        width: .625rem;
        height: .625rem;
    }
    .list .l-item .l{
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 1.15rem;
    }
    .list .l-item .m{
        /* width: 50%; */
        flex: 2;
        height: 2.3rem;
        padding-left: .31rem;
    }
    .list .l-item .m-1{
        font-size: .625rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51,51,51,1);
        margin-top: .18rem;
    }
    .list .l-item .m-2{
        font-size: .542rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101,101,101,1);
        margin-top: .08rem;
    }
    .list .l-item .r{
        /* flex: 2; */
        width: 34%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list .l-item .r span{
        font-size: 0.542rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51,51,51,1);
    }
    .list .l-item .r i{
        padding: .08rem .38rem;
        background:rgba(219,219,219,1);
        font-size: 0.542rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51,51,51,1);
    }

    .bot{
        width: 100%;
        display: flex;
        align-items: center;
        background:rgba(255,255,255,1);
        height: 1.875rem;
        position: fixed;
        bottom: 0;
    }
    .bot .l{
        width: 3rem;
        margin-left: .5rem;
        display: flex;
        align-items: center;
    }
    .bot .l img{
        width: .834rem;
        height: .834rem;
    }
    .bot .l i{
        font-size: .625rem;
        font-family: PingFang SC;
        font-weight :400;
        color: rgba(51,51,51,1);
        margin-left: .3rem;
    }
    .bot .m{
        flex: 2;
        text-align: center;

        font-size: .625rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51,51,51,1);
    }
    .bot .m i{

    }
    .bot .r{
        width: 3.9rem;
        height: 100%;
        background:rgba(255,96,35,1);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .625rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
    }

    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10.44rem;
        height: 6.25rem;
        background:rgba(255,255,255,1);
        border-radius: .2rem;
        position: relative;
    }
    .content.cont-act{ 
        height: 7rem;
    }
    .content .title{
        font-size: .75rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51,51,51,1);
        line-height: 1rem;
        margin-top: .78rem;
        margin-bottom: .37rem;
    }
    .content input{
        width: 76%;
        height: 1.5rem;
        border: 1px solid rgba(153,153,153,1);
        border-radius:4px;
        padding-left: .3rem;
        text-align: center;
    }
    .content .tip{
        color: red;
        font-size: .5rem;
        font-family: PingFang SC;
        margin-top: .3rem;
    }
    .content .btns{
        width: 100%;
        height: 2.04rem;
        position: absolute;
        bottom: 0;
        display: flex;
        border-top: 1px solid #E5E5E5;
    }
    .content .btns span{
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #E5E5E5;
        width: 50%;
        font-size: .625rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51,51,51,1);
    }
    .content .btns span:last-child{
        border: 0 none;
        color: #FF5F23;
    }

</style>