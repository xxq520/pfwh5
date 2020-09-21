<template>
    <div class="payment">
        <mt-header title="分单支付">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div class="money">
            <ul>
                <li>
                    <span>订单总金额</span>
                    <span class="totalAmount">￥{{totalAmount}}</span>
                </li>
                <li>
                    <span>支付金额</span>
                    <template v-if="!listFlag">
                        <div>
                            ￥
                            <input type="number" placeholder="请输入支付金额" v-model="money" @input="handleInput">
                        </div>
                    </template>
                    <template v-else>
                        <span>￥{{money}}</span>
                    </template>
                </li>
            </ul>
        </div>
        <div class="btn" :class="{'btn-gray': listFlag}" @click="sure">
            <span>确定</span>
            <p class="tip" v-if="listFlag && paymentList">每笔支付金额最高5000元，此订单支付需分{{paymentList.length}}笔支付才能完成整个订单支付</p>
        </div>
        <div class="payment-wrap" v-if="listFlag">
            <ul class="payment-list">
                <li v-for="(item, index) in paymentList">
                    <span>第{{index+1}}笔分单</span>
                    <span>￥{{item.PayAmount}}</span>
                    <template v-if="item.PayStatus == 0">
                        <i @click="gotoPay(item.SaleNumber)">支付</i>
                    </template>
                    <template v-else>
                        <span class="payed">已支付</span>
                    </template>
                </li>
            </ul>
            <!-- <div class="btn" @click="canclePayment">
                <span>取消分单</span>
            </div> -->
            <div class="btn" @click="fresh">
                <span>刷新</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {payMixin} from '@/assets/js/mixin'

    export default {
        mixins: [payMixin],
        data() {
            return {
                seq: this.$route.query.iSeq,
                totalAmount: '',
                salenumber: this.$route.query.salenumber,
                money: '',
                isplay: false,
                listFlag: false,
                paymentList: [],
                orderSplitEnd: false,
                fromApp:false,
                status: -1,
            }
        },
        mounted() {
            let fromApp = sessionStorage.getItem('app');
            if(fromApp){
                this.fromApp = fromApp;
            }
            this.getPaymentList();
            this.refresh();
        },
        methods: {
            fresh() {
                this.getPaymentList();
            },
            back(){
                this.$router.back(-1);
            },
            handleInput(e) {
                let val = e.target.value;
                this.money = parseInt(val) ? parseInt(val) : '';
            },
            // 确定支付金额
            sure() {
                let money = String(this.money);
                if(this.money == '') {
                    Toast({
                        message: '请输入支付金额',
                        className: 'counttc',
                        duration: 2000
                    });
                } else if(this.money < 500) {
                    Toast({
                        message: '支付金额不能小于500元',
                        className: 'counttc',
                        duration: 2000
                    });
                } else if(this.money > 5000) {
                    Toast({
                        message: '支付金额不能大于5000元',
                        className: 'counttc',
                        duration: 2000
                    });

                }else if(money.charAt(money.length-1) != 0 || money.charAt(money.length-2) != 0) {
                    Toast({
                        message: '请输入整百的支付金额',
                        className: 'counttc',
                        duration: 2000
                    });
                }  else {
                    if(!this.listFlag) {
                        MessageBox.confirm('是否确定按此金额分单支付？', '').then(action => {
                            let post = {
                                seq: this.seq,
                                salenumber: this.salenumber,
                                splitAmount: Number(this.money)
                            }
                            axios.post(this.URL + '/OrdersPay/SetOrderNewSplitPay',post).then(res => {
                                if(res.data.code == 200){
                                    this.getPaymentList();
                                };
                            })
                            this.listFlag = true;
                        }, action => {});
                    }
                }
            },
            getPaymentList() {
                axios.get(this.URL+'/OrdersPay/GetOrderNewSplitList', {params : {seq : this.seq, salenumber : this.salenumber}})
                .then((res)=>{
                    if(res.data.code == 200) {
                        let data = res.data.data;
                        this.paymentList = data.orderSplitDtl;
                        this.orderSplitEnd = data.orderSplitEnd;
                        this.totalAmount = data.OrderAmount;
                        this.money = data.SplitRatio;
                        this.status = data.Status;
                        if(this.status != -1) {
                            this.listFlag = true;
                        }
                    }
                })
            },
            // 支付
            gotoPay(salenumber) {
                if(this.fromApp){
                    window.action.AppGoPay(salenumber, this.seq, '10019', this.orderSplitEnd);
                }else{
                    console('1111');
                    this.payLink()
                }
            },
            // 取消支付
            canclePayment() {
                MessageBox.confirm('是否确定取消支付？', '').then(action => {
                    let post = {
                        seq: this.seq,
                        salenumber: this.salenumber
                    }
                    axios.post(this.URL + '/OrdersPay/CancelOrderNewSplitPay',post).then(res => {
                        if(res.data.code == 200){
                            Toast({
                                message: '取消支付成功',
                                className: 'counttc',
                                duration: 2000
                            });

                        };
                    })
                }, action => {});
            },
            // APP支付成功返回页面重新加载
            refresh(){
                let that = this;
                window['getPaymentLists'] = function(){
                    that.getPaymentList()
                }
            }
        }
    }
</script>

<style scoped>
    .payment .mint-header {
        background: #e3393a;
        color: #fff;
        border-bottom: 0;
    }
    .money ul {
        background: #fff;
    }
    .money ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        font-size: .6667rem /* 30/45 */;
        line-height: 1.9556rem /* 88/45 */;
        padding: 0 .5333rem /* 24/45 */;
    }
    .money ul li:last-of-type {
        border-bottom: none;
    }
    .money .totalAmount {
        color: #ff0002;
    }
    .money input {
        width: 4.9333rem /* 222/45 */;
        height: 1.2889rem /* 58/45 */;
        text-align: center;
        border: 1px solid #a0a0a0;
        border-radius: 50px;
    }
    .btn {
        margin: .4444rem /* 20/45 */ .7778rem /* 35/45 */;
    }
    .btn span {
        background: #e3393a;
        display: block;
        text-align: center;
        color: #fff;
        font-size: .7556rem /* 34/45 */;
        height: 1.9556rem /* 88/45 */;
        line-height: 1.9556rem /* 88/45 */;
        border-radius: .2222rem /* 10/45 */;
    }
    .btn .tip {
        font-size: .5333rem /* 24/45 */;
        color: #ff0002;
        padding: .4444rem /* 20/45 */ 0;
    }
    .btn-gray span {
        background: #e1e1e1;
    }
    .payment-list {
        background: #fff;
        font-size: .6667rem /* 30/45 */;
    }
    .payment-list li {
        padding: 0 .5333rem /* 24/45 */;
        height: 3.0667rem /* 138/45 */;
        line-height: 3.0667rem /* 138/45 */;
        border-radius: .2222rem /* 10/45 */;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
    }
    .payment-list li i {
        width: 2.6667rem /* 120/45 */;
        height: 1.0667rem /* 48/45 */;
        line-height: 1.0667rem /* 48/45 */;
        display: inline-block;
        background: #3ea7f1;
        color: #fff;
        text-align: center;
        border-radius: .2222rem /* 10/45 */;

    }
    .payment-list ul li:last-of-type {
        border-bottom: none;
    }
    .payment-list .payed {
        color: #ff0002;
        width: 2.6667rem /* 120/45 */;
        height: 1.0667rem /* 48/45 */;
        line-height: 1.0667rem /* 48/45 */;
        display: inline-block;
        text-align: center;
    }
</style>
