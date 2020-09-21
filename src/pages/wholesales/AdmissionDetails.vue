<template>
    <div class="admission-details">
        <mt-header title="入驻订单详情" class="header">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="main">
            <div class="title-box">
                <div class="title">
                    <p><span>订单号：</span><span>{{datas.salenumber || "无订单号"}}</span></p>
                </div>
            </div>
            <div class="info-list">
               <mt-cell title="入驻合作方式" :value="datas.certificate"></mt-cell>
               <mt-cell title="入驻日期" :value="time"></mt-cell>
               <mt-cell title="折扣" :value="datas.discount+'折'" v-if="datas.discount && datas.discount !=null" class="discount"></mt-cell>
               <mt-cell title="推荐人" :value="datas.referrer" v-if="datas.referrer"></mt-cell>
               <mt-cell title="支付金额" :value="'￥'+datas.price" class="price" v-if="datas.price !=null"></mt-cell>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            seq:'',
            datas:'',
            certificateType:'',
            time:''
        }
    },
    mounted(){
        Indicator.open();
        // let seq = sessionStorage.getItem('seq');
        // if(seq){
        //     this.seq = seq;
        // }
          let seq = this.$route.query.seq;
          let from = this.$route.query.from;

          if(seq){
          this.seq = seq;
          sessionStorage.setItem("seq",seq);
          }else{
          this.seq = sessionStorage.getItem("seq");
          }
        this.getInfo();
    },
    methods:{
        getInfo(){
            axios.get(this.URL + '/WholesaleManage/GetEnteringInfo',{params:{seq:this.seq}})
            .then(res => {
                Indicator.close();
                if(res.data.retCode == 200){
                    this.datas = res.data.data;
                    this.time = res.data.data.date.replace("T"," ").substring(0,19);
            }
                // if(res.data){
                //     this.datas = res.data;
                //     this.time = res.data.CreateTime.replace('T',' ').substring(0,19);
                //     if(res.data.certificate_type == 0){
                //         this.certificateType = '年费1080元入驻';
                //     }else if(res.data.certificate_type == 1){
                //         this.certificateType = "扣点模式"
                //     }else if(res.data.certificate_type == 2){
                //         this.certificateType = "年费1825元入驻"
                //     }else if(res.data.certificate_type == 3){
                //         this.certificateType = "年费3880元入驻"
                //     }else{
                //         this.certificateType = "暂无数据"
                //     }
                // }
            }).catch(res => {
                Indicator.close();
            })
        },
        goBack(){

                   try {
                   window.action.app_back();
                   } catch (err) {
                this.$router.push({path:'/wholesale/storeManagement'})
                   }
        //  this.$router.push({path:'/wholesale/storeManagement'})
        }
    }
}
</script>

<style>
    .admission-details .header{
        margin-bottom:.6667rem;
    }
    .admission-details .main .title-box{
       font-size:.5777rem;
       padding:0 10px;
    }
    .admission-details .main .title{
        position:relative;
        padding:0 0 0 .3556rem;
        /* border-left:.0889rem solid #f23030; */
    }
    .admission-details .main .title:before{
        display:block;
        content:'';
        position:absolute;
        left:0;
        top:50%;
        margin-top:-.3889rem;
        height:.7778rem;
        width:.0889rem;
        background-color:#f23030;
    }
    .admission-details .main .title p{
        /* height:1.6444rem; */
        line-height:1.6444rem;
        border-bottom:.0222rem solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* flex-direction: column; */
    }
    .admission-details .main .title p span:first-child{
        flex: 1;
    }
    .admission-details .main .title p span:last-child{
        width: 80%;
        text-align: right;
    }
    .admission-details .info-list{
        color:#666;
    }
    .admission-details .info-list a span{
        font-size: .5777rem;
    }
    .admission-details .mint-cell-value{
        color:#333;
    }
    .admission-details  .price .mint-cell-value{
        color:#f23030;
    }
    .admission-details .discount .mint-cell-value{
        color:#ff6f24;
    }
</style>
