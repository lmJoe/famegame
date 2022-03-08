import { alerttTip2 } from "../common/alertTipFuc";
import Data from "../common/Data";
import RequestLoading from "../common/RequestLoading";
import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import { clearCookie, dateChangeFormat, Djs_timeList, getCookie, playSoundClick, setCookie } from "../units/units";
import URL from "../units/url";
var exChangeTime;//倒计时变量
export default class exchangeCenter extends Laya.Dialog {

    constructor() { 
      super(); 
      exchangeCenter.I = this;
    }
    onEnable() {
      RequestLoading.show();
      this.leftBtn.on(Laya.Event.MOUSE_DOWN,this,this.leftBtnClick);
      this.rightBtn.on(Laya.Event.MOUSE_DOWN,this,this.rightBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.rightexchangeMsg.on(Laya.Event.MOUSE_DOWN,this,this.rightexchangeMsgClick);
      if(Data.selectNum==1){
        this.leftexchangeMsg.visible = false;
        this.exChangeImg.visible = false;
        this.rightexchangeMsg.visible = false;
      }
      this.parentsHeight = this._parent._parent._height;
      this.exChangeCenterBoxHeight = this.exChangeCenterBox._height;
      Laya.Tween.to(this.exChangeCenterBox,{
        x:0,
        y:this.parentsHeight-this.exChangeCenterBoxHeight,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
        if(Data.exp==0&&Data.plantStatus==0){
          Data.commonPoint2 = this.fruitList.localToGlobal(new Laya.Point(0, 0));//获取种子位置
          alerttTip2()
        }
　　  },null,true));
      this.getChangePackage();
      this.getExchangeList();
      if(Data.exp>60&&Data.plantStatus==1){
        this.showTip();
      }
    }

    showTip(){
      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      let day=date.getDate();
      let startDate=new Date(year+'/1/25'), endDate=new Date(year+'/2/9');
      let tag='isShowExchangeTip', value=month+''+day;
      if(date>=startDate && date<=endDate && localStorage.getItem(tag)!=value){
        localStorage.setItem(tag, value);
        Laya.Dialog.open(Scenes.StopExchangeTip, false);
      }
    }

