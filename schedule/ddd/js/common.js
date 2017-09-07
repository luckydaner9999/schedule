window.server = 'http://192.168.2.156:8080/';
//window.server = 'http://192.168.2.191:60289/';
//window.server = 'http://192.168.2.2:9000/';
//window.server = 'http://szstarfang.jios.org:11224/';
//window.server = 'http://manage.starfang.com/';
window.resourceServer = 'http://192.168.2.188:6789';
//window.resourceServer = 'http://starfang-mobile.oss-cn-hangzhou.aliyuncs.com';

//当前选中项目
window.currentProject = "";
var waitingModal, waitingInterval;

//workaround for old app: reset root em
document.documentElement.style['font-size'] = (document.documentElement.clientWidth || localStorage.deviceWidth) / 20 + 'px';

(function(w) {
	w.WatchPositionInterval = 60000;

	w.showAlert = function(title, content, callback) {
		mui.alert(content, title, callback);
	};
	w.showConfirm = function(title, content, success, failure, btnArray) {
		btnArray = btnArray || ['否', '是'];
		mui.confirm(content || ' ', title || ' ', btnArray, function(e) {
			try {
				if(e.index == 1) {
					if(success)
						success();
				} else {
					if(failure)
						failure();
				}
			} catch(e) {}

		});
	};
	w.showToast = function(content) {
		mui.toast(content);
	};
	w.showWaiting = function(title, autoHideSec) {
		if(!plus) {
			return;
		}
		waitingModal = plus.nativeUI.showWaiting(title);
		//如果定时隐藏
		autoHideSec = autoHideSec || 10;
		waitingModal.onclose = function() {
			clearInterval(waitingInterval);
		}

		var waitingInterval = setInterval(function() {
			autoHideSec--;
			if(autoHideSec <= 0) {
				waitingModal.close();
				clearInterval(waitingInterval);
			}
		}, 1000);
	};
	w.hideWaiting = function() {
		if(waitingModal) {
			waitingModal.close();
		}
	};
	w.createCoverImage = function(url) {
		var img = new Image();
		img.src = url;
		img.onload = function() {
			if(this.width > this.height) {
				this.style.height = '100%';
			} else {
				this.style.width = '100%';
			}
		}
		return img;
	};
	w.createContainImage = function(url) {
		var img = new Image();
		img.src = url;
		img.onload = function() {
			if(this.width > this.height) {
				this.style.width = '100%';
			} else {
				this.style.height = '100%';
			}
		}
		return img;
	};
	w.checkPhoneNumber = function(tel) {
		var re = /^1\d{10}$/;
		return re.test(tel)
	};
	w.ajax = function(opt) {
		function fn() {}

		function _onStateChange(xhr, success, failure) {
			if(xhr.readyState == 4) {
				var s = xhr.status;
				try {
					clearTimeout(timer);

					if(s >= 200 && s < 300) {
						typeof scope == "undefinde" ? success(JSON.parse(xhr.responseText), s) : success.call(scope, JSON.parse(xhr.responseText), s)
					} else {

						typeof scope == "undefinde" ? failure(JSON.parse(xhr.responseText), s) : failure.call(scope, JSON.parse(xhr.responseText), s)
					}
				} catch(e) {}

				typeof scope == "undefinde" ? after() : after.call(scope);
			} else {}
		}

		//添加服务器路径
		var url = window.server + opt.url || window.server,
			async = opt.async !== false,
			type = opt.type || "GET",
			encode = opt.encode || "UTF-8",
			data = opt.data || null,
			before = opt.before || fn,
			after = opt.after || fn,
			success = opt.success || fn,
			failure = opt.failure || fn,
			timeout = opt.timeout || 10000,
			scope = opt.scope,
			isTimeOut = false;
		dataType = opt.dataType || "", type = type.toUpperCase();
		if(data && typeof data == "object") {
			//二级以下参数全部序列化
			for(var item in data) {
				if(typeof data[item] == 'object') {
					data[item] = JSON.stringify(data[item]);
				}
			}

			data = jsonToStr(data)
		}
		if(type == "GET" && data) {
			url += (url.indexOf("?") == -1 ? "?" : "&") + data;
			data = null
		}
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		xhr.onreadystatechange = function() {
			_onStateChange(xhr, success, failure)
		};
		xhr.open(type, url, async);
		//添加验证头部
		xhr.setRequestHeader("Token", localStorage.token);
		if(type == "POST") {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + encode)
		}
		if(dataType == "xml") {
			xhr.setRequestHeader("Content-Type", "text/xml")
		}
		typeof scope == "undefinde" ? before() : before.call(scope);
		xhr.send(data);

		//设置请求超时
		var timer = setTimeout(function() {
			showToast('当前网络连接超时')
			isTimeOut = true;
			//xhr.abort();
		}, timeout);

		return xhr
	};
	w.getStyleServer = function(url) {
		if(url.length > 0) {
			for(var i = 0; i < url.length; i++) {
				var urlStr = url[i].href.split('#');
				if(urlStr[1]) {
					url[i].href = window.resourceServer + urlStr[1];
				}
			}

		}

	}
	w.jsonToStr = function(obj, bol) {
		if(typeof bol == 'undefined') bol = true;
		var a = [],
			val = null;
		for(var k in obj) {
			val = obj[k];
			if(typeof val == 'undefined' || val == null) {
				val = ''
			}
			if(val.constructor == 'Array') {
				for(var i = 0,
						len = val.length; i < len; i++) {
					bol ? a.push(k + '=' + encodeURIComponent(val[i])) : a.push(k + '=' + val[i])
				}
			} else {
				bol ? a.push(k + '=' + encodeURIComponent(val)) : a.push(k + '=' + val)
			}
		}
		return a.join('&');
	}
	w.showInDev = function() {
		showToast('努力研发中!');
	}
	w.getErrorMsg = function(code) {
		for(var i = 0, length = errorDes.length; i < length; i++) {
			if(errorDes[i].code == code) {
				return errorDes[i].msg;
			}
		}
		return '';
	}
	w.writeJSResource = function(path) {
		document.write('<scr' + 'ipt src="' + resourceServer + path +'?v='+(new Date()).getTime()+'"></scr' + 'ipt>');
	}

	w.errorDes = [{
			code: -240102,
			msg: 'Token过期'
		},
		{
			code: -240101,
			msg: '请求的Token无效'
		},
		{
			code: -240100,
			msg: '请更新APP版本'
		},
		{
			code: -240099,
			msg: '请选择城市'
		}
	]
})(window)

