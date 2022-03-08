import Scenes from "../common/Scenes.js";
import Api from "../common/Api";
import gameControl from "../game/gameControl.js";
import Data from "../common/Data.js";
import goldAni from "../common/goldAni.js";
import jewelAni from "../common/jewelAni.js";
import { coinSoundClick, jewelSound } from "../units/units.js";
export default class choseMoney extends Laya.Dialog {

    constructor() { 
        super();
    }
    
    onEnable() {
      this.choseLeft.on(Laya.Event.MOUSE_DOWN,this,this.choseLeftClick);
      this.choseRight.on(Laya.Event.MOUSE_DOWN,this,this.choseRightClick);
      this.shure.on(Laya.Event.MOUSE_DOWN,this,this.shureClick);
      this.dailyData = this._param.obj;
      this.choseRight.getChildByName("rightMoneyText").text = this.dailyData.jewel+'钻石';
      this.choseLeft.getChildByName("leftMoneyText").text = this.dailyData.coin+'电力值';
      if(this.dailyData.jewel==0&&this.dailyData.coin!==0){
        this.choseLeft.skin = 'chose/b3.png';
        this.choseRight.skin = 'chose/b2.png';
        this.choseRight.mouseEnabled = false;
      }
      if(this.dailyData.jewel!==0&&this.dailyData.coin==0){
        this.choseLeft.skin = 'chose/b2.png';
        this.choseRight.skin = 'chose/b3.png';
        this.choseLeft.mouseEnabled = false;
      }
      if(this.dailyData.jewel!==0&&this.dailyData.coin!==0){
        this.choseLeft.skin = 'chose/b3.png';
        this.choseRight.skin = 'chose/b2.png';
      }
      this.jewel = 0;
      this.coin = this.dailyData.coin;
    }

    choseRightClick(){
      this.choseLeft.skin = 'chose/b2.png';
      this.choseRight.skin = 'chose/b3.png';
      this.youChoseText.text = '当前选择：'+this.dailyData.jewel+'钻石';
      this.choseRight.getChildByName("rightMoneyText").text = this.dailyData.jewel+'钻石';
      this.jewel = this.dailyData.jewel;
      this.coin = 0;
    }
    choseLeftClick(){
      this.choseLeft.skin = 'chose/b3.png';
      this.choseRight.skin = 'chose/b2.png';
      this.youChoseText.text = '当前选择：'+this.dailyData.coin+'电力值';
      this.choseLeft.getChildByName("leftMoneyText").text = this.dailyData.coin+'电力值';
      this.coin = this.dailyData.coin;
      this.jewel = 0;
    }
    //调起选择奖励
    shureClick(){
      var parmes = {
        taskId: this.dailyData.taskId,
        coin: this.coin,
        jewel: this.jewel,
      }
      Api.adDataReport(parmes,(data)=>{
        let type=this.coin?'电力值':'钻石';
        let num=this.coin?this.coin:this.jewel;
        if(this.jewel!==0){
          Data.jewel += Number(this.jewel);
          gameControl.I.updateJewel();
          jewelAni.jewelAniFuc(this.jewel);
          jewelSound();
        }else if(this.coin!==0){
          Data.coin += this.coin;
          gameControl.I.updateCoin();
          goldAni.goldAniFuc(this.coin);
          coinSoundClick();
        }
        Laya.Dialog.close(Scenes.choseMoney)
      });
    }
}