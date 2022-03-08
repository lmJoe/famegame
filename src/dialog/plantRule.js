import Scenes from "../common/Scenes";
import { createLabel } from "../units/units";

export default class plantRule extends Laya.Dialog {

    constructor() { 
      super(); 
    }
    onAwake(){
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      let arr = [{
          title:'什么是农场等级?',
          answerArr:'农场主等级越高，土地越肥沃，每次浇 水成长值越高。',
          type:1,
        },{
          title:'农场等级与成长倍数之间关系?',
          answerArr:'rule/tb1.png',
          type:2,
        }
        ,{
          title:'如何提升农场等级?',
          answerArr:'玩家每次成功浇水，会获得成长经验， 当成长经验达到一定值后，则可以升级。',
          type:1,
        },{
          title:'升级奖励有哪些?',
          answerArr:'每次升级会奖励金币、钻石、高级道具等',
          type:1,
        }
      ]
      this.createRuleList(arr);
    }

    onDisable() {
    }
    closeClick(){
      Laya.Dialog.close(Scenes.plantRule)
    }
    createRuleList(Arr){
      Laya.loader.load('prefab/textareaBox.prefab', Laya.Handler.create(this, (prefab)=>{
        for(var i in Arr){
          let textareaItem=Laya.Pool.getItemByCreateFun('textareaItem', prefab.create, prefab);
          this.itemBox.addChild(textareaItem);
          this.updateItem(textareaItem, Arr[i]);
        }
        this.itemBox.on(Laya.Event.MOUSE_UP, this, this.onCellClick)
      }))
    }
    onCellClick(e,i){

    }
    updateItem(cell, data){
      cell.getChildByName("title").text = data.title;
      if(data.type==1){
        cell.getChildByName("introImg").visible = false;
        cell.getChildByName("intro").visible = true;
        cell.getChildByName("intro").y = 43;
        cell.getChildByName("intro").text = data.answerArr;
      }else{
        cell.getChildByName("introImg").visible = true;
        cell.getChildByName("intro").visible = false;
        cell.getChildByName("intro").y = 43;
        cell.getChildByName("introImg").skin = data.answerArr;
      }
      
    }
}