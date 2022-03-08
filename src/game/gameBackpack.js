import gameControl from "./gameControl.js";
import backpackItem from "./createBackpackList.js";
import {ajax} from "../units/ajax.js";
import URL from "../units/url.js";
import {report10} from '../units/statReport.js'
import { secretKey,createSprite,createImage,createText,createLabel,getCookie,setCookie,clearCookie,playSoundClick,decrypt,sendEvent, jewelSound } from "../units/units.js";
import Data from "../common/Data.js";
import jewelAni from "../common/jewelAni.js";
import RequestLoading from "../common/RequestLoading.js";
var cellStyle = [];
var tabType;//背包tab类型
var fruitNum = 1;
var cellInfo;
var DialogType,clickItem;
var introAreaCommon;
export default class gameBackpack extends Laya.Script {

    constructor() { 
        super(); 
        let boolType = true;
        /** @prop {name:close, tips:"关闭", type:Node, default:true}*/
        let close = true;
        /** @prop {name:exchangeBox, tips:"背包框", type:Node, default:true}*/
        let exchangeBox = true;
        /** @prop {name:viewStack, tips:"切换内容区", type:Node, default:true}*/
        let viewStack = true;
        /** @prop {name:tab, tips:"tab按钮", type:Node, default:true}*/
        let tab = true;
        /** @prop {name:introDialog, tips:"物品介绍框", type:Node, default:true}*/
        let introDialog = true;
        /** @prop {name:introDialogBig, tips:"大物品介绍框", type:Node, default:true}*/
        let introDialogBig = true;
        /** @prop {name:subtract, tips:"减", type:Node, default:true}*/
        let subtract = true;
        /** @prop {name:add, tips:"加", type:Node, default:true}*/
        let add = true;
        /** @prop {name:jewelNum, tips:"出售钻石数量", type:Node, default:true}*/
        let jewelNum = true;
        /** @prop {name:btnNum, tips:"钻石总量", type:Node, default:true}*/
        let btnNum = true;
        /** @prop {name:sellBtn, tips:"出售按钮", type:Node, default:true}*/
        let sellBtn = true;
        /** @prop {name:bigUseBtn, tips:"大弹窗使用按钮", type:Node, default:true}*/
        let bigUseBtn = true;
        /** @prop {name:UseBtn, tips:"小弹窗使用按钮", type:Node, default:true}*/
        let UseBtn = true;
        /** @prop {name:introArea, tips:"小弹窗说明区域", type:Node, default:true}*/
        let introArea = true;
        /** @prop {name:introAreaBig, tips:"小弹窗说明区域", type:Node, default:true}*/
        let introAreaBig = true;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
        this.posObj = [];
    }

