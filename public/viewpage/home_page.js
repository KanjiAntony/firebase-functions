import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getProductList,getTotalRatings,getProductListBestSeller } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { product_page } from "../viewpage/product_page.js"


export function addEventListeners() {
    MENU.Home.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home, label);
    });
}
export async function home_page() {
    let html = `<h1>Enjoy Shopping</h1>
    
    <br/>
                <div class="card">
                <div class="body">
                    <div class="row">

                        <div class="col-lg-4 col-md-4 col-sm-6">
                        </div>
                        <div class="col-lg-5 col-md-4 col-sm-6">
                            <h2>Choose</h2>
                            <div class="form-group">
                                <select class="custom-select" id="bestseller">
                                    <option selected value="best">Best seller</option>
                                    <option value="worst">All sellers</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6">
                        </div>
                    </div>
                </div>
            </div>

            <br/>

    `;
    let products;
    

    try {
        products = await getProductList();

        if (cart && cart.getTotalQty() != 0) {
            cart.items.forEach(item => {
                const p = products.find(e => e.docId == item.docId)
                if (p) p.qty = item.qty;
            });
        }

        for (let i = 0; i < products.length; i++) {
            html += await buildProductView(products[i], i)
        }
        root.innerHTML = html;

    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Failed to get the product list', JSON.stringify(e));
    }


    document.getElementById("bestseller").addEventListener("change", async e => {

        //console.log(e.target.value);
        e.preventDefault();

        let products2;
        let products3;
        //let html = ""

            try {

                if(e.target.value == "best") { 

                    products2 = await getProductListBestSeller();

                    for (let i = 0; i < products2.length; i++) {
                        html += await buildProductView(products2[i], i)
                    }

                    //console.log(products2);

                } else if(e.target.value == "worst") {

                    let html2 = `<h1>Enjoy Shopping</h1>
    
                            <br/>
                                        <div class="card">
                                        <div class="body">
                                            <div class="row">

                                                <div class="col-lg-4 col-md-4 col-sm-6">
                                                </div>
                                                <div class="col-lg-5 col-md-4 col-sm-6">
                                                    <h2>Choose</h2>
                                                    <div class="form-group">
                                                        <select class="custom-select" id="bestseller">
                                                            <option selected value="worst">All sellers</option>
                                                            <option value="best">Best seller 12</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 col-md-4 col-sm-6">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <br/>

                            `;

                    products3 = await getProductList();

                    for (let i = 0; i < products3.length; i++) {
                        html += await buildProductView(products3[i], i)
                    }

                   

                }

                root.innerHTML = html;

            } catch (e) {
                if (DEV) console.log(e);
                Util.info('Failed to get sorted product list', JSON.stringify(e));
            }

    });
    
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
    `;
}