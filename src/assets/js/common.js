import Vue from "vue";
//校验手机号码
function phoneRuler(phone){
    let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    return reg.test(phone)
}
// 校验身份证号码
function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(card);
}
// 校验邮箱
function isEmail(email){
  let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  return reg.test(email);
}
// show Toast
function showToast(msg,position){
  Toast({
    message: msg,
    position: position || 'bottom',
    duration: 2000,
    className:'myToast'
  })
}

function setCookie(cname, cvalue) {
    // var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    // var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; ";
}
function getCookie (cname) {
  var arr, reg = new RegExp("(^| )" + cname + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
// 判断是否是微信浏览器
function isWeixin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

// 获取图形验证码
function getPicCode(phone) {
    return new Promise((resolve, reject) =>{
        axios.get(Vue.prototype.blockURL+`/qypfs-user/currency/validateCode?mobile=${phone}`,{
            responseType: 'arraybuffer'
        }).then(res=>{
            resolve('data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')))
        }).catch(err=>{
            reject()
        });
    } )
}

// 判断当前用户使用的设备
function userAgent() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return "Android"
    }
    if (isIOS) {
        return "IOS"
    }
}

// 供应链图片上传  成功返回url  失败返回错误信息
function uploadImg(param) {
    Indicator.open();
    return new Promise((resolve, reject) => {
        axios.post('http://upload.520shq.com/upload', param).then(res => {
            if (res.data.code == 200) {
                resolve(res.data.data.url)
            } else {
                reject(res.data)
            }
            Indicator.close();
        }).catch((res) => {
            Indicator.close();
            reject(res)
        });
    })
}

// 七牛云文件上传地址
function uploadImgCloud(param) {
    Indicator.open();
    return new Promise((resolve, reject) => {
        axios.post('https://nfxts.520shq.com/localQuickPurchase/live/uploadFile', param).then(res => {
            if (res.data.code == 200) {
                resolve(res.data.data)
            } else {
                reject(res.data)
            }
            Indicator.close();
        }).catch((res) => {
            Indicator.close();
            reject(res)
        });
    })
}

// 函数节流
function throttle(fn,delay){
    var lastTime;
    var timer;
    var delay = delay || 200;
    return function() {
        var args = arguments;
        // 记录当前函数触发的时间
        var nowTime = Date.now();
        if (lastTime && nowTime - lastTime < delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                // 记录上一次函数触发的时间
                lastTime = nowTime;
                // 修正this指向问题
                fn.apply(this, args);
            }, delay);
        }else{
            lastTime = nowTime;
            fn.apply(this, args);
        }
    }
}

// 批发网区域批发商个人中心登录
function loginFn() {
  return new Promise((resolve, reject) =>{
    axios.post(Vue.prototype.blockURL + `/qypfs-user/user/findUserShow`).then((res) => {
      if (res.data.code == 200) {
          let data = res.data.data;
          data.Blocktype = data.userRoles[0].roleId; // 默认的登录角色
          sessionStorage.setItem("seq", data.seq);
          setCookie('seq', data.seq);
          // 保存当前用户的可访问的商家
          sessionStorage.setItem('Wseq', data.headquartersStoreSeq);

          resolve(data)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

// 防止精度丢失-加
function floatAdd(a, b) {
    let c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return  (floatMul(a, e) + floatMul(b, e)) / e;
}

// 防止精度丢失-减
function floatSub(a, b) {
    let c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (floatMul(a, e) - floatMul(b, e)) / e;
}

// 防止精度丢失-乘
function floatMul(a, b) {
    let c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// 防止精度丢失-除
function floatDiv(a, b) {
    let c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), floatMul(c / d, Math.pow(10, f - e));
}

function isApp(){
    // 判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    // 登录成功后，给app调用的方法
    if (isappwebview) {
        return true
    } else {
        return false;
    }
}

export {
    phoneRuler,
    showToast,
    setCookie,
    getCookie,
    isCardNo,
    isEmail,
    isWeixin,
    getPicCode,
    loginFn,
    uploadImg,
    userAgent,
    floatAdd,
    floatSub,
    floatMul,
    floatDiv,
    isApp,
    uploadImgCloud,
    throttle
}
