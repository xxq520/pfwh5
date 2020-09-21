<template>
    <div class="invitation-con">
        <mt-header title="利润报表" fixed class="header-con">
            <router-link to="/wholesale/myProfit" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="main">
            <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" class="loadmore">
                <!-- 条件筛选 -->
                <div class="screen-con">
                    <div class="date-con">
                        <el-input placeholder="开始日期" suffix-icon="el-icon-date" v-model="startDate" @focus="openPicker(0)" readonly class="inputs"></el-input>
                        <i class="el-icon-sort"></i>
                        <el-input placeholder="结束日期" suffix-icon="el-icon-date" v-model="endDate" @focus="openPicker(1)" readonly class="inputs"></el-input>
                    </div>
                    <div class="screen-box" @click="showPopup">
                        <p>{{selectPopupValue}}</p>
                    </div>
                    <div class="flex-box">
                        <div class="screen-box">
                            <input placeholder="请输入查询关键字" class="search" v-model="value"/>
                        </div>
                        <button type="button" name="button" @click="queryData">查询</button>
                    </div>
                </div>
                <!-- 统计 -->
                <div class="statistics-con">
                    <ul class="list">
                        <li class="items">
                            <p class="items-title">销售统计</p>
                            <p class="items-value">¥{{datas.TotalSales}}</p>
                        </li>
                        <li class="items">
                            <p class="items-title">利润合计</p>
                            <p class="items-value">¥{{datas.TotalProfit}}</p>
                        </li>
                        <li class="items">
                            <p class="items-title">已结算</p>
                            <p class="items-value">¥{{datas.SettledAmount}}</p>
                        </li>
                        <li class="items">
                            <p class="items-title">未结算</p>
                            <p class="items-value">¥{{datas.UnsettledAmount}}</p>
                        </li>
                    </ul>
                    <button type="button" name="button" class="refresh-btn" @click="getAll(0)">刷新</button>
                </div>
                <!-- 数据展示 -->
                <div class="data-con">
                    <!-- tab-con -->
                    <ul class="tab-list">
                        <li class="tab-items" :class="isCurt == 0? 'cur': ''" @click="getAll(0)"><span>全部</span></li>
                        <li class="tab-items" :class="isCurt == 1? 'cur': ''" @click="nearFuture(7,1)"><span>近七天</span></li>
                        <li class="tab-items" :class="isCurt == 2? 'cur': ''" @click="nearFuture(30,2)"><span>近一个月</span></li>
                        <li class="tab-items" :class="isCurt == 3? 'cur': ''" @click="nearFuture(90,3)"><span>近三个月</span></li>
                    </ul>

                    <div class="data-list" v-if="dataArr.length > 0" >
                        <div class="data-items" v-for="items in dataArr" @click="checkDetails(items.SEQ,items.salenumber)">
                            <div class="items-con">
                                <p class="business-name">{{items.UserName}}</p>
                                <p class="order-price">¥{{items.TotalPaymentAmount}}</p>
                            </div>
                            <div class="items-con">
                                <p class="business-name name">{{items.salenumber}}</p>
                                <p class="order-date">{{items.ordertime.substring(0,10)}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>
                        暂无数据
                    </div>
                </div>
            </mt-loadmore>
        </div>
        <!-- DateTimePicker -->
        <mt-datetime-picker
          v-model="pickerVisible"
          type="date"
          ref="picker"
          @confirm="handleConfirm"
          >
        </mt-datetime-picker>
        <mt-popup
        v-model="popupVisible"
        position="bottom"
        >
            <mt-picker :slots="slots" valueKey="text" :showToolbar="true" ref="pupop">
                <div class="tabbar">
                    <button @click="showPopup">取消</button>
                    <p>选择条件</p>
                    <button @click="onValuesChange">确定</button>
                </div>
            </mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import {showToast} from "@/assets/js/common.js";
export default {
    data () {
        return {
            seq:"",
            startDate:'',//开始时间
            endDate:'',//结束时间
            pickerVisible: new Date(),//初始化
            UserName:'',//购买人
            popupVisible:false,//时间弹框是否显示
            selectTimeIndex:0,//时间box索引
            slots:[
                {
                  values: [{id:"1","text":"购买人"}, {id:"2","text":"未结算"}, {id:"3","text":"已结算"}],
                  textAlign: 'left'
                }
            ],
            selectPopupValue:"选择条件",
            value:"",
            allLoaded:false,
            isCurt:0,//当前选中状态
            selectPopupID:0,
            pages:1,//当前页数
            totalPage:1,//总页数
            row:10,//默认条数
            HKJSType:'',//是否结算（0--未结算，1--已结算）
            datas:'',//接收返回结果
            dataArr:[]//接收返回结果
        }
    },
    created(){
     this.getSesstionData();
    },
    mounted(){
       
        this.getData();
    },
    methods:{
        // 获取本地存储数据
        getSesstionData(){
        //    let seq = sessionStorage.getItem('seq');
        //    if(seq){
        //        this.seq = seq;
        //    }
             let seq = this.$route.query.seq;
             let from = this.$route.query.from;

             if(seq){
             this.seq = seq;
             sessionStorage.setItem("seq",seq);
             }else{
             this.seq = sessionStorage.getItem("seq");
             }
        },
        openPicker(index){
            this.$refs.picker.open();
            this.selectTimeIndex = index;
        },
        // 近多少天时间计算
        nearFuture(date,index) {
            let today = new Date();
            let targetday_milliseconds=today.getTime() - 1000*60*60*24*date;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            this.startDate = this.dateForMater(today);//开始时间
            this.endDate = this.dateForMater(new Date());//结束时间
            this.pages=1;
            this.HKJSType="";
            this.UserName="";
            this.dataArr = [];
            this.isCurt = index;
            this.getData();
        },
        // 时间格式化
        dateForMater(date){
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            return y + '-' + m + '-' + d;
        },
        // 获取选中时间
        handleConfirm (data) {
            let date = this.dateForMater(this.$refs.picker.value);
            switch(this.selectTimeIndex){
                case 0:
                    this.startDate = date;
                    break;
                case 1:
                    this.endDate = date;
                    break;
            }
        },
        // 显示条件选择
        showPopup(){
            this.popupVisible = !this.popupVisible;
        },
        // 选择查询条件
        onValuesChange(){
             this.selectPopupValue = this.$refs.pupop.getValues()[0].text;
             this.selectPopupID = this.$refs.pupop.getValues()[0].id;
             this.popupVisible = false;
        },
        // 获取全部数据
        getAll(index){
            // 发送参数全部复原
            this.pages=1;
            this.HKJSType="";
            this.UserName="";
            this.startDate = "";
            this.endDate = "";
            this.dataArr = [];
            this.isCurt = index;
            this.getData();
        },
        // 查询按钮
        queryData(){
            if(this.selectPopupID == 1){
                this.UserName = this.value;
                if(this.UserName == ""){
                    showToast("购买人不能为空");
                    return;
                }
            }
            if(this.selectPopupID == 2 || this.selectPopupID == 3){
                this.HKJSType = this.selectPopupID;
            }else{
                this.HKJSType = "";
            }
            this.pages = 1;
            this.isCurt = 0;
            this.dataArr = [];
            this.getData();
            // this.startDate = "";
            // this.endDate = "";

        },
        // 获取接口数据
        getData(){
            this.allLoaded = true;
            if(this.pages >=this.totalpage){
                return;
            }
            let params={
                // WholeSaleSeq:,
                // WholeSaleSeq:sessionStorage.getItem("seq"),
                WholeSaleSeq:this.seq,

                page:this.pages,//当前页
                row:this.row,//默认多少条数据
                queryJson:{
                    UserName:this.UserName,//购买人
                    StartTime:this.startDate,//开始时间
                    EndTime:this.endDate,//结束时间
                    HKJSType:this.HKJSType//是否结算（0--未结算，1--已结算）
                }
            }
            axios.get(this.URL + "/OrderNewListInfo/GetProfitStatWhoJson",{params:params})
            .then(res => {
                if(res.data.code == 200){
                    this.datas = res.data.data;
                    this.totalPage = res.data.data.totalPage;
                    this.dataArr = this.dataArr.concat(res.data.data.Orderdata);
                    this.pages ++;
                    this.allLoaded = false;
                }
            })
            .catch(err => {

            })
        },
        // 上拉加载
        loadBottom(){
            this.getData();
        },
        // 查看详情
        checkDetails(user,salenumber){
            this.$router.push({path:"/wholesale/invitationDetails",query:{WholeSaleSeq:sessionStorage.getItem("seq"),SEQ:user,salenumber:salenumber}});
        }
    }
}
</script>
<style>
    .invitation-con{
        font-size:.6667rem;
    }
    .invitation-con .header-con{
        background-color:#ef4628;
        color:#fff;
    }
    .invitation-con .main{
        padding-top:50px;
        padding:50px .3333rem 0;
    }
    .invitation-con .screen-con{
        background-color:#fff;
        border-radius:5px;
        padding:.4444rem;
        margin-bottom:.2222rem;
    }
    .invitation-con .date-con{
        display:flex;
        justify-content: space-between;
        margin-bottom:.4444rem;
    }
    .invitation-con .el-icon-sort{
        text-align:center;
        transform: rotate(90deg);
        margin-left:-1rem;
        color:#666;
    }
    .invitation-con .inputs{
        width:6.2222rem
    }
    .invitation-con .screen-box{
        border:1px solid #eee;
        border-radius:3px;
        height:1.6889rem;
        line-height:1.6889rem;
        padding-left:.4444rem;
        color:#666;
        margin-bottom:.4rem;
        background:url("../../assets/images/down.png") no-repeat 97% center;
        background-size:.6222rem;
    }
    .invitation-con .screen-box .search{
        font-size:.6667rem;
        width:100%;
    }
    .invitation-con .flex-box{
        display:flex;
        justify-content: space-between;
    }
    .invitation-con .flex-box .screen-box{
        margin-bottom:0;
        width:10.6667rem;
        background:none;
    }
    .invitation-con .flex-box button{
        border:0 none;
        background-color:#3da1ff;
        color:#fff;
        font-size:.5778rem;
        width:2.8444rem;
        border-radius:3px;
        outline-style: none;
    }
    .invitation-con .statistics-con{
        border-radius:5px;
        background-color:#fff;
        padding:.6667rem .4444rem .4444rem;
        margin-bottom:.4444rem;
    }
    .invitation-con .list{
        display:flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom:.3333rem;
    }
    .invitation-con .items{
        width:50%;
        text-align:center;
        margin-bottom:.4444rem;
    }
    .invitation-con .items-title{
        font-size:.5778rem;
        color:#999;
        margin-bottom:.2222rem;
    }
    .invitation-con .items-value{
        font-size:.7111rem;
        color:#ef2828;
    }
    .invitation-con .refresh-btn{
        display:block;
        margin:0 auto;
        outline:none;
        border:0 none;
        background-color:transparent;
        color:#f65b06;
        font-size:.5778rem;
        background:url("../../assets/images/refreshBtn.png") no-repeat left center;
        background-size:.5333rem;
        padding-left:.7111rem;
    }
    .invitation-con .data-con .tab-list{
        display:flex;
        justify-content: space-between;
    }
    .invitation-con .data-con .tab-items{
        flex:1;
        text-align:center;
        height:1.5111rem;
        line-height:1.5111rem;
        background-color:transparent;
        border-top-left-radius:5px;
        border-top-right-radius:5px;
    }
    .invitation-con .data-con .tab-items span{
        padding:.2222rem;
        border-bottom:.1111rem solid transparent;
        font-size:.6667rem;
        color:#666;
    }
    .invitation-con .data-con .cur{
        background-color:#fff;;
    }
    .invitation-con .data-con .cur span{
        background-color:#fff;
        border-bottom-color:#ef2828;
    }
    .invitation-con .data-con .data-list{
        background-color:#fff;
        border-radius:5px;
        padding:0 .4444rem;
    }
    .invitation-con .data-con .data-items{
        border-bottom:1px solid #ccc;
        padding-right:1.2222rem;
        padding-top:.4444rem;
        background:url("../../assets/images/right.png") no-repeat right center;
        background-size:.3333rem;
    }
    .invitation-con .data-con .items-con{
        display:flex;
        justify-content: space-between;
        margin-bottom:.2222rem;
    }
    .invitation-con .data-con .business-name{
        width:9.3333rem;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.7556rem;
        color:#333;
    }
    .invitation-con .data-con .name{
        font-size:.6667rem;
        color:#666;
    }
    .invitation-con .data-con .order-price{
        color:#ef2828;
    }
    .invitation-con .data-con .order-date{
        color:#999;
        font-size:.5333rem;
    }
    .invitation-con .mint-popup{
        width:100%;
    }
    .invitation-con .tabbar{
        height:100%;
        padding:0 .5333rem;
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    .invitation-con .tabbar button{
        outline-style: none;
        border:0 none;
        background-color:transparent;
    }
    .invitation-con .no-data{
        color:#999;
        font-size:.5333rem;
        padding:.6667rem 0 0;
        text-align: center;
    }
    .invitation-con .loadmore{
        /* height:11.1111rem; */
        -webkit-overflow-scrolling: touch;
        overflow:scroll;
    }
</style>
