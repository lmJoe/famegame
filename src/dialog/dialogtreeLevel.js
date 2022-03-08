import {playSoundClick} from "../units/units.js";
import Scenes from "../common/Scenes.js"
import Adapt from "../common/Adapt.js";
var clickNum = 0;
export default class dialogtreeLevel extends Laya.Dialog {
    adapt(){
      let ratio=Adapt.ratio;
      if(ratio<1){
        this.boxContent.scale(ratio, ratio);
      }
    }

    onEnable() {
      this.adapt();
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.growBtn.on(Laya.Event.MOUSE_DOWN,this,this.growBtnClick);
      this.treeLevel2.on(Laya.Event.MOUSE_DOWN,this,this.treeLevel2Click);
      var PlantInfo = this._param.data;
      var processStepIndex = PlantInfo.processStepIndex;
      var status = PlantInfo.status;
      var resources = PlantInfo.resources;
      var progressValue = Math.floor(PlantInfo.processPercent)
      for(var i=0;i<resources.length;i++){
        if('p_'+processStepIndex === resources[i].resCode){
          this.fruitBoxImg.skin = resources[0].dataValue;
          if(status==3){
            this.leftImg.skin = resources[processStepIndex].dataValue;
            this.leftMsg.text = resources[processStepIndex].name;
            this.rightImg.skin = resources[processStepIndex+1].dataValue;
            this.rightMsg.text = resources[processStepIndex+1].name;
            this.rightImg.skin = resources[processStepIndex+1].dataValue;
            this.progressValue.text = 100 +'%';
            this.progressBox.value = 1;
          }else{
            if(status==1&&processStepIndex==9){
              this.rightImg.skin = resources[12].dataValue;
              this.rightImg.size(160, 140);
              // this.rightMsg.text = '收获水果';
              this.rightMsg.text = resources[11].name;
            }else{
              this.rightImg.skin = resources[processStepIndex+2].dataValue;
              this.rightMsg.text = resources[processStepIndex+2].name;
            }
            this.leftImg.skin = resources[processStepIndex+1].dataValue;
            this.leftMsg.text = resources[processStepIndex+1].name;
            this.progressValue.text = progressValue +'%';
            this.progressBox.value = progressValue*0.01;
          }
          
        }
      }
    }
    growBtnClick(){
      playSoundClick();
      Laya.Dialog.close(Scenes.treeLevelDialog);
    }
}