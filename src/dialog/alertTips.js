import Adapt from "../common/Adapt.js";
import Data from "../common/Data.js";
import Scenes from "../common/Scenes.js";
import gameControl from "../game/gameControl.js";
import MineCtrl from "../game/mine/MineCtrl.js";
import { createImage, createImage1, setCookie } from "../units/units.js";
import exchangeCenter1 from "./exchangeCenter1.js";
import goldrushDialog from "./goldrushDialog.js";
export default class alertTips extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    adapt(Node, inc=0){
      let ratio=Adapt.ratio;
      if(ratio<1){
        ratio+=inc;
        Node.scale(ratio, ratio);
      }
    }
    onEnable() {
      let scaleY=this.alertBtn.y;
      let timeLine=new Laya.TimeLine();
      timeLine.to(this.alertBtn,{y: scaleY+20 }, 500).to(this.alertBtn,{ y: scaleY }, 500).play(0, true);
      this.maskAlpha=0.5;
      this.stepNum = this._param.stepNum;
      this.alertBtn.on(Laya.Event.MOUSE_DOWN,this,this.alertBtnClick);
      switch(this.stepNum){
        case 1:
          createImage('stepNum1',this._param.size.x,this._param.size.y,this._param.size.width,this._param.size.height,this,true,'newguide/step1.png',0);
          // this.adapt(stepNum1)
          this.alertBg.skin = 'comp/icon24.png';
          this.alertBox.pos(this._param.content.x-187,this._param.content.y-89);
          setCookie("alertTipNum",2)
          break;
        case 2:
          createImage('stepNum2',this._param.content.x+30,this._param.content.y,216,280,this,true,'newguide/step2.png',0);
          this.alertBg.skin = 'comp/icon25.png';
          // this.alertBg.y = this._param.content.y-510;
          this.alertBg.x = this._param.content.x+100;
          this.alertBox.pos(this._param.content.x-80,this._param.content.y-70);
          this.alertBg.getChildByName("alertMsg").text = '先种植苹果吧，它来自烟台';
          setCookie("alertTipNum",3)
          break;
        case 3:
          createImage('stepNum3',this._param.size.x,this._param.size.y,this._param.size.width,this._param.size.height,this,true,'newguide/step3.png',0);
          this.alertBg.skin = 'comp/icon24.png';
          this.alertBox.pos(this._param.content.x-187,this._param.content.y-89);
          this.alertBg.getChildByName("alertMsg").text = '花费电力值,给种子浇水';
          setCookie("alertTipNum",4)
          break;
        case 4:
          var stepNum4 = createImage1('stepNum4','','',this._param.size.width,this._param.size.height,this,true,'newguide/step4.png',0,this._param.size.centerY,0,'','','');
          this.alertBg.skin = 'comp/icon24.png';
          this.alertBox.pos(this._param.content.x-157,this._param.content.y-50);
          this.alertBg.getChildByName("alertMsg").text = '点击矿洞，领取电力值';
          setCookie("alertTipNum",5)
          this.adapt(stepNum4)
          break;
        case 5:
          createImage('stepNum5',this._param.content.x,this._param.content.y,this._param.size.width,this._param.size.height,this,true,'newguide/step5.png',0);
          this.alertBg.skin = 'comp/icon24.png';
          this.alertBox.pos(this._param.content.x-140,this._param.content.y-140);
          this.alertBg.getChildByName("alertMsg").text = '招募更多工人，加速生产';
          setCookie("alertTipNum",6)
          break;
        case 6:
          var stepNum6 = createImage('stepNum6',this._param.size.x,this._param.size.y,this._param.size.width,this._param.size.height,this,true,'newguide/step6.png',0);
          this.adapt(stepNum6, 0.1)
          this.alertBg.skin = 'comp/icon24.png';
          let x=this._param.size.x+this._param.size.width, y=this._param.size.y;
          let offsetX=350, offsetY=80;
          this.alertBox.pos(x-offsetX, y-offsetY);
          this.adapt(this.alertBox, 0.1)
          this.alertBg.getChildByName("alertMsg").text = '花电力值购买你的第二位员工';
          break;
      }
      
      
    }

    onDisable() {
    }
    alertBtnClick(){
      /**stepNum:1 浇水 2： */
      switch(this.stepNum){
        case 1:
          gameControl.I.operPosClick(1);
          Data.selectNum = 1;
          break;
        case 2:
          exchangeCenter1.I.onSelect();
          break;
        case 3:
          gameControl.I.operWatering();
          break;
        case 4:
          //开始挖矿
          MineCtrl.I.onCollectCoin();
          break;
        case 5:
          MineCtrl.I.showDetail();
          break;
        case 6:
          goldrushDialog.I.onCellClick();
          break;
      }
      Laya.Dialog.close(Scenes.alerttTip);

    }
    
}