Laya.Dialog.prototype.open=function(closeOther = true, param = null) {
    this._dealDragArea();
    this._param = param;
    Laya.Dialog.manager.size(Laya.stage.width, Laya.stage.height);
    Laya.Dialog.manager.open(this, closeOther, this.isShowEffect);
    Laya.Dialog.manager.lock(false);
}

Laya.Dialog.prototype.close=function(type = null){
    if(type=='side' && this.closeOnSide==false) return;
    this.closeType = type;
    Laya.Dialog.manager.close(this);
    Laya.Dialog.manager.size(0, 0);
}

Laya.DialogManager.prototype.closeAll=function() {
    this.size(0, 0);
    this._closeAll();
    this.event(Laya.Event.CLOSE);
}

Laya.DialogManager.prototype._checkMask=function(){
    this.maskLayer.removeSelf();
    for (var i = this.numChildren - 1; i > -1; i--) {
        var dialog = this.getChildAt(i);
        if (dialog && dialog.isModal) {
            if(dialog.maskAlpha){
                this.maskLayer.alpha = dialog.maskAlpha;
            }else{
                this.maskLayer.alpha = UIConfig.popupBgAlpha;
            }
            this.addChildAt(this.maskLayer, i);
            return;
        }
    }
}

export default null;