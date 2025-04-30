document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");

  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const li = document.createElement("li");
        li.classList.add("product-item");

        li.innerHTML = `
          <a href="/shop/products/product${product.id}.html" aria-label="View details for ${product.name}">
            <img src="/images/${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/200x200';">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span>$${product.price.toFixed(2)}</span>
          </a>
        `;

        productList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      productList.innerHTML = "<li>Sorry, we couldn’t load the products right now.</li>";
    });
});
