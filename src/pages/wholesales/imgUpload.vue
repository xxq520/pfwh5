<template>
  <div class="uploadbox" v-if="add">
    <!-- <i v-if="clear" class="el-icon-error imgClear" @click="closeUpload()"></i> -->
    <div class="upload" @click="uploadfn($event)">
      <div class="upload-icon">
        <i class="el-icon-plus"></i>
        <p>{{ text }}</p>
      </div>
      <input accept="image/*" type="file" style="display:none">
    </div>
    <div class="progress" v-if="zero">
      <div class="progress-text">{{ progressText }}</div>
      <mt-progress :value="progress" :bar-height="5"></mt-progress>
    </div>
  </div>
  <div class="uploadbox" v-else>
    <i v-if="!clear && imgObj.strLitimg" class="el-icon-error imgClear" @click="imgClearfn()"></i>
    <i v-if="clear" class="el-icon-error closeClear" @click="closeUpload()"></i>
    <div class="upload" @click="uploadfn($event)">
      <div class="upload-icon" v-if="!imgObj.strLitimg">
        <i class="el-icon-plus"></i>
        <p>{{ text }}</p>
      </div>
      <img :src="imgObj.strLitimg" v-else>
      <input accept="image/*" type="file" style="display:none">
    </div>
    <div class="progress" v-if="zero">
      <div class="progress-text">{{ progressText }}</div>
      <mt-progress :value="progress" :bar-height="5"></mt-progress>
    </div>
  </div>
</template>

<script>
export default {
  props: ["img",'add','stop','text','delete'],
  data () {
    return {
      imgObj:{},
      progress:0,
      progressText:'0%',
      zero: false,  //是否显示进度条
      uploadStop: this.stop,  //是否组织图片上传
      clearImage: this.delete, //是否阻止图片删除
      clear:false, // 是都取消上传
      source:null,   //取消上传
    }
  },
  watch:{
    imgObj(val){
      this.$emit("img-upload",val);
    },
    img: {
      immediate:true,
      handler:function(val){
        this.imgObj.strLitimg = val;
      }
    },
    stop(val){
      this.uploadStop = val;
    },
    delete(val){
      this.clearImage = val;
    }
  },
  mounted() {
  },
  methods: {
    // 删除图片
    imgClearfn(){
      if(this.clearImage && this.clearImage==true){
        return false;
      };
      let that = this;
      MessageBox({
        title:"",
        message: '是否确定删除图片？',
        showCancelButton: true
      }).then(action => {
        if(action ==='confirm'){
          that.imgObj = {};
          Toast('图片删除成功')
        }
      });

    },
    // 取消上传
    closeUpload(){
      let that = this;
      if(that.source){
        that.source.cancel('取消上传');//"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
      };
      this.clear = false;
      this.zero = false;
    },
    // 上传图片
    uploadfn(event){
      if(this.uploadStop && this.uploadStop==true){
        return false;
      };
      var el = event.currentTarget;
      let that = this;
      el.querySelector('input').click();
      el.querySelector('input').onchange = function(){
        that.ceartupload(this);
      };
    },
    // 上传事件函数
    ceartupload(event) {

      let that = this;
      let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
      that.source = cancelToken.source();

      let form = new FormData();
      form.append("file", event.files[0]);
      // 判断上传图片不能大于10mb
      if(event.files[0].size/(1024*1024) > 8){
        Toast('上传图片太大，请上传8mb以下的图片。')
        that.closeUpload();
        return false;
      };

      this.uploadStop = true;
      if(that.zero == false) that.zero = true;
      this.clear = true;

      axios({
        method: 'post',
        url: this.PRODUCT + '/Product/UploadProductPictures',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
        cancelToken:that.source.token,
        //上传监控事件
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        onUploadProgress (a){
            if (a.lengthComputable) {
              ;(function(){
                that.progress = Math.floor((a.loaded / a.total)*100);
                that.progressText = that.progress + '%';
              })();
            }
        },
        //下载监控事件
        onDownloadProgress (a){
            if (a.lengthComputable) {
              ;(function(){
                that.progress = Math.floor((a.loaded / a.total)*100);
                that.progressText = that.progress + '%';
              })();
            }
        }
      }).then(res => {
        console.log(res)
        this.clear = false;
        this.imgObj = res.data.Resultdata;
        this.imgObj.id = event.files[0].lastModified;
        this.progress = 0;
        this.progressText = '0%';
        event.value = ''; // 上传完图片清除input值
        this.zero = false;
        this.uploadStop = false;
      }).catch((err)=>{
        this.uploadStop = false;
      })
    },
  }
}
</script>

<style scoped>
.uploadbox{
  max-width: 3.3333rem /* 150/45 */;
  width:100%;
  position: relative;
  background:white;
  display: inline-block;
  margin-bottom: .5556rem /* 25/45 */;
}
.progress{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.25);
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index:1;
}
.progress >>> .mt-progress{
  width:90%;
  margin:0 auto;
  height:auto;
  line-height:auto;
  padding-bottom: .2222rem /* 10/45 */;
}
.progress-text{
  font-size:0.7rem;
  color:white;
  padding-left:.1778rem /* 8/45 */;
  padding-bottom:.1111rem /* 5/45 */;
  text-align:center;
  font-weight:bold;
}
.progress >>> .mt-progress-progress{
  background-color:#ff8f28;
  border-radius: 10px;
}
.progress >>> .mt-progress-content{
  display: inline-flex;
  width:100%;
}
.upload {
  color: #999999;
  width:3.3333rem /* 150/45 */;
  height:3.3333rem /* 150/45 */;
  overflow:hidden;
}
.imgClear, .closeClear{
  position:absolute;
  right:-.0667rem /* 3/45 */;
  top:-.0889rem /* 4/45 */;
  font-size:.4444rem /* 20/45 */;
  border-radius:50%;
  background:white;
  color:#ec0746;
  width:.4rem /* 18/45 */;
  height:.4rem /* 18/45 */;
  z-index:9;
}
.upload-icon{
  height:100%;
  text-align: center;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f3f3f3;
}
.upload-icon i{
  font-size:.6667rem /* 30/45 */;
  color:#ccc;
}
.upload-icon p{
  font-size:.3111rem /* 14/45 */;
  color:#999;
}
.uploadbox img {
  height: auto;
  max-height: 100%;
}
</style>
