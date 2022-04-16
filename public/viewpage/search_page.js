import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getProductsSearchList, getTotalRatings } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';


export async function search_page() {
    
    let products;

    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get('q');
    let filter = url.searchParams.get('f');

    console.log(filter);

    let html = `
            
                <h1>Search: ${c.toUpperCase()}</h1>

                <div class="card">
                        <div class="body">
                            <div class="row">
                            <form action="search" method="get">
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <label>Search</label>
                                    <div class="input-group">
                                        <input type="text" name="q" class="form-control" placeholder="Search..." value="${c}">
                                    </div>
                                </div>
                                

                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <label>&nbsp;</label>
                                    <button class="btn btn-sm btn-primary btn-block" type="submit">Search</button>
                                </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <br/>

                    <div id="product_card_sec">
            
                    </div>
            
            `;

    root.innerHTML = html;        

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

    let product_view_card = "";

    for (let i = 0; i < products.length; i++) {
        product_view_card += await buildProductView(products[i], i)
    }


    document.getElementById("product_card_sec").innerHTML =product_view_card;

    
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


async function buildProductView(product, index) {

    

    let user_rating_1 = "";
    let user_rating_2 = "";
    let user_rating_3 = "";
    let user_rating_4 = "";
    let user_rating_5 = "";
    let total_rating;

    try {
        total_rating = await getTotalRatings(currentUser.uid, product.docId);

        if(total_rating == 0) {

            user_rating_1 = "";
            user_rating_2 = "";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";
    
        } else if(total_rating == 1) {
    
            user_rating_1 = "star-rating-checked";
            user_rating_2 = "";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";
    
        } else if(total_rating == 2) {
    
            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";
    
        } else if(total_rating == 3) {
    
            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "";
            user_rating_5 = "";
    
        } else if(total_rating == 4) {
    
            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "star-rating-checked";
            user_rating_5 = "";
    
        } else if(total_rating >= 5) {
    
            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "star-rating-checked";
            user_rating_5 = "star-rating-checked";
    
        }
    } catch(e) {
        if (DEV) console.log(e);
    }

    //index = index + 1;

    return `
    <div id="card-${product.docId}" class="card d-inline-flex product_card" style="width: 18rem; display: inline-block;">
        <a href="product?id=${product.docId}">
        <img src="${product.imageURL}" class="card-img-top" style="max-height: 200px; min-height: 200px;">
        <div class="card-body">
            <h5 class="card-title" >${product.name}</h5>
            <p class="card-text" style="color: black;">
            ${Util.currency(product.price)}
            <br>
            <div class="pro-details-rating-wrap">
                                                    <div class="rating-product" style="color: black;">
                                                        <span 
                                                            class="fa fa-star star-rating ${user_rating_1}" 
                                                            id="rating-1"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_2}" id="rating-2"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_3}" id="rating-3"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_4}" id="rating-4"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_5}" id="rating-5"></span>
                                                    </div> 
                                                    
                                                </div>
                                                <span style="color: black;">(${total_rating} ratings)</span>
            </p>

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
    `
    ;
    
    

   // }
}