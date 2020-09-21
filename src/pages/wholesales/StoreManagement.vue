<template>
    <div class="store-management">
        <div class="header-con">
            <div class="store-info">
                <div class="img-con">
                    <input accept="image/*" type="file" ref="file" class="img-file" @change="upImg">
                    <img :src="userImg || info.HeadPortraitURL" alt="" v-if="info.HeadPortraitURL">
                    <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
                </div>
                <div class="userInfo" @click="userType != 7&&userType!=3&&userType!=4 && goUserInfo()">
                    <p class="user-name">{{info.storeName || infos.username || infos.shopname | formatUsername}}</p>
                    <p class="address" v-show="!!wholesaleAddress">
                        <img src="@/assets/images/wholesale/address-icon.png">
                        <span to='/wholesale/wholesaleAddress' class="WholesaleAddress">{{wholesaleAddress}}
                        <i class="right el-icon-arrow-right"></i></span>
                    </p>
                    <p class="phone"><img src="@/assets/images/wholesale/phone-icon.png">{{info.storeMobile || infos.mobile}}</p>
                    <p class="inviteCode">邀请码：{{info.seq || infos.SEQ}}</p>
                    <!-- 如果是区域批发商则展示下面的内容 -->
                    <!--<div class="oldidentity" @click.stop="tabIndentity" v-if="!userBlock&&(userInfo.accountType==1||userInfo.accountType==3||userInfo.accountType==4||userInfo.accountType==7)"><span>区域批发商</span></div>-->
                    <!--<div class="oldidentity" @click.stop="tabIndentityHide" v-if="userBlock"><span>旧身份</span><img src="../../assets/images/wd_icon_qw.png" alt=""></div>-->
                    <!--<div class="blockshop" v-if="userBlock"><img src="../../assets/images/wd_icon_hg.png" alt=""><span>区域批发商</span></div>-->
                  </div>
            </div>
            <div class="store-setting">
                <div class="setting-item" @click="((userType != 7&&userType!=4)||userBlock)?goShoppingCart():''">
                    <img src="@/assets/images/wholesale/cart-icon.png" alt="">
                    <span>购物车</span>
                </div>
                <div class="setting-item" @click="((userType != 7&&userType!=3&&userType!=4&&userType!=6)||userBlock)?toggleMask():''">
                    <img src="@/assets/images/wholesale/store-ewm-icon.png" alt="">
                    <span>店铺二维码</span>
                </div>
                <div class="setting-item" @click="setting()">
                    <img src="@/assets/images/wholesale/setting-icon.png" alt="">
                    <span>店铺设置</span>
                </div>
                <div class="setting-item" v-if="!userBlock" @click="loginOut">
                    <img src="@/assets/images/wholesale/store-setting-icon.png" alt="">
                    <span>退出登录</span>
                </div>
            </div>
        </div>
        <!-- <div class="invite" v-if="userType == 3||userType == 4||userType==7||(userType==2&&IsServicer=='true')"> -->
        <div class="invite">
            <p class="inviteTitle">邀请批发商</p>
            <ul class="inviteList">
                <li class="inviteItem" @click="openPoint">
                    <input type="text" :value="shareUrl1" id="shareUrl1" class="shareUrl" readonly="readonly" />
                    <div class="inviteImg"><img src="@/assets/images/wholesale/point.png"></div>
                    <span class="inviteName">扣点</span>
                </li>
                <li class="inviteItem" @click="share(0,'shareUrl2')">
                    <input type="text" :value="shareUrl2" id="shareUrl2" class="shareUrl" readonly="readonly" />
                    <div class="inviteImg"><img src="@/assets/images/wholesale/vip1080.png"></div>
                    <span class="inviteName">1080元</span>
                </li>
                <li class="inviteItem" @click="share(2,'shareUrl3')">
                    <input type="text" :value="shareUrl3" id="shareUrl3" class="shareUrl" readonly="readonly" />
                    <div class="inviteImg"><img src="@/assets/images/wholesale/vip1825.png"></div>
                    <span class="inviteName">1825元</span>
                </li>
                <li class="inviteItem" @click="share(3,'shareUrl4')">
                    <input type="text" :value="shareUrl4" id="shareUrl4" class="shareUrl" readonly="readonly" />
                    <div class="inviteImg"><img src="@/assets/images/wholesale/vip3880.png"></div>
                    <span class="inviteName">3880元</span>
                </li>
                <li class="inviteItem" @click="goInviteList">
                    <div class="inviteImg"><img src="@/assets/images/wholesale/checkInvite.png"></div>
                    <span class="inviteName">查看邀请</span>
                </li>
                <li class="inviteItem" @click="changeShare" v-if="false">
                  <div class="inviteImg"><img src="@/assets/images/wholesale/mine_icon_qypfs@2x.png"></div>
                  <span class="inviteName">区域批发商</span>
                </li>
            </ul>
        </div>
        <div class="Invitation" style="margin-bottom:.4444rem">
            <div class="links" @click="share(4,'shareUrl6')">
                <span class="fn-item-title">批发商入驻免费试用三个月</span>
                <!-- <span class="fn-item-con"></span> -->
                <input type="text" :value="shareUrl6" id="shareUrl6" readonly="readonly" class="invitate">
            </div>
        </div>
        <!-- <div class="Invitation">
            <div class="links" @click="share(-1,'shareUrl5')">
                <span class="fn-item-title">邀请品牌商</span>
                <span class="fn-item-con"></span>
                <input type="text" :value="shareUrl5" id="shareUrl5" readonly="readonly" class="invitate">
            </div>
        </div> -->
        <div class="fn-list">
            <!-- <div class="fn-item" v-if="userType!=7&&userType!=3&&userType!=4"> -->
            <div class="fn-item" v-if="(info.certificate_type && info.certificate_type == 4 && info.IsServicer) || (infos.certificate_type && infos.certificate_type == 4 && infos.IsServicer)">
                <router-link to="/cooperation" class="links">
                    <span class="fn-item-title">修改合作方式</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item">
                <router-link to="/wholesale/userManagement" class="links">
                    <span class="fn-item-title">我的下游商家</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <!-- <div class="fn-item" v-if="userType!=7&&userType!=3&&userType!=4"> -->
            <div class="fn-item" v-if="!userBlock">
                <router-link to="/supplier?from=wholesale" class="links">
                    <span class="fn-item-title">我的供货商</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item" v-if="userType!=7&&userType!=4">
                <router-link to="/mybank" class="links">
                    <span class="fn-item-title">我的银行卡</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item" v-if="userType == 2">
                <a :href="STOREINFO+seq" class="links">
                    <span class="fn-item-title">补充店铺信息</span>
                    <span class="fn-item-con"></span>
                </a>
            </div>
            <div class="fn-item" v-if="userType!=7&&userType!=3&&userType!=4&&userType!=6">
                <router-link to="/wholesale/admissionDetails" class="links">
                    <span class="fn-item-title">入驻订单</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item" v-if="((userType==2||userType==8)&&(ApplyStatus==''||ApplyStatus==null))">

                <router-link to="/wholesale/uploading" class="links">
                    <span class="fn-item-title">资金账户管理</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item" v-if="((ApplyStatus!=null || ApplyStatus!='')&&(userType==2||userType==8))">
                  <!-- <div class="fn-item" > -->
                <router-link to="/wholesale/uploadf" class="links">
                    <span class="fn-item-title">查看资金账户信息</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item">
                <router-link to="/myaddress" class="links">
                    <span class="fn-item-title">我的收货地址</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <!-- <div class="fn-item">
                <router-link to="/wholesale/commission" class="links">
                    <span class="fn-item-title">返佣管理</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div> -->
            <div class="fn-item">
                <router-link to="/wholesale/myProfit" class="links">
                    <span class="fn-item-title">收益管理</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
                 <div class="fn-item" v-if="this.userType == '2'||this.userType == '8'">
                   <router-link to="/paymethods" class="links">
                     <span class="fn-item-title">支付方式</span>
                     <span class="fn-item-con"></span>
                   </router-link>
                 </div>
            <div class="fn-item">
                <router-link to="/notice" class="links">
                    <span class="fn-item-title">人工客服</span>
                    <span class="fn-item-con"></span>
                </router-link>
            </div>
            <div class="fn-item">
                <a :href="videoUrl" class="links">
                    <span class="fn-item-title">批发网操作教学视频</span>
                    <span class="fn-item-con"></span>
                </a>
            </div>
            <div class="logout-btn" v-if="userBlock" @click="loginOut">
                退出登录
            </div>
        </div>
        <!-- 二维码弹框 -->
        <div class="mask-point" v-if="isPoint">
            <div class="point-box">
                <p class="point-title">扣点</p>
                <p class="point-content">
                    设置扣点数<span><input type="text" v-model="point" maxlength="4" @input="pointUrl"></span>%
                </p>
                <p class="point-btn">
                    <span class="point-close" @click="closePoint">取消</span>
                    <span class="point-sure" @click="setPoint">确定</span>
                </p>
            </div>
        </div>
        <div class="mask-box" v-if="isShow">
            <div class="mask-con">
                <i class="close-btn" @click="closeMask"></i>
                <div class="user-con">
                    <img :src="info.HeadPortraitURL" alt="" v-if="info.HeadPortraitURL">
                    <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
                    <span>{{info.storeName}}</span>
                </div>
                <div class="ewm-con">
                    <img :src="codeImg" alt="">
                </div>
            </div>
        </div>
        <wholesale-nav v-if="userType == 2||userType == 3||userType == 4||userType == 6||userType == 7||userType == 8||userBlock"></wholesale-nav>
        <share  ref="share" :shareData="shareData"></share>
    </div>
