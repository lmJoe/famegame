import Data from "../common/Data";
import gameUI from "./gameUI";
var operAnimType;//判断播种或者浇水
var btnTypeCode;//判断浇水水桶
var waterAnimationType;//判断水桶浇水调用的动画
var waterMoveType;//判断调用浇水动作动画
var plantOperedNode;
export default class gameAnimation extends Laya.Script {
    constructor() { 
        super(); 
        gameAnimation.I=this;
        /** @prop {name:treeAni, tips:"植物", type:Node, default:null}*/
    }

    onEnable() {
      this.operPos = this.owner.getChildByName("operPos");
      this.scoopIcon = this.operPos.getChildByName("scoopBtn").getChildByName("scoop");
      this.gameUI = this.owner.getComponent(gameUI);
    }

    //创建热气球
    createAnimation(){
      var BalloonAni = Laya.Pool.getItemByCreateFun("Balloon", this.loadBalloonAnimation, this);
      BalloonAni.pos(-100, 380);
      BalloonAni.size(200,200)
      BalloonAni.interval=100;//设置帧动画的时间间隔
      BalloonAni.zOrder=5;//层级
      BalloonAni.weight=1;//设置帧动画的时间间隔
      Laya.stage.addChild(BalloonAni);
      BalloonAni.play(0,true,'move');
    }

