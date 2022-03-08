import Api from "../common/Api";
import Data from "../common/Data";
import { getCookie } from "./units";

//点击事件上报
let report = (data) => {
  let params = {
    user_id:Data.userId,//userid
    as:Data.userLogo,//每次进入农场不一样的值，农场内的行为事件相同
    ci:Data.userId,//userid
    et:'farmb1',//事件类型(pageview-页面访问，pagedurations-页面 停留):pageview
    dur:'',//页面停留时长(秒),统计页面时长时候传递:
    il:Data.userId?1:0,//是否登录:1或0
    ifd:getCookie("ifd")?1:0,//是否今天第一次访问:1--是或0--否
    if:'',//是否第一次访问,通过第一次启动的日期和当前日期对比，如果当前日期大于第一次启动日期为老用户:1或0
    times:Date.parse(new Date())/1000,//当前时间戳总秒数:1562293343
    sv:'',//SDK版本号:1.0.1
    st:'',//SDK类型:APP
    inu:'',//新用户:1(老用户为0)，如果新用户，当天所有调用均为1
    action_type:data.action_type,
    content:data.content,
    channel_name:data.channel_name,
    content_id:data.content_id,//是否成功
    content_cat:data.content_cat,//矿工等级
    content_cat_id:data.content_cat_id,//矿工数量
  };
  Api.setReport(params, (data)=>{
    console.log("data",data);
  });
}
let setPagedurations = (data) => {
  let params = {
    user_id:Data.userId,//userid
    as:Data.userLogo,//每次进入农场不一样的值，农场内的行为事件相同
    ci:Data.userId,//userid
    et:'pagedurations',//事件类型(pageview-页面访问，pagedurations-页面 停留):pageview
    dur:data.dur,//页面停留时长(秒),统计页面时长时候传递:
    il:Data.userId?1:0,//是否登录:1或0
    ifd:getCookie("ifd")?1:0,//是否今天第一次访问:1--是或0--否
    if:'',//是否第一次访问,通过第一次启动的日期和当前日期对比，如果当前日期大于第一次启动日期为老用户:1或0
    times:Date.parse(new Date())/1000,//当前时间戳总秒数:1562293343
    sv:'',//SDK版本号:1.0.1
    st:'',//SDK类型:APP
    inu:'',//新用户:1(老用户为0)，如果新用户，当天所有调用均为1
    action_type:data.action_type,
    content:data.content,
    channel_name:data.channel_name,
    content_id:data.content_id,//是否成功
    content_cat:data.content_cat,//矿工等级
    content_cat_id:data.content_cat_id,//矿工数量
  };
  Api.setReport(params, (data)=>{
    console.log("data",data);
  });
}

export {
  report,
  setPagedurations
}