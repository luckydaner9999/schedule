/**
 * Created by gaodandan on 2017/9/26.
 */
var self;
var certification;
var timestamp;
var login;
var forgotPass;
mui.plusReady(function () {
    self = plus.webview.currentWebview();
    certification = self.certification;
    login = plus.webview.getWebviewById('login.html');
    forgotPass=plus.webview.getWebviewById('views/common/forgot-password.html');
    timestamp = self.timestamp;
})
$('#passConfirm').focus(function () {
    var newPass = $('#newPass').val();
    if (!newPass) {
        $('.error-block').show().text('* 请输入密码');
    }
    if (newPass.length < 6) {
        $('.error-block').show().text('* 密码最少为6位');
        return;
    }
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/);
    var state = reg.test(newPass);
    if (!state) {
        $('.error-block').show().text('* 密码必须包含小写字母和数字');
    }

})
$('#newPass').focus(function () {
    $('.error-block').hide();
})
mui('.buttom-block').on('tap', '#btn-reset', function () {
    var newPass = $('#newPass').val();
    var passConfirm = $('#passConfirm').val();
    if (!passConfirm) {
        $('.error-block').show().text('* 请再次输入密码');
    }
    if (passConfirm === newPass) {
        var pragram = {
            act: "ResetUserPassword",
            newPassword: passConfirm,
            certification: certification,
            timestamp: timestamp
        };
        ajax({
            url: '/Mobile/Sec/Membership.ashx',
            type: 'POST',
            data: pragram,
            success: function (result) {
                if (result.status == 1) {
                    self.close();
                    forgotPass.close();

                }
                else if (result.errorCode == -110108) {
                    $('.error-block').show().text('* 密码必须包含数字.');
                }
                else if (result.errorCode == -110107) {
                    $('.error-block').show().text('* 密码必须包含小写字母.');
                }
                else if (result.errorCode == -110106) {
                    $('.error-block').show().text('* 密码必须包含大写字母.');
                }
                else if (result.errorCode == -110105) {
                    $('.error-block').show().text('* 您的密码已经过期,请先更新!');
                }
                else if (result.errorCode == -110104) {
                    $('.error-block').show().text('* 您的密码即将过期,要现在更新吗?');
                }
                else if (result.errorCode == -110103) {
                    $('.error-block').show().text('* 超级管理员角色无法禁用或被删除.');
                }
                else if (result.errorCode == -110102) {
                    $('.error-block').show().text('* 无法删除或禁用自己.');
                }
                else if (result.errorCode == -110101) {
                    $('.error-block').show().text('* 至少存在一个有效的超级管理员.');
                }
                else if (result.errorCode == -110100) {
                    $('.error-block').show().text('* 密码长度不足（最少6位）.');
                } else if (result.errorCode == -100009) {
                    $('.error-block').show().text('* 该页面失效.');
                    self.close();
                    forgotPass.close();
                }

            }
        })
    } else {
        $('.error-block').show().text('* 输入密码两次不一致');
    }
})
