$(document).ready(function () {
    // 加载消息
    loadMessages();

    // 注意：我们将点击事件监听器添加到.message-box，而不是.btn-top
    $(".message-box").on("click", ".btn-top", function () {
        // 获取点击的按钮所在的消息行
        const messageRow = $(this).closest(".message-row");
        // 将消息行插入到消息框的最上方
        messageRow.prependTo(".message-box");
    });

    // 注意：我们将点击事件监听器添加到.message-box，而不是.btn-delete
    $(".message-box").on("click", ".btn-delete", function () {
        // 获取点击的按钮所在的消息行
        const messageRow = $(this).closest(".message-row");
        // 删除消息行
        messageRow.remove();

        // 从 localStorage 中删除消息
        var messages = JSON.parse(localStorage.getItem('messages')) || [];
        var index = messageRow.index();
        messages.splice(index, 1);
        localStorage.setItem('messages', JSON.stringify(messages));

        // 重新加载消息
        loadMessages();
    });

    // 加载消息
    function loadMessages() {
        var messages = JSON.parse(localStorage.getItem('messages')) || [];

        // 清空消息框
        $(".message-box").empty();

        // 为每条消息创建一个消息行
        messages.forEach(function (message) {
            var messageRow = createMessageRow(message);
            $(".message-box").append(messageRow);
        });
    }

    // 创建消息行
    function createMessageRow(message) {
        var messageRow = $("<div class='message-row'></div>");
        var messageContent = $("<span class='message-content'></span>");
        var messageActions = $("<div class='message-actions'></div>");
        var btnTop = $("<button class='btn-top'>Top</button>");
        var btnDelete = $("<button class='btn-delete'>Delete</button>");

        // 确保正确地解析 message 对象
        var messageText = message.time + ": " + message.action + " " + message.product;

        messageContent.text(messageText);
        messageActions.append(btnTop, btnDelete);
        messageRow.append(messageContent, messageActions);

        return messageRow;
    }
});
