$(document).ready(function() {
  var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCart() {
    $('.products-container').empty();

    cartItems.forEach(function(item) {
      var productRow = `
        <div class="product-row">
          <div class="image-container">
            <img src="${item.imgSrc}" alt="Product Image">
          </div>
          <div class="product-info">
            <h3>${item.name}</h3>
            <p>${item.price} x ${item.quantity}</p>
            <p>${item.desc}</p>
          </div>
          <div class="buttons">
            <button class="remove-btn" data-product-id="${item.id}">Remove</button>
          </div>
        </div>
      `;

      $('.products-container').append(productRow);
    });
  }

  function removeFromCart(productId) {
    cartItems = cartItems.filter(function(item) {
      return item.id !== productId;
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));

    updateCart();
  }

  $(document).on('click', '.remove-btn', function() {
    var productId = $(this).data('product-id');
    removeFromCart(productId);
  });
$(".settlement-btn").click(function () {
    window.location.href = "/payment";
});


  updateCart();
});
