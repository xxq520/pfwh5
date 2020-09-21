<template>
    <div class="commission-con">
        <mt-header :title="title">
            <mt-button icon='back' slot='left' @click="goback"></mt-button>
        </mt-header>
        <div class="condition-wrap"> 
            <condition :type="type"></condition>
        </div>
        <div class="nav">
            <ul>
                <li v-for="(item, index) in navList" :key="index" @click="navClick(index)" :class="{act: navIndex == index}"><span>{{item}}</span></li>
            </ul>
        </div>
        <div 
            class="list-con" 
            :style="{height:tabBoxHeight+'px'}"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="3"
        >
            <div v-for="(list, index) in 4" :key="index" v-show="navIndex == index">
                <ul>
                    <li v-for="(item, i) in 20" :key="i" v-if="type == 1" @click="linkToDetail">
                        <div class="info">
                            <p>入驻类型：<em>年费1080元</em>{{index}}</p>
                            <span>温尚文</span>
                        </div>
                        <div class="price">
                            <div class="price-info">
                                <p>返佣金额：<em>¥65.62</em></p>
                                <span>2018-12-03</span>
                            </div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                    <li v-for="(item, i) in 7" v-if="type == 2">
                        <div class="info">
                            <p>微微微微微微微微果仁核桃露{{index}}</p>
                            <span>温尚文</span>
                        </div>
                        <div class="price">
                            <div class="price-info">
                                <p><em>¥65.62</em></p>
                                <span>2018-12-03</span>
                            </div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                    <li v-for="(item, i) in 3" v-if="type == 3 || type == 4">
                        <div class="info">
                            <p>收入{{index}}</p>
                            <span>正常</span>
                        </div>
                        <div class="price">
                            <div class="price-info">
                                <p><em>¥65.62</em></p>
                                <span>2018-12-03 14:45:23</span>
                            </div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                </ul>
                <ul v-if="type == 3 || type == 4">
                    <li v-for="(item, i) in 3">
                        <div class="info">
                            <p>转余额{{index}}</p>
                            <span>正常</span>
                        </div>
                        <div class="price">
                            <div class="price-info">
                                <p><em>¥65.62</em></p>
                                <span>2018-12-03 14:45:23</span>
                            </div>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import Condition from './condition'
import {showToast} from '@/assets/js/common.js'
import { Indicator} from 'mint-ui';

export default {
    data () {
        return {
            seq:'',
            navIndex: 0,
            type: this.$route.query.type,
            tabBoxHeight:0,
        }
    },
    created(){
        this.navList = ['全部', '近七天', '近一个月', '近三个月'];
        this.getSeq();
    },
    computed: {
        title() {
            return this.type == 1 ? '推荐批发商一次性奖励' :  '代理商返佣报表' ;
        }
    },
    mounted(){
        this.getHeight();
        this.getProfitData();
        Indicator.open();
    },
    methods:{
        // 返回上一级
        goback() {
            this.$router.go(-1);
        },
        // 获取用户seq
        getSeq(){
            let seq = sessionStorage.getItem('seq');
            if(seq){
                this.seq = seq;
            }
        },
        // 获取批发商收益账户信息
        getProfitData(){
            axios.get(this.URL + '/Earnings/GetUserAccountInfo',{params:{userSeq:this.seq}})
            .then( res => {
                let datas = res.data;
                Indicator.close();
                if(datas.code == '200'){
                    this.amount = datas.data.Amount.toFixed(2);
                }else if(datas.code == '201'){
                    this.amount = 0;
                    showToast("无此账户信息");
                }
            })
            .catch(err => {
                Indicator.close();
            })
        },
        // 导航栏点击
        navClick(index) {
            this.navIndex = index;
        },
        // 跳转详情页
        linkToDetail() {
            this.$router.push({
                name: 'commissionDetail',
                query: {
                    type: 1
                }
            })
        },
        // 获取tab内容的高度
        getHeight(){
            let height = sessionStorage.getItem("contentHeight");
            
            if(height){
                this.tabBoxHeight = height;
            }else {
                this.height();
            }
        },
        // 获取tab内容的高度
        height(){
            if(this.$route.query.seq == undefined || this.$route.query.seq == null) {
                this.tabBoxHeight = document.documentElement.clientHeight
                -101
                -document.querySelector('.nav').clientHeight;
                sessionStorage.setItem("contentHeight", this.tabBoxHeight);
            }else {
                this.tabBoxHeight = document.documentElement.clientHeight
                -document.querySelector('.mint-header').clientHeight
                -document.querySelector('.condition-wrap').clientHeight
                -document.querySelector('.nav').clientHeight;
            }
            console.log(this.tabBoxHeight)
        },
        loadMore() {

        }
    },
    components: {
        Condition
    }
}
</script>

<style scoped>
    .commission-con {
        padding-bottom: 1.1111rem /* 50/45 */;
    }
    .commission-con .mint-header {
        background: #ef4628;
        color: #fff;
    }
    .nav ul {
        display: flex;
        margin: 0 .3333rem /* 15/45 */ 1px;
    }
    .nav li {
        flex: 1;
        font-size: .6222rem /* 28/45 */;
        text-align: center;
    }
    .nav li span {
        border-bottom: 3px solid #f5f5f5;
        box-sizing: border-box;
        display: inline-block;
        padding: .3333rem /* 15/45 */ .2222rem /* 10/45 */;
    }
    .nav li.act {
        background: #fff;
        border-top-left-radius: .2222rem /* 10/45 */;
        border-top-right-radius: .2222rem /* 10/45 */;
        color: #ef4628;
    }
    .nav li.act span {
        border-bottom: 3px solid #ef4628;
    }
    .list-con {
        margin: 0 .3333rem /* 10/45 */;
        
    }
    .list-con > div {
        border-radius: .2222rem /* 10/45 */;
        overflow: hidden;
    }
    .list-con ul{
        padding-left: .3333rem /* 15/45 */;
        background: #fff;
        border-radius: .2222rem /* 10/45 */;
        margin-bottom: .4444rem /* 20/45 */;
    }
    .list-con ul:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    .list-con ul li{
        padding: .4444rem /* 20/45 */ 0;
        font-size: .6222rem /* 28/45 */;
        padding-right: .3333rem;
        border-bottom: 1px solid #000;
    }
    .list-con ul li:nth-last-of-type(1) {
        border-bottom: 0;
    }
    .list-con li p{
        margin-bottom: .3333rem;
    }
    .list-con li > * {
        display: inline-block;
        vertical-align: middle;
    }
    .list-con li .price {
        float: right;
        text-align: right;
    }
    .list-con .price > * {
        display: inline-block;
        vertical-align: middle;
    }
    .list-con li span {
         font-size: .5333rem /* 24/45 */;
    }
    .info p {
        max-width: 8.8889rem /* 400/45 */;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .list-con li em{
        color: #ef4628;
        font-style: normal;
    }
</style>

<style>
    .commission-con  .el-date-editor .el-range-separator {
        width: 10% !important;
    }
    .commission-con .el-input__inner {
        border: 1px solid #dcdfe6;
    }
</style>
