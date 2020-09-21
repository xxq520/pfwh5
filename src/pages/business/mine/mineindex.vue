<template>

   <div class="mine">
       <topnav :top='topnav'></topnav>
       <div class="invite">
            <p class="inviteTitle">邀请批发商 <span v-if="userInfo.accountType==1||userInfo.accountType==3||userInfo.accountType==4||userInfo.accountType==7" @click.stop="tabIndentity">区域批发商</span></p>
   
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
        <div @click="share(4,'shareUrl6')" class="Invitation invite">
            <span>批发商入驻免费试用三个月</span>
            <input type="text" readonly="readonly" id="shareUrl6" :value="shareUrl6" class="shareUrl">
        </div>
        <!-- <div @click="share(-1,'shareUrl5')" class="Invitation invite">
            <span>邀请品牌商</span>
            <input type="text" readonly="readonly" id="shareUrl5" :value="shareUrl5" class="shareUrl">
        </div> -->
       <div class="contentmine">
            <mt-cell title="头像">
              <img id="avatar" :src="userImg || data.avatarImg" v-if="data.avatarImg">
              <img id="avatar" src="@/assets/images/wholesale/user-icon.png" v-else>
              <input accept="image/*" type="file" @change="upImg" ref="file" class="img-file">
            </mt-cell>
            <mt-cell title="姓名" to="./changename" is-link :value="data.username"></mt-cell>
            <mt-cell title="手机号" :value="data.mobile"></mt-cell>
            <mt-cell title="修改合作方式"  to="/cooperation" is-link v-if="data.certificate_type==4&&data.IsExpired"></mt-cell>
            <mt-cell title="银行卡" to="./mybank" is-link value=""></mt-cell>
            <mt-cell title="我的供货商" to="./supplier" is-link value=""></mt-cell>
            <!-- <mt-cell title="消息通知" to="./message" is-link value=""></mt-cell> -->
            <!-- <mt-cell title="消息通知" value=""></mt-cell> -->

            <mt-cell title="收货地址" to="./myaddress" is-link value=""></mt-cell>
            <mt-cell title="修改密码" to="./changecode" is-link value=""></mt-cell>
            <!-- <mt-cell title="平台订货"  @click.native="OrderState" is-link></mt-cell> -->
            <!-- <mt-cell :to="settledUrl" title="批发商入驻"  is-link></mt-cell> -->
            <mt-cell :to="videoUrl" title="批发网操作教学视频"  is-link></mt-cell>
            <mt-cell :to="settledUrl" v-show="status=='-1'" title="批发商入驻"  is-link></mt-cell>
            <mt-cell v-show="status!='-1'" title="批发商入驻审核进度" :to="'/wholesaleCheckProgress?seq='+seq+'&from=center'" is-link value=""></mt-cell>
            <mt-cell title="补充店铺信息" :to="STOREINFO+seq" is-link v-if="userType == 1"></mt-cell>
       </div>
       <div class="loginout">
         <mt-button type="default" id="logoutbtn" @click="loginOut">退出当前账号</mt-button>
       </div>
       <!-- 修改头像弹窗 -->
        <!-- <mt-actionsheet :actions= "actiondata" v-model="sheetVisible"></mt-actionsheet> -->
       <bottomnav :bottom="bottomnav"></bottomnav>
       <!-- 扣点模式分享设置扣点 -->
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
        <share  ref="share" :shareData="shareData"></share>
   </div>
</template>

<script>
    import { mapState } from 'vuex'
    import {get} from '../../../assets/js/http'
import { showToast,getCookie,setCookie } from '../../../assets/js/common';
import share from"@/components/share"

