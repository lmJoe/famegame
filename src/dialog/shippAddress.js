import Data from "../common/Data";
import RequestLoading from "../common/RequestLoading";
import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import { playSoundClick } from "../units/units";
import URL from "../units/url";

export default class shippAddress extends Laya.Dialog {

    constructor() { 
        super(); 
  
    }
    
    onEnable() {
      RequestLoading.show()
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.addBtn.on(Laya.Event.MOUSE_DOWN,this,this.addBtnClick);
      this.getUserAddress();
    }

    onGotData(){
      RequestLoading.hide();
    }
    addBtnClick(){
      playSoundClick()
      // Data.addressPageType = 1;
      Laya.Dialog.open(Scenes.editAddress);
    }
    closeBtnClick(){
      playSoundClick();
      if(Data.addressPageType==1){
        Laya.Dialog.open(Scenes.exchangeOrder);
      }else if(Data.addressPageType==2){
        Laya.Dialog.open(Scenes.exchangelist);
      }
    }
    getUserAddress(){
      ajax({
        type: 'POST',
        url: URL.getUserAddress,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            this.onGotData()
            console.log("用户地址",res);
            this.createAddressList(res.data);
            if(res.data.length==0){
              this.noAddress.visible = true;
              this.noAddressText.visible = true;
            }else{
              this.noAddress.visible = false;
              this.noAddressText.visible = false;
            }
            
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    createAddressList(addresslist){
      this.addressList.vScrollBarSkin = "";
      this.addressList.selectEnable = true;
      this.addressList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.addressList.mouseHandler = new Laya.Handler(this, this.onCellClick);
      this.addressList.array = addresslist;
    }
    updateItem(cell, index) {
      cell.getChildByName("name").text = cell.dataSource.userName;
      cell.getChildByName("phone").text = cell.dataSource.mobile;
      // cell.getChildByName("addressMsg").text = cell.dataSource.provinceName+cell.dataSource.cityName+cell.dataSource.areaName;
      cell.getChildByName("addressMsg").text = cell.dataSource.address;
      if(Data.addressID==cell.dataSource.id){
        cell.getChildByName("shureIcon").skin = 'exchangelist/icon7.png';
      }else{
        cell.getChildByName("shureIcon").skin = 'exchangelist/icon8.png';
      }
    }
    onCellClick(e, i) {
      var dataSource = e.currentTarget.dataSource;
      var current = e.currentTarget;//获取当前点击的节点
      if (e.type == Laya.Event.MOUSE_DOWN && e.target.name == 'deleted') {
        playSoundClick()
        this.removeUserAddress(dataSource.id);
      }
      if (e.type == Laya.Event.MOUSE_DOWN && e.target.name == 'shureIcon') {
        console.log("设置默认地址",i);
        playSoundClick()
        Data.addressID = dataSource.id;
        Data.addressName = dataSource.userName;
        Data.addressMobile = dataSource.mobile;
        Data.addressIntro = dataSource.address;
        this.addressList.refresh();
        // if(Data.addressPageType==1){
        //   Laya.Dialog.open(Scenes.exchangeOrder);
        // }else if(Data.addressPageType==2){
        //   Laya.Dialog.open(Scenes.exchangelist);
        // }
      }
    }
  
    /**删除地址 */
    removeUserAddress(id){
      ajax({
        type: 'POST',
        url: URL.removeUserAddress,
        data:{
          id:id
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            this.getUserAddress();
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
}