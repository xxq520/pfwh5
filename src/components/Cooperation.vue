<template lang="html">
  <div class="cooperation">
      <mt-header title="修改合作方式" class="mt-header">
            <mt-button icon="back" slot="left" @click="$router.back(-1)"></mt-button>
      </mt-header>
      <div class="main">
        <div class="con">
            <p class="title">选择合作方式</p>
            <div class="items" v-for="(item,index) in list" :key="index" @click="selected(index,item.id)" :class="index == isSelected ? 'cur':''">
                <i class="icons"></i>
                <p>{{item.text}}</p>
            </div>
        </div>
        <p class="tips">免费试用三个月到期后请重新选择合作方式。</p>
        <div class="notice" :class="isAgree?'cur':''" @click="changeNotice">
            <i class="icons"></i>
            <p @click.stop="showAgreement">《我已阅读同意该协议》</p>
        </div>
        <button type="button" name="button" class="btns" @click="updataInfo">确定</button>
      </div>
      <agreement-popup :show="show" :type="type" @changeShow="getShow"></agreement-popup>
  </div>
</template>

<script>
import {showToast} from "@/assets/js/common.js";
import AgreementPopup from "./AgreementPopup.vue";
export default {
    data () {
        return {
            items:[{
                text:"年费1080.00元",
                index:0,
                id:"0"
            },{
                text:"年费1825.00元",
                index:1,
                id:"2"
            },{
                text:"年费3880.00元",
                index:2,
                id:"3"
            },{
                text:"扣点模式",
                index:3,
                id:"1"
            }],
            vipItems:[{
                text:"年费"+(1080.00*0.4).toFixed(2)+"元",
                index:0,
                id:"0"
            },{
                text:"年费"+(1825.00*0.4).toFixed(2)+"元",
                index:1,
                id:"2"
            },{
                text:"年费"+(3880.00*0.4).toFixed(2)+"元",
                index:2,
                id:"3"
            },{
                text:"扣点模式",
                index:3,
                id:"1"
            }],
            list:"",
            isSelected:0,//选择选项
            type:0,//类型id
            isAgree:true,//同意协议
            show:false,

        }
    },
    components:{
        AgreementPopup
    },
    mounted(){
        this.getUserType();
    },
    methods:{
        // 辨别用户类型 3/4为vip用户
        getUserType(){
            let userType = sessionStorage.getItem("userType");
            if(userType == 3 || userType == 4){
                this.list = this.vipItems;
            }else{
                this.list = this.items;
            }
        },
        selected(val,id){
            this.isSelected = val;
            this.type = id;
        },
        // 协议同意
        changeNotice(){
            this.isAgree = !this.isAgree;
        },
        //协议弹框
        showAgreement(){
            this.show = !this.show;
        },
        // 提交
        updataInfo(){
            if(!this.isAgree){
                showToast("请先阅读协议并同意");
                return;
            }
            axios.post(this.URL+"/WholesaleManage/UpdateWholesaleType",{
                seq:sessionStorage.getItem("seq"),
                type:this.type,
                percentDeduction:""
            }).then(res => {
                if(res.data.retCode == 200){
                    showToast("提交成功");
                    if(this.type == 1){
                        this.$router.push("/login");
                    }else{
                        let salenumber = res.data.salenumber;
                        window.location.href = this.SettledPay + salenumber;
                    }
                }else if(res.data.retCode == 202){
                    showToast(res.data.retMessage);
                }
            }).catch(err => {

            })
        },
        //获取子组件状态
        getShow(val){
            this.show = val;
        }
    }
}
</script>

<style lang="css">
    .cooperation .main{
        padding-top:.4444rem;
        font-size:.6667rem;
        color:#666;
    }
    .cooperation .con{
        padding:0 .4444rem;
        background-color:#fff;
    }
    .cooperation .title{
        height:2.1778rem;
        line-height:2.1778rem;
        color:#333;
    }
    .cooperation .items{
        display:flex;
        justify-content: flex-start;
        align-items:center;
        height:1.9556rem;
        border-top:1px solid #eee;
    }
    .cooperation .icons{
        display:block;
        width:.5778rem;
        height:.5778rem;
        border-radius:50%;
        border:1px solid #ccc;
        margin-right:.3333rem;
    }
    .cooperation .cur .icons{
        background:url("../assets/images/wholesale/progress/wancheng@3x.png") no-repeat center;
        background-size:cover;
        border:0 none;
    }
    .cooperation .tips{
        padding:.4444rem .4444rem 0;
        font-size:.5333rem;
        margin-bottom:1.3333rem;
    }
    .cooperation .notice{
        display:flex;
        align-items:center;
        justify-content: flex-start;
        padding:0 .5333rem;
        margin-bottom:1.5556rem;
    }
    .cooperation .btns{
        display:block;
        margin:0 auto;
        width:95%;
        height:1.6667rem;
        font-size:.6667rem;
        color:#fff;
        background-color:#ef4628;
        border:0 none;
        border-radius:5px;
        outline-style: none;
    }
</style>
