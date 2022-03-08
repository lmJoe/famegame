export default class StartLoading extends Laya.Scene{
    onAwake(){
        this.progressW=560;
        this.panel.width=0;

        this.dotNum=0;
        this.aniTxtOnLoading();
        Laya.timer.loop(300, this, this.aniTxtOnLoading);
    }

    onProgress(percent){
        this.panel.width=this.progressW*percent;
        // Laya.Tween.to(this.panel, {width:this.progressW*percent}, 500, Laya.Ease.linearOut);
    }

    aniTxtOnLoading(){
        this.dotNum++;
        this.txt.changeText('玩农场领水果加载中'+('.'.repeat(this.dotNum)));
        if(this.dotNum>=3) this.dotNum=0;
    }

    onClosed(){
        Laya.timer.clearAll(this);
    }
}