<template>
    <div class="condition-wrap">
        <div class="search-con">
            <el-input v-model="time" placeholder="选择时间" suffix-icon="el-icon-arrow-down" v-if="type == 2" @focus="openPicker(1)" readonly></el-input>
            <el-input v-model="condition.name" placeholder="选择条件" suffix-icon="el-icon-arrow-down" v-if="type == 2" @focus="showSelect(1)" readonly></el-input>
            <el-input v-model="name" placeholder="批发商名称" v-if="type == 1"></el-input>
            <el-input v-model="phone" placeholder="批发商手机" v-if="type == 1"></el-input>
            <el-input v-model="settledType" placeholder="入驻类型" suffix-icon="el-icon-arrow-down" v-if="type == 1" @focus="showSelect(2)" readonly></el-input>
            <div class="search-wrap application-type" v-if="type == 3">
                <span>申请类型</span>
                <el-input v-model="applicationType" placeholder="请选择" suffix-icon="el-icon-arrow-down" @focus="showSelect(3)" readonly></el-input>
            </div>
            <div class="search-wrap" v-if="type == 2">
                <el-input v-model="keyword" placeholder="请输入查询关键字"></el-input>
                <el-button type="primary">查询</el-button>
            </div>
            <div class="search-wrap" v-if="type == 1 || type == 3 || type == 4">
                <div class="block">
                    <el-input placeholder="开始日期" suffix-icon="el-icon-date" v-model="startDate" @focus="openPicker(2)" readonly class="startDate"></el-input>
                    <i class="el-icon-sort"></i>
                    <el-input placeholder="结束日期" suffix-icon="el-icon-date" v-model="endDate" @focus="openPicker(3)" readonly></el-input>
                </div>
                <el-button type="primary">查询</el-button>
            </div>
            <div class="total-con">
                <span class="price-text">返佣金合计: ¥{{(parseFloat(amount)/100).toFixed(2)}}</span>
                <el-button>刷新</el-button>
            </div>
        </div>
        <div class="amount-wrap" v-if="type == 3 || type == 4">
            <div>
                <p>总收入</p>
                <span>¥65.62</span>
            </div>
            <div>
                <p>总支出</p>
                <span>¥65.62</span>
            </div>
            <div>
                <p>余额</p>
                <span>¥65.62</span>
            </div>
        </div>
        <template>
            <mt-datetime-picker
            v-model="pickerVisible"
            type="date"
            ref="picker"
            year-format="{value}"
            month-format="{value}"
            date-format="{value}"
            @confirm="handleConfirm"
            > 
            </mt-datetime-picker>
        </template>
        <template>
            <mt-popup
            v-model="isShow"
            class="select-con"
            position="bottom">
                <mt-picker :slots="slots" :showToolbar="showToolbar" ref="genderPicker">
                    <div class="select-btn">
                        <span class="cancle-btn" @click.stop="closeSelect">取消</span>
                        <p>{{selectTitle}}</p>
                        <span class="sure-btn" @click="genderConfirm">确定</span>
                    </div>
                </mt-picker>
            </mt-popup>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: [String, Number],
            default: 0
        }
    },
    data () {
        return {
            time: '',
            name: '',
            phone: '',
            settledType: '',
            applicationType: '',
            keyword: '',
            startDate: '',
            endDate: '',
            amount:0,
            pickerVisible: new Date(),
            isShow:false,                               //下拉框控制器
            showToolbar:true,                           //显示选择框
            condition: {id:'',name:''},                 //用户类型列表                       
            slots: [],                                  //选择框数据
            selectIndex: 0,                             //选择框类别
            selectTitle: '',                            //选择框标题
            selectTimeIndex: 0
        }
    },
    mounted(){
    },
    methods:{
        //开启时间选择
        openPicker(index) {
            this.$refs.picker.open();
            this.selectTimeIndex = index;
            let box = document.getElementsByClassName("picker-title")[0];
            if(!box) {
                let node = document.createElement("span");
                node.innerHTML='<span class="picker-title">选择时间</span>';
                let box = document.getElementsByClassName("picker-toolbar")[0]
                let cancle = document.getElementsByClassName("mint-datetime-cancel")[0];
                box.insertBefore(node,cancle); //新建的元素节点插入到 id为p1的元素前面
            }
            
        },
        // 时间格式化
        formatDate(date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            return y+ '-' + m + '-' + d;
        },
        // 获取选中时间
        handleConfirm (data) {
            let date = this.formatDate(this.$refs.picker.value);
            switch(this.selectTimeIndex){
                case 1:
                    this.time = date;
                    break;
                case 2:
                    this.startDate = date;
                    break;
                case 3:
                    this.endDate = date;
                    break;
            }
        },
        // 下拉选择框显示 禁止页面拖动
        closeTouch () {
            document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive:false});//阻止默认事件
        },
        openTouch () {
            document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive:false});//打开默认事件
        },
        //显示选择框并且屏幕不能滚动
        showSelect(index){
            switch(index){
                case 1:
                    this.slots = [{values: ['商品名称', '订单号', '批发商名称', '批发商账号']}];
                    this.selectTitle = '选择条件'
                    break;
                case 2:
                    this.selectTitle = '入驻类型'
                    this.slots = [{values: ['年费1080元', '年费1825元', '年费3888元']}];
                    break;
                case 3:
                    this.selectTitle = '申请类型'
                    this.slots = [{values: ['全部', '转余额', '提现']}];
                    break;
            }
            this.isShow = true;
            this.selectIndex = index;
        },
        //隐藏显示框且屏滚动
        closeSelect(){
            this.isShow = false;
        },
        // 类别选择确定
        genderConfirm () { 
            let values = this.$refs.genderPicker.getValues()[0];
            switch(this.selectIndex){
                case 1:
                    this.$set(this.condition, 'name', values)
                    break;
                case 2:
                    this.settledType = values;
                    break;
                case 3:
                    this.applicationType = values;
                    break;
            }
            this.isShow = false;
        },
    },
    watch:{
        isShow (val){
            if(val) {
                this.closeTouch()
                // document.body.style.overflow="hidden";
            } else {
                this.openTouch()
                // document.body.style.overflow="auto";
            }
        },
        pickerVisible(val){
            if(val) {
                this.closeTouch()
                // document.body.style.overflow="hidden";
            } else {
                this.openTouch()
                // document.body.style.overflow="auto";
            }
        }
    }
}
</script>

