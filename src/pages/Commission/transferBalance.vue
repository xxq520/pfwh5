<template>
    <div class="balance-wrap">
        <mt-header title="转余额">
            <router-link slot='left' :to="{ path: '/wholesale/commissionOperation', query: { type: 4 }}">
                <mt-button icon='back'></mt-button>
            </router-link>
            <router-link to="" slot="right" class="setting"><span>常用账号管理</span><i class="el-icon-setting"></i></router-link>
        </mt-header>
        <div class="list">
            <ul>
                <li>
                    <p>现有金额：</p>
                    <span>{{Balance}}元</span>
                </li>
                <li>
                    <p>线下服务中心<em>*</em>：</p>
                    <input type="text" v-model.trim="searchValue" placeholder="如***线下服务中心" class="input-search">
                    <i class="btn" @click="searchServiceCenterList">搜索</i>
                </li>
                <li>
                    <p>转移的线下服务中心名称<em>*</em></p>
                    <div @click="getServiceCenterList">
                        <span>{{selectedValue}}</span>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </li>
                <li>
                    <p>线下服务中心账号<em>*</em></p>
                    <span>{{selectedAccount}}</span>
                </li>
                <li>
                    <p>转换金额<em>*</em></p>
                    <input type="text" placeholder="必填" v-model.trim="Amount">
                </li>
                <li>
                    <p>手机号</p>
                    <span>{{userMobile}}</span>
                </li>
                <li>
                    <p>验证码<em>*</em></p>
                    <input type="text" placeholder="请输入验证码" v-model.trim="verification">
                    <i class="btn" @click="getMessage">{{btnText}}</i>
                </li>
                <li>
                    <p class="tip">温馨提示：每天接收短信上限10条，如果您没有收到短信请第二天再试</p>
                </li>
            </ul>
        </div>
        <div class="submit-btn">
            <span @click="transferredBalance">确认</span>
        </div>
        <mt-popup v-model="popupVisible" position="bottom" :closeOnClickModal="false">
            <div class="tab">
                <button class="cancle" @click="isShowPopup">取消</button>
                <p class="title">转移的线下服务中心名称</p>
                <button class="comit" @click="getValues">确定</button>
            </div>
            <mt-picker :slots="isPicker?slots:slotss" valueKey="name" ref="picker"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
import {showToast} from "@/assets/js/common.js"
export default {
    data (){
        return {
            userMobile:sessionStorage.getItem("mobile"),
            popupVisible:false,
            isPicker:0,
            searchValue:"",//搜索线下服务中心关键词
            slots:[{values:[]}],//下拉列表数据
            slotss:[{values:[]}],//下拉列表数据
            selectedValue:"必填",//绑定线下服务中心选中的名称
            selectedAccount:"",//绑定线下服务中心选中的账号
            selectedSeq:"",//绑定线下服务中心选中的seq
            btnText:"获取验证码",
            Balance:"",//余额
            AccountId:"",//用户id
            verification:"",//验证码
            Amount:"",//转余额
            readonly:false,//控制提交按钮连续点击
        }
    },
    mounted(){
        this.getBalance();
    },
    methods: {
        // 获取余额
        getBalance(){
            axios.get(this.URL + "/Earnings/GetUserAccountInfo",{params:{userSeq:sessionStorage.getItem("seq")}})
            .then(res => {
                if(res.data.code == 200){
                    this.Balance = (res.data.data.Balance).toFixed(2);
                    this.AccountId = res.data.data.AccountId;
                }
            })
            .catch(err => {

            })
        },
        // 开启关闭遮罩层
        isShowPopup(){
            this.popupVisible = !this.popupVisible;
        },
        // 选择选项
        getValues(){
            this.selectedValue = this.$refs.picker.getValues()[0]["name"];
            this.selectedAccount = this.$refs.picker.getValues()[0]["login_name"];
            this.selectedSeq = this.$refs.picker.getValues()[0]["seq"];
            this.popupVisible = false;
        },
        // 搜索转余额的线下服务中心
        searchServiceCenterList(){
            if(this.searchValue == "") {
                showToast("搜索关键词不能为空");
                return;
            }
            let jsons = {
                queryJson:{
                    type:"name",
                    keyWord:this.searchValue
                }
            }
            this.isPicker = 0;
            axios.get(this.URL + "/Earnings/GetMoreOtherUserListJson",{params:jsons})
                .then(res => {
                    if(res.data.code == 200){
                        this.slotss[0]["values"] = res.data.data;
                        this.popupVisible = true;
                    }
                })
                .catch(err => {

                })
        },
        // 获取绑定的线下服务中心
        getServiceCenterList(){
            let datas = {
                userSeq:sessionStorage.getItem("seq"),
                queryJson:{}
            }
            this.isPicker = 1;
            axios.get(this.URL + "/Earnings/GetOtherUserModelListJson",{params:datas})
            .then(res => {
                if(res.data.code == 200){
                    this.slots[0]["values"] = res.data.data;
                    this.popupVisible = true;
                    this.searchValue = "";
                }
            })
            .catch(err => {

            })
        },
        // 获取短信
        getMessage(){
            // this.userMobile
            this.countDown();
            let params = {
                type:0,
                mobile:"18802036467",
                smsStr:"18802036467"
            };
            axios.get(this.URL + "/Earnings/GetUserVerificationCode",{params:params})
            .then(res => {
                console.log(res);
            })
            .catch(err =>{

            });
        },
        //倒计时
        countDown(){
            let self = this;
            let count = 60;
            let timer = null;
            timer = setInterval(()=>{
                if(count >=0){
                    this.btnText = (count + "s");
                    count--;
                    this.disabled = true;
                }else{
                    clearInterval(timer);
                    timer = null;
                    this.btnText="获取验证码";
                    this.disabled = false;
                }
            },1000);
        },
        // 提交转余额
        transferredBalance(){
            if(this.readonly) return;

            if(this.selectedSeq == ""){
                showToast("请选择要转入的线下服务中心");
                return;
            }
            if(this.Amount == "" || this.Amount <= 0){
                showToast("请填写正确的转出金额");
                return;
            }
            if(this.verification == ""){
                showToast("短信验证码不能为空");
                return;
            }
            let params = {
                userSeq:sessionStorage.getItem("seq"),
                mobile:this.userMobile,
                verification:this.verification,
                accountId:this.AccountId,
                transferType:0,
                Amount:this.Amount,
                transferSeq:this.selectedSeq
            }
            axios.post(this.URL + "/Earnings/AddApplyForTransfer",params)
            .then(res => {
                if(res.data.code == 200){
                    this.$router.push("/wholesale/bill");
                    this.readonly = true;
                }else{
                    this.readonly = false;
                    showToast(res.data.message);
                }

            })
            .catch(err => {
                this.readonly = false;
            })
        }
    }
}
</script>

