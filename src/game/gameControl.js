import gameAnimation from './gameAnimation';
import {ajax} from "../units/ajax.js";
import URL from "../units/url.js";
import {report, setPagedurations} from '../units/statReport.js'
import { createText,getCookie,setCookie,playSoundClick, getCaption, addIframe} from "../units/units.js";
//调优化代码文件
import { setFarmland,setOperBtn,setLunckyDial,taskList, setentrance } from "../units/setFarmland.js";
import Scenes from "../common/Scenes.js"
import Data from '../common/Data';
import MineCtrl from './mine/MineCtrl';
import Adapt from '../common/Adapt';
import RequestLoading from '../common/RequestLoading';
import { alerttTip1, alerttTip3, alerttTip4, hideHandTip, showHandTip } from '../common/alertTipFuc';
import Api from '../common/Api';
import missionSystems from '../dialog/missionSystems';
let value = 0;
export default class gameControl extends Laya.Script {

    constructor() { 
        super(); 
        gameControl.I=this;
        /** @prop {name:house, tips:"兑换中心", type:Node, default:null}*/
        /** @prop {name:headImg, tips:"兑换中心", type:Node, default:null}*/
        /** @prop {name:exChangeList, tips:"兑换记录", type:Node, default:null}*/
        /** @prop {name:operPos, tips:"操作位置", type:Node, default:null}*/
        /** @prop {name:treeBtn, tips:"种子", type:Node, default:null}*/
        /** @prop {name:backpack, tips:"背包按钮", type:Node, default:null}*/
        /** @prop {name:landFrame, tips:"土地", type:Node, default:null}*/
        /** @prop {name:landFrameBox, tips:"土地", type:Node, default:null}*/
        /** @prop {name:backpackBox, tips:"背包弹窗", type:Prefab, default:null}*/
        /** @prop {name:upgraded, tips:"升级了", type:Prefab, default:null}*/
        /** @prop {name:nullGold, tips:"金币不足弹窗", type:Prefab, default:null}*/
        /** @prop {name:sun, tips:"太阳", type:Node, default:null}*/
        /** @prop {name:userBox, tips:"个人信息", type:Node, default:null}*/
        /** @prop {name:userGold, tips:"金币值", type:Node, default:null}*/
        /** @prop {name:headBox, tips:"头像图片", type:Node, default:null}*/
        /** @prop {name:lunckyDial, tips:"幸运转盘", type:Node, default:null}*/
        /** @prop {name:progressbarBox, tips:"进度条", type:Node, default:null}*/
        /** @prop {name:lunckyTipBox, tips:"转盘提示框", type:Node, default:null}*/
        /** @prop {name:earnCoins, tips:"赚金币", type:Node, default:null}*/
        /** @prop {name:jewelIcon, tips:"钻石入口", type:Node, default:null}*/
        /** @prop {name:makeMoney, tips:"赚钱入口", type:Node, default:null}*/
        /** @prop {name:saveMoney, tips:"省钱入口", type:Node, default:null}*/
        
        this.isClick = 0;//防止连续点击
        this.isClickJewel =0;
    }

    onAwake() {
      RequestLoading.show();
      //适配
      Adapt.init(this.owner);
      this.owner.lblVersion.text='v1.1.2';
      Data.appVer = this.owner.lblVersion.text;
      // console.log=()=>{};

      //给兑换中心添加动画效果
      let scale=this.house.scaleX;
      let timeLine=new Laya.TimeLine();
      timeLine.to(this.house,{ scaleX: scale+0.02, scaleY: scale+0.02 }, 1000).to(this.house,{ scaleX: scale, scaleY: scale }, 1000).play(0, true);
    }
    
