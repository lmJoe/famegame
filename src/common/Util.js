import Config from "./Config";

export default new class Util{
    getOnlineAssets(url){
        if(url.indexOf('http')>-1) return url;
        if(url.substr(0, 2)=='./') return Config.baseResourceUrl+url.substr(2);
        return Config.baseResourceUrl+url;
    }

    showHandTip(){
        let sp=Laya.Pool.getItemByCreateFun('hand', ()=>{
            let sp=new Laya.Sprite();
            let spHand=new Laya.Sprite();
            spHand.texture='comp/icon23.png';
            spHand.scale(0.8, 0.8);
            sp.addChild(spHand);

            let tl=new Laya.TimeLine();
            sp.tlMove=tl;
            tl.to(spHand, {x:15, y:15}, 600).to(spHand, {x:0, y:0}, 600);
            
            return sp;
        })
        return sp;
    }

    removeHandTip(target){
        target.tlMove.pause();
        target.removeSelf();
        Laya.Pool.recover('hand', target);
    }
}