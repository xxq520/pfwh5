<template>
    <div class="profit-con">
        <mt-header title="收益管理" class="header-con">
            <div slot='left' @click="goBack()">
                <mt-button icon='back'></mt-button>
            </div>
        </mt-header>
        <div class="list-con">
            <!-- <mt-cell title="销售报表" is-link to="/wholesale/salesDetails"> -->
            <mt-cell title="销售报表" @click.native="SalesReport">

                <i class="icons icons-one" slot="icon"></i>
            </mt-cell>
            <!-- <mt-cell title="利润报表" is-link to="/wholesale/invitationRebate"> -->
            <mt-cell title="利润报表" @click.native="Profitstatement">
                <i class="icons icons-two" slot="icon"></i>
            </mt-cell>
        </div>
    </div>
</template>
<script>
import {showToast} from '@/assets/js/common.js'
import { Indicator} from 'mint-ui';
export default {
    data () {
        return {
            seq:'',
            amount:0,
            balance:0
        }
    },
    mounted(){
        this.getSeq();
    },
    methods:{
        // 获取用户seq
        getSeq(){
            let seq = this.$route.query.seq;
            let from = this.$route.query.from;
          if(seq){
            this.seq = seq;
            sessionStorage.setItem("seq",seq);
          }else{
            this.seq = sessionStorage.getItem("seq");
          }

        },
         goBack(){
            try {
                window.action.app_back();
            } catch (err) {
                this.$router.push({path:'/wholesale/storeManagement'})
            }
         },
         SalesReport(){
            this.$router.push({path:'/wholesale/salesDetails',query:{seq:this.seq}})
         },
         Profitstatement(){
           this.$router.push({path:"/wholesale/invitationRebate",query:{seq:this.seq}})
         }
    }
}
</script>

<style>
    .profit-con .header-con{
        background-color:#ef4628;
        color:#fff;
    }
    .profit-con .list-con .icons{
        display:block;
        width:.7778rem;
        height:.7778rem;
        background-size:contain;
        background-repeat:no-repeat;
        background-position: center;
        float:left;
        margin-right:.3333rem;
    }
    .profit-con .icons-one{
        background-image:url("../../assets/images/xiaoshou.png");
    }
    .profit-con .icons-two{
        background-image:url("../../assets/images/lirun.png");
    }
    .profit-con .title{
        font-size:.6222rem;
        margin-bottom:.8889rem;
    }
    .profit-con .price{
        font-size:1.5556rem;
        margin-bottom:1.1111rem;
    }
    .profit-con .put-con{
        padding:0 .5333rem;
        display:flex;
        justify-content: space-between;
    }
    .profit-con .put-con .price-text{
        font-size:.6667rem;
        background:url('../../assets/images/money-icon.png') no-repeat center left;
        background-size:contain;
        padding-left:1.2rem;
    }
    .profit-con .put-con .put-btn{
        display:block;
        width:2.7333rem;
        height:.9778rem;
        background-color:#fff;
        color:#ef4628;
        font-size:.5778rem;
        line-height:.9778rem;
        border-radius:3px;
    }

</style>