    onEnable() {
      Data.userLogo = Math.random().toString(36).slice(-6);//生成当前用户唯一标识，每次刷新界面会生成新的
      Data.commonPoint1  = this.operPos.localToGlobal(new Laya.Point(0, 0));//操作按钮位置 浇水和播种公用
      Data.pointSize1 = {
        width:this.operPos._width,
        height:this.operPos._height,
        x:this.operPos._parent.x,
        y:this.operPos._parent.y,
      }
      Data.pointSize3 = {
        width:this.goldRushBox._width,
        height:this.goldRushBox._height,
        centerY:this.goldRushBox.centerY,
      }

      Data.commonPoint3 = this.goldRushBox.localToGlobal(new Laya.Point(0, 0));//矿洞按钮位置
      this.gameAnimation=this.owner.getComponent(gameAnimation);
      //获取土地
      this.farmlandBox = this.owner.getChildByName("farmlandBox");
      this.farmland = this.farmlandBox.getChildByName("farmland");
      this.fameSign = this.farmlandBox.getChildByName("fameSign");//种植区指示牌
      this.fameFruitName = this.fameSign.getChildByName("fameFruitName");//种植区指示牌种植水果名称
      this.fameLevel = this.fameSign.getChildByName("fameLevel");//种植区指示牌土地登记
      
      //给种植物绑定点击事件
      this.treeBtn.on(Laya.Event.MOUSE_DOWN,this,this.treeClick);
      this.fameSign.on(Laya.Event.MOUSE_DOWN,this,this.fameSignClick);
    }

    onStart(){
      this.createProgress()//首次进入默认执行
      // this.hotShowTimer();
      this.house.on(Laya.Event.MOUSE_DOWN,this,this.houseClick);
      this.backpack.on(Laya.Event.MOUSE_DOWN,this,this.backpackClick);
      this.operPos.on(Laya.Event.MOUSE_DOWN,this,this.operPosClick);
      this.exChangeList.on(Laya.Event.MOUSE_DOWN,this,this.exChangeListClick)
      this.headImg.on(Laya.Event.MOUSE_DOWN,this,this.headImgListClick)
      this.lunckyDial.on(Laya.Event.MOUSE_DOWN,this,this.lunckyDialClick);
      this.earnCoins.on(Laya.Event.MOUSE_DOWN,this,this.earnCoinsClick);
      this.jewelIcon.on(Laya.Event.MOUSE_DOWN,this,this.jewelIconClick);
      this.makeMoney.on(Laya.Event.MOUSE_DOWN,this,this.makeMoneyClick);
      this.saveMoney.on(Laya.Event.MOUSE_DOWN,this,this.saveMoneyClick);
      this.userBox.on(Laya.Event.MOUSE_DOWN,this,this.userBoxClick);
    }
    createProgress() {
      //设置进度条
      // this.userBox = this.owner.getChildByName("rec1");
      this.goldBox = this.owner.getChildByName("rec2");
      this.jewBox = this.owner.getChildByName("rec3");
      createText('0W',26,'userGoldNum','#2E8B89',82,26,'Microsoft YaHei',this.goldBox,'center','','','','','')
      createText('0W',26,'userjewNum','#2E8B89',82,26,'Microsoft YaHei',this.jewBox,'center','','','','','')
      if(getCookie("userToken")){
        this.getfameMsg()
        this.getFameLandInfo();
        MineCtrl.I.init();
        
      }else{
        this.authentication(()=>{
          this.getfameMsg()
          this.getFameLandInfo();
          MineCtrl.I.init();
        });
      }
      setTimeout(() => {
        this.setExposureReport()
      }, 3000);
      
    }
    userBoxClick(){
      Laya.Dialog.open(Scenes.plantRule);
    }
    /**更新金币显示数目 */
    updateCoin(){
      let coin=Math.floor(Data.coin);
      coin = coin> 9999 ? (Math.floor(coin/1000)/10) + 'W' : coin;
      if(!this.goldBox);
      this.goldBox.getChildByName("userGoldNum").text = coin;

      this.updateWaterCoinColor();
    }

    /**更新钻石显示数目 */
    updateJewel(){
      let jewel=Math.floor(Data.jewel);
      jewel = jewel> 9999 ? (Math.floor(jewel/1000)/10) + 'W' : jewel;
      this.jewBox.getChildByName("userjewNum").text = jewel;
    }

