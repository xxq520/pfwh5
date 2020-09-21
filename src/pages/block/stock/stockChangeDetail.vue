<template>
    <div class="stock-change-detail">
        <!-- 导航 -->
        <mt-header fixed title="进销存报表明细" ref="header">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>

        <div class="list">
            <!-- v-infinite-scroll="queryMarketdetail"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="30"
            infinite-scroll-throttle-delay="500"> -->
            <div class="l">
                <li class="li-h" :style="{width: list[0].w || '95px'}">{{ list[0].label }}</li>
                <li v-for="(item, idx) in collectList" :key="idx" :style="{width: list[0].w || '95px'}">{{ item[list[0].key] }}</li>
            </div>
            <div class="r" :style="{left: list[0].w || '95px'}">
                 <div class="scroll-box">
                    <template v-for="(item, index) in list">
                        <li class="li-h" v-if="index > 0" :key="'h' + index" :style="{flexBasis: item.w || '95px'}">{{ item.label }}</li>
                    </template>
                </div>

                <div class="scroll-box" v-for="(item, idx) in collectList" :key="'b' + idx">
                    <template v-for="(obj, idx) in list">
                        <li v-if="idx > 0" :key="idx" :style="{flexBasis: obj.w || '95px'}">{{ item[obj.key] }}</li>
                    </template>
                </div>
            </div>
            
            <img v-show="!collectList.length" class="no-data" :src="require('../../../assets/images/img_zw.png')" alt="">
        </div>
    </div>
</template>

<script>
let list = [
    {
        label: '日期',
        key: 'createTime',
        w: '160px'
    },
    {
        label: '商品名称',
        key: 'goodName',
        w: '200px'
    },
    {
        label: '库存数量',
        key: 'repertoryCount'
    },
    {
        label: '库存单价',
        key: 'repertoryUnitprice'
    },
    {
        label: '库存合计金额',
        key: 'repertorySumMonery'
    },
    {
        label: '购进数量',
        key: 'buyCount'
    },
    {
        label: '购进单价',
        key: 'buyUnitprice'
    },
    {
        label: '购进合计金额',
        key: 'buySumMonery'
    },
    {
        label: '销出数量',
        key: 'sellCount'
    },
    {
        label: '销出单价',
        key: 'sellUnitprice'
    },
    {
        label: '销出合计金额',
        key: 'sellSumMonery'
    },
    {
        label: '期末结余数量',
        key: 'residueCount'
    },
    {
        label: '期末结余单价',
        key: 'residueUnitprice'
    },
    {
        label: '期末合计金额',
        key: 'residueSumMonery'
    }
]
export default {
    data() {
        return {
            list: list,
            collectList: [],
            top: 0,
            left: 0,
            page: 1,
            pageSize: 30,
            scrollLeft: 0,
            loading: false,
            query: {}
        }
    },
    created() {
  
    },
    mounted() {
        this.query = this.$route.query;

        this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
        this.$refs.header.$el.style.color = "#fff";

        this.queryMarketdetail();
        document.addEventListener('scroll', this.onScroll, true);
    },
    beforeDestroy() {
        document.removeEventListener('scroll', this.onScroll, true);
    },
    watch: {
        
    },
    methods: {
        back() {
            try {
                window.action.app_back();
            } catch (err) {
                this.$router.go(-1);
            }
        },
        onScroll($event) {
            if (this.loading) return false; // loading繁忙
            if (!$event.target.scrollingElement) return false;

            let scrollHeight = $event.target.scrollingElement.scrollHeight;
            let offsetHeight = $event.target.scrollingElement.offsetHeight;
            let scrollTop = $event.target.scrollingElement.scrollTop;
            if (scrollHeight - offsetHeight - scrollTop < 45) {
                // console.log(scrollHeight - offsetHeight - scrollTop);
                this.queryMarketdetail()
            }
        },
        queryMarketdetail() {
            this.loading = true;
            Indicator.open();
            let params={
                beginDate: '',
                code: this.query.code,
                endDate: '',
                page: this.page,
                pageSize: this.pageSize,
	            sku: this.query.sku
            }
            axios.post(this.blockURL + '/qypfs-product/marketdetail/findList',params).then(res =>{
                console.log(res, '===findCollectList');
                if (res.data.code == 200) {
                    let data = res.data.data;
                    this.collectList = this.collectList.concat(data.list);

                    if (this.page < data.totalPage) {
                        this.page += 1;
                        this.loading = false;
                    }
                } else {
                    Toast(res.data.message)
                }
                Indicator.close();
            })
        }
    }
}
</script>

<style scoped>
    .stock-change-detail {
        width: 100%;
        height: 100vh;
        background: #f5f5f5;
    }

    .stock-change-detail .list {
        width: 100%;
        height: 100%;
        padding-top: 44px;
        width: 100%;
        display: flex;
        overflow-y: scroll;
    }

    .stock-change-detail .list .scroll-box{
        display: flex;
        margin-bottom: .3rem;
    }

    .stock-change-detail .list .li-h{
        /* word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; */
        padding: 0 10px;
        width: 100px;
        overflow: hidden;
        overflow-x: scroll;
        box-sizing: border-box;
    }

    .stock-change-detail .list li {
        display: inline-block;
        text-align: center;
        font-size: .58rem;
        padding: 0 10px;
        height: 43px;
        line-height: 43px;
        width: 120px;
        white-space:nowrap;
        /* overflow: hidden; */
        /* text-overflow: ellipsis; */
        background: #fff;
        overflow-x: scroll;

    }

    .stock-change-detail .list .l li {
        margin-bottom: .3rem;
        flex: 0 0 43px;
    }

    .stock-change-detail .list .r li {
        flex: 0 0 80px;
    }

    .l, .r{
        display: flex;
        flex-direction: column;
    }

    .l{
        position: absolute;
        left: 0;
    }

    .r{
        position: absolute;
        right: 0;
        overflow-y: hidden;
        overflow-x: scroll;
    }

    .li-h{
        background: #fff;
        font-size: .7rem;
    }

    .no-data{
        width: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
    }
</style>