export default {
   name: 'mineindex',
   data() {
       return {
           topnav:{
               title:'个人信息'
           },
           bottomnav:{
              index:'个人中心'
           },
           sheetVisible:false,//弹窗初始状态
           account:"",
           pwd:'',
           username:'',
           data:'',
           seq:'',
           userImg:'',
           settledUrl:'',
           status:"",
           videoUrl:'',
           system:'',
           shareUrl1:'',
           shareUrl2:'',
           shareUrl3:'',
           shareUrl4:'',
           shareUrl5:'',//邀请品牌商链接
           shareUrl6:'',//邀请品牌商链接
           point:2,
           isPoint:false,
           userType: '',
           shareData:{sites: ['weixin', 'weixintimeline', 'qq', 'qzone']},//分享时的数据
           //userBlock:'',//是否是区域批发商身份 true是
       }
   },
   components:{
     share
   },
   created(){
       this.seq = sessionStorage.getItem('seq');
       // this.WholesaleSEQ = sessionStorage.getItem('Wseq');
     this.videoUrl = this.VIDEO;
     this.$store.dispatch("changeUserBlock",false);
   },
   mounted(){
     this.getSessionData();
     document.querySelector("body").setAttribute("style","background-color: #f5f5f5");
     this.getUserInfo();
     this.toLevelUpWholesale();
     Indicator.open();
     // this.userBlock = this.userBlock;
    
   },
    computed:{
        ...mapState(['userInfo',"userBlock"]),
    },
   methods: {
    // 邀请品牌商地址拼接
     brandUrl(){
         let mobile = sessionStorage.getItem("mobile");
         let linkUrl = "?type=b&s="+this.seq+"&m="+mobile;
         return linkUrl;
     },
      //分享商品事件
      changeShare(){
          this.$refs.share.changeShare()
      },
     getSessionData(){
        sessionStorage.setItem('isLogin',false);
        let seq = sessionStorage.getItem('seq');
        let userType = sessionStorage.getItem('userType');

        if(seq){
          this.seq = seq;
        }else{
          if(this.$route.query.mySeq){
              this.seq = seq;
          }else{
              this.seq = getCookie('seq');
          }
        }
        if(userType) {
            this.userType = userType;
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
            // window.location.href='lovefenxiao://';
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
     //打开调用action sheet 弹窗
      actionSheet(){
        this.sheetVisible = true;
      },
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
                setCookie('isAuto',this.$base64.encode('false'));
                sessionStorage.clear();
                this.$router.push({path:'/login'});
            }
          });
        }

      },
      // 商家升级成批发商
      toLevelUpWholesale(){
        let that = this;
        that.settledUrl = this.SETTLED+'?mySeq='+that.seq+'&source=2&isShopper=true&phone='+that.account+'&usertype='+that.userType;
      },
      //获取商家信息
      getUserInfo(){
        axios.get(this.URL + '/User/GetUserInfoBySeq',{params:{seq:this.seq}})
        .then((res) => {
          Indicator.close();
          if(res.data){
            this.data = res.data;
            this.account = res.data.mobile;
            this.username = res.data.username;
            this.status = res.data.auditStatus;
            this.shareUrls();
             //初始化分享数据
            var shareObj={
                // 分享的链接，默认使用location.href
                url:location.origin+location.pathname+`#/wholesale/blocksettledin`,
                // 分享的标题，默认使用document.title
                title: "520批发网花更少的钱，买更优质的商品",
                // 分享的摘要，默认使用<meta name="description" content="">content的值
                digest:"分享入驻区域批发商",
                // 分享的图片，默认获取本页面第一个img元素的src
                pic:'http://pf.520shq.com/html5/project/static/img/user-icon.dd73b51.png',
                // 默认显示的网站为以下六个个,支持设置的网站有
                // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
            }
            this.shareData=shareObj
          }else{
            showToast("请先登录",'center');
            setTimeout(()=>{
              this.$router.push('/login');
            },2000);
          }
        });
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
        axios.post(this.URL + '/WholesaleManage/saveHeadPortrait?seq='+this.seq+"&guid="+self.guid(),param,config).then(res => {
          let datas = JSON.parse(res.data);
          if(datas.status == 200){
            showToast('图像成功','center');
            this.userImg = datas.data;
          }else{
            showToast(datas.msg);
          }
        });
      },
      // 分享
      shareUrls(){
            this.shareUrl1 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+1+'&point=2';
            this.shareUrl2 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+0;
            this.shareUrl3 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+2;
            this.shareUrl4 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+3;
            this.shareUrl6 = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+4;
            this.shareUrl5 = this.BRANDSQUARE+'?type=h5&s='+this.seq+'&m='+this.account;
        },
        share(type,id){
            let that = this;
            let title = '邀请您加入批发网';
            let text = that.username+' 邀请您加入批发网，快来入驻成为批发商吧。';
            let url = '';
            if(type == 1){
                url = that.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+type+'&point='+that.point;
            }else if(type == -1){
                title = '邀请您加入品牌商';
                text = that.username+' 邀请您加入品牌商，快来入驻成为品牌商吧。';
                url = this.shareUrl5;
            }
            else{
                url = that.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2&cetificateType='+type;
            }
            // let url = this.SETTLED+'?referrerSeq='+this.seq+'&referrerMobile='+this.account+'&source=2';
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
        goInviteList(){
            this.$router.push({path:'/wholesale/invitation',query:{from:"business"}});
        },
       goAreaWholesale () {
         this.$router.push({path:'/wholesale/areaWholesales'});
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
           this.getApplyStatus(this.seq);//获取申请状态
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
                   // alert('>>>通过')
                   this.$router.push({path:'/wholesale/business',query:{wholesaler:this.seq,from:"areaWholesaler"}});
                   this.$store.dispatch("changeUserBlock",true);
               }
               else if (this.applyData && this.applyData.ApplyStatus != 2) {//有申请区域批发商 没有通过 查看审核状态
                   //wholesale/business?wholesaler=4582748
                   this.$router.push('/wholesale/applyRecord');
               }


               Indicator.close();
           },500)
       },
    }
}
</script>

