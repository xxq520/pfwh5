<template>
    <div class="pay">
        <mt-header title="付款" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="payPrice">
            <p class="payTit">需要支付金额(元)</p>
            <p class="price"><i>￥</i>{{order.totalOrderPrice||'选择支付方式'}}</p>
        </div>
        <p class="payType">支付方式</p>
        <ul class="typeList">
            <li v-for="(item,index) in payType"  v-if="item.type!=14" @click="changePay(index)">
                <div>
                    <img :src="item.icon" class="icon" alt="">
                    <!-- 余额支付 -->
                    <div v-if="index==3" class="myMoney">
                        <div>
                            <p>余额支付</p>
                            <span>(可用￥{{item.text}})</span>
                        </div>
                        <div>
                            <span>￥</span>
                            <input @click.stop="" @input="oninput" placeholder="0" v-model.number="moneyVal"
                                   type="number">
                        </div>
                    </div>
                    <span v-else>{{item.text}}</span>
                </div>
                <img :src="item.checked ? checked[1] : checked[0]" class="checked" alt="">
            </li>
        </ul>
        <button class="payButton" v-preventReClick @click="payOrder">立即支付</button>
        <div v-if="isAlert" @click="closeAlert" class="bgc"></div>
        <div v-if="isAlert" class="bgc-box">
            <p class="alert">提示</p>
            <p class="text">是否确认支付?</p>
            <div>
                <p><a :href="href" id="href">确认</a> </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {userAgent, isApp} from '@/assets/js/common';
    import {Toast, Indicator, Popup} from 'mint-ui';

    export default {
        data() {
            return {
                checked: [
                    require("../../../assets/images/block/pf_payment_icon_checkbox_n.png"),
                    require("../../../assets/images/block/pf_payment_icon_checkbox_s.png"),
                ],
                // 支付的方式
                payType: [
                    {
                        icon: require("../../../assets/images/block/pf_payment_icon_WeChatPay.png"),
                        text: "微信支付",
                        type: 9,
                        checked: true
                    },
                    {
                        icon: require("../../../assets/images/block/pf_payment_icon_alipay.png"),
                        text: "支付宝支付",
                        type: 13,
                        checked: false
                    },
                    {
                        icon: 'https://pay.520shq.com/Content/images/unionpay_wap.jpg',
                        text: "银联快捷支付",
                        type: 14,
                        checked: false
                    },
                    {
                        icon: require("../../../assets/images/block/pf_payment_icon_yue.png"),
                        text: "0.00",
                        type: 999,
                        checked: false
                    },
                ],
                // 当前用户信息 支付角色
                seq: "",
                // 用户的余额信息
                totalBalance: 0,
                // 订单数据
                order: {},
                // 使用余额
                moneyVal: '',
                // 跳转地址
                href: '',
                // 是否弹出
                isAlert: false
            }
        },
        created() {
            let order = {};
            let query = this.$route.query;
            // 支付单号
            if (query.totalOrderSn) {
                order.totalOrderSn = query.totalOrderSn;
                order.totalOrderPrice = query.totalOrderPrice;
                this.seq = query.seq;
                this.order = order;
                // 获取用户余额
                this.getUserdBalance();
            } else {
                Toast('缺少支付单号');
                setTimeout(()=>{
                    history.back();
                },1000)
            }
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },
        watch: {
            // 监听余额变化
            totalBalance: {
                handler(newVal, oldVal) {
                    let payType = this.payType[3];
                    payType.text = newVal;
                    this.$set(this.payType, 3, payType)
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            // 关闭弹出
            closeAlert() {
                this.isAlert = false;
            },
            isWx() {
                var ua = navigator.userAgent.toLowerCase();
                return ua.match(/MicroMessenger/i) == 'micromessenger';
            },
            // 余额输入框
            oninput(e) {
                // 通过正则过滤小数点后两位
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
                // 可用余额
                let totalBalance = Number(this.totalBalance);
                // 需支付金额
                let payOrderPrice = Number(this.order.totalOrderPrice);
                // 输入的金额
                let price = e.target.value;
                if (price > payOrderPrice && totalBalance>=payOrderPrice) {
                    Toast('最多可用' + payOrderPrice);
                    this.moneyVal = payOrderPrice;
                } else if (price > totalBalance) {
                    this.moneyVal = totalBalance;
                    Toast('最多可用' + totalBalance);
                } else {
                    this.moneyVal = price;
                }
                this.$set(this.payType[3], 'checked', true);
                if (!price) this.$set(this.payType[3], 'checked', false);
            },
            // 获取用户余额
            getUserdBalance() {
                let userParams = {
                    "orderSn": this.order.totalOrderSn,
                    "usedWhere": 1,
                    "seq": this.seq // 用户seq
                };
                axios.post(this.blockURL + '/qypfs-wallet/balance/totalBalance', userParams).then(res => {
                    res.data.code == 200 ? this.totalBalance = res.data.data : Toast(res.data.message);
                })
            },
            // 返回事件
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            // 点击切换支付方式
            changePay(index) {
                let payType = this.payType;
                if (index < this.payType.length - 1) {
                    for (let i = 0; i < payType.length - 1; i++) {
                        payType[i].checked = false;
                    }
                }
                payType[index].checked = !payType[index].checked;
                this.payType = payType;
                Indicator.open();
                setTimeout(() => {
                    Indicator.close();
                }, 300)
            },
            // 支付订单
            payOrder() {
                let payTypeH5 = "";
                let balance = this.payType[3].checked;
                // 是否选中支付宝支付
                let isZFB = [];
                let changePrice = () => {
                    let paytype = this.payType.filter(item => {
                        return item.checked;
                    });
                    // 是否支付宝支付
                    isZFB = this.payType.filter(item=> {
                        return item.text == "支付宝支付" && item.checked;
                    });
                    payTypeH5 = paytype[0].type
                };
                // 判断选中余额支付
                if (balance) {
                    let totalBalance = Number(this.totalBalance);
                    if (this.moneyVal > totalBalance) {
                        this.moneyVal = totalBalance;
                        Toast('最多可用' + totalBalance);
                        return false;
                    } else if (this.moneyVal > Number(this.order.totalOrderPrice)) {
                        this.moneyVal = Number(this.order.totalOrderPrice);
                        Toast('超出需支付金额');
                        return false;
                    }
                    // 判断是否全余额支付
                    if (Number(this.moneyVal) == Number(this.order.totalOrderPrice)) {
                        payTypeH5 = this.payType[3].type;
                    } else {
                        changePrice();
                    }
                } else {
                    changePrice();
                }
                // 是否是微信浏览器
                if (isZFB[0] && this.isWx()) {
                    Toast('请使用微信外的浏览器打开支付!');
                    return  false
                }
                var params = {
                    "fromDevice": "H5",
                    "payTypeH5": payTypeH5,
                    "totalOrderNo": this.order.totalOrderSn,
                    "returnUrl": `${location.origin}${location.pathname}#/block/paysuccess?orderNo=${this.order.totalOrderSn}`,
                    "useBalance": balance ? this.moneyVal : 0,
                    "userAgentType": userAgent() || "Android"
                };
                // 获取支付所需参数
                axios.post(this.blockURL + '/qypfs-order/api/pay/getPayInfo', params).then(res => {
                    if (res.data.code == 200) {
                        let str = '';
                        // 是否全余额支付
                        if(res.data.data.allUseBalance) {
                            str = params.returnUrl
                        } else {
                            // 是否支付宝支付
                            str = isZFB[0] ? 'alipays://platformapi/startapp?appId=20000067&url='+ encodeURIComponent(res.data.data.payBunch) : res.data.data.payBunch
                        }
                        this.href = str;
                        // 如果是支付宝支付则弹窗是否确认支付  除了支付宝其余的支付方式就跳转支付页面
                         isZFB[0] ? this.isAlert = true : location.href = str;
                    } else {
                        Toast({message: res.data.message,});
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .bgc{
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background: rgba(0,0,0,.4);
    }
    .bgc-box{
        position: fixed;
        top: 50%;
        left: 50%;
        width: 8rem;
        transform: translateX(-50%);
        background: #fff;
        z-index: 100;
        border-radius: 0.2rem;
        text-align: center;
    }
    .bgc-box .alert{
        font-size: 0.6rem;
        height: 1.3rem;
        line-height: 1.3rem;
    }
    .bgc-box .text{
        font-size: 0.58rem;
        color: #7d7d7d;
        height: 2rem;
        line-height: 2rem;
    }
    .bgc-box>div{
        border-top: 1px solid #ccc;
    }
    .bgc-box>div p a{
        width: 100%;
        display: block;
        color: #00AFFF;
        font-size: 0.62rem;
        height: 1.5rem;
        line-height: 1.5rem;
    }
    .pay {
        width: 100vw;
        height: calc(100vh - 44px);
        background-color: #fff;
    }

    .payPrice {
        margin-top: 44px;
        background: #fff;
        height: 6.39rem;
        text-align: center;
        border-top: 1px solid transparent;
    }

    .payPrice .payTit {
        margin-top: 1.7rem;
        margin-bottom: 0.9rem;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .payPrice .price {
        font-size: 1.1rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
    }

    .payPrice .price i {
        font-size: 0.7rem;
    }

    .payType {
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 0.73rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        background: rgba(245, 245, 245, 1);
        padding-left: 0.45rem;
    }

    .typeList {
        padding: 0 0.5rem;
    }

    .typeList li {
        height: 2.27rem;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .typeList li > div {
        display: flex;
        align-items: center;
    }

    .typeList li .icon {
        width: 1.14rem;
        height: 1.14rem;
        margin-right: 0.2rem;
    }

    .typeList li .checked {
        height: 0.82rem;
        width: 0.82rem;
    }

    .payButton {
        width: 80%;
        height: 1.91rem;
        background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
        border-radius: 1rem;
        font-size: 0.68rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        border: none;
        display: block;
        margin: 0 auto;
        margin-top: 5rem;
        outline: none;
    }

    .myMoney {
        display: flex;
        align-items: center;
    }

    .myMoney div:first-child span {
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
    }

    .myMoney div:last-child {
        margin-left: 0.4rem;
        padding: 0.25rem;
        border-radius: 0.2rem;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 500;
        align-items: center;
        background: rgba(255, 209, 192, 1);
        font-size: 0.55rem;
        color: rgba(255, 68, 0, 1);
        display: flex;
    }

    .myMoney div:last-child input {
        background: rgba(255, 209, 192, 1);
        color: rgba(255, 68, 0, 1);
        max-width: 2.8rem;
    }

    .myMoney div:last-child input::placeholder {
        background: rgba(255, 209, 192, 1);
        color: rgba(255, 68, 0, 1);
        max-width: 2.8rem;
    }
</style>
