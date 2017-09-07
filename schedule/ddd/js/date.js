var container = $('.swiper-container1 .swiper-wrapper');
var template = $('#template .swiper-slide');
var firstSunday, lastSunday;
var today = new Date();
var currentday = today.Format('yyyy.MM.dd');
var mySwiper, mySwiper2;
var selectedDate = new Date();
var items;
var startDateArray = [];
var eventList = [];
var warning = $('#template .remarks');

$(function() {
	bindData();
	addCurrentDate();
	//初始化日程表一
	mySwiper = new Swiper('.swiper-container1', {
		loop: false,
		width: window.innerWidth,
		onSlidePrevEnd: function(swiper) {
			var newDate = addDate(selectedDate, -7);
			selectDate(newDate);
			mySwiper2.slidePrev(false);

		},
		onSlideNextEnd: function(swiper) {
			var newDate = addDate(selectedDate, 7);
			selectDate(newDate);
			mySwiper2.slideNext(false);

		}

	});
	mySwiper.slideTo(1, 1000, false);
	//	初始化日程表下面的部分
	mySwiper2 = new Swiper('.swiper-container2', {
		loop: true,
		initialSlide: -1,
		onSlidePrevEnd: function(swiper) { //左滑事件
			//			debugger;
			var newDate = addDate(selectedDate, -1);
			selectDate(newDate);

		},
		onSlideNextEnd: function(swiper) { //右滑事件
			var newDate = addDate(selectedDate, 1);
			selectDate(newDate);
		}

	});

	$('.currentDay').text(currentday);
	$('#backBtn').hide();
	bindSelectDate();
	setCurrentDay();

});

function bindData() {
	ajax({
		"url": "/Mobile/EMP/EmployeeHandler.ashx?act=GetEmployeeScheduleList",
		"type": "POST",
		success: function(result) {
			items = result.data.list;
			if(result.status == 1) {
				for(var j = 0; j < items.length; j++) {
					var startDate = new Date(items[j].StartTime).Format('yyyy-MM-dd');
					var start
					startDateArray.push(startDate);
					eventList.push({
						'startTime': items[j].StartTime,
						'endTime': items[j].EndTime,
						'startDateStr': new Date(items[j].StartTime).Format('yyyy-MM-dd'),
						'startTimeStr': new Date(items[j].StartTime).Format('hh:mm'),
						'EndDateStr': new Date(items[j].EndTime).Format('yyyy-MM-dd'),
						'EndTimeStr': new Date(items[j].EndTime).Format('hh:mm'),
						'content': items[j].Content,
					});

				}
				bindMark2();
			}
		}
	})

}

function bindMark2() {
	var allA = $('.swiper-container .swiper-slide .monitor td a');
	$(allA).parents('td').removeClass('mark2');
	for(var i = 0; i < allA.length; i++) {
		var aDate = new Date($(allA[i]).attr('data-date')).Format('yyyy-MM-dd');
		for(var j = 0; j < startDateArray.length; j++) {
			if(aDate == startDateArray[j]) {
				$(allA[i]).parents('td').addClass('mark2');
			}
		}
	}
}
//			页面刷新
window.addEventListener('reload', function(event) {
	if(event.detail.currentDay) {
		bindData();
		op.showday = new Date(event.detail.currentDay);
		var p = $(".gridcontainer").bcalendar(op).BcalSetOp();
		if(p && p.datestrshow) {
			$("#txtdatetimeshow").text(p.datestrshow);
			
		}
	} else {
		var p = $(".gridcontainer").bcalendar(op).BcalSetOp();
		if(p && p.datestrshow) {
			$("#txtdatetimeshow").text(p.datestrshow);
		}
	}
	

})
//绑定当前周、上周、下周数据
function addCurrentDate() {
	firstSunday = findSunday(addDate(new Date(), -7));
	lastSunday = findSunday(addDate(new Date(), 7));
	for(i = 0; i < 3; i++) {
		var temps = $(template).clone();
		switch(i) {
			case 0:
				setDate(temps, firstSunday);
				break;
			case 1:
				$(temps).attr('data-index', 0);
				setDate(temps, findSunday(new Date()));

				break;
			case 2:
				setDate(temps, lastSunday);
				break;
		}
		container.append(temps);
		bindMark2();
	}

}

function findSunday(date) {
	var time = date.getTime();
	var week = date.getDay();
	return addDate(date, week * -1);
}

function formatDate(date) {
	var year = date.getFullYear()
	var month = (date.getMonth() + 1);
	var day = date.getDate();
	var week = '(' + ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()] + ')';
	var dateStr = {
		'year': year,
		'month': month,
		'day': day,
		'date': date
	};
	return dateStr;

};