    loadBalloonAnimation(){
      this.BalloonAni = new Laya.Animation();
      this.BalloonAni.loadAnimation("balloonAnimation.ani");
      /**
       * 使用缓动动画流程：
       * 1、给需要移动的元素设置缓动后的样式属性即可
       */
      //绑定点击事件
      // 通过缓动动画控制 this.balloonAni位置移动、大小变化；整个动画耗时2秒
      this.BalloonAni.on(Laya.Event.MOUSE_DOWN,this,this.hotAirBalloonClick);
      Laya.Tween.to(this.BalloonAni,{
        x: this.owner._width,
      },17000,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
        //添加动画效果 动画完成后执行Handler处理器的方法
          this.BalloonAni.on(Laya.Event.COMPLETE,this,this.clearHotAirBalloon);
      }))
      
      return this.BalloonAni;
    }

    clearHotAirBalloon(){
      console.log("热气球销毁完成")
      this.BalloonAni.removeSelf();
    }

    hotAirBalloonClick(){
      console.log("点击打开");
      that.clearHotAirBalloon();
    }

    //创建水滴效果
    createWaterAnimation(){
      if(btnTypeCode==2001){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water1", this.loadWaterAnimation, this);
      }else if(btnTypeCode==2002||btnTypeCode==2003){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water2", this.loadWaterAnimation, this);
      }else if(btnTypeCode==2004||btnTypeCode==2005){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water3", this.loadWaterAnimation, this);
      }
      this.WaterAni.pos(plantOperedNode._width/2, -20);
      this.WaterAni.interval=20;//设置帧动画的时间间隔
      this.WaterAni.zOrder=3;//层级
      this.WaterAni.weight=1;//设置帧动画的时间间隔
      plantOperedNode.addChild(this.WaterAni);
      this.WaterAni.play(0,false,waterMoveType);
    }

    loadWaterAnimation(){
      var WaterAni = new Laya.Animation();
      if(btnTypeCode==2001){
        waterAnimationType = "waterAnimation3.ani";
        waterMoveType = 'waterMove3';
        
      }else if(btnTypeCode==2002||btnTypeCode==2003){
        
        waterAnimationType = "waterAnimation6.ani";
        waterMoveType = 'waterMove6';
      }else if(btnTypeCode==2004||btnTypeCode==2005){
        
        waterAnimationType = "waterAnimation10.ani";
        waterMoveType = 'waterMove10';
      }
      WaterAni.loadAnimation(waterAnimationType)
      WaterAni.on(Laya.Event.COMPLETE,this,clearWaterAnimation);
      function clearWaterAnimation(){
        WaterAni.removeSelf();
        // Laya.Pool.recover("water1", WaterAni);
        // Laya.Pool.recover("water2", WaterAni);
        // Laya.Pool.recover("water3", WaterAni);
    
      };
      return WaterAni;
    }
    //创建铲铲动画
    createSoilAnimation(num,parentNode){
      operAnimType = num;
      plantOperedNode = parentNode;
      this.scoopIcon.visible=false;
      this.SoilAni = new Laya.Animation();
      this.SoilAni.loadAnimation("soilAnimation.ani");
      this.SoilAni.interval=55;//设置帧动画的时间间隔
      this.SoilAni.play(0,false,"scoopMove");//播放动画效果：从第0帧开始，循环播放，动画名称
      var SoilAniNode = new Laya.Sprite();
      SoilAniNode.addChild(this.SoilAni);
      plantOperedNode.addChild(SoilAniNode);
      this.SoilAni.pos(plantOperedNode._width/2,plantOperedNode._height/2);//设置动画的位置
      this.SoilAni.on(Laya.Event.COMPLETE,this,this.clearSoilAnimation);
    }
    
    createScoopAnimation(num,btnType,parentNode){ //num 1播种 2浇水
      operAnimType = num;
      btnTypeCode = btnType;
      plantOperedNode = parentNode;
      this.scoopIcon = this.owner.getChildByName("operPos").getChildByName("scoopBtn").getChildByName("scoop");
      this.scoopIcon.visible=false;
      
      let scoopAni = new Laya.Image();
      scoopAni.name = 'ScoopAniName';
      var scoopIMG ;
      if(Data.plantStatus==0){
        scoopIMG = "comp/icon.png"; 
      }else if(Data.plantStatus==1){
        scoopIMG = "comp/icon6.png";
        if(window.toolItemInfo!==null){
          var scoopID = window.toolItemInfo.itemid;
          var scoopIMG;
          if(scoopID==2001){
            scoopIMG = 'comp/icon6.png';
          }else if(scoopID==2002){
            scoopIMG = 'comp/icon12.png';
          }else if(scoopID==2003){
            scoopIMG = 'comp/icon13.png';
          }else if(scoopID==2004){
            scoopIMG = 'comp/icon14.png';
          }else if(scoopID==2005){
            scoopIMG = 'comp/icon15.png';
          }
        }
      }
      scoopAni.name = 'ScoopAniName';
      scoopAni.skin = scoopIMG; 
      scoopAni.interval=55;//设置帧动画的时间间隔
      plantOperedNode.addChild(scoopAni);
      scoopAni.y=-60;
      this.createTimerLine(scoopAni)
    }

    createTimerLine(target){
      var TimeLine = Laya.TimeLine,
			    Event = Laya.Event;
      let timeLine = new TimeLine();
      // addLabel(label:String, offset:Number) offset: 标签事件相对于上个动画的偏移时间(单位：毫秒)
      timeLine.addLabel("turnLeft", 0).to(target, {x:plantOperedNode._width/3, rotation:-25}, 500, null, 0)
        .addLabel("turnRight", 300).to(target, {x:plantOperedNode._width/1.8}, 500, null, 0)
        .addLabel("turnLeft", 200).to(target, {x:plantOperedNode._width/3}, 500, null, 0)
        .addLabel("turnRight", 200).to(target, {x:plantOperedNode._width/1.8}, 500, null, 0);
      timeLine.play(0,false,"scoop");//播放动画效果：从第0帧开始，循环播放，动画名称
      timeLine.on(Event.COMPLETE, this, this.clearScoopButton, [target]);
      timeLine.on(Event.LABEL, this, this.onLabel);
    }

    clearScoopButton(target){
      //获取当前植物容器
      this.treeBtn = this.owner.getChildByName("farmlandBox").getChildByName("treeBtn");
      this.scoopBtn = this.owner.getChildByName("operPos").getChildByName("scoopBtn");
      
      target.removeSelf();
      console.log("铲铲完成后销毁完成");
      if(Data.plantStatus==0){
        this.scoopBtn.texture = "comp/icon3.png";
      }else if(Data.plantStatus==1){
        this.scoopBtn.texture = "comp/icon2.png";
      }
      this.scoopIcon.visible=true;
      this.treeAnimation();
      
    }

    clearSoilAnimation(){
      console.log("铲土销毁完成")
      //热气球动画运行完成后销毁
      Laya.Animation.clearCache("soilAnimation.ani");
      Laya.Loader.clearRes("soilAnimation.ani");
      this.SoilAni.clear();
      this.SoilAni.destroy(true);
      this.SoilAni = null;
      this.scoopIcon.visible=true;
      this.gameUI.addTreeNode();
    }

    onLabel(label) {
      if(operAnimType==1){//1为播种
        //实现铲土效果

      }else{
        //实现浇水效果
        this.createWaterAnimation()
      }
    }

    createAbsentAnimation(nodeParend,levelValue,clearValue){
      for(var i=0;i<levelValue.length;i++){
        var aniConfPath,aniName;
        switch(levelValue[i].minerLevel) {
          case 1:
            aniConfPath = 'res/atlas/a2.atlas';//实习
            aniName = 'minerName1';
            break;
          case 2:
            aniConfPath = 'res/atlas/a3.atlas';//中级
            aniName = 'minerName3';
            break;
          case 3:
            aniConfPath = 'res/atlas/a4.atlas';//高级
            aniName = 'minerName4';
            break;
          case 4:
            aniConfPath = 'res/atlas/a5.atlas';//特级
            aniName = 'minerName5';
            break; 
          case 5:
          default:
        }
        //此处this.absentAni在每次进来之后都会初始化
        
        if(this.absentAni){
          this.absentAni.removeSelf();
          Laya.Pool.recover(aniName, this.absentAni);
          this.absentAni.clear();
          this.absentAni = null;
          Laya.Loader.clearRes(aniName, true);
        }
        Laya.loader.load(aniConfPath, Laya.Handler.create(this, this.loadAbsentAnimation(nodeParend,levelValue[i].minerLevel,aniConfPath,clearValue,i+1,aniName)), null, Laya.Loader.ATLAS);
        
      }
      
    }

    loadAbsentAnimation(nodeParend,levelValue,aniConfPath,clearValue,minerOrder,aniName) {
      this.absentAni = new Laya.Animation();
      nodeParend.addChild(this.absentAni);
      this.absentAni.loadAtlas(aniConfPath);	// 加载图集动画
      this.absentAni.interval = 55;			// 设置播放间隔（单位：毫秒）
      this.absentAni.name = aniName;			// 设置播放间隔（单位：毫秒）
      this.absentAni.index = 1;				// 当前播放索引
      
      if(minerOrder==1){
        this.absentAni.pos(-71, 184);
        this.absentAni.play(0,true,aniName);					// 播放图集动画
      }
      if(minerOrder==2){
        this.absentAni.pos(-58, 225);
        this.absentAni.play(0,true,aniName);					// 播放图集动画
      }
      if(minerOrder==3){
        this.absentAni.pos(112, 246);
        this.absentAni.scaleY = -1;
        this.absentAni.skewX = 180;
        this.absentAni.skewY = 180;
        this.absentAni.play(0,true,aniName);					// 播放图集动画
      }
      if(minerOrder==4){
        this.absentAni.pos(175, 226);
        this.absentAni.scaleY = -1;
        this.absentAni.skewX = 180;
        this.absentAni.skewY = 180;
        this.absentAni.play(0,true,aniName);					// 播放图集动画
      }
      if(minerOrder==5){
        this.absentAni.pos(132, 188);
        this.absentAni.scaleY = -1;
        this.absentAni.skewX = 180;
        this.absentAni.skewY = 180;
        this.absentAni.play(0,true,aniName);					// 播放图集动画
      }
      if(clearValue){
        this.absentAni.on(Laya.Event.COMPLETE,this,this.clearabsentAni(aniName));
      }
      console.log("1")
      
    }

    clearabsentAni(aniName){
      console.log("2")
      if(this.absentAni){
        this.absentAni.removeSelf();
        this.absentAni.clear();
        this.absentAni = null;
      }
    }
    treeAnimation(){
      Laya.Tween.to(this.treeAni,{
        height:this.treeAni._height-20,
      }, 400,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
        Laya.Tween.to(this.treeAni,{
          height:this.treeAni._height+20,
        }, 300,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
          Laya.Tween.to(this.treeAni,{
            height:this.treeAni._height-20,
          }, 200,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
            Laya.Tween.to(this.treeAni,{
              height:this.treeAni._height+20,
            }, 200,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
              this.gameUI.addTreeNode();
      　　  },null,true));
    　　  },null,true));
  　　  },null,true));
　　  },null,true));
      
    }
}
