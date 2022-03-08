import Data from "../common/Data";
import jewelAni from "../common/jewelAni";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import { ajax } from "../units/ajax";
import { report } from "../units/statReport";
import { jewelSound } from "../units/units";
import URL from "../units/url";

export default class fullSale extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.saleBtn.on(Laya.Event.MOUSE_DOWN,this,this.saleBtnClick);
      this.shureBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      
      this.allFruitArr = [];
      this.getPackageInfo();
    }

    onDisable() {
    }
    closeBtnClick(){
      Laya.Dialog.close(Scenes.fullSale)
    }
    getPackageInfo(){
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
            var arr = backpackData.data.userItemInfos
            var fruitList = [];
            var allSaleJewel = 0;
            for(var i=0;i<arr.length;i++){
              if(arr[i].itemtype==3){
                fruitList.push(arr[i])
                allSaleJewel += arr[i].jewel*arr[i].number;
                var obj = {
                  itemId:arr[i].itemid,
                  num:arr[i].number,
                }
                this.allFruitArr.push(obj);
              }
            }
            this.allSaleJewel.text = allSaleJewel;
            this.initList(fruitList);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    initList(fruitList) {
      if(fruitList.length==0){
        this.saleBtn.visible = false;
        this.shureBtn.visible = true;
        this.nofrultMsg.visible = true;
        this.nofrult.visible = true;
        this.fruitList.visible = false;
        this.allSaleJewel.visible = false;
        
      }else{
        this.allSaleJewel.visible = true;
        this.saleBtn.visible = true;
        this.shureBtn.visible = false;
        this.nofrultMsg.visible = false;
        this.nofrult.visible = false;
        this.fruitList.visible = true;
        this.fruitList.vScrollBarSkin = "";
        this.fruitList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.fruitList.mouseHandler = new Laya.Handler(this, this.onCellClick);
        this.fruitList.array = fruitList;
      }
      
    }
  
    updateItem(cell, index) {
      let cellData=cell.dataSource;
      cell.getChildByName("fruitImg").skin = cellData.rescodes;
      cell.getChildByName("frultTitle").text = cellData.name;
      cell.getChildByName("fruitNum").text = 'x'+cellData.number;
      cell.getChildByName("salseNum").text = cellData.number;
      cell.getChildByName("saleJewel").text = cellData.number*cellData.jewel;
      if(cellData.number==Number(cell.getChildByName("salseNum").text)){
        cell.getChildByName("addBtn").skin='fullsale/icon3-3.png';
      }else if(cellData.number==0){
        cell.getChildByName("reduceBtn").skin='fullsale/icon2-2.png';
      }
      
    }
    
  
    onCellClick(e, i) {
      var current = e.currentTarget;
      var dataSource = e.currentTarget.dataSource;
      var fruitNum = Number(current.getChildByName("fruitNum").text.slice(1));
      if (e.type == Laya.Event.MOUSE_DOWN) {
        if(e.target.name == 'reduceBtn'){
          if(Number(current.getChildByName("salseNum").text)>0){
            current.getChildByName("salseNum").text = Number(current.getChildByName("salseNum").text)-1;
            current.getChildByName("saleJewel").text= dataSource.jewel*Number(current.getChildByName("salseNum").text);
            this.allSaleJewel.text = Number(this.allSaleJewel.text) - dataSource.jewel;
          }
          
          
        }else if(e.target.name == 'addBtn'){
          if(Number(current.getChildByName("salseNum").text)<fruitNum){
            current.getChildByName("salseNum").text = Number(current.getChildByName("salseNum").text)+1;
            current.getChildByName("saleJewel").text= dataSource.jewel*Number(current.getChildByName("salseNum").text);
            this.allSaleJewel.text = Number(this.allSaleJewel.text) + dataSource.jewel;
            current.getChildByName("reduceBtn").skin='fullsale/icon2-2.png';
            current.getChildByName("addBtn").skin='fullsale/icon3.png';
          }else{
            current.getChildByName("reduceBtn").skin='fullsale/icon2.png';
            current.getChildByName("addBtn").skin='fullsale/icon3-3.png';
          }
        }
        for(var i=0;i<this.allFruitArr.length;i++){
          if(this.allFruitArr[i].itemId == dataSource.itemid){
            this.allFruitArr[i].num = Number(current.getChildByName("salseNum").text);
          }
        }
        if(Number(current.getChildByName("salseNum").text)>0&&(Number(current.getChildByName("salseNum").text)<fruitNum)){
          current.getChildByName("reduceBtn").skin='fullsale/icon2.png';
          current.getChildByName("addBtn").skin='fullsale/icon3.png';
        }else if(Number(current.getChildByName("salseNum").text)==0){
          current.getChildByName("reduceBtn").skin='fullsale/icon2-2.png';
          current.getChildByName("addBtn").skin='fullsale/icon3.png';
        }else if(Number(current.getChildByName("salseNum").text)==fruitNum){
          current.getChildByName("reduceBtn").skin='fullsale/icon2.png';
          current.getChildByName("addBtn").skin='fullsale/icon3-3.png';
        }
        if(Number(this.allSaleJewel.text)==0){
          this.saleBtn.skin = 'fullsale/button2.png';
          this.saleBtn.mouseEnabled = false;
        }else{
          this.saleBtn.skin = 'fullsale/button1.png';
          this.saleBtn.mouseEnabled = true;
        }
      }
    }
    saleBtnClick(){
      var params = {
        action_type:'点击',
        content:'钻石-一键出售',
        channel_name:'钻石',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
      var data = {
        jewel:Number(this.allSaleJewel.text),//总钻石
        items:JSON.stringify(this.allFruitArr)
      };
      console.log("data",data)
      ajax({
        type: 'POST',
        url: URL.sellForJewel,
        data:data,
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(response)=>{
          var sellData = response;
          if(sellData.code==1){
            //调取页面中的个人信息 便于刷新钻石
            Data.jewel += Number(this.allSaleJewel.text);
            gameControl.I.updateJewel();
            // Laya.Dialog.open(Scenes.Tip,false,{content:'出售成功'})
            jewelAni.jewelAniFuc(this.allSaleJewel.text);
            jewelSound();
            //出售成功后,关闭信息面板
            this.closeBtnClick()
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
}