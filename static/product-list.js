
$(document).ready(function() {
  let allProducts;
  $('#product-upload-form').on('submit', function(e) {
    e.preventDefault();
    const name = $('#name').val();
    const category = $('#category').val();
    const desc = $('#desc').val();
    const price = $('#price').val();
    const imgSrc = $('#imgSrc').val();
    const discount = $('#discount').val();


    // 添加验证逻辑
    if (!name || !category || !desc || !price || !imgSrc||! discount) {
      alert('所有字段都是必填项');
      return;
    }

    const productData = {
      name,
      category,
      desc,
      price,
      imgSrc,
        discount,
    };

    $.ajax({
        url: '/api/products',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        dataType: 'json',
        success: function (response) {
            // Handle the response from the server
            $.get("/api/products", function(products) {
                allProducts = products;
                renderProducts(products);
            });
        },
        error: function (error) {
            console.error(error);
        }
    });
    const discounts = JSON.parse(localStorage.getItem('discounts')) || {};
  discounts[name] = discount;
  localStorage.setItem('discounts', JSON.stringify(discounts));
  });





  function renderProducts(products) {
    $('.product-list').empty();
    products.forEach(product => {
      const productItem = `
        <div class="product-item">
          <img class="product-img" src="${product.imgSrc}" alt="${product.name}">
          <span class="product-name">${product.name}</span>
          <span class="product-category">${product.category}</span>
          <span class="product-desc">${product.desc}</span>
          <span class="product-price">${product.price}</span>
        </div>
      `;
      $('.product-list').append(productItem);
    });

    // Re-add click event to product items
    $('.product-item').on('click', function() {
      const productName = $(this).find('.product-name').text();
      window.location.href = `/product/${productName}`;

    });
  }

  $.get("/api/products", function(products) {
    allProducts = products;
    renderProducts(products);

    // Add click event to category buttons
    $('.category').on('click', function() {
      const categoryName = $(this).text().trim().toLowerCase();
      const filteredProducts = allProducts.filter(product => product.category.toLowerCase() === categoryName);
      if (filteredProducts.length === 0) {
        $('.product-list').html('<p>No products found for this category</p>');
      } else {
        renderProducts(filteredProducts);
      }
    });

    // Search categories and product names
    $('.search-categories').on('keyup', function() {
      const searchText = $(this).val().trim().toLowerCase();
      const filteredProducts = allProducts.filter(product => product.category.toLowerCase().includes(searchText) || product.name.toLowerCase().includes(searchText));
      if (filteredProducts.length === 0) {
        $('.product-list').html('<p>No products found for this search</p>');
      } else {
        renderProducts(filteredProducts);
      }
    });

  });
});