</template>
<script>
import wholesaleNav from '@/components/WholesaleNav'
  import share from"@/components/share"
import { showToast,getCookie,setCookie } from '../../assets/js/common';
import {get} from '../../assets/js/http';
export default {
    data () {
        return {
            account:'',
            password:'',
            seq:"",
            info:'',
            infos:'',
            codeImg:'',
            isShow:false,
            address:'',
            userImg:'',
            userType:'',
            shareUrl1:'',
            shareUrl2:'',
            shareUrl3:'',
            shareUrl4:'',
            shareUrl5:'',//品牌商邀请地址
            shareUrl6:'',
            videoUrl:'',
            point:2,
            isPoint:false,
            system:'',
            IsServicer:'',
            ApplyStatus:'',
            shareData:{sites: ['weixin', 'weixintimeline', 'qq', 'qzone']},//分享时的数据
            userBlock:this.$store.state.userBlock,//是否是区域批发商身份 true是
            userInfo:this.$store.state.userInfo,
            applyData:null,//申请状态
            // wholesaleAddress:''
        }
    },
    components:{
        wholesaleNav,
        share
    },
    computed:{
        wholesaleAddress(){
            let addressText = ''
            const {userBlock,userInfo,address} = this;
            const {AreaWholesalerInfo} = userInfo;

            // if (userBlock) {//区域批发商身份显示自己入住的地址
            //     const {Province,City,Area,Street} = AreaWholesalerInfo
            //     addressText = Province + City + Area + Street
            // } else {
            //     addressText = address
            // }

            return addressText;

        }
    },
    created(){
        this.getSession();
        this.videoUrl = this.VIDEO;
        this.WholesaleSEQ = sessionStorage.getItem('Wseq');
        this.getApplyStatus(this.WholesaleSEQ);
        // this.brandUrl = this.BRANDSQUARE + "?type=w";
        // if(this.userBlock&&this.userInfo&&this.userInfo.AreaWholesalerInfo&&this.userInfo.AreaWholesalerInfo.adressdetail){
        //     this.wholesaleAddress=this.userInfo.AreaWholesalerInfo.adressdetail
        // }
    },
    mounted(){
        // this.getUserInfo();
        this.checkUserType();
        this.getCodeImg();
        Indicator.open();
        this.guid();
        this.shareUrls();
    },
    filters:{
        formatUsername(val){
            const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
            let ret = '';
            if (reg.test(val)) {
                ret = '';
            } else {
                ret = val
            }
            return ret;
        }
    },
    watch:{
        '$store.state.userBlock'(){
            this.userBlock=this.$store.state.userBlock;
        }
    },
    methods:{
        //隐藏区域批发商登录态
        tabIndentityHide(){
            Indicator.open();
            setTimeout(()=>{
                //如果是商家点击旧身份则重新让其选择店铺登入
                if([1,5].indexOf(+this.userInfo.accountType) > -1){
                    sessionStorage.setItem('isLogin','true');
                    sessionStorage.setItem("certificate_type",this.userInfo.certificate_type);
                    sessionStorage.setItem("IsExpired",this.userInfo.IsExpired)
                    this.$store.dispatch("changeUserBlock",false);
                    this.$router.push('/supplier');
                }else{
                    this.$store.dispatch("changeUserBlock",false);
                }
                Indicator.close();
            },500)
        },
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
        //当区域批发商点击旧身份的切换按钮的时候事件
        tabIndentity(){

            Indicator.open();
            this.getApplyStatus(this.WholesaleSEQ);//获取申请状态
            //WholesalerType;//1 普通批发商 2 区域批发商
            //ApplyStatus;//区域批发商申请状态 0=待审核,1=审核中,2=审核通过,3=已拒绝,4=已撤销  null表示不是区域批发商身份，还是原来的身份
            //accountType//1：商家；2：批发商；3：线下服务中心；4：代理商；5：普通用户；6：供货商；7：批发商代理商；8：批发网品牌商；
            //1 3 4 7  这些身份可以申请入驻
            setTimeout(()=>{

                //const {userInfo} = that.$store.state
                //const {AreaWholesalerInfo,WholesalerType,accountType} = userInfo;
                //const isAllowRole = [1,3,4,7].indexOf(accountType) > -1;
                if (this.applyData == null) {//没有区域批发商身
                    this.$router.push('/wholesale/areaWholesales');//申请入驻区域批发商
                }
                else if (this.applyData && this.applyData.ApplyStatus == 2) {//是区域批发商并且审核通过 跳店铺首页
                    this.$router.push({path:'/wholesale/business',query:{wholesaler:this.seq,from:"areaWholesaler"}})
                    this.$store.dispatch("changeUserBlock",true);
                }
                else if (this.applyData && this.applyData.ApplyStatus != 2) {//有申请区域批发商 没有通过 查看审核状态
                    //wholesale/business?wholesaler=4582748
                    this.$router.push('/wholesale/applyRecord');
                }


                Indicator.close();
            },500)
        },
         //分享商品事件
        changeShare(){
            this.$refs.share.changeShare()
        },
        //获取本地存储数据
        getSession(){
            let userType = sessionStorage.getItem('userType');

            if(userType){
                this.userType = userType;
            }
            if(sessionStorage.getItem('seq')){
                this.seq = sessionStorage.getItem('seq');
            }
            if(sessionStorage.getItem("mobile")){
                this.account = sessionStorage.getItem("mobile");
            }
            if(sessionStorage.getItem("p")){
                this.password = sessionStorage.getItem("p");
            }
            let IsServicer = sessionStorage.getItem('IsServicer');
            if(IsServicer){
                this.IsServicer = IsServicer;
            }
            this.pointUrl();
        },
        linkTo(){
            let mobile = sessionStorage.getItem("mobile");
            window.location.href = this.BRANDSQUARE+"?type=w&s="+this.seq+"&m="+mobile;
        },
        // upLoadImg(){
        //     document.getElementById('formId').submit();
        // },
        loginOut(){
            let app = sessionStorage.getItem('app');
            if(app){
                window.action.loginOut();
            }else{
                MessageBox({
                    title:"",
                    message: '确定退出登录?',
                    showCancelButton: true
                }).then(action => {
                    if(action ==='confirm'){
                        setCookie('seq','');
                        setCookie('isAuto',this.$base64.encode("false"));
                        sessionStorage.clear();
                        this.$router.push({path:'/login'});
                        this.$store.dispatch("changeUserBlock",false);
                    }
                });
            }
        },
         // 判断批发商//线下服务中心//代理商//品牌商
        checkUserType(){
            if(this.userType == '2'||this.userType == '8'){
                this.getUserInfo();
            }else{
                this.getInfos();
            }
        },
        // 线下服务中心//代理商信息
        getInfos(){
            let params = {
                seq:this.seq,
                // Type:this.userType
            };
            axios.get(this.URL + '/User/GetUserInfoBySeq',{params:params})
            .then((res) => {
                Indicator.close();
                if(res.data !=null){
                    this.infos = res.data;
                    sessionStorage.setItem('WholesaleName',this.infos.username);
                    sessionStorage.setItem('StoreName',(this.infos.shopname ||this.infos.username));
                    sessionStorage.setItem('shopMobile',(this.infos.RMmobile || this.infos.mobile));

                    let sheng = res.data.provice ? res.data.provice : '';
                    let shi = res.data.city ? res.data.city : '';
                    let qu = res.data.area ? res.data.area : '';
                    let jie = res.data.street ? res.data.street : '';
                    let road = res.data.adressdetail ? res.data.adressdetail : '';
                    this.address = sheng + shi + qu+ jie + road;
                    let area = sheng+' '+ shi +' '+ qu +' '+ jie +' ';
                    let addressData = {
                        province:sheng,city:shi,area:qu,street:jie,mobile:(this.infos.RMmobile || this.infos.mobile)
                    }
                    sessionStorage.setItem('addressData',JSON.stringify(addressData));
                    sessionStorage.setItem('area',area);
                    sessionStorage.setItem('address',road);
                }else{
                    this.$router.push('/login');
                }
            })
        },
        goShoppingCart(){
            this.$router.push({path:'/shoppingCart'});
        },
        shareUrls(){
            this.shareUrl2 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+0;
            this.shareUrl3 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+2;
            this.shareUrl4 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+3;
            this.shareUrl6 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+4;
            this.shareUrl5 = this.BRANDSQUARE+'?s='+this.seq+'&m='+this.account+"&type=h5";
            // this.shareUrl = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2';
        },
        toggleMask(){
            this.isShow=true
        },
        closeMask(){
            this.isShow = false;
        },
        //复制链接
        copyUrl(id){
            let e = document.getElementById(id);
            e.select();
            e.setSelectionRange(0, e.value.length)
            let b = document.execCommand("Copy");
            if(b){
                showToast('复制成功','center');
            }else{
                showToast('复制失败','center');
            }
        },
        // 跳转到订货平台
      OrderState(){
        let fromApp = sessionStorage.getItem('app');
        if(fromApp){
          window.action.toDingHuo()
        }else{
          let androidDownUrl = 'http://dh.520shq.com/dowAPK/shq_business_v1.0.0.apk';
          let iosDownUrl = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1243425475';
          this.configSystem()
          if(this.system == 'android'){
            this.checkAppExit(androidDownUrl);
            window.location.href='order://order.app/openwith';
          }else if(this.system == 'ios'){
            this.checkAppExit(iosDownUrl);
            window.location.href='ordersys://';
          }else if(this.system == 'wx'){
            showToast('微信不支持，请使用第三方浏览器打开！','center')
          }
        }
      },
      // 判断手机系统
      configSystem(){
        let ua = navigator.userAgent.toLowerCase();
        //Android终端
        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
　　   //Ios终端
        let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (this.isWeixinBrowser(ua)) {
          this.system = 'wx';
        } else {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            this.system = 'ios';
          } else if (/(Android)/i.test(navigator.userAgent)) {
            this.system = 'android';
          }
        }
      },
      // 检查是否app存在
      checkAppExit(url){
        var startTime = Date.now();
        var t = setTimeout(function() {
          var endTime = Date.now();
          //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
          if ((endTime - startTime) < (800)) {
            window.location.href = url
          } else {
              window.close();
          }
        }, 600);
        window.onblur = function() {
          clearTimeout(t);
        }
      },
      // 判断是否是微信浏览器
      isWeixinBrowser(ua){
        return (/micromessenger/.test(ua)) ? true : false;
      },
        // 分享
        share(type,id){
            let that = this;
            let title = '邀请您加入批发网';
            let text = that.info.storeName+' 邀请您加入批发网，快来入驻成为批发商吧。';
            let url = '';
            if(type == 1){
                url = that.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+type+'&point='+that.point;
            }else if(type == -1){
                title = '邀请您加入品牌商';
                text = that.info.storeName+' 邀请您加入品牌商，快来入驻成为品牌商吧。';
                url = this.shareUrl5;
            }else{
                url = that.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+type;
            }
            let fromApp = sessionStorage.getItem('app');
            if(fromApp){
                window.action.shareUrl(title,url,text)
            }else{
                that.copyUrl(id);
            }
        },
        pointUrl(){
            this.shareUrl1 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+1+'&point='+this.point;
        },
        setPoint(){
            if(parseFloat(this.point) > 15){
                showToast('扣点点数不能大于15%','center');
            }else if(this.point ==''){
                showToast('请输入扣点点数','center');
            }
            // else if(this.point ==9||this.point==10||this.point==11||this.point==12||this.point==13){
            //     showToast('扣点点数暂不支持此数值','center');
            // }
            else if(parseFloat(this.point) < 2){
                showToast('扣点点数不能低于2%','center');
            }else{
                if((this.point.toString()).indexOf(".") > 0 && this.point.split('.')[1].length>1){
                    showToast('扣点点数最多保留小数点后一位');
                }else{
                    this.share(1,'shareUrl1');
                    this.isPoint = false;
                }
            }
        },
        openPoint(){
            this.isPoint = true;
        },
        closePoint(){
            this.isPoint = false;
        },
        //批发商信息
        getUserInfo(){
            let params = {
                WholesaleSEQ:this.seq
            };
            axios.get(this.URL + '/WholesaleManage/GetWholesalerInfoDetail',{params:params})
            .then((res) => {
                Indicator.close();
                if(res.data !=null){
                    this.info = res.data;
                    sessionStorage.setItem('WholesaleName',this.info.storePerson);
                    sessionStorage.setItem('StoreName',this.info.storeName);
                    this.ApplyStatus = res.data.ApplyStatus;
                    let sheng = res.data.province ? res.data.province : '';
                    let shi = res.data.city ? res.data.city : '';
                    let qu = res.data.area ? res.data.area : '';
                    let jie = res.data.street ? res.data.street : '';
                    let road = res.data.address ? res.data.address : '';
                    this.address = sheng+shi+qu+jie+road;
                    let area = sheng+' '+shi+' '+qu+' '+jie+' ';
                    let addressData = {
                        province:sheng,city:shi,area:qu,street:jie,mobile:res.data.storeMobile
                    }
                    sessionStorage.setItem('addressData',JSON.stringify(addressData));
                    let addressDetail = res.data.address;
                    sessionStorage.setItem('area',area);
                    sessionStorage.setItem('address',addressDetail);
                }else{
                    this.$router.push('/login');
                }
            }).catch(err=>{
                Indicator.close();
            })
        },
        guid() {
          function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
          }
          return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      },
        // 获取用户图像
      upImg(){
        let self = this;
        let f = this.$refs.file.files[0];
        let param = new FormData();
        param.append('file',f);
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };
        axios.post(this.URL + '/WholesaleManage/saveHeadPortrait?seq='+this.seq+'&guid='+self.guid(),param,config).then(res => {
            let datas = JSON.parse(res.data);
          if(datas.status == 200){
            showToast('图像成功','center');
            this.userImg = datas.data;
          }else{
              showToast(datas.msg)
          }
        });
      },
        //获取二维码信息
        getCodeImg(){
            axios.get(this.URL + '/WholesaleManage/GetqrCodeEncoder',{params:{WholesaleSEQ:this.seq}})
            .then((res) => {
                if(res.data.code == 200){
                    this.codeImg = res.data.message
                    //初始化分享数据
                    var shareObj={
                        // 分享的链接，默认使用location.href
                        url: location.origin+location.pathname+`#/wholesale/blocksettledin`,
                        // 分享的标题，默认使用document.title
                        title: "520批发网花更少的钱，买更优质的商品",
                        // 分享的摘要，默认使用<meta name="description" content="">content的值
                        digest: "分享入驻区域批发商",
                        // 分享的图片，默认获取本页面第一个img元素的src
                        pic:res.data.message,
                        // 默认显示的网站为以下六个个,支持设置的网站有
                        // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                        sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                    }
                    this.shareData=shareObj
                }
            });
        },
        setting(){
            this.$router.push({path:'/wholesale/storageSetting'});
        },
        goUserInfo(){
            this.$router.push({path:'/wholesale/wholesaleAddress'});
        },
        goInviteList(){
            this.$router.push({path:'/wholesale/invitation'});
        }
    }









}
</script>
<style scoped>

    .store-management{padding-bottom:55px;}
    .header-con{
        height:8.6222rem;
        /* background-color:#ef4628; */
        background: url('../../assets/images/wholesale/storemanagement-bg.png')no-repeat center center;
        background-size:100% 100%;
        position:relative;
        margin-bottom:2.4rem;
    }
    .store-info{
        padding:0 0.4444rem;
        padding-top:1.2889rem;
        /* text-align:center; */
        display: flex;
        justify-content: space-between;
    }
    .img-con{
        border: 2px solid #fff;
        position:relative;
        width:3.5556rem;
        height:3.5556rem;
        background-color:#fff;
        border-radius:50%;
        /* margin:0 auto; */
        overflow:hidden;
        /* padding:.1333rem; */
    }
    .img-con img{
        height:100%;
    }
    .userInfo{
        flex: 1;
        margin-left: 0.4444rem;
        position: relative;
    }
    .userInfo .oldidentity{
        position: absolute;
        top: 0;
        right: 0;
        font-size: 0.56rem;
        color: #fff;
        height: 1rem;
        line-height: 1rem
    }
    .userInfo .oldidentity span{
        vertical-align: top;
        margin-right: 0.2rem
    }
     .userInfo .oldidentity img{
        width: 0.9rem;
        height: 0.9rem;
    }
    .userInfo .blockshop{
        position: absolute;
        bottom: 0;
        right: 0;
        width:4rem;
        height:0.7rem;
        background:rgba(255,168,0,1);
        border-radius:0.5rem;
        font-size: 0.52rem;
        color: #fff;
        text-align: center;
        line-height: 0.7rem
    }
    .userInfo .blockshop img{
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.1rem
    }
    .store-management .img-file{
        position:absolute;
        top:0;
        right:0;
        height:100%;
        opacity: 0;
        filter:Alpha(opacity=0);
        z-index:1;
        }
    .user-name{
        font-size:0.7111rem;
        font-weight: 700;
        height: .9rem;
        color:#fff;
    }
    .address{
        margin-top: 0.2222rem;
        padding-left: 0.6666rem;
        position: relative;
        text-align: left;
    }
    .address img{
        height: 0.4444rem;
        width: 0.3556rem;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.2222rem;
    }
    .address span{
        font-size: 0.5333rem;
        color:#fff;
        line-height: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding-right: 0.6666rem;
    }
    .right{
        font-size: 0.5333rem;
        color:#fff;
        margin-top:-0.2rem;
    }
    .phone{
        margin-top: 0.2222rem;
        position: relative;
        padding-left: 0.6666rem;
        font-size: 0.5333rem;
        color:#fff;
    }
    .phone img{
        height: 0.4444rem;
        width: 0.3556rem;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.2222rem;
    }
    .inviteCode{
        display: inline-block;
        font-size:0.5333rem;
        color:#fff;
        border:1px solid #fff;
        border-radius:25px;
        padding: 0.1111rem 0.4444rem;
    }
    .store-setting{
        position:absolute;
        left:50%;
        bottom:-1.7778rem;
        margin-left:-7.1111rem;
        width:14.2222rem;
        background-color:#fff;
        border-radius:8px;
        height:3.5556rem;
        display:flex;
        justify-content: space-between;
    }
    .store-setting .setting-item{
        position:relative;
        font-size:.5333rem;
        color:#666;
        flex:1;
        text-align:center;
        overflow:hidden;
    }
    .store-setting img{
        width:1rem;
        height: 1rem;
        display:block;
        margin:.7333rem auto .5333rem;
    }
    .Invitation{
        padding:.4444rem 10px;
        background-color:#fff;
        font-size:0.6667rem;
    }
    .Invitation .invitate{
        opacity:0;
    }
    .fn-list{
        padding-top:.4444rem;
        background-color:#f5f5f5;
    }
    .fn-item{
        background-color:#fff;
        position:relative;
        height:2.2rem;
        line-height:2.2rem;
        border-bottom:.0222rem solid #ccc;
        padding:0 1.2444rem 0 .5333rem;
        display:flex;
        justify-content: space-between;
    }
    .fn-item:after{
        display:block;
        content:"";
        position:absolute;
        right:.5333rem;
        top:50%;
        margin-top:-.2222rem;
        width:.3556rem;
        height:.3556rem;
        transform: rotate(45deg);
        border-top:.0222rem solid #666;
        border-right:.0222rem solid #666;
    }
    .no:after{
        display:none;
    }
    .fn-item:last-child{
        border:0;
    }
    .fn-item .links{
        width:100%;
        display:flex;
        justify-content: space-between;
    }
    .fn-item span{
        font-size:.6222rem;
    }
    .fn-item .fn-item-title{
        color:#212121;
    }
    .fn-item .fn-item-con{
        color:#666;
    }
    .mask-box{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.5);
        z-index:99;
    }
    .mask-con{
        position:absolute;
        top:50%;
        left:50%;
        margin-top:-8.8889rem;
        margin-left:-7.2222rem;
        width: 14.4444rem;
        height:17.7778rem;
        background-color:#fff;
        padding:.6222rem;
        border-radius:.2222rem;
        box-sizing:border-box;
    }
    .user-con{
        height:2.2222rem;
        line-height:2.2222rem;
        margin-bottom:.7111rem;
    }
    .user-con img{
        float:left;
        width:2.2222rem;
        height:2.2222rem;
    }
    .user-con span{
        float:left;
        font-size:.6667rem;
        margin-left:.6rem;
    }
    .mask-con .ewm-con{
        width:11.1111rem;
        height:11.1111rem;
        margin-left:auto;
        margin-right:auto;
        margin-bottom:1.1111rem;
    }
    .mask-text-con{
        text-align:center;
    }
    .mask-text{
        background-color:#f3f3f3;
        border:.0222rem solid #d9d9d9;
        padding:0 .4444rem;
        height:1.1111rem;
        font-size: .5333rem;
        color:#666;
    }
    .mask-con .close-btn{
        display:block;
        position:absolute;
        top:.4444rem;
        right:.4444rem;
        width:1rem;
        height:1rem;
        background:url("../../assets/images/wholesale/close-icon.png") no-repeat center;
    }
    .mask-con .close-btn:active{
        background-color:#ccc;
    }
    .WholesaleAddress{
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .WholesaleAddress .fn-item-con{
        flex: 1.5;
        padding-left: 1.1111rem;
        line-height: initial;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .login-btn{
        margin: 1rem auto 1rem;
        /* margin-left:-7.2222rem; */
        width:14.4444rem;
        border-radius:5px;
    }
    /* 邀请批发商 */
    .invite{
        /* margin-top: 2.5555rem; */
        background: #fff;
        margin-bottom:.4444rem;
    }
    .inviteTitle{
        height: 1.4667rem;
        line-height: 1.4667rem;
        padding-left: 0.4444rem;
        font-size: 0.5778rem;
        border-bottom: 1px solid #ccc;
    }
    .inviteList{
        display: flex;
        /*justify-content: space-between;*/
        padding: 0  1rem 0.4444rem;
        flex-flow: wrap;
    }
    .inviteItem{
        margin-top: .444rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 25%;
    }
    .inviteImg{
        width: 1.4667rem;
        height: 1.4667rem;
        margin-bottom: 0.4444rem;
    }
    .inviteImg img{
        width:100%;
    }
    .inviteName{
        font-size: 0.4889rem;
        color:#666;
    }
    .invite .shareUrl{
        opacity: 0;
        position:absolute;
        top:-50px;
        left:0;
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
    .logout-btn {
        margin-top: .2rem;
        width: 99.8%;
        height: 2rem;
        line-height: 2rem;
        background-color: #fff;
        border-radius: .05rem;
        text-align: center;
        font-size: .7rem;
        color: #ff7325;
    }
</style>
