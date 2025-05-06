const productList = document.getElementById('product-list');

fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    products.forEach((product, index) => {
      const productId = index + 1; // For linking to product1.html
      const li = document.createElement('li');
      li.classList.add('product-item');
      li.innerHTML = `
        <a href="/shop/products/product${productId}.html">
          <img 
            src="/images/${product.image}" 
            alt="${product.name}" 
            onerror="this.onerror=null; this.src='https://via.placeholder.com/150';"
          />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span>$${product.price.toFixed(2)}</span>
        </a>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;
      productList.appendChild(li);
    });
  })
  .catch(err => {
    console.error('Error fetching products:', err);
  });
