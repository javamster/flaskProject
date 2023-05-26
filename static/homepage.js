$(document).ready(function () {
    $(".logout-button").click(function() {
    // Clear local storage
    localStorage.clear();

    // Redirect to the logout route
    window.location.href = '/logout';
});

    // 当页面加载时，从 localStorage 中获取信息并显示在对应的输入框中
$(".info-row input[type='text']").each(function() {
    var inputKey = $(this).attr('class').split('-')[0]; // 获取输入框的类型，如"name", "address"等
    var inputValue = localStorage.getItem(inputKey); // 从localStorage中获取值

    if (inputValue) {
        $(this).val(inputValue); // 将值显示在输入框中
    }
});

    // 当页面加载时，从 localStorage 中获取订单信息数组
    var buyNowProducts = JSON.parse(localStorage.getItem('buyNowProducts')) || [];

    buyNowProducts.forEach(function(buyNowProduct, index) {
        // 获取当前时间
        var currentTime = new Date().toLocaleString();

        // 创建一个新的订单行
        var orderRow = $("<div class='order-row'></div>");
        var orderText = $("<span></span>").text(currentTime + ": " + buyNowProduct.name + " - " + buyNowProduct.quantity + " item(s)");
        var btnRemove = $("<button class='remove'>Remove</button>");

        // 将订单信息添加到订单行中
        orderRow.append(orderText, btnRemove);

        // 将订单行添加到订单列表中
        $("#order-list").append(orderRow);
    });

    // 删除按钮点击事件
    $(".remove").click(function () {
        // 删除订单行
        var orderRow = $(this).closest('.order-row');
        var index = orderRow.index();
        orderRow.remove();

        // 更新 localStorage 中的订单信息数组
        buyNowProducts.splice(index, 1);
        localStorage.setItem('buyNowProducts', JSON.stringify(buyNowProducts));
    });
    $(".confirm-btn").click(function() {
    var inputField = $(this).prev(); // 获取输入框
    var inputKey = inputField.attr('class').split('-')[0]; // 获取输入框的类型，如"name", "address"等
    var inputValue = inputField.val(); // 获取输入框的值
    localStorage.setItem(inputKey, inputValue); // 将输入的值保存到localStorage中

    alert('Your ' + inputKey + ' has been saved.'); // 提示用户信息已保存
});

});
