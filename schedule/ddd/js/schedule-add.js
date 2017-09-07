var self, start, end, isAllday, pos, pragram;
var allDayTemp = $('#template .alldayText');
var pickerBottomTemp = $('#template .pickerBottom');
var options;
var dtpicker;
var targetView, id;
mui.init({})
mui.plusReady(function () {
    self = plus.webview.currentWebview();
    start = self.start;
    end = self.end;
    isAllday = self.isAllday;
    pos = self.pos;
    pragram = {
        start: start,
        end: end,
        isAllday: isAllday,
        pos: pos
    }
    var editParam = {
        startTime: self.startTime,
        endTime: self.endTime,
        events: self.events,
        id: self.editId
    }
    targetView = plus.webview.getWebviewById('index.html');
    $('.mui-title').text(new Date().Format('hh:mm'));
    $('#eventInput').focus();
    if (self.isEdit) {
        $('.mui-icon-trash').show();
        bindEditDatas(editParam);
    } else {
        $('.mui-icon-checkmarkempty').show();
        bindDatas(pragram);
    }
    var optionsJson = $('.choseTimePart .startTime span').attr('data-options') || '{}';
    options = JSON.parse(optionsJson);
    dtpicker = new mui.DtPicker(options);
    $('.mui-dtpicker').append(pickerBottomTemp);
    dtpicker.hide();

});
var warningPicker = new mui.PopPicker();
warningPicker.setData([
    {
        value: "0",
        text: "不提醒"
    },
    {
        value: "1",
        text: "事件发生时"
    },
    {
        value: "2",
        text: "5分钟前"
    },
    {
        value: "3",
        text: "15分钟前"
    },
    {
        value: "4",
        text: "30分钟前"
    },
    {
        value: "5",
        text: "1小时前"
    },
    {
        value: "6",
        text: "2小时前"
    },
    {
        value: "7",
        text: "1天前"
    },
    {
        value: "8",
        text: "2天前"
    },
    {
        value: "9",
        text: "1周前"
    }

]);

//input事件绑定
$('#eventInput').bind('input propertychange', function () {
    $('.mui-content .mui-input-group .mui-icon-close-filled').show();
    $('.eventPart').text($(this).val());
});
//清除当前input值
$('#clearInput').click(function () {
    $('#eventInput').val('');
    $('.eventPart').text('');
    $('#eventInput').focus();
})
//日期格式化
function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    var startDate = month + '月' + day + '日' + week;
    return startDate;

};

//绑定编辑的日程信息
function bindEditDatas(editPagram) {
    var endTime = new Date(editPagram.endTime).getTime();
    var startTime = new Date(editPagram.startTime).getTime();
    var middleTime = endTime - (endTime - startTime) / 2;
    $('#eventInput').val(editPagram.events);
    $('.eventPart').text(editPagram.events);
    $('.choseTimePart .clickDate').text(formatDate(new Date(startTime)));
    $('.choseTimePart .startTime span').text(new Date(startTime).Format('hh:mm'));
    $('.choseTimePart .endTime span').text(new Date(endTime).Format('hh:mm'));
    $('.choseTimePart .middleTime span').text(new Date(middleTime).Format('hh:mm'));
    $('.mui-bar-nav .deleteEvent').attr('data-id', editPagram.id);
    $('.mui-bar-nav .deleteEvent').attr('data-startTime', editPagram.startTime);

}
//绑定创建日程数据
function bindDatas(pragram) {
    var middleTime = (new Date(pragram.start).getTime() + 1800000);
    var endTime = (new Date(pragram.start).getTime() + 3600000);
    $('.startTime span').attr('data-options', '{"value":"' + new Date(pragram.start).Format('yyyy-MM-dd hh:mm') + '","beginYear":2000,"endYear":2030}');
    $('.endTime span').attr('data-options', '{"value":"' + new Date(endTime).Format('yyyy-MM-dd hh:mm') + '","beginYear":2000,"endYear":2030}');
    $('.clickDate').text(formatDate(new Date(pragram.start)));
    $('.choseTimePart .startTime span').text(new Date(pragram.start).Format('hh:mm'));
    $('.choseTimePart .middleTime span').text(new Date(middleTime).Format('hh:mm'));
    $('.choseTimePart .endTime span').text(new Date(endTime).Format('hh:mm'));

}
//				开始时间点击
mui('.pickerBottom .startTime,.choseTimePart .startTime').on('tap', 'span', function () {
    $('.startTime').addClass('active').siblings().removeClass('active');
    var optionsJson = this.getAttribute('data-options') || '{}';
    options = JSON.parse(optionsJson);
    $('#eventInput').blur();
    showPickers(options);

}, false);
//				结束时间点击
mui('.pickerBottom .endTime,.choseTimePart .endTime').on('tap', 'span', function () {
    $('.endTime').addClass('active').siblings().removeClass('active');
    var optionsJson = this.getAttribute('data-options') || '{}';
    options = JSON.parse(optionsJson);
    $('#eventInput').blur();
    dtpicker.hide();
    showendPickers(options);

}, false);

//显示开始时间
function showPickers(options) {
    var value = options.value;
    if (dtpicker) {
        dtpicker.setSelectedValue(value);
    }
    $('.pickerBottom').show();
    $('.startTime').addClass('active').siblings().removeClass('active');
    dtpicker.show(function (rs) {
        $('.startTime').removeClass('active');
        var startTime = new Date(rs.value);
        var middleTime = (new Date(rs.value).getTime() + 1800000);
        var endTime = new Date(new Date(rs.value).getTime() + 3600000);
        $('.startTime span').attr('data-options', '{"value":"' + new Date(rs.value).Format('yyyy-MM-dd hh:mm') + '","beginYear":2010,"endYear":2020}');
        $('.endTime span').attr('data-options', '{"value":"' + endTime.Format('yyyy-MM-dd hh:mm') + '","beginYear":2010,"endYear":2020}');
        $('.choseTimePart .startTime span').text(new Date(rs.value).Format('hh:mm'));
        $('.choseTimePart .middleTime span').text(new Date(middleTime).Format('hh:mm'));
        $('.choseTimePart .endTime span').text(new Date(endTime).Format('hh:mm'));
        $('.pickerBottom').hide();
    });

}
//显示结束时间
function showendPickers(options) {
    if (dtpicker) {
        dtpicker.setSelectedValue(options.value);
    }
    $('.pickerBottom').show();
    $('.endTime').addClass('active').siblings().removeClass('active');
    dtpicker.show(function (rs) {
        $('.endTime').removeClass('active');
        var startTime = new Date(JSON.parse($('.startTime span').attr('data-options')).value);
        var endTime = new Date(rs.value);
        endTimeCheck(startTime, endTime);
        $('.endTime span').attr('data-options', '{"value":"' + new Date(rs.value).Format('yyyy-MM-dd hh:mm') + '","beginYear":2015,"endYear":2025}');
        $('.choseTimePart .endTime span').text(new Date(rs.value).Format('hh:mm'));
        $('.pickerBottom').hide();
    })

}

function endTimeCheck(startTime, endTime) {
    if (endTime.getTime() > startTime.getTime()) {
        var middleTime = new Date(endTime.getTime() - ((endTime.getTime() - startTime.getTime()) / 2));
        $('.choseTimePart .middleTime span').text(middleTime.Format('hh:mm'));
    } else {
        var middleTime = new Date(endTime.getTime() - 1800000);
        startTime = new Date(endTime.getTime() - 3600000);
        $('.choseTimePart .middleTime span').text(middleTime.Format('hh:mm'));
        $('.choseTimePart .startTime span').text(startTime.Format('hh:mm'));
        $('.startTime span').attr('data-options', '{"value":"' + startTime.Format('yyyy-MM-dd hh:mm') + '","beginYear":2015,"endYear":2025}');

    }
}
//			保存创建新得日程
mui('.mui-bar-nav').on('tap', '#submitBtn', function () {
    var startTime = JSON.parse($('.choseTimePart .startTime span').attr('data-options')).value;
    var endTime = JSON.parse($('.choseTimePart .endTime span').attr('data-options')).value;
    if (!$('#eventInput').val()) {
        mui.alert('请添加日程');
    }
    var param = {
        Classification: "普通",
        Title: $('#eventInput').val(),
        StartTime: startTime,
        EndTime: endTime,
        Content: $('#eventInput').val(),
        PreMinitesRemind:$('.warning').attr('data-warning'),

    }
    ajax({
        url: '/Mobile/EMP/EmployeeHandler.ashx?act=SaveEmployeeSchedule',
        data: {
            entity: JSON.stringify(param)
        },
        success: function (result) {
            if (result.status == 1) {
                mui.fire(targetView, 'reload', {
                    currentDay: startTime
                });
                self.close();
            }

        }
    })

})
//			删除日程
mui('.mui-bar-nav').on('tap', 'a.deleteEvent', function () {
    var editId = $(this).attr('data-id');
    var startTime = $(this).attr('data-startTime');
    var datas = {
        id: editId
    };
    /*	ajax({
     url: 'http://192.168.2.156:8080/Mobile/EMP/EmployeeHandler.ashx?act=DeleteEmployeeSchedule',
     type: 'POST',
     data: datas,
     success: function(result) {
     console.log(JSON.stringify(result));
     }
     })*/
    $.ajax({
        type: "post",
        url: "http://192.168.2.156:8080/Mobile/EMP/EmployeeHandler.ashx?act=DeleteEmployeeSchedule",
        data: datas,
        success: function (result) {
            if (result.status == 1) {
                //							返回页面刷新
                mui.fire(targetView, 'reload', {
                    currentDay: startTime
                });
                self.close();
            }
        }
    });
})
mui('.mui-bar-nav').on('tap', 'a.mui-icon-closeempty', function () {
    mui.fire(targetView, 'reload', {});
    self.close();
})
mui('.mui-content').on('tap', '.warning', function () {
    $('#eventInput').blur();
    warningPicker.show(function (items) {
        var choseText = items[0].text;
        var choseValue=items[0].value;
        $('.warning').text(choseText);
        $('.warning').attr('data-warning',choseValue);
    }, false)
})