    /**更新转盘上的小数字 */
    updateWheelNum(num){
      if(num){
        this.owner.lunckyNum.text=num;
      }else{
        this.owner.lunckyNumImg.visible=false;
      }
    }
    fameSignClick(){
      Laya.Dialog.open(Scenes.plantRule);
    }
    makeMoneyClick(){
      let dir = Data.makeMoneydir;
      let id = Data.makeMoneyid;
      Api.placeInsOrder(id,dir)
    }
    saveMoneyClick(){
      let dir = Data.saveMoneydir;
      getCaption(dir)
    }
    /**更新浇水按钮上的金币颜色 */
    updateWaterCoinColor(){
      let scoopGoldNum=this.owner.scoopGoldNum;
      if(Data.coin<Data.waterNeedCoinNum){
        scoopGoldNum.color = '#ea482b';
        scoopGoldNum.strokeColor = '#ea482b';
      }else{
        scoopGoldNum.color = '#FFFFFF';
        scoopGoldNum.strokeColor = '#62503B';
      }
    }

    authentication(callback){
      ajax({
        type: 'POST',
        url: URL.authentication,
        data:{},
        dataType:'json',
        decrypt:false,
        success: function(response){
          console.log("token:", response.data);
          Data.token = response.data;
          setCookie("userToken",response.data);
          callback();
        }
      })
    }
    getfameMsg(){
      ajax({
        type: 'POST',
        url: URL.getFarmInfo,
        data:{},
        dataType:'json',
        success:(fameMsg)=>{
          console.log("农场主信息",fameMsg);
          if(fameMsg.code==1){
            setentrance(fameMsg.data.promoteInfos,this.owner)
            Data.userId = fameMsg.data.userId;
            Data.exp = fameMsg.data.exp;
            Data.maxExp = fameMsg.data.maxExp;
            setCookie("landlevel",fameMsg.data.level,1)
            this.landlevel = fameMsg.data.level;
            this.exp = fameMsg.data.exp;
            this.maxExp = fameMsg.data.maxExp;
            Data.level = fameMsg.data.level;
            Data.coin=fameMsg.data.coin;
            Data.jewel=fameMsg.data.jewel;
            if(Data.plantStatus==1&&Data.exp>60&&Data.coin>=60){
              setTimeout(() => {
                if(Data.coin>=60&&Data.level==1){
                  showHandTip(this.owner);
                }
                
              }, 2000);
            }
            if(Data.level>1){
              hideHandTip()
            }
            //计算当前经验值
            if(this.maxExp>0){
              this.nowExp = Number(Math.round(this.exp / this.maxExp * 10000) / 10000);
            }else{
              this.nowExp = 0;
            }
            //获取
            Laya.Tween.to(this.userBox.getChildByName("myExp"), {value:this.nowExp}, 500, Laya.Ease.sineInOut);
            this.userBox.getChildByName("myLevel").text = '农场'+this.landlevel+'级';
            this.fameLevel.text = '土壤：'+this.landlevel+'级';
            let expValue = Data.exp> 9999 ? (Math.floor(Data.exp/1000)/10) + 'W' : Data.exp;
            let maxExpValue = Data.maxExp> 9999 ? (Math.floor(Data.maxExp/1000)/10) + 'W' : Data.maxExp;
            this.userBox.getChildByName("myExpValue").text = expValue+'/'+maxExpValue;
            if(Data.exp>99999999&&Data.maxExp>99999999){
              this.userBox.getChildByName("myExpValue").fontSize = 19;
            }
            this.updateCoin();
            this.updateJewel();
            //根据接口返回农场经验判断是否为新手
            
          }else{
            this.userBox.getChildByName("myExp").value = 0;
            this.userBox.getChildByName("myLevel").text = '农场1级';
            this.userBox.getChildByName("myExpValue").text = '0/'+Data.maxExp;
            this.goldBox.getChildByName("userGoldNum").text = '0';
            this.jewBox.getChildByName("userjewNum").text = '0';
          }

        }
      })
    }
    getFameLandInfo(){
      var that = this;
      ajax({
        type: 'POST',
        url: URL.getPlantInfo,
        data:{},
        dataType:'json',
        success: function(PlantInfo){
          RequestLoading.hide();
           //获取农场信息，全部初始化
          var farmland = that.farmlandBox.getChildByName("farmland");//农田容器
          var landZL = that.farmlandBox.getChildByName("landZL");//栅栏
          var treeBtn = that.farmlandBox.getChildByName("treeBtn");//植物容器
          var framProgressbar = that.farmlandBox.getChildByName("framProgressbar");//进度条容器
          var parentNode = framProgressbar.getChildByName("parentNode");//进度条右侧文字提示容器
          var scoopBtn = that.operPos;//按钮容器
          var scoopGold = that.operPos.getChildByName("scoopGold");//button容器
          var scoopGoldNum = scoopGold.getChildByName("scoopGoldNum");//button字体
          var operGold = scoopGold.getChildByName("operGold");//金币容器
          var scoop = scoopBtn.getChildByName("scoop");//操作图片容器
          console.log("农场植物信息",PlantInfo)
          that.PlantInfoMsg  = PlantInfo; 
          if(PlantInfo.code==0){
            Data.plantStatus = PlantInfo.data.status;
            setTimeout(() => {
              if(Data.exp==0&&PlantInfo.data.status==0&&Data.level==1){
                alerttTip1()
              }
            }, 1500);
            
            //循环给该数据中植物添加高宽和位置信息
            
            //根据种植状态更改种植操作按钮
            var fruitpID = PlantInfo.data.pid;
            Data.plantStatus = PlantInfo.data.status;
            Data.stepProcessPercent = PlantInfo.data.exp;
            if(fruitpID==1){
              that.fameFruitName.text = '种植：'+'苹果';
            }else if(fruitpID==2){
              that.fameFruitName.text = '种植：'+'橙子';
            }else if(fruitpID==3){
              that.fameFruitName.text = '种植：'+'橘子';
            }else if(fruitpID==4){
              that.fameFruitName.text = '种植：'+'猕猴桃';
            }else if(fruitpID==5){
              that.fameFruitName.text = '种植：'+'酥梨';
            }
            if(PlantInfo.data.processStepIndex==9&&PlantInfo.data.status==3){
                var scoopIMG;
                if(fruitpID==1){
                  scoopIMG = 'comp/icon10.png';
                }else if(fruitpID==2){
                  scoopIMG = 'comp/icon7.png';
                }else if(fruitpID==3){
                  scoopIMG = 'comp/icon9.png';
                }else if(fruitpID==4){
                  scoopIMG = 'comp/icon8.png';
                }else if(fruitpID==5){
                  scoopIMG = 'comp/icon28.png';
                }
                scoopBtn.skin = scoopIMG;
                scoopGold.skin = 'comp/box29.png';
                framProgressbar.visible = true;
                framProgressbar.value = 1;
                parentNode.text = '100%';
            }
            //获取农田节点
            setFarmland(that.farmlandBox,PlantInfo,that.sun)
            setOperBtn(that.operPos,PlantInfo);
            //如果为浇水阶段则提示
            setLunckyDial(that.lunckyDial,that.lunckyTipBox,PlantInfo);
            taskList(that.earnCoins,PlantInfo)
            
          }else{
              var scoopIMG;
              if(fruitpID==1){
                scoopIMG = 'comp/icon10.png';
              }else if(fruitpID==2){
                scoopIMG = 'comp/icon7.png';
              }else if(fruitpID==3){
                scoopIMG = 'comp/icon9.png';
              }else if(fruitpID==4){
                scoopIMG = 'comp/icon8.png';
              }else if(fruitpID==5){
                scoopIMG = 'comp/icon28.png';
              }
              scoopBtn.skin = scoopIMG;
              treeBtn.skin = null;//植物图片
              farmland.skin = 'comp/farmland1.png';
              framProgressbar.value = 0;//进度条
              parentNode.text = '0%';
              landZL.visible = false;//栅栏清除
              
             
              scoop.visible = true;
              scoop.width = 112;
              scoop.height = 121;
              scoop.pos(48,43);
              scoopGoldNum.text = '播种';
              scoopGoldNum.visible = true;
              operGold.visible = false;
              //按钮状态恢复初始状态
              scoopBtn.skin = 'comp/icon3.png';
              scoopGold.skin = 'comp/waterbtn.png';
              scoop.skin = 'comp/icon.png';
          }
        }
      })
    }

