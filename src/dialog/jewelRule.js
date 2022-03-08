import Scenes from "../common/Scenes";

export default class jewelRule extends Laya.Dialog {

    constructor() { 
      super(); 
    }
    onAwake(){
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      let arr = [{
          title:'钻石的用途？',
          answerArr:'\n• 购买矿工升级矿场，加速金币产出。 \n• 免费兑换KFC等商品。 \n• 抵扣部分商品的价格。',
          type:1,
        },{
          title:'如何获取钻石？',
          answerArr:'\n• 出售已经种好的水果。 \n• 商城成功下单，获得奖励。 \n• 农场等级升级，获得奖励。',
          type:1,
        }
      ]
      this.createRuleList(arr);
    }

    onDisable() {
    }
    closeClick(){
      Laya.Dialog.close(Scenes.jewelRule)
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
        cell.getChildByName("intro").y = 15;
        cell.getChildByName("intro").text = data.answerArr;
      }else{
        cell.getChildByName("introImg").visible = true;
        cell.getChildByName("intro").visible = false;
        cell.getChildByName("intro").y = 15;
        cell.getChildByName("introImg").skin = data.answerArr;
      }
    }
}