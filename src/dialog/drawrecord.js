import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import { getCaption, playSoundClick } from "../units/units";
import URL from "../units/url";

export default class drawrecord extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      this.getUserPrizes();
    }
    closeClick(){
      playSoundClick();
      Laya.Dialog.close(Scenes.drawrecord);
    }
    getUserPrizes(){
      ajax({
        type: 'POST',
        url: URL.getUserPrizes,
        data:{
          pageIndex:1,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            // var data = {
            //               "code": 1, 
            //               "msg": "ok", 
            //               "data": [
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-02-09 10:51:18", 
            //                       "id": 970, 
            //                       "wheelId": 0, 
            //                       "name": "X500", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bj_manycoins.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-02-09 10:51:12", 
            //                       "id": 969, 
            //                       "wheelId": 0, 
            //                       "name": "X500比大小比大小比大小比大小比大小比大小", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bj_manycoins.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-02-09 10:50:55", 
            //                       "id": 968, 
            //                       "wheelId": 0, 
            //                       "name": "比大小比大小比大小比大小比大小比大小", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bdx.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-02-08 15:54:11", 
            //                       "id": 967, 
            //                       "wheelId": 0, 
            //                       "name": "0.1元话费券比大小比大小比大小比大小比大小比大小", 
            //                       "imgUrl": "http://wsnewp001.baomihua.com/input/6e0049f1f4cc4756a1e49362cdadf030.jpg"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-27 17:06:48", 
            //                       "id": 957, 
            //                       "wheelId": 0, 
            //                       "name": "X50", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bj_onecoin.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-27 17:06:37", 
            //                       "id": 956, 
            //                       "wheelId": 0, 
            //                       "name": "农场问答比大小比大小比大小比大小比大小比大小", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/songshu.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-26 18:17:20", 
            //                       "id": 904, 
            //                       "wheelId": 0, 
            //                       "name": "农场问答", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/songshu.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-26 18:17:14", 
            //                       "id": 903, 
            //                       "wheelId": 0, 
            //                       "name": "X50", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bj_onecoin.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-26 18:17:02", 
            //                       "id": 902, 
            //                       "wheelId": 0, 
            //                       "name": "农场问答比大小比大小比大小比大小比大小比大小", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/songshu.png"
            //                   }, 
            //                   {
            //                       "linkUrl": "", 
            //                       "cId": null, 
            //                       "createTime": "2022-01-26 18:15:23", 
            //                       "id": 901, 
            //                       "wheelId": 0, 
            //                       "name": "比大小", 
            //                       "imgUrl": "https://static-quickvideo.29293.com/img/farm/wheel/bdx.png"
            //                   }
            //               ]
            //             }
            this.initList(res.data);
            // this.initList(data.data);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    initList(list) {
      if(list.length==0){

        
      }else{
        this.drawList.vScrollBarSkin = "";
        this.drawList.renderHandler = new Laya.Handler(this, this.updateItem);
        this.drawList.mouseHandler = new Laya.Handler(this, this.onCellClick);
        this.drawList.array = list;
      }
      
    }
  
    updateItem(cell, index) {
      cell.graphics.drawRect(0,0,502,73,index%2 ==0 ?'#FFF1D4':"#FFFFFF");
      let cellData=cell.dataSource;
      cell.getChildByName("time").text = cellData.createTime.substr(0,16)+'抽中了';
      cell.getChildByName("name").text = cellData.name.length>8?cellData.name.substr(0,8) + "...":cellData.name;
      cell.getChildByName("name").color = cellData.linkUrl==''?'#97552C':"#FF3D2E";
      cell.getChildByName("name").underline = cellData.linkUrl==''?false:true;
    }
    
  
    onCellClick(e, i) {
      var dataSource = e.currentTarget.dataSource;
      if (e.type == Laya.Event.MOUSE_DOWN) {
        if(e.target.name == 'name'){
          if(dataSource.linkUrl){
            getCaption(dataSource.linkUrl);
          }
          
        }
      }
    }
}