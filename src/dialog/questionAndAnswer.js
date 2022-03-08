import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import Scenes from "../common/Scenes.js"
import {createSprite,createImage,createText,createLabel,someDaySomeTime,unique,playSoundClick,createButton, coinSoundClick} from "../units/units.js";
import gameAnimation from "../game/gameAnimation.js";
import goldAni from "../common/goldAni.js";
import Data from "../common/Data.js";
import gameControl from "../game/gameControl.js";

export default class questionAndAnswer extends Laya.Dialog {

    constructor() { 
        super(); 

    }
    
    onEnable() {
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.answerFlag = true;
      this.sureCode = 0,
      this.secondCode =8;
      this.issue = {};
      this.getQa();
      this.q1.on(Laya.Event.MOUSE_DOWN,this,this.getAnswer,[1]);
      this.q2.on(Laya.Event.MOUSE_DOWN,this,this.getAnswer,[2]);
      this.q3.on(Laya.Event.MOUSE_DOWN,this,this.getAnswer,[3]);
      this.second.on(Laya.Event.MOUSE_DOWN,this,this.backpage);
    }

    onDisable() {
    }
    q1click(index){
        alert(index);
    }
    getQa(){
        ajax({
            type: 'POST',
            url: URL.getInfo,
            data:{},
            dataType:'json',
            // contentType:'application/json',
            async: true,
            success:(res)=>{
              if (res.code == 1) {
                console.log("Res",res);
                this.answerid = res.data.id;
                this.issue = {
                    title: res.data.qText,
                    items: res.data.aTexts,
                    id: res.data.id,
                    coin: res.data.coin,
                  };
                var aTexts = res.data.aTexts;
                this.q1.label = aTexts[0]
                this.q2.label = aTexts[1]
                this.bottomtip.text = '回答正确即可获得'+res.data.coin
                this.coin = res.data.coin;
                if(aTexts[2]){
                    this.q3.label = aTexts[2]
                }else{
                    this.q3.visible = false;

                }
                this.message.text = res.data.qText
              }
    
            },
            error:function(){
              //失败后执行的代码
              console.log('请求失败');
            }
          })
    }
    changeskin(index,sureindex){
        if(sureindex==1){
            this.q1.skin='questionAndAnswer/success.png';
            this.q1icon.skin='questionAndAnswer/gou.png';
            this.q1icon.visible = true;
        }
        if(sureindex==2){
            this.q2.skin='questionAndAnswer/success.png';
            this.q2icon.skin='questionAndAnswer/gou.png';
            this.q2icon.visible = true;
        }
        if(sureindex==3){
            this.q3.skin='questionAndAnswer/success.png';
            this.q3icon.skin='questionAndAnswer/gou.png';
            this.q3icon.visible = true;
        }
        if(index!=sureindex){
            if(index==1){
                this.q1.skin='questionAndAnswer/fail.png';
                this.q1icon.skin='questionAndAnswer/cha.png';
                this.q1icon.visible = true;
            }
            if(index==2){
                this.q2.skin='questionAndAnswer/fail.png';
                this.q2icon.skin='questionAndAnswer/cha.png';
                this.q2icon.visible = true;
            }
            if(index==3){
                this.q3.skin='questionAndAnswer/fail.png';
                this.q3icon.skin='questionAndAnswer/cha.png';
                this.q3icon.visible = true;

            }   
        }
    }
    backpage(){
        Laya.Dialog.close(Scenes.questionAndAnswer);
        Laya.Dialog.open(Scenes.Spinwin,false);
    }
    getAnswer(index) {
        // code: 1--点击答案   2--过时间
        let that = this;
        if (that.answerFlag) {
          var param = {
            qaId: Number(that.issue.id), //	T文本	是	问题id
            no: index, //	T文本	是	序号 1，2，3
          };
          ajax({
            type: 'POST',
            url: URL.checkA,
            data:param,
            dataType:'json',
            // contentType:'application/json',
            async: true,
            success:(res)=>{
              that.answerFlag = false;
  
              if (res.code == 1) {
                that.sureCode = res.data;
                that.changeskin(index,res.data);
                // 确定状态
                if (res.data == index) {
                  Data.coin+=Number(this.coin);
                  gameControl.I.updateCoin();
                  goldAni.goldAniFuc(this.coin);
                  coinSoundClick()

                }
                that.secondCode = 8;

                this.back.visible = true;
                this.second.visible = true;
                this.bottomtip.visible = false;
                this.coinicon.visible = false;
                this.lasttip.visible = false;
                // 倒计时的效果
                var timer = Laya.timer.loop(1000, this, ()=>{
                  that.second.text = '返回  '+that.secondCode+'s';
                  if (that.secondCode == 0) {
                    Laya.Dialog.close(Scenes.questionAndAnswer);
                    Laya.Dialog.open(Scenes.Spinwin,false);
                    clearInterval(timer);
                  } else {
                    that.secondCode--;
                  }
                })
              }
            },
            error:function(){
              //失败后执行的代码
              console.log('请求失败');
            }
          })
        //   var param1 = that.qs.stringify(param); //form-data的形式
          // var param1 = JSON.parse(JSON.stringify(param));
        }
      }

      onClosed(){
        Laya.timer.clearAll(this);
      }
}