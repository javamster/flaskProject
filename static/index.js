$(document).ready(function() {
  // Buy Now 按钮点击事件
  $('.btn-buy-now').click(function() {
    window.location.href = 'payment.html';
  });

  // Add to Cart 按钮点击事件
  $('.btn-add-to-cart').click(function() {
    window.location.href = 'shopping-cart.html';
  });

  // 获取所有 price-type 元素
  var priceTypes = document.querySelectorAll('.price-type');

  // 遍历所有 price-type 元素，并为它们添加单击事件监听器
  for (var i = 0; i < priceTypes.length; i++) {
    priceTypes[i].addEventListener('click', function(event) {
      // 阻止默认链接行为
      event.preventDefault();
      // 根据单击的元素来更新价格信息
      var type = event.target.id; // 获取单击元素的 ID
      if (type === 'type1') {
        // 更新价格为 Type 1 的价格
        $('#price').text('$100');
      } else if (type === 'type2') {
        // 更新价格为 Type 2 的价格
        $('#price').text('$200');
      } else if (type === 'type3') {
        // 更新价格为 Type 3 的价格
        $('#price').text('$300');
      }
    });
  }

  // Quantity counter
  $('.btn-plus').click(function() {
    var input = $(this).prev('input');
    var value = parseInt(input.val());
    input.val(value + 1);
  });

  $('.btn-minus').click(function() {
    var input = $(this).next('input');
    var value = parseInt(input.val());
    if (value > 1) {
      input.val(value - 1);
    }
  });

  // Feedback
  $('.btn-like').click(function() {
    var count = $(this).find('.like-count');
    count.text(parseInt(count.text()) + 1);
  });

  $('.btn-dislike').click(function() {
    var count = $(this).find('.dislike-count');
    count.text(parseInt(count.text()) - 1);
  });

  // Comment
  $('#send-btn').click(function() {
    var comment = $('#comment-input').val();
    if (comment !== '') {
      var newComment = $('<div></div>').addClass('user-comment');
      var userId = $('<span></span>').addClass('user-id').text('UserID');
      var text = $('<span></span>').addClass('comment-text').text(comment);
      newComment.append(userId).append(': ').append(text);
      $('#comment-list').append(newComment);
      $('#comment-input').val('');
    }
  });
});
