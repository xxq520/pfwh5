<template>
    <div class="capital-details">
        <mt-header title="明细">
            <router-link to="/wholesale/myProfit" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <span class="date-picker-icon" slot="right" @click="openPicker"></span>
        </mt-header>
        <div class="capital-con">
            <div class="tab-con">
                <span class="tab-item cur">提现明细</span>
                <span class="tab-item">销售明细</span>
            </div>
            <div class="details-list">
                <div class="details-item">
                    <router-link to='/wholesale/capitalDetails' class="item-links">
                        <div class="left">
                            <p class="details-text">提现单号：<span class="item-right">455654765455455454676</span></p>
                            <p class="details-text">账单时间：<span class="item-right">2018.10.22  12:00:00</span></p>
                            <p class="details-text">提现金额：<span class="item-right price-color">1200.00</span></p>
                        </div>
                        <div class="right">
                            <p class="item-status">已到账</p>
                        </div>
                    </router-link>
                    <p class="item-status-tip">提现金额将原路返回账户余额</p>
                </div>
                <div class="details-item">
                    <router-link to='/wholesale/capitalDetails' class="item-links">
                        <div class="left">
                            <p class="details-text">提现单号：<span class="item-right">455654765455455454676</span></p>
                            <p class="details-text">账单时间：<span class="item-right">2018.10.22  12:00:00</span></p>
                            <p class="details-text">提现金额：<span class="item-right price-color">1200.00</span></p>
                        </div>
                        <div class="right">
                            <p class="item-status">已到账</p>
                        </div>
                    </router-link>
                    <p class="item-status-tip">提现金额将原路返回账户余额</p>
                </div>
            </div>
            <div class="screen-con">
                <div class="screen-list">
                    <p class="screen-item cur">线上支付</p>
                    <p class="screen-item">线下支付</p>
                </div>
            </div>
            <mt-datetime-picker
            v-model="pickerVisible"
            type="date"
            year-format="{value}年"
            month-format="{value}月"
            ref="picker"
            :startDate="startDate"
            @confirm="handleConfirm">
            </mt-datetime-picker>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
           pickerVisible:new Date(),
           startDate:new Date()
        }
    },
     methods: {
        //开启时间选择
        openPicker() {
            document.getElementsByClassName('picker-slot-center')[2].style.display="none"
            this.$refs.picker.open();
        },
        // 时间格式化
        formatDate(date) {
            const y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            return y + ' ' + m ;
        },
        // 获取选中时间
        handleConfirm (data) {
            console.log(this.formatDate(this.$refs.picker.value));
        }
    }
}
</script>

<style>
    .capital-details .date-picker-icon{
        display:block;
        height:1.0444rem;
        background:url('../../assets/images/datepicker-icon.png') no-repeat center right;
        background-size:contain;
    }
    .capital-details .capital-con{
        position:relative;
    }
    .capital-details .tab-con{
        height:48px;
        line-height:48px;
        display:flex;
        justify-content: space-between;
        background-color:#fff;
        text-align:center;
        margin-bottom:.4rem;
        border-bottom:.0222rem solid #ddd;
    }
    .capital-details .tab-item{
        position:relative;
        flex:1;
        font-size:.6222rem;
    }
    .capital-details .tab-item:after{
        display:block;
        content:"";
        position:absolute;
        right:0;
        top:50%;
        
    }
    .capital-details .tab-item:first-child:after{
        margin-top:-.5rem;
        height:1rem;
        width:.0222rem;
        background-color:#ccc;
    }
    .capital-details .tab-item:last-child:after{
        width:0;
        height:0;
        right:2rem;
        margin-top:-.1111rem;
        border-width: .2222rem .2222rem 0 ;
        border-style:solid;
        border-color:#888 transparent transparent
    }
    .capital-details .cur{
        color:#ff0000;
    }
    .capital-details .tab-item:last-child.cur::after{
        border-color:#ff0000 transparent transparent;
    }
    .capital-details .details-list{
        background-color:#fff;
    }
    .capital-details .details-item{
        position:relative;
        height:3.9556rem;
        padding:.2rem .5333rem 0;
        margin-bottom:.5rem;
    }
    .capital-details .item-links{
        display:block;
        height:inherit;
        display:flex;
        justify-content: space-between;
        border-bottom:.0222rem solid #ccc;
    }
    .capital-details .details-item:last-child .item-links{
        border:0 none;
    }
    .capital-details .details-item .right{
        /* flex:1; */
        position:relative;
        font-size:.5333rem;
        text-align:center;
        line-height:3.9556rem;
    }
    .capital-details .item-status-tip{
        position:absolute;
        bottom:.5rem;
        right:.5333rem;
        font-size:.5333rem;
        color:#999;
    }
    .capital-details .details-item .details-text{
        font-size:.5778rem;
        color:#333;
        line-height:1.2rem;
    }
    .capital-details .details-item .item-right{
        color:#999;
    }
    .capital-details .details-item .price-color{
        color:#ff0000;
    }
    .capital-details .screen-con{
        display:none;
        position:fixed;
        top:92px;
        left:0;
        width:100%;
        height:calc(100% - 92px);
        background-color:rgba(0,0,0,.3);
    }
    .capital-details .screen-con .screen-list{
        padding:.2rem 0;
        background-color:#fff;
    }
    .capital-details .screen-con .screen-item{
        text-align:center;
        font-size:.6222rem;
        line-height:1.8rem;
    }
</style>
