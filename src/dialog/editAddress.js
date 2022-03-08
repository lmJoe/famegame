import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import URL from "../units/url";
var keyDownList;
export default class editAddress extends Laya.Dialog {

    constructor() { 
      super(); 
    }
    
    onEnable() {
      this.addBtn.on(Laya.Event.MOUSE_DOWN,this,this.addUserAddress);
      this.choseArea.on(Laya.Event.MOUSE_DOWN,this,this.choseAreaClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.sourceHeight = Laya.Browser.window.screen.heigh;
      Laya.stage.on(Laya.Event.RESIZE, this, this.onStageChange);
    }
    
    addUserAddress(){
      ajax({
        type: 'POST',
        url: URL.addUserAddress,
        data:{
          mobile:this.phone.text,
          userName:this.name.text,
          address:this.addressIntro.text,
          provinceid:0,//省
          cityid:0,//市
          areaid:0,//区
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            console.log(res);
            /**成功之后跳转至用户地址 */
            Laya.Dialog.open(Scenes.shippAddress);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    closeBtnClick(){
      Laya.Dialog.open(Scenes.shippAddress);
    }
    /**选择地址 */
    choseAreaClick(){
      ajax({
        type: 'POST',
        url: URL.GetArea,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
 
            
          }
          
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }

    onStageChange(){
      var desHeight = window.innerHeight;
      if(desHeight!=this.sourceHeight){
        alert("1")
        window.scrollTo(0, 0)
      }else{
        alert("2")
      }
    }
}