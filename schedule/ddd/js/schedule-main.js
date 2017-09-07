var self;
mui.init({
	swipeBack: true //启用右滑关闭功能

});
mui.plusReady(function() {
	self = plus.webview.getWebviewById('../../views/schedule/schedule-main.html');
	mui('.scroll').scroll({
		indicators: false //是否显示滚动条
	});

})

//[id,title,start,end，全天日程，跨日日程,循环日程,theme,'','']          
var view = 'day';﻿
var op = {
	view: view,
	theme: 5,
	showday: new Date(),
	EditCmdhandler: Edit,
	ViewCmdhandler: View,
	onWeekOrMonthToDay: wtd,
	onBeforeRequestData: cal_beforerequest,
	onAfterRequestData: cal_afterrequest,
	onRequestDataError: cal_onerror,
	eventItems: [],
	extParam: {
		name: "act",
		value: "QueryEmployeeScheduleLis"
	},
	url: "http://192.168.2.156:8080/Mobile/EMP/EmployeeHandler.ashx?act=QueryEmployeeScheduleList",
	tgtimeFormat: 'H时',
	autoload: true

};﻿
var $dv = $("#calhead");
var _MH = document.documentElement.clientHeight;
var dvH = $dv.height() + 2;
op.height = _MH - dvH;

var p = $(".gridcontainer").bcalendar(op).BcalGetOp();
if(p && p.datestrshow) {
	$("#txtdatetimeshow").text(p.datestrshow);
}

function Edit(data) {
	var eurl = "";
	if(data) {
		var url = StrFormat(eurl, data);
		OpenModelWindow(url, {
			width: 600,
			height: 400,
			caption: "管理日程",
			onclose: function() {
				$(".gridcontainer").BCalReload();
			}
		});
	}
}

function cal_datas() {
	console.log(result.errorCode)
}

function View(data) {
	var vurl = "";
	if(data) {
		var extrasDatas = {
			editId: data[0],
			events: data[1],
			startTime: data[2],
			endTime: data[3],
			isEdit: true
		}
		mui.openWindow({
			url: 'schedule-add.html',
			id: 'schedule-add.html',
			extras: extrasDatas
		})
	}
}

function cal_beforerequest(type) {
	var t = "正在加载数据...";
	switch(type) {
		case 1:
			t = "正在加载数据...";
			break;
		case 2:
		case 3:
		case 4:
			t = "正在处理请求...";
			break;
	}
	$("#errorpannel").hide();
	$("#loadingpannel").html(t).show();
}

function cal_afterrequest(type) {
	switch(type) {
		case 1:
			$("#loadingpannel").hide();
			break;
		case 2:
		case 3:
		case 4:
			$("#loadingpannel").html("操作成功!");
			window.setTimeout(function() {
				$("#loadingpannel").hide();
			}, 2000);
			break;
	}

}

function cal_onerror(type, data) {
	$("#errorpannel").show();
}

function wtd(p) {
	if(p && p.datestrshow) {
		$("#txtdatetimeshow").text(p.datestrshow);
	}
	$("#caltoolbar div.fcurrent").each(function() {
		$(this).removeClass("fcurrent");
	})
	$("#showdaybtn").addClass("fcurrent");
}
//显示日视图
$("#showdaybtn").click(function(e) {
	$("#caltoolbar div.fcurrent").each(function() {
		$(this).removeClass("fcurrent");
	})
	$(this).addClass("fcurrent");
	var p = $(".gridcontainer").BCalSwtichview("day").BcalGetOp();
	if(p && p.datestrshow) {
		$("#txtdatetimeshow").text(p.datestrshow);
	}
});
