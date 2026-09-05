const CART_KEY = "shopease-cart";

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

export function getCart() {
    return cart;
}

export function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

export function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = quantity;
    saveCart();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCartCount() {
    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
}
