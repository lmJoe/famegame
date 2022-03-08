export default new class RequestLoading{
    show(){
        if(!this.box){
            let box=new Laya.Box();
            this.box=box;
            box.size(Laya.stage.width, Laya.stage.height);
            box.zOrder=9999;
            box.mouseEnabled=true;
            Laya.stage.addChild(box);

            let spMask=new Laya.Sprite();
            this.spMask=spMask;
            spMask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, 'rgba(0, 0, 0, 0.7)');
            box.addChild(spMask);

            let imgLoading=new Laya.Image('comp/loading.png');
            this.imgLoading=imgLoading;
            imgLoading.size(64, 64);
            imgLoading.anchorX=imgLoading.anchorY=0.5;
            imgLoading.pos(Laya.stage.width*0.5, Laya.stage.height*0.5)
            box.addChild(imgLoading);

            this.tlShow=new Laya.TimeLine();
            this.tlShow.from(imgLoading, {rotation:-360}, 2000);
        }
        this.box.visible=true;
        this.spMask.visible=this.imgLoading.visible=false;
        Laya.timer.once(500, this, this.showContent);
    }

    showContent(){
        this.spMask.visible=this.imgLoading.visible=true;
        this.tlShow.play(0, true);
    }

    hide(){
        this.box.visible=false;
        this.tlShow.pause();
        Laya.timer.clear(this, this.showContent);
    }
}