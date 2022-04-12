import { home_page } from "../viewpage/home_page.js"
import { product_page } from "../viewpage/product_page.js"
import { purchases_page } from "../viewpage/purchases_page.js"
import { cart_page } from "../viewpage/cart_page.js"
import { wishlist_page } from "../viewpage/wishlist_page.js"
import { profile_page } from "../viewpage/profile_page.js"
import { my_products_page } from "../viewpage/my_products_page.js"
import { edit_my_products_page } from "../viewpage/edit_my_products_page.js"

export const ROUTE_PATHNAMES = {
    HOME: '/',
    PRODUCT: '/product',
    PURCHASES: '/purchases',
    PROFILE: '/profile',
    CART: '/cart',
    WISHLIST: '/wishlist',
    MY_PRODUCTS: '/my-products',
    EDIT_MY_PRODUCTS: '/edit-my-product',
}

export const routes = [
    { pathname: ROUTE_PATHNAMES.HOME, page: home_page },
    { pathname: ROUTE_PATHNAMES.PRODUCT, page: product_page },
    { pathname: ROUTE_PATHNAMES.CART, page: cart_page },
    { pathname: ROUTE_PATHNAMES.WISHLIST, page: wishlist_page },
    { pathname: ROUTE_PATHNAMES.PROFILE, page: profile_page },
    { pathname: ROUTE_PATHNAMES.PURCHASES, page: purchases_page },
    { pathname: ROUTE_PATHNAMES.MY_PRODUCTS, page: my_products_page },
    { pathname: ROUTE_PATHNAMES.EDIT_MY_PRODUCTS, page: edit_my_products_page },
];

export function routing(pathname, hash) {
    const r = routes.find(r => r.pathname == pathname);
    if (r) r.page();
    else routes[0].page();
}

export function product_page_routing(pathname, hash) {
    const r = routes.find(r => r.pathname == pathname);
    if (r) r.page();
    else routes[1].page();
}