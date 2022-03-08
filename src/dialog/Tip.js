import Scenes from "../common/Scenes";

export default class Tip extends Laya.Dialog{
    onEnable(){
        this.closeOnSide=false;
        if(this._param && this._param.content){
            this.txtContent.text=this._param.content;
        }
    }

    onClosed(type){
        // if(type=='ok' && this._param && this._param.handler){
          
        //     this._param.handler();
        // }
        if(type=='ok' && this._param.scenesPage){
          Laya.Dialog.open(this._param.scenesPage,false,{sceneValue:this._param.sceneValue});
        }
    }
}