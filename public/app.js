let products = [];
let cart = [];

async function loadProducts() {
  const search = document.getElementById("search")?.value || "";

  try {
    const response = await fetch(`/api/products?search=${encodeURIComponent(search)}`);
    products = await response.json();

    displayProducts();
  } catch (error) {
    console.error(error);
  }
}

function displayProducts() {
  const container = document.getElementById("products");

  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product">
      <h3>${product.name}</h3>
      <p>${product.description || ""}</p>
      <p class="price">$${product.price}</p>
      <p>Stock: ${product.stock}</p>

      <button onclick="addToCart('${product._id}')">
        Add to Cart
      </button>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p => p._id === id);

  if (!product) return;

  cart.push(product);

  alert(`${product.name} added to cart`);

  displayCart();
}

function displayCart() {
  const container = document.getElementById("cart");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  container.innerHTML = cart.map((product, index) => `
    <div>
      ${product.name} - $${product.price}
      <button onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join("");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  displayCart();
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("login-message").textContent =
        data.message || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);

    document.getElementById("login-message").textContent =
      "Login successful!";

    loadProducts();

  } catch (error) {
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  alert("Logged out");
}

async function checkout() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart.map(product => ({
          product: product._id,
          quantity: 1
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Checkout failed");
      return;
    }

    alert("Order placed successfully!");

    cart = [];
    displayCart();

  } catch (error) {
    console.error(error);
  }
}

function showProducts() {
  document.getElementById("products-section").style.display = "block";
  document.getElementById("cart-section").style.display = "none";
  document.getElementById("login-section").style.display = "none";

  loadProducts();
}

function showCart() {
  document.getElementById("products-section").style.display = "none";
  document.getElementById("cart-section").style.display = "block";
  document.getElementById("login-section").style.display = "none";

  displayCart();
}

function showLogin() {
  document.getElementById("products-section").style.display = "none";
  document.getElementById("cart-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
}

window.onload = showProducts;