<style>
.balance-wrap {
    padding-bottom: 2.8889rem /* 130/45 */;
}
.balance-wrap .mint-header {
    background: #ef4628;
    color: #fff;
}
.balance-wrap .mint-header .setting {
    font-size: .5333rem /* 24/45 */;
}
.balance-wrap .mint-header .setting > * {
    display: inline-block;
    vertical-align: middle;
}
.balance-wrap .mint-header .setting i {
    font-size: .8rem /* 36/45 */;
    margin-left: .2222rem /* 10/45 */;
}
.balance-wrap .list ul{
    background: #fff;
    border-radius: .2222rem /* 10/45 */;
    margin: .4444rem /* 20/45 */  .3333rem /* 10/45 */;
    padding: 0 .2222rem /* 10/45 */;
}
.balance-wrap .list li{
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
      font-size: .6222rem /* 28/45 */;
}
.balance-wrap .list li:nth-last-of-type(1) {
    border-bottom: 0;
}
.balance-wrap .list li p {
    font-size: .6222rem /* 28/45 */;
    line-height: .6222rem /* 28/45 */;
}
.balance-wrap .list li input{
    font-size: .6222rem /* 28/45 */;
    text-align: right;
}
.balance-wrap .list li .input-search{
    text-align:left;
}
.balance-wrap .list li i {
    font-size: .7111rem /* 32/45 */;
}
.balance-wrap .list li .tip {
    font-size: .5333rem;
}
.balance-wrap .list li .btn {
    font-size: .5333rem /* 24/45 */;
    min-width: 2.6667rem /* 120/45 */;
    text-align: center;
    line-height: 1.3333rem /* 60/45 */;
    height: 1.3333rem /* 60/45 */;
    background: #3da1ff;
    color: #fff;
    border-radius: .2222rem /* 10/45 */;
    display: inline-block;
    padding: 0 .4444rem /* 20/45 */;
}
.balance-wrap .list li em {
    color: #ef4628;
    font-style: normal;
}
.balance-wrap .submit-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: .6222rem /* 28/45 */;
    color: #fff;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    background: #ef4628;
}
.balance-wrap .mint-popup{
    width:100%;
}
.balance-wrap .picker-slot{
    width:100%;
}
.balance-wrap .tab{
    display:flex;
    justify-content: space-between;
    align-items:center;
    padding:.3333rem .5333rem;
    border-bottom:1px solid #ccc;
}
.balance-wrap .tab button{
    border:0 none;
    background-color:transparent;
    font-size:.6222rem;
    outline-style: none;
}
.balance-wrap .tab .cancle{
    color:#999;
}
.balance-wrap .tab .comit{
    color:#ef4628;
}
.balance-wrap .tab .title{
    font-size:.6222rem;
    color:#666;
}
</style>