function addDate(date, n) {
	var date1 = new Date(date.getTime());
	date1.setDate(date1.getDate() + n);
	return date1;
};
//绑定相应的日期
function setDate(temp, date) {
	var cells = temp.find('.monitor td a');

	temp.attr('data-sunday', date.Format('yyyy-MM-dd'));
	for(var i = 0; i < cells.length; i++) {
		var everyDay = formatDate(i == 0 ? date : addDate(date, i));
		$(cells[i]).text(everyDay.day);
		$(cells[i]).attr('data-date', everyDay.date);
		//		setCurrentDay();
		var everyWeek = new Date($(cells[i]).attr('data-date'));
		if(everyWeek.Format('yyyy.MM.dd') == today.Format('yyyy.MM.dd')) {
			$(cells[i]).addClass('mark3').addClass('default');
		}

	}
	bindMark2();

}
//返回按钮
mui('.mui-bar').on('tap', '.backBtn', function() {
	var currentTime = new Date($('.currentDay').attr('data-date')).getTime();
	var todayTime = new Date().getTime();

	var newDate = new Date();
	selectDate(newDate);
	if(todayTime > currentTime) {
		//左滑
		mySwiper2.slideNext(false);
	} else {
		//右滑
		mySwiper2.slidePrev(false);
	}

})

function bindSelectDate() {
	$(".monitor td a").on('click', function(event) {
		var thisDate = new Date($(this).attr('data-date'));
		if(thisDate.getTime() > selectedDate.getTime()) {
			//选中之后的日期，左滑
			mySwiper2.slideNext(false);
		} else {
			//选中之前的日期，右滑
			mySwiper2.slidePrev(false);
		}
		selectDate(thisDate);

	})

}

function selectDate(date) {
	if(date.Format('yyyy-MM-dd') == selectedDate.Format('yyyy-MM-dd')) {
		return
	}

	var thisSunday = findSunday(date);
	var allSlider = $('.swiper-container1 .swiper-slide');

	var thisSundayStr = thisSunday.Format('yyyy-MM-dd');

	var targetSlider, targetIndex;
	for(var i = 0; i < allSlider.length; i++) {
		if(allSlider.eq(i).attr('data-sunday') == thisSundayStr) {
			targetSlider = allSlider.eq(i);
			targetIndex = i;
			break;
		}
	}
	//选中的那天添加样式
	var getDay = date.getDay();
	allSlider.find('a.mark1').removeClass('mark1');
	allSlider.find('a.mark3').removeClass('mark3');
	targetSlider.find('a[data-weeks=' + getDay + ']').addClass('mark1');

	//标题修改
	if(targetIndex != mySwiper.activeIndex) {
		mySwiper.slideTo(targetIndex, 1000, false);
	}
	if(targetIndex <= 1) {
		var firstSunday = findSunday(addDate(date, -7));
		var temps = template.clone(true);
		setDate(temps, firstSunday);
		mySwiper.prependSlide(temps); //加到Swiper的第一个
	}
	if(targetIndex >= allSlider.length - 1) {
		var lastSunday = findSunday(addDate(date, 7));
		var temps = template.clone(true);
		setDate(temps, lastSunday);
		mySwiper.appendSlide(temps); //加到Swiper的最后
	}

	selectedDate = date;
	setCurrentDay();

}

//当前日期显示
function setCurrentDay() {
	var currentdayStr = $('.swiper-slide.swiper-slide-active .monitor td a.mark1').attr('data-date');
	if(currentdayStr) {
		currentday = new Date(currentdayStr).Format('yyyy.MM.dd');
		$('.currentDay').text(currentday);
		$('.currentDay').attr('data-date', currentdayStr);
	} else {
		$('.currentDay').text(currentday);
		$('.currentDay').attr('data-date', today);
	}
	jugeCurrentDay();
	if($('.currentDay').text() == today.Format('yyyy.MM.dd')) {
		$('#backBtn').hide();
		$('.swiper-slide.swiper-slide-active .monitor td a.default').addClass('mark3');
	}
	var calDate = new Date($('.currentDay').attr('data-date'));
	$('.gcweekname').attr('abbr', calDate.getFullYear() + '-' + (calDate.getMonth() + 1) + '-' + calDate.getDate());
	$('.wk-dayname').text($('.currentDay').text());
	op.showday = new Date($('.currentDay').attr('data-date'));

	var p = $(".gridcontainer").bcalendar(op).BcalSetOp();
	if(p && p.datestrshow) {
		$("#txtdatetimeshow").text(p.datestrshow);
	}
}

//		判断是否是今天,并空时返回按钮样式
function jugeCurrentDay() {
	var d1 = new Date($('.currentDay').attr('data-date')).getTime();
	var d2 = today.getTime();
	if(d1 > d2) {
		$('#backBtn img').attr('src', 'images/pullleftBack.png');
		$('#backBtn').show();
	} else {
		$('#backBtn img').attr('src', 'images/pullRightBack.png');
		$('#backBtn').show();
	}

}