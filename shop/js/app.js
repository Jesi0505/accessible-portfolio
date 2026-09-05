import { getRoute } from "./router.js";

import {
    renderHome,
    renderProducts,
    renderCart,
    updateCartCount
} from "./components.js";

const app = document.getElementById("app");

function render() {

    const route = getRoute();

    if (route === "products") {
        renderProducts(app);
    }

    else if (route === "cart") {
        renderCart(app);
    }

    else {
        renderHome(app);
    }

    updateCartCount();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

window.addEventListener("hashchange", render);

render();
