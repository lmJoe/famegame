export default new class Toast{
    show(content, time=2000){
        if(!this.box){
            let box=new Laya.Box();
            this.box=box;
            box.centerX=0;
            box.centerY=-250;
            box.zOrder=10000;
            Laya.stage.addChild(box);

            let img=new Laya.Image('comp/circle-30.png');
            img.sizeGrid='15,15,15,15';
            img.left=img.right=img.top=img.bottom=0;
            img.alpha=0.7;
            box.addChild(img);

            let lbl=new Laya.Label();
            this.lbl=lbl;
            lbl.font='SimHei';
            lbl.fontSize=36;
            lbl.color='#fff';
            lbl.centerX=lbl.centerY=0;
            box.addChild(lbl);

            this.tlShow=new Laya.TimeLine();
            this.tlShow.from(box, {alpha:0, centerY:-280}, 200);

            this.tlHide=new Laya.TimeLine();
            this.tlHide.to(box, {alpha:0}, 150);
            this.tlHide.on(Laya.Event.COMPLETE, this, this.onHidden)
        }
        this.box.visible=true;
        this.lbl.text=content;
        this.box.size(this.lbl.width+60, this.lbl.height+30);
        this.tlShow.play();
        this.tlHide.pause();
        Laya.timer.once(time, this, this.toHide);
    }

    toHide(){
        this.tlHide.play();
    }

    onHidden(){
        this.box.visible=true;
    }
}