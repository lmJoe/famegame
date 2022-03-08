import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import gameAnimation from "../game/gameAnimation.js";
import { decrypt,secretKe,getRandomArrayElements, coinSoundClick } from "../units/units.js";
import Scenes from "../common/Scenes.js";
import goldAni from "../common/goldAni.js";
import Adapt from "../common/Adapt.js";
import gameControl from "../game/gameControl.js";
import Data from "../common/Data.js";
export default class Cardgame extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.adapt();
      this.startTime = 7;
      this.endTime = 7;
      this.getRadomList();
      // this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.startBtn.on(Laya.Event.MOUSE_DOWN,this,this.startBtnClick);
      this.card1.on(Laya.Event.MOUSE_DOWN,this,this.commonCardClick);
      this.card2.on(Laya.Event.MOUSE_DOWN,this,this.commonCardClick);
      this.card3.on(Laya.Event.MOUSE_DOWN,this,this.commonCardClick);
      this.backBtn.on(Laya.Event.MOUSE_DOWN,this,this.backBtnClick);
      
      Laya.timer.loop(1000,this,()=>{
        this.startTime = this.startTime-1;
        this.startBtn.text = '开始游戏（'+this.startTime+'s）';
        if(this.startTime<0){
          this.startBtnClick();
          Laya.timer.clearAll(this)
        }
      })
    }

    adapt(){
      let ratio=Adapt.ratio;
      if(ratio<1){
        this.imgBottomContent.scale(ratio, ratio);
        this.imgBottomContent.bottom*=ratio;
        this.boxContent.scale(ratio, ratio);
      }
    }

    /**开始游戏 */
    startBtnClick(){
      this.startBtn.visible = false;
      Laya.timer.clearAll(this)
      this.flipCard();
    }
    /**返回大转盘 */
    backBtnClick(){
      Laya.Dialog.open(Scenes.Spinwin);
    }
    flipCard(){
      Laya.Tween.to(this.card1, {scaleX:0}, 300, Laya.Ease.sineInOut);
      Laya.Tween.to(this.card2, {scaleX:0}, 300, Laya.Ease.sineInOut);
      Laya.Tween.to(this.card3, {scaleX:0}, 300, Laya.Ease.sineInOut);
      setTimeout(() => {
        this.card1.skin = 'cardgame/b1.png';
        this.card2.skin = 'cardgame/b1.png';
        this.card3.skin = 'cardgame/b1.png';
        this.slidingCardBefore();
      }, 300);
    }
    slidingCardBefore(){
      Laya.Tween.to(this.card1, {scaleX:1}, 300, Laya.Ease.sineInOut);
      Laya.Tween.to(this.card2, {scaleX:1}, 300, Laya.Ease.sineInOut);
      Laya.Tween.to(this.card3, {scaleX:1}, 300, Laya.Ease.sineInOut);
      setTimeout(() => {
        this.middleGetrandom();
      }, 500);
      
    }
    middleGetrandom(){
      var timer = parseInt(5000/this.cleanNum);
      for(var i=0;i<this.cleanNum;i++){
        setTimeout(() => {
          this.slidingCard(timer);
        }, timer*i);
      }
      setTimeout(() => {
        this.card1.mouseEnabled = true;
        this.card2.mouseEnabled = true;
        this.card3.mouseEnabled = true;
        this.gameStatus.text = '点击纸牌完成选择';
        this.npcText.text = '跟我玩比大小游戏吧，谁的牌大谁赢，如果你赢了给你200电力值。';
      }, 5000);
    }
    slidingCard(timer){
      this.gameStatus.visible = true;
      this.gameStatus.test = '洗牌中...';
      this.npcText.text = '我洗牌可是一流的，稍等片刻。';
      
      this.cardArr = [this.card1,this.card2,this.card3];
      var cardArrModel = getRandomArrayElements(this.cardArr,2);
      console.log("timer",timer)
      Laya.Tween.to(cardArrModel[0], {x:cardArrModel[1]._x}, timer, Laya.Ease.sineInOut);
      Laya.Tween.to(cardArrModel[1], {x:cardArrModel[0]._x}, timer, Laya.Ease.sineInOut);
      
    }
    getRadomList(){
      ajax({
        type: 'POST',
        url: URL.getRadomList,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            this.cleanNum = res.data.cleanNum;
            this.card1.skin = res.data.data[0].imgUrl;
            this.card1.name = res.data.data[0].id;
            this.card2.skin = res.data.data[1].imgUrl;
            this.card2.name = res.data.data[1].id;
            this.card3.skin = res.data.data[2].imgUrl;
            this.card3.name = res.data.data[2].id;
            this.card1Img = res.data.data[0].imgUrl;
            this.card2Img = res.data.data[1].imgUrl;
            this.card3Img = res.data.data[2].imgUrl;
            this.pools = [res.data.data[0].id,res.data.data[1].id,res.data.data[2].id];
            this.cardImgArr = [
              {
                id:res.data.data[0].id,
                imgUrl:res.data.data[0].imgUrl,
              },
              {
                id:res.data.data[1].id,
                imgUrl:res.data.data[1].imgUrl,
              },
              {
                id:res.data.data[2].id,
                imgUrl:res.data.data[2].imgUrl,
              }
            ]
          }

        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    commonCardClick(e){
      let target=e.target;
      this.card1.mouseEnabled = false;
      this.card2.mouseEnabled = false;
      this.card3.mouseEnabled = false;
      var id = target.name;
      var cardImgArr = this.cardImgArr;
      Laya.Tween.to(target, {scaleX:0}, 300, Laya.Ease.sineInOut,Laya.Handler.create(this, () =>{
        for(var i=0;i<cardImgArr.length;i++){
          if(id==cardImgArr[i].id){
            target.skin = cardImgArr[i].imgUrl;
            Laya.Tween.to(target, {scaleX:1}, 300, Laya.Ease.sineInOut);
          }
        }
      }));
      for(var i=0;i<this.cardArr.length;i++){
        if(id==this.cardArr[i].name){
          //系统随机翻出一张牌
          this.cardArr.splice(i,1)
          var sArr = getRandomArrayElements(this.cardArr,1);
          setTimeout(() => {
            Laya.Tween.to(sArr[0], {scaleX:0}, 300, Laya.Ease.sineInOut,Laya.Handler.create(this, () =>{
              for(var i=0;i<cardImgArr.length;i++){
                if(sArr[0].name==cardImgArr[i].id){
                  sArr[0].skin = cardImgArr[i].imgUrl;
                  Laya.Tween.to(sArr[0], {scaleX:1}, 300, Laya.Ease.sineInOut,Laya.Handler.create(this, () =>{
                    this.checkResult(id,sArr[0].name);
                  }));
                }
              }
            }));
          }, 1000);
        }
      }
    }
    checkResult(id,sId){
      ajax({
        type: 'POST',
        url: URL.checkResult,
        data:{
          pools:this.pools,
          id:id,
          sId:sId,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            Laya.timer.loop(1000,this,()=>{
              this.endTime = this.endTime-1;
              this.backBtn.visible = true;
              this.backBtn.text = '返回（'+this.endTime+'s）';
              console.log('返回（'+this.endTime+'s）');
              if(this.endTime==0){
                Laya.timer.clearAll(this)
                //返回
                this.backBtnClick()
              }
              
            })
            if(res.data>0){
              goldAni.goldAniFuc(res.data);
              coinSoundClick()
              this.gameStatus.visible = false;
              this.npcText.text = '呜呜呜，我又输了。下次我一定要赢回来！';
              Data.coin+=res.data;
              gameControl.I.updateCoin();
            }else{
              this.title.visible = true;
              this.gameStatus.text = '就差这么一点点就赢了';
              this.npcText.text = '输赢很正常啦！下次可要加油哦~';
            }
 
          }

        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }

    onClosed(){
      Laya.timer.clearAll(this);
    }
}