    jewelIconClick(){
      playSoundClick();
      Laya.Dialog.open(Scenes.fullSale);
      var params = {
        action_type:'点击',
        content:'钻石+号',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    hotShowTimer(){
      window.hotTimer = setInterval(() => {
        this.gameAnimation.createAnimation();
        this.gameAnimation.zOrder = 3;
      }, 1200000);
    }
    treeClick(){
      playSoundClick()
      //状态为0是不作升级提示
      if(Data.plantStatus!==0){
        Laya.Dialog.open(Scenes.treeLevelDialog,false,this.PlantInfoMsg);
      }
    }

    //兑换记录
    exChangeListClick(){
      playSoundClick()
      Laya.Dialog.open(Scenes.exchangelist,'',{sceneValue:1});
      var params = {
        action_type:'点击',
        content:'兑换记录',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    houseClick(){
      //打开兑换中心
      //发布需展示
      playSoundClick()
      Laya.Dialog.open(Scenes.exchangeCenter1);
      var params = {
        action_type:'点击',
        content:'兑换中心',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    //背包
    backpackClick(){
      playSoundClick()
       //发布需展示
      // var backpackBox = Laya.Pool.getItemByCreateFun("backpackBox", this.backpackBox.create, this.backpackBox);
      // Laya.stage.addChild(backpackBox);
      Laya.Dialog.open(Scenes.backpack);
      var params = {
        action_type:'点击',
        content:'背包',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    operPosClick(){
      playSoundClick()
      if(Data.plantStatus==0){//0未播种
        Data.seedStatus = true;
        Laya.Dialog.open(Scenes.exchangeCenter1);
      }else if(Data.plantStatus==1){//种植中
        console.log("isClick",this.isClick)
        //阻止多次点击事件
        if(this.isClick==0) {
          this.isClick = 1;
          //事件
          this.operWatering();//浇水
          //定时器
          setTimeout(() => {
            this.isClick = 0;
          }, 3000);
        }else{
          // alert("请稍后")
        }
      }else if(Data.plantStatus==3){
        //调起收获窗口
        Laya.Dialog.open(Scenes.harvestPrompt)
      }
    }
    //添加用户升级弹窗
    landFrameClick(fameland){
      setTimeout(() => {
        Laya.Dialog.open(Scenes.landUpgrade,false,fameland);
      }, 2000);
    }
    
    //播种接口
    operSeedFun(fruitpID){
      ajax({
        type: 'POST',
        url: URL.operSeed,
        data:{
          plid:fruitpID,
        },
        dataType:'json',
        // contentType:'application/json',
        success:(response)=>{
          var famelandData = response;
          if(famelandData.code==1){
            // setCookie("haveSeed",1);
            console.log("播种接口",famelandData)
            if(fruitpID==1){
              this.fameFruitName.text = '种植：'+'苹果';
            }else if(fruitpID==2){
              this.fameFruitName.text = '种植：'+'橙子';
            }else if(fruitpID==3){
              this.fameFruitName.text = '种植：'+'橘子';
            }else if(fruitpID==4){
              this.fameFruitName.text = '种植：'+'猕猴桃';
            }else if(fruitpID==5){
              this.fameFruitName.text = '种植：'+'酥梨';
            }
            var framland = this.owner.farmland;
            this.gameAnimation.createSoilAnimation(1,framland);
            Data.exp = famelandData.data.exp;
            Data.plantStatus = famelandData.data.status;
            this.PlantInfoMsg  = famelandData;
            if(this.exp==0&&Data.plantStatus==1){
              setTimeout(() => {
                alerttTip3()
              }, 2000);
            }
          }else{
            alert(famelandData.msg);
          }
        },
        error:function(err){
          Laya.Dialog.open(Scenes.Tip, true, {content:err});
        }
      })
    }
    //浇水接口
    operWatering(){
      ajax({
        type: 'POST',
        url: URL.operWatering,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        success:(response)=>{
          var params = {
            action_type:'点击',
            content:'浇水',
            channel_name:'',
            content_id:1,
            content_cat:'',//矿工等级
            content_cat_id:'',//矿工数量
          }
          report(params);
          var famelandData = response;
          var waterBtnType = famelandData.data.toolItemInfo.itemid;
          var operExp = famelandData.data.exp;
          Data.plantStatus = famelandData.data.status;
          Data.exp = famelandData.data.exp;
          if(famelandData.code==1){
            
            
            //第一次浇水成功后显示矿洞挖矿功能指示
            hideHandTip()
            if(operExp==60&&Data.plantStatus==1){
              setTimeout(() => {
                alerttTip4();
              }, 3000);
            }
            
            this.getfameMsg();
            var farmlandBox = this.owner.farmlandBox;
            this.gameAnimation.createScoopAnimation(2,waterBtnType,farmlandBox);
            console.log("浇水状态",famelandData);
            this.PlantInfoMsg  = famelandData;
            //判断是否需要弹出信用转盘
            if(famelandData.data.wheelFlag==1){
              setTimeout(() => {
                this.lunckyDialClick()
              }, 2000);
              setCookie("haveLunckyDil",1);
            }
            
            if(famelandData.data.userEvent.userEventLevel_bf){
              setCookie("landlevel",famelandData.data.userEvent.userEventLevel_bf.Level,1)
              this.landFrameClick(famelandData);
            }

            if((famelandData.data.stepProcessPercent==0) && (famelandData.data.status!==2)){
              setTimeout(() => {
                Laya.Dialog.open(Scenes.treeLevelDialog,false,famelandData);
                this.PlantInfoMsg=famelandData;
              }, 2000);
            }
          }else{
             //当前code值不为1时，调起任务系统
            console.log("金币不足");
            Laya.Dialog.open(Scenes.missionSystems);
          }

        },
        error:function(){
          var params = {
            action_type:'点击',
            content:'浇水',
            channel_name:'',
            content_id:0,
            content_cat:'',//矿工等级
            content_cat_id:'',//矿工数量
          }
          report(params);
        }
        
      })
    }
    //幸运转盘
    lunckyDialClick(){
      playSoundClick();
      // lunckyDial();
      Laya.Dialog.open(Scenes.Spinwin);
      var params = {
        action_type:'点击',
        content:'幸运转盘',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      
      report(params);
    }
    //赚金币
    earnCoinsClick(){
      playSoundClick();
      Laya.Dialog.open(Scenes.missionSystems);
      var params = {
        action_type:'点击',
        content:'赚金币',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    /**获取手机等信息做埋点上报 */
    setExposureReport(){
      if(!getCookie("ifd")){
        setCookie("ifd",1);
      }
      let params = {
        user_id:Data.userId,//userid
        as:Data.userLogo,//每次进入农场不一样的值，农场内的行为事件相同
        ci:Data.userId,//userid
        et:'pageview',//事件类型(pageview-页面访问，pagedurations-页面 停留):pageview
        dur:'',//页面停留时长(秒),统计页面时长时候传递:
        il:Data.userId?1:0,//是否登录:1或0
        ifd:getCookie("ifd")?1:0,//是否今天第一次访问:1--是或0--否
        if:'',//是否第一次访问,通过第一次启动的日期和当前日期对比，如果当前日期大于第一次启动日期为老用户:1或0
        times:Date.parse(new Date())/1000,//当前时间戳总秒数:1562293343
        sv:'',//SDK版本号:1.0.1
        st:'',//SDK类型:APP
        inu:'',//新用户:1(老用户为0)，如果新用户，当天所有调用均为1
        action_type:'',
        content:'',
        channel_name:'',
        content_id:'',
        content_cat:'',
        content_cat_id:'',
      };
      Api.setReport(params, (data)=>{
        console.log("data",data);
        setInterval(() => {
          this.setPagedurationsTime()
        }, 5000);
      });
      
    }
    setPagedurationsTime(){
      Data.durNum = Number(Data.durNum + 5 - Data.durNum);
      var params = {
        dur:Data.durNum,
        action_type:'',
        content:'',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      setPagedurations(params);
    }
}