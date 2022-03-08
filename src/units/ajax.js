/* eslint-disable */
import Data from "../common/Data.js";
import Scenes from "../common/Scenes.js";
import { decrypt, secretKey, getQueryVariable, getCookie } from "./units.js";
var ajaxCode = getQueryVariable("code");
var ajaxAppid = getQueryVariable("appId");
var ajaxPlatformId = getQueryVariable("platformId");

function ajax (options){
  /**@type {XMLHttpRequest} */
  let xhr = null, retry=0, retryMax=0, retryTime=1000, errMsg='request failed';
  let params = formsParams(options.data);
  //创建对象
  if(window.XMLHttpRequest){
      xhr = new XMLHttpRequest()
  } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  function send(){
    //获取当前url中的keycode
    if(options.type == "GET"){
        xhr.open(options.type,options.url + "?"+ params);
        xhr.send(null)
    } else if(options.type == "POST"){
        xhr.open(options.type,options.url);
        if(options.contentType){
          xhr.setRequestHeader("Content-Type",options.contentType);
          xhr.setRequestHeader("keyCode",getCookie("userToken")?getCookie("userToken"):Data.token);
          xhr.setRequestHeader("code",ajaxCode);
          xhr.setRequestHeader("appId",ajaxAppid);
          xhr.setRequestHeader("platformId",ajaxPlatformId);
        }else{
          xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
          xhr.setRequestHeader("keyCode",getCookie("userToken")?getCookie("userToken"):Data.token);
          xhr.setRequestHeader("code",ajaxCode);
          xhr.setRequestHeader("appId",ajaxAppid);
          xhr.setRequestHeader("platformId",ajaxPlatformId);
        }
        xhr.send(params);
    }
  }
  send();

  xhr.ontimeout=()=>{
    console.log('time out');
    errMsg='time out';
  }

  xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        if (xhr.status == 200) {
          let data=xhr.response;
          if(options.decrypt!=false){
            let reg = /^["|'](.*)["|']$/g;
            data= data.replace(reg,"$1");
            data=decrypt(data, secretKey);
          }
          if(data!==''){
            data=JSON.parse(data);
          }
          if(data.code==-1){
            errMsg=data.msg;
            errorHandler();
          }else{
            console.log(options.url, data);
            options.success(data);
          }
        }else{
          if(retry<retryMax){
            retry++;
            console.log('http error, retry: '+retry);
            setTimeout(() => {
              send();
            }, retryTime*retry);
          }else{
            if(xhr.status){
              errMsg=xhr.status;
            }
            errorHandler();
          }
        }
      }
  }

  function errorHandler(){
    if(options.error){
      options.error(errMsg);
    }else{
      Laya.Dialog.open(Scenes.Tip, true, {content:errMsg, handler:()=>{
        window.location.reload();
      }});
    }
  }

  function formsParams(data){
      var arr = [];
      for(var prop in data){
          arr.push(prop + "=" + data[prop]);
      }
      return arr.join("&");
  }
}
export{
  ajax
}