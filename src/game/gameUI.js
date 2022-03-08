import gameControl from "./gameControl";
import {ajax} from "../units/ajax.js";
import URL from "../units/url.js";
import { scaleXY2,createSprite,createText,secretKey,createProgressBar,createImage,dateChangeFormat,Djs_timeList,decrypt} from "../units/units.js";
//调优化代码文件
import { setFarmland,setOperBtn,setLunckyDial } from "../units/setFarmland.js";
import Data from "../common/Data";
export default class gameUI extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:growValue, tips:"成长值", type:Node, default:null}*/
        /** @prop {name:growName, tips:"成长文字", type:Node, default:null}*/
        /** @prop {name:sun, tips:"光照", type:Node, default:null}*/
    }

    //种树
    addTreeNode(){
      //并将铲铲按钮更换为浇水按钮
      this.operPos = this.owner.getChildByName("operPos").getChildByName("scoopBtn");
      this.lunckyTipBox = this.owner.getChildByName("operPos").getChildByName("lunckyTipBox");
      this.landFrameBox = this.owner.getChildByName("farmlandBox");
      this.growName = this.owner.getChildByName("grow");
      this.sun = this.owner.getChildByName("sun");
      this.growValue = this.growName.getChildByName("growValue");
      //获取转盘节点
      this.lunckyNumImg  = this.owner.getChildByName("lunckyDial");//转盘次数容器
      this.getFameLandInfo()
    }

    //查看植物信息接口
    getFameLandInfo(){
      var that = this;
      ajax({
        type: 'POST',
        url: URL.getPlantInfo,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success: function(response){
          var famelandData = response;
          
          for(var i=0;i<famelandData.data.resources.length;i++){
            if(famelandData.data.resources[i].resCode==='p_0'){
              famelandData.data.resources[i].width = 106;
              famelandData.data.resources[i].height = 182;
              famelandData.data.resources[i].Px = 121;
              famelandData.data.resources[i].Py = -114;
            }else if(famelandData.data.resources[i].resCode==='p_1'){
              famelandData.data.resources[i].width = 162;
              famelandData.data.resources[i].height = 188;
              famelandData.data.resources[i].Px = 86;
              famelandData.data.resources[i].Py = -127;
            }else if(famelandData.data.resources[i].resCode==='p_2'){
              famelandData.data.resources[i].width = 237;
              famelandData.data.resources[i].height = 314;
              famelandData.data.resources[i].Px = 56;
              famelandData.data.resources[i].Py = -230;
            }else if(famelandData.data.resources[i].resCode==='p_3'){
              famelandData.data.resources[i].width = 220;
              famelandData.data.resources[i].height = 346;
              famelandData.data.resources[i].Px = 75;
              famelandData.data.resources[i].Py = -254;
            }else if(famelandData.data.resources[i].resCode==='p_4'){
              famelandData.data.resources[i].width = 269;
              famelandData.data.resources[i].height = 372;
              famelandData.data.resources[i].Px = 29;
              famelandData.data.resources[i].Py = -280;
            }else if(famelandData.data.resources[i].resCode==='p_5'){
              famelandData.data.resources[i].width = 385;
              famelandData.data.resources[i].height = 454;
              famelandData.data.resources[i].Px = -20;
              famelandData.data.resources[i].Py = -385;
            }else if(famelandData.data.resources[i].resCode==='p_6'){
              famelandData.data.resources[i].width = 388;
              famelandData.data.resources[i].height = 454;
              famelandData.data.resources[i].Px = -19;
              famelandData.data.resources[i].Py = -385;
            }else if(famelandData.data.resources[i].resCode==='p_7'){
              famelandData.data.resources[i].width = 386;
              famelandData.data.resources[i].height = 454;
              famelandData.data.resources[i].Px = -19;
              famelandData.data.resources[i].Py = -385;
            }else if(famelandData.data.resources[i].resCode==='p_8'){
              famelandData.data.resources[i].width = 386;
              famelandData.data.resources[i].height = 454;
              famelandData.data.resources[i].Px = -19;
              famelandData.data.resources[i].Py = -385;
            }else if(famelandData.data.resources[i].resCode==='p_9'){
              famelandData.data.resources[i].width = 386;
              famelandData.data.resources[i].height = 454;
              famelandData.data.resources[i].Px = -19;
              famelandData.data.resources[i].Py = -385;
            }
          }
          //根据种植状态更改种植操作按钮
          Data.plantStatus = famelandData.data.status;
          that.setComponentUI(famelandData);
          //经验增长效果
          var stepProcessPercent = Number(famelandData.data.exp - Data.stepProcessPercent);
          Data.stepProcessPercent = famelandData.data.exp;
          if(famelandData.data.processStepIndex!==0){
            setTimeout(function(){
              that.createGVAnimation(stepProcessPercent);
            },200)
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    //根据接口返回调整UI界面（如操作按钮icon,当前农作物icon,弹窗样式）
    setComponentUI(famelandData){
      //获取进度条 给进度条赋值
      // this.fameLandProbar = this.owner.farmlandBox.getChildByName("framProgressbar");
      // this.parentNode = this.fameLandProbar.getChildByName("parentNode");
      // var stepProcessPercent = Number((famelandData.stepProcessPercent/100).toFixed(2));//经验值
      // this.fameLandProbar.value = stepProcessPercent
      // this.parentNode.text = famelandData.stepProcessPercent+'%';
      //获取农田节点
      setFarmland(this.landFrameBox,famelandData,this.sun)
      setOperBtn(this.operPos,famelandData)
      setLunckyDial(this.lunckyNumImg,this.lunckyTipBox,famelandData)
    }

    createGVAnimation(stepProcessPercent){
      this.growValue.text = '+'+stepProcessPercent;
      this.growValue.visible = true;
      this.growName.visible = true;
      this.growName.zOrder = 10;
      this.growValue.zOrder = 10;
      this.growName.alpha = 1;
      this.growValue.alpha = 1;
      Laya.Tween.to(this.growValue,{
        y: 4,
      },1000,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
        //添加动画效果 动画完成后执行Handler处理器的方法;
        Laya.Tween.to(this.growValue,{
          alpha: 0,
        },200,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
          //添加动画效果 动画完成后执行Handler处理器的方法;
          this.clearGrowAnimation(this.growValue)
        }))
      }))
      Laya.Tween.to(this.growName,{
        y: 520,
      },1000,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
        //添加动画效果 动画完成后执行Handler处理器的方法;
        Laya.Tween.to(this.growName,{
          alpha: 0,
        },200,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
          //添加动画效果 动画完成后执行Handler处理器的方法;
          this.clearGrowAnimation(this.growName)
        }))
      }))
    }
    clearGrowAnimation(Node){
      this.growValue.visible = false;
      this.growName.visible = false;
      this.growValue.y = 5.5;
      this.growName.y = 577;
    }
  

}
