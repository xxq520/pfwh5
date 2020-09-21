<template>
    <div class="ChangeCode">
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span style="flex: 1;">{{topnav.title}}</span>
            <span @click="goshang()">确定</span>
        </div>
        <div class="head">
            <div>已选择 </div>
            <div style="color: #FF6023; flex: 1;overflow: hidden;"> {{title?title:'暂未选择'}} </div>
        </div>
        <div class="main" v-if="step ==1">
            <div class="name"> <div>请选择一级分类</div><div style="color:#FF7725;" @click="resfu">重新选择</div> </div>
            <div class="info" v-for="a in Flist" @click.stop="getTclass(a)">
                <div>{{a.categoryName}}</div>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>


        <div class="main" v-if="step ==2">
            <div class="name"><div>请选择二级分类</div><div style="color:#FF7725;" @click="resfu">重新选择</div></div>
            <div class="info" v-for="b in Tlist" @click.stop="getSclass(b)">
                <div>{{b.categoryName}}</div>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <div class="main" v-if="step ==3">
            <div class="name"><div>请选择三级分类</div><div style="color:#FF7725;" @click="resfu">重新选择</div></div>
            <div class="info" v-for="c in Slist" @click.stop="getXclass(c)">
                <div>{{c.categoryName}}</div>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import {showToast} from '@/assets/js/common.js'
    export default {
        data() {
            return {
                topnav: {
                    title: '选择分类'
                },
                iSeq: sessionStorage.getItem('seq'),
                step: 1,
                Flist: [],
                Tlist: [],
                Slist: [],
                title: '',
                userInfo: this.$store.state.userInfo, // 用户信息
            }
        },

        mounted() {
            this.getFclass();


        },
        methods: {
            //重新选择
            resfu(){
               this.getFclass();
                this.title = '';
                this.step = 1;

            },
            //返回
            goback() {
                this.$router.go(-1)
            },
            //确定选择的分类
            goshang() {
                if(this.step == 2&&this.Tlist.length>0){
                    Toast("请选择二级分类");
                    return;
                }
                  if(this.step == 3&&this.Slist.length>0){
                  Toast("请选择三级分类");
                  return;
                  }
                sessionStorage.setItem("ftsname", this.title)
                this.$router.go(-1)
            },
            // 获取1级分类
            getFclass() {
                var that = this;
                let params = {
                    level: 1,
                    parentId:0,
                }
                axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList',params)
                    .then((res) => {
                        console.log(res,1)
                            if (res.data.code == 200) {
                                that.Flist = res.data.data.categoryList;
                            } else  {
                                showToast(res.data.message);
                            }
                        }
                    )
            },

            // 获取2级分类
            getTclass(val) {
                var that = this;
                sessionStorage.setItem("fflId", val.categoryId)
                let params = {
                    level: 2,
                    parentId:val.categoryId,
                };
                axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList', params)
                    .then((res) => {
                            if (res.data.code == 200) {
                                that.Tlist = res.data.data.categoryList;
                                that.step = 2;
                                that.title = val.categoryName;
                            } else  {
                                showToast(res.data.message);
                            }
                        }
                    )
            },

            // 获取3级分类
            getSclass(val) {
                sessionStorage.setItem("tflId", val.categoryId)
                var that = this;
                let params = {
                    level: 3,
                    parentId:val.categoryId,
                };
                axios.post(this.blockURL + '/qypfs-product/admin/super/product/getCategoryList', params)
                    .then((res) => {
                            if (res.data.code == 200) {
                                that.Slist = res.data.data.categoryList;
                                that.step = 3;
                                that.title = val.categoryName;
                            } else  {
                                showToast(res.data.message);
                            }
                        }
                    )

            },
            //获取选中的分类
            getXclass(val) {
                console.log('1');
                sessionStorage.setItem("sflId", val.categoryId)
                this.title = this.title + '-' + val.categoryName;
                sessionStorage.setItem("ftsname", this.title)
                this.$router.go(-1)
            },
        },

    }

</script>

<style scoped>
    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        min-height: 100vh;
        padding-top: 50px;
        padding-bottom: 3.5rem;
        position: relative;
    }

    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #FF7725;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
        padding: 0 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .top_nav i {
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        font-size: 0.58rem;
        text-align: center;
        text-indent: -2em;
    }

    .head {
        width: 100%;
        height: 2.25rem;
        padding: 0 0.4rem;
        display: flex;
        background-color: #fff;
        justify-content: space-between;
        align-items: center;
        font-size: 0.58rem;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .main {
        background-color: #fff;
        color: #888;
        padding: 0.5rem;
        font-size: 0.58rem;
    }

    .main .name {
        color: #333;
        line-height: 2.25rem;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .main .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 2rem;
        border-bottom: 1px solid #f5f5f5;
    }

    .main .info:last-child {
        border: none;
    }

</style>
