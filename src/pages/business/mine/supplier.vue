<template>
  <div class="glode supplier-con">
    <!-- <topnav :top='topnav'></topnav> -->
    <mt-header :title="topnav.title" :fixed="true">
      <mt-button icon="back" slot="left" v-if="isApp=='true'&&isLogin=='true'" @click="backPage"></mt-button>
      <router-link to="/wholesale/storeManagement" slot="left" v-else-if="userType == 2||userType == 3||userType == 4||userType == 6||userType == 7||userType == 8">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link to="/mineindex" slot="left" v-else-if="isLogin=='false'">
        <mt-button icon="back"></mt-button>
      </router-link>
      <!-- <router-link to="/login"> -->
        <mt-button icon="back" slot="left" v-else-if="isLogin=='true'" @click="backPage"></mt-button>
      <!-- </router-link> -->
      <span class="dinghuo" slot="right" v-if="(userType==2&&IsServicer == 'true')||userType==3||userType==4 || userType==1" @click="OrderState">平台订货</span>
    </mt-header>
    <div class="supplier" v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10">
      <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" bottomPullText="上拉加载更多"> -->
        <div class="sup-item" v-for="(item,index) in supData" :key="index">
          <div class="sup-img">
            <img :src="item.HeadPortraitURL" v-if="item.HeadPortraitURL">
            <img src="@/assets/images/wholesale/user-icon.png" alt="" v-else>
          </div>
          <div class="sup-text">
            <div class="sup-name">
              <p>{{ item.username }}</p>
              <span v-if="item.status == 2" class="pass" @click="business(item)">进入店铺</span>
              <span v-if="item.status == 1">审核不通过</span>
              <span v-if="item.status == 0">待审核</span>
            </div>
            <div class="sup-xx">手机号码：{{ item.mobile }}</div>
            <div class="address">地址：{{ item.province+item.city+item.area+item.street+item.adressdetail }}</div>
          </div>
        </div>
      <!-- </mt-loadmore> -->
      <div v-if="supData==undefined" class="nodata">~ 无供应商 ~</div>
      <div v-if="isBhsj && userType!=2">
        <div class="bhsjImg"><img src="https://ndhimg.520shq.com/UploadFile/ImgFile/20200727/2020072717245558566.jpeg"></div>
        <div class="text">
          <p class="">HI，欢迎您的到来，快快入驻我们尊贵的批发商或商家吧，将有更多惊喜等着您！</p>
          <p class="">商家模式：您通过扫描批发商二维码进行登录后，就可以成为我们最挚爱的商家哟。</p>
          <p class="">入驻批发商模式：请前往<span @click="goSettled" style="color:#f00">批发商入驻页面</span>并填写相应信息提交，就可以入驻成为我们敬爱的批发商。</p>
        </div>
      </div>
    </div>
    <!-- <wholesale-nav v-if="userType == 2"></wholesale-nav> -->
    <!-- 申请（同意）弹窗 -->
    <div class="mask-con" v-show="isBand">
      <div class="mask-box">
        <!-- <h5 class="title">用户协议</h5> -->
        <div class="mask-desc">
          <div class="mask-list">
            <p class="p" style="text-align:center;background:#FFFFFF;" align="center">
              <b><span style="color:#343434;font-weight:bold;font-size:14.0000pt;background:#FFFFFF;">520批发网服务协议</span></b><b><span style="color:#343434;font-weight:bold;font-size:14.0000pt;background:#FFFFFF;"></span></b>
            </p>
            <p class="p" style="text-indent:21.0000pt;background:#FFFFFF;">
              <span style="color:#343434;font-size:9.0000pt;background:#FFFFFF;">&nbsp;</span><span style="color:#343434;font-size:9.0000pt;background:#FFFFFF;">&nbsp;</span><span style="font-size:9.0000pt;"><span>本协议由</span></span><b><span style="font-weight:bold;font-size:9.0000pt;"><span>广州华项科技有限公司</span>(以下简称“甲方”)</span></b><span style="font-size:9.0000pt;"><span>及同意并承诺遵守本协议规定使用</span></span><span style="font-size:9.0000pt;">520批发网（网址：www.520shq.com）</span><span style="font-size:9.0000pt;"><span>服务的</span></span><b><span style="font-weight:bold;font-size:9.0000pt;"><span>普通批发商</span></span></b><b><span style="font-weight:bold;font-size:9.0000pt;">(以下简称“乙方”)</span></b><span style="font-size:9.0000pt;"><span>共同缔结。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">1．协议生效和适用范围</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span style="font-size:9.0000pt;">1.1</span><span style="font-size:9.0000pt;"><span>当乙方点击确认本协议或使用</span>520批发网服务时，即表示乙方已充分阅读、理解并接受本协议的全部内容，并与甲方就使用520批发网服务一事达成一致。</span><b><span style="font-weight:bold;font-size:9.0000pt;"><span>本协议自乙方上传相关执照、证明并点击确认本协议之时起生效。如果乙方不同意本协议或其中任何条款约定，乙方应立即停止使用本平台及服务。</span></span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span style="font-size:9.0000pt;">1.2</span><b><span style="font-weight:bold;font-size:9.0000pt;"><span>本协议内容包括协议正文以及所有</span>520批发网已经发布的或将来可能发布的各类规则、操作流程。甲方有权以修改、更新等方式不时调整本协议和相关规则的内容，相关内容将公布于网站上或以其他方式通知乙方。除非乙方明示并通知甲方不愿接受调整后的内容，否则调整后的内容将于公布之日或通知另行指定的日期开始生效。如果乙方不同意本平台所公布的任何条款约定，乙方应立即停止使用本平台及服务并及时通知甲方。</span></b><b><span style="color:#343434;font-weight:bold;font-size:9.0000pt;background:#FFFFFF;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></b><b><span style="color:#FFFFFF;font-weight:bold;font-size:9.0000pt;background:#FFFFFF;"><span>意参谋服务协议</span></span></b><b><span style="color:#343434;font-weight:bold;font-size:9.0000pt;background:#FFFFFF;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;background:#FFFFFF;">2．服务使用</span></b><b><span class="15" style="font-weight:bold;font-size:9.0000pt;background:#FFFFFF;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;">2.1</span></b><span style="font-size:9.0000pt;">&nbsp;本服务仅向能够根据相关法律订立具有法律约束力的合约的企业提供。因此，乙方应确认其企业已取得真实、合法、有效的工商营业执照及相关行政许可等。</span><span style="font-size:9.0000pt;"><span>乙方同意为其未及时的通知或更新其信息承担全部责任，并保证其向甲方提供的全部证明文件有效、真实、准确且不存在超过时效问题（即保证所有证明文件在整个协议履行期间都处于有效期内）。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;">2.2&nbsp;</span></b><span style="font-size:9.0000pt;"><span>乙方须同时凭乙方名和密码登录服务，对于通过其他手段登录、使用所造成的后果，甲方将不承担任何责任。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:0.0000pt;text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;">2.3&nbsp;</span></b><span style="font-size:9.0000pt;"><span>甲方仅根据乙方名和密码确认使用服务的乙方身份。乙方应妥善保管乙方名和密码，并对其使用及其遗失自行承担责任。乙方承诺，如其乙方名和密码遭到未获授权的使用，或者发生其他任何安全问题时，将立即通知甲方。乙方在此同意并确认，甲方对因上述情形产生的遗失或损害不承担任何责任。</span>&nbsp;</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">3．服务功能</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">3.1</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"><span>甲方负责在现有技术上维护整个</span>520批发网的正常运行，并努力提升和改进技术，使乙方网上交易活动得以顺利进行；甲方将按“现状”和“可得到”的状态向乙方提供520批发网相关服务 。甲方依法律规定承担基础保障义务，但无法对由于信息网络设备维护、连接故障，电脑、通讯或其它系统的故障，黑客攻击，计算机病毒侵入或发作，电力故障，罢工，暴乱，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或因第三方原因而给乙方造成的损害结果承担责任。</span></b><span style="color:#333333;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;">3.2&nbsp;甲方保留在任何时候自行决定对服务及其版本、相关功能的变更、升级、修改、转移的权利。甲方进一步保留在服务中开发新的模块、功能或其它语种服务的权利。上述所有新的模块、功能、服务的提供，除非甲方有说明，否则仍适用本协议。</span></b><span style="font-size:9.0000pt;">&nbsp;</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">4．服务费用</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.1</span><span style="font-size:9.0000pt;"><span>本服务有效期为一年，自乙方成功付款之日起计算。乙方应按甲方制定的费用标准，根据其选择的服务内容不同向甲方支付不同的服务费</span>,年服务费分为人民币壹仟零捌拾元(￥1,080)、人民币壹仟捌佰伍拾元(￥1,8</span><span style="font-size:9.0000pt;">2</span><span style="font-size:9.0000pt;">5</span><span style="font-size:9.0000pt;">)、人民币叁仟捌佰捌拾元（￥3,</span><span style="font-size:9.0000pt;">8</span><span style="font-size:9.0000pt;">80）。乙方注册后，需确保其提供给甲方的注册信息真实、准确、完整与有效，如乙方注册信息变更，应在3日内通知甲方并提供更新后的信息。因注册信息有误、期限届满或其他原因时效致使本服务无法使用的，乙方已经支付的服务费无须退还，尚未支付则应仍须支付。</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.2乙方应当在使用服务前一次性支付上述费用，并由甲方向乙方开具相对应的技术服务费发票。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.3 续费：乙方可于服务使用期限届满前，向甲方提出继续使用服务的申请且全额支付下一阶段的服务费，经甲方同意后，本协议自当前服务使用期限届满之日起延续至下一阶段服务使用期届满。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.4甲方有权不时更改服务价格，但需提前通知乙方。如乙方服务仍在使用有效期内，则不受前述服务价格调整的影响；在服务期结束后，则乙方应按新价格标准购买服务。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.5除非有可以退还的另行约定或法律规定，所有已收取费用概不退还，并且因退款发生的任何费用均由乙方自行承担。&nbsp;</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">4.6税款与发票：双方应各自按照有关法律法规和国家政策的规定向有关的税务机关纳税。乙方</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"><span>销售</span></span><span class="15" style="font-weight:normal;font-size:9.0000pt;"><span>产品</span></span><span class="15" style="font-weight:normal;font-size:9.0000pt;"><span>或者提供服务应当依法出具纸质发票或者电子发票等购货凭证或者服务单据</span></span><span class="15" style="font-weight:normal;font-size:9.0000pt;"><span>，甲方不负责提供发票。</span></span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">5．乙方的权利和义务</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.1乙方保证向甲方提交的注册信息均真实、准确、及时、详尽和完整，在相关资料实际变更时，乙方需及时更新有关注册资料。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.2乙方在使用服务过程中所涉信息及服务不得含有任何违反国家法律、法规及中华人民共和国承认或加入的国际条约的内容，且乙方通过服务所从事的一切活动都是合法、真实的，不侵犯任何第三方的合法权益。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.3乙方保证其使用服务的各项行为均是基于真实、合法、有效的法律关系，均符合国家法律法规及本协议的规定。乙方只能在法律范围内使用服务，乙方不得在520批发网上有以下任一行为,否则，所造成的一切法律后果由乙方承担，并甲方有权采取收回权限或终止合作等处理措施：</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">(a)销售或许可销售国家禁止或限制流通的服务或产品；</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">(b)侵犯他人知识产权等合法权益；</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">(c)销售质量不合格的伪劣产品；</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">(d)传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">(f)其它法律法规规定的禁止性行为。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.4乙方承诺：其使用甲方网站服务所引发的一切法律后果由其自行承担全部责任。如因乙方使用服务的行为，导致甲方或任何第三方为此承担了相关的责任，则乙方需全额赔偿甲方或任何第三方的相关支出及损失，包括但不限于合理的律师费用、诉讼费、甲方支付给第三方的赔偿金等。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.5乙方保证在使用服务期间不从事任何与520批发网及其关联公司构成或可能构成竞争关系的业务。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.6乙方同意如因其违反本协议规定的任何条款或甲方不时发布的各项规则、通告。甲方有权单方判断立即终止乙方使用服务，而无需事先通知乙方。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.7乙方同意在使用服务的同时，同意接受甲方提供的各类信息服务。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.8 乙方在使用服务过程中所产生的一切费用均由乙方自行承担。</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:0.0000pt;text-indent:18.0000pt;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.9</span><span style="font-size:9.0000pt;"><span>乙方承诺在</span></span><span style="font-size:9.0000pt;">520</span><span style="font-size:9.0000pt;"><span>批发网</span></span><span style="font-size:9.0000pt;"><span>销售的</span></span><span style="font-size:9.0000pt;"><span>产品销售价格，不能高于乙方在其他网站上的销售价格以及不能高于常规渠道零售价格，且保证产品的运费收取合理，如发现所提供的上架产品高于其它网站或经查实举证高于常规渠道的零售价格或运费收取过高，经沟通乙方仍未及时做出修正，甲方有权拒绝发布或删除该产品信息，并甲方有权单方面终止协议。</span></span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">5.</span><span class="15" style="font-weight:normal;font-size:9.0000pt;">10</span><span class="15" style="font-weight:normal;font-size:9.0000pt;"><span>除非事先取得甲方书面同意，乙方不得将其在本协议项下的权利与义务转让给任何第三方。</span></span><span class="15" style="font-weight:normal;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="color:#343434;font-weight:bold;font-size:9.0000pt;">6．甲方的权利义务</span></b><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:17.8500pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">6.1</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;甲方将按照本协议的规定向乙方提供服务。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:17.8500pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">6.2</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;甲方有权在其服务器上复制并保存乙方的信息。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:17.8500pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">6.3</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;甲方有权随时删除含有任何违反法律、法规、服务协议、各项规则的乙方信息或链接，包括甲方对此有合理怀疑的信息。甲方有权单独对乙方提供的信息是否属于上述范围做出判断。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:17.8500pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">6.4</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;甲方负责服务的维护与升级，并对该服务进行日常管理。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="margin-left:0.0000pt;text-indent:18.0000pt;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">6.5</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;</span><span style="font-size:9.0000pt;"><span>甲方不对乙方向买家提供的消费者保障服务内容及提供的正品保障服务内容承担任何保证责任，当发生买家在付款但未收到货，</span></span><span style="font-size:9.0000pt;"><span>产品</span></span><span style="font-size:9.0000pt;"><span>与网上描述不符、</span></span><span style="font-size:9.0000pt;"><span>产品</span></span><span style="font-size:9.0000pt;"><span>存在质量问题等情形时，乙方应保证买家的权益，对于买家因前述问题提出的退换货要求，乙方应积极处理。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="margin-left:17.8500pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">7．知识产权</span></b><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">7.1</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;甲方拥有本协议所规定的服务产品的著作权、商标权、专利权、专利申请权、专有技术、商业秘密以及其他相关的知识产权，包括与该服务有关的各种文档资料、其它本协议中未经提及的权利亦由甲方保留。甲方有权在不经通知乙方的情况下单方面将上述权利转让给第三方。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">7.2</span></b><span style="color:#343434;font-size:9.0000pt;">&nbsp;未经甲方事先书面同意，乙方不得为任何营利性或非营利性的目的自行实施、利用、转让或许可任何第三方实施、利用、转让上述知识产权。</span><span style="color:#343434;font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <b><span style="color:#343434;font-weight:bold;font-size:9.0000pt;">8．</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"><span>违约责任及处理</span></span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <b><span class="15" style="color:#000000;font-weight:bold;font-size:9.0000pt;">8.1</span></b><span style="color:#000000;font-size:9.0000pt;">&nbsp;</span><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"><span>出现下列情况之一的，甲方有权在不事先通知的情况下立即终止乙方使用服务。甲方对此无需承担任何责任并有权不予退还剩余服务费（如有）：</span></span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span class="15" style="color:#000000;font-weight:normal;font-size:9.0000pt;">(a)</span><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"><span>乙方服务使用期限届满或提前到期。乙方服务使用期限届满后乙方如需继续使用本协议约定之服务的，由乙方向甲方支付相应的费用。</span></span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span class="15" style="color:#000000;font-weight:normal;font-size:9.0000pt;">(b)</span><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"><span>乙方违反本协议有关约定、规则或本协议补充约定的；</span></span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;">(c)违背诚信原则、弄虚作假，严重损害甲方的声誉；</span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <h2 style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;">(d)使用平台时违反相关法律法规规定的；</span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </h2>
            <h2 style="text-indent:18.0000pt;background:#FFFFFF;">
              <span class="15" style="color:#000000;font-weight:normal;font-size:9.0000pt;">(e)</span><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"><span>其他甲方依单方判断认为应该立即终止乙方使用服务的情形。</span></span></b><b><span style="color:#000000;font-weight:bold;font-size:9.0000pt;"></span></b>
            </h2>
            <p class="MsoBodyText" style="margin-left:11.3500pt;text-indent:9.0000pt;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">8.2违约处理措施</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <h2 style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">(a)甲方可依相关规则约定对乙方及乙方的关联账户采取关闭账户、收回权限、中止或终止合作、5000元以上罚款或根据乙方在520批发网上累计销售总额的五倍以上进行罚款等处理措施，甲方有权直接从应付乙方货款中扣除。如甲方受到的损失大于罚金的数额，则甲方有权继续向乙方追偿。</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </h2>
            <h2 style="text-indent:18.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">(b)甲方可对乙方的违约行为处理措施信息，以及其它经国家行政或司法机关生效法律文书确认的违法信息予以公示。</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </h2>
            <p class="MsoBodyText" style="margin-left:11.3500pt;text-indent:9.0000pt;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">8.3赔偿责任</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:21.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;"><span>如乙方的行为使甲方或其关联公司遭受损失（包括但不限于：直接经济损失、商誉损失、预期可得商业利益损失、甲方或其关联公司对外支付的赔偿金、和解款、律师费、诉讼费等），乙方应赔偿甲方及</span>/或其关联公司的上述全部损失。</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:21.0000pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;"><span>如乙方的行为使甲方及</span>/或其关联公司遭受第三方主张权利，甲方及/或其关联公司可在对第三人承担金钱给付等义务后就全部损失向乙方追偿。</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span style="font-size:9.0000pt;">8.4特别约定</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;"><span>如乙方向甲方及</span>/或其关联公司的雇员或顾问等提供实物、现金、现金等价物、劳务、旅游等价值明显超出正常商务洽谈范畴的利益，则可视为乙方存在商业贿赂行为。发生上述情形的，甲方可立即终止与乙方的所有合作并向乙方收取违约金，甲方每发现一次，乙方应承担等值于商业贿赂财物或权益价值的五倍的违约金。</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span style="font-size:9.0000pt;"><span>如乙方因违约导致甲方终止本协议时，出于维护合作秩序的目的，甲方及</span>/或其关联公司可对乙方在其他它议项下的合作采取中止甚至终止协议的措施，并以本协议约定方式通知乙方。</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">8.5在任何情况下，甲方均不对源于、基于或因本协议或乙方使用服务而导致的数据的丢失和/或任何损害赔偿负责，包括但不限于非直接的、间接的、特殊的、附带性的或惩罚性的损害赔偿或其他任何形式的损害赔偿，即使甲方已被告知此等损害赔偿的可能性。</span></b><b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">8.6无论在何种情况下， 甲方均不对通信系统或互联网的中断、迟延或无法运作、技术故障、计算机错误或病毒、信息损坏或丢失或其它在甲方合理控制范围之外的原因而产生的其他任何性质的破坏而向乙方或任何第三方承担损害赔偿责任。&nbsp;</span></b><b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;">9．不可抗力 </span></b><b><span class="15" style="color:#343434;font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0000pt;background:#FFFFFF;">
              <span style="font-size:9.0000pt;"><span>如果由于黑客攻击或政府管制或网络通讯瘫痪等对其发生和后果不能预见的事件，双方均确认此属不可抗力；双方应按照不可抗力对影响履行本协议的程度，协商决定是否解除本协议、免除履行本协议的部分义务，或者延期履行本协议</span> <span>。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span style="font-weight:bold;font-size:9.0000pt;">10．法律及争议解决</span></b><span style="font-size:9.0000pt;">&nbsp;</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span style="font-size:9.0000pt;">(a)在双方就本协议项下条款的解释和履行发生争议时，双方应以善意通过协商解决该争议。双方不能自行协商解决的，任何一方均可向</span><span style="font-size:9.0000pt;"><span>甲方所在地的人民法院通过提起诉讼获得裁决。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span style="font-size:9.0000pt;">(b)本协议的订立、效力、执行、解释及争议的解决均应适用中国法律。</span><b><span class="15" style="font-weight:bold;font-size:9.0000pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></b><b><span class="15" style="font-weight:bold;font-size:9.0000pt;"></span></b>
            </p>
            <p class="p" style="text-indent:18.0500pt;background:#FFFFFF;">
              <b><span class="15" style="font-weight:bold;font-size:9.0000pt;">11.</span></b><b><span style="font-weight:bold;font-size:9.0000pt;"><span>其它条款</span></span></b><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span style="font-size:9.0000pt;">11.1如果本协议有任何一条或多条规定根据任何法律或法规在任何方面被裁定为无效、不合法或不可执行，本协议其余规定的有效性、合法性或可执行性不应因此在任何方面受到影响或损害。双方应通过诚意磋商，争取以法律许可以及双方期望的最大限度内有效的规定取代那些无效、不合法或不可执行的规定，而该等有效的规定所产生的经济效果应尽可能与那些无效、不合法或不能强制执行的规定所产生的经济效果相似。</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoBodyText" style="text-indent:18.0000pt;">
              <span style="font-size:9.0000pt;">11.2平台现在及将来发布的全部平台规则、公告、说明等，都是本协议不可分割的部分，与本协议具有同等法律效力。</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoNormal" style="margin-left:0.0000pt;text-indent:18.0000pt;text-align:left;vertical-align:baseline;background:#FFFFFF;">
              <span style="font-size:9.0000pt;">11.3本协议的标题仅为方便阅读所设，非对条款的定义、限制、解释或描述其范围或界限。</span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoNormal" style="margin-left:0.0000pt;text-indent:18.0000pt;text-align:left;vertical-align:baseline;background:#FFFFFF;">
              <span class="15" style="font-weight:normal;font-size:9.0000pt;">11.4</span><span style="font-size:9.0000pt;"><span>甲方于乙方过失或违约时放弃本协议规定的权利的，不得视为甲方对乙方的其他或以后同类之过失或违约行为弃权。</span></span><span style="font-size:9.0000pt;"></span>
            </p>
            <p class="MsoNormal" style="text-indent:18.0000pt;text-align:left;vertical-align:baseline;background:#FFFFFF;">
              <span style="font-size:9.0000pt;"><span>【以下无正文】</span></span>
            </p>
          </div>
        </div>
        <div class="btns-con">
          <button class="btns" @click="isBand = false">拒绝</button>
          <button class="btns" @click="applyBind">同意</button>
        </div>
      </div>
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script type="text/javascript">
import wholesaleNav from '@/components/WholesaleNav';
import { Loadmore } from 'mint-ui';
// Vue.component(Loadmore.name, Loadmore);
import {showToast,getCookie,setCookie} from '@/assets/js/common.js'

