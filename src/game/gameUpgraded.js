export default class gameUpgraded extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:adBtn, tips:"看广告领电力值", type:Node, default:null}*/
        let adBtn = true;
        /** @prop {name:close, tips:"关闭", type:Node, default:null}*/
        let close = true;
        /** @prop {name:bmhGold, tips:"电力值", type:Node, default:null}*/
        let bmhGold = true;
    }
    
    onEnable() {

    }
    onStart(){
      this.adBtn.on(Laya.Event.MOUSE_DOWN,this,this.adBtnClick);
      this.close.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
    }
    onAwake(){
      //获取当前弹窗中的电力值图片元素做动画效果
      console.log(this.bmhGold);
      Laya.Tween.to(this.bmhGold,{
        scaleX: 1.4,
        scaleY: 1.4
      },250,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
        //添加动画效果 动画完成后执行Handler处理器的方法
          this.bmhGold.on(Laya.Event.COMPLETE,this,this.hotAirBalloon);
      }))

    }
    onDisable() {
    }
    closeClick(){
      playSoundClick()
      console.log("关闭");
      console.log(this.owner.parent);
      this.owner.parent.removeChild(this.owner);
    }
    adBtnClick(){
      playSoundClick()
      console.log("看广告领取电力值");
    }
}