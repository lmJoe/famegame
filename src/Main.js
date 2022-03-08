import Polyfill from "./common/Polyfill";
import GameConfig from "./GameConfig";
import Scenes from "./common/Scenes";

class Main {
  constructor() {
    Config.useWebGL2 = false;
    //根据IDE设置初始化引擎		
    if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    //设置适配模式
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    //解决黑屏
    Laya.Stat.show(0, 0);
    Laya.Stat.hide();
    UIConfig.popupBgAlpha = 0.85;

    //兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError(true);

    //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
  }

  onVersionLoaded() {
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  }

  onConfigLoaded() {
    Laya.Scene.open(Scenes.StartLoading, true, null, Laya.Handler.create(this, (loadingScene)=>{
      var imgData = [
        { url: "res/atlas/comp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/atlas/toastani.atlas", type: Laya.Loader.ATLAS },
        { url: "res/atlas/jewelani.atlas", type: Laya.Loader.ATLAS },
      ];
      //设置progress Handler的第4个参数为true，根据加载文件个数获取加载进度
      Laya.loader.load(imgData, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(loadingScene, loadingScene.onProgress, null, false));
    }))
  }

  onLoaded() {
    GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
  }
}
//激活启动类
new Main();