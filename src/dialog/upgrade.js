import Scenes from "../common/Scenes";

export default class upgrade extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      Laya.timer.frameLoop(1, this, function(){
        this.bgImg.rotation += 2;
      });
      setTimeout(() => {
        Laya.Dialog.close(Scenes.upgrade)
      }, 1000);
    }

    onDisable() {
    }
    closeBtnClick(){
      // Laya.Dialog.close(Scenes.upgrade)
    }
}