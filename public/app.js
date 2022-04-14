import * as FirebaseAuth from './controller/firebase_auth.js'
import * as HomePage from './viewpage/home_page.js'
import * as ProductPage from './viewpage/product_page.js'
import * as PurchasesPage from './viewpage/purchases_page.js'
import * as CartPage from './viewpage/cart_page.js'
import * as WishlistPage from './viewpage/wishlist_page.js'
import * as ProfilePage from './viewpage/profile_page.js'
import * as MyProductsPage from './viewpage/my_products_page.js'
import * as EditMyProductsPage from './viewpage/edit_my_products_page.js'

import {routing} from './controller/route.js'
import { MENU } from './viewpage/elements.js'

FirebaseAuth.addEventListeners();
HomePage.addEventListeners();
PurchasesPage.addEventListeners();
CartPage.addEventListeners();
WishlistPage.addEventListeners();
ProfilePage.addEventListeners();
MyProductsPage.addEventListeners();
EditMyProductsPage.addEventListeners();

MENU.CurrencyChooser.addEventListener("change", e => {

    if(e.target.value == "Eur") {

        
    }


});

window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname,hash);
    //console.log("path ",pathname);
}

window.addEventListener('popstate' , e => {
    e.preventDefault();
    const pathname = e.target.location.pathname;
    const hash = e.target.location.hash;
    routing(pathname,hash);
});


