<template>
    <div class="editSpec">
        <mt-header title="商品规格设置">
            <router-link slot='left' to="/wholesale/addGood">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="spec box">
            <h1>规格</h1>
            <ul>
                <li v-for="(item, index) in specList" :key="index">
                    <p>{{item.name}}</p>
                    <input type="text" :placeholder="'请输入'+item.name" v-model="item.val">
                    <i @click='delect(item.name)'>删除</i>
                </li>
            </ul>
            <span class="addSpec" @click="addSpec"><i class="el-icon-circle-plus-outline"></i>添加新参数</span>
        </div>
        <div class="goodInfo box">
            <h1>价格/库存</h1>
            <div>
                <input type="number" placeholder="输入销售价" v-model="salesPrice" @input="handleInput($event, 'salesPrice')" onkeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))">
                <input type="number" placeholder="输入成本价" v-model="costPrice" @input="handleInput($event, 'costPrice')" onkeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))">
                <input type="number" placeholder="输入建议零售价" v-model="retailPrice" @input="handleInput($event, 'retailPrice')" onkeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))">
                <input type="number" placeholder="输入库存" v-model="stock" @input="handleInput($event, 'stock')" onkeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))">
                <input type="number" placeholder="输入起订量" v-model="moq" @input="handleInput($event, 'moq')" onkeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))">
            </div>
        </div>
        <div class="submit-btn" @click="sure">
            <span>确认</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            specList: [],
            salesPrice: '',
            costPrice: '',
            retailPrice: '',
            stock: '',
            specListIndex: 0,
            moq: '',
        }
    },
    mounted() {
        let data = JSON.parse(sessionStorage.getItem('specData'));
        if(data) {
            this.specList = data.specList;
            this.salesPrice = data.salesPrice;
            this.costPrice = data.costPrice;
            this.retailPrice = data.retailPrice;
            this.stock = data.stock;
            this.moq = data.moq;
        }
    },
    methods: {
        // 添加规格
        addSpec() {
            MessageBox.prompt('', {
                title: '',
                message: '添加新参数',
                closeOnClickModal: false,
            }).then(({ value }) => {
                if(value) {
                    const index = this.specList.findIndex((list) => {
                        return list.name === value;
                    })
                    if(index < 0) {
                        let data = {
                            name: value,
                            val: ""
                        }
                        this.specList.push(data)
                    }
                }
            }).catch(() => {});
        },
        // 删除规格
        delect(item) {
            const index = this.specList.findIndex((list) => {
                return list.name === item;
            })
            this.specList.splice(index, 1);
        },
        // 填写数量
        handleInput(e, elem) {
            if(elem == 'salesPrice') {
                this.salesPrice = e.target.value;
            }     
            if(elem == 'costPrice') {
                this.costPrice = e.target.value;
            }   
            if(elem == 'retailPrice') {
                this.retailPrice = e.target.value;
            }   
            if(elem == 'stock') {
                let val = e.target.value.replace(/[^0-9-]+/,'');
                this.stock = parseInt(val) < 1 ? 1 : parseInt(val);
            }    
            if(elem == 'moq') {
                let val = e.target.value.replace(/[^0-9-]+/,'');
                this.moq = parseInt(val) < 1 ? 1 : parseInt(val);
            }    
        },
        // 确认
        sure() {
            console.log(this.specList)
            if(JSON.stringify(this.specList) == "[]") {
                Toast({
                    message: '请至少添加一个规格',
                    duration: 2000
                });
                return false;
            } else {
                for(let i = 0; i < this.specList.length; i++){
                    if(this.specList[i].val == '') {
                        Toast({
                            message: '请输入规格参数',
                            duration: 2000
                        });
                        return false;
                    }
                }
            }
            let reg = /^[0-9]\d{0,5}(\.\d{1,2})?$/;
            if(!this.salesPrice) {
                Toast({
                    message: '请输入销售价',
                    duration: 2000
                });
                return false;
            }
            if(!reg.test(this.salesPrice)) {
                Toast({
                    message: '请正确输入销售价',
                    duration: 2000
                });
                return false;
            }
            if(!this.costPrice) {
                Toast({
                    message: '请输入成本价',
                    duration: 2000
                });
                return false;
            }
            if(!reg.test(this.costPrice)) {
                Toast({
                    message: '请正确输入成本价',
                    duration: 2000
                });
                return false;
            }
            if(!this.retailPrice) {
                Toast({
                    message: '请输入建议零售价',
                    duration: 2000
                });
                return false;
            }
            if(!reg.test(this.retailPrice)) {
                Toast({
                    message: '请正确输入建议零售价',
                    duration: 2000
                });
                return false;
            }
            if(!this.stock) {
                Toast({
                    message: '请输入库存',
                    duration: 2000
                });
                return false;
            }
            if(!this.moq) {
                Toast({
                    message: '请输入起订量',
                    duration: 2000
                });
                return false;
            }
            let data = {
                specList: this.specList,
                salesPrice: this.salesPrice,
                costPrice: this.costPrice,
                retailPrice: this.retailPrice,
                stock: this.stock,
                moq: this.moq
            }
            sessionStorage.setItem('specData', JSON.stringify(data));
            this.$router.push({
                path: '/wholesale/addGood'
            })
           
        }
    }
}
</script>

<style scoped>
    .editSpec {
        padding-bottom: 2.8889rem /* 130/45 */;
    }
    .box {
        padding: 0 .5333rem /* 24/45 */;
        background: #fff;
        margin-top: .4444rem /* 20/45 */;
    }
    .box h1 {
        font-size: .6667rem /* 30/45 */;
        line-height: 1.9556rem /* 88/45 */;
    }
    .spec li {
        margin-bottom: .4889rem /* 22/45 */;
    }
    .spec li >* {
        display: inline-block;
        vertical-align: middle;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
        font-size: .5778rem /* 26/45 */;
        border: 1px solid #cbcbcb;
        text-align: center;
        border-radius: .2222rem /* 10/45 */
    }
    .spec li i {
        border: none;
        color: red;
        float: right;
        width: 2.2222rem /* 100/45 */;
    }
    .spec li p {
        width: 3.5556rem /* 160/45 */;
        margin-right: 1.1111rem /* 50/45 */;
    }
    .spec li input {
        background: #eee;
    }
    .addSpec {
        font-size: .5778rem /* 26/45 */;
        color: #2eb0fb;
        display: block;
        width: 4.4444rem /* 200/45 */;
        padding-bottom: .7111rem /* 32/45 */;
    }
    .goodInfo input {
        display: inline-block;
        vertical-align: middle;
        background: #eee;
        height: 1.3333rem /* 60/45 */;
        line-height: 1.3333rem /* 60/45 */;
        text-align: center;
        margin-bottom: .7111rem /* 32/45 */;
        border: 1px solid #cbcbcb;
        border-radius: .2222rem /* 10/45 */;
        margin-right: .4444rem /* 20/45 */;
    }
    .goodInfo input:nth-of-type(2n) {
        margin-right: 0;
    }
    .submit-btn {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: .7111rem /* 32/45 */;
        color: #fff;
        height: 2.1778rem /* 98/45 */;
        line-height: 2.1778rem /* 98/45 */;
        background: #ef4628;
    }
</style>