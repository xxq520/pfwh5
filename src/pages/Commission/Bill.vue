<template lang="html">
    <div class="bill-con">
        <mt-header fixed title="账单" class="mt-header">
            <router-link :to="{ name: '', params: {} }" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="screen-con">
            <div class="condition">
                <span>全部</span>
                <i class="triangle"></i>
            </div>
            <div class="content">
                <div class="date-con">
                    <p class="date-box" @click="openPicker">
                        <input type="text" name="" value="" v-model="startTime" readonly>
                        <i class="triangle"></i>
                    </p>
                    <!-- <i class="line">—</i> -->
                    <span class="span">至</span>
                    <p class="date-box" @click="openPicker">
                        <input type="text" name="" value="" v-model="s=endTime" readonly>
                        <i class="triangle"></i>
                    </p>
                </div>
                <div class="survey-con">
                    <span>支出:¥{{expend | moneyFormat}}</span>
                    <span>收入:¥{{income | moneyFormat}}</span>
                </div>
            </div>
        </div>
        <mt-loadmore class="data-con">
            <ul class="data-list">
                <li class="data-item" v-for="(item,index) in List" :key="index">
                    <i class="icons" :class="listIcon(item.ProfitType)"></i>
                    <div class="item-middle">
                        <p class="item-title">{{item.ProfitMark}}</p>
                        <p class="item-desc">{{item.CreateTime | dataFormat}}</p>
                    </div>
                    <span class="amount">{{item.ExchangeAmount | moneyFormat}}</span>
                </li>
            </ul>
        </mt-loadmore>
        <mt-datetime-picker
        ref="picker"
        type="date"
        v-model="pickerValue">
        </mt-datetime-picker>
    </div>
</template>
<script>
export default {
    data () {
        return {
            icons:"",
            expend:0,//支出
            income:0,//收入
            List:[],
            startTime:new Date(),//开始时间
            endTime:new Date(),//结束时间
            pickerValue:new Date(),//时间popup
            startDate:"",
        }
    },
    mounted(){
        this.getTypeList();
        this.getListData();
    },
    methods:{
        getTypeList(){
            let obj = {
                userSeq:sessionStorage.getItem("seq"),
                accountId:"57648451901251028312414",
                queryJson:null
            }
            axios.get(this.URL + "/Earnings/GetProfitTypeListJson",{params:obj})
            .then(res => {
                if(res.data.code == 200){
                    // this.List = res.data.data;
                }
            })
            .catch(err => {

            })
        },
        // 获取列表
        getListData(){
            let obj = {
                userSeq:sessionStorage.getItem("seq"),
                accountId:"57648451901251028312414",
                page:1,
                rows:10,
                queryJson:{
                    StartTime :"",
                    EndTime :"",
                    earningsType:"",
                    profitType :""
                }
            }
            axios.get(this.URL + "/Earnings/GetUserEarningsListJson",{params:obj})
            .then(res => {
                if(res.data.code == 200){
                    this.List = res.data.data.data.data;
                    this.expend = res.data.data.data.expend;
                    this.income = res.data.data.data.income;
                }
            })
            .catch(err => {

            })
        },
        // 列表图标显示
        listIcon(type){
            if(type == 0) {
                return "lirun"
            }else if(type == 1){
                return "dingdan"
            }else if(type == 2 || type == 3){
                return "tixian"
            }else if(type == 4 || type == 5){
                return "yue"
            }
        },
        // 时间popup
        openPicker() {
            this.$refs.picker.open();
        }
    }
}
</script>

<style lang="css">
    .bill-con .screen-con{
        padding-top:44px;
        background-color:#fff;
        margin-bottom:15px;
    }
    .bill-con .icons{
        display:block;
        width:1.5556rem;
        height:1.5556rem;
        border-radius:50%;
        background-repeat:no-repeat;
        background-size:contain;
        background-position:center;
    }
    .bill-con .icons.yue{
        background-image:url("../../assets/images/icon-yue.png");
    }
    .bill-con .icons.tixian{
        background-image:url("../../assets/images/icon-tixian.png");
    }
    .bill-con .icons.lirun{
        background-image:url("../../assets/images/icon-lirun.png");
    }
    .bill-con .icons.dingdan{
        background-image:url("../../assets/images/icon-dingdan.png");
    }
    .bill-con .condition{
        display:flex;
        align-items:center;
        text-align:center;
        font-size:.6667rem;
        justify-content: center;
        height:44px;
        border-bottom:1px solid #eee;
    }
    .bill-con .triangle{
        display:block;
        width:0;
        height:0;
        margin-top:.3333rem;
        margin-left:.3333rem;
        border-width:.2889rem;
        border-style: solid;
        border-color:#999 transparent transparent transparent;
    }
    .bill-con .content{
        height:67px;
        font-size:.6222rem;
    }
    .bill-con .date-con{
        display:flex;
        padding:.3333rem .4444rem .2222rem .5333rem;
    }
    .bill-con .date-box{
        display:flex;
    }
    .bill-con .date-box input{
        width:2.6667rem;
        font-size:.6222rem;
        text-align:center;
    }
    .bill-con .date-box .triangle{
        margin-left:0;
    }
    .bill-con .line{
        margin:0 .3333rem;
        color:#999;
        font-weight:600;
    }
    .bill-con .span{
        font-size:.6222rem;
        color:#666;
        margin:0 .4444rem;
    }
    .bill-con .survey-con{
        padding:0 .5333rem;
        color:#666;
    }
    .bill-con .survey-con span:first-child{
        margin-right:.4444rem;
    }
    .bill-con .data-con{
        height:calc(100vh - 170px);
        overflow:scroll;
        -webkit-overflow-scrolling: touch;
        font-size:.6222rem;
    }
    .bill-con .data-item{
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding:0 .5333rem;
        background-color:#fff;
        height:3.3778rem;
        border-bottom:1px solid #eee;
    }
    .bill-con .item-middle{
        flex:7;
    }
    .bill-con .data-item .icons{
        flex:1.5;
    }
    .bill-con .data-item .amount{
        flex:2.5;
        text-align:center;
    }
    .bill-con .data-item .item-title{
        /* width:10rem; */
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-bottom:.4444rem;
    }
    .bill-con .data-item .item-desc{
        color:#999;
    }
</style>
