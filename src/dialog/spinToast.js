import Scenes from "../common/Scenes";
import { getCaption } from "../units/units";

export default class spinToast extends Laya.Dialog {

    onEnable() {
      this.goExchangeBtn.on(Laya.Event.MOUSE_DOWN,this,this.goExchangeBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */

      Laya.loader.load(this._param.imgUrl, Laya.Handler.create(this, (texture)=>{
        this.spinImg.skin=this._param.imgUrl;
        let ratio=texture.height/texture.width;
        this.spinImg.size(342, 342*ratio);
      }), null, Laya.Loader.IMAGE)

      this.spinText.text = this._param.name+'一张';
      this.linkUrl = this._param.linkUrl;
    }
    
    goExchangeBtnClick(){
      //跳转至兑换页
      getCaption(this.linkUrl)
    }
    closeBtnClick(){
      Laya.Dialog.close(Scenes.spinToast);
    }

}