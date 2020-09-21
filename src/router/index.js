import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/business/index'

const details = () => import('../pages/business/details/details')
const confirmorder = () => import('../pages/business/confirmorder/confirmorder')
const bindtel = () => import('../pages/business/bindtel')
const myorder = () => import('../pages/business/myorder')
const mineindex = () => import('../pages/business/mine/mineindex')
const changename = () => import('../pages/business/mine/changename')
const changetel = () => import('../pages/business/mine/changetel')
const changecode = () => import('../pages/business/mine/changecode')
const message = () => import('../pages/business/mine/message')
const returngoods = () => import('../pages/business/returngoods')
const returnmoney = () => import('../pages/business/returnmoney')
const returndetails = () => import('../pages/business/returndetails')
const myaddress = () => import('../pages/business/mine/myaddress')
const editaddress = () => import('../pages/business/mine/editaddress')
const orderFilter = () => import('../pages/business/orderFilter')
const addNewAddr = () => import('../pages/business/mine/addNewAddr')
const search = () => import('../pages/business/search')
const shoppingCart = () => import('../pages/business/shoppingCart')
const supplier = () => import('../pages/business/mine/supplier')
const mybank = () => import('../pages/business/mine/mybank')
const bankCard = () => import('../pages/business/bankCard')
const productList = () => import('../pages/business/productList')
const areaWholesales = () => import('../pages/wholesales/areaWholesales');
const notice = () => import('../pages/wholesales/notice');
const applyRecord = () => import('../pages/wholesales/applyRecord');
const wholesaleIndex = () => import('../pages/wholesales/WholesaleIndex')
const goodsManagement = () => import("../pages/wholesales/GoodsManagement")
const addToStore = () => import('../pages/wholesales/addToStore')
const addNewGoods = () => import('../pages/wholesales/addNewGoods')
const UploadGoods = () => import('../pages/wholesales/uploadGoods')
const storeManagement = () => import('../pages/wholesales/StoreManagement')
const userManagement = () => import('../pages/wholesales/UserManagement')
const orderManagement = () => import('../pages/wholesales/orderManage')
const WholesaleAddress = () => import('../pages/wholesales/WholesaleAddress')
const OrderDetails = () => import('../pages/wholesales/orderDetails')
const AdminssionDetails = () => import('../pages/wholesales/AdmissionDetails')
const storageSetting = () => import('../pages/wholesales/WholesaleSetting')
const Invitation = () => import('../pages/wholesales/Invitation')
const uploading = () => import('../pages/wholesales/Uploading')
const uploadingS = () => import('../pages/wholesales/UploadingS')
const blockSettledin = () => import('../pages/wholesales/blockSettledin') //区域批发商入驻
const uploadf = () => import('../pages/wholesales/UploadCheckF')
const uploads = () => import('../pages/wholesales/UploadCheckS')
const Yulan = () => import('../pages/business/details/yulan')
const Profit = () => import('../pages/Profit/index')
const InvitationRebate = () => import('../pages/Profit/Invitation')
const SalesDetails = () => import('../pages/Profit/SalesDetails')
const InvitationDetails = () => import('../pages/Profit/InvitationDetails')
const WholesaleCheckProgress = () => import('../pages/wholesales/WholesaleCheckProgress')
const PurchaseRecord = () => import("../pages/wholesales/PurchaseRecord")
const login = () => import('../pages/login'); //登录注册
const appLogin = () => import('../pages/appLogin')
const register = () => import('../pages/Register')
const successful = () => import('../pages/business/successful') //支付成功
const Payment = () => import('../pages/business/confirmorder/payment'); //分单支付
const AddGood = () => import('../pages/wholesales/addGood'); //添加新商品
const GoodSpec = () => import('../pages/wholesales/goodSpec')
const Commission = () => import('../pages/Commission/index'); // 代理商
const MyBalance = () => import('../pages/Commission/MyBalance') //我的余额)
const CashWithdrawal = () => import('../pages/Commission/CashWithdrawal') //我的余额)
const CommissionList = () => import('../pages/Commission/commissionList')
const CommissionOperation = () => import('../pages/Commission/commissionOperation')
const CommissionDetail = () => import('../pages/Commission/commissionDetail')
const TransferBalance = () => import('../pages/Commission/transferBalance')
const TransferCashDetail = () => import('../pages/Commission/transferCashDetail')
const AddAccount = () => import('../pages/Commission/addAccount')
const Account = () => import('../pages/Commission/account')
const Bill = () => import('../pages/Commission/Bill')
import Notice from '../pages/Notice/notice'; // 消息通知
const Cooperation = () => import('../components/Cooperation'); // 修改合作方式
const Paymethods = () => import('../pages/business/confirmorder/paymethods') //支付方式)
const Login = resolve => require(['../views/Login.vue'], resolve); //登录
const Register = resolve => require(['../views/Register.vue'], resolve); //注册
const BindPhone = resolve => require(['../views/BindPhone.vue'], resolve); //新用户绑定手机
const ForgetPassword = resolve => require(['../views/ForgetPassword.vue'], resolve); //新用户绑定手机
const Privacy = resolve => require(['../views/Privacy.vue'], resolve); //隐私政策

