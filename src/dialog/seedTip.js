import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import { clearCookie, playSoundClick, setCookie } from "../units/units";

export default class seedTip extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.fruitmsg = this._param.content;
      this.fruitImg.skin = this.fruitmsg.rescodes;
      this.seedTextTip.text = '您当前选择种植水果为'+this.fruitmsg.name+', 在种植过程中不可以随意切换新水果。'
      this.closeBtn.on(Laya.Event.MOUSE_DOWN, this, this.closeBtnClick);
      // this.noTipBtn.on(Laya.Event.MOUSE_DOWN, this, this.noTipBtnClick);
      this.shureBtn.on(Laya.Event.MOUSE_DOWN, this, this.shureBtnClick);
      this.shureIcon = this.noTipBtn.getChildByName("duigou");
    }

    onDisable() {
    }
    /**关闭当前弹窗并开始种植 */
    closeBtnClick(){
      playSoundClick()
      Laya.Dialog.close(Scenes.seedTip);
    }
    shureBtnClick(){
      //开始种树
      gameControl.I.operSeedFun(this.fruitmsg.plid);
      playSoundClick()
      Laya.Dialog.close(Scenes.seedTip);
    }
    noTipBtnClick(){
      if(this.shureIcon.visible==true){
        setCookie("noSeedTip",1)
        this.shureIcon.visible=false;
      }else if(this.shureIcon.visible==false){
        clearCookie("noSeedTip")
        this.shureIcon.visible=true;
      }
    }
}