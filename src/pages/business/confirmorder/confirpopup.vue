<template>
  <div class="payment">
    <div class="pay-title">
      选择支付方式
      <div class="close el-icon-close" @click="close"></div>
    </div>
    <div class="amount">
      <span>支付金额</span>
      <p>{{ postData.allmoney }}元</p>
    </div>
    <div class="ways" @click="ways('线上支付')">
      <p>线上支付</p>
      <span class="el-icon-circle-check" v-show="amount=='线上支付'"></span>
    </div>
    <!--  v-if="certificate_type!=1" 年费模式支持线下 -->
    <div class="ways" @click="ways('线下支付')" v-show="payshow==0">
      <p>线下支付</p>
      <span class="el-icon-circle-check" v-show="amount=='线下支付'"></span>
    </div>
    <div class="surebtn">
      <mt-button class="btn" type="default" @click="gopay">立即下单</mt-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import { showToast } from '@/assets/js/common'
import {payMixin} from '@/assets/js/mixin'

export default {
    mixins: [payMixin],
    props:['shift','confir'],
    data() {
        return {
           visible: this.shift,
           amount: '线上支付',
           postData:this.confir,
           fromApp:false,
           certificate_type:'',
        }
    },
    watch:{
        visible(val){
            this.$emit("shift-change",val);
        },
        shift(val){
            this.visible = val
        },
        confir(val){
           this.postData = val;

        }
    },
    created(){
        let fromApp = sessionStorage.getItem('app');
        if(fromApp){
            this.fromApp = fromApp;
        }
        let certificate_type = sessionStorage.getItem('certificate_type');
        if(certificate_type){
            this.certificate_type = certificate_type;
        }
    },
    mounted(){
         this.getpayInfos()
    },
    methods: {
        //获取支付方式
              getpayInfos() {
              let params = {
              seq: this.seq,
              };
              axios.get(this.URL + '/BusinessOrders/GetWholesalerOrderPayChannel', {
              params: params
              })
              .then((res) => {
              console.log(res,"5")
              if (res.data.code == 200) {
              this.payshow=res.data.data
              }

              })
              },
        ways(val){
            this.amount = val;
        },
        close(){
            this.visible = false;
        },
        gopay(){
            let that = this;
            let ordernumber = this.$route.query.ordernumber;
            let post = {
                iSeq: this.postData.iSeq,
                iAddressId: this.postData.iAddressId,
                strOrderDescr: this.postData.strOrderDescr,
                gjType: 0
            };
            if(ordernumber){
                post.ordernumber = this.postData.ordernumber;
            }else{
                post.carInfoStr = this.postData.carInfoStr;
            };
            // axios.post(this.URL + '/OrderNewListInfo/ConfirmOrderInfo',post ).then(res => {
            //     let data = res.data;
            //     this.visible = false;
            //     if(this.amount == '线上支付'){
            //         // if(this.fromApp){
            //         //     let salenumber = data.data[0];let iSeq = this.postData.iSeq;
            //         //     window.action.AppGoPay(salenumber,iSeq,'10019');
            //         // }else{
            //             window.location.href = this.PAY+data.data[0]+'&seq='+this.postData.iSeq;
            //         // }
            //     }else if(this.amount == '线下支付'){
            //         let post = {
            //             seq: this.postData.iSeq,
            //             salenumber: data.data[0]
            //         };
            //         //console.log(res)
            //         axios.post(this.URL + '/OrdersPay/SetOrdersOfflinePay',post).then(res => {
            //             if(res.data.code == 200){
            //                 this.$router.push('/successful');
            //                 return false;
            //             };
            //             Toast(res.data.message);
            //         })
            //     }
            // });
            
            axios.post(this.URL + '/OrderNewListInfo/ConfirmOrderInfo',post ).then(res => {
                let data = res.data;
                this.visible = false;
                let post = {
                    seq: this.postData.iSeq,
                    salenumber: data.data[0]
                };
                //console.log(res)
                if(this.amount == '线上支付'){
                    let totalAmount = this.postData.allmoney;
                    if(totalAmount > 5000) {
                        MessageBox({
                            title: '',
                            message: '您好！单次支付金额最高￥5000元，您的支付金额过大，请问是否需要分单支付？',
                            showCancelButton: true,
                            confirmButtonText: "分单支付",
                            cancelButtonText: "取消"
                        }).then(action => {
                            if(action == 'confirm') {
                                this.$router.push({
                                    name: 'payment',
                                    query: {
                                        salenumber: data.data[0],
                                        iSeq: this.postData.iSeq
                                    }
                                })
                            }
                        })
                        return false;
                    }
                    if(this.fromApp){
                        let salenumber = data.data[0];let iSeq = this.postData.iSeq;
                        window.action.AppGoPay(salenumber,iSeq,'10019', true); 
                    }else{
                        this.payLink()
                    }
                }else if(this.amount == '线下支付'){
                    axios.post(this.URL + '/OrdersPay/SetOrdersOfflinePay',post).then(res => {
                        if(res.data.code == 200){
                            this.$router.push('/successful');
                            return false;
                        };
                        Toast(res.data.message);
                    })
                }
            });
            this.visible = false;
        },
    }
}
</script>

<style scoped>
.payment{
    overflow:hidden;
    font-size:0.65rem;

}
.payment .surebtn{
    display: flex;
    justify-content: center;
}
.payment .surebtn .btn{
    background: #ff0025;
    color: #fff;
    width: 100%;
    margin:0.6rem 0.3rem;
}
.payment .pay-title{
    overflow:hidden;
    padding:10px;
    text-align: center;
    line-height:1.2em;
    position:relative;
    padding:0.6rem 0;
    border-bottom:1px solid #dcdcdc;
}
.close{
  position:absolute;
  right:10px;
  top:10px;
  font-size:1rem;
  color:#999;
}
.amount{
    overflow:hidden;
    border-bottom:1px solid #dcdcdc;
    line-height:1.2em;
    padding:0.9rem 0;
    text-align: center;
}
.amount span{
    display:block;
    font-size:0.6rem;
    color:#999;
    margin-bottom:0.2rem;
}
.amount p{
    display:block;
    font-size:0.9rem;
    color:#ff0025;
}
.ways{
    overflow:hidden;
    border-bottom:1px solid #dcdcdc;
    padding:0.9rem 10px;
    position:relative;
}
.ways p{
    float:left;
    line-height:1.4em;
}
.ways span{
    font-size:1rem;
    position:absolute;
    right:10px;
    top:calc((100% - 1.2em)/2);
    line-height:1.2em;
    color:#e43a3d;
}
</style>