<style scoped>
    .condition-wrap {
        margin: .4444rem /* 20/45 */  .3333rem /* 10/45 */;
        border-radius: .2222rem /* 10/45 */;
        overflow: hidden;
    }
    .search-con {
        background: #fff;
        padding: .4444rem /* 20/45 */;
    }
    .commission-con .el-input {
        margin-bottom: .4444rem /* 20/45 */;
    }
    .commission-con .el-input:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    .search-wrap{
        overflow: hidden;
    }
    .search-wrap .block {
        width: 78%;
    }
    .search-wrap .block .el-date-editor {
        width: 100%;
    }
    .search-wrap .el-range-editor.el-input__inner {
        padding: 3px 6px;
    }
    .search-wrap .el-input {
        width: 78%;
    }
    .search-wrap > * {
        display: inline-block;
        vertical-align: middle;
    }
    .search-wrap .block .el-input{
        width: 4.6667rem /* 210/45 */;
        font-size: .5333rem /* 24/45 */;
    }
    .search-wrap .block .el-icon-sort {
        font-size: .7111rem /* 32/45 */;
        transform: rotate(90deg);
    }
    .search-wrap .block .el-input__suffix {
        right: 0;
    }
    .search-wrap .startDate {
        margin-bottom: 0;
    }
    .search-con .el-button {
        float: right;
        padding: .2667rem /* 12/45 */ .6667rem /* 30/45 */;
        margin-top: .2222rem /* 10/45 */;
    }
    .application-type {
        margin-bottom: .4444rem /* 20/45 */;
    }
    .application-type span{
        font-size: .6222rem /* 28/45 */;
    }
    .application-type .el-input {
        float: right;
    }
    .total-con {
        overflow: hidden;
        padding-top: .4444rem /* 20/45 */;
    }
    .total-con .price-text{
        color: #ef4628;
        font-size: .6222rem /* 28/45 */;
    }
    .amount-wrap {
        display: flex;
        padding: .4444rem /* 20/45 */ 0;
        border-top: 1px solid #f5f5f5;
        background: #fff;
    }
    .amount-wrap > * {
        flex: 1;
        text-align: center;
        font-size: .6222rem /* 28/45 */;
    }
    .select-con {
        width: 100%;
        background-color: #fff;
    }
    .select-con .select-btn {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        font-size: .6667rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }
    .select-con .sure-btn {
        color: #00dd5e;
    }
    .select-con .cancle-btn {
        color: red;
    }
</style>

<style>
    .search-wrap .el-date-editor .el-range-separator {
        width: 10% !important;
    }
    .commission-con .picker-slot {
        font-size: .6222rem /* 28/45 */;
        font-weight: normal;
    }
    .commission-con .picker-toolbar .picker-title{
        text-align: center;
        font-size: .6222rem /* 28/45 */;
        width: 40%;
        display: inline-block;
    }
    .commission-con .mint-datetime-action {
        color: #00dd5e;
        width: 30%;
    }
    .commission-con .mint-datetime-cancel{
        color: red;
    }
    .search-wrap .block .el-input__inner {
        
        text-align: center;
        padding: 0;
        padding-right: .8889rem /* 40/45 */;
    }
</style>
