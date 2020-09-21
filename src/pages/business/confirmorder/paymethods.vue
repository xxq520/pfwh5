<template>
    <div class="payment">
        <mt-header title="支付方式">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
                        <div class="pay-box">
                          
                
                          <div class="between-flex">
                            <div class="flex-pic">线上线下支付</div>
                            <div>
                              <div class="select-pay" :class="{'quan':checked==0}" @click="checkedfn(0)" ref="weixin"
                                id="weixin">
                                <i class="el-icon-check select"></i>
                              </div>
                            </div>
                          </div>

                          <div class="between-flex">
                            <div class="flex-pic">仅线上支付
                            </div>
                            <div>
                              <div class="select-pay" :class="{'quan':checked==1}" @click="checkedfn(1)" ref="weixin"
                                id="weixin">
                                <i class="el-icon-check select"></i>
                              </div>
                            </div>
                          </div>
                        </div>
        <div class="btn" :class="{'btn-gray': listFlag}" @click="setpayInfos">
            <span>确定</span>
        </div>
    </div>
</template>

<script>
    import {payMixin} from '@/assets/js/mixin'

    export default {
        mixins: [payMixin],
        data() {
            return {
              
                totalAmount: '',
                salenumber: this.$route.query.salenumber,
                money: '',
                isplay: false,
                listFlag: false,
                paymentList: [],
                orderSplitEnd: false,
                fromApp:false,
                status: -1,
                checked:'', //是否选中
                 way: '', //支付方式 
                seq:'',
            }
        },
        mounted() {
            this.seq = sessionStorage.getItem('seq');
              this.getpayInfos()
            
            
        },
        methods: {
         
            back(){
                this.$router.back(-1);
            },
            //获取支付方式
                   getpayInfos(){
                   let params = {
                   seq:this.seq,
                   };
                   axios.get(this.URL + '/BusinessOrders/GetWholesalerOrderPayChannel',{params:params})
                   .then((res) => {
                    //    console.log(res,"5")
                    if(res.data.code==200){
                          this.checkedfn(res.data.data)
                    }
                
                   })
                   },
                    //切换支付方式
                    setpayInfos(){
                    let params = {
                    seq:this.seq,
                    orderPayChannel:this.way
                    };
                    axios.post(this.URL + '/BusinessOrders/SetWholesalerOrderPayChannel',params)
                    .then((res) => {
                    console.log(res,"5")
                    if(res.data.code==200){
                    Toast(res.data.message)
                    
                    }else{
                        Toast(res.data.message)
                    }

                    })
                    },
         //选择支付方式
              checkedfn(val) {
              console.log(val);
              this.checked = val == this.checked ? '' : val;
              this.way = val;
              console.log(this.way);
              },
           
        }
    }
</script>

<style scoped>
  .pay-way {
  background: #f2f2f2;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  color: #333333;
  font-size: .625rem;
  letter-spacing: 3px;
  font-weight: bold;
  }

  .between-flex {
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  font-size: .625rem;
  color: #666666;
  padding: 0 0.833333rem;
  background: #ffffff;
  margin-bottom: 1px;
  }

  .flex-pic {
  display: flex;
  align-items: center;
  }

  .weixin-pic {
  width: 1.333333rem;
  margin-right: .791667rem;
  }

  .select-pay i {
  display: none;
  }

  .select-pay {
  width: .833333rem;
  height: .833333rem;
  border-radius: 50%;
  font-weight: bold;
  border: 1px solid #a5a5a5;
  }

  .select {
  color: #F52052;
  font-size: .916667rem;
  }

  .quan {
  border-color: #F52052;
  background: #F52052;
  }

  .quan i {
  display: inline-block;
  font-size: .7rem;
  color: white;
  line-height: .75rem;
  }



    .payment .mint-header {
        background: #e3393a;
        color: #fff;
        border-bottom: 0;
    }
    .money ul {
        background: #fff;
    }
    .money ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        font-size: .6667rem /* 30/45 */;
        line-height: 1.9556rem /* 88/45 */;
        padding: 0 .5333rem /* 24/45 */;
    }
    .money ul li:last-of-type {
        border-bottom: none;
    }
    .money .totalAmount {
        color: #ff0002;
    }
    .money input {
        width: 4.9333rem /* 222/45 */;
        height: 1.2889rem /* 58/45 */;
        text-align: center;
        border: 1px solid #a0a0a0;
        border-radius: 50px;
    }
    .btn {
        margin: .4444rem /* 20/45 */ .7778rem /* 35/45 */;
    }
    .btn span {
        background: #e3393a;
        display: block;
        text-align: center;
        color: #fff;
        font-size: .7556rem /* 34/45 */;
        height: 1.9556rem /* 88/45 */;
        line-height: 1.9556rem /* 88/45 */;
        border-radius: .2222rem /* 10/45 */;
    }
    .btn .tip {
        font-size: .5333rem /* 24/45 */;
        color: #ff0002;
        padding: .4444rem /* 20/45 */ 0;
    }
    .btn-gray span {
        background: #e1e1e1;
    }
    .payment-list {
        background: #fff;
        font-size: .6667rem /* 30/45 */;
    }
    .payment-list li {
        padding: 0 .5333rem /* 24/45 */;
        height: 3.0667rem /* 138/45 */;
        line-height: 3.0667rem /* 138/45 */;
        border-radius: .2222rem /* 10/45 */;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
    }
    .payment-list li i {
        width: 2.6667rem /* 120/45 */;
        height: 1.0667rem /* 48/45 */;
        line-height: 1.0667rem /* 48/45 */;
        display: inline-block;
        background: #3ea7f1;
        color: #fff;
        text-align: center;
        border-radius: .2222rem /* 10/45 */;
        
    }
    .payment-list ul li:last-of-type {
        border-bottom: none;
    }
    .payment-list .payed {
        color: #ff0002;
        width: 2.6667rem /* 120/45 */;
        height: 1.0667rem /* 48/45 */;
        line-height: 1.0667rem /* 48/45 */;
        display: inline-block;
        text-align: center;
    }
</style>