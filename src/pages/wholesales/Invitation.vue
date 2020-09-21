<template>
    <div class="Invitation">
        <mt-header title="我邀请的商家/批发商" ref="header" :fixed='true'>
            <mt-button icon="back"  slot="left" @click="(()=>{return $router.go(-1)})"></mt-button>
        </mt-header>
        <div class="userList">
            <div class="userTab">
                <button class="tab choosed" @click="chooseUserList(true)" :style="{color:(isShow?choosed:unChoose)}">批发商</button>
                <button class="tab" @click="chooseUserList(false)" :style="{color:(isShow?unChoose:choosed)}">商家</button>
            </div>
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <li class="item" v-for="(item,key) in datas" :key="key">
                    <span class="user-type" v-if="IsWholesale == 0"><i class="type-text">批</i></span>
                    <span class="user-type1" v-else-if="IsWholesale == 1"><i class="type-text">商</i></span>
                    <div class="avatar">
                        <img v-if="item.HeadPortraitURL" :src="item.HeadPortraitURL">
                        <img  src='@/assets/images/wholesale/user-icon.png' v-else>
                    </div>
                    <div class="userInfo">
                        <p class="storeName">{{item.username==''?'匿名':item.username}}</p>
                        <p class="phone">电话：{{item.mobile}}</p>
                        <p class="cooperation" v-if="IsWholesale == 0">合作方式：{{item.certificate_type==1?cooperation[item.certificate_type]+item.rate+'%':cooperation[item.certificate_type]}}
                            <button class="edit" v-if="item.certificate_type==1" @click="openPoint(item.wholesaler_seq)">编辑</button>
                        </p>
                        <p class="address" v-if="IsWholesale == 0">地址：{{item.province+item.city+item.area+item.street+item.adressdetail}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="mask-point" v-if="isPoint">
            <div class="point-box">
                <p class="point-title">扣点</p>
                <p class="point-content">
                    修改扣点数<span><input type="text" v-model="point"></span>%
                </p>
                <p class="point-btn">
                    <span class="point-close" @click="closePoint">取消</span>
                    <span class="point-sure" @click="setPoint">确定</span>
                </p>
            </div>
        </div>
        <!-- <wholesale-nav></wholesale-nav> -->
    </div>
</template>

<script>
import wholesaleNav from '@/components/WholesaleNav'
import {showToast} from '@/assets/js/common.js'
export default {
    data(){
        return {
            cooperation:['年费1080','每单缴纳','年费1825','年费3880'],
            choosed:'#FF0025',
            unChoose:'#939397',
            isShow:true,
            IsWholesale:0,
            searchText:'',
            seq:'',
            datas:[],
            noData:false,
            isPoint:false,
            point:'',
            wholesaleSeq:'',
            pages:1,
            loading:false,
            isLoading:true
        }
    },
    components:{
        wholesaleNav
    },
    created(){
        let seq = sessionStorage.getItem('seq');
        if(seq){
            this.seq = seq;
        }
        // this.getUserList();
    },
    mounted(){
        Indicator.open();
    },
    methods:{
        chooseUserList(isTrue){
            var that = this;
            that.isShow = isTrue;
            that.datas = [];
            that.pages = 1;
            that.isLoading = true;
            if(that.isShow){
                that.IsWholesale = 0;
            }else{
                that.IsWholesale = 1;
            }
            this.getUserList();
            that.pages += 1;
        },
        getUserList(){
            if(!this.isLoading) return;
            let WholsaleApi ='/WholesaleManage/GetInviteWholesaleList';
            let ShopperApi ='/WholesaleManage/GetInviteUserList';
            axios.get(this.URL + (this.IsWholesale == 0?WholsaleApi:ShopperApi),{params:{
                wholesalerSeq : this.seq,
                page:this.pages,
                rows:10
            }}).then((res)=>{
                if(res.data.WholesaleUserVM.length !=0){
                    this.datas =this.datas.concat(res.data.WholesaleUserVM);
                    if(this.pages > res.data.TotalPage){
                        this.isLoading = false;
                    }
                }
                Indicator.close();
            })
        },
        closePoint(){
            this.isPoint = false;
        },
        openPoint(seq){
            this.wholesaleSeq = seq;
            this.isPoint = true;
        },
        postPoint(){
            axios.get(this.URL+'/WholesaleManage/UpdatePercentDeduction',{params:{
                seq:this.wholesaleSeq,rate:this.point
            }}).then((res)=>{
                if(res.data.code==200){
                    this.getUserList();
                    showToast('修改成功~');
                }else{
                    showToast('修改失败~');
                }
            })
        },
        setPoint(){
            if(this.point>15){
                showToast('扣点点数不能大于15%','center');
            }else if(this.point <2){
                showToast('扣点点数不能小于2%','center');
            }else if((this.point.toString()).indexOf(".") > 0 && this.point.split('.')[1].length>1){
                showToast('扣点点数最多保留小数点后一位');
            }else if(this.point ==''){
                showToast('请输入扣点点数','center');
            }
            // else if(this.point ==9||this.point==10||this.point==11||this.point==12||this.point==13){
            //     showToast('扣点点数暂不支持此数值','center');
            // }
            else{
                this.postPoint();
                this.isPoint = false;
            }
        },
        // 加载更多
        loadMore(){
            this.loading = true;
            this.getUserList();
            this.loading = false;
            this.pages++;
        }
    }
}
</script>

<style scoped>
    .noData{
        overflow: hidden;
        padding: 1rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        color: #ccc;
        background: #f1f2f5;
    }
    body {
        background: #f1f2f5;
    }
    .Invitation{
        position: relative;
        background: #f1f2f5;
        height: 100vh;
    }
    .userList{
        padding-top: 44px;
        /* padding-bottom: 55px; */
    }
    .userTab{
        display: flex;
        justify-content: space-between;
        padding: 0.5333rem 0;
        border-bottom:1px solid #F9F9F9;
        width: 100%;
        background: #fff;
        margin-bottom: 0.4444rem;
    }
    .userTab button{
        border: none;
        outline: none;
        background: #fff;
        text-align: center;
        flex: 1;
        height:0.4889rem;
        line-height:0.4889rem;
        font-size: 0.5333rem;
        color: #939397;
    }
    .userTab button:first-child{
        border-right: 1px solid #DCDCDC;
    }
    .userTab .choosed{
        color: #FF0025;
    }
    .list{
        background:#fff;
        height: auto;
        overflow-y: auto;
    }
    .list .item{
        position: relative;
        display: flex;
        justify-content: space-between;
        border-bottom:1px solid #f2f2f2;
        padding: 0.4444rem;
    }
    .list .item:last-child{
        border-bottom:none;
    }
    .list .item .user-type,
    .list .item .user-type1{
        display:block;
        position:absolute;
        top:0;
        left:0;
        width:0;
        height:0;
        border-width:1.2444rem 1.2444rem 0 0;
        border-style:solid;
        border-color:#f23030 transparent transparent transparent;
    }
    .list .item .user-type1{
        border-color:#e7ab08 transparent transparent transparent;
    }
    .list .item .type-text{
        display:block;
        position:absolute;
        left:0;
        top:-1.2444rem;
        font-size:.5333rem;
        color:#fff;
    }
    .item .avatar{
        height: 2.4444rem;
        width: 2.4444rem;
        border-radius:50%;
        overflow: hidden;
        margin:0 0.4444rem;
        border:1px solid #ddd;
    }
    .item .avatar img{
        height: 100%;
        width: 100%;
    }
    .item .userInfo{
        flex: 1;
    }
    .item .userInfo p{
        font-size: 0.6222rem;
        color:#999;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 0.2222rem;
    }
    .item .userInfo .storeName{
        font-size: 0.7111rem;
        color:#333;
    }

    .edit{
        float:right;
        border:none;
        outline: none;
        border-radius: 8px;
        background:#f00;
        color:#fff;
    }
        .mask-point{
        height: 100vh;
        width: 100%;
        background: rgba(0, 0, 0, .3);
        z-index: 20;
        position: fixed;
        top: 0;
        left: 0;
    }
    .point-box{
        height: 6.4444rem;
        width: 60%;
        position: relative;
        top: 50%;
        left: 50%;
        margin-top:-3.2222rem;
        margin-left: -30%; 
        background:#fff;
        border-radius:8px;
    }
    .point-title{
        height: 1.4444rem;
        line-height: 1.4444rem;
        text-align: center;
        font-size:0.7111rem;
        border-bottom:1px solid #ccc;
    }
    .point-content{
        font-size: 0.6667rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top:10%; 
    }
    .point-content span{
        display: inline-block;
        border-radius: 25px;
        border:1px solid #ccc;
        overflow: hidden;
        margin: 0 0.2222rem;
    }
    .point-content span input{
        width: 2.2222rem;
        text-align: center;
    }
    .point-btn{
        position: absolute;
        bottom:0;
        left: 0;
        width: 100%;
        height: 1.4444rem;
        line-height: 1.4444rem;
        display: flex;
        justify-content: space-between;
    }
    .point-btn span{
        flex: 1;
        text-align: center;
        font-size: 0.6222rem;
        color:#fff;
    }
    .point-close{
        border-right:1px solid #ccc;
        background:#00AFFF;
    }
    .point-sure{
        background:#FF3232;
    }
</style>
