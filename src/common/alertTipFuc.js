import { report } from "../units/statReport";
import Data from "./Data";
import Scenes from "./Scenes";
function alerttTip1(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint1,size:Data.pointSize1,stepNum:1});
  var params = {
    action_type:'点击',
    content:'首次播种',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip2(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint2,stepNum:2});
  var params = {
    action_type:'点击',
    content:'苹果种植',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip3(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint1,size:Data.pointSize1,stepNum:3});
  var params = {
    action_type:'点击',
    content:'首次浇水',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip4(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint3,size:Data.pointSize3,stepNum:4});
  var params = {
    action_type:'点击',
    content:'首次矿洞点击',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip5(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint4,size:Data.pointSize4,stepNum:5});
  var params = {
    action_type:'点击',
    content:'矿工加号',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip6(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint5,size:Data.pointSize5,stepNum:6});
  var params = {
    action_type:'点击',
    content:'首次矿工购买',
    channel_name:'',
    content_id:'',
    content_cat:'',//矿工等级
    content_cat_id:'',//矿工数量
  }
  report(params);
}
function alerttTip7(){
  Laya.Dialog.open(Scenes.alerttTip,false,{content:Data.commonPoint1,size:Data.pointSize1,stepNum:3});
}
var handTip
function showHandTip(parentNode){
  if(!handTip){
    handTip = new Laya.Image('comp/icon23.png');
    handTip.size(90,109)
    handTip.name = 'handTip';
    handTip.visible = true;
    handTip.zOrder = 5;
    handTip.pos(Data.commonPoint1.x+Data.pointSize1.width/2,Data.commonPoint1.y+Data.pointSize1.height/2);
    parentNode.addChild(handTip);
    let scaleY=handTip.y;
    let timeLine=new Laya.TimeLine();
    timeLine.to(handTip,{y: scaleY+20 }, 500).to(handTip,{ y: scaleY }, 500).play(0, true);
  }
  handTip.visible=true;
  return handTip;
}
function hideHandTip(){
  if(handTip)
    handTip.visible=false;
}
export {
  alerttTip1,
  alerttTip2,
  alerttTip3,
  alerttTip4,
  alerttTip5,
  alerttTip6,
  alerttTip7,
  showHandTip,
  hideHandTip
}