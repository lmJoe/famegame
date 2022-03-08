import Data from "../common/Data";
import jewelAni from "../common/jewelAni";
import RequestLoading from "../common/RequestLoading";
import Scenes from "../common/Scenes";
import Util from "../common/Util";
import gameControl from "../game/gameControl";
import { ajax } from "../units/ajax";
import { jewelSound, playSoundClick, setCookie } from "../units/units";
import URL from "../units/url";
var fruitNum = 1;
export default class backpack extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      this.btn1.on(Laya.Event.MOUSE_DOWN,this,this.btn1Click);
      this.btn2.on(Laya.Event.MOUSE_DOWN,this,this.btn2Click);
      this.btn3.on(Laya.Event.MOUSE_DOWN,this,this.btn3Click);
      this.getPackageInfo();
    }

    onDisable() {
    }
    closeClick(){
      Laya.Dialog.close(Scenes.backpack);
    }
    btn1Click(){
      this.btn1.selected = true;
      this.btn2.selected = false;
      this.btn3.selected = false;
      this.createList(0);
      if(this.backpackDia!==undefined){
        this.backpackDia.destroy();
      }
    }
    btn2Click(){
      this.createList(1);
      this.btn1.selected = false;
      this.btn2.selected = true;
      this.btn3.selected = false;
      if(this.backpackDia!==undefined){
        this.backpackDia.destroy();
      }
    }
    btn3Click(){
      this.createList(2);
      this.btn1.selected = false;
      this.btn2.selected = false;
      this.btn3.selected = true;
      if(this.backpackDia!==undefined){
        this.backpackDia.destroy();
      }
    }
    //获取背包信息
    getPackageInfo(){
      //清除下背包中的数据
      // this.viewStack.removeChildren();
      ajax({
        type: 'POST',
        url: URL.getPackageInfo,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var backpackData = response;
          if(backpackData.code ==1){
            RequestLoading.hide();
            console.log("背包信息",backpackData);
            var packInfoList = backpackData.data.userItemInfos;
            this.currentDataList = packInfoList;
            this.createList(0);
          }
        }
      })
    }
    getUseBackpackInfo(indexId,itemtype){
      ajax({
        type: 'POST',
        url: URL.getUseBackpackInfo,
        data:{
          itemid:indexId,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var backpackInfo = response;
          if(backpackInfo.code==1){
            //关闭背包打开兑换中心
            Laya.Dialog.close(Scenes.backpack);
            // alert(backpackInfo.msg)
            console.log("物品使用信息",backpackInfo);
            if(itemtype==5){
              //点击跳转兑换记录

            }else{
              // var detail = {
              //   indexId:indexId,
              //   itemtype:itemtype,
              // }
              // detail = JSON.stringify(detail)
              // setCookie("backpackChangeImg",detail);
              gameControl.I.getFameLandInfo();
            }
            // report10(tabType,'使用',indexId);
          }else{
            Laya.Dialog.open(Scenes.Tip,false,{content:backpackInfo.msg})
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    sellForJewel(itemid){
      var data = {
        jewel:Number(this.backpackDia.getChildByName("btnNum").text),//总钻石
        items:JSON.stringify([
          {
            itemId:itemid,//物品iD
            num:Number(this.backpackDia.getChildByName("jewelNum").text),//数量
          }
        ])
      };
      ajax({
        type: 'POST',
        url: URL.sellForJewel,
        data:data,
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var sellData = response;
          console.log("出售情况",sellData);
          if(sellData.code==1){
    
            //调取页面中的个人信息 便于刷新钻石
            Data.jewel += Number(this.backpackDia.getChildByName("btnNum").text);
            gameControl.I.updateJewel();
            jewelAni.jewelAniFuc(Number(this.backpackDia.getChildByName("btnNum").text));
            jewelSound();
            // //出售成功后,关闭信息面板
            if(this.backpackDia!==undefined){
              this.backpackDia.destroy();
            }
            //刷新当前背包数据
            this.getPackageInfo();
            //关闭弹窗
            // Laya.Dialog.close(Scenes.backpack)
          }else{
            alert(sellData.msg);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**创建列表 */
    createList(type){
      // debugger
      // this.backpackList.removeChild();
      // 使用但隐藏滚动条
      var dataList = [];
      var currentDataList = this.currentDataList;
      for(var i=0;i<currentDataList.length;i++){
        switch (type) {
          case 0:
            dataList.push(currentDataList[i]);
            break;
          case 1:
            if(currentDataList[i].itemtype==1){
              dataList.push(currentDataList[i])
            }
            break;
          default:
            if(currentDataList[i].itemtype==3||currentDataList[i].itemtype==5){
              dataList.push(currentDataList[i])
            }
        }
      }
      this.backpackList.vScrollBarSkin = "";
      this.backpackList.selectEnable = true;
      this.backpackList.mouseHandler = new Laya.Handler(this, this.onSelect);
      this.backpackList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.backpackList.array = dataList;
      console.log("dataList",dataList)
    }
    updateItem(cell, index) {
      cell.getChildByName("goodNum").text = 'x'+cell.dataSource.number;//物品数量
      cell.getChildByName("goodTitle").text = cell.dataSource.name;//物品标题
      if(cell.dataSource.actived==1){
        cell.getChildByName("useTag").visible = true;//使用标志
      }else{
        cell.getChildByName("useTag").visible = false;//使用标志
      }
      let imgIcon = cell.getChildByName("goodsImg");
      if(imgIcon){
        let url=Util.getOnlineAssets(cell.dataSource.rescodes);
        Laya.loader.load(url, Laya.Handler.create(this, (texture)=>{
          imgIcon.texture=texture;
          let ratio=texture.height/texture.width;
          imgIcon.size(80, 80*ratio);
          imgIcon.centerX=0;
          imgIcon.centerY=20;
        }))
      }
    }
    onSelect(e,i) {
      var prefabType;
      var cellCurrent = this.backpackList.getCell(i);//获取当前点击的节点
      var dataSource = this.backpackList.getCell(i)._dataSource;
      // if(cellCurrent.getChildByName("choseImg").visible){
      //   cellCurrent.getChildByName("choseImg").visible = false;
      // }
      if(dataSource.itemtype==3){
        prefabType = 'prefab/backpackDia2.prefab'
      }else{
        prefabType = 'prefab/backpackDia1.prefab'
      }
     
      Laya.loader.load(prefabType, Laya.Handler.create(this, (prefab)=>{
        if(this.backpackDia!==undefined){
          this.backpackDia.destroy();
        }
        this.backpackDia=Laya.Pool.getItemByCreateFun('backpackDia', prefab.create, prefab);
        this.backpackDia.pos(cellCurrent._x+cellCurrent._width+10,cellCurrent._y+cellCurrent._height/2);
        if((i+1)%3 === 0){
          this.backpackDia.pos(cellCurrent._x-cellCurrent._width,cellCurrent._y+cellCurrent._height/2);
        }
        this.backpackDia.getChildByName("introArea").text = dataSource.explain;
        this.backpackDia.getChildByName("title").text = dataSource.name;
        this.introArea = this.backpackDia.getChildByName("introArea");
        this.introArea.on(Laya.Event.MOUSE_DOWN,this,this.introAreaClickStart);
        this.diaData = dataSource;
        if(dataSource.itemtype==3){
          this.backpackDia.getChildByName("btnNum").text = dataSource.jewel;
        }else{

        }
        this.backpackDia.on(Laya.Event.MOUSE_UP, this, this.backpackDiaClick)
        this.backpackList.addChild(this.backpackDia);
      }))
    }
    backpackDiaClick(e,i){
      if (e.type == Laya.Event.MOUSE_UP) {
        if(e.target.name == 'useBtn'){
          if(this.diaData.itemtype==3){
            gameControl.I.houseClick();
            Laya.Dialog.close(Scenes.backpack);
          }else{
            this.getUseBackpackInfo(this.diaData.itemid,this.diaData.itemtype);
          }
        }else if(e.target.name == 'subtract'){
          this.subtractClick();
        }else if(e.target.name == 'add'){
          this.addClick()
        }else if(e.target.name == 'sellBtn'){
          this.sellForJewel(this.diaData.itemid);
        }
      }
    }
    subtractClick(){
      var number = this.diaData.number;
      if(fruitNum>1&&number>1){
        fruitNum = fruitNum-1;
        this.backpackDia.getChildByName("jewelNum").text = fruitNum;
        this.backpackDia.getChildByName("btnNum").text = Number(this.diaData.jewel*fruitNum);
      }
    }
    addClick(){
      var number = this.diaData.number;
      if(fruitNum<number&&number>0){
        fruitNum = fruitNum+1;
        this.backpackDia.getChildByName("jewelNum").text = fruitNum;
        this.backpackDia.getChildByName("btnNum").text = Number(this.diaData.jewel*fruitNum);
      }
    }
    introAreaClickStart(){
      this.prevX = this.introArea.mouseX;
      this.prevY = this.introArea.mouseY;
      Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.scrollText);
      Laya.stage.on(Laya.Event.MOUSE_UP,this,this.finishScrollText);
    }
    finishScrollText(){
      Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollText);
      Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollText);
    }
    /* 鼠标滚动文本 */
    scrollText(){
      var nowX = this.introArea.mouseX;
      var nowY = this.introArea.mouseY;
      this.introArea.scrollX += this.prevX - nowX;
      this.introArea.scrollY += this.prevY - nowY;
      this.prevX = nowX;
      this.prevY = nowY;
    }
}