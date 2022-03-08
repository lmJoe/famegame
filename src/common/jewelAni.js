export default new class jewelAni{
  jewelAniFuc(num){
    if(!this.boxCoinAni){
      this.createAni();
      this.createText();
    }

    this.boxCoinAni.visible=true;
    this.lblNum.text='+'+num;
    this.imgBox.y=120;
    this.imgBox.alpha=0;
    Laya.Tween.to(this.imgBox, {y: 220, alpha:1}, 150, Laya.Ease.linearNone);
    this.ani.play();
  }

  createAni(){
    this.boxCoinAni=new Laya.Box();
    this.boxCoinAni.zOrder=9999;
    this.boxCoinAni.size(1, 1);
    this.boxCoinAni.centerX=0;
    this.boxCoinAni.y=200;
    Laya.stage.addChild(this.boxCoinAni);

    this.ani = new Laya.Animation();
    this.ani.loadAnimation("animation/jewelToast.ani");
    this.ani.on(Laya.Event.COMPLETE,this,this.onComplete);
    this.boxCoinAni.addChild(this.ani);
  }

  createText(){
    let imgBox=new Laya.Image('comp/box24.png');
    this.imgBox=imgBox;
    imgBox.size(280, 66);
    imgBox.centerX=0;
    this.boxCoinAni.addChild(imgBox);

    let hbox=new Laya.HBox();
    hbox.centerX=hbox.centerY=0;
    this.imgBox.addChild(hbox);

    this.lblNum=this.creatLbl('#FFEF38');
    hbox.addChild(this.lblNum);
    let lblRight=this.creatLbl('#ffffff');
    lblRight.text=' 钻石';
    hbox.addChild(lblRight);
  }

  creatLbl(color){
    let lbl=new Laya.Label();
    lbl.font='SimHei';
    lbl.fontSize=36;
    lbl.color=color;
    this.imgBox.addChild(lbl);
    return lbl;
  }
  
  onComplete(){
    this.boxCoinAni.visible=false;
  }
}