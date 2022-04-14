import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getProductsSearchList } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';


export async function search_page() {
    
    let products;

    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get('q');
    let category_filter = url.searchParams.get('category');

    console.log(category_filter);

    let html = `
            
                <h1>Search: ${c.toUpperCase()}</h1>

                <div class="card">
                        <div class="body">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-6">
                                    <label>Search</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Search..." value="${c}">
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6">
                                    <label>Status</label>
                                    <div class="form-group">
                                    <select class="custom-select">
                                        <option selected="">Newest first</option>
                                        <option value="1">Oldest first</option>
                                        <option value="2">Low salary first</option>
                                        <option value="3">High salary first</option>
                                        <option value="3">Sort by name</option>
                                    </select>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-4 col-sm-6">
                                    <label>Order</label>
                                    <div class="form-group">
                                        <select class="custom-select">
                                            <option selected="">Newest first</option>
                                            <option value="1">Oldest first</option>
                                            <option value="2">Low salary first</option>
                                            <option value="3">High salary first</option>
                                            <option value="3">Sort by name</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-4 col-sm-6">
                                    <label>&nbsp;</label>
                                    <a href="javascript:void(0);" class="btn btn-sm btn-primary btn-block" title="">Filter</a>
                                </div>
                            </div>
                        </div>
                    </div>
            
            `;

    try {
        products = await getProductsSearchList(c);

        if (cart && cart.getTotalQty() != 0) {
            cart.items.forEach(item => {
                const p = products.find(e => e.docId == item.docId)
                if (p) p.qty = item.qty;
            });
        }
    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Failed to get the product list', JSON.stringify(e));
    }

    for (let i = 0; i < products.length; i++) {
        html += buildProductView(products[i], i)
    }
    root.innerHTML = html;
    const productForms = document.getElementsByClassName('form-product-qty');

    let cart_prod_qty = null;

    for (let i = 0; i < productForms.length; i++) {
        productForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const p = products[e.target.index.value];
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


function buildProductView(product, index) {
    return `
    <div id="card-${product.docId}" class="card d-inline-flex product_card" style="width: 18rem; display: inline-block;">
        <a href="product?id=${product.docId}">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
            ${Util.currency(product.price)}<br>
            ${product.summary}</p>

            <div class="container pt-3 bg-light ${currentUser ? 'd-block' : 'd-none'}">
                <form method="post" class="form-product-qty">
                    <input type="hidden" name="product_id" class="product_card_form" value=${product.docId}>
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='DEC'">&minus;</button>
                    <div id="item-count-${product.docId}"
                        class="container round text-center text-white bg-primary d-inline-block w-50">
                            Add
                    </div>
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='INC'">&plus;</button>
                </form>
            </div>
        </div>
        </a>
    </div>
    `;
}