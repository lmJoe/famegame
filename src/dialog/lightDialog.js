import Adapt from "../common/Adapt";
import Scenes from "../common/Scenes";
import { dateChangeFormat, getRemainderTime, playSoundClick, setCookie } from "../units/units";
export default class lightDialog extends Laya.Dialog {
    constructor() { 
        super(); 
    }
    adapt(){
      let ratio=Adapt.ratio;
      if(ratio<1){
        this.boxContent.scale(ratio, ratio);
      }
    }
    onEnable() {
      this.adapt();
      this.lightBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      var plantMsg = this._param.plantMsg;
      var result = plantMsg.resources;
      //获取开始锁定时间
      var startTime = dateChangeFormat('YYYY-mm-dd HH:MM:SS',plantMsg.lockStartTime);//开始锁定时间
      //获取结束锁定时间
      var endTime = dateChangeFormat('YYYY-mm-dd HH:MM:SS',plantMsg.lockerTime);//结束锁定时间
      //计算中间需要锁定多长时间
      var needTime = getRemainderTime(startTime,endTime);
      this.lightMsg.text = '光照'+needTime+'，则可收获水果';
      for(var i=0;i<result.length;i++){
        if(result[i].resCode === 'p_8'){
          this.fruitImg.skin = plantMsg.resources[i].dataValue;
        }
      }
    }

    onDisable() {
    }
    closeClick(){
      playSoundClick()
      Laya.Dialog.close(Scenes.lightDialog)
    }
}