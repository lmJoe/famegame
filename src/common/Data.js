export default {
    token:'',
    /**电力值 */
    coin:0,
    /**钻石*/
    jewel:0,
    /**经验 */
    exp:0,
    /**水果id */
    fruitpID:'',
    /**订单详情 */
    orderMsg:{}, 
    /**新增地址页面来源 2-兑换记录 1-订单确认 以最终返回界面为准*/
    addressPageType:'',
    /**植物状态 */
    plantStatus:'',
    /**浇水需要的金币数 */
    waterNeedCoinNum:0,
    /**判断兑换中心是否选中左边按钮 */
    selectNum:0,
    /**订单地址id */
    addressID:'',
    /**地址收货人*/
    addressName:'',
    /**地址联系方式*/
    addressMobile:'',
    /**地址详情*/
    addressIntro:'',
    /**用户等级 */
    level:0,
    commonPoint1:'',/**播种和浇水全局位置 */
    commonPoint2:'',/**兑换中心种子全局位置 */
    commonPoint3:'',/**矿洞的全局位置 */
    commonPoint4:'',/**招募工人的全局位置 */
    commonPoint5:'',/**招募工人的全局位置 */
    pointSize1:{},/**播种和浇水的当前位置和高宽 */
    pointSize3:{},/**播种和浇水的当前位置和高宽 */
    pointSize4:{},/**招募工人高宽 */
    pointSize5:{},/**招募工人高宽 */
    buyMinerVal:false,/**是否已购买 */
    fruitNum:0,//当前用户拥有水果数量
    userLogo:'',//用户进入农场产生的随机标识
    durNum:0,/**用户停留界面时长 */
    userId:'',/**当前用户id */
    exChangedurNum:0,/**兑换中心停留时长 */
    appVer:'',/**应用版本号 */
    seedStatus:false,/**当前是否已种植 */
    stepProcessPercent:0,/**保存经验增长值 */
    plantStatus:0,/**当前植物种植状态：未播种，已播种待交水，待收货 */
    makeMoneyid:'',//赚钱id
    makeMoneydir:'',//赚钱url
    saveMoneydir:'',//省钱url
    treeHeight:0,//植物高度
}