import Scenes from "../common/Scenes.js"
import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import {coinSoundClick, getCaption, playSoundClick} from "../units/units.js";
import Api from "../common/Api.js";
import gameControl from "../game/gameControl.js";
import goldAni from "../common/goldAni.js";
import Data from "../common/Data.js";
import MineCtrl from "../game/mine/MineCtrl.js";
import RequestLoading from "../common/RequestLoading.js";
import { report } from "../units/statReport.js";
var cellArr = [];
export default class missionSystems extends Laya.Dialog {

    constructor() { 
        super();
    }
    
    onEnable() {
      RequestLoading.show();
      this.count=2;
      if(Laya.Browser.onMiniGame) {
        console.log("Laya.Browser.onMiniGame",Laya.Browser.onMiniGame)
        this.wx = Laya.Browser.window.wx;
      }
      this.getAllTasks();
      this.parentsHeight = this._parent._parent._height;
      this.missionSystemsBoxHeight = this.missionSystemsBox._height;
      Laya.Tween.to(this.missionSystemsBox,{
        x:0,
        y:this.parentsHeight-this.missionSystemsBoxHeight,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
        
　　  },null,true));
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
    }

    onGotData(){
      RequestLoading.hide();
    }

    closeClick(){
      playSoundClick();
      Laya.Tween.to(this.missionSystemsBox,{
        x:0,
        y:this.parentsHeight+8,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
　　　　Laya.Dialog.close(Scenes.missionSystems);//关闭当前任务系统
　　  },null,true));
    }

    /**天签到 */
    daySignIn(index){
      ajax({
        type: 'POST',
        url: URL.daySignIn,
        data:{},
        dataType:'json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            for(var i=0;i<cellArr.length;i++){
              if(index==i){
                goldAni.goldAniFuc(res.data);
                coinSoundClick()
                cellArr[i].getChildByName("btnImg").visible = false;
                cellArr[i].getChildByName("Bg1").visible = true;
                cellArr[i].getChildByName("dayNum").text = '已领取';
                cellArr[i].getChildByName("dayNum").visible = true;
                cellArr[i].mouseEnabled = false;
                //更新场景数据
                gameControl.I.getfameMsg();
                gameControl.I.getFameLandInfo();
              }
              
            }
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**获取任务列表数据 */
    getAllTasks(){
      ajax({
        type: 'POST',
        url: URL.getAllTasks,
        data:{},
        dataType:'json',
        async: true,
        success:(res)=>{
          console.log("res",res);
          if (res.code == 1) {
            this.onGotData();
            this.signInDatas = res.data.signInDatas;
            this.dailyDatas = res.data.dailyDatas;
            this.createGoldRushList(res.data.signInDatas);
            this.createGoldRushList1(res.data.dailyDatas);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**创建列表 */
    createGoldRushList(Arr){
      // 使用但隐藏滚动条
      this.signInDatasList.hScrollBarSkin = "";
      this.signInDatasList.selectEnable = true;
      this.signInDatasList.selectHandler = new Laya.Handler(this, this.onSelect);
      this.signInDatasList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.signInDatasList.array = Arr;
    }
    updateItem(cell, index) {
      cell.getChildByName("Bg").skin = cell.dataSource.imgUrl;
      cell.getChildByName("num").text = cell.dataSource.prizeConf;
      cellArr.push(cell);
      
      //0可领取 //1已领取 //2不可领取
      switch (cell.dataSource.status) {
        case 0:
          cell.getChildByName("Bg1").visible = false;
          cell.getChildByName("dayNum").visible = false;
          cell.getChildByName("btnImg").visible = true;
          break;
        case 1:
          cell.getChildByName("btnImg").visible = false;
          cell.getChildByName("dayNum").text = '已领取';
          cell.mouseEnabled = false;
          break;
        case 2:
          cell.getChildByName("btnImg").visible = false;
          cell.getChildByName("dayNum").visible = true;
          cell.getChildByName("Bg1").visible = false;
          cell.getChildByName("dayNum").text = '第'+Number(index+1)+'天';
          cell.mouseEnabled = false;
          break;
      }
      
    }
    onSelect(index) {
      playSoundClick();
      //优先调整更改后的样式
      this.daySignIn(index);
      var params = {
        action_type:'点击',
        content:'赚金币-签到',
        channel_name:'赚金币',
        content_id:index-1,
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    //创建列表
    createGoldRushList1(Arr){
      // 使用但隐藏滚动条
      this.dailyDatasList.vScrollBarSkin = "";
      this.dailyDatasList.selectEnable = true;
      this.dailyDatasList.mouseHandler = new Laya.Handler(this, this.onSelect1);
      this.dailyDatasList.renderHandler = new Laya.Handler(this, this.updateItem1);
      this.dailyDatasList.array = Arr;
    }
    updateItem1(cell, index) {
      //0未完成1已完成，明日再来 2可领取
      
      switch (cell.dataSource.status) {
        case 0:
          cell.getChildByName("rightBtn").skin = 'mission/btn2.png';
          // cell.mouseEnabled = false;
          break;
        case 1:
          cell.getChildByName("rightBtn").skin = 'mission/btn2.png';
          // cell.mouseEnabled = false;
          break;
        case 2:
          cell.getChildByName("rightBtn").skin = 'mission/btn1.png';
          // cell.mouseEnabled = true;
          break;
      }
      cell.getChildByName("leftImg").skin = cell.dataSource.imgUrl;
      cell.getChildByName("title").text = cell.dataSource.title;
      cell.getChildByName("intro").text = cell.dataSource.description;
      if(cell.dataSource.dayLimit!==-1){
        cell.getChildByName("title").getChildByName("titleNum").text = '('+cell.dataSource.finishCount+'/'+cell.dataSource.dayLimit+')';
      }else{
        cell.getChildByName("title").getChildByName("titleNum").visible = false;
      }
      cell.getChildByName("title").getChildByName("titleNum").x = cell.getChildByName("title").width+10;
      if(cell.dataSource.reasonid == 253){
        if(cell.dataSource.status==2){
          cell.getChildByName("rightBtn").visible = true;
        }else{
          cell.getChildByName("rightBtn").visible = false;
        }
        
      }else{
        cell.getChildByName("rightBtn").visible = true;
      }
    }
    onSelect1(e,i){
      if (e.type == Laya.Event.MOUSE_UP&&e.target.name == 'rightBtn') {
        playSoundClick();
        var dataSource = e.currentTarget.dataSource;
        var params = {
          action_type:'点击',
          content:'赚金币-前往',
          channel_name:'赚金币',
          content_id:dataSource.id,
          content_cat:'',//矿工等级
          content_cat_id:'',//矿工数量
        }
        report(params);
        if(dataSource.status==0){
          var dir = dataSource.dir;
          if(dir=="gotomine"){
            //挖金矿
            MineCtrl.I.onCollectCoin();

          }else if(dir=="gotolucky"){
            //大转盘
            Laya.Dialog.open(Scenes.Spinwin);
          }else{
            //提交内部订单
            if(dataSource.reasonid==251){
              Api.placeInsOrder(251,dir)
            }else if(dataSource.reasonid==253){
              Api.placeInsOrder(253,dir)
            }else if(dataSource.reasonid==257){
              Api.placeInsOrder(257,dir)
            }else if(dataSource.reasonid==254){
              getCaption(dir)
            }else{
              getCaption(dir)
            }
            
          }
          Laya.Dialog.close(Scenes.missionSystems)
        }
        if(dataSource.status==1){
          // Laya.Dialog.open(Scenes.Tip, false, {content:"请明日再来"});
        }
        if(dataSource.status==2){
          var parmes;
          var prizeType = dataSource.prizeType;
          if(prizeType==3){//跳转电力值或者钻石
            //调起选择钻石和电力值类型
            var obj = {
              taskId: dataSource.id,
              coin: dataSource.prizeConf,
              jewel: dataSource.prizeJewel,
            };
            Laya.Dialog.open(Scenes.choseMoney,false,{obj:obj});
            this.dailyDatas[i].status=0;
            this.dailyDatasList.refresh();
          }else{
            if(prizeType==1){//跳转电力值或者钻石
              parmes = {
                taskId: dataSource.id,
                coin: dataSource.prizeConf,
              };
            }
            if(prizeType==2){//跳转电力值或者钻石
              parmes = {
                taskId: dataSource.id,
                jewel: dataSource.prizeJewel,
              };
            }
            if(prizeType==4){//跳转电力值或者钻石
              parmes = {
                taskId: dataSource.id,
                coin: dataSource.prizeConf,
                jewel: dataSource.prizeJewel,
              };
            }
            Api.adDataReport(parmes, (data)=>{
              this.onADEnd(data, i)
            });
          }
          
        }
      }
    }
    onADEnd(data, index){
      // Laya.Dialog.closeAll();
      
      this.dailyDatas[index].status=1;
      if(this.dailyDatas[index].finishCount==this.dailyDatas[index].dayLimit){
        this.dailyDatas[index].status=0;
      }else if(this.dailyDatas[index].finishCount<this.dailyDatas[index].dayLimit){
        this.dailyDatas[index].status=0;
      }
      this.dailyDatasList.refresh();
      goldAni.goldAniFuc(data.Coin);
      coinSoundClick()
      Data.coin+=data.Coin;
      gameControl.I.updateCoin();
    }
}