import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import { secretKey, unique, decrypt, sendEvent, createImage, jewelSound, coinSoundClick } from "../units/units.js";
import Scenes from "../common/Scenes.js";
import Api from "../common/Api.js";
import MineCtrl from "../game/mine/MineCtrl.js";
import Data from "../common/Data.js";
import gameControl from "../game/gameControl.js";
import Adapt from "../common/Adapt.js";
import { alerttTip6, alerttTip7, showHandTip } from "../common/alertTipFuc.js";
import { report } from "../units/statReport.js";
export default class goldrushDialog extends Laya.Dialog {

  constructor() {
    super();
    goldrushDialog.I=this;
  }
  onEnable() {    
    this.adapt();
    this.closeOnSide = false;

    this.numZhMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    this.btnTypes = {
      buy: 'buy',
      upgrade: 'upgrade'
    }

    this.initList();
    this.updateMineCoinSpeed();

    this.canClick=true;
  }

  onOpened(){
    let param = this._param;
    let miners=param.miners;
    Data.commonPoint5=this.list.localToGlobal(new Laya.Point(0, 0));
    if(miners[1].level==0){
      let cell=this.list.getCell(2);
      let point=cell.localToGlobal(new Laya.Point(0, 0));
      Data.pointSize5 = {
        width:cell.width,
        height:cell.height,
        x:point.x,
        y:point.y,
      }
      if(Data.exp==60&&Data.plantStatus==1){
        alerttTip6()
      }
    }
  }

  adapt(){
    let ratio=Adapt.ratio;
    if(ratio<1){
      ratio+=0.1;
      this.boxContent.scale(ratio, ratio);
    }
  }

  updateMineCoinSpeed(){
    this.lblMineCoinSpeed.text = this._param.coinSpeed + '电力值/秒';
  }

  initList() {
    let param = this._param;
    let data = [];
    this.listData = data;
    data.push({ workerID: null });
    for(var i=0, len=param.miners.length; i<len; i++){
      data.push({ workerID: param.miners[i].workerID, index:i});
    }

    this.list.vScrollBarSkin = "";
    this.list.renderHandler = new Laya.Handler(this, this.updateItem);
    this.list.mouseHandler = new Laya.Handler(this, this.onCellClick);
    this.list.array = data;
  }

  updateItem(cell, index) {
    let cellData=cell.dataSource;
    let param = this._param, nextInfo;
    let imgIcon = cell.getChildByName("imgIcon");
    let lblName = cell.getChildByName("lblName");
    let lblInfo = cell.getChildByName("lblInfo");
    let btn = cell.getChildByName("btn");
    let imgCost = cell.getChildByName("imgCost");
    let lblCost = cell.getChildByName("lblCost");

    if (cellData.workerID == null) {
      let level=param.level;
      if(level>6) level=6;
      let iconIndex=Math.ceil(level/2);
      imgIcon.skin = `diggold/mine${iconIndex}-3.png`;
      imgIcon.size(85, 100);
      imgIcon.y = 116;
      lblName.text = this.numZhMap[param.level - 1] + '级矿场';
      lblName.fontSize=30;
      lblName.y=22;
      lblInfo.text = '每日电力上限: '+param.mineCoin+'\n进度条上限: ' + param.maxCoin;
      lblInfo.fontSize=22;
      lblInfo.leading=6;
      lblInfo.y=66;
      btn.label = '升级';
      if(param.mineLevelUpInfo.name)
        nextInfo = param.mineLevelUpInfo;
    } else {
      let data=param.miners[cellData.index];
      let workerInfo = data.isLockered ? data.minerLevelUpInfo : data;
      imgIcon.skin = 'diggold/worker-half' + workerInfo.level + '.png';
      imgIcon.size(86, 114);
      imgIcon.y = 128;
      lblName.text = workerInfo.name;
      lblInfo.text = '效率：' + workerInfo.coinSpeed + '电力值/秒';
      btn.label = data.isLockered ? '购买' : '升级';
      cell.skin=data.isLockered?'diggold/box2-2.png':'diggold/box2.png';
      nextInfo = data.minerLevelUpInfo;
      cellData.coinSpeed=workerInfo.coinSpeed;
      cellData.isLockered=data.isLockered;
      cellData.workerID=data.workerID;
    }

    if(nextInfo){
      imgCost.skin = nextInfo.jewelPrice ? 'diggold/icon-jewel.png' : 'diggold/icon-coin.png';
      lblCost.text = nextInfo.coinPrice || nextInfo.jewelPrice;
  
      cellData.costCoin=nextInfo.coinPrice;
      cellData.costJewel=nextInfo.jewelPrice;
 
      if(nextInfo.coinPrice && Data.coin<nextInfo.coinPrice || nextInfo.jewelPrice && Data.jewel<nextInfo.jewelPrice){
        btn.disabled=true;
      }else{
        btn.disabled=false;
      }
    }else{
      btn.visible=imgCost.visible=lblCost.visible=false;
    }
  }