<style scoped>
.mine{
  padding-bottom:60px;
}
.mint-cell{
  border-bottom:1px solid #e9e9e9;
}
.mine .contentmine{
  margin-top: .3333rem /* 15/45 */;
  position: relative;
}
.mine .is-left{
  display: none;
}
.mine .mint-header-title{
  padding-left: 80px;
}
.mine .contentmine #avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right:0.5rem;
}
.mine .user-img{
  position:relative;
}
.mine .img-file{
  position:absolute;
  top:0;
  right:0;
  height:100%;
  opacity: 0;
  filter:Alpha(opacity=0);
  z-index:1;
}
.mine .contentmine .mint-cell-wrapper{
    background-image:none
  }
.mine .contentmine .mint-cell-title {
  font-size: .6667rem /* 30/45 */;
  color: #212121;
}
.mine .loginout{
  height: 2.2222rem /* 100/45 */;
  margin-top: .4444rem /* 20/45 */;
}
.mine .loginout #logoutbtn{
  color: #ff0000;
  font-size: .6667rem /* 30/45 */;
  background: #fff;
  width: 100%;
  border-radius: 0;
  border: none;
}
    /* 邀请批发商 */
    .invite{
        position: relative;
        margin-top: .4444rem;
        background: #fff;
    }
.invite .oldidentity{
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    font-size: 0.56rem;
    /*color: #fff;*/
    height: 1rem;
    line-height: 1rem
}
.invite .oldidentity span{
    vertical-align: top;
    margin-right: 0.2rem
}
.invite .oldidentity img{
    width: 0.9rem;
    height: 0.9rem;
}
    .inviteTitle{
        height: 1.4667rem;
        line-height: 1.4667rem;
        padding-left: 0.4444rem;
        font-size: 0.5778rem;
        border-bottom: 1px solid #ccc;
        position:relative
    }
    .inviteTitle span{
        float:right;
        padding:0 0.6rem;
    }
    .inviteList{
        display: flex;
        /*justify-content: space-between;*/
        padding: 0 1rem .4444rem;
           flex-flow: wrap;
    }
    .inviteItem{
        margin-top: .444rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 25%;
      margin-top: .4rem;
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
    .Invitation{
        padding:.4444rem 10px;
        font-size:0.6667rem;
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
