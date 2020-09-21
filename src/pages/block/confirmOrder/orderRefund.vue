<template>
    <div class="order-refund">
        <!--header-->
        <mt-header fixed title="申请退款" ref="header">
            <mt-button icon="back" slot="left" @click="$router.back(-1)"></mt-button>
        </mt-header>

        <div class="item item-1">
            <p class="title">退款原因</p>
            <div class="refund-type">
                <p class="title">退款类型</p>
                <div class="select-box">
                    <select name="" id="" class="refund-select" v-model="refundTypeVal">
                        <option :value="item.value" v-for="(item, idx) in refundType" :disabled="idx == 0" :key="idx">{{item.label}}</option>
                    </select>
                    <input type="text" v-model="refundType[Number(refundTypeVal)]['label']" disabled placeholder="请选择">
                    <img :src="require('../../../assets/images/block/common_icon_xiala.png')" alt="">
                </div>
                <!-- <el-select v-model="refundTypeVal" placeholder="退款类型">
                    <el-option
                    v-for="item in refundType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    size="mini">
                    </el-option>
                </el-select> -->
            </div>
            <mt-field label="" placeholder="请描述退款原因..." type="textarea" rows="1" v-model="refundText"></mt-field>
        </div>
        
        <!-- 原因 -->
        <div class="item item-2">
            <div class="content-box">
                <div class="img-box img" v-for="(item, idx) in imgUrl" :key="idx">
                    <img :src="item" alt="">
                    <img :src="require('../../../assets/images/block/pf_icon_dele.png')" alt="" class="del" @click="delImg(idx)">
                </div>
                <div class="img-box" v-show="imgUrl.length < 3">
                    <input @change="upImg('upImg')" accept="image/*" type="file" ref="upImg" class="up-img">
                    <img :src="require('../../../assets/images/block/up_img.png')" alt="">
                    <!-- <span>+</span>
                    <div>上传凭证</div>
                    <div>(最多三张)</div> -->
                </div>
            </div>
        </div>

        <!-- 退款商品 -->
        <div class="item item-3">
            <p class="title">请选择退款商品</p>
            <div class="goods" v-for="(item, idx) in refundData.orderDetails" :key="idx">
                <div class="l">
                    <!-- 正常订单订单 -->
                    <img 
                        v-if="item.route == 0"
                        @click="clickSelect(item,idx)" 
                        :src="item.isSelect ? require('../../../assets/images/button_def_choose.png'):require('../../../assets/images/block/pf_payment_icon_checkbox_n.png')" 
                        alt="">
                    <!-- 已退商品 -->
                    <img 
                        v-else :src="require('../../../assets/images/block/pf_payment_icon_checkbox_no.png')"  alt="">
                </div>
                <div class="r">
                    <img class="r-1" :src="item.picUrl" alt="">
                    <div class="r-2">
                        <p v-text="item.goodsName"></p>
                        <span v-text="'x' + item.goodsNum"></span>
                    </div>
                </div>
            </div>
            <div class="count">
                <div class="l">
                    <img 
                        @click="clickSelectAll()" 
                        :src="refundData.isSelect ? require('../../../assets/images/button_def_choose.png'):require('../../../assets/images/block/pf_payment_icon_checkbox_n.png')" 
                        alt="">
                </div>
                <div class="r">
                    <span>全选</span>
                    <p>退款金额：<span v-text="'￥' + (changePrice ? refundData.totalOrderPrice : refundMoney)"></span></p>
                </div>
            </div>
        </div>


        <div class="submit" @click="submit">提交</div>
    </div>
</template>

<script type="text/javascript">
    import {Toast,Indicator} from 'mint-ui';
