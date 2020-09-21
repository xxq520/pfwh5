<template>
    <div class="balance-wrap">
        <mt-header title="添加账户">
            <router-link slot='left' :to="{ path: '/wholesale/commissionOperation', query: { type: 4 }}">
                <mt-button icon='back'></mt-button>
            </router-link>
        </mt-header>
        <div class="list">
            <ul>
                <li>
                    <p>名称：</p>
                    <input type="text" placeholder="请输入名称" >
                </li>
                <li>
                    <p>账号：</p>
                    <input type="text" placeholder="请输入账号" >
                </li>
                <li>
                    <p>法人身份证号码：</p>
                     <input type="text" placeholder="请输入身份证号" >
                </li>
                <li>
                    <p>线下服务中心编码：<em>*</em></p>
                    <input type="text" placeholder="请输入编码" >
                </li>
            </ul>
            <ul>
                <li>
                    <p>备注：</p>
                    <input type="text" placeholder="请输入备注" >
                </li>
            </ul>
        </div>
        <div class="submit-btn">
            <span>保存</span>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
    
    }
}
</script>


<style scoped>
.balance-wrap {
    padding-bottom: 2.8889rem /* 130/45 */;
}
.balance-wrap .mint-header {
    background: #ef4628;
    color: #fff;
}
.list ul{
    background: #fff;
    border-radius: .2222rem /* 10/45 */;
    margin: .4444rem /* 20/45 */  .3333rem /* 10/45 */;
    padding: 0 .2222rem /* 10/45 */;
}
.list li{
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    border-bottom: 1px solid #000;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
      font-size: .6222rem /* 28/45 */;
}
.list li:nth-last-of-type(1) {
    border-bottom: 0;
}
.list li p {
    font-size: .6222rem /* 28/45 */;
    line-height: .6222rem /* 28/45 */;
}
.list li input{
    font-size: .6222rem /* 28/45 */;
    text-align: right;
}
.list li i {
    font-size: .7111rem /* 32/45 */;
}
.list li .tip {
    font-size: .2667rem /* 12/45 */;
    max-width: 70%;
}
.list li .btn {
    font-size: .5333rem /* 24/45 */;
    min-width: 2.6667rem /* 120/45 */;
    text-align: center;
    line-height: 1.3333rem /* 60/45 */;
    height: 1.3333rem /* 60/45 */;
    background: #3da1ff;
    color: #fff;
    border-radius: .2222rem /* 10/45 */;
    display: inline-block;
    padding: 0 .4444rem /* 20/45 */;
}
.list li em {
    color: #ef4628;
    font-style: normal;
}
.balance-wrap .submit-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: .6222rem /* 28/45 */;
    color: #fff;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    background: #ef4628;
}
</style>