export default {
  name: 'myaddress',
  data() {
    return {
      topnav:{
        title:'选择供货商'
      },
      supData:[],
      //loading:true,
      isBand:false,
      wholesalerSeq:'',
      mobile:'',
      seq:'',
      navShow:false,
      userType:'',
      isLogin:'',
      isApp:'',
      addressDetail:'',
      isBhsj:false,
      status:'-1',
      IsServicer:'',
      pages:1,//请求第页数
      pageTotal:1,//绑定批发商总页数
      loading:false,
      isLoading:true,//是否加载
      system:'',
      isPopupShow:true,//试用期提示弹框展示
    }
  },
  components:{
    wholesaleNav
  },
  created(){
    // 账号seq
    let auditStatus = sessionStorage.getItem('auditStatus');
    if(auditStatus){
      this.status = auditStatus;
    }
    let seq = sessionStorage.getItem('seq');
    if(seq && seq !=undefined){
      this.seq = seq;
    }
    let IsServicer = sessionStorage.getItem('IsServicer');
    if(IsServicer){
      this.IsServicer = IsServicer;
    }
    // let seq = this.$route.query.seq;
    // if(seq){
    //   sessionStorage.setItem('seq',seq);
    //   this.seq = seq;
    // }else{
      // seq = sessionStorage.getItem('seq');
      // if(seq && seq !=undefined){
      //   this.seq = seq;
      // }
    // }
    // let type = this.$route.query.type;
    // if(type){
    //   sessionStorage.setItem('userType',type);
    //   sessionStorage.setItem('app',type);
    //   this.userType = type;
    // }
    let fromApp = sessionStorage.getItem('app');
    if(fromApp){
      this.isApp = fromApp;
    }
    let from = this.$route.query.from;
    if(from){
      this.navShow = true;
    }
    let isLogin = sessionStorage.getItem('isLogin');
    if(isLogin){
      this.isLogin = isLogin;
    }
    //二维码 批发商seq
    let wholesalerSeq = sessionStorage.getItem('wholesalerSeq');
    if(wholesalerSeq){
      this.wholesalerSeq = wholesalerSeq;
      this.isBand = true;
    }
    //用户手机号
    let mobile = sessionStorage.getItem("mobile");
    if(mobile && mobile !=undefined){
      this.mobile = mobile;
    }
    //用户类型
    // let userType = getCookie('userType');
    let userType = sessionStorage.getItem("userType");
    if(userType){
      this.userType = userType
    }

  },
  mounted(){
    this.isPassSettled();
    this.isOverdue();
    // this.getWholesaleList();
  },
  methods: {
      // 判断试用账号是否过期
      isOverdue(){
          // 创建保存弹框显示标志
          // 判断标识是否存在  不存在  创建  存在  读取
          let isShow = sessionStorage.getItem("isPopupShow");
          // 入驻类型
          let certificateType = sessionStorage.getItem("certificate_type");
          let isExpired = sessionStorage.getItem("IsExpired");
          if(!isShow){
              sessionStorage.setItem("isPopupShow",1);
          }
          if(certificateType == "4" && isExpired == "true" && this.isPopupShow){
              if(isShow == 0) return;
              MessageBox({
                title:"",
                message: '您的批发商账号免费试用三个月已到期，是否需要继续使用？',
                showCancelButton: true,
                confirmButtonText:'是',
                cancelButtonText:'否'
              }).then(action => {
                if(action=='confirm'){
                    this.$router.push("/cooperation");
                    sessionStorage.setItem("isPopupShow",0);
                }if (action == 'cancel') {    //取消的回调
                    sessionStorage.setItem("isPopupShow",0);
                }
                });
            }
      },
    isPassSettled(){
      if(this.status == 0){
        if(!this.$route.query.from && this.$route.query.from != 'progress'){
          this.$router.push({path:'/wholesaleCheckProgress',query:{seq:this.seq,from:'supplier'}});
        }
      }else if(this.status == 2||this.status==5){
        MessageBox({
          title:"",
          message: '您提交的批发商入驻资料被驳回，是否前往重新填写资料?',
          showCancelButton: true,
          confirmButtonText:'立即前往',
          cancelButtonText:'放弃入驻'
        }).then(action => {
          if(action=='confirm'){
            location.href = this.SETTLED +'?wholesaler='+this.seq+'&rewrite=true&isSupplier=true';
          }
        })
      }
    },
    business(el){
      let that = this;
      // console.log(this.userType);
      // setTimeout(function(){
        // if(that.userType == 1){

        if (el.wholesaler_seq=="4585605"){
            that.$router.push({path:'/wholesale/notice'});
        } else {
            that.$router.push({path:'/business',query:{wholesaler:el.wholesaler_seq}});
            sessionStorage.setItem("oldWseq",el.wholesaler_seq)
        }
        // }else if(that.userType == 2){
        //   that.$router.push({path:'/supplier/index',query:{wholesaler:el.wholesaler_seq}});
        // }
      // });
    },
    goSettled(){
      var url = '';
      if(this.status == -1){
        // url = this.SETTLED+'?usertype=3&wholesaler='+Base64.encode(this.seq)+'&phone='+Base64.encode(this.mobile)+'&isSupplier=true';
        url = this.SETTLED+'?usertype=3&wholesaler='+this.seq+'&phone='+this.mobile+'&isSupplier=true';
        // url = this.SETTLED+'?usertype=3&wholesaler='+this.seq+'&phone='+this.mobile+'&isSupplier=true&rewrite=true';
      }else{
        url = this.SETTLED+'?usertype=3&wholesaler='+this.seq+'&phone='+this.mobile+'&isSupplier=true&rewrite=true';
        // url = this.SETTLED+'?usertype=3&wholesaler='+Base64.encode(this.seq)+'&phone='+Base64.encode(this.mobile)+'&isSupplier=true&rewrite=true';
      }
      // let url = 'http://192.168.1.36:1099/html5/settled/userInfo.html?usertype=3&wholesaler='+this.wholesaler+'&phone='+this.shopData.mobile+'&isIndex=true';
      // let url = 'http://localhost:37809/html5/settled/userInfo.html?usertype=3&wholesaler='+this.wholesaler+'&phone='+this.shopData.mobile+'&isIndex=true';
      window.location.href=url;
    },
    // app退出登录
    backPage(){
      if(this.isApp){
        window.action.backPageLogin();
      }else{
        setCookie('seq','');
        setCookie('isAuto',this.$base64.encode("false"));
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
    //二维码绑定弹窗
    // 拒绝
    refuseBind(){
      this.getWholesaleList();
      this.isBand = false;
    },
      // 同意
      applyBind(){
        let params = {
          seq:this.seq,
          yqcode : this.wholesalerSeq,
          mobile : this.mobile
        };
        axios.get(this.URL + '/User/BindQRCode',{params:params})
        .then((res) => {
          if(res.data.result == 200){
            showToast("申请成功");
            sessionStorage.removeItem('wholesalerSeq');
            this.wholesalerSeq = '';
            this.getWholesaleList();
          }else{
            showToast("申请失败");
            sessionStorage.removeItem('wholesalerSeq');
            this.wholesalerSeq = '';
          };
        });
        this.isBand = false;
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
      // 获取绑定批发商数据
    getWholesaleList(){
      if(!this.isLoading) return;
      this.loading = true;
      if(this.pages > this.pageTotal) {
            this.isLoading = false;
            return;
        };
      axios.get(this.URL + '/WholesaleManage/GetUserWholesalerlist',{params:{userseq:this.seq,page:this.pages,rows:10}}).then(res => {
        //this.loading = false;
        if(res.data.WholesaleUserVM.length !=0){
          this.supData = this.supData.concat(res.data.WholesaleUserVM);//绑定批发商的数据
          this.pageTotal = res.data.TotalPage;

          for(let i = 0;i<res.data.length;i++){
            if(this.wholesalerSeq && this.wholesalerSeq !=res.data[i].wholesaler_seq){
                this.isBand = true;
              }
          }
          this.isBhsj = false;
          // if(this.pages >= this.pageTotal){
          //   this.allLoaded = true;
          // }
          this.loading = false;
          this.pages++;
        }else{
          if(this.wholesalerSeq){
            this.isBand = true;
          }
          this.isBhsj = true;
        }
      });
    },
    // 加载更多
    loadMore(){
      this.getWholesaleList();
    },
  }
}
</script>

<style scoped>
.glode{
  min-height:100vh;
}
.dinghuo{
  padding: 0.1111rem .2222rem;
  background:#f00;
  color:#fff;
  border-radius:25px;
  font-size: .4888rem;
}
.supplier{
  margin-top:44px;
  overflow:hidden;
  height:auto;
  overflow-y:auto
}
.supplier .sup-item{
  overflow:hidden;
  padding:0.5rem 10px;
  background:white;
  margin-top:0.5rem;
  font-size:0.65rem;
}
.supplier .sup-item .sup-img{
  float:left;
  width:4rem;
  height:4rem;
  overflow:hidden;
  background:#f2f2f2;
}
.supplier .sup-item .sup-text{
  float:right;
  width:calc(100% - 4.5rem);
  height:4rem;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content:space-between;
  justify-content:space-between;
  padding:0.2rem 0;
}
.supplier .sup-item .sup-text .sup-name{
  overflow:hidden;
}
.supplier .sup-item .sup-text .sup-name p{
  float:left;
  width:9em;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  line-height:1.6em;
}
.supplier .sup-item .sup-text .sup-name span{
  float:right;
  line-height:1.6em;
  width:5.2em;
  text-align: center;
  background:#fe6f37;
  color:white;
  border-radius:3px;
}
.supplier .sup-item .sup-text .sup-name span.pass{
  background:#f71010;
}
.supplier .sup-item .sup-xx{
  color:#666;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.supplier .sup-item .address{
  color:#666;
  overflow:hidden;
  text-overflow:ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.nodata{
  overflow:hidden;
  padding:1rem;
  text-align: center;
  font-size:0.8rem;
  font-weight:bold;
  color:#ccc;
}
.supplier-con .mask-con{
  position:fixed;
  width:100%;
  height:100%;
  top:0;
  left:0;
  background-color:rgba(0,0,0,.5);
}
.supplier-con .mask-box{
  position:absolute;
  top:50%;
  left:50%;
  margin-top:-7.7778rem;
  margin-left:-6.6667rem;
  width:13.3333rem;
  height:15.5556rem;
  background-color:#fff;
  overflow:hidden;
  border-radius:.2222rem;
}
.supplier-con .title{
  text-align:center;
  padding:.8889rem 0;
  font-size:.7111rem;
}
.supplier-con .mask-desc{
  height:100%;
  overflow:auto;
}
.supplier-con .mask-list{
  padding:15px 15px 2rem;
}
.supplier-con .mask-item{
  font-size:.5333rem;
  padding:0 .7333rem;
  line-height:.8rem ;
}
.supplier-con .btns-con{
  position:absolute;
  left:0;
  bottom:0;
  width:100%;
  height:1.7778rem;
  border-top:.0222rem solid #ccc;
  display:flex;
  background:white;
}
.supplier-con .btns-con .btns{
  background-color:transparent;
  border:0;
  outline-style: none;
  font-size:.6667rem;
  flex:1;
}
.supplier-con .btns-con .btns:nth-child(2){
  color:#fe0000;
  border-left:.0222rem solid #ccc;
}
.supplier-con .btns-con .btns:active{
  background-color:#f2f2f2;
}
.text{
  padding: 0.4444rem;
}
.text p{
  text-indent:1.5111rem;
  font-size:0.7555rem;
  margin-bottom: 0.4444rem;
}
.text p a{
  color:#f71010;
}
</style>
