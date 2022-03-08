import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import { dateChangeFormat, Djs_timeList, getCookie, setCookie } from "../units/units.js";
import Util from "../common/Util.js";
import Data from "../common/Data.js";
import Scenes from "../common/Scenes.js";

var Tween = Laya.Tween;
var tween;
var lunckyNodeAnimation;//转盘提示动画  
var judgeAnimation = 1;//judgeAnimation判断当前动画是否正在执行
var djsTimer;//光照倒计时
var timeZB, framProgressbarValue;
function setFarmland(fameNode, famedata, sunNode) {
  console.log("植物返回信息", famedata)
  var farmland = fameNode.getChildByName("farmland");//农田容器
  var landZL = fameNode.getChildByName("landZL");//栅栏
  var treeBtn = fameNode.getChildByName("treeBtn");//植物容器
  var framProgressbar = fameNode.getChildByName("framProgressbar");//进度条容器
  var countDown = framProgressbar.getChildByName("countDown");//进度条下方提示容器
  var parentNode = framProgressbar.getChildByName("parentNode");//进度条右侧文字提示容器
  //获取土地,根据当前农场等级更换土地资源
  var fameMsgLevel = getCookie("landlevel");
  console.log("农场等级获取", fameMsgLevel)


  var landLevelArr = [
    { img: 'comp/farmland1.png', img1: '', width: '', height: '', Px: '', Py: '' },
    { img: 'comp/farmland2.png', img1: '', width: '', height: '', Px: '', Py: '' },
    { img: 'comp/farmland3.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland4.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland5.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland6.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland7.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland8.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland9.png', img1: 'comp/zl1.png', width: 170, height: 44, Px: 4, Py: 48 },
    { img: 'comp/farmland10.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland11.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland12.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland13.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland14.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland15.png', img1: 'comp/zl2.png', width: 156, height: 72, Px: 13, Py: 26 },
    { img: 'comp/farmland16.png', img1: 'comp/zl3.png', width: 158, height: 50, Px: 10, Py: 42 },
    { img: 'comp/farmland17.png', img1: 'comp/zl3.png', width: 158, height: 50, Px: 10, Py: 42 },
    { img: 'comp/farmland18.png', img1: 'comp/zl3.png', width: 158, height: 50, Px: 10, Py: 42 },
    { img: 'comp/farmland19.png', img1: 'comp/zl3.png', width: 158, height: 50, Px: 10, Py: 42 },
    { img: 'comp/farmland20.png', img1: 'comp/zl3.png', width: 158, height: 50, Px: 10, Py: 42 },
  ]
  //获取土地
  for (var i = 0; i < landLevelArr.length; i++) {
    if ((fameMsgLevel - 1) == i) {
      farmland.skin = landLevelArr[i].img;
      landZL.visible = true;
      landZL.skin = landLevelArr[i].img1;
      landZL.width = landLevelArr[i].width;
      landZL.height = landLevelArr[i].height;
      landZL.pos(landLevelArr[i].Px, landLevelArr[i].Py);
    }
  }
  var resources = famedata.data.resources;//获取接口返回树的信息
  //对树集合添加高宽位置的参数
  for (var i = 0; i < resources.length; i++) {
    if (resources[i].resCode === 'p_0') {
      resources[i].width = 136;
      resources[i].height = 140;
      resources[i].Px = 98;
      resources[i].Py = -79;
    } else if (resources[i].resCode === 'p_1') {
      resources[i].width = 162;
      resources[i].height = 188;
      resources[i].Px = 86;
      resources[i].Py = -127;
    } else if (resources[i].resCode === 'p_2') {
      resources[i].width = 237;
      resources[i].height = 314;
      resources[i].Px = 56;
      resources[i].Py = -230;
    } else if (resources[i].resCode === 'p_3') {
      resources[i].width = 220;
      resources[i].height = 346;
      resources[i].Px = 75;
      resources[i].Py = -254;
    } else if (resources[i].resCode === 'p_4') {
      resources[i].width = 269;
      resources[i].height = 372;
      resources[i].Px = 29;
      resources[i].Py = -280;
    } else if (resources[i].resCode === 'p_5') {
      resources[i].width = 385;
      resources[i].height = 454;
      resources[i].Px = -20;
      resources[i].Py = -385;
    } else if (resources[i].resCode === 'p_6') {
      resources[i].width = 388;
      resources[i].height = 454;
      resources[i].Px = -19;
      resources[i].Py = -385;
    } else if (resources[i].resCode === 'p_7') {
      resources[i].width = 386;
      resources[i].height = 454;
      resources[i].Px = -19;
      resources[i].Py = -385;
    } else if (resources[i].resCode === 'p_8') {
      resources[i].width = 386;
      resources[i].height = 454;
      resources[i].Px = -19;
      resources[i].Py = -385;
    } else if (resources[i].resCode === 'p_9') {
      resources[i].width = 386;
      resources[i].height = 454;
      resources[i].Px = -19;
      resources[i].Py = -385;
    }
  }
  //首次进入页面，需要判断当前用户是否已经终止
  var status = famedata.data.status;//获取当前状态
  //获取当前种植水果种类信息
  var fruitpID = famedata.data.pid;//获取当前水果id
  Data.fruitpID = famedata.data.pid;
  var processStepIndex = famedata.data.processStepIndex; //获取当前阶段
  if (resources.length > 0) {
    switch (status) {
      case 0://未播种
        //初始状态
        //田地无植物，进度条为空，百分比为0，倒计时小时，提示语更改
        treeBtn.skin = null;
        framProgressbar.value = 0;
        countDown.text = '';
        parentNode.text = '0%';
        var countDownText;
        if (fruitpID == 1) {
          countDownText = '苹果';
        } else if (fruitpID == 2) {
          countDownText = '橙子';
        } else if (fruitpID == 3) {
          countDownText = '橘子';
        } else if (fruitpID == 4) {
          countDownText = '猕猴桃';
        } else if (fruitpID == 5) {
          countDownText = '酥梨';
        }
        countDown.text = '获得一颗' + countDownText + '种子，去种植吧！';
        countDown.visible = true;
        break;
      case 1://已播种
        countDown.visible = true;
        var stepProcessPercent = Number((famedata.data.stepProcessPercent / 100).toFixed(2));//经验值
        // framProgressbar.value = stepProcessPercent;
        Laya.Tween.to(framProgressbar, {value:stepProcessPercent}, 500, Laya.Ease.sineInOut);
        parentNode.text = famedata.data.stepProcessPercent + '%';

        //根据索引值替换不同按钮和土地图片以及树的图片
        treeBtn.width = resources[processStepIndex + 1].width;
        treeBtn.height = resources[processStepIndex + 1].height;
        treeBtn.skin = Util.getOnlineAssets(resources[processStepIndex + 1].dataValue);
        if (fruitpID == 1) {
          countDownText = '苹果';
        } else if (fruitpID == 2) {
          countDownText = '橙子';
        } else if (fruitpID == 3) {
          countDownText = '橘子';
        } else if (fruitpID == 4) {
          countDownText = '猕猴桃';
        } else if (fruitpID == 5) {
          countDownText = '酥梨';
        }
        console.log("高度",treeBtn.height);
        //将植物升级后的高度赋值给动画后的高度
        Data.treeHeight = treeBtn.height;
        var remainValue = Number(famedata.data.microStepProcess);
        countDown.text = '再浇水' + remainValue + '%就进入' + resources[processStepIndex + 2].name;
        break;
      case 3:
        // framProgressbar.value = 1;
        Laya.Tween.to(framProgressbar, {value:1}, 500, Laya.Ease.sineInOut);
        parentNode.text = '100%';
        treeBtn.width = resources[10].width;
        treeBtn.height = resources[10].height;
        treeBtn.skin = resources[10].dataValue;
        countDown.visible = false;
        Laya.Dialog.open(Scenes.harvestPrompt)
        break;
    }
  } else {
    if (status == 0) {
      //初始状态
      //田地无植物，进度条为空，百分比为0，倒计时小时，提示语更改
      treeBtn.skin = null;
      framProgressbar.value = 0;
      parentNode.text = '0%';
      countDown.visible = false;
    }
  }
}
function setOperBtn(operBtnNode, famedata) {
  //获取按钮相关node
  var scoopBtn = operBtnNode;//按钮容器
  var scoopGold = operBtnNode.getChildByName("scoopGold");//button容器
  var scoopGoldNum = scoopGold.getChildByName("scoopGoldNum");//button字体
  var operGold = scoopGold.getChildByName("operGold");//电力值容器
  var scoop = scoopBtn.getChildByName("scoop");//操作图片容器
  var lunckyTipBox = operBtnNode.parent.getChildByName("lunckyTipBox");//幸运转盘提示

  var resources = famedata.data.resources;//获取接口返回树的信息
  var state = famedata.data.status;
  var fruitpID = famedata.data.pid;//获取当前状态
  var toolItemInfo = famedata.data.toolItemInfo;//获取接口返回树的信息
  var processStepIndex = famedata.data.processStepIndex; //获取当前阶段
  var coin = famedata.data.coin; //浇水所需电力值
  // var resourcesIcon;
  // for(var i=0;i<resources.length;i++){
  //   if(resources[i].resCode ==="p_a"){
  //     resourcesIcon = resources[i].dataValue;
  //   }
  // }
  if (toolItemInfo) {
    window.toolItemInfo = toolItemInfo;
    var scoopID = toolItemInfo.itemid;

    var scoopIMG, scoopGoldValue, scoopWidth, scoopHeight, scoopPosX, scoopPosY;
    if (scoopID == 2001) {
      scoopIMG = 'comp/icon6.png';
      scoopGoldValue = coin;
      scoopWidth = 140;
      scoopHeight = 94;
      scoopPosX = 29;
      scoopPosY = 49;
    } else if (scoopID == 2002) {
      scoopIMG = 'comp/icon12.png';
      scoopGoldValue = coin;
      scoopWidth = 107;
      scoopHeight = 110;
      scoopPosX = 44;
      scoopPosY = 38;
    } else if (scoopID == 2003) {
      scoopIMG = 'comp/icon13.png';
      scoopGoldValue = coin;
      scoopWidth = 136;
      scoopHeight = 110;
      scoopPosX = 22;
      scoopPosY = 35;
    } else if (scoopID == 2004) {
      scoopIMG = 'comp/icon14.png';
      scoopGoldValue = coin;
      scoopWidth = 151;
      scoopHeight = 135;
      scoopPosX = 18;
      scoopPosY = 21;
    } else if (scoopID == 2005) {
      scoopIMG = 'comp/icon15.png';
      scoopGoldValue = coin;
      scoopWidth = 151;
      scoopHeight = 135;
      scoopPosX = 14;
      scoopPosY = 20;
    }
  }

  if (state == 0) {
    scoop.visible = true;
    scoop.width = 112;
    scoop.height = 121;
    scoop.pos(48, 43);
    scoopGoldNum.text = '播种';
    scoopGoldNum.visible = true;
    operGold.visible = false;
    //按钮状态恢复初始状态
    scoopBtn.skin = 'comp/icon3.png';
    scoopGold.skin = 'comp/waterbtn.png';
    scoop.skin = 'comp/icon.png';
    lunckyTipBox.visible = false;
  } else if (state == 1) {
    scoopBtn.skin = 'comp/icon2.png';
    scoop.skin = scoopIMG;
    scoop.width = scoopWidth;
    scoop.height = scoopHeight;
    scoop.pos(scoopPosX, scoopPosY);
    Data.waterNeedCoinNum=scoopGoldValue;
    scoopGoldNum.text = scoopGoldValue;
    scoopGoldNum.pos(80, 14);
    operGold.visible = true;
    lunckyTipBox.visible = true;
  } else if (state == 2) {
    //根据水果类型添加不同托图片
    // scoopBtn.gray = true;
    var scoopIMG;
    if (fruitpID == 1) {
      scoopIMG = 'comp/icon10.png';
    } else if (fruitpID == 2) {
      scoopIMG = 'comp/icon7.png';
    } else if (fruitpID == 3) {
      scoopIMG = 'comp/icon9.png';
    } else if (fruitpID == 4) {
      scoopIMG = 'comp/icon8.png';
    } else if (fruitpID == 5) {
      scoopIMG = 'comp/icon28.png';
    }
    scoopBtn.skin = scoopIMG;
    scoop.visible = false;
    scoop.width = scoopWidth;
    scoop.height = scoopHeight;
    scoop.pos(scoopPosX, scoopPosY);
    scoopGoldNum.visible = false;
    operGold.visible = false;
    scoopGold.skin = 'comp/box26.png';
    lunckyTipBox.visible = false;
  } else {
    var scoopIMG;
    if (fruitpID == 1) {
      scoopIMG = 'comp/icon10-10.png';
    } else if (fruitpID == 2) {
      scoopIMG = 'comp/icon7-7.png';
    } else if (fruitpID == 3) {
      scoopIMG = 'comp/icon9-9.png';
    } else if (fruitpID == 4) {
      scoopIMG = 'comp/icon8-8.png';
    } else if (fruitpID == 5) {
      scoopIMG = 'comp/icon28-28.png';
    }
    scoopBtn.skin = scoopIMG;
    scoop.visible = false;
    scoop.width = scoopWidth;
    scoop.height = scoopHeight;
    scoop.pos(scoopPosX, scoopPosY);
    scoopGoldNum.visible = false;
    scoopGold.skin = 'comp/box29.png';
    operGold.visible = false;
  }
}
//更改幸运转盘
function setLunckyDial(lunckyNode, operBtnNode, famedata) {
  var status = famedata.data.status;//当前种植状态
  //浇水阶段开启转盘提示弹窗
  // switch(status){
  //   case 0://未播种
  //   break;
  //   case 1://已播种

  //   break;
  //   case 2://光照阶段
  //   break;
  //   case 3://待收货
  //   break;
  // }
  // lunckyNode //转盘容器
  lunckyNodeAnimation = operBtnNode;
  var lunckyNumImg = lunckyNode.getChildByName("lunckyNumImg");//转盘按钮容器
  var lunckyDialNum = lunckyNumImg.getChildByName("lunckyNum");//转盘次数
  var numText = operBtnNode.getChildByName("numText");//再次浇水次数
  var wheelChance = famedata.data.wheelInfo.wheelChance;//转盘次数
  var wateringCount = famedata.data.wheelInfo.wateringCount;//再交多少次水
  lunckyDialNum.text = wheelChance;
  numText.text = '再浇水' + wateringCount + '次，开启';
  if (wheelChance == 0) {
    lunckyNumImg.visible = false;
  } else {
    lunckyNumImg.visible = true;
  }
  //设置转盘提示框(动画)每8秒出现一次，停留两秒
  //backout替换linearOut
  if (judgeAnimation == 1) {
    judgeAnimation = 0;
    tween && tween.clear();
    tween = Tween.to(lunckyNodeAnimation, {
      scaleX: 1,
      scaleY: 1,
      pivotX: 200,
      pivotY: 100,
    }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
      //延迟两秒后多小
      setTimeout(function () {
        scaleXY2()
      }, 2000)
    }, null, true));
  }
}
function taskList(taskNode, famedata) {
  //找到红点dom
  var taskImg = taskNode.getChildByName("taskTips");//转盘按钮容器
  var taskInfo = famedata.data.taskInfo.todaySingIn;
  if (taskInfo == 1) {
    taskImg.visible = false;
  } else {
    taskImg.visible = true;
  }
}
function scaleXY1() {
  Tween.clearTween(scaleXY1);
  Tween.to(lunckyNodeAnimation, {
    scaleX: 1,
    scaleY: 1,
    pivotX: 200,
    pivotY: 100,
  }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
    setTimeout(function () {
      scaleXY2()
    }, 2000)
  }));
}
function scaleXY2() {
  Tween.clearTween(scaleXY2);
  Tween.to(lunckyNodeAnimation, {
    scaleX: 0,
    scaleY: 0,
    pivotX: 200,
    pivotY: 100,
  }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
    setTimeout(function () {
      scaleXY1()
    }, 8000)
  }));
}
/**设置省钱赚钱入口 */
function setentrance(data,node){
  let saveMoney = node.getChildByName("saveMoney");
  let makeMoney = node.getChildByName("makeMoney");
  saveMoney.visible = true;
  makeMoney.visible = true;
  for(let i in data){
    if(data[i].reasonId==257){
      Data.makeMoneydir = data[i].linkUrl; 
      Data.makeMoneyid = data[i].reasonId;
      makeMoney.skin = data[i].imgUrl;
    }else{
      Data.saveMoneydir = data[i].linkUrl; 
      saveMoney.skin = data[i].imgUrl;
    }
    
  }
}
export {
  setFarmland,
  setOperBtn,
  setLunckyDial,
  taskList,
  setentrance
} 