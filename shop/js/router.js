export function getRoute() {
    const hash = window.location.hash || "#/";

    if (hash.startsWith("#/products")) {
        return "products";
    }

    if (hash.startsWith("#/cart")) {
        return "cart";
    }

    return "home";
}

export function navigate(route) {
    window.location.hash = `#/${route}`;
}