  onCellClick(e, i) {
    if(!e){
      let dataSource=this.list.getCell(2).dataSource;
      e={type:Laya.Event.MOUSE_DOWN, target:{name:'btn'}, currentTarget:{dataSource:dataSource}};
      i=2;
    }
    if (e.type == Laya.Event.MOUSE_DOWN && e.target.name == 'btn') {
      if(!this.canClick) return;
      this.canClick=false;
      let cellData = e.currentTarget.dataSource;
      if(cellData.costCoin){
        Data.coin-=cellData.costCoin;
        gameControl.I.updateCoin();
        coinSoundClick();
      }else if(cellData.costJewel){
        Data.jewel-=cellData.costJewel;
        gameControl.I.updateJewel();
        jewelSound();
      }
      //计算当前有几个矿工
      
      let minersArr = [];
      let minersObj = this._param.miners;
      for(var j=0;j<minersObj.length;j++){
        if(minersObj[j].name!==null){
          minersArr.push(minersObj[j]);
        }
      }
      if (cellData.workerID == null) {
        var params = {
          action_type:'点击',
          content:'矿洞-矿洞升级',
          channel_name:'矿洞',
          content_id:'',
          content_cat:this._param.level,//矿洞等级
          content_cat_id:minersArr.length,//矿工数量
        }
        report(params);
        Api.mineLevelUp((data) => {
          this.onMineLevelUp(data);
        });
      } else {
        
        if (cellData.isLockered) {
          
          var params = {
            action_type:'点击',
            content:'矿洞-购买矿工',
            channel_name:'矿洞',
            content_id:'',
            content_cat:1,//矿工等级
            content_cat_id:minersArr.length,//矿工数量
          }
          report(params);
          Api.buyMiner((data) => {
            this.onBuyMiner(cellData.index, data);
          });
        } else {
          let minerLevel = this._param.miners[i-1].level;//当前矿工等级
          let workerID = cellData.workerID, rawCoinSpeed=cellData.coinSpeed;
          var params = {
            action_type:'点击',
            content:'矿洞-矿工升级',
            channel_name:'矿洞',
            content_id:'',
            content_cat:minerLevel,//矿工等级
            content_cat_id:minersArr.length,//矿工数量
          }
          report(params);
          Api.minerLevelUp(workerID, (data) => {
            this.onMinerLevelUp(cellData.index, workerID, rawCoinSpeed, data);
          });
        }
      }
    }
  }

  /**矿场升级 */
  onMineLevelUp(data) {
    this.canClick=true;
    MineCtrl.I.mineUpgrade(data);
    this._param=data;
    this.list.refresh();
  }

  /**购买矿工 */
  onBuyMiner(index, data) {
    this.canClick=true;
    this._param.miners[index]=data;
    this._param.coinSpeed+=data.coinSpeed;
    this.updateMineCoinSpeed();
    MineCtrl.I.addWorker(data.workerID, 1);
    this.list.refresh();
    /**关闭当前弹窗 */
    Laya.Dialog.close(Scenes.goldrushDialog);
    /**并且调起浇水引导 */
    if(Data.level==1){
      showHandTip(gameControl.I.owner);
      Data.buyMinerVal = true;
    }
  }

  /**矿工升级 */
  onMinerLevelUp(index, workerID, rawCoinSpeed, data) {
    this.canClick=true;
    this._param.miners[index]=data;
    this._param.coinSpeed+=(data.coinSpeed-rawCoinSpeed);
    this.updateMineCoinSpeed();
    MineCtrl.I.workerUpgrade(workerID);
    this.list.refresh();
  }

  onClosed(){
    goldrushDialog.I=null;
  }
}