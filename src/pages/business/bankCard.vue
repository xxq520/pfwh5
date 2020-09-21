<template>
  <div class="glode">
    <topnav :top='topnav'></topnav>
    <div class="bank-item">
      <mt-field label="开户行：" placeholder="选择开户行" v-model="bank" readonly @click.native.capture="bankfn()">
        <i class="el-icon-arrow-right"></i>
      </mt-field>
       <mt-field label="开户行支行：" placeholder="开户行支行" v-model.trim="bankname" @blur.native.capture="bankzhfn"></mt-field>
      <mt-field label="银行卡类型：" placeholder="选择银行卡类型" v-model="type" readonly @click.native.capture="typefn()">
        <i class="el-icon-arrow-right"></i>
      </mt-field>
      <mt-field label="开户名：" placeholder="您的银行卡开户名" v-model.trim="username" @blur.native.capture='userfn'></mt-field>
      <mt-field label="银行卡号：" placeholder="您的银行卡账号" v-model.trim="number" @blur.native.capture='banknumfn' type="number"></mt-field>
      <mt-field label="证件号：" placeholder="开户人身份证号码" :attr="{ maxlength: 18,minlength:15 }" v-model="idcard" @blur.native.capture="idCardblur" type="text"></mt-field>
      <!-- <mt-field label="付款密码：" placeholder="设置您的付款密码（6位数）" :attr="{ maxlength: 6 }" type="password" v-model="password"></mt-field>
      <mt-field label="确认密码：" placeholder="再次确认您的付款密码（6位数）" :attr="{ maxlength: 6 }" type="password" v-model="passwordto"></mt-field> -->
    </div>
    <div class="bank-item">
      <mt-field label="手机号码：" placeholder="输入支付手机号码"  v-model="phone" @blur.native.capture="phoneblur" type="tel"></mt-field>
      <mt-field label="验证码：" placeholder="输入手机验证码" v-model="captcha" type="number" @blur.native.capture='captmsgfn'>
        <div class="captbtn captTime" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
        <div class="captbtn" @click="captbtnfn" v-else>获取验证码</div>
      </mt-field>
    </div>

    <div class="bank-btn" @click="submit">立即提交</div>
    <mt-popup v-model="bankVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="bankslots" value-key="name" @change="bankchange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="typeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="typeslots" @change="typechange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script type="text/javascript">
