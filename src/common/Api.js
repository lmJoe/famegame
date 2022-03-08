import { ajax } from "../units/ajax";
import URL from "../units/url";
import gameControl from "../game/gameControl.js";
import Scenes from "./Scenes.js";
import { getCaption, getCookie, getQueryVariable, setCookie } from "../units/units";
import Data from "./Data";
import mobileMsg from "../units/mobileMsg";

export default new class Api{
    adDataReport(parmes, callback){
        ajax({
          type: 'POST',
          url: URL.earnPrize,
          data:parmes,
          dataType:'json',
          // contentType:'application/json',
          async: true,
          success:(response)=>{
            callback && callback(response.data);
          }
        })
      }

    /**获取矿场信息 */
    getMineInfo(callback){
        ajax({
            type: 'POST',
            url: URL.getMineInfo,
            data:{},
            success: function(response){
              callback(response.data);
            }
        })
    }

    /**矿工升级 */
    minerLevelUp(workerID, callback){
        ajax({
            type: 'POST',
            url: URL.minerLevelUp,
            data:{workerID:workerID},
            success: function(response){
              console.log(111, response.data.name, response.data.minerLevelUpInfo);
              callback(response.data);
            }
        })
    }

    /**购买矿工 */
    buyMiner(callback){
        ajax({
            type: 'POST',
            url: URL.buyMiner,
            data:{},
            success: function(response){
              callback(response.data);
            }
        })
    }

    /**矿场升级 */
    mineLevelUp(callback){
        ajax({
            type: 'POST',
            url: URL.mineLevelUp,
            data:{},
            success: function(response){
              callback(response.data);
            }
        })
    }

    /**矿场收获 */
    harvest(callback){
        ajax({
            type: 'POST',
            url: URL.harvest,
            data:{},
            success: function(response){
              callback(response.data);
            }
        })
    }
    /**埋点上报 */
    setReport(paramObj,callback){
      let params = {
        ref_media_name:'',//渠道名称
        ref_media_id:getQueryVariable("platformid"),//platformid
        ref_media_slot_name:'',
        ref_media_slot_id:getQueryVariable("appid"),//appid
        terminal:3,
        media_type:3,
        page_type:'',
        page_name:'农场',
        content_cat:paramObj.content_cat,
        content_cat_id:paramObj.content_cat_id,
        action_type:paramObj.action_type,
        content:paramObj.content,
        channel_name:paramObj.channel_name,
        content_id:paramObj.content_id,
        app_id:115,
        user_id:paramObj.user_id,//userid
        ac:getQueryVariable("platformid"),//platformid
        as:paramObj.as,//每次进入农场不一样的值，农场内的行为事件相同(5位数字)
        ci:paramObj.user_id,//userid
        ps:Date.parse(new Date())/1000%(3600*24),//今天当前第几秒
        u:window.location.href,//页面地址
        su:'',//页面来源地址
        ds:Laya.Browser.width+'X'+Laya.Browser.height,//屏幕分辨率
        lang:navigator.language,
        cb:24,//屏幕颜色位数
        lg:mobileMsg.longitude,//经度
        la:mobileMsg.latitude,//纬度
        os:mobileMsg.os,//操作系统
        ov:mobileMsg.gt_ios4,//操作系统版本号
        db:mobileMsg.getPhoneSystem,//手机品牌	XiaoMi,
        dm:'',//手机型号:M102,
        av:Data.appVer,//appid应用版本号:1.1.2
        di:'',//安卓传IMEI，IOS传UUID:
        nt:mobileMsg.nt,//网络类型(2g/3g/4g/wifi):wifi
        et:paramObj.et,//事件类型(pageview-页面访问，pagedurations-页面 停留):pageview
        dur:paramObj.dur,//页面停留时长(秒),统计页面时长时候传递:
        il:paramObj.user_id?1:0,//是否登录:1或0
        ifd:paramObj.ifd,//是否今天第一次访问:1--是或0--否
        if:'',//是否第一次访问,通过第一次启动的日期和当前日期对比，如果当前日期大于第一次启动日期为老用户:1或0
        times:Date.parse(new Date())/1000,//当前时间戳总秒数:1562293343
        sv:'',//SDK版本号:1.0.1
        st:'',//SDK类型:APP
        inu:'',//新用户:1(老用户为0)，如果新用户，当天所有调用均为1
      };
      var urlJ = 'channel_name:'+params.channel_name+';ref_media_name:'+params.ref_media_name+';ref_media_id:'+params.ref_media_id+';ref_media_slot_name:'+params.ref_media_slot_name+';ref_media_slot_id:'+params.ref_media_slot_id+';terminal:'+params.terminal+';media_type:'+params.media_type+';page_type:'+params.page_type+';page_name:'+params.page_name+';app_id:'+params.app_id+';content_cat:'+params.content_cat+';content_cat_id:'+params.content_cat_id+';action_type:'+params.action_type+';content:'+params.content+';content_id:'+params.content_id+';user_id:'+params.user_id+';app_version:'+params.av+';app_channel:'+params.ac+'&ps='+params.as+'&ci='+params.ci+'&u='+params.u+'&su='+params.su+'&ds='+params.ds+'&lang='+params.lang+'&cb='+params.cb+'&lg='+params.lg+'&la='+params.la+'&os='+params.os+'&ov='+params.ov+'&db='+params.db+'&dm='+params.dm+'&di='+params.di+'&nt='+params.nt+'&et='+params.et+'&dur='+params.dur+'&il='+params.il+'&ifd='+params.ifd+'&if='+params.if+'&times='+params.times+'&inu='+params.inu+'&sv='+params.sv+'&st='+params.st;
      ajax({
        type: 'GET',
        url: 'https://mhtj.baomihua.com/t?ai=4503a11cf5bc40ad9d4dd7dd9ef4309f&e='+encodeURI(encodeURI(urlJ)),
        data:{},
        success: function(response){
          callback(response);
        }
      })
    }
    /**提交内部订单 */
    placeInsOrder(id,linkUrl){
      ajax({
        type: 'POST',
        url: URL.placeInsOrder,
        data:{
          bizId:id
        },
        dataType:'json',
        async: true,
        success:(res)=>{
          console.log("res",res);
          if (res.code == 1) {
            if(id==253){
              
            }else{
              getCaption(linkUrl)
            }
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
}