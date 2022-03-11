// var baseUrl = "https://test-kk.baomihua.com:9022" /**测试地址 */
var baseUrl = "https://appgame-plant-1001.baomihua.com:8098" /**正式地址 */
// var baseUrl = "http://192.168.30.31:8188" /**本地 */
// var baseUrl='http://192.168.1.79:8188'

var URL = {
    getFarmInfo: baseUrl+'/user/getFarmInfo', /**获取用户信息 */
    getPlantInfo: baseUrl+'/user/getPlantInfo', /**获取植物信息 */
    getPackageInfo: baseUrl+'/user/getPackage', /**获取背包信息 */
    getUseBackpackInfo: baseUrl+'/user/UseItem', /**背包使用信息 */
    operSeed: baseUrl+'/user/seed', /**播种 */
    operHarvest: baseUrl+'/user/harvest', /**收获 */
    getExchangeHistory: baseUrl+'/user/getExchangeHistory', /**滚动屏 */
    operWatering: baseUrl+'/user/watering', /**浇水 */
    getExchangeList: baseUrl+'/user/getExchangeList', /**兑换中心兑换动态 */
    getChangePackage: baseUrl+'/user/getChangePackage', /**兑换中心我的水果 */
    sellForJewel: baseUrl+'/api/exchange/sellForJewel', /**水果出售 */
    jewJelExchange: baseUrl+'/api/exchange/exchange', /**兑换中心钻石兑换 */
    authentication: baseUrl+'/api/security/getUserToken', /**用户鉴权 */ 
    earnPrize: baseUrl+'/api/task/earnPrize',  /**领取奖励 */
    getInfoAndList: baseUrl+'/api/wheel/getInfoAndList', /**转盘奖励 */
    getlottery: baseUrl + '/api/wheel/lottery', /**抽奖 */
    getStatusInfo: baseUrl + '/api/wheel/getStatusInfo', /**获取转盘按钮状态 */
    addChance: baseUrl + '/api/wheel/addChance', /**增加次数 */
    getRadomList: baseUrl + '/api/bdx/getRadomList', /**获取比大小的数据 */
    checkResult: baseUrl + '/api/bdx/checkResult', /**获取比大小的结果 */
    getAllTasks: baseUrl + '/api/task/getAllTasks', /**任务系统 */
    daySignIn: baseUrl + '/api/task/daySignIn', /**天签到 */
    placeInsOrder: baseUrl + '/api/v1/order/placeInsOrder', /**提交内部订单 */
    getInfo: baseUrl + '/api/qa/getInfo', /**获取问题 */
    checkA: baseUrl + '/api/qa/checkA', /**问答校验 */
    /**获取矿场信息 */
    getMineInfo:baseUrl + '/mine/getMineInfo', 
    /**矿工升级 */
    minerLevelUp:baseUrl + '/mine/minerLevelUp', 
    /**购买矿工 */
    buyMiner:baseUrl + '/mine/buyMiner', 
    /**矿场升级 */
    mineLevelUp:baseUrl + '/mine/mineLevelUp', 
    /**矿场收获 */
    harvest:baseUrl + '/mine/harvest', 
    getGoodsList:baseUrl + '/api/exchange/getGoodsList', /**兑换记录商品列表 */
    listRecord:baseUrl + '/api/exchange/listRecord', /**兑换记录订单列表 */
    GetArea:baseUrl + '/Order/GetArea', /**地址集合 */
    addUserAddress:baseUrl + '/order/addUserAddress', /**添加用户地址 */
    getUserAddress:baseUrl + '/order/getUserAddress', /**获取用户地址 */
    removeUserAddress:baseUrl + '/order/removeUserAddress', /**删除用户地址 */
    getOrders:baseUrl + '/order/getOrders', /**水果订单 */
    AddOrder:baseUrl + '/order/AddOrder', /**兑换 */
    getUserPrizes:baseUrl + '/api/wheel/getUserPrizes', /**抽奖记录 */
    getExchangeListV2:baseUrl + '/user/getExchangeListV2', /**抽奖记录 */

    
    
    
    
    
    
    
};
export default URL;