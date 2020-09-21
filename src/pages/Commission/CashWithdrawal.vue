<template>
  <div class="cash-withdrawal">
      <mt-header title="提现" class="mt-header" fixed>
          <router-link :to="{ path: '/wholesale/myBalance'}" slot="left">
              <mt-button icon="back"></mt-button>
          </router-link>
      </mt-header>
      <div class="main">
          <div class="con">
              <div class="items">
                  <p>现有金额</p>
                  <span>¥{{Balance.toFixed(2)}}</span>
              </div>
              <div class="items">
                  <p>提现人<span class="important">*</span></p>
                  <span>{{user}}</span>
              </div>
              <div class="items">
                  <p>提现人手机号<span class="important">*</span></p>
                  <span>{{mobile}}</span>
              </div>
              <div class="items" @click="showPopup">
                  <p>提现人开户号<span class="important">*</span></p>
                  <span>{{bankName}}</span>
              </div>
              <div class="items">
                  <p>提现人银行支行<span class="important">*</span></p>
                  <span>{{bankBranch}}</span>
              </div>
              <div class="items">
                  <p>提现人开户名<span class="important">*</span></p>
                  <span>{{bankUser}}</span>
              </div>
              <div class="items">
                  <p>提现人银行卡号<span class="important">*</span></p>
                  <span>{{bankNum}}</span>
              </div>
          </div>
          <div class="con">
              <div class="items">
                  <p>提现金额<span class="important">*</span></p>
                  <input type="number" name="" value="" placeholder="请输入提现金额" class="amount-input" @input="taxInspection" v-model="amount">
              </div>
              <div class="items">
                  <p>扣税金额</p>
                  <span>¥{{taxDeduction.toFixed(2)}}</span>
              </div>
              <div class="items">
                  <p>税后金额</p>
                  <span>¥{{afterTax.toFixed(2)}}</span>
              </div>
          </div>
          <div class="con last-con">
              <div class="items">
                <p> 短信验证码<span class="important">*</span></p>
                <input type="text" name="" value="" placeholder="请输入短信验证码" class="mes-input" v-model="msgCode">
                <button type="button" name="button" class="messages" @click="getMessage" :disabled="disabled">{{btnText}}</button>
              </div>
              <div class="items">
                  <p class="tips">温馨提示：每天接收短信上限10条，如果您没有收到短信请第二天再试</p>
              </div>
          </div>
          <button type="button" name="button" class="btn" @click="submitApply">确认</button>
      </div>
      <mt-popup v-model="popupVisible" position="bottom" lockScroll="true">
          <mt-picker :slots="slots" valueKey="bank_name" :showToolbar="true" ref="picker">
              <div class="tool-bar">
                  <button type="button" name="button" class="cancle" @click="showPopup">取消</button>
                  <p>请选择开户行</p>
                  <button type="button" name="button" class="commit" @click="chooseItem">确定</button>
              </div>
          </mt-picker>
      </mt-popup>
  </div>
</template>