function ajaxRequest(path, type, requestData, successFun, errorFun) {
	$.ajax({
		url: server + path,
		type: type,
		data: requestData,
		success: function(data) {
			try {
				successFun(data);
			} catch(e) {

			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if(textStatus == 'timeout') {
				XMLHttpRequest.abort();
				mui.toast('网络连接有问题哦！');
			}
			if(errorFun) {
				errorFun(XMLHttpRequest, textStatus, errorThrown);
			}
		},
		beforeSend: function(xhr) {
			//xhr.setRequestHeader("Token", '9685773F-91BF-4490-B7BE-9F30364863E4');
			xhr.setRequestHeader("Token", localStorage.token);
		}
	});
}

Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//剪切图片
function cropImg(src, options, success) {
	//默认清晰度
	var defaultQuality = 1;

	var img = new Image();
	img.src = src;

	img.onload = function() {
		var that = this;

		//生成比例
		var orignal_width = that.width,
			orignal_height = that.height,
			orignal_scale = that.width / that.height;
		var cut_width, cut_height;
		var w, h, scale;
		//有详细尺寸
		if(options.width && options.height) {
			scale = options.width / options.height;
			if(scale >= orignal_scale) {
				cut_width = orignal_width;
				cut_height = cut_width / scale;
			} else {
				cut_height = orignal_height;
				cut_width = cut_height * scale;
			}
			w = options.width;
			h = options.height;
		}
		//有比例
		else if(options.ratio_width && options.ratio_height) {
			scale = options.ratio_width / options.ratio_height;
			//先计算比例
			if(scale >= orignal_scale) {
				cut_width = orignal_width;
				cut_height = cut_width / scale;
			} else {
				cut_height = orignal_height;
				cut_width = cut_height * scale;
			}
			//参数中有宽度或者高度限定
			if(options.width) {
				w = options.width;
				h = w / scale;
			} else if(options.height) {
				h = options.height;
				w = h * scale;
			} else {
				w = cut_width;
				h = cut_height;
			}
		}
		//仅有宽度
		else if(options.width) {
			scale = orignal_scale;
			cut_width = orignal_width;
			cut_height = orignal_height;
			w = options.width;
			h = w / scale;
		}
		//仅有高度
		else if(options.height) {
			scale = orignal_scale;
			cut_width = orignal_width;
			cut_height = orignal_height;
			h = options.height;
			w = h * scale;
		}
		//没有限制
		else {
			cut_width = orignal_width;
			cut_height = orignal_height;
			if(orignal_width >= 1500) {
				w = 1500;
				h = w / orignal_scale;
			} else {
				w = orignal_width;
				h = orignal_height;
			}

		}
		//alert('orignal_width:' + orignal_width + '  ' + 'orignal_height:' + orignal_height + '  ' + 'cut_width:' + cut_width + '  ' + 'cut_height:' + cut_height + '  ' + 'w:' + w + '  ' + 'h:' + h + '  ')

		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, (orignal_width - cut_width) / 2, (orignal_height - cut_height) / 2, cut_width, cut_height, 0, 0, w, h);

		/**
		 * 生成base64
		 * 兼容修复移动设备需要引入mobileBUGFix.js
		 */
		var base64 = canvas.toDataURL('image/jpeg', options.quality || defaultQuality);

		// 修复IOS
		if(navigator.userAgent.match(/iphone/i)) {
			var mpImg = new MegaPixImage(img);
			mpImg.render(canvas, {
				maxWidth: w,
				maxHeight: h,
				quality: options.quality || defaultQuality
			});
			base64 = canvas.toDataURL('image/jpeg', options.quality || defaultQuality);
		}

		// 修复android
		if(navigator.userAgent.match(/Android/i)) {
			var encoder = new JPEGEncoder();
			base64 = encoder.encode(ctx.getImageData(0, 0, w, h), options.quality * 100 || defaultQuality * 100);
		}

		// 生成结果
		var result = {
			base64: base64,
			clearBase64: base64.substr(base64.indexOf(',') + 1)
		};

		// 执行后函数
		success(result, w, h);
	}
}

//拨打电话记录
getStyleServer(document.getElementsByTagName('link'));