import { showToast, floatAdd, floatSub } from '../../../assets/js/common';
    export default {
        name: 'orderRefund',
        data() {
            return {
                refundText: '',
                imgUrl: [],
                refundData: {},
                refundMoney: 0,
                checkNum: 0,
                query: { },
                userInfo: this.$store.state.userInfo,
                orderNo: '',
                refundType: [{
                    value: '0',
                    label: '请选择'
                    },{
                    value: '1',
                    label: '仅退款'
                    }, {
                    value: '2',
                    label: '退货退款'
                    }],
                refundTypeVal: '0',
                changePrice: false, // 为true时只能整单退，用户不能选择退款商品
            }
        },
        created() {
            this.query = this.$route.query;
            this.orderNo = this.$route.query.orderNo;
            this.getOrderDetail();
        },
        mounted() {
        },
        methods: {
            // 查询订单详情
            getOrderDetail() {
                axios.get(this.blockURL + `/qypfs-order/api/order/get?orderNo=${this.orderNo}`).then(res => {
                    if (res.data.code == 200) {
                        let refundData = res.data.data || [];
                        let changePrice = !!refundData.changePriceFront;
                        let num = 0;
                        refundData.orderDetails.forEach(item => {
                            if (item.route == 0) {
                                num++;
                                item.isSelect = false;
                            } else {
                                item.isSelect = true;
                            }
                        });
                        refundData.num = num;
                        this.refundData = refundData;
                        if(changePrice) this.clickSelectAll();
                        this.changePrice = changePrice;

                        console.log('refundData',this.refundData);
                    } else {
                        Toast({message: res.data.message,position: 'bottom',duration: 2000});
                    }
                });
            },
            // 选中
            clickSelect(item, idx) {
                console.log(item, idx);
                if(this.changePrice) return;
                item.isSelect = !item.isSelect;
                if (!item.isSelect) {
                    this.checkNum -= 1;
                    this.refundMoney = floatSub(this.refundMoney, Number(item.totalPrice));
                } else {
                    this.checkNum += 1;
                    this.refundMoney = floatAdd(this.refundMoney, Number(item.totalPrice));
                }
                
                if(this.checkNum == this.refundData.num) {
                    this.refundData.isSelect = true;
                } else {
                    this.refundData.isSelect = false;
                }
            },
            // 全选
            clickSelectAll() {
                if(this.changePrice) return;
                this.refundData.isSelect = !this.refundData.isSelect;
                let refundMoney = 0;

                this.refundData.orderDetails.forEach(obj => {
                    if (obj.route == 0) {
                        obj.isSelect = this.refundData.isSelect;
                        if(obj.isSelect) {
                            refundMoney = floatAdd(refundMoney, Number(obj.totalPrice));
                            this.checkNum = this.refundData.num;
                        }
                    }
                });
                this.refundMoney = refundMoney;
            },
            // 图片上传
            upImg(type) {
                let f = this.$refs[type].files[0];
                let param = new FormData();
                param.append('file', f);
                Indicator.open();
                axios.post('http://upload.520shq.com/upload', param).then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        let url = res.data.data.url;
                        let idx = this.imgUrl.length;
                        this.$set(this.imgUrl, idx, url);
                    }
                    Indicator.close();
                }).catch(() => {
                    Indicator.close();
                });
            },
            delImg(idx) {
                let imgUrl = [...this.imgUrl];
                imgUrl.splice(idx, Number(idx) + 1);
                this.imgUrl = imgUrl;
            },
            submit() {
                let arr = [];
                let orderList = this.refundData.orderDetails;
                if(Number(this.refundTypeVal) < 1) return showToast('请选择退货类型');
                if (!this.refundText) return showToast('请填写退款原因');    
                if (!this.refundMoney) return showToast('请选择退货商品');
                // 查询勾选需要单品退的商品
                for(let i=0; i<orderList.length; i++){
                    if (orderList[i].isSelect && orderList[i].route==0){
                        arr.push(orderList[i].id);
                    }
                }
                let params ={
                    afterSalesWhy: this.refundText,
                    detailId: arr,
                    orderNo: this.orderNo,
                    route: Number(this.refundTypeVal),
                    imageUrls: this.imgUrl,
                    userId: this.userInfo.userId,
                }
                axios.post(`${this.blockURL}/qypfs-order/api/order/afterSales`, params).then(res =>{
                    console.log('afterSales', res);
                    if (res.data.code == 200) {
                        setTimeout(()=>{
                            this.$router.push({path: '/block/blockMyorder'})
                        }, 1000)
                    }
                    showToast(res.data.message);
                })
            }
        },
    }
</script>

<style scoped>
.order-refund {
    background: #EEEEEE;
}
.order-refund >div{
    background: #ffffff;
}
.order-refund .mint-header {
    z-index: 10000;
    background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
    color: #fff;
}

.item .title{
    font-size: .6rem;
    color: #666;
    background: #EEEEEE;
    height: 1.9rem;
    line-height: 1.9rem;
    padding-left: .4rem;
}

