
$(document).ready(function() {
    var buyNowProducts = JSON.parse(localStorage.getItem('buyNowProducts')) || [];
  var cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  var totalPrice = 0;

  // Handle buyNowProducts as an array
  buyNowProducts.forEach(function(buyNowProduct) {
    var buyNowProductRow = `
      <div class="product-row">
        <h3>${buyNowProduct.name}</h3>
        <p>${buyNowProduct.price} x ${buyNowProduct.quantity}</p>
      </div>
    `;

    $('#buy-now-item').append(buyNowProductRow);

    // Check if discountPrice exists, if it does, use it, otherwise use the original price
    var productPrice = buyNowProduct.discountPrice ? buyNowProduct.discountPrice : buyNowProduct.price;

    totalPrice += productPrice * buyNowProduct.quantity;
  });

  cartItems.forEach(function(item) {
    var productRow = `
      <div class="product-row">
        <h3>${item.name}</h3>
        <p>${item.price} x ${item.quantity}</p>
      </div>
    `;

    $('#cart-items').append(productRow);

    // Check if discountPrice exists, if it does, use it, otherwise use the original price
    var productPrice = item.discountPrice ? item.discountPrice : item.price;

    totalPrice += productPrice * item.quantity;
  });

  $('#total-price').html(totalPrice.toFixed(2)).css('color', 'red').css('font-weight', 'bold');

  $('.complete-payment').on('click', function() {
    const selectedPaymentMethod = $('input[name="payment-method"]:checked').val();
    if (selectedPaymentMethod) {
      const purchaseSuccessMessage = `Purchase successful! You selected ${selectedPaymentMethod} as your payment method.`;
      if (window.confirm(purchaseSuccessMessage)) {
        // Redirect to homepage.html when the user closes the confirm dialog
        window.location.href = '/homepage';
      } else {
        // Redirect to homepage.html when the user closes the confirm dialog
        window.location.href = '/homepage';
      }
    } else {
      alert('Please select a payment method before completing the purchase.');
    }
  });

  var modal = document.getElementById("myModal");
  var modalImg = document.getElementById("img01");

  // When the user clicks on a payment method, open the modal
  $('input[type=radio][name=payment-method]').change(function() {
    if (this.value == 'Alipay') {
      modal.style.display = "block";
      modalImg.src = "static/alipay.jpg";
    } else if (this.value == 'WeChat Pay') {
      modal.style.display = "block";
      modalImg.src = "static/wechatpay.jpg";
    }
  });
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the close button, close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