import { showToast } from '../../assets/js/common';
export default {
  data() {
    return {
      topnav:{
        title:'绑定银行卡'
      },
      bankId:'',
      bank:'',
      bankModel: '',
      type:'',
      typeModel: '',
      bankname:'', 
      username:'',
      number:'',
      idcard:'',
      // password:'',
      // passwordto:'',
      phone:'',
      captcha:'',
      captbtn:false,
      captlist:59,
      bankVisible:false,
      bankslots:[
        {
          flex: 1,
          values: [],
          className: 'bankslot',
          textAlign: 'center'
        }
      ],
      typeVisible:false,
      typeslots:[
        {
          flex: 1,
          values: ['借记卡','信用卡'],
          className: 'typeslot',
          textAlign: 'center'
        }
      ]
    }
  },
  mounted(){
    let that = this;
    axios.get(this.URL + '/PersonalCenter/GetBanks').then(res => {
      let data = JSON.parse(JSON.parse(res.data));
      data.forEach(post => {
        that.bankslots[0].values.push(post);
      });
    });
  },
  methods: {
    bankfn(){
      this.bankVisible = true;
    },
    bankzhfn(){
      if(this.bankname==''){
       showToast('开户支行不能为空');
       return false;
      }
      return true;
    },
    quedingfn(){
      if(this.bankVisible){
        this.bankVisible = false;
        this.bankId = this.bankModel?this.bankModel.id:'';
        this.bank = this.bankModel?this.bankModel.name:'';
        return true;
      }else if(this.typeVisible){
        this.typeVisible = false;
        this.type = this.typeModel;
        return true;
      }
    },
    quxiaofn(){
      if(this.bankVisible){
        this.bankVisible = false;
        if (this.bankId=='') {
          showToast('开户行必须选择！');
          return false;
        }
      }else if(this.typeVisible){
        this.typeVisible = false;
        if(this.bank==''){
            showToast('银行卡类型必须选择！');
            return false;
        }
      }
    },
    bankchange(picker, values){
      this.bankModel = values[0];
      return true;
    },
    typechange(picker, values){
      this.typeModel = values[0];
      return true;
    },
    typefn(){
      this.typeVisible = true;
      return true;
    },
    userfn(){
    },
    banknumfn(){
    },
    phoneblur(){
      let phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      // console.log(this.phone.length)
      if(this.phone.length>0 && !phonereg.test(this.phone)){
        showToast('请输入正确的手机号码！','middle');  
        return false;
      }
      return true;

    },
    idCardblur(){
      let idreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(this.idcard.length>0 && !idreg.test(this.idcard)){
        showToast('请输入正确的身份证号码！' ,'middle');  
        return false;
      }
      return true;
    },
    captbtnfn(){
      if(this.phone==''){
          showToast('请填写手机号码!','middle');
        }else{
          let that = this;
          let phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/;
          if(phonereg.test(that.phone)){
              that.captbtn = true;
              axios.get(this.URL + '/PersonalCenter/GetVerificationCode?mobile='+that.phone);
              var timer = setInterval(function(){
                that.captlist--;
                if(that.captlist == 0){
                  that.captbtn = false;
                  that.captlist = 59;
                  clearInterval(timer);
                };
              },1000);
          }else{
            showToast( '请输入正确的手机号码！','middle');
            return false;
          }
        }
    },
    captmsgfn(){
        if (this.captcha=='') {
        showToast('请输入验证码');
        return false;
      }
    },
    submit(){
      // api/PersonalCenter/CreateBank
      // name：用户名；bankid：银行卡id；bankname：开户行；bankcard：银行卡号；banktype：银行卡类型；idcard：身份证；mobile：手机号码；paypwd：支付密码；payconfirmpwd：支付密码确认；yzCode：手机验证码
     if(this.bank ==''){
        showToast("开户行必须选择");
      }else if(this.bankname ==''){
        showToast('开户行支行不能为空');
      }else if(this.type ==''){
        showToast('银行卡类型不能为空');
      }else if(this.username == ''){
        showToast('开户名不能为空')
      }else if(this.number==''){
        showToast('银行卡号不能为空');
      }else if(this.idcard==''){
        showToast('证件号不能为空');
      }else if(this.phone ==''){
        showToast('手机号不能为空');
      }else if(this.captcha==''){
        showToast('未填写验证码');
      }else{
        let post = {
          seq:sessionStorage.seq,
          name:this.username,
          bankid:this.bankId,
          bankname:this.bank,
          branch:this.bankname,
          bankcard:this.number,
          banktype:this.type,
          idcard:this.idcard,
          mobile:this.phone,
          // paypwd:this.password,
          // payconfirmpwd:this.passwordto,
          yzCode:this.captcha
        };
        axios.post(this.URL + '/PersonalCenter/CreateBank',post).then(res => {
          Indicator.close();
          switch(res.data){
            case 0:
              Toast('参数有误，绑定失败');
              break;
            case 100:
              Toast('手机验证码错误');
              this.captcha = '';
              break;
            case 200:
              let instance = Toast('绑定成功');
              setTimeout(() => {
                this.$router.go(-1);
              }, 2000);
              break;
            case 300:
              Toast('银行卡已存在');
              this.number = '';
              break;
            case 301:
              Toast('实名验证失败,请填写正确的开户名和证件号。');
              this.idcard = '';
              break;
            case 302:
              Toast('支付密码和确认密码不一致');
              this.passwordto = '';
              break;
            case 400:
              Toast('绑定失败，系统繁忙');
              break;
          }
        })
      } 
    }
  }
}


</script>

<style scoped>
    .glode{
      min-height:100vh;
      font-size:0.65rem;
      padding-bottom:3.5em;
    }
    .bank-item{
      overflow:hidden;
      margin-top:0.5rem;
    }
    .mint-cell{
      border-top:1px solid #e6e6e6;
    }
    .glode >>> .mint-cell{
      border-bottom:none;
    }
    .glode >>> .mint-field .mint-cell-title{
      width:7em;
      padding-right:0.8em;
      text-align:justify;
      text-align-last:justify;
      color:#333;
    }
    .glode >>> .mint-cell-wrapper{
      font-size:14px;
      background-image:none;
    }
    .captbtn{
      display:inline-block;
      padding-left:0.5rem;
      margin-left:0.5em;
      line-height:1.8em;
      border-left:1px solid #ccc;
      color:red;
    }
    .captTime{
      color:#999;
    }
    .bank-btn{
      position:fixed;
      left:0;
      bottom:0;
      width:100%;
      font-size:0.65rem;
      color:white;
      background:#ff0000;
      line-height:3em;
      text-align: center;
    }
    .mint-popup{
      width:100%;
    }
    .visiblebtn{
      padding:0.5rem;
      border-bottom:1px solid #eaeaea;
      overflow:hidden;
    }
    .visiblebtn .quxiao{
      float:left;
      border:1px solid #ccc;
    }
    .visiblebtn .queding{
      float:right;
    }
    .glode >>> .mint-button--small{
      font-size: 14px;
      padding: 0 8px;
      height: 25px;
    }
    .glode >>> .mint-button--default{
      -webkit-box-shadow: none;
      box-shadow: none;
    }
</style>