<script>
import {showToast,countDown} from "@/assets/js/common.js";
export default {
    data () {
        return {
            mobile:"",//用户手机号
            user:"",//用户名
            seq:"",//用seq
            Balance:0,//余额
            AccountId:'', //唯一id
            popupVisible:false,//popup显示控制
            slots:[{values:[]}],//pupup数据
            bankName:'',
            bankBranch:'',
            bankUser:"",
            bankNum:'',
            amount:'',//输入提现金额
            taxDeduction:0,//扣税
            afterTax:0,//税后
            btnText:"获取验证码",//获取短信按钮文字
            msgCode:"",//短信验证码
            disabled:false//控制短信按钮重复点击
        }
    },
    mounted(){
        this.getLocationInfo();
        this.getBalance();
        this.getBankList();
    },
    methods:{
        showPopup(){
            this.popupVisible = !this.popupVisible;
        },
        // 获取本地用户信息
        getLocationInfo(){
            this.mobile = sessionStorage.getItem("mobile");
            this.user = sessionStorage.getItem("StoreName");
            this.seq = sessionStorage.getItem("seq");
        },
        // 获取余额
        getBalance(){
            axios.get(this.URL + "/Earnings/GetUserAccountInfo",{params:{userSeq:this.seq}})
            .then(res => {
                if(res.data.code == 200){
                    this.Balance = res.data.data.Balance;
                    this.AccountId = res.data.data.AccountId;
                }
            })
            .catch(err => {

            })
        },
        // 获取银行卡列表
        getBankList(){
            axios.get(this.URL + "/PersonalCenter/GetBankInfoList",{params:{seq:sessionStorage.getItem("seq"),bankCard:""}})
            .then(res => {
                if(res.data.length > 0){
                    this.slots[0].values = res.data;
                    this.bankName = res.data[0]["bank_name"];
                    this.bankBranch = res.data[0]["branch"];
                    this.bankUser = res.data[0]["name"];
                    this.bankNum = res.data[0]["bank_card"];
                }
            })
            .catch(err => {

            })
        },
        // 选择列表
        chooseItem(){
            let datas = this.$refs.picker.getValues()[0];
            this.bankName = datas["bank_name"];
            this.bankBranch = datas["branch"];
            this.bankUser = datas["name"];
            this.bankNum = datas["bank_card"];
            this.popupVisible = false;
        },
        // 查询扣税
        taxInspection(){
            if(!this.amount){
                this.amount =0
            }
            axios.get(this.URL + "/Earnings/GetWithdrawServiceAmount",{params:{userSeq:this.seq,amount:this.amount}})
            .then(res => {
                if(res.data.code == 200){
                    this.taxDeduction = res.data.data;
                    this.afterTax = this.amount - this.taxDeduction;
                }
            })
            .catch(err => {

            })
        },
        // 获取短信
        getMessage(){
            // this.mobile
            this.countDown();
            let params = {
                type:0,
                mobile:this.mobile,
                smsStr:this.mobile
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
        // 提交申请
        submitApply(){
            // {"userSeq":"用户Seq","mobile":"用户手机号","verification":"验证码","accountId":"用户账户Id","Amount":"提现金额(元)","bankId":"提现到账的银行卡Id"}
            let flag = true;
            if(!flag) return;
            flag = false;
            if(this.amount == ""){
                showToast("请输入提现金额");
                return;
            }
            if(this.msgCode == ""){
                showToast("请输入短信验证码");
                return;
            }
            let params = {
                userSeq:this.seq,
                mobile:"18802036467",
                verification:this.msgCode,
                accountId:this.AccountId,
                Amount:this.amount,
                bankId:this.bankNum
            }
            axios.post(this.URL + "/Earnings/AddApplyForWithdraw",params)
            .then(res => {
                if(res.data.code == 200){

                }
                if(res.data.code == 300){
                    showToast(res.data.message);
                    flag = true;
                }
            })
            .catch(err => {
                flag = true;
            })
        }
    }
}
</script>

<style>
.cash-withdrawal .main{
    padding:54px .3333rem 0;
}
.cash-withdrawal .con{
    background-color:#fff;
    border-radius:5px;
    font-size:.5778rem;
    color:#333;
    padding:0 .5333rem;
    margin-bottom:.3333rem;
}
.cash-withdrawal .last-con{
    /* margin-bottom:2.7778rem; */
}
.cash-withdrawal .items{
    display:flex;
    justify-content: space-between;
    height:1.9556rem;
    align-items: center;
    border-bottom:1px solid #ccc;
}
.cash-withdrawal .items:last-child{
    border:0 none;
}
.cash-withdrawal .important{
    color:#ef2828;
}
.cash-withdrawal input{
    font-size:.5778rem;
}
.cash-withdrawal .amount-input{
    text-align:right;
}
.cash-withdrawal .mes-input{
    text-align:center;
}
.cash-withdrawal .messages{
    background-color:#3da1ff;
    color:#fff;
    width:3.7778rem;
    height:1.2889rem;
    border:0 none;
    outline-style: none;
    border-radius:4px;
}
.cash-withdrawal .btn{
    width:100%;
    height:2.1778rem;
    background-color:#ef2828;
    color:#fff;
    font-size:.7556rem;
    border:0 none;
    outline-style: none;
    border-radius:5px;
}
.cash-withdrawal .tips{
    font-size:.5333rem;
    color:#999;
}
.cash-withdrawal .mint-popup{
    width:100%;
}
.cash-withdrawal .tool-bar{
    display:flex;
    justify-content: space-between;
    padding:.2222rem .3333rem;
    font-size:.6222rem;
    color:#666;
}
.cash-withdrawal .tool-bar button{
    background-color:transparent;
    border:0 none;
    font-size:.5778rem;
}
.cash-withdrawal .tool-bar .cancle{
    color:#999;
}
.cash-withdrawal .tool-bar .commit{
    color:#ef4628;
}
</style>
