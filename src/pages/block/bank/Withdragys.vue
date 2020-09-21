<template>
    <div class="warp">
        <mt-header title="提现记录" ref="header" :fixed="true">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>

        <div class="mainbox">
            <div class="balance">
                <div class="item">
                    <label>本月提现</label>
                    <span>￥{{haveWithdrawalMonth}}</span>
                </div>
                <span class="spantext">{{ '(' + (new Date().getMonth() + 1) + '月)' }}</span>
            </div>
            <div class="balance">
                <div class="item">
                    <label>累计总提现</label>
                    <span>￥{{haveWithdrawal}}</span>
                </div>
            </div>
            <div class="balance">
                <div class="item">
                    <label>账户余额</label>
                    <span>￥{{currentTotalBalance}}</span>
                </div>
                <span class="spantext" @click="drawAll">全部提现</span>
            </div>
            <div class="balance">
                <div class="item">
                    <label>提现金额</label>
                    <div class="input-box">
                        <input
                            type="text"
                            placeholder="输入金额"
                            v-model="monery"
                            @focus="showClose"
                            @keyup="shuru($event)"
                            @blur="hideClose($event)"
                        />
                        <i class="el-icon-circle-close" v-show="close" @click="clearFn"></i>
                    </div>
                </div>
            </div>
            <div class="balance">
                <div class="sxf" style="color:#999;">
                    <div class="a1">提现金额(收取0.1%的手续费)</div>
                    <div class="a2">手续费{{sxf}}元</div>
                </div>
            </div>
            <div class="balance" style="border: none;">
                <div class="sxf">
                    <div class="a1">有{{noWithdraw}}元不可提现到卡</div>
                    <div class="a2" @click="tsnqs" style="color: #FF6023;">查看原因</div>
                </div>
            </div>
        </div>
        <div class="tstext">温馨提示：</div>
        <div class="tstext">1、提现手续费按照0.1%收取，不足1元，按照1元收取</div>
        <div class="submit" @click="submit">提现</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                close: false,
                seq: this.$store.state.userInfo.seq,
                userId: this.$store.state.userInfo.userId,
                currentTotalBalance: "",
                withdraw: "",
                noWithdraw: "",
                haveWithdrawalMonth: "",
                haveWithdrawal: "",
                sxf: "",
                monery: "",
                id: this.$route.query.id
            };
        },

        mounted() {
            this.$refs.header.$el.style.background =
                "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.getInfo();
        },
        methods: {
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            //全部提现
            drawAll() {
                this.monery = this.currentTotalBalance;
                this.Paytax(this.monery);
            },
            //提现
            submit() {
                axios({
                    url: this.blockURL + "/qypfs-wallet/withdraw/withdrawal",
                    method: "post",
                    data: {
                        seq: this.seq,
                        userId: this.userId,
                        amount: this.monery,
                        bankCardId: this.id
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast(res.data.message)
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 1500);
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            //获取提现金额信息
            getInfo() {
                axios({
                    url: this.blockURL + "/qypfs-wallet/balance/getBalanceInfo",
                    method: "post",
                    data: { seq: this.seq }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.currentTotalBalance = data.withdraw;
                        this.withdraw = data.withdraw;
                        this.noWithdraw = data.noWithdraw;
                        this.haveWithdrawalMonth = data.haveWithdrawalMonth;
                        this.haveWithdrawal = data.haveWithdrawal;
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            //计算所扣的税
            Paytax(val) {
                axios({
                    url: this.blockURL + "/qypfs-wallet/withdraw/getTax",
                    method: "get",
                    params: { amount: val }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.sxf = data.serviceTax;
                    }
                });
            },
            shuru(event) {
                let elem = event.currentTarget;
                let val = elem.value;
                var reg = /^\d+\.?(\d{1,2})?$/;
                while (!reg.test(val) && val != "") {
                    val = checkStr(val);
                }
                //检查是否符合金额格式:只能输入数字且最多保留小数点后两位
                function checkStr(str) {
                    str = str.substring(0,str.length-1);
                    return str;
                }
                this.monery = val;
                event.currentTarget.value = val;
            },
            hideClose(event) {
                this.close = false;
                let elem = event.currentTarget;
                let val = elem.value;

                let balance = parseFloat(this.currentTotalBalance);
                // console.log(balance,parseFloat(this.monery));
                if (balance < parseFloat(this.monery)) {
                    Toast("余额不足");
                    return false;
                }

                this.Paytax(this.monery);
                event.currentTarget.value = val;
            },
            showClose() {
                this.close = true;
            },
            tsnqs() {
                MessageBox({
                    title: "",
                    message:
                        "消费退换款的资金不能提现到卡，可用于再次购买；发展和管理的佣金可提现到卡",
                    confirmButtonText: "我知道了",
                    showConfirmButton: true
                });
            },
            clearFn() {
                this.monery = "";
            }
        }
    };
</script>
<style scoped>
    .warp {
        background-color: #f2f2f2;
        overflow: hidden;
        margin-top: 2rem;
    }

    .mint-header {
        background-color: #f23030;
        color: #fff;
        height: 44px;
        font-size: 16px;
    }

    .mainbox {
        padding: 0.5rem;
        overflow: hidden;
        background: white;
        margin: 0.3rem 0;
    }

    .balance {
        display: -webkit-flex;

        display: flex;
        width: 100%;
        overflow: hidden;
        font-size: 14px;

        line-height: 2rem;
        border-bottom: 1px solid #eee;
    }

    .balance .item {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex: 1;
        float: left;
        color: #666;
    }

    .balance .item label {
        display: inline-block;
        width: 6em;
    }

    .balance .spantext {
        float: right;
        color: #999;
    }

    .balinput {
        position: relative;
        font-size: 14px;
        margin-top: 10px;
    }

    .balinput .inputtext {
        position: absolute;
        left: 0;
        bottom: -10px;
        color: red;
        font-size: 12px;
    }

    .balance .sxf {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        color: #666;
    }

    .input-box {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex: 1;
    }

    .input-box input {
        flex: 1;
        font-size: 14px;
        line-height: 1.4em;
    }

    .input-box i {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 0.1em;
        color: #666;
    }

    .submit {
        display: block;
        text-align: center;
        color: white;
        padding: 0.4rem 0;
        width: 100%;
        font-size: 14px;
        line-height: 1.6em;
        background: #ff6023;
        border-radius: 3px;
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .tstext {
        width: 100%;
        font-size: 12px;
        color: #999;

        padding: 0 3%;
        line-height: 1.6em;
    }
</style>