.item-1{
    margin-top: 1.8rem
}
.item-1 .select-box{
    width: 4rem;
    height: 1.5rem;
    position: relative;
    margin-right: .55rem;
}
.item-1 .select-box .refund-select{
    width: 4rem;
    height: 1.5rem;
    background: #fff;
    border: solid 1px rgba(255,255,255,0);
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    padding-left: .9rem;
    position: absolute;
    z-index: 2;
    opacity: 0;
}
.item-1 .select-box input{
    width: 4rem;
    height: 1.5rem;
    position: absolute;
    padding-right: 0;
    text-align: center;
    background: #fff;
}
.item-1 .select-box img{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: .65rem;
    height: .65rem;
}

.item-1 /deep/ .mint-field.is-textarea{
    background-image: none;
}
.item-1 /deep/ textarea{
    color: #333;
}
.item-1 /deep/ textarea::-webkit-input-placeholder{
    color: #999;
}
.item-1 .refund-type{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.item-1  .refund-type .title{
    background: #fff;
}
.item-1  .refund-type /deep/ input{
    border: 0 none;
    width: 4rem;
    text-align: right;
    color: #333333;
    padding-right: 24px;
}
.item-1  .refund-type /deep/ input::-webkit-input-placeholder{
    color: #333333
}
.item-1  .refund-type /deep/ .el-select .el-input .el-input__suffix,.item-1  .refund-type /deep/ .el-select .el-input .el-input__suffix-inner{
    display: flex;
    justify-content: center;
    align-items: center;
}
.item-1  .refund-type /deep/ .el-select .el-input .el-select__caret{
    color: #999;
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    border-bottom: 7px solid #999;
}
.item-1  .refund-type /deep/ .el-select .el-input .el-select__caret::before{
    display: none;
}
.item-2{
    padding-bottom: .75rem;
}
.item-2 .content-box{
    display: flex;
    border-top: 1px solid #E9E9E9;
    width: 94%;
    margin: 0 auto;
    padding-top: .5rem;
}
.item-2 .img-box{
    position: relative;
    width: 3rem;
    height: 3rem;
    margin-top: .25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
    margin-right: .6rem;
}

.item-2 .img-box .up-img{
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
}
.item-2 .img-box >div{
    margin-top: .1rem;
    font-size: .5rem;
}
.item-2 .img-box >span{
    font-size: 1.4rem;
    margin-top: .15rem;
}
.item-2 .img-box img{
    width: 100%;
    object-fit: cover;
    max-height: 100%;
}
.item-2 .img-box.img{
    border: 0 none;
    position: relative;
}
.item-2 .img-box.img .del{
    position: absolute;
    right: -10px;
    top: -10px;
    width: .85rem;
    object-fit: cover;
}
.order-refund .submit{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .65rem;
    color: #fff;
}
.item-3{
    margin-top: .1rem;
}
.item-3 .goods{
    display: flex;
    align-items: center;
    height: 3.34rem;
}
.item-3 .goods .l{
    display: flex;
    width: 2rem;
    justify-content: center;
    align-items: center;
}
.item-3 .goods .l img{
    width: .7rem;
    max-height: .7rem;
    object-fit: cover;
}
.item-3 .goods .r{
    display: flex;
    flex: 2;
    align-items: center;
    padding-right: .5rem;
}
.item-3 .goods .r .r-2{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.item-3 .goods .r img{
    width: 2.1rem;
    max-height: 2.1rem;
    object-fit: cover;
    margin-right: .375rem;
}
.item-3 .goods .r p{
    font-size: .584rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(102,102,102,1);

    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
.item-3 .goods .r span{
    font-size: .584rem;
    font-family: PingFang SC;
    font-weight: 500;
    color :#999999
}
.item-3 .count{
    display: flex;
    align-items: center;
    height: 2.3rem;
    padding: 0 .5rem;
}
.item-3 .count .l,.item-3 .count .r{
    border-top: 1px solid #E9E9E9;
}
.item-3 .count .l{
    width: 1.2rem;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: .12rem;
}
.item-3 .count .r{
    height: 100%;
    flex: 2;
    display: flex;
    justify-content: space-between;
}
.item-3 .count img{
    width: .7rem;
    object-fit: cover;
    max-height: .8rem;
}
.item-3 .count span,.item-3 .count p{
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: .625rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51,51,51,1);
}
.item-3 .count p span{
    color: #FF6023
}
</style>
