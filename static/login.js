$(document).ready(function() {
  $("#login-form").submit(function(event) {
    // 阻止表单默认提交行为
    event.preventDefault();

    // 获取表单数据
    var formData = {
      email: $("#email").val(),
      password: $("#password").val()
    };

    // 发送POST请求到服务器端验证登录
    $.ajax({
      type: "POST",
      url: "/login",
      data: formData,
      dataType: "json",
      encode: true
    }).done(function(data) {
      // 显示成功或错误信息
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        $("#login-form .alert").remove();
        $("#login-form").prepend(
          '<div class="alert alert-danger">' + data.message + "</div>"
        );
      }
    });
  });
});
