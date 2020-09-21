<template>
   <div class="global">
      <topnav :top='topnav'></topnav>
      <div class="meswrap">
        <div class="meslist" v-for="(item,index) in megList" :key="index">
          <div class="titlewrap">
            <span class="title">{{item.Title}}</span>
            <span class="time">{{item.CreateTime}}</span>
          </div>
          <div class="content">{{item.Content}}</div>
          <div class="btnwrap">
              <mt-button  class="btnsure" type="default"
                :style="item.Type == 4 ? 'background: #c4c4c4':item.isFlag == 3 ? 'background: #ff3333':'background:#08a9f0'"
                :disbaled="item.isFlag==0 ? false :true">
              {{item.Type==0?'申请改价':item.Type==1?'待支付':item.Type==2?'立即支付':item.Type==3?'确认发货通知':'已确认收货'}}
              </mt-button>
              <!-- <mt-button  class="btndown" type="default" :disbaled="item.isFlag==0 ? false :true">{{item.Type==0?'申请改价':item.Type==1?'待支付':item.Type==2?'立即支付':item.Type==3?'确认发货通知':'已确认收货'}}</mt-button>
              <mt-button  class="btn" type="default" :disbaled="item.isFlag==0 ? false :true">{{item.Type==0?'申请改价':item.Type==1?'待支付':item.Type==2?'立即支付':item.Type==3?'确认发货通知':'已确认收货'}}</mt-button> -->
          </div>
        </div>
      </div>
      <bottomnav :bottom="bottomnav"></bottomnav>
   </div>
</template>

<script type="text/javascript">
export default {
   name: 'Message',
   data() {
       return {
         topnav:{
            title:'消息通知'
         },
         bottomnav:{
              index:'个人中心'
         },
         seq:sessionStorage.getItem('seq'),
         megList:[],//消息列表数据,
         Type:'',//0 申请改价 1待支付 2 立即支付 3确认发货通知 4已确认收货
         isFlag:'',//0 按钮 可操作  1 灰色不可操作 控制按钮的禁用
         isRead :'',//是否已读
       }
   },
   mounted(){
     document.querySelector("body").setAttribute("style","background-color: #f5f5f5");//切换本页body背景颜色
     axios.get(this.URL + '/PersonalCenter/MessageNotice?seq=' + this.seq).then(res=>{
      //  console.log(res.data);
       if (res.status == 200) {
         this.megList = res.data
       }
     })
   },
   methods: {
   }
}
</script>

<style>
  .global .meswrap .meslist{
    height: 100%;
    margin-top: .4444rem /* 20/45 */;
    background: #fff;
    padding: .4444rem /* 20/45 */;
    overflow: hidden;
  }
  .global .meswrap .meslist .titlewrap{
    display: flex;
    justify-content: space-between;

  }
  .global .meswrap .meslist .title{
    font-size: .7111rem /* 32/45 */;
    color: #212121;
  }
  .global .meswrap .meslist .time{
    font-size: .6222rem /* 28/45 */;
    color: #212121;
  }
  .global .meswrap .meslist .content{
    font-size: .6222rem /* 28/45 */;
    color: #444444;
    margin-top: .4rem /* 18/45 */;
  }
  .global .meswrap .meslist .btnwrap{
    display: flex;
    justify-content: flex-end;
    margin-top: .5556rem /* 25/45 */;
  }
  .global .meswrap .meslist .btnwrap .btn{
    height: 1.1111rem /* 50/45 */;
    width: 3.7rem;
    /* background: #08a9f0; */
    font-size: .6222rem /* 28/45 */;
    color: #fff;
    min-width: 75px;
  }
  .global .meswrap .meslist .btnwrap .btnsure{
    height: 1.1111rem /* 50/45 */;
    width: 3.7rem;
    /* background: #ff3333; */
    font-size: .6222rem /* 28/45 */;
    color: #fff;
    min-width: 75px;
  }
  .global .meswrap .meslist .btnwrap .btndown{
    height: 1.1111rem /* 50/45 */;
    width: 3.7rem;
    /* background: #c4c4c4; */
    font-size: .6222rem /* 28/45 */;
    color: #fff;
    min-width: 75px;
  }
</style>
