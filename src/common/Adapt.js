export default new class Adapt{
    init(view){
        let baseH=1400, stageH=Laya.stage.height;
        let ratio=stageH/baseH;
        this.ratio=ratio;
        console.log('ratio:', ratio);
        
        /**头像 */
        let rec1=view.rec1;
        /**金币 */
        let rec2=view.rec2;
        /**钻石 */
        let rec3=view.rec3;
        /**加速 */
        // let js=view.js;
        /**种植水果的土地 */
        let farmlandBox=view.farmlandBox;
        /**兑换中心 */
        let exChange=view.exChange;
        /**矿场 */
        let goldRushBox=view.goldRushBox;
        /**兑换记录 */
        let exchangeList=view.exchangeList;
        /**播种，浇水操作按钮 */
        let operPos=view.operPos;
        /**转盘 */
        let lunckyDial=view.lunckyDial;
        /**任务 */
        let task=view.task;
        /**背包 */
        let backpack=view.backpack;
        /**太阳 */
        let sun=view.sun;
        /**赚钱 */
        let makeMoney=view.makeMoney;
        /**省钱 */
        let saveMoney=view.saveMoney;

        farmlandBox.centerX=0;
        farmlandBox.centerY=360*ratio;
        // exchangeList.centerY=250*ratio;
        
        if(stageH<baseH){
            rec1.y*=ratio;
            rec2.y*=ratio;
            rec3.y*=ratio;
            backpack.y*=ratio;
            exchangeList.y*=ratio;
            // js.y*=(ratio+0.1);
            sun.y*=ratio;
            makeMoney.x*=ratio;
            saveMoney.x*=ratio;
            saveMoney.x*=ratio;
            task.bottom*=ratio*3;
            task.left*=ratio*2;
            // rec1.scale(ratio, ratio);
            // rec2.scale(ratio, ratio);
            // rec3.scale(ratio, ratio);

            farmlandBox.scale(ratio, ratio);
            exChange.scale(ratio, ratio);
            goldRushBox.scale(ratio, ratio);
            operPos.scale(ratio, ratio);
            lunckyDial.scale(ratio, ratio);
            task.scale(ratio, ratio);
            sun.scale(ratio, ratio);
            backpack.scale(ratio*1.15, ratio*1.15);
            exchangeList.scale(ratio*1.15, ratio*1.15);
            makeMoney.scale(ratio*1.1, ratio*1.1);
            saveMoney.scale(ratio*1.1, ratio*1.1);

            // lunckyDial.bottom*=ratio;

            exChange.centerY=-140*ratio;
            goldRushBox.centerY=-260*ratio;
        }
    }
}