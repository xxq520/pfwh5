export default {
    data:[],/*---------------*/
    userBlock:sessionStorage.getItem("userBlock")==="true"?true:false,/*当前用户是否有区域批发商身份*/
    userInfo:{},//用户信息
    storeId: null, // 需要查询的店铺ID
}