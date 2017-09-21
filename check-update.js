/**
 * Created by gaodandan on 2017/9/21.
 */
var stfVer = null;
function plusReady(){
    // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        stfVer=inf.version;
        console.log("当前应用版本：" + stfVer);
        console.log("=================版本测试=================");
    });

}

if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
    document.addEventListener('plusready',checkUpdate,false);
}

// 检测更新
var checkUrl="/Mobile/Shared/CommonRequest.ashx";
function checkUpdate(){
    //plus.nativeUI.showWaiting("检测更新...");
    var param = {
        act: 'CheckDevice',
        info: getDeviceInfo()
    };
    ajax({
        url:checkUrl,
        data: param,
        success:function(result){
            if(!InDebug && result.errorCode === -240100) {
                showConfirm('提示','检查到新版本是否更新',sureUpdate,cancelUpdate);

        }


        }

    })

}
function sureUpdate(){
    console.log('更新');
    downWgt();
}
function cancelUpdate(){
    plus.nativeUI.alert("无新版本可更新！");
}
function getDeviceInfo() {

    var info = {};
    info.model = plus.device.model;
    info.vendor = plus.os.vendor;
    info.deviceId = plus.device.uuid;
    info.resolution = plus.screen.resolutionWidth * plus.screen.scale + " x " + plus.screen.resolutionHeight * plus.screen.scale;
    info.osName = plus.os.name;
    info.osVersion = plus.os.version;
    info.appVersion = plus.runtime.version;
    var types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
    types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
    types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
    types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
    types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
    info.netWork = types[plus.networkinfo.getCurrentType()];
    return info;
}

// 下载stf文件
var stfUrl = "http://starfang-mobile.oss-cn-hangzhou.aliyuncs.com/APP/starfang100.apk";

function downWgt(){
    plus.nativeUI.showWaiting("正在更新App");

    plus.downloader.createDownload( stfUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) {
            console.log("下载stf成功："+d.filename);
            installStf(d.filename); // 安装wgt包
        } else {
            console.log("下载stf失败！");
            plus.nativeUI.alert("下载stf失败！");
        }
        plus.nativeUI.closeWaiting();
    }).start();
}

// 更新应用资源
function installStf(path){
    plus.nativeUI.showWaiting("安装stf文件...");
    // force:false进行版本号校验，如果将要安装应用的版本号不高于现有应用的版本号则终止安装，并返回安装失败
    plus.runtime.install(path,{force:false},function(){
        plus.nativeUI.closeWaiting();
        console.log("安装stf文件成功！");
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.closeWaiting();
        console.log("安装stf文件失败[" + e.code + "]：" + e.message);
        plus.nativeUI.alert("安装stf文件失败[" + e.code + "]：" + e.message);
    });
}
