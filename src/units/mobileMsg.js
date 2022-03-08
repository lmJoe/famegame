export default {
  nt:getNetworkType(),
  latitude:'',//纬度
  longitude:'',//经度
  os:getOS(),
  getPhoneSystem:getPhoneSystem(),
  gt_ios4:gt_ios4(),
}
/**获取网络类型 */
function getNetworkType() {
  var ua = navigator.userAgent;
  var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  var networkType;
  switch (networkStr) {
      case 'wifi':
        networkType = 'wifi';
        break;
      case '4g':
        networkType = '4g';
        break;
      case '3g':
        networkType = '3g';
        break;
      case '3gnet':
        networkType = '3g';
        break;
      case '2g':
        networkType = '2g';
        break;
      default:
        networkType = 'other';
  }
  return networkType;
}
function getOS() {
  var u = navigator.userAgent;
  console.log("设备信息",u);
  if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
    return 'windows'
  } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
    return 'macOS'
  } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
    return 'ios'
  } else if (u.match(/android/i)) {
    return 'android'
  } else if (u.match(/Ubuntu/i)) {
    return 'Ubuntu'
  } else {
    return 'other'
  }
}
/**获取手机品牌 */
function getPhoneSystem(){
  var ua = navigator.userAgent.split("(")[1].split(")")[0];
  var brand = "";
  var phone = [/IPHONE/gi, /huawei/gi, /mi/gi, /vivo/gi, /OPPO/gi, /samsung/gi, /SONY/gi, /Nokia/gi, /HTC/gi, /ZTE/gi, /Lenovo/gi, /ZUK/gi,]
  if (phone[0].test(ua)) {
      brand = "iPhone";
  } else if (phone[1].test(ua)) {
      brand = "HUAWEI";
  } else if (phone[2].test(ua)) {
      brand = "小米";
  } else if (phone[3].test(ua)) {
      brand = "vivo";
  } else if (phone[4].test(ua)) {
      brand = "OPPO";
  } else if (phone[5].test(ua)) {
      brand = "SAMSUNG";
  } else if (phone[6].test(ua)) {
      brand = "SONY";
  } else if (phone[7].test(ua)) {
      brand = "Nokia";
  } else if (phone[8].test(ua)) {
      brand = "HTC";
  } else if (phone[9].test(ua)) {
      brand = "ZTE";
  } else if (phone[10].test(ua) || phone[11].test(ua)) {
      brand = "Lenovo";
  } else {
      brand = "Android";
  }
  return brand;
}
/**获取手机系统版本号 */
function gt_ios4() {
  // 判断是否 iPhone 或者 iPod
  if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
      // 判断系统版本号是否大于 4
      return Boolean(navigator.userAgent.match(/OS [5-9]_\d[_\d]* like Mac OS X/i));
  } else {
      return false;
  }
}