    onStart(){
      this.getPackageInfo(0);
      this.close.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      this.add.on(Laya.Event.MOUSE_DOWN,this,this.addClick);
      this.subtract.on(Laya.Event.MOUSE_DOWN,this,this.subtractClick);
      this.tab.selectHandler = new Laya.Handler(this, this.onTabSelect);
      this.sellBtn.on(Laya.Event.MOUSE_DOWN,this,this.sellForJewel);
      this.bigUseBtn.on(Laya.Event.MOUSE_DOWN,this,this.bigUseBtnClick);
      this.UseBtn.on(Laya.Event.MOUSE_DOWN,this,this.smallUseBtnClick);
      this.introArea.on(Laya.Event.MOUSE_DOWN,this,this.introAreaClickStart);
      this.introAreaBig.on(Laya.Event.MOUSE_DOWN,this,this.introAreaBigClickStart);
      RequestLoading.show();
    }
    onTabSelect(index){
      this.viewStack.selectedIndex=index;
      this.viewStack.removeChildren()
      this.createBackpackList(index);
      // playSoundClick()
    }
    closeClick(){
      playSoundClick()
      this.owner.parent.removeChild(this.owner);
    }
    introAreaBigClickStart(){
      introAreaCommon = this.introAreaBig;
      this.prevX = this.introAreaBig.mouseX;
      this.prevY = this.introAreaBig.mouseY;
      Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.scrollText);
      Laya.stage.on(Laya.Event.MOUSE_UP,this,this.finishScrollText);
    }
    introAreaClickStart(){
      introAreaCommon = this.introArea;
      this.prevX = this.introArea.mouseX;
      this.prevY = this.introArea.mouseY;
      Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.scrollText);
      Laya.stage.on(Laya.Event.MOUSE_UP,this,this.finishScrollText);
    }
    finishScrollText()
    {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollText);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollText);
    }
    /* 鼠标滚动文本 */
    scrollText()
    {
        var nowX = introAreaCommon.mouseX;
        var nowY = introAreaCommon.mouseY;
        introAreaCommon.scrollX += this.prevX - nowX;
        introAreaCommon.scrollY += this.prevY - nowY;
        this.prevX = nowX;
        this.prevY = nowY;
    }
    subtractClick(){
      var number = cellInfo.number;
      if(fruitNum>1&&number>1){
        fruitNum = fruitNum-1;
        this.jewelNum.text = fruitNum;
        this.btnNum.text = Number(cellInfo.jewel*fruitNum);
      }
    }
    addClick(){
      var number = cellInfo.number;
      if(fruitNum<number&&number>0){
        fruitNum = fruitNum+1;
        this.jewelNum.text = fruitNum;
        this.btnNum.text = Number(cellInfo.jewel*fruitNum);
      }
    }
    //背包内容创建
    createBackpackList(type){
      if(type==0){
        tabType = '全部';
      }else if(type==1){
         tabType = '工具'
      }else if(type==2){
         tabType = '兑换物'
      }else if(type==3){
         tabType = '消耗品'
      }
      var list = new Laya.List();
      list.itemRender = backpackItem;
      this.resultData = [];
      for(var i=0;i<this.currentDataList.length;i++){
        if(type==0){
          list.name = "item0";
          this.resultData.push(this.currentDataList[i]);
        }else if(type==1){
          list.name = "item1";
          if(this.currentDataList[i].itemtype == 1){
            this.resultData.push(this.currentDataList[i]);
          }
        }else if(type==2){
          list.name = "item2";
          if(this.currentDataList[i].itemtype == 3 || this.currentDataList[i].itemtype==5){
            this.resultData.push(this.currentDataList[i]);
          }
        }
      }
      list.spaceX = 8;//x方向
      list.spaceY = 8;//y方向
      list.repeatX = 3;
      list.repeatY = 3;
      list.x = 0;
      list.y = 0;
      list.zOrder = 5;
      // 使用但隐藏滚动条
      list.vScrollBarSkin = "";
      list.selectEnable = true;
      list.selectHandler = new Laya.Handler(this, this.onListSelect);
      list.renderHandler = new Laya.Handler(this, this.upListdateItem);
      this.viewStack.addChild(list);
      //对我的水果和兑换动态做区别
      list.array = this.resultData;
      console.log("resultData",this.resultData);
    }
    //渲染处理
    upListdateItem(cell, index){
      cell.removeChild();
      cell.setImg(cell.dataSource);
      //将获取的每个元素的x,y，高，宽
      cellStyle.push(cell);
    }
    //选择处理
    onListSelect(index){
      playSoundClick()
      console.log("当前选择的索引：" + index);
      //获取当前点击位的信息this.resultData
      this.useBackpackMsg(index,this.resultData[index]);
    }
    //获取背包信息
    getPackageInfo(type){
      //清除下背包中的数据
      this.viewStack.removeChildren();
      var that = this;
      ajax({
        type: 'POST',
        url: URL.getPackageInfo,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success: function(response){
          var backpackData = response;
          if(backpackData.code ==1){
            RequestLoading.hide();
            console.log("背包信息",backpackData);
            var packInfoList = backpackData.data.userItemInfos;
            that.currentDataList = packInfoList;
            that.createBackpackList(type);
          }
        }
      })
    }
    getUseBackpackInfo(indexId,itemtype){
      var that = this;
      ajax({
        type: 'POST',
        url: URL.getUseBackpackInfo,
        data:{
          itemid:indexId,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success: function(response){
          var backpackInfo = response;
          if(backpackInfo.code==1){
            //关闭背包打开兑换中心
            that.owner.parent.removeChild(that.owner);
            // alert(backpackInfo.msg)
            console.log("物品使用信息",backpackInfo);
            if(itemtype==5){
              //点击跳转兑换记录

            }else{
              var detail = {
                indexId:indexId,
                itemtype:itemtype,
              }
              detail = JSON.stringify(detail)
              setCookie("backpackChangeImg",detail);
              gameControl.I.getFameLandInfo();
            }
            // report10(tabType,'使用',indexId);
          }else{
            alert(backpackInfo.msg)
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    useBackpackMsg(index,info){
     //获取dialog
     var addBtn,subtract,useBtn,introBg,title,introArea,jewelNum,btnNum;
     var introDialogBox;
     if(info.itemtype==3){
        useBtn = this.introDialogBig.getChildByName("useBtn");//使用按钮
        introBg = this.introDialogBig.getChildByName("introBg");//背景框
        title = this.introDialogBig.getChildByName("title");//介绍标题
        introArea = this.introDialogBig.getChildByName("introArea");//介绍区域
        jewelNum = this.introDialogBig.getChildByName("jewelNum");//钻石出售数量
        btnNum = this.introDialogBig.getChildByName("btnNum");//钻石总量
        introDialogBox = this.introDialogBig;
        //切换后初始化
        btnNum.text = info.jewel;
        jewelNum.text = 1;
        fruitNum = 1;
        cellInfo = info;
     }else{
        useBtn = this.introDialog.getChildByName("useBtn");//使用按钮
        introBg = this.introDialog.getChildByName("introBg");//背景框
        title = this.introDialog.getChildByName("title");//介绍标题
        introArea = this.introDialog.getChildByName("introArea");//介绍区域
        introDialogBox = this.introDialog;
        
     }
     for(var i=0;i<cellStyle.length;i++){
       if(i == index){
        title.text = info.name;
        introArea.text = info.explain;
        introDialogBox.pos(cellStyle[i].x+210,cellStyle[i].y+220);
        console.log("弹窗位置X",cellStyle[i].x+210);
        console.log("弹窗位置Y",cellStyle[i].y+220);
        introDialogBox.visible = true;
        if((index+1)%3 === 0){
          introDialogBox.pos(cellStyle[i].x-120,cellStyle[i].y+220);
          console.log("右边弹窗位置X",cellStyle[i].x+210);
          console.log("右边弹窗位置X",cellStyle[i].y+220);
        }
       }
      
     }
      //获取当前物品点击弹窗容器
      var backpackBox = this.owner.getChildByName("backpackBox");
      var backpackCont = backpackBox.getChildByName("backpackCont");
      var viewStack = backpackCont.getChildByName("viewStack");
      //获取当前正在点击的list列表
      var list = viewStack._children[0];
      var listArr = list._array;
      var cellArr = [];
      for(var i=0;i<list._array.length;i++){
        cellArr.push(list._cells[i]);
      }
      introDialogBox.visible = true;
      
      if(info.itemid==listArr[index].itemid){
        viewStack.on(Laya.Event.MOUSE_DOWN,this,function(){
          introDialogBox.visible = false;
          // useDialog.visible = false;
        });
        this.tab.on(Laya.Event.MOUSE_DOWN,this,function(){
          introDialogBox.visible = false;
          // useDialog.visible = false;
        });
        DialogType = introDialogBox;
        clickItem = info;
      }
    }
    bigUseBtnClick(){
      DialogType.visible = false;
      if(clickItem.itemtype==3){
        console.log("打开兑换中心")
        gameControl.I.houseClick()
        this.owner.parent.removeChild(this.owner);
      }else{
        this.getUseBackpackInfo(clickItem.itemid,clickItem.itemtype);
      }
    }
    smallUseBtnClick(){
      DialogType.visible = false;
      if(clickItem.itemtype==3){
        console.log("打开兑换中心")
        gameControl.I.houseClick()
        this.owner.parent.removeChild(this.owner);
      }else{
        this.getUseBackpackInfo(clickItem.itemid,clickItem.itemtype);
      }
    }
    sellForJewel(){
      var that = this;
      var data = {
        jewel:Number(that.btnNum.text),//总钻石
        items:JSON.stringify([
          {
            itemId:clickItem.itemid,//物品iD
            num:Number(that.jewelNum.text),//数量
          }
        ])
      };
      console.log("卖出钻石",data)
      ajax({
        type: 'POST',
        url: URL.sellForJewel,
        data:data,
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success: function(response){
          var sellData = response;
          console.log("出售情况",sellData);
          if(sellData.code==1){
            //出售成功后,关闭信息面板
            that.introDialogBig.visible = false;
            DialogType.visible = false;
            //刷新当前背包数据
            that.getPackageInfo(that.viewStack.selectedIndex);
            //调取页面中的个人信息 便于刷新钻石
            Data.jewel += Number(that.btnNum.text);
            gameControl.I.updateJewel();
            jewelAni.jewelAniFuc(Number(that.btnNum.text));
            jewelSound();
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
    

}
