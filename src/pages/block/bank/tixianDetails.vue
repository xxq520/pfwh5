<template>
    <div class="warp">
        <mt-header title="普通账户提现" ref="header" :fixed="true">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="details">
            <p style="line-height: 1.5rem;">货款余额(元)</p>
            <p class="total">{{currentTotalBalance?currentTotalBalance:'0.00'}}</p>
            <div class="partList">
                <div class="part">
                    <p class="title">已提现：</p>
                    <p>{{haveWithdrawal}}</p>
                </div>
                <i class="line"></i>
                <div class="part">
                    <p class="title">不可提现：</p>
                    <p>
                        {{noWithdraw}}
                        <img src="../../../assets/images/wholesale/icon_3333.png" @click="tsnqs" />
                    </p>
                </div>
            </div>
        </div>
        <div class="btnLis">
            <div class="tixian" @click="withdrawal">立即提现</div>
            <div class="record" @click="txjl">提现记录</div>
        </div>
    </div>
</template>
<script>
    import {
        mapActions
    } from "vuex";

    export default {
        data() {
            return {
                abs: "365.00",
                seq: this.$store.state.userInfo.seq,
                userId: this.$store.state.userInfo.userId,
                list: [],
                haveWithdrawal: '',
                currentTotalBalance: '',
                noWithdraw: '',
            };
        },

        mounted() {
            this.$refs.header.$el.style.background =
                "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.getToken();
        },
        methods: {
            ...mapActions(["saveRole"]),
            getToken() {
                var that = this;
                var fromApp = that.$route.query;
                if (fromApp.app) {
                    // 在global中挂载方法
                    window["getAppLogin"] = function (json) {
                        sessionStorage.setItem("bearer", json);
                           that.getUserInfo();
                    };
                    if (sessionStorage.getItem("bearer")) {
                       that.getInfo();
                    }
                } else {
                    that.getInfo();
                }
            },
            getUserInfo() {
                axios.post(this.blockURL + `/qypfs-user/user/findUserShow`).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.seq = data.seq;
                        this.userId = data.userId;
                        this.saveRole(data);
                        this.getInfo();
                    }
                });
            },
            //fanhui
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            txjl() {
                this.$router.push("/block/Witrecord");
            },
            withdrawal() {
                this.$router.push("/block/blank");
            },
            tsnqs() {
                MessageBox({
                    title: "",
                    message: "消费退换款的资金不能提现到卡，可用于再次购买；发展和管理的佣金可提现到卡",
                    confirmButtonText: "我知道了",
                    showConfirmButton: true
                });
            },
            //获取提现金额信息
            getInfo() {
                axios({
                    url: this.blockURL + "/qypfs-wallet/balance/getBalance",
                    method: "post",
                    data: {
                        seq: this.seq
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.currentTotalBalance = data.currentTotalBalance;
                        this.haveWithdrawal = data.haveWithdrawal;
                        this.noWithdraw = data.noWithdraw;
                    } else {
                        Toast(res.data.message);
                    }
                });
            }
        }
    };

</script>
<style scoped>
    .warp {
        min-height: 100vh;
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

    .details {
        background-color: #ffffff;
        padding: 0.5rem;
        border-radius: 0.2222rem;
        margin-top: 0.4rem;
        text-align: center;
        color: #666666;
        font-size: 0.5333rem
            /* 24/45 */
        ;
    }

    .details .total {
        font-size: 1.0667rem;
        color: #f86b1f;
        padding: 0.5rem 0 1.5556rem;
    }

    .details .partList {
        border-top: 1px solid #eeeeee;
        display: flex;
        justify-content: space-around;
        font-size: 0.6rem;
        height: 1.5rem;
        color: #666;
    }

    .details .partList .part {
        width: 48%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .details .partList .part img {
        width: 0.75rem;
        height: 0.75rem;
        margin-left: 0.2rem;
    }

    .details .partList .part p {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btnLis {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 1rem;
        text-align: center;
    }

    .btnLis div {
        padding: 0 1.7111rem;

        width: 70%;
        height: 1.5556rem;
        line-height: 1.5556rem
            /* 70/45 */
        ;
        border-radius: 0.7778rem
            /* 35/45 */
        ;
        font-size: 0.7rem;
        margin-bottom: 0.2rem;
        margin-top: 0.3rem;
    }

    .details .partList .line {
        width: 1px;
        height: inherit;
        background-color: #eeeeee;
        display: block;
    }

    .btnLis div.record {
        border: 1px solid #ff6023;
        color: #ff6023;
        background-color: #ffffff;
    }

    .btnLis div.tixian {
        background-color: #ff6023;
        color: #fefefe;
    }

</style>
