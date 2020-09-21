<template>
    <div class="global blockmyAddress">
        <mt-header title="收货地址列表" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
            <mt-button slot="right" @click="toeditaddr">新增地址</mt-button>
        </mt-header>
        <div class="addresswrap">
            <div class="addresslist" v-for=" (item,index) in addrList" :key="index">
                <div class="contentwrap" @click="getAddress(item)">
                    <div class="ptel">{{item.userName}} <span style="margin-left: 0.5rem;">{{item.mobileNumber}}</span>
                    </div>
                    <div class="detail"><span style="color: #FF6023;"
                            v-show="item.isDefault">[默认地址]</span>{{item.regionProvinceName+item.regionCityName+item.regionDistrictName+item.address}}
                    </div>
                </div>
                <div class="bottomwrap">
                    <label @click="showDefault(item.id)">
                        <input type="radio" name="defalt" class=" radio_type">
                        <span class="b-radio" style="margin-left: 0.4rem;" :class="{moren:item.IsDefault }"></span>默认地址
                    </label>
                    <div class="iconwrap">
                        <span class="editwrap el-icon-edit-outline" @click="pusheditaddr(item.id)">编辑</span> <span
                            style="display: inline-block;margin: -0.3rem 0.3rem; width: 1px;height: 20px;background-color: #999;"></span>
                        <span class="editwrap el-icon-delete" @click="deletaddr(item.id)">删除</span>
                    </div>
                </div>
            </div>
            <p class="noData" v-if="addrList.length == 0">~暂无收货地址~</p>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {
        MessageBox
    } from 'mint-ui';
    import {
        showToast
    } from '../../assets/js/common.js'
    export default {
        name: 'myaddress',
        data() {
            return {
                addrList: [],
                seq: sessionStorage.seq,
                id: []
            }
        },
        created() {

        },
        mounted() {

            //获取地址列表
            this.getAddressList()
            //动态设置背景颜色
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))"
            this.$refs.header.$el.style.color = "#fff"
            document.querySelector("body").setAttribute("style", "background-color:#f5f5f5");
        },
        methods: {
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            // 跳到新增地址
            toeditaddr() {
                this.$router.push({
                    path: '/block/newAdder'
                })
            },
            // 设为默认地址弹窗
            showDefault(id) {
                MessageBox({
                    message: '是否设为默认地址?',
                    title: '',
                    confirmButtonText: '确认设置',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'sureaddress',
                    cancelButtonClass: 'canceladdress',
                    showCancelButton: true
                }).then(action => {
                    if (action == 'confirm') {
                        axios({
                            url: this.blockURL + '/qypfs-user/userShippingAddress/setDefault',
                            method: 'POST',
                            data: {
                                shoppingAddressId: id,
                            }
                        }).then(res => {
                            if (res.status == 200) {
                                this.getAddressList();
                            }
                        })
                    }

                })
            },
            //获取地址列表
            getAddressList() {
                axios.get(this.blockURL + '/qypfs-user/userShippingAddress/list').then(res => {
                    if (res.data.code == 200) {
                        this.addrList = res.data.data;

                    } else {
                        showToast('网络错误，请重试', 'middle')
                    }
                })
            },
            //点击删除提示弹窗
            deletaddr(id) {
                MessageBox({
                    message: '是否删除地址',
                    title: '',
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'sureaddress',
                    cancelButtonClass: 'canceladdress',
                    showCancelButton: true
                }).then(action => {
                    if (action == 'confirm') {

                        axios({
                            url: this.blockURL + '/qypfs-user/userShippingAddress/delete',
                            method: 'POST',
                            data: {
                                shoppingAddressId: id,
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.getAddressList();
                                Toast(res.data.message)
                            }
                        })
                    }
                })
            },
            //跳转到编辑地址页面
            pusheditaddr(id) {
                this.$router.push({
                    path: '/block/newAdder',
                    query: {id:id}
                })
            },
            getAddress(val) {
                if (this.$route.query.tolink == 'confirmoder') {
                    sessionStorage.setItem('setAddress', JSON.stringify(val));
                    this.$router.go(-1);
                };
            }
        }
    }

</script>

<style scoped>
    .noData {
        overflow: hidden;
        padding: 1rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        color: #ccc;
    }

    /* 信息提示弹窗样式重置 */
    /* 去除弹框提示 */
    .sureaddress {
        color: #ff4a4a;
    }

    .radio_type {
        width: 16px;
        height: 16px;
        appearance: none;
        position: relative;
        top: -2px;
    }

    .radio_type:before {
        content: '';
        width: 16px;
        height: 16px;
        border: 1px solid #7d7d7d;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
    }

    .radio_type:checked:before {
        content: '';
        width: 16px;
        height: 16px;
        border: 1px solid #FF6023;
        background: #FF6023;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
    }

    .radio_type:checked:after {
        content: '';
        width: 10px;
        height: 5px;
        border: 2px solid white;
        border-top: transparent;
        border-right: transparent;
        text-align: center;
        display: block;
        position: absolute;
        top: 5px;
        left: 3px;
        vertical-align: middle;
        transform: rotate(-45deg);
    }

    .radio_type:checked+label {
        color: #c59c5a;
    }

    .canceladdress {
        height: 20px;
        line-height: 20px;
        margin-top: 9px;
    }

    .addresswrap .addresslist {
        margin-top: .4444rem;
        background: #fff;
        color: #212121;
        padding: .3rem;
        border-radius: 0.3rem;
    }

    .addresswrap .addresslist .contentwrap {
        padding: 0.4rem 0;
        border-bottom: 1px solid #e6e6e6;
    }

    .addresswrap .addresslist .detail {
        font-size: .545rem;
    }

    .addresswrap .addresslist .ptel {

        font-size: .58rem;
        line-height: 1.2rem;

    }

    .addresswrap .addresslist .bottomwrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* 单选框样式重置 */
    .addresswrap .addresslist .bottomwrap label {
        font-size: .6222rem
            /* 28/45 */
        ;
        color: #999;
        display: flex;
        align-items: center;
    }

    .addresswrap .addresslist .bottomwrap .mint-cell-wrapper {
        padding-left: 0px;
    }


    .addresswrap .addresslist .bottomwrap .editwrap {
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #4c4c4c;
        height: 1.7778rem
            /* 80/45 */
        ;
        line-height: 1.7778rem
            /* 80/45 */
        ;
    }

    .global {
        padding: 2rem 0.5rem;
    }

</style>
