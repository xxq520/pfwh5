<template>
    <div class="applyRecord">
        <topnav :top='topnav'></topnav>
        <ul class="wrapper">
            <li class="apply-item">
                <span class="item-left">申请时间</span>
                <span class="item-right">{{ applyData.CreateTime | formatTime }}</span>
            </li>
            <li class="apply-item">
                <span class="item-left">批发区域</span>
                <span class="item-right">{{ areaData }}</span>
            </li>
            <li class="apply-item">
                <span class="item-left">用户</span>
                <span class="item-right">{{ applyData.UserName }}</span>
            </li>
<!--            <li class="apply-item">-->
<!--                <span class="item-left">经营类型</span>-->
<!--                <span class="item-right">{{ applyData.OperationType }}</span>-->

<!--            </li>-->

            <li class="apply-item">
                <span class="item-left">状态</span>
                <span class="item-right record-right">{{ applyData.ApplyStatus | formatStatus}}</span>
            </li>

            <li class="apply-item">
                <span class="item-left">备注</span>
                <span class="item-right">{{ applyData.Remark }}</span>
            </li>
        </ul>



        <div class="submit-wrap" v-if="applyData.ApplyStatus == 3">
            <div class="submit-btn is-gray" @click="Revoke">撤销申请</div>
            <div class="submit-btn is-orange" @click="goBackReApply">修改提交</div>
        </div>

        <div class="submit-wrap">
            <div class="submit-btn is-gray"
                 v-if="['0','1'].indexOf(applyData.ApplyStatus) > -1"
                 @click="Revoke"
            >撤销申请</div>
            <div class="submit-btn is-orange" v-if="applyData.ApplyStatus == '4'" @click="goBackReApply">再次提交</div>
        </div>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {post,get} from "../../assets/js/http";
    import {showToast} from "../../assets/js/common";

    export default {
        name: "applyRecord",
        data:()=>({
            topnav:{
                title:'申请记录'
            },
            seq:'',

            isShow:true,//协议动画
            applyData:{},
        }),
        created() {
            this.seq = sessionStorage.getItem('seq');
            // this.username = sessionStorage.getItem('username');
            this.getApplyStatus(this.seq);
        },
        mounted() {
            //private Integer WholesalerType;//1 普通批发商 2 区域批发商
            //private String  ApplyStatus;//区域批发商申请状态 0=待审核,1=审核中,2=审核通过,3=已拒绝,4=已撤销  null表示不是区域批发商身份，还是原来的身份
        },
        computed:{
            ...mapState(['userInfo']),
            areaData(){
                const {Province,City,Area,Street} = this.applyData;
                let areaData = ''
                areaData = Province + City + Area + Street;
                return areaData
            }
        },

        filters:{
            formatTime (time) {
                return new Date(time).Format('yyyy-MM-dd')
            },
            formatStatus (val) {
                const str = ['待审核','审核中','审核通过','已拒绝','已撤销']
                return str[val];
            }
        },
        methods:{
            /**
             * 获取商家申请状态
             * @param wholesalerSeq
             * @returns {Promise<void>}
             */
            async getApplyStatus(wholesalerSeq) {
                //0=待审核,1=审核中,2=审核通过,3=已拒绝,4=已撤销
                const res = await get(this.URL + `/AreaWholesaler/GetAreaWholesalerBySeq`,{wholesalerSeq});
                this.applyData = res;
            },

            async againSubmit() {

                const {accountType} = this.userInfo;
                // const {selectLocation,OperationType} = this.$route.query;
                let formData = {
                    WholesalerSEQ: this.seq,
                    Province: this.applyData.Province,
                    City: this.applyData.City,
                    Area: this.applyData.Area,
                    Street: this.applyData.Street,
                    accountType: +accountType,
                    OperationType: this.applyData.OperationType,//经营类型
                    ApplyStatus:0,
                }

                await post(this.URL + '/AreaWholesaler/UpdateApply',formData);

                this.getApplyStatus(this.seq)
            },

            //区域批发商撤销申请接口
            // /AreaWholesaler/Revoke
            Revoke () {

                const self = this;

                MessageBox({
                    title:"",
                    message: "确定撤销申请?",
                    showCancelButton: true
                }).then(async  action => {
                    if(action == 'confirm'){

                        await post(self.URL + '/AreaWholesaler/Revoke',{WholesalerSEQ:self.seq});

                        if (self.applyData.ApplyStatus == '1') {//审核中时 撤销申请 回到上一页
                            self.$router.go(-1);
                        } else {
                            self.getApplyStatus(self.seq);
                        }

                    }
                });



            },
            //返回再次提交
            goBackReApply() {
                const toStr = JSON.stringify
                this.$router.push({
                    path: '/wholesale/areaWholesales',
                    query:{againApply:true,applyData:toStr(this.applyData)}
                });
            }

        },
    }
</script>

<style scoped>

    .applyRecord header.mint-header {
        color: #fe6f37;
    }

    .wrapper {
        margin-top: .3rem;
    }

    .wrapper .apply-item {
        display: flex;
        justify-content: space-between;
        height: 2rem;
        line-height: 1.9rem;
        border-bottom: .03rem solid #EAE8EB;
        padding: 0 .3rem;
        background-color: #fff;
    }

    .wrapper .apply-item:last-child {
        border-bottom: none;
    }

    .wrapper .apply-item .item-left {
        /*height:0.6rem;*/
        font-size:0.65rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(33,33,33,1);
    }

    .wrapper .apply-item .item-right {
        font-size:0.65rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
    }

    .nav-header {
        padding: .1rem .8rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: #dcdcdc;
        font-size: .63rem;
        height: 1.2rem;
        line-height: 1.2rem;
    }
    .apply-time {
        width: 30%;
    }

    .record-status  {
        margin-top: .2rem;
        height: 1.2rem;
        padding: 0 1.8rem;
        font-size: .66rem;
        line-height: 1.2rem;
        display: flex;
        justify-content: space-between;
    }
    .wrapper .apply-item .item-right.record-right {
        color: #fe6f37;
    }

    .bg-color {
        background-color: #f5f5f5;
    }

    .apply-area {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .agreement {
        margin-top: 10px;
        text-align: center;
    }

    .agreement span {
        font-size:0.6rem;
        font-family:PingFang SC;
        font-weight:400;
        color:#2879FF;
    }

    .agreement .is-agre {
        color: #212121;
    }

    .agreement .el-checkbox .el-checkbox__label {
        font-size: .59rem;
        color: #169BD5;
    }

    .submit-wrap {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .submit-wrap.is-center {
        justify-content: center;
    }

    .submit-wrap .submit-btn {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-radius: 4px;
        font-size: .65rem;
        font-size:0.79rem;
        font-family:Hiragino Sans GB;
        font-weight:normal;
        color:rgba(255,255,255,1);
    }

    .submit-btn.is-red{
        background-color: #FF0005;
    }

    .submit-btn.is-orange {
        background-color: #FB7024;
    }
    .submit-btn.is-gray {
        background-color: rgb(200,200,200);
    }



</style>
