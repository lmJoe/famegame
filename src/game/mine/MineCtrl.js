
import { alerttTip5, showHandTip } from "../../common/alertTipFuc";
import Api from "../../common/Api";
import Data from "../../common/Data";
import goldAni from "../../common/goldAni";
import Scenes from "../../common/Scenes";
import Toast from "../../common/Toast";
import Util from "../../common/Util";
import { report } from "../../units/statReport";
import { clearCookie, coinSoundClick, getCookie, playSoundClick } from "../../units/units";
import gameControl from "../gameControl";
import MineWorkerCtrl from "./MineWorkerCtrl";

export default class MineCtrl extends Laya.Script{
    onAwake(){
        MineCtrl.I=this;
        this.progressBar=this.owner.getChildByName('progressBar');
        this.mineBar=this.owner.getChildByName('mineBar');
        this.btnDetail=this.mineBar.getChildByName('btnDetail');
        this.imgProgressCoin=this.progressBar.getChildByName('imgProgressCoin');
        this.lblCoin=this.progressBar.getChildByName('lblCoin');
        this.imgMine=this.owner.getChildByName('imgMine');
        this.imgMineOut=this.owner.getChildByName('imgMineOut');
        this.spRedPoint=this.btnDetail.getChildByName('spRedPoint');

        this.progressBar.visible=this.mineBar.visible=false;

        this.workersPosInfo=[
            {x:-70, y:180, dir:1},
            {x:-62, y:220, dir:1},
            {x:140, y:200, dir:-1},
            {x:110, y:240, dir:-1},
            {x:180, y:230, dir:-1},
        ];
        this.workerCtrls=[];

        this.configData=null;

        this.isWorking=false;
        Data.commonPoint4=this.mineBar.localToGlobal(new Laya.Point(0, 0));//招募工人按钮
        Data.pointSize4 = {
          width:this.mineBar._width,
          height:this.mineBar._height,
        }
        this.canCollectCoin=true;
    }

    init(){
        Api.getMineInfo(this.onGotMineInfo.bind(this));
    }

    onGotMineInfo(data){
        this.owner.on(Laya.Event.MOUSE_DOWN, this, this.onCollectCoin);
        this.mineBar.on(Laya.Event.MOUSE_DOWN, this, this.onMineBar);
        this.btnDetail.on(Laya.Event.MOUSE_DOWN, this, this.showDetail);

        this.configData=data;

        this.progressBar.visible=this.mineBar.visible=true;
        let miners=data.miners;
        for(var i=0, len=miners.length; i<len; i++){
            let miner=miners[i];
            if(!miner.isLockered)
                this.addWorker(miner.workerID, miner.level);
        }

        this.setProgresss(data.Coin, data.maxCoin);
        this.startTimer();
        this.checkShowRedPoint();
    }

    startTimer(){
        Laya.timer.loop(1000, this, this.onTime)
    }

    onTime(){
        if(this.isCanWork()){
            if(!this.isWorking){
                this.startWork(true);
            }
            let speed=this.configData.coinSpeed;
            this.configData.Coin+=speed;
            if(this.configData.Coin>this.configData.maxCoin){
                this.configData.Coin=this.configData.maxCoin;
            }
            this.configData.mineLeftCoin-=speed;
            if(this.configData.mineLeftCoin<0){
                this.configData.Coin+=this.configData.mineLeftCoin;
                this.configData.mineLeftCoin=0;
            }
            this.setProgresss(this.configData.Coin, this.configData.maxCoin);
        }else if(this.isWorking){
            this.startWork(false);
        }
    }

    /**添加矿工 */
    addWorker(workerID, level){
        let index=this.workerCtrls.length;
        let worker=new Laya.Box();
        let posInfo=this.workersPosInfo[index];
        worker.pos(posInfo.x, posInfo.y)
        worker.scaleX=posInfo.dir;
        this.owner.addChild(worker);
        
        let ctrl=worker.addComponent(MineWorkerCtrl);
        ctrl.init(workerID, level, this.imgProgressCoin);
        this.workerCtrls.push(ctrl);

        if(this.isCanWork()){
            this.isWorking=true;
            ctrl.playWork();
        }else{
            this.isWorking=false;
            ctrl.playIdle();
        }
        this.setPortrait(index, level);
    }

    isCanWork(){
        return this.configData.Coin<this.configData.maxCoin && this.configData.mineLeftCoin>0;
    }

    /**收取金币 */
    onCollectCoin(){
      if(this.configData.Coin<=0 && this.configData.mineLeftCoin<=0){
          Toast.show('今日矿已挖完，请明日再来！');
          return;
      }
      if(!this.canCollectCoin || this.configData.Coin<=0) return;
      this.canCollectCoin=false;
      Api.harvest((data)=>{
          this.canCollectCoin=true;
          let gotCoinNum=Math.floor(data.Coin);
          if(Data.exp==60&&Data.plantStatus==1&&getCookie("alertTipNum")==5){
            alerttTip5()
            clearCookie("alertTipNum");
          }
          Data.coin+=gotCoinNum;
          goldAni.goldAniFuc(gotCoinNum);
          coinSoundClick();
          gameControl.I.updateCoin();
          this.configData.Coin=0;
          this.configData.maxCoin=data.maxCoin;
          this.configData.mineLeftCoin=data.mineLeftCoin;
          this.setProgresss(0, this.configData.maxCoin);
          if(Data.coin>60&&Data.level==1&&this.workerCtrls.length>1){
            showHandTip(gameControl.I.owner);
          }
      });
      var params = {
        action_type:'点击',
        content:'矿洞',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }

    /**点击小横条禁止触发收金币 */
    onMineBar(e){
        e.stopPropagation();
    }

    /**显示购买升级弹窗 */
    showDetail(){
        playSoundClick();
        Laya.Dialog.open(Scenes.goldrushDialog, true, this.configData);
        var params = {
          action_type:'点击',
          content:'矿洞-矿工加号',
          channel_name:'矿洞',
          content_id:'',
          content_cat:'',//矿工等级
          content_cat_id:'',//矿工数量
        }
        report(params);
    }

    setProgresss(num, max){
        this.lblCoin.text=Math.floor(num);
        let percent=num/max;
        // this.progressBar.value=percent;
        Laya.Tween.to( this.progressBar, {value:percent}, 500, Laya.Ease.sineInOut);
        let remainPercent=this.configData.mineLeftCoin/this.configData.mineCoin*100;
        if(remainPercent>0){
            let level=this.configData.level;
            if(level>6) level=6;
            let index=Math.ceil(level/2);
            if(remainPercent>=75){
                this.imgMine.skin=`diggold/mine${index}-3.png`;
            }else if(remainPercent>=50){
                this.imgMine.skin=`diggold/mine${index}-2.png`;
            }else if(remainPercent>=25){
                this.imgMine.skin=`diggold/mine${index}-1.png`;
            }else{
                this.imgMine.skin=`diggold/mine-none.png`;
            }
            this.imgMineOut.skin=`diggold/mine-out${index}.png`;
        }else{
            this.imgMine.skin=`diggold/mine-none.png`;
            this.imgMineOut.skin='';
            this.startWork(false);
        }

        if(percent>=0.25){
            if(!this.spHand && Data.exp>60){
                this.showHandTip();
            }
        }else{
            if(this.spHand){
                Util.removeHandTip(this.spHand);
                this.spHand=null;
            }    
        }
    }

    startWork(isWork=true){
        this.isWorking=isWork;
        for(var i in this.workerCtrls){
            var ctrl=this.workerCtrls[i];
            isWork?ctrl.playWork():ctrl.playIdle();
        }
    }

    /**矿场升级 */
    mineUpgrade(data){
        this.configData=data;
        this.setProgresss(data.Coin, data.maxCoin);
        this.checkShowRedPoint();
    }

    /**矿工升级 */
    workerUpgrade(workerID){
        for(var i in this.workerCtrls){
            var ctrl=this.workerCtrls[i];
            if(ctrl.workerID==workerID){
                let level=ctrl.level+1;
                ctrl.setLevel(level);
                this.setPortrait(Number(i), level);
                break;
            }
        }
        this.checkShowRedPoint();
    }

    /**设置小横条上的小头像 */
    setPortrait(index, level){
        this.mineBar.getChildByName('portrait'+(index+1)).skin='diggold/worker-portrait'+level+'.png';
    }

    /**是否显示小红点 */
    checkShowRedPoint(){
        let isShow=false;
        if(this.configData.mineLevelUpInfo.name) isShow=true;
        else{
            let miners=this.configData.miners;
            for(var i in miners){
                var miner=miners[i];
                if(miner.minerLevelUpInfo){
                    isShow=true;
                    break;
                }
            }
        }
        this.spRedPoint.visible=isShow;
    }

    showHandTip(){
        let spHand=Util.showHandTip();
        this.owner.addChild(spHand);
        spHand.pos(100, 150)
        spHand.tlMove.play(0, true);
        this.spHand=spHand;
    }
}