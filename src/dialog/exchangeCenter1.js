import { alerttTip2 } from "../common/alertTipFuc";
import Data from "../common/Data";
import RequestLoading from "../common/RequestLoading";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import { ajax } from "../units/ajax";
import { report, setPagedurations } from "../units/statReport";
import { clearCookie, dateChangeFormat, Djs_timeList, getCookie, playSoundClick, setCookie } from "../units/units";
import URL from "../units/url";
var exChangeTime;//倒计时变量
export default class exchangeCenter1 extends Laya.Dialog {

    constructor() { 
      super(); 
      exchangeCenter1.I = this;
    }
    onEnable() {
      RequestLoading.show();
      this.leftBtn.on(Laya.Event.MOUSE_DOWN,this,this.leftBtnClick);
      this.rightBtn.on(Laya.Event.MOUSE_DOWN,this,this.rightBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.ruleBtn = this.bottomList.getChildByName("ruleBtn")
      this.ruleBtn.on(Laya.Event.MOUSE_DOWN,this,this.ruleBtnClick);
      this.exchangeData.getChildByName("jewelNum").text = Data.jewel;
      this.exchangeList.vScrollBarSkin = "";
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
      this.exChangedurNum = setInterval(() => {
        Data.exChangedurNum = Number(Data.exChangedurNum + 1);
      }, 1000);
      
    }
    ruleBtnClick(){
      Laya.Dialog.open(Scenes.jewelRule,false)
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
        Laya.Dialog.close(Scenes.exchangeCenter1);
        clearInterval(this.djsfruitTime)
　　  },null,true));
      var params = {
        action_type:'离开',
        content:'兑换中心',
        channel_name:'',
        content_id:Data.exChangedurNum,
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
      clearInterval(this.exChangedurNum);
    }
    leftBtnClick(){
      this.exchangeList.visible = false;
      this.rightBtn.selected = false;
      this.leftBtn.selected = true;
      this.fruitList.visible = true;
    }
    rightBtnClick(){
      this.leftBtn.selected = false;
      this.fruitList.visible = false;
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
            if(Data.seedStatus==true){
              this.leftBtn.selected = true;
              this.rightBtn.selected = false;
              this.fruitList.visible = true;
              this.exchangeList.visible = false;
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
        url: URL.getExchangeListV2,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var exChangeData = response;
          if(exChangeData.code==1){
            this.onGotData()
            console.log("兑换中心右侧内容",exChangeData);
            // var exChangeData = 
            // {
            //   "code": 1, 
            //   "msg": "success", 
            //   "data": {
            //       "plantItems": [
            //           {
            //               "itemID": "2203", 
            //               "rescodes": "https://test-static01.baomihua.com/frameGame/images/p3/p_11.png", 
            //               "name": "2斤橘子", 
            //               "hour": 6, 
            //               "leftNumber": 0, 
            //               "itemCount": 2, 
            //               "haveNumber": 0, 
            //               "pid": 0, 
            //               "itemType": 3, 
            //               "currencyType": 0, 
            //               "currencyNum": 0, 
            //               "costPrice": 20, 
            //               "extPrice": 32, 
            //               "dockType": 1
            //           }, 
            //           {
            //               "itemID": "2202", 
            //               "rescodes": "https://test-static01.baomihua.com/frameGame/images/p2/p_11.png", 
            //               "name": "2斤橙子", 
            //               "hour": 6, 
            //               "leftNumber": 0, 
            //               "itemCount": 2, 
            //               "haveNumber": 0, 
            //               "pid": 0, 
            //               "itemType": 3, 
            //               "currencyType": 0, 
            //               "currencyNum": 0, 
            //               "costPrice": 11, 
            //               "extPrice": 12, 
            //               "dockType": 1
            //           }, 
            //           {
            //               "itemID": "2201", 
            //               "rescodes": "https://test-static01.baomihua.com/frameGame/images/p1/p_11.png", 
            //               "name": "3斤苹果", 
            //               "hour": 6, 
            //               "leftNumber": 0, 
            //               "itemCount": 2, 
            //               "haveNumber": 0, 
            //               "pid": 0, 
            //               "itemType": 3, 
            //               "currencyType": 0, 
            //               "currencyNum": 0, 
            //               "costPrice": 1.1, 
            //               "extPrice": 2.2, 
            //               "dockType": 1
            //           },{
            //             "itemID": "2201", 
            //             "rescodes": "https://test-static01.baomihua.com/frameGame/images/p1/p_11.png", 
            //             "name": "3斤苹果", 
            //             "hour": 6, 
            //             "leftNumber": 0, 
            //             "itemCount": 2, 
            //             "haveNumber": 0, 
            //             "pid": 0, 
            //             "itemType": 3, 
            //             "currencyType": 0, 
            //             "currencyNum": 0, 
            //             "costPrice": 1.1, 
            //             "extPrice": 2.2, 
            //             "dockType": 1
            //           }
            //       ], 
            //       "jewelItems": [
            //           {
            //               "itemID": "4003", 
            //               "rescodes": "https://static-quickvideo.29293.com/img/farm/wheel/d_oneyunzhiyuanweiji.png", 
            //               "name": "葡式蛋挞", 
            //               "hour": 6, 
            //               "leftNumber": 0, 
            //               "itemCount": 2, 
            //               "haveNumber": 0, 
            //               "pid": 0, 
            //               "itemType": 5, 
            //               "currencyType": 2, 
            //               "currencyNum": 80, 
            //               "costPrice": 10, 
            //               "extPrice": 10, 
            //               "dockType": 2
            //           },
            //           {
            //             "itemID": "4003", 
            //             "rescodes": "https://static-quickvideo.29293.com/img/farm/wheel/d_oneyunzhiyuanweiji.png", 
            //             "name": "葡式蛋挞", 
            //             "hour": 6, 
            //             "leftNumber": 0, 
            //             "itemCount": 2, 
            //             "haveNumber": 0, 
            //             "pid": 0, 
            //             "itemType": 5, 
            //             "currencyType": 2, 
            //             "currencyNum": 80, 
            //             "costPrice": 10, 
            //             "extPrice": 10, 
            //             "dockType": 2
            //         },{
            //           "itemID": "4003", 
            //           "rescodes": "https://static-quickvideo.29293.com/img/farm/wheel/d_oneyunzhiyuanweiji.png", 
            //           "name": "葡式蛋挞", 
            //           "hour": 6, 
            //           "leftNumber": 0, 
            //           "itemCount": 2, 
            //           "haveNumber": 0, 
            //           "pid": 0, 
            //           "itemType": 5, 
            //           "currencyType": 2, 
            //           "currencyNum": 80, 
            //           "costPrice": 10, 
            //           "extPrice": 10, 
            //           "dockType": 2
            //       },{
            //         "itemID": "4003", 
            //         "rescodes": "https://static-quickvideo.29293.com/img/farm/wheel/d_oneyunzhiyuanweiji.png", 
            //         "name": "葡式蛋挞", 
            //         "hour": 6, 
            //         "leftNumber": 0, 
            //         "itemCount": 2, 
            //         "haveNumber": 0, 
            //         "pid": 0, 
            //         "itemType": 5, 
            //         "currencyType": 2, 
            //         "currencyNum": 80, 
            //         "costPrice": 10, 
            //         "extPrice": 10, 
            //         "dockType": 2
            //     }
            //       ]
            //   }
            // } 

            this.plantItems = exChangeData.data.plantItems;
            this.jewelItems = exChangeData.data.jewelItems;
            for(var i in this.plantItems){
              if(this.plantItems[i].itemID == 2201){
                this.exchangeData.getChildByName("fruit1Num").text = this.plantItems[i].haveNumber;
              }else if(this.plantItems[i].itemID == 2202){
                this.exchangeData.getChildByName("fruit2Num").text = this.plantItems[i].haveNumber;
              }else if(this.plantItems[i].itemID == 2203){
                this.exchangeData.getChildByName("fruit3Num").text = this.plantItems[i].haveNumber;
              }else if(this.plantItems[i].itemID == 2205){
                this.exchangeData.getChildByName("fruit4Num").text = this.plantItems[i].haveNumber;
              }
              Data.fruitNum += this.plantItems[i].haveNumber;
            }
            this.createGoldRushList1(this.plantItems);
            
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
        if (e.type == Laya.Event.MOUSE_DOWN) {
          if(dataSource.isLocked==0){
            if(Data.plantStatus==1){
              Laya.Dialog.open(Scenes.Tip,false,{content:"正在种植中，无法切换水果"})
            }else{
              //isLocked 0未锁定 1锁定
              Data.selectNum = 0;
              Laya.Dialog.open(Scenes.seedTip,false,{content:dataSource});
              Laya.Dialog.close(Scenes.exchangeCenter1);
            }
            
          }else{
            if(index>0){
              Laya.Dialog.open(Scenes.Tip,false,{content:"条件：收获（"+this.fruitList.getCell(index-1).name+"）"})
            }
          }
        }
      }else{
        let cell=this.fruitList.getCell(0);
        Laya.Dialog.open(Scenes.seedTip,false,{content:cell.dataSource});
        Data.selectNum = 0;
        Laya.Dialog.close(Scenes.exchangeCenter1);
      }
    }
    /**创建兑换动态 */
    createGoldRushList1(Arr){
      // 使用但隐藏滚动条
      this.topList.selectEnable = true;
      this.topList.mouseHandler = new Laya.Handler(this, this.onSelect1);
      this.topList.renderHandler = new Laya.Handler(this, this.updateItem1);
      this.topList.array = Arr;
      this.topList.repeatY=Arr.length;
      this.topList.height = Math.ceil(Arr.length/3)*360+Math.ceil(Arr.length/3)*20+80;
      
    }
    updateItem1(cell, index) {
      cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
      cell.getChildByName("listTitle").text = cell.dataSource.name;
      cell.getChildByName("afterPrice").text = '兑后价 ¥'+cell.dataSource.extPrice;
      cell.getChildByName("beforePrice").text = '¥ '+cell.dataSource.costPrice;
      cell.getChildByName("surplus").text = '库存:'+ cell.dataSource.leftNumber;
      // cell.getChildByName("noExchange").text = cell.dataSource.haveNumber;
      if(parseInt(cell.dataSource.itemID)==2201){
        cell.getChildByName("iconImg").skin = 'exchange/icon4.png';
      }else if(parseInt(cell.dataSource.itemID)==2202){
        cell.getChildByName("iconImg").skin = 'exchange/icon2.png';
      }else if(parseInt(cell.dataSource.itemID)==2203){
        cell.getChildByName("iconImg").skin = 'exchange/icon3.png';
      }else if(parseInt(cell.dataSource.itemID)==2205){
        cell.getChildByName("iconImg").skin = 'exchange/icon6.png';
      }
      if(cell.dataSource.leftNumber==0){
        cell.getChildByName("listTimeNum").visible = true;
        cell.getChildByName("listTimeBox").visible = true;
        cell.getChildByName("statusImg").skin = 'exchange/box2-2.png';
        cell.getChildByName("surplus").color = '#333333';
        cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
        if(cell.dataSource.hour==6){
          cell.getChildByName("listTimeNum").text = '12：00开启';
        }else if(cell.dataSource.hour==12){
          cell.getChildByName("listTimeNum").text = '20：00开启';
        }else{
          cell.getChildByName("listTimeNum").text = '06：00开启';
        }
      }else if(cell.dataSource.leftNumber>0){
        cell.getChildByName("listTimeNum").visible = false;
        cell.getChildByName("listTimeBox").visible = false;
        cell.getChildByName("statusImg").skin = 'exchange/box2.png';
        cell.getChildByName("surplus").color = '#ffffff';
        cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
      }
      if(this.jewelItems.length>0){
        this.createJewelList(this.jewelItems);
        this.bottomList.visible = true;
      }else{
        this.bottomList.visible = false;
      }
      
    }
    onSelect1(e,i) {
      var dataSource = e.currentTarget.dataSource;
      if (e.type == Laya.Event.MOUSE_UP) {
        var params = {
          action_type:'点击',
          content:'兑换中心-水果兑换',
          channel_name:'兑换中心',
          content_id:dataSource.itemID,
          content_cat:'',//矿工等级
          content_cat_id:'',//矿工数量
        }
        report(params);
        let contentText;
          if(dataSource.itemID==2201){
            contentText = '苹果';
          }else if(dataSource.itemID==2202){
            contentText = '橙子';
          }else if(dataSource.itemID==2203){
            contentText = '橘子';
          }else if(dataSource.itemID==2205){
            contentText = '酥梨';
          }
          if(dataSource.leftNumber==0){
            Laya.Dialog.open(Scenes.Tip,false,{content:'兑换暂未开启'})
            return;
          }else if(dataSource.leftNumber>0){
            if(dataSource.haveNumber==0){
              Laya.Dialog.open(Scenes.Tip,false,{content:contentText+'不足哦~'})
              return;
            }else{
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
            Laya.Dialog.open(Scenes.Tip,false,{
              content:sellData.msg,
              scenesPage:Scenes.exchangelist,
              sceneValue:2
            })
            // Laya.Dialog.open(Scenes.exchangelist,false);
            Data.jewel-=this.currencyJewelNum;
            gameControl.I.updateJewel();
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
    createJewelList(list){
      // 使用但隐藏滚动条
      this.bottomList.selectEnable = true;
      this.bottomList.mouseHandler = new Laya.Handler(this, this.onjewelSelect);
      this.bottomList.renderHandler = new Laya.Handler(this, this.updatejewelItem);
      this.bottomList.array = list;
      this.bottomList.repeatY = list.length;
      this.bottomList.height = Math.ceil(list.length/3)*360+Math.ceil(list.length/3)*20+80;
      this.bottomList.y = this.topList.height
    }
    onjewelSelect(e,i){
      var dataSource = e.currentTarget.dataSource;
      if (e.type == Laya.Event.MOUSE_UP) {
        var params = {
          action_type:'点击',
          content:'兑换中心-钻石兑换',
          channel_name:'兑换中心',
          content_id:dataSource.itemID,
          content_cat:'',//矿工等级
          content_cat_id:'',//矿工数量
        }
        report(params);
        if(dataSource.jewel <= Data.jewel){
          this.currencyJewelNum = dataSource.jewel;
          this.jewJelExchange(dataSource.itemID);
        }else if(dataSource.leftNumber==0){
          Laya.Dialog.open(Scenes.Tip,false,{content:'兑换暂未开启'})
          return;
        }else if(dataSource.jewel > Data.jewel){
          // alert("钻石不足");
          if(Data.fruitNum==0){
            Laya.Dialog.open(Scenes.Tip,false,{content:'钻石不足哦~'})
            return;
          }
          Laya.Dialog.open(Scenes.fullSale,false)
          
          return;
        }
      }
    }
    updatejewelItem(cell,index){
      cell.getChildByName("listImg").skin = cell.dataSource.rescodes;
      cell.getChildByName("listTitle").text = cell.dataSource.name;
      cell.getChildByName("afterPrice").text = '兑后价 ¥'+cell.dataSource.extPrice;
      cell.getChildByName("beforePrice").text = '¥ '+cell.dataSource.costPrice;
      cell.getChildByName("surplus").text = '库存:'+ cell.dataSource.leftNumber;
      cell.getChildByName("surplus").color = '#ffffff';
      cell.getChildByName("noExchange").text =  cell.dataSource.jewel;
      if(cell.dataSource.dockType==1){
        cell.getChildByName("markIcon").visible = true;
      }
      if(cell.dataSource.leftNumber>0){
        cell.getChildByName("listTimeNum").visible = false;
        cell.getChildByName("listTimeBox").visible = false;
        cell.getChildByName("statusImg").skin = 'exchange/box1.png';
        if(Data.jewel>=cell.dataSource.jewel){
        }else if(Data.jewel<cell.dataSource.jewel){
          
        }
      }else if(cell.dataSource.leftNumber==0){
        cell.getChildByName("listTimeNum").visible = true;
        cell.getChildByName("listTimeBox").visible = true;
        cell.getChildByName("statusImg").skin = 'exchange/box1-1.png';
        if(cell.dataSource.hour==6){
          cell.getChildByName("listTimeNum").text = '12：00开启';
        }else if(cell.dataSource.hour==12){
          cell.getChildByName("listTimeNum").text = '20：00开启';
        }else{
          cell.getChildByName("listTimeNum").text = '06：00开启';
        }
      }
    }
}