import Data from "../common/Data";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import { coinSoundClick, playSoundClick } from "../units/units";

export default class landUpgrade extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.shureBtn.on(Laya.Event.MOUSE_DOWN,this,this.shureBtnClick);
      var famelandMsg = this._param.data;
      // var famelandMsg = {"gid":166,"plid":0,"pid":2,"stepProcessPercent":3.12,"step":3,"processPercent":67.03,"processStepIndex":7,"msg":null,"resCodes":"","status":1,"coin":240,"minExp":452400,"maxExp":601120,"exp":466320,"resources":[{"resCode":"bj","name":"资源图片","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/bj.png"},{"resCode":"p_0","name":"种子","dataValue":"https://test-static01.baomihua.com/frameGame/images/p4/p_0.png"},{"resCode":"p_1","name":"破土而出","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_1.png"},{"resCode":"p_2","name":"茁壮成长","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_2.png"},{"resCode":"p_3","name":"生机勃勃","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_3.png"},{"resCode":"p_4","name":"枝繁叶茂","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_4.png"},{"resCode":"p_5","name":"绿树成荫","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_5.png"},{"resCode":"p_6","name":"花开朵朵","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_6.png"},{"resCode":"p_7","name":"结出小果","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_7.png"},{"resCode":"p_8","name":"硕果累累","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_8.png"},{"resCode":"p_9","name":"果熟蒂落","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_9.png"},{"resCode":"p_a","name":"果熟蒂落","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_10.png"},{"resCode":"p_b","name":"成品","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_11.png"},{"resCode":"p_c","name":"光照阶段","dataValue":"https://test-static01.baomihua.com/frameGame/images/p2/p_12.png"}],"lockerTime":"0001-01-01T00:00:00","userEvent":{"userEventLevel_bf":{"Level":10,"name":null,"resources":null,"buffer":58.0},"userEventLevel_af":{"Level":11,"name":null,"resources":null,"buffer":60.0},"userItemInfos":[
       
      //   {"itemtype":1,"name":"水壶","number":1,"itemid":2002,"explain":null,"rescodes":"","actived":1,"jewel":500},
      //   {"itemtype":6,"name":"金币","number":500,"itemid":3001,"explain":null,"rescodes":"","actived":1,"jewel":0},
      // ]},"plantEvents":null,"toolItemInfo":{"itemtype":1,"name":"大水桶","number":1,"itemid":2004,"explain":null,"rescodes":null,"actived":1,"jewel":0},"plantLevel":1,"wheelFlag":1,"lockStartTime":"0001-01-01T00:00:00","wheelInfo":null,"taskInfo":null,"microStepProcess":30.21,"microStepProcessMsg":"结出小果","dateTime":"0001-01-01T00:00:00","times":0}
      // console.log("famelandMsg",famelandMsg);
      this.userEventLevel_af = famelandMsg.userEvent.userEventLevel_af;
      this.userEventLevel_bf = famelandMsg.userEvent.userEventLevel_bf;
      this.userItemInfos = famelandMsg.userEvent.userItemInfos;
      Laya.timer.frameLoop(1, this, function(){
        this.rightBox.getChildByName("rightRotating").rotation += 2;
      });
      this.createLandUpgrade();
    }

    onDisable() {
    }
    createLandUpgrade(){
      //奖励电力值数
      let ValueArr = [
        {
          imgNode:this.leftAwardImg,
          valueNode:this.leftgoldNum,
        },
        {
          imgNode:this.rightAwardImg,
          valueNode:this.rightgoldNum,
        },
      ];
      //itemtype 0金币 6钻石 1水桶
      console.log("this.userItemInfos",this.userItemInfos);
      let userItemInfos = this.userItemInfos;
      if(userItemInfos.length>0){
        if(userItemInfos.length==1){
          this.leftBg.visible = true;
          this.leftAwardImg.visible = true;
          this.leftgoldNum.visible = true;
        }else if(userItemInfos.length==2){
          this.leftBg.visible = true;
          this.leftAwardImg.visible = true;
          this.leftgoldNum.visible = true;
          this.rightBg.visible = true;
          this.rightAwardImg.visible = true;
          this.rightgoldNum.visible = true;
        }
      }
      for(var j in userItemInfos){
        if(userItemInfos[j].itemtype==0){
          ValueArr[j].imgNode.skin = 'comp/gold.png';
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          Data.coin+=Number(userItemInfos[j].number);
          gameControl.I.updateCoin();
        }else if(userItemInfos[j].itemtype==1){
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          Data.jewel+=Number(userItemInfos[j].number);
          gameControl.I.updateJewel();
          if (userItemInfos[j].itemid == 2001) {
            ValueArr[j].imgNode.skin = 'comp/icon6.png';
          } else if (userItemInfos[j].itemid == 2002) {
            ValueArr[j].imgNode.skin = 'comp/icon12.png';
          } else if (userItemInfos[j].itemid == 2003) {
            ValueArr[j].imgNode.skin = 'comp/icon13.png';
          } else if (userItemInfos[j].itemid == 2004) {
            ValueArr[j].imgNode.skin = 'comp/icon14.png';
          } else if (userItemInfos[j].itemid == 2005) {
            ValueArr[j].imgNode.skin = 'comp/icon15.png';
          }
        }else if(userItemInfos[j].itemtype==6){
          ValueArr[j].imgNode.skin = 'backpack/icon2.png';
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          Data.jewel+=Number(userItemInfos[j].number);
          gameControl.I.updateJewel();
        }
        
      }
      //前土地效率
      this.leftBox.getChildByName("Aefficiency").text = '土地效率×'+this.userEventLevel_bf.buffer;
      //后土地效率
      this.rightBox.getChildByName("Befficiency").text = '土地效率×'+this.userEventLevel_af.buffer;
      //前土地等级
      this.leftBox.getChildByName("ALevel").text = this.userEventLevel_bf.Level;
      //后土地等级
      this.rightBox.getChildByName("BLevel").text = this.userEventLevel_af.Level;

      var landImgArr = [
        {img:'comp/farmland1.png',level:1},
        {img:'comp/farmland2.png',level:2},
        {img:'comp/farmland3.png',level:3},
        {img:'comp/farmland4.png',level:4},
        {img:'comp/farmland5.png',level:5},
        {img:'comp/farmland6.png',level:6},
        {img:'comp/farmland7.png',level:7},
        {img:'comp/farmland8.png',level:8},
        {img:'comp/farmland9.png',level:9},
        {img:'comp/farmland10.png',level:10},
        {img:'comp/farmland11.png',level:11},
        {img:'comp/farmland12.png',level:12},
        {img:'comp/farmland13.png',level:13},
        {img:'comp/farmland14.png',level:14},
        {img:'comp/farmland15.png',level:15},
        {img:'comp/farmland16.png',level:16},
        {img:'comp/farmland17.png',level:17},
        {img:'comp/farmland18.png',level:18},
        {img:'comp/farmland19.png',level:19},
        {img:'comp/farmland20.png',level:20},
      ]
      var ALevelimg,BLevelimg;
      for(var i=0;i<landImgArr.length;i++){
        if(this.userEventLevel_bf.Level==landImgArr[i].level){
          ALevelimg = landImgArr[i].img;
        }
        if(this.userEventLevel_af.Level==landImgArr[i].level){
          BLevelimg = landImgArr[i].img;
        }
      }
      //前土地等级图片
      this.leftBox.getChildByName("ALevelimg").skin = ALevelimg;
      //后土地等级图片
      this.rightBox.getChildByName("BLevelimg").skin = BLevelimg;
    }
    shureBtnClick(){
      Laya.Dialog.close(Scenes.landUpgrade);
    }
}