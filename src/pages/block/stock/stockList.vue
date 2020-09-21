<template>
    <div class="stock-list">
        <!-- 导航 -->
        <mt-header fixed title="库存报表" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div>
            <ul class="time-range">
                <li v-for="(item, idx) in timeArr" :key="idx" :class="{'time-act': idx == timeIdx}" @click="onSelectTime(idx)">
                    <i>{{ item.label }}</i>
                </li>
            </ul>
        </div>
        <!-- 总收益统计 -->
        <ul class="price-all">
            <li>
                <p>销售总额(元)</p>
                <span>{{ salesData.salesPrice  || 0 }}</span>
            </li>
            <li>
                <p>销售数量(笔)</p>
                <span>{{ salesData.salesOrder || 0 }}</span>
            </li>
        </ul>
        <!-- 列表 -->
        <div>
            <div class="list">
                <div class="t">
                    <span></span>
                    <i>商品库存情况</i>
                </div>
                <div class="swipper">
                    <ul class="m">
                        <li v-for="(item, idx) in categoryList" :key="idx" :class="{'m-act': idx == categoryIdx}" @click="onCategoryIdx(idx)">
                            <i>{{ item.categoryName }}</i>
                        </li>
                    </ul>
                </div>

                <ul class="b"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="30"
                    infinite-scroll-throttle-delay="500">
                    <li v-for="(item, idx) in stockList" :key="idx">
                        <div class="l c">
                            <p>当前库存</p>
                            <i>{{ item.stock || 0 }}</i>
                        </div>
                        <div class="r c">
                            <p>{{ item.name }}</p>
                            <i>{{ item.standard }}
                                <!-- <span>{{ item.code }}</span>  -->
                            </i>
                            <span>已进货/已售出: <span>{{ item.purchaseStock }}/{{ item.salesStock }}</span> </span>
                        </div>
                    </li>
                </ul>

                <img v-show="!stockList.length" class="no-data" :src="require('../../../assets/images/img_zw.png')" alt="">
            </div>
        </div>
        <!-- 日期选择器 -->
        <mt-popup
            class="pop-box"
            v-model="popupVisible"
            :modal="false"
            position="bottom">
            <ul class="t">
                <li @click="popupVisible = false">取消</li>
                <li @click="confirm">确定</li>
            </ul>

            <p class="p-title">开始时间</p>
            <mt-datetime-picker
                class="picker-1"
                ref="picker1"
                type="date"
                :end-date="new Date()"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                v-model="selectDate1">
            </mt-datetime-picker>

            <p class="p-title">结束时间</p>
            <mt-datetime-picker
                class="picker-2"
                ref="picker2"
                type="date"
                :end-date="new Date()"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                v-model="selectDate2">
            </mt-datetime-picker>
        </mt-popup>

    </div>
</template>
<script>
let dateObj = new Date();
let timeArr = [
    {
        label: '今天',
        gtTime: new Date().Format("yyyy-MM-dd"),
        ltTime: new Date().Format("yyyy-MM-dd")
    },{
        label: '本周',
        gtTime: dateObj.getTimeFn().getWeekStartDate(),
        ltTime: new Date().Format("yyyy-MM-dd")
    },{
        label: '本月',
        gtTime: dateObj.getTimeFn().getMonthStartDate(),
        ltTime: new Date().Format("yyyy-MM-dd")
    },{
        label: '其他',
        gtTime: new Date().Format("yyyy-MM-dd"),
        ltTime: new Date().Format("yyyy-MM-dd")
    },
]
export default {
    data() {
        return {
            userInfo:this.$store.state.userInfo,
            salesData: '',
            stockData: '',
            stockList: [],
            pageIndex: 0,
            pageSize: 10,

            timeArr: timeArr,
            timeIdx: 0,
            categoryList: [{
                categoryId: 0,
                categoryName:"全部"
            }],
            categoryIdx: 0,
            selectDate1: new Date(),
            selectDate2: new Date(),
            popupVisible: false,
            loading: false
        }
    },
    created() {

    },
    mounted() {
        let token = this.$route.query.token;
        if (token) {
            sessionStorage.setItem("bearer", token);
            this.queryCategoryList();
            this.querySales();
        } else {
            this.queryCategoryList();
            this.querySales();
        }

        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff";
    },
    methods: {
        back() {
            try {
                window.action.app_back();
            } catch (err) {
                this.$router.go(-1);
            }
        },
        confirm() {
            let  selectDate1 = this.selectDate1.Format("yyyyMMdd");
            let  selectDate2 = this.selectDate2.Format("yyyyMMdd");
            if (Number(selectDate2) < Number(selectDate1))  return Toast('开始时间不能大于结束时间')
            this.categoryIdx = 0;
            this.loadInit();
            this.querySales();
            this.loadMore();
            this.popupVisible = false;
        },
        querySales() {
            Indicator.open();
            let params = {
                gtTime: this.timeArr[this.timeIdx].gtTime,
                ltTime: this.timeArr[this.timeIdx].ltTime
            }
            if (this.timeIdx == 3) {
                params.gtTime = this.selectDate1.Format("yyyy-MM-dd");
                params.ltTime = this.selectDate2.Format('yyyy-MM-dd');
            }

            axios.get(this.blockURL + '/qypfs-order/sales',{ params: params }).then(res =>{
                console.log('sales', res);
                if (res.data.code == 200 && res.data.data) {
                    this.salesData = res.data.data;
                } else {
                    Toast(res.data.message)
                }
                Indicator.close();
            })
        },
        queryCategoryList() {
            Indicator.open();
            let storeId = [5,6].indexOf(Number(this.userInfo.Blocktype)) != -1 ? this.$store.state.storeId : 0;
            let params={
                level: 1,
                parentId: 0,
                userId: storeId
            }
            axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList',params).then(res =>{
                if (res.data.code == 200) {
                    this.categoryList = [...this.categoryList, ...res.data.data.categoryList];
                } else {
                    Toast(res.data.message)
                }
                Indicator.close();
            })
        },
        loadInit() {
            this.pageIndex = 0;
            this.loading = false;
            this.stockData = '';
            this.stockList = [];
        },
        loadMore() {
            this.pageIndex += 1;
            this.queryStock();
        },
        queryStock() {
            // if (this.pageIndex > this.stockData.totalPage) return;
            this.loading = true;
            Indicator.open();
            let params = {
                categoryId: this.categoryList[this.categoryIdx].categoryId,
                gtTime: this.timeArr[this.timeIdx].gtTime,
                ltTime: this.timeArr[this.timeIdx].ltTime,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            if (this.timeIdx == 3) {
                params.gtTime = this.selectDate1.Format("yyyy-MM-dd");
                params.ltTime = this.selectDate2.Format('yyyy-MM-dd');
            }
            axios.post(this.blockURL + '/qypfs-order/stock',params).then(res =>{
                console.log('stock', res);
                if (res.data.code == 200) {
                    let data =  res.data.data;
                    this.stockData = data;
                    this.stockList = this.stockList.concat(data.list);
                    if (this.pageIndex >= this.stockData.totalPage || data.list.length < 1) {
                        this.loading = true;
                    } else {
                        this.loading = false;
                    }
                } else {
                    Toast(res.data.message)
                }
                Indicator.close();
            })
        },
        onSelectTime(idx) {
            this.timeIdx = idx;
            if (idx == 3) {
                this.popupVisible = true;
                this.$refs.picker1.open();
                this.$refs.picker2.open();
            } else {
                this.categoryIdx = 0;
                this.loadInit();
                this.querySales();
                this.loadMore();
            }
        },
        onCategoryIdx(idx) {
            this.categoryIdx = idx;
            this.loadInit();
            this.loadMore();

        }
    }
}
</script>
<style scoped>
    .swipper{
        width: 100%;
    }
    .swipper>ul.m{
        width: auto;
        overflow-x: scroll;
    }
    .stock-list{
        padding-top:44px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        height: 100vh;
    }
    .pop-box{
        z-index: 100 !important;
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background: rgba(0, 0, 0, 0.5) !important;
    }
    .pop-box .t{
        padding: 0 .92rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        height: 1.83rem;
        border-bottom: 1px solid #EEEEEE;
    }
    .pop-box .t li{
        font-size: .667rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
    }
    .pop-box .t li:last-child{
        color: #FF6024;
    }
    .pop-box .p-title{
        padding: .3rem 0;
        background: #fff;
        text-align: center;
        font-size:.5rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
    }
    .pop-box /deep/ .v-modal{
        display: none !important;
    }
    .pop-box /deep/ .mint-datetime .picker-toolbar{
        display: none;
    }
    .pop-box .picker-1{
        z-index: 2005 !important;
        position: relative !important;
    }
    .pop-box .picker-2{
        position: relative !important;
    }
    .stock-list >ul, .stock-list >div{
        background: #fff;

    }
    .time-range{
        display: flex;
        align-items: center;
    }
    .time-range li{
        height: 1.84rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        font-size:.584rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
    }
    .time-range li.time-act i{
        color: #FF6024;
        border-bottom: 1.5px solid #FF6024;
    }
    .time-range li i{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 .46rem;
    }

    .price-all{
        display: flex;
        align-items: center;
        flex: 0 0 2.5rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 .55rem;
        margin: .417rem 0;
    }
    .price-all li{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .price-all li p{
        font-size: .542rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
    }
    .price-all li span{
        font-size:.667rem;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(52,52,52,1);
        margin-top: .16rem;
    }

    .list{
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
    }
    .list .no-data{
        width: 50%;
        margin: 2.6rem 0;
    }
    .list .t{
        width: 100%;
        height: 1.5rem;
        display: flex;
        align-items: center;
    }
    .list .t span{
        display: inline-block;
        width: .125rem;
        height: .74rem;
        background:rgba(255,96,36,1);
        margin-left: .5rem;
        margin-right: .42rem;
    }
    .list .t i{
        font-size: .584rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(52,52,52,1);
    }
    .list .m{
        width: 100%;
        border-top: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;
        display: -webkit-box;
        display: -ms-flexbox;
        -webkit-box-align: center;
        -ms-flex-align: center;
        padding-left: .31rem;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        overflow-x: hidden;
        overflow-y: auto;
    }
    .list .m::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    .list .m li{
        height: 1.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:.584rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        padding: 0 .42rem;
    }
    .list .m li.m-act i{
        color: #FF6024;
        border-bottom: 1.5px solid #FF6024;
    }
    .list .m li i{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 .15rem;
    }
    .list .b{
        padding: 0 .25rem;
        width: 100%;
    }
    .list .b li{
        display: flex;
        padding: .417rem 0;
        border-bottom: 1px solid #E5E5E5;
    }
    .list .b li .c{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .list .b li .l{
        width: 23%;
        border-right: 1px solid #E5E5E5;

    }
    .list .b li .l p{
        font-size:.5rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
    }
    .list .b li .l i{
        font-size: .584rem;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(255,96,36,1);
    }

    .list .b li .r{
        width: 76%;
        align-items: flex-start;
        padding-left: .459rem;
    }
    .list .b li .r p{
        font-size: .542rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(52,52,52,1);
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
    }
    .list .b li .r i{
        font-size:.5rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .list .b li .r i span{
        padding-left: .35rem;
    }
    .list .b li .r >span{
        font-size:.5rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .list .b li .r >span span{
        font-weight:500;
        color:rgba(255,96,36,1);
    }
</style>
