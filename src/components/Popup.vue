<template lang="html">
  <div class="popup-con">
      <mt-popup v-model="isShows" position="bottom" :closeOnClickModal="false">
          <div class="tab">
              <button class="cancle" @click="isShowPopups">取消</button>
              <p class="title">转移的线下服务中心名称</p>
              <button class="comit" @click="getValues">确定</button>
          </div>
          <mt-picker :slots="slots" valueKey="name" ref="picker"></mt-picker>
      </mt-popup>
  </div>
</template>

<script>
export default {
    props:["popupVisible"],
    data () {
        return {
            slots:[{values:[]}],
            isShows:""
        }
    },
    methods:{
        // 开启关闭遮罩层
        isShowPopups(){
            this.isShows = false;
            this.$emit("isShowPopup",false);
        },
        // 选择选项
        getValues(){
            let selectedValue = this.$refs.picker.getValues()[0];
            this.isShows = false;
        },
    },
    computed:{
        isShow:function(){
            console.log(this.popupVisible)
            this.isShows = this.popupVisible;
        }
    }
}
</script>

<style lang="css" scoped>
</style>