// 供应链新批发页面
const blobkApplyRecord = () => import('../pages/block/applyRecord'); // 入驻申请页面
const blockStoreManagement = () => import('../pages/block/storeManagement');// 区域批发商页面
const blockAddress = () => import('../pages/block/blockAddress'); //
const applyList = () => import('../pages/block/applyList');  // 区域批发商申请列表记录
const applyStatus = () => import('../pages/block/applyStatus'); // 某条申请的详情
const UserDetalis = () => import('../pages/block/UserDetalis'); // 下游商家详情
const UserDevelopment = () => import('../pages/block/UserDevelopment'); // 下游商家列表
const blank = () => import('../pages/block/blank'); //
const blockMyorder = () => import('../pages/block/myorder'); // 区域批发商我的订单
const blockChangecode = () => import('../pages/block/changecode'); //
const blockwholesaleIndex = () => import('../pages/block/WholesaleIndex'); // 区域批发商首页
const blockIndex = () => import('../pages/block/blockIndex'); // 区域批发商-角色5首页
const blockDetails = () => import('../pages/block/details/details'); // 区域批发商店铺商品详情
const blockShoppingCart = () => import('../pages/block/shoppingCart'); // 区域批发商购物车
const blockmyAddress = () => import('../pages/block/myaddress')
const blockGoodsManagement = () => import('../pages/block/goodsManagement')
const blockAddNewGoods = () => import('../pages/block/addNewGoods')
const blockSpecialPrice = () => import('../pages/block/specialPrice')
const blockOrderManage = () => import('../pages/block/orderManage')
const recommend = () => import('../pages/block/recommend')
const video = () => import('../pages/block/video'); // 视频教程播放
const videoList = () => import('../pages/block/videoList'); // 视频教程列表
const incomeList = () => import('../pages/block/incomeList'); // 新批发收益
const storeInfo = () => import('../pages/block/storeInfo'); // 区域批发商店铺设置
const blockBank = () => import('../pages/block/bank/bankCard'); // 银行卡新增绑定
const blockUserManagement = () => import('../pages/block/UserManagement'); // 区域批发商下游商家
const blockRegister = () => import('../pages/block/downstream/Register'); // 下游商家入驻
const blockSupplier = () => import('../pages/block/downstream/supplier'); // 下游商家选择供货商店铺
const blockUserInfo = () => import('../pages/block/downstream/userInfo'); // 下游商家选择供货商店铺
const blockConfirmOrder = () => import('../pages/block/confirmOrder/confirmorder'); // 供应链下单结算页面
const blockPaypage = () => import('../pages/block/pay/payPage'); // 供应链支付页面
const blockPaySuccess = () => import('../pages/block/pay/paySuccess'); // 供应链支付成功页面
const blockRefund = () => import('../pages/block/confirmOrder/returngoods'); // 供应链订单退货申请页面
const blockRefundDetail = () => import('../pages/block/confirmOrder/returndetails'); // 供应链订单退款中页面
const blockOrderDetail = () => import('../pages/block/confirmOrder/orderDetails'); // 供应链订单详情页面
const blockOrderRefund = () => import('../pages/block/confirmOrder/orderRefund'); // 供应链订单详情页面
const selectGoodsType = () => import('../pages/block/addGood/selectGoodsType'); // 区域批发商新增商品
const addGoods = () => import('../pages/block/addGood/addGoods'); // 供应链订单新增商品分类
const blockMessage = () => import('../pages/block/message/message'); // 供应链订单详情页面
const blockMessageList = () => import('../pages/block/message/messageList'); // 供应链订单详情页面
const blockMessageDetail = () => import('../pages/block/message/messageDetail'); // 供应链订单详情页面
const platformOrder = () => import('../pages/block/platformOrder'); // 供应链订单详情页面
const blockStocklist = () => import('../pages/block/stock/stockList'); // 库存报表
const blockStockChange = () => import('../pages/block/stock/stockChange'); // 库存变更
const blockStockChangeDetail = () => import('../pages/block/stock/stockChangeDetail'); // 库存变更
const logistics = () => import('../pages/block/confirmOrder/logistics'); // 库存报表
const newAdder = () => import('../pages/block/newAdder'); // 供应链收货地址修改
const tixianDetails = () => import('../pages/block/bank/tixianDetails'); // 提现页面
const Witrecord = () => import('../pages/block/bank/Witrecord'); // 供应链提现记录页面
const Withdragys = () => import('../pages/block/bank/Withdragys'); // 提现界面
const buyRefuse = () => import('../pages/block/afterSale/buyRefuse'); // 供应链卖家拒绝退款
const busRefuseDetail = () => import('../pages/block/afterSale/busRefuseDetail'); // 供应链卖家退款详情

