$(document).ready(function() {

  $('.needs-login').click(function(event) {
  event.preventDefault(); // 先阻止默认的点击事件，等待登录检查的结果
  var self = this; // 保存当前点击的对象，因为在done函数中this会变化

  isLoggedIn().done(function(loggedIn) {
    if (!loggedIn) {
      alert('please login first！');
      window.location.href = '/login'; // 重定向到登录页面
    } else {
      // 如果用户已经登录，我们创建一个新的事件并手动触发它
      var newEvent = $.Event('click', {bubbles: true});
      $(self).off('click').trigger(newEvent);
    }
  });
});

// 你的原始点击事件处理器
$('.btn-minus').click(function() {
  var quantityInput = $(this).siblings('.input-quantity');
  var quantity = parseInt(quantityInput.val());
  if (quantity > 1) {
    quantityInput.val(quantity - 1);
  }
});

function isLoggedIn() {
        // 发送Ajax请求以检查用户登录状态
        return $.ajax({
            type: 'GET',
            url: '/check-login-status',
            dataType: 'json'
        }).then(function (response) {
            return response.logged_in;
        });
    }

    $('.btn-minus, .btn-plus, .btn-like, .btn-dislike, .btn-buy-now, .btn-add-to-cart, #submit-comment-btn').click(function(event) {
  // 先阻止默认的点击事件，等待登录检查的结果
  event.preventDefault();
  var self = this; // 保存当前点击的对象，因为在done函数中this会变化

  isLoggedIn().done(function(loggedIn) {
    if (!loggedIn) {
      alert('please login first！');
      window.location.href = '/login'; // 重定向到登录页面
    } else {
      // 如果用户已经登录，再触发原来的点击事件
      $(self).off('click').click();
    }
  });
});


  // 对所有需要用户登录的按钮，我们在点击事件处理器中添加登录检查逻辑
  $('.btn-minus, .btn-plus, .btn-like, .btn-dislike, .btn-buy-now, .btn-add-to-cart, #submit-comment-btn').click(function(event) {
    if (!isLoggedIn()) {
      event.preventDefault(); // 阻止原来的事件处理
      alert('please login first！');
      window.location.href = '/login'; // 重定向到登录页面
    }
  });
 // 获取产品名称
var productName = $('#product-name').val();

  // 获取折扣
  const discounts = JSON.parse(localStorage.getItem('discounts')) || {};
  const discount = discounts[productName];

  if (discount) {
    var originalPrice = parseFloat($('#type1').text());
    var discountPrice = (originalPrice * discount).toFixed(2); // 修改了这里
    localStorage.setItem('discountPrice', discountPrice);
    $('#type1').addClass('discounted');
    $('#type2').text('Discount Price: ' + discountPrice).show();
  }
  // When the "-" button is clicked, decrease the quantity by 1
$('.btn-minus').click(function() {
  var quantityInput = $(this).siblings('.input-quantity');
  var quantity = parseInt(quantityInput.val());

  if (quantity > 1) {
    quantityInput.val(quantity - 1);
  }
});

// When the "+" button is clicked, increase the quantity by 1
$('.btn-plus').click(function() {
  var quantityInput = $(this).siblings('.input-quantity');
  var quantity = parseInt(quantityInput.val());

  quantityInput.val(quantity + 1);
});
  // 获取产品名称
  var productName = $('#product-name').val();
  $('.btn-like').click(function() {
  var productName = $(this).data('product-name');
  likeProduct(productName);
});

$('.btn-dislike').click(function() {
  var productName = $(this).data('product-name');
  dislikeProduct(productName);
});


// 点赞商品函数
function likeProduct(productName) {
  $.ajax({
    url: '/product/' + productName + '/like',
    method: 'POST',
    success: function(response) {
      if (response.success) {
        var likeCount = response.like_count;
        $('.btn-like[data-product-name="' + productName + '"] .like-count').text(likeCount);
      } else {
        alert('Failed to like product: ' + response.message);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Failed to like product: ' + errorThrown);
    }
  });
}

// 不喜欢商品函数
function dislikeProduct(productName) {
  $.ajax({
    url: '/product/' + productName + '/dislike',
    method: 'POST',
    success: function(response) {
      if (response.success) {
        var dislikeCount = response.dislike_count;
        $('.btn-dislike[data-product-name="' + productName + '"] .dislike-count').text(dislikeCount);
      } else {
        alert('Failed to dislike product: ' + response.message);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Failed to dislike product: ' + errorThrown);
    }
  });
}


$('.btn-buy-now').click(function() {
  var productId = $('#product-id').val().toString();
  var productName = $('#product-name').val();
  var productPrice = parseFloat($('.product-price').text());
  var productQuantity = parseInt($('.input-quantity').val());
  var productImgSrc = $('.product-image img').attr('src');
  var productDesc = $('.product-description').text();

  // 获取折扣价格
  var discountPriceText = $('#type2').text();
var discountPrice = null;
if (discountPriceText) {
  var priceText = discountPriceText.split(': ')[1];
  discountPrice = parseFloat(priceText);
}


  var selectedProduct = {
    id: productId,
    name: productName,
    price: productPrice,
    discountPrice: discountPrice, // 添加这一行
    quantity: productQuantity,
    imgSrc: productImgSrc,
    desc: productDesc
  };

  // 添加到消息中心
  addMessageToLocalStorage('Bought', productName);

  // 使用一个新的localStorage key来存储"Buy Now"商品
  var buyNowProducts = JSON.parse(localStorage.getItem('buyNowProducts')) || [];
  buyNowProducts.push(selectedProduct);
  localStorage.setItem('buyNowProducts', JSON.stringify(buyNowProducts));

  window.location.href = '/payment';
});






  $('.btn-add-to-cart').click(function() {
  var productId = $('#product-id').val().toString();
  var productName = $('#product-name').val();
  var productPrice = parseFloat($('.product-price').text());
  var productQuantity = parseInt($('.input-quantity').val());
  var productImgSrc = $('.product-image img').attr('src');
  var productDesc = $('.product-description').text();

  // 获取折扣价格
  var discountPriceText = $('#type2').text();
  var discountPrice = discountPriceText ? parseFloat(discountPriceText) : null;

  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  var productInCart = cart.find(function(item) {
    return item.id === productId.toString();
  });

  if (productInCart) {
    productInCart.quantity += productQuantity;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      discountPrice: discountPrice, // 添加这一行
      quantity: productQuantity,
      imgSrc: productImgSrc,
      desc: productDesc
    });
  }

  // 添加到消息中心
  addMessageToLocalStorage('Added to cart', productName);

  localStorage.setItem('cart', JSON.stringify(cart));

  alert('Product added to cart successfully!');
});




  // 提交评论函数
  function postComment() {
    var comment = $('#comment-input').val();
    if (comment !== '') {
      $.ajax({
        url: '/product/' + productName + '/comment', // 使用 productName 而不是 productId
        method: 'POST',
        data: { comment: comment },
        success: function(response) {
          if (response.success) {
            alert('Comment submitted successfully!');
            $('#comment-input').val('');
            location.reload();
          } else {
            alert('Failed to submit comment: ' + response.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('Failed to submit comment: ' + errorThrown);
        }
      });
    } else {
      alert('Please enter a comment.');
    }
  }

  // 点击提交按钮提交评论
  $('#submit-comment-btn').click(function(event) {
    event.preventDefault();
    postComment();
  });
  // 添加消息到 localStorage 给消息中心用的
  function addMessageToLocalStorage(action, productName) {
    var message = {
      time: new Date().toLocaleString(),
      action: action,
      product: productName
    };

    var messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
  }

});