    onGotData(){
      RequestLoading.hide();
    }
    closeBtnClick(){
      playSoundClick()
      clearInterval(exChangeTime)
      Laya.Tween.to(this.exChangeCenterBox,{
        x:0,
        y:this.parentsHeight+8,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
        Data.selectNum = 0;
        Laya.Dialog.close(Scenes.exchangeCenter);
        clearInterval(this.djsfruitTime)
　　  },null,true));
    }
    leftBtnClick(){
      this.exchangeList.visible = false;
      this.rightBtn.selected = false;
      this.leftexchangeMsg.visible = false;
      this.exChangeImg.visible = false;
      this.rightexchangeMsg.visible = false;
      this.leftBtn.selected = true;
      this.fruitList.visible = true;
    }
    rightBtnClick(){
      this.leftBtn.selected = false;
      this.fruitList.visible = false;
      this.exChangeImg.visible = true;
      this.leftexchangeMsg.visible = true;
      this.rightexchangeMsg.visible = true;
      this.rightBtn.selected = true;
      this.exchangeList.visible = true;
      Laya.Dialog.close(Scenes.alerttTip);
    }
    /**获取我的水果 */
    getChangePackage(){
      ajax({
        type: 'POST',
        url: URL.getChangePackage,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var backpackData = response;
          console.log("兑换中心左侧内容",backpackData);
          if(backpackData.code==1){
            this.onGotData()
            var packInfoList = backpackData.data;
            this.currentDataList = packInfoList;
            for(var i=0;i<packInfoList.length;i++){
              if(packInfoList[i].isLocked==0&&packInfoList[i].isGrowing==1){
                this.growIngFruitName = packInfoList[i].name;//获取正在种植的种子
              }
            }
            var seedData = getCookie("seedStatus");
            if(seedData==1){
              this.leftBtn.selected = true;
              this.rightBtn.selected = false;
              this.fruitList.visible = true;
              this.exchangeList.visible = false;
              clearCookie("seedStatus");
            }else{
              this.leftBtn.selected = false;
              this.rightBtn.selected = true;
              this.fruitList.visible = false;
              this.exchangeList.visible = true;
            }
            this.createGoldRushList(packInfoList);
          }else{
            Laya.Dialog.open(Scenes.Tip,false,{content:backpackData.msg})
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**获取兑换动态 */
    getExchangeList(){
      ajax({
        type: 'POST',
        url: URL.getExchangeList,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var exChangeData = response;
          if(exChangeData.code==1){
            this.onGotData()
            console.log("兑换中心右侧内容",exChangeData);
            if(exChangeData.data.exchangeItemsNow[0].hour==6){
              this.shopTime=12
            }else if(exChangeData.data.exchangeItemsNow[0].hour==12){
              this.shopTime=20
            }else if(exChangeData.data.exchangeItemsNow[0].hour==20){
              this.shopTime=6
            }
            // window.djsTime =this.DJS_foo(this.shopTime);
            this.createGoldRushList1(exChangeData.data.exchangeItemsNow);
          }else{
            alert(exChangeData.msg)
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**创建我的水果列表 */
    createGoldRushList(Arr){
      // 使用但隐藏滚动条
      this.fruitList.vScrollBarSkin = "";
      this.fruitList.selectEnable = true;
      this.fruitList.mouseHandler = new Laya.Handler(this, this.onSelect);
      this.fruitList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.fruitList.array = Arr;
    }
    updateItem(cell, index) {
      cell.getChildByName("fruitImg").skin = cell.dataSource.rescodes;
      cell.getChildByName("fruitTitle").text = cell.dataSource.name;
      //isLocked 0未锁定 1被锁定
      switch (cell.dataSource.isLocked) {
        case 0:
          cell.getChildByName("locked").visible = false;
          cell.getChildByName("unlockMsg").visible = true;
          cell.getChildByName("unockImg").visible = true;
          cell.getChildByName("unockImg").skin = cell.dataSource.unLockerFilters[0];
          if(cell.dataSource.isGrowing==0){
            cell.getChildByName("bydjMsg").text = '去种植';
            cell.getChildByName("bydj").visible = true;
            cell.getChildByName("unlockMsg").visible = false;
            cell.getChildByName("unockImg").visible = false;
            
          }else{
            cell.getChildByName("bydjMsg").visible = false;
            cell.getChildByName("bydj").visible = false;
            cell.getChildByName("unlockMsg").x = 22;
            cell.getChildByName("unlockMsg").text = '种植进度：'+Math.floor(cell.dataSource.percent)+'%';
            cell.getChildByName("unockImg").visible = false;
          }
          break;
        case 1:
          cell.getChildByName("locked").visible = true;
          cell.getChildByName("bydjMsg").visible = false;
          cell.getChildByName("bydj").visible = false;
          cell.getChildByName("unlockMsg").visible = true;
          cell.getChildByName("unockImg").visible = true;
          cell.getChildByName("unockImg").skin = cell.dataSource.unLockerFilters[0];

          break;
      }
      
    }
    onSelect(e,index) {
      if(e){
        var dataSource = e.currentTarget.dataSource;
        // if (e.type == Laya.Event.MOUSE_DOWN&&e.target.name == 'fruitBoxBg') {
          
        // }
        if (e.type == Laya.Event.MOUSE_DOWN) {
          if(dataSource.isLocked==0){
            //isLocked 0未锁定 1锁定
            Laya.Dialog.open(Scenes.seedTip,false,{content:dataSource});
            Data.selectNum = 0;
            Laya.Dialog.close(Scenes.exchangeCenter);
          }else{
            if(index>0){
              Laya.Dialog.open(Scenes.Tip,false,{content:"种植完"+this.fruitList.getCell(index-1).name+"即可解锁该水果"})
            }
          }
        }
      }else{
        let cell=this.fruitList.getCell(0);
        Laya.Dialog.open(Scenes.seedTip,false,{content:cell.dataSource});
        Data.selectNum = 0;
        Laya.Dialog.close(Scenes.exchangeCenter);
      }
    }
    /**创建兑换动态 */
    createGoldRushList1(Arr){
      // 使用但隐藏滚动条
      this.exchangeList.vScrollBarSkin = "";
      this.exchangeList.selectEnable = true;
      this.exchangeList.mouseHandler = new Laya.Handler(this, this.onSelect1);
      this.exchangeList.renderHandler = new Laya.Handler(this, this.updateItem1);
      this.exchangeList.array = Arr;
      this.exchangeList.repeatY=Arr.length;
    }
    updateItem1(cell, index) {
      if(cell.dataSource.hour==6){
        this.leftexchangeMsg.text = '6:00抢兑中'
        this.rightexchangeMsg.text = '12:00即将抢兑'
      }else if(cell.dataSource.hour==12){
        this.leftexchangeMsg.text = '12:00抢兑中'
        this.rightexchangeMsg.text = '20:00即将抢兑'
      }else if(cell.dataSource.hour==20){
        this.leftexchangeMsg.text = '20:00抢兑中'
        this.rightexchangeMsg.text = '6:00即将抢兑'
      }
      this.djsfruitTime = setInterval(() => {
        var djsTime = this.DJS_foo(this.shopTime);
        cell.getChildByName("nextTime").text = djsTime;
      }, 1000);
      cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
      cell.getChildByName("listTitle").text = cell.dataSource.name;
      if(cell.dataSource.hour==6){
        cell.getChildByName("listTimeNum").text = '12点放出数量：'+cell.dataSource.itemCount;
      }else if(cell.dataSource.hour==12){
        cell.getChildByName("listTimeNum").text = '20点放出数量：'+cell.dataSource.itemCount;
      }else{
        cell.getChildByName("listTimeNum").text = '6点放出数量：'+cell.dataSource.itemCount;
      }
      if(cell.dataSource.itemType==5){
        cell.getChildByName("jewelIcon").visible = true;
        cell.getChildByName("jewelNum").visible = true;
        if((cell.dataSource.leftNumber>0)&&(Data.jewel>=cell.dataSource.currencyNum)){//商品剩余量大于0，钻石足够兑换
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = false;//倒计时
          cell.getChildByName("nextText").visible = false;
          cell.getChildByName("statusImg").skin = 'comp/box18.png';
          cell.getChildByName("surplus").text = '库存数量：'+ cell.dataSource.leftNumber;
          cell.getChildByName("surplus").color = '#ffffff';
          cell.getChildByName("surplus").visible = true;
          cell.getChildByName("noExchange").visible =  true;
          cell.getChildByName("noExchange").text = '去兑换';
          cell.getChildByName("noExchange").color = '#7A4516';
          cell.getChildByName("nohave").visible =  false;
          cell.getChildByName("jewelNum").text = cell.dataSource.currencyNum;
        }else if((cell.dataSource.leftNumber>0)&&(Data.jewel<cell.dataSource.currencyNum)){//商品剩余量大于0，钻石不够兑换
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = false;
          cell.getChildByName("nextText").visible = false;
          cell.getChildByName("statusImg").skin = 'comp/box19.png';
          cell.getChildByName("surplus").text = '库存数量：'+ cell.dataSource.leftNumber;
          cell.getChildByName("surplus").color = '#333333';
          cell.getChildByName("surplus").visible = true;
          cell.getChildByName("noExchange").visible =  true;
          cell.getChildByName("noExchange").text =  '去兑换';
          cell.getChildByName("noExchange").color = '#ffffff';
          cell.getChildByName("nohave").visible =  false;
          
          cell.getChildByName("jewelNum").text = cell.dataSource.currencyNum;
          cell.getChildByName("jewelNum").color = '#ffffff';
        }else if(cell.dataSource.leftNumber==0){//商品剩余量等于0，不管钻石够不够用
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = true;
          cell.getChildByName("nextText").visible = true;
          cell.getChildByName("statusImg").skin = 'comp/box19.png';
          cell.getChildByName("surplus").visible = false;
          cell.getChildByName("noExchange").visible =  false;
          cell.getChildByName("nohave").visible =  true;
          cell.getChildByName("nohave").color = '#ffffff';
          cell.getChildByName("jewelIcon").visible = false;
          cell.getChildByName("jewelNum").visible = false;
        }
      }else{
        cell.getChildByName("jewelIcon").visible = false;
        cell.getChildByName("jewelNum").visible = false;
        if((cell.dataSource.leftNumber==0)&&(cell.dataSource.haveNumber==0)){
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = true;
          cell.getChildByName("nextText").visible = true;
          cell.getChildByName("statusImg").skin = 'comp/box19.png';
          cell.getChildByName("surplus").visible = false;
          cell.getChildByName("noExchange").visible =  false;
          cell.getChildByName("nohave").visible =  true;
          cell.getChildByName("nohave").color = '#ffffff';
        }else if((cell.dataSource.leftNumber>0)&&(cell.dataSource.haveNumber==0)){
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = false;
          cell.getChildByName("nextText").visible = false;
          cell.getChildByName("statusImg").skin = 'comp/box19.png';
          cell.getChildByName("surplus").visible = true;
          cell.getChildByName("surplus").text = '库存数量：'+ cell.dataSource.leftNumber;
          cell.getChildByName("surplus").color = '#333333';
          cell.getChildByName("nohave").visible =  false;
          cell.getChildByName("noExchange").visible = true;
          cell.getChildByName("noExchange").text = '去兑换('+ cell.dataSource.haveNumber+'/1)';
          cell.getChildByName("noExchange").color = '#ffffff';
        }else if((cell.dataSource.leftNumber==0)&&(cell.dataSource.haveNumber>0)){
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = true;
          cell.getChildByName("nextText").visible = true;

          cell.getChildByName("statusImg").skin = 'comp/box19.png';
          cell.getChildByName("surplus").visible = false;
          cell.getChildByName("nohave").visible = true;
          cell.getChildByName("noExchange").visible = false;
          cell.getChildByName("noExchange").color = '#ffffff';
        }else if((cell.dataSource.leftNumber>0)&&(cell.dataSource.haveNumber>0)){
          cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
          cell.getChildByName("nextTime").visible = false;
          cell.getChildByName("nextText").visible = false;
          cell.getChildByName("statusImg").skin = 'comp/box18.png';
          cell.getChildByName("surplus").visible = true;
          cell.getChildByName("nohave").visible =  false;
          cell.getChildByName("noExchange").visible = true;
          cell.getChildByName("surplus").text = '库存数量：'+ cell.dataSource.leftNumber;
          cell.getChildByName("surplus").color = '#ffffff';
          cell.getChildByName("noExchange").text = '去兑换('+ cell.dataSource.haveNumber+'/1)';
          cell.getChildByName("noExchange").color = '#7A4516';
        }
      }   
    }
    onSelect1(e,i) {
      var dataSource = e.currentTarget.dataSource;
      if (e.type == Laya.Event.MOUSE_UP&&e.target.name == 'statusImg') {
        if(dataSource.itemType==5){//如果不为水果
          if(dataSource.currencyNum <= Data.jewel){
            this.jewJelExchange(dataSource.itemID);
          }else if(dataSource.leftNumber==0){
            Laya.Dialog.open(Scenes.Tip,false,{content:'已经抢光了'})
            return;
          }else if(dataSource.currencyNum > Data.jewel){
            // alert("钻石不足");
            Laya.Dialog.open(Scenes.fullSale)
            return;
          }
        }else{
          if((dataSource.leftNumber==0)&&(dataSource.haveNumber==0)){
            Laya.Dialog.open(Scenes.Tip,false,{content:'当前水果已兑完'})
            return;
          }else if((dataSource.leftNumber>0)&&(dataSource.haveNumber==0)){
            Laya.Dialog.open(Scenes.Tip,false,{content:'当前水果不足'})
            return;
          }else if((dataSource.leftNumber==0)&&(dataSource.haveNumber>0)){
            Laya.Dialog.open(Scenes.Tip,false,{content:'当前水果已兑完'})
            return;
          }
          var orderMsg = {
            id:dataSource.itemID,
            img:dataSource.rescodes,
            name:dataSource.name,
          }
          Data.orderMsg = orderMsg;
          Laya.Dialog.open(Scenes.exchangeOrder,false,{id:dataSource.itemID,img:dataSource.rescodes,name:dataSource.name});
        }
      }
    }
    //设置剩余量为0时的倒计时
    DJS_foo(time){
      var countDownTime;
      var nowTime = new Date();
      nowTime.setTime(nowTime.getTime());
      var s2 = nowTime.getFullYear()+"-" + (nowTime.getMonth()+1) + "-" + nowTime.getDate() + " " + time+":00:00";
      var zhTime = dateChangeFormat('YYYY-mm-dd HH:MM:SS',s2);//获取下个时段
      var djsTimeText = Djs_timeList(zhTime);
      if(new Date().getTime()>new Date(zhTime).getTime()){
        countDownTime = '00:00:00';
        clearInterval(exChangeTime)
      }else{
        countDownTime = djsTimeText;
      }
      return countDownTime;
    }
    jewJelExchange(itemID){
      ajax({
        type: 'POST',
        url: URL.jewJelExchange,
        data:{
          itemId:itemID,
        },
        dataType:'json',
        async: true,
        success:(response)=>{
          var sellData = response;
          console.log("出售情况",sellData);
          if(sellData.code==1){
            //兑换成功后跳转至兑换记录
            Laya.Dialog.open(Scenes.Tip,false,{content:sellData.msg})
            Laya.Dialog.close(Scenes.exchangeCenter);
            Data.selectNum = 0;
          }else{
            Laya.Dialog.open(Scenes.Tip,false,{content:sellData.msg})
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    rightexchangeMsgClick(){
      Laya.Dialog.open(Scenes.Tip,false,{content:'该时间点即将开始'})
    }
}