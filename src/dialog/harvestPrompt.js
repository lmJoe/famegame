import Data from "../common/Data";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import { ajax } from "../units/ajax";
import { clearCookie, playSoundClick } from "../units/units";
import URL from "../units/url";

export default class harvestPrompt extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      if(Data.fruitpID==1){
        this.fruitIcon.skin = 'comp/icon19.png';
        this.titleTip.text = '一箱苹果';
      }else if(Data.fruitpID==2){
        this.fruitIcon.skin = 'comp/icon17.png';
        this.titleTip.text = '一箱橙子';
      }else if(Data.fruitpID==3){
        this.fruitIcon.skin = 'comp/icon16.png';
        this.titleTip.text = '一箱橘子';
      }else if(Data.fruitpID==4){
        this.fruitIcon.skin = 'comp/icon18.png';
        this.titleTip.text = '一箱猕猴桃';
      }else if(Data.fruitpID==5){
        this.fruitIcon.skin = 'comp/icon29.png';
        this.titleTip.text = '一箱酥梨';
      }
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.shureBtn.on(Laya.Event.MOUSE_DOWN,this,this.shureBtnClick);
    }
    closeBtnClick(){
      playSoundClick()
      Laya.Dialog.close(Scenes.harvestPrompt)
    }
    shureBtnClick(){
      playSoundClick()
      this.operHarvest();
    }
    //收货接口
    operHarvest(){
      ajax({
        type: 'POST',
        url: URL.operHarvest,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        success:(res)=>{
          var famelandData = res;
          console.log("收获结果",famelandData.msg)
          if(famelandData.code==1){
            Laya.Dialog.close(Scenes.harvestPrompt)
            //跳转到兑换中心
            Laya.Dialog.open(Scenes.Tip, false, {content:'水果已成功领取'});
            gameControl.I.houseClick();
            gameControl.I.getFameLandInfo()
          }
        },
        error:function(err){
          Laya.Dialog.open(Scenes.Tip, true, {content:err});
        }
      })
    }
}