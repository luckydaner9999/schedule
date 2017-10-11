/**
 * Created by gaodandan on 2017/9/26.
 */
mui('.input-item').on('tap', '.sendCode', function () {
    var employeeNum = $('#employeeNum').val().trim();
    if (!employeeNum) {
        $('.error-block').show();
        $('.error-block').text('* 工号不能为空');
        $(this).attr('disabled', true);
    }
    if ($(this).attr('disabled') == 'disabled') {
        return;
    }
    $(this).attr('disabled', true);
    var pragram = {
        act: 'SendVerificationCode',
        employeeNo: employeeNum
    }
    ajax({
        url: '/Mobile/Sec/Membership.ashx',
        type: 'POST',
        data: pragram,
        success: function (result) {
            if (result.status == 1) {
                $('.error-block').show();
                $('.error-block').text('* 发送验证码成功');
            }
            else if (result.errorCode == -100003) {
                $('.error-block').show();
                $('.error-block').text('* 发送验证码失败');
            } else if (result.errorCode == -100001) {
                $('.error-block').show();
                $('.error-block').text('* 用户信息有误');
            }

        }
    })
    countDown();
})
$('#employeeNum').focus(function () {
    $('.sendCode').attr('disabled', false);
    $('.error-block').hide();

})
$('#code').focus(function () {
    $('.error-block').hide();

})
mui('.buttom-block').on('tap', '#btn-next', function () {
    var employeeNum = $('#employeeNum').val();
    var code = $('#code').val();
    if (!employeeNum) {
        $('.error-block').show();
        $('.error-block').text('* 工号不能为空');
    }
    if (!code) {
        $('.error-block').show();
        $('.error-block').text('* 验证码不能为空，请输入验证码');
    }
    var pragram = {
        act: 'ValidateVerificationCode',
        employeeNo: employeeNum,
        vcode: code
    }
    ajax({
        url: '/Mobile/Sec/Membership.ashx',
        type: 'POST',
        data: pragram,
        success: function (result) {
            if (result.status == 1) {
                var datas = {
                    certification: result.data.certification,
                    timestamp: result.data.timestamp
                };
                mui.openWindow({
                    url: 'modify-password.html',
                    id: 'modify-password.html',
                    extras: datas,
                    show: {
                        autoShow: true, //页面loaded事件发生后自动显示，默认为true
                        duration: '300', //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
                    },
                    waiting: {
                        autoShow: true, //自动显示等待框，默认为true
                        title: '正在加载...' //等待对话框上显示的提示内容
                    }
                })

            }else {
                $('.error-block').show().text('* 验证码错误，请重新输入验证码');
            }
        }
    })

})
function countDown() {
    var btn = $('.sendCode');
    var second = 60;
    second--;
    var setTimer = setInterval(function () {
        if (second < 0) {
            clearInterval(setTimer);
            $('.sendCode').text('获取验证码');
            $(btn).attr('disabled', false);
            return;
        }
        $('.sendCode').text('重新获取(' + second + ')');
        second--;
    }, 1000)
}
