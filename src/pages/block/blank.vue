<template>
    <div class="user-management">
        <!-- header -->
        <mt-header title="银行卡" ref="header" :fixed="true">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <!---->
        <div v-if="bank.length>0" style="margin-top: 0.5rem;">
            <div class="cartList" v-for="(item,index) in bank" :key="index">
                <div class="text">
                    <div class="bankname">
                        <img src="../../assets/images/wholesale/bank.png" />
                        {{item.subBranch}}
                    </div>
                    <div class="numbers">
                        <span>{{ item.cardNumber }}</span>
                    </div>
                </div>
                <div class="buttext">
                    <div class="but">
                        <span style="color:#ff6e04;" @click="gotixian(item.id)">提现</span>
                        <i>|</i>
                        <span @click="removebank(item)">解绑</span>
                    </div>
                </div>
            </div>
            <div class="banklist" style="margin-bottom:0;" @click="withdrawal">
                <div class="text">
                    <div class="addtext">+添加银行卡</div>
                </div>
            </div>
        </div>

        <div class="blank" v-else>
            <img :src="require('../../assets/images/icon_bankcat.png')" alt />
            <p>您还没有绑定银行卡 马上去绑定银行卡吧！</p>
            <p @click="withdrawal">马上绑卡</p>
        </div>
    </div>
</template>
<script>
    import {
        showToast
    } from "@/assets/js/common.js";
    import {
        Toast
    } from "mint-ui";
    import {
        mapActions
    } from "vuex";

    export default {
        data() {
            return {
                bank: []
            };
        },
        components: {},
        created() {},
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
                     if (sessionStorage.getItem("bearer")) {
                     that.getInfo();
                     }
                    
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
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            withdrawal() {
                 if (sessionStorage.getItem("bearer")) {
                  this.$router.push("/block/bank");
                 }else{
                     Toast('此功能未开放')
                 }
               
            },
            gotixian(id) {
                this.$router.push({
                    path: "/block/Withdragys",
                    query: {
                        id: id
                    }
                });
            },
            //获取银行卡列表的信息
            getInfo() {
                axios({
                    url: this.blockURL + "/qypfs-user/userBankCard/cards",
                    method: "get"
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.bank = data;
                    } else {
                        Toast(res.data.message);
                    }
                });
            },
            removebank(obj) {
                let that = this;
                MessageBox({
                    title: "",
                    message: "确定要解绑" +
                        obj.subBranch +
                        "尾号为" +
                        obj.cardNumber.substr(-4) +
                        "的银行卡吗？",
                    showCancelButton: true
                }).then(action => {
                    if (action === "confirm") {
                        axios({
                            url: this.blockURL + "/qypfs-user/userBankCard/deleteCard",
                            method: "post",
                            data: {
                                bankId: obj.id
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                that.popupVisible = false;

                                Toast(
                                    "尾号为" +
                                    obj.cardNumber.substr(-4) +
                                    "的" +
                                    obj.subBranch +
                                    "银行卡解绑成功！"
                                );
                                this.getInfo();
                            } else {
                                Toast(res.data.message);
                            }
                        });
                    } else {
                        that.popupVisible = false;
                    }
                });
            }
        }
    };

</script>
<style scoped>
    .user-management {
        padding: 0.5rem;
        padding-top: 2rem;
    }

    .blank {
        width: 6rem;
        margin: 0 auto;
        margin-top: 5rem;
    }

    .blank p {
        font-size: 0.59rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 0.75rem;
    }

    .blank p:last-child {
        width: 3.5rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        background: rgba(255, 96, 35, 1);
        color: #fff;
        margin: 0 auto;
        margin-top: 0.7rem;
    }

    .mint-header {
        background-color: #f23030;
        color: #fff;
        height: 44px;
        font-size: 16px;
    }

    .cartList {
        background-color: #ffffff;
        width: 100%;
        padding: 0.6667rem 1.2667rem;
        margin-bottom: 0.5rem;
        box-sizing: border-box;
        border-radius: 0.2222rem;
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .cartList .text {
        flex: 1;
    }

    .cartList .buttext {
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 0.6rem;
        color: #666;
    }

    .cartList .buttext .but i {
        padding: 0 0.7em;
        color: #e9e9e9;
    }

    .cartList .text .bankname {
        font-size: 0.65rem;
        line-height: 1.2rem;
        color: #333;
        margin-bottom: 0.4em;
    }

    .cartList .text .addtext {
        font-size: 0.65rem;
        line-height: 1.2rem;
        color: #fe7000;
    }

    .cartList .text .bankname img {
        width: auto;
        height: 1em;
        vertical-align: middle;
        padding-right: 0.5em;
    }

    .cartList .text .bankname .state {
        color: #fe7000;
        font-size: 0.6rem;
        margin-left: 0.4444rem
            /* 20/45 */
        ;
    }

    .cartList .text .numbers {
        font-size: 0.6rem;
        line-height: 1.2rem;
        color: #999;
    }

    .banklist {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        align-items: stretch;
        padding: 0 0.8em;
        background: white;
        border-radius: 5px;
        margin-bottom: 0.5em;
    }

    .banklist .text {
        flex: 1;
        margin: 0.6em 0;
    }

    .banklist .text .addtext {
        font-size: 0.6rem;
        line-height: 1.8em;
        color: #fe7000;
    }

</style>