Vue.use(Router)
export default new Router({
    routes: [
        //登录注册
        {path: '/', redirect: '/login'},
        {path: '/login', component: login},
        // 新增区域批发商路由
        {name: 'blobkApplyRecord', path: '/block/applyRecord', component: blobkApplyRecord},//区域批发商 申请记录
        {name: 'applyStatus', path: '/block/applyStatus', component: applyStatus},//区域批发商 申请记录
        {name: 'blockStoreManagement', path: '/block/storeManagement', component: blockStoreManagement},//区域批发商 申请记录
        {name: 'blockAddress', path: '/block/blockaddress', component: blockAddress},//区域批发商 申请记录
        {name: 'applyList', path: '/block/applylist', component: applyList},//区域批发商 申请记录
        {name: 'recommend', path: '/block/recommend', component: recommend},//区域批发商 申请记录
        {name: 'video', path: '/block/video', component: video},//区域批发商 申请记录
        {name: 'videoList', path: '/block/videoList', component: videoList},//区域批发商 申请记录
        {name: 'incomeList', path: '/block/incomeList', component: incomeList},//区域批发商 申请记录
        {name: 'videoList', path: '/block/storeInfo', component: storeInfo},//区域批发商 申请记录
        {name: 'UserDevelopment', path: '/block/UserDevelopment', component: UserDevelopment}, //发展人数
        {name: 'UserDetalis', path: '/block/UserDetalis', component: UserDetalis}, //发展用户详情
        {name: 'UserDetalis', path: '/block/blank', component: blank}, //发展用户详情
        {name: 'blockChangecode', path: '/block/changecode', component: blockChangecode}, //发展用户详情
        {name: 'store', path: '/block/wholesaleIndex', component: blockwholesaleIndex}, //发展用户详情
        {name: 'blockMyorder', path: '/block/blockMyorder', component: blockMyorder,}, //发展用户详情
        {name: 'blockmyAddress', path: '/block/blockmyAddress', component: blockmyAddress}, //发展用户详情
        {name: 'blockIndex', path: '/block/blockIndex', component: blockIndex}, // 供应链角色5-商品管理
        {name: 'blockGoodsManagement', path: '/block/goodsManagement', component: blockGoodsManagement}, // 供应链角色5-商品管理
        {name: 'blockAddNewGoods', path: '/block/addNewGoods', component: blockAddNewGoods}, // 供应链角色5-修改商品
        {name: 'blockSpecialPrice', path: '/block/specialPrice', component: blockSpecialPrice}, // 供应链角色5-特殊价格设置
        {name: 'blockOrderManage', path: '/block/orderManage', component: blockOrderManage}, // 供应链角色5-订单管理
        {name: 'blockDetails', path: '/block/details', component: blockDetails}, // 供应链角色5-银行卡绑定
        {name: 'blockBank', path: '/block/bank', component: blockBank}, // 供应链角色5-下游商家
        {name: 'blockUserManagement', path: '/block/UserManagement', component: blockUserManagement}, // 角色6 下游商家入驻
        {name: 'blockRegister', path: '/block/register', component: blockRegister}, // 角色6 下游商家选择供货商商品
        {name: 'blockSupplier', path: '/block/supplier', component: blockSupplier}, // 角色6 下游商家个人主页
        {name: 'blockUserinfo', path: '/block/userinfo', component: blockUserInfo},
        {name: 'blockConfirmOrder', path: '/block/confirmorder', component: blockConfirmOrder},// 供应链下单结算页面
        {name: 'blockPaypage', path: '/block/paypage', component: blockPaypage}, // 供应链支付页面
        {name: 'blockPaySuccess', path: '/block/paysuccess', component: blockPaySuccess}, // 供应链下支付成功页面
        {name: 'blockRefund', path: '/block/blockrefund', component: blockRefund},// 供应链退货申请页面
        {name: 'blockRefundDetail', path: '/block/refunddetail', component: blockRefundDetail}, // 供应链下退货申请状态详情页
        {name: 'blockOrderRefund', path: '/block/orderRefund', component: blockOrderRefund}, // 供应链下退货申请状态详情页
        {name: 'blockOrderDetail', path: '/block/orderDetail', component: blockOrderDetail},// 供应链角色  普通提现
        {name: 'tixianDetails', path: '/block/tixianDetails', component: tixianDetails}, // 供应链角色  提现记录
        {name: 'Witrecord', path: '/block/Witrecord', component: Witrecord}, // 供应链角色  提现
        {name: 'Withdragys', path: '/block/Withdragys', component: Withdragys}, //区域批发商新增地址
        {name: 'newAdder', path: '/block/newAdder', component: newAdder},// 供应链卖家拒绝退款说明
        {name: 'buyRefuse', path: '/block/buyrefuse', component: buyRefuse},// 供应链卖家退款详情页面
        {name: 'busRefuseDetail', path: '/block/busrefusedetail', component: busRefuseDetail},
        {name: 'addGoods', path: '/block/addgoods', component: addGoods, meta: {keepAlive: true}}, // 区域批发商新增商品
        {name: 'selectGoodsType', path: '/block/selectgoodstype', component: selectGoodsType},  // 区域批发商新增商品分类
        {name: 'blockMessage', path: '/block/message', component: blockMessage},  // 供应链消息模块
        {name: 'blockMessageList', path: '/block/messageList', component: blockMessageList},  // 供应链消息模块列表
        {name: 'blockMessageDetail', path: '/block/messageDetail', component: blockMessageDetail}, // 供应链消息模块详情
        {name: 'platformOrder', path: '/block/platformOrder', component: platformOrder},   // 供应链平台特殊账号
        {name: 'blockStocklist', path: '/block/stocklist', component: blockStocklist}, // 库存报表
        {name: 'blockStockChange', path: '/block/stockChange', component: blockStockChange}, // 库存变更
        {name: 'blockStockChangeDetail', path: '/block/stockChangeDetail', component: blockStockChangeDetail}, // 库存变更
        {name: 'logistics', path: '/block/logistics', component: logistics},  // 供应链下退货申请状态详情页
        {path: '/bindPhone', component: BindPhone},
        {path: '/register', component: register},
        {path: '/forgetPassword', component: ForgetPassword},
        {path: '/appLogin', component: appLogin},
        {name: 'business', path: '/business', component: index, meta: {keepAlive: false}},// 首页
        {name: 'details', path: '/details', component: details},// 详情页面
        {name: 'confirmorder', path: '/confirmorder', component: confirmorder},// 确认订单
        {name: 'bindtel', path: '/bindtel', component: bindtel},// 绑定手机号码
        {name: 'myorder', path: '/myorder', component: myorder, meta: {keepAlive: true}},// 我的订单
        {name: 'returngoods', path: '/returngoods', component: returngoods}, // 退款/退货申请
        {name: 'returnmoney', path: '/returnmoney', component: returnmoney}, // 退款申请
        {name: 'returndetails', path: '/returndetails', component: returndetails}, // 退款详情
        {name: 'mineindex', path: '/mineindex', component: mineindex}, // 个人中心
        {name: 'changename', path: '/changename', component: changename}, // 更改名字
        {name: 'changetel', path: '/changetel', component: changetel}, // 修改手机号码
        {name: 'changecode', path: '/changecode', component: changecode}, // 修改密码
        {name: 'message', path: '/message', component: message}, // 消息通知
        {name: 'myaddress', path: '/myaddress', component: myaddress},// 我的收货地址
        {name: 'editaddress', path: '/editaddress', component: editaddress},// 编辑收货地址
        {name: 'orderFilter', path: '/orderFilter', component: orderFilter},// 筛选结果呈现页面
        {name: 'addNewAddr', path: '/addNewAddr', component: addNewAddr},// 新增收货地址
        {name: 'search', path: '/search', component: search},// 搜索
        {name: 'shoppingCart', path: '/shoppingCart', component: shoppingCart},// 购物车
        {name: 'blockShoppingCart', path: '/blockShoppingCart', component: blockShoppingCart},// 购物车
        {name: 'supplier', path: '/supplier', component: supplier},// 供货商
        {name: 'mybank', path: '/mybank', component: mybank},// 我的银行卡
        {name: 'bankCard', path: '/bankCard', component: bankCard},// 银行卡
        {name: 'productList', path: '/productList', component: productList, meta: {keepAlive: true}},// 搜索产品列表
        {name: 'areaWholesales', path: '/wholesale/areaWholesales', component: areaWholesales},//区域批发商
        {name: 'notice', path: '/wholesale/notice', component: notice},//区域批发商
        {name: 'applyRecord', path: '/wholesale/applyRecord', component: applyRecord},//区域批发商 申请记录
        {name: 'wholesale', path: '/wholesale/business', component: wholesaleIndex, meta: {keepAlive: false}}, //店铺页面
        {name: 'goodsManagement', path: '/wholesale/goodsManagement', component: goodsManagement, meta: {keepAlive: true}}, //商品管理
        {name: 'userManagement', path: '/wholesale/userManagement', component: userManagement}, //用户管理
        {name: 'orderManagement', path: '/wholesale/orderManagement', component: orderManagement, meta: {keepAlive: true}},//订单管理
        {name: 'storeManagement', path: '/wholesale/storeManagement', component: storeManagement},//店铺管理
        {name: 'addToStore', path: '/wholesale/addToStore', component: addToStore, meta: {keepAlive: true}},//添加商品库商品
        {name: 'addNewGoods', path: '/wholesale/addNewGoods', component: addNewGoods},//修改商品
        {name: 'uploadGoods', path: '/wholesale/uploadGoods', component: UploadGoods},//上传商品
        {name: 'wholesaleAddress', path: '/wholesale/wholesaleAddress', component: WholesaleAddress},//修改批发商地址
        {name: 'orderDetails', path: '/orderDetails', component: OrderDetails},//订单详情
        {name: 'admissionDetails', path: '/wholesale/admissionDetails', component: AdminssionDetails},//批发商入驻订单
        {name: 'storageSetting', path: '/wholesale/storageSetting', component: storageSetting},
        {name: 'invitation', path: '/wholesale/Invitation', component: Invitation},//我的邀请
        {name: 'uploading', path: '/wholesale/uploading', component: uploading},//分账信息上传
        {name: 'uploadings', path: '/wholesale/uploadings', component: uploadingS},//分账信息上传
        {name: 'blockSettledin', path: '/wholesale/blocksettledin', component: blockSettledin},//区域批发商入驻
        {name: 'uploadf', path: '/wholesale/uploadf', component: uploadf},//分账信息查询
        {name: 'uploads', path: '/wholesale/uploads', component: uploads},//分账信息查询
        {name: 'profit', path: '/wholesale/myProfit', component: Profit},//销售报表
        {name: 'invitationRebate', path: '/wholesale/invitationRebate', component: InvitationRebate},//邀请返利
        {name: 'WholesaleCheckProgress', path: '/WholesaleCheckProgress', component: WholesaleCheckProgress},//扣点模式批发商审核
        {name: 'salesDetails', path: '/wholesale/salesDetails', component: SalesDetails},//销售明细
        {name: 'InvitationDetails', path: '/wholesale/invitationDetails', component: InvitationDetails},//销售明细
        {name: 'successful', path: '/successful', component: successful},//支付成功
        {name: 'yulan', path: '/yulan', component: Yulan},//后台预览
        {name: 'purchaseRecord', path: '/wholesale/purchaseRecord', component: PurchaseRecord},//下游上架购买记录
        {name: 'payment', path: '/payment', component: Payment}, //分单支付
        {name: 'paymethods', path: '/paymethods', component: Paymethods}, //支付方式
        {name: 'addGood', path: '/wholesale/addGood', component: AddGood}, //添加新商品
        {name: 'goodSpec', path: '/wholesale/goodSpec', component: GoodSpec}, //新商品规格
        {name: 'commission', path: '/wholesale/commission', component: Commission},// 返佣管理
        {name: 'myBalance', path: '/wholesale/myBalance', component: MyBalance},// 我的余额
        {name: 'cashWithdrawal', path: '/wholesale/cashWithdrawal', component: CashWithdrawal},// 提现
        {name: 'commissionList', path: '/wholesale/commissionList', component: CommissionList},// 代理商返佣报表/推荐批发商一次性奖励
        {name: 'commissionOperation', path: '/wholesale/commissionOperation', component: CommissionOperation},// 返佣提现/返佣转余额
        {name: 'commissionDetail', path: '/wholesale/commissionDetail', component: CommissionDetail},// 返佣提现 -> 详情
        {name: 'transferBalance', path: '/wholesale/transferBalance', component: TransferBalance},// 返佣提现 -> 转余额
        {name: 'transferCashDetail', path: '/wholesale/transferCashDetail', component: TransferCashDetail},// 返佣提现 -> 返佣转提现详情
        {name: 'addAccount', path: '/wholesale/addAccount', component: AddAccount},// 返佣转余额 -> 添加账户
        {name: 'account', path: '/wholesale/account', component: Account},// 返佣转余额 -> 账户管理
        {name: 'bill', path: '/wholesale/bill', component: Bill},// 返佣转余额 -> 账户管理
        {name: 'notice', path: '/notice', component: Notice}, //消息通知
        {name: 'cooperation', path: '/cooperation', component: Cooperation}, // 修改合作方式
        {name: 'Privacy', path: '/Privacy', component: Privacy},
    ]
})
