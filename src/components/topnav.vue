<template>
  <div>
    <!--正常-->
    <mt-header v-if="top.title" :title="top.title">
        <mt-button icon="back" slot="left" @click="back"></mt-button>
        <mt-button v-if="top.more" icon="more" slot="right"></mt-button>
        <mt-button v-if="top.send" slot="right" class="send"><img src="../assets/images/fenxian.png"></mt-button>
        <mt-button v-if="top.addnewaddress" slot="right" class="addnewaddress" @click="toeditaddr">添加新地址</mt-button>
    </mt-header>
    <!--搜索-->
    <header v-if="top.searh" class="mint-header">
        <div class="mint-header-button is-left">
            <button class="mint-button" @click="back">
                <span class="mint-button-icon">
                    <i class="mintui mintui-back"></i>
                </span>
            </button>
        </div>
        <h1 class="mint-header-title">
            <div class="searhed">
                <i class="el-icon-search"></i>
                <input type="text" :placeholder="keyword?keyword:'请输入需要搜索的商品名称'" @focus="searhed">
                <i class="el-icon-circle-close" v-show="close" @click="closefn"></i>
            </div>
        </h1>
        <div class="mint-header-button is-right" @click.stop="submitfn">搜索</div>
    </header>
  </div>
</template>

<script>
export default {
    props:['top','noBack'],
    data(){
        return{
            close:false,
            keyword: this.top.keyword
        }
    },
    watch: {
        ['top.keyword'](val){
            this.keyword = val;
        },
        // keyword(val){
        //    this.$emit('keyword-change',val);
        // } 
    },
    mounted() {
        
    },
    methods:{
        back(){
            if(this.top.url){
                this.$router.push(this.top.url);
            }else{
                this.$router.go(-1);
            }
        },
        toeditaddr(){
            this.$router.push({path:'/addNewAddr'})
        },
        searhed(){
            this.close = true;
        },
        closefn(){
            $('.searhed input').val('').focus();
        },
        blurfn(){
            this.close = false;
        },
        submitfn(){
            let text = $('.searhed input').val();
            let searchHistory = this.$cookie.get('searchHistory');
            let history = [];
            let num = 10;
            if(text==''){
                Toast('请输入搜索关键词。');
                return false;
            };
            if(searchHistory == null || searchHistory == undefined){
                history.push(text);
            }else{
                let searchArr = JSON.parse(searchHistory);
                if(searchHistory.indexOf(text) == -1){
                    if(searchArr.length > 0 && searchArr.length < num){
                        history.push(text);
                        history = history.concat(searchArr);
                    }else if(searchArr.length == num){
                        searchArr.splice(num-1,1);
                        history.push(text);
                        history = history.concat(searchArr);
                    }else{
                        history.push(text);
                    }
                }else{
                    history = searchArr;
                }
            };
            this.keyword = text;
            this.$cookie.set('searchHistory', JSON.stringify(history), 365);
            this.$router.push({path:'/productList',query:{wholesaler:this.$route.query.wholesaler,keyword:text}});
            this.$emit('keyword-change',this.keyword);
            $('.searhed input').val('');
        },
    }
}
</script>
<style scoped>
.mint-header-button{-webkit-box-flex:.1;-ms-flex:.1;flex:.1;}
.searhed{float:left;padding:6px 0.5rem;background:#f5f5f5;border-radius:2em;width:calc(100% - 0.5rem);-moz-box-shadow:1px 1px 3px #e3e3e3 inset;-webkit-box-shadow:1px 1px 3px #e3e3e3 inset;box-shadow:1px 1px 3px #e3e3e3 inset;}
.searhed input{background:transparent;float:left;width:calc(100% - 0.5rem - 2.2em);font-size:15px;}
.searhed i.el-icon-search{float:left;color:#9c9c9c;padding-right:0.2rem;padding-top:3px;line-height:1em;font-size:15px;}
.searhed i.el-icon-circle-close{float:right;color:#9c9c9c;line-height:1em;font-size:15px;}
.mint-header-button{float:right;color:#666;font-size:16px;}
.mint-header{font-size: .7556rem /* 34/45 */;background-color: #fff;color: #000}
.send{width:16px;}
.send img{display:block;}
.addnewaddress{font-size: .6222rem /* 28/45 */;color: #ff0000;}
</style>
