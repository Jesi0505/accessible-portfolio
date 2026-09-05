import { products } from "./products.js";
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    getCartCount
} from "./store.js";

export function renderHome(app) {

    app.innerHTML = `
        <section class="hero">
            <div>
                <p class="eyebrow">WELCOME TO SHOPEASE</p>

                <h1>Find products you'll love.</h1>

                <p>
                    Browse our collection of electronics,
                    fashion and home essentials.
                </p>

                <a class="primary-button" href="#/products">
                    Browse Products
                </a>
            </div>
        </section>

        <section class="section">
            <h2>Featured Products</h2>

            <div class="product-grid">
                ${products.slice(0, 3).map(productCard).join("")}
            </div>
        </section>
    `;

    attachProductEvents();
}

export function renderProducts(app) {

    app.innerHTML = `
        <section class="section">

            <div class="section-heading">
                <div>
                    <p class="eyebrow">SHOP</p>
                    <h1>All Products</h1>
                </div>

                <select id="category-filter"
                        aria-label="Filter products by category">
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                </select>
            </div>

            <div class="product-grid" id="product-grid">
                ${products.map(productCard).join("")}
            </div>

        </section>
    `;

    document
        .getElementById("category-filter")
        .addEventListener("change", filterProducts);

    attachProductEvents();
}

function filterProducts(event) {

    const category = event.target.value;

    const filtered =
        category === "all"
            ? products
            : products.filter(
                product => product.category === category
            );

    document.getElementById("product-grid").innerHTML =
        filtered.map(productCard).join("");

    attachProductEvents();
}

function productCard(product) {

    return `
        <article class="product-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                width="600"
                height="450"
                loading="lazy"
            >

            <div class="product-content">

                <span class="category">
                    ${product.category}
                </span>

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <strong>
                        ₹${product.price.toLocaleString("en-IN")}
                    </strong>

                    <button
                        class="add-button"
                        data-product-id="${product.id}">
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>
    `;
}

function attachProductEvents() {

    document
        .querySelectorAll(".add-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(
                    button.dataset.productId
                );

                addToCart(id);

                updateCartCount();

                button.textContent = "Added ✓";

                setTimeout(() => {
                    button.textContent = "Add to Cart";
                }, 1000);
            });
        });
}

export function renderCart(app) {

    const cart = getCart();

    if (cart.length === 0) {

        app.innerHTML = `
            <section class="empty-cart">
                <h1>Your Cart is Empty</h1>

                <p>
                    Add some products to your cart
                    to see them here.
                </p>

                <a class="primary-button" href="#/products">
                    Browse Products
                </a>
            </section>
        `;

        return;
    }

    const items = cart.map(item => {

        const product =
            products.find(p => p.id === item.id);

        const subtotal =
            product.price * item.quantity;

        return `
            <article class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="150"
                    height="110"
                    loading="lazy"
                >

                <div>
                    <h2>${product.name}</h2>

                    <p>
                        ₹${product.price.toLocaleString("en-IN")}
                    </p>

                    <label>
                        Quantity
                        <input
                            type="number"
                            min="1"
                            value="${item.quantity}"
                            data-quantity-id="${product.id}"
                        >
                    </label>
                </div>

                <strong>
                    ₹${subtotal.toLocaleString("en-IN")}
                </strong>

                <button
                    class="remove-button"
                    data-remove-id="${product.id}">
                    Remove
                </button>

            </article>
        `;
    }).join("");

    const total = cart.reduce((sum, item) => {

        const product =
            products.find(p => p.id === item.id);

        return sum + product.price * item.quantity;

    }, 0);

    app.innerHTML = `
        <section class="section">

            <h1>Shopping Cart</h1>

            <div class="cart-list">
                ${items}
            </div>

            <div class="cart-summary">

                <h2>
                    Total:
                    ₹${total.toLocaleString("en-IN")}
                </h2>

                <button class="checkout-button">
                    Proceed to Checkout
                </button>

            </div>

        </section>
    `;

    attachCartEvents();
}

function attachCartEvents() {

    document
        .querySelectorAll("[data-remove-id]")
        .forEach(button => {

            button.addEventListener("click", () => {

                removeFromCart(
                    Number(button.dataset.removeId)
                );

                renderCart(
                    document.getElementById("app")
                );

                updateCartCount();
            });
        });

    document
        .querySelectorAll("[data-quantity-id]")
        .forEach(input => {

            input.addEventListener("change", () => {

                updateQuantity(
                    Number(input.dataset.quantityId),
                    Number(input.value)
                );

                renderCart(
                    document.getElementById("app")
                );

                updateCartCount();
            });
        });
}

export function updateCartCount() {

    const counter =
        document.getElementById("cart-count");

    if (counter) {
        counter.textContent = getCartCount();
    }
}
