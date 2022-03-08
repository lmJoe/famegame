import {createSprite,createImage,createText,createLabel} from "../units/units.js";
import Util from "../common/Util.js";
// 项渲染器
var Box   = Laya.Box;
var WID = 160,
    HEI = 200;
// 主要逻辑代码
export default class backpackItem extends Box {
	constructor(){
		super();
    //创建了一个图片容器
    // this.itemBox = createSprite('',this,WID,HEI,'','','',1,true);
    //添加背景图片
    
    var SpriteBg = createSprite('SpriteBgName',this,160,200,'comp/box12.png','','',5,true);
    //创建标题
    var SpriteTitleValue = createText('',24,'titleValue','#FFF2F2','',35,"Microsoft YaHei",SpriteBg,"center",'','',160,35);
    //背景图片上添加内容图片资源
    var SpriteImg = createImage('SpriteImg',21,70,124,84,SpriteBg,true,'',5);
    //创建物品个数
    var SpriteImgNum = createText('',24,'SpriteImgNum','#F3FEFF',115,172,"Microsoft YaHei",SpriteBg,"center",'','',25,'','');
    //创建使用状态
    var activeImg = createSprite('activeImg',SpriteBg,69,69,'comp/icon4.png',0,0,'',true);
    var useDialog = createSprite('useDialog',this,160,200,'comp/box11.png',0,0,10,false);
	}
  onEnable() {
    
  }
	setImg(data) {
    var itemSprite = this._children;
    for(var i=0;i<itemSprite.length;i++){
      let imgIcon=itemSprite[i].getChildByName("SpriteImg");
      if(imgIcon){
        let url=Util.getOnlineAssets(data.rescodes);
        Laya.loader.load(url, Laya.Handler.create(this, (texture)=>{
          imgIcon.texture=texture;
          let ratio=texture.height/texture.width;
          imgIcon.size(80, 80*ratio);
          imgIcon.centerX=0;
          imgIcon.centerY=20;
        }))
      }
      if(itemSprite[i].getChildByName("titleValue")){
        itemSprite[i].getChildByName("titleValue").text = data.name;
      }
      if(itemSprite[i].getChildByName("SpriteImgNum")){
        itemSprite[i].getChildByName("SpriteImgNum").text = 'X'+data.number;
      }
      if(data.actived!==1){
        if(itemSprite[i].getChildByName("activeImg")){
          itemSprite[i].getChildByName("activeImg").visible = false;
        }
      }
    }
    
	}
}