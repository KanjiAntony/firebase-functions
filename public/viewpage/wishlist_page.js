import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import { Wishlist } from '../model/wishlist.js';
import { currentUser } from '../controller/firebase_auth.js';
import { currency,disableButton,enableButton, info } from './util.js';
import { home_page } from './home_page.js';
import { DEV } from '../model/constants.js';
import { cart } from './cart_page.js';
import { getWishlist,getSpecificProduct,checkout_wishlist } from '../controller/firestore_controller.js';

export function addEventListeners() {
    MENU.Wishlist.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.WISHLIST);
        await wishlist_page();

    });


}
export let wishlist;
export async function wishlist_page() {
    if (!currentUser) {
        root.innerHTML = '<h1>Protected Page</h1>';
        return;
    }
    let html = '<h1>Wishlist</h1>';
    let product;
    let prod_items = [];
    if (!wishlist || wishlist.getTotalWishlist() == 0) {
        html += '<h3>Empty! </h3>';
        root.innerHTML = html;
        return;
    }


    html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="50%">Summary</th>
        <th scope="col">Add to cart</th>
      </tr>
    </thead>
    <tbody>
    `;

    let j = 0;

    for(const item of wishlist.items) {

    //wishlist.items.forEach(async (item) => {

        try {
            product = await getSpecificProduct(item);
            prod_items.push(product);
        } catch (e) {

            if (DEV) console.log(e);
            Util.info('Failed to get the product list', JSON.stringify(e));
    
        }

        //console.log("All wishlist prods",prod_items);

            html+=`
            <tr>
                <td><img src="${product.imageURL}" width="150px"</td>
                <td>${product.name}</td>
                <td>${currency(product.price)}</td>
                <td>${product.summary}</td>
                <td>
                    <form method="post" class="form-product-qty">
                        <input type="hidden" name="index" value="${j}">
                        <button class="btn btn-outline-danger" type="submit"
                            onclick="this.form.submitter='DEC'">&minus;</button>
                        <div id="item-count-${product.docId}"
                            class="container round text-center text-white bg-primary d-inline-block w-50">
                                    Add
                        </div>
                        <button class="btn btn-outline-danger" type="submit"
                            onclick="this.form.submitter='INC'">&plus;</button>
                    </form>
                </td>
            </tr>
            `;

            j++;
        };

        //console.log(prod_items);

        html += '</tbody></table>';
        html += `
        <div class="fs-3"> TOTAL: ${wishlist.getTotalWishlist()}</div>
        `;
        
    
    root.innerHTML = html; 

    const productForms = document.getElementsByClassName('form-product-qty');

    let cart_prod_qty = null;

    for (let i = 0; i < productForms.length; i++) {


        productForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const p = prod_items[e.target.index.value];
            const submitter = e.target.submitter;
            if (submitter == 'DEC') {
                cart.removeItem(p);
                if (cart_prod_qty > 0) --cart_prod_qty;
            } else if (submitter == 'INC') {
                cart.addItem(p);
                cart_prod_qty = cart_prod_qty == null ? 1 : cart_prod_qty + 1;
            } else {
                if (DEV) console.log(e);
                return;
            }


            const updateQty = (cart_prod_qty == null || cart_prod_qty == 0) ? 'Add' : cart_prod_qty;
            document.getElementById(`item-count-${p.docId}`).innerHTML = updateQty;
            MENU.CartItemCount.innerHTML = `${cart.getTotalQty()}`;
        })
    }


}

export async function getUserWishlist() {
    try {
        wishlist = await getWishlist(currentUser.uid);
    } catch (e) {
        if (DEV) console.log(e);
        info(`Empty wishlist`, JSON.stringify(e));
        return;
    }
    MENU.WishlistItemCount.innerHTML = 0;
}