import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getProductList,getTotalRatings,getProductListBestSeller,getProductListHighPrice,getProductListLowPrice,
    updateAccountCurrency, getAccountCurrency, addToken, getSpecificProductStock } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { product_page } from "./product_page.js"


export function addEventListeners() {
    MENU.Home.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await visitor_page();
        Util.enableButton(MENU.Home, label);
    });

    
}

export async function visitor_page() {
    
    let html = `<h1>Enjoy Shopping</h1>
    
    <br/>
                <div class="card">
                <div class="body">
                    <div class="row">

                        <div class="col-lg-2 col-md-4 col-sm-6">
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-6">
                            <h2>Filter by</h2>
                            <div class="form-group">
                                <select class="custom-select" id="bestseller">
                                    <option selected value="worst">All sellers</option>
                                    <option value="best">Best seller</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-6">

                            <h2>Sort by</h2>
                            <div class="form-group">
                                <select class="custom-select" id="price-range">
                                    <option value="high">High price</option>
                                    <option selected value="low">Low price</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <br/>

            <div id="product_card_sec">
            
            </div>

    `;
    let products;
    
    root.innerHTML = html;

    try {
        products = await getProductList();

        let global_curr = await getAccountCurrency(currentUser.uid);

        if(global_curr == "USD") {
            MENU.CurrencyChooser.value = "USD";
        } else if(global_curr == "EUR") {
            MENU.CurrencyChooser.value = "EUR";
        } else if(global_curr == "") {
            MENU.CurrencyChooser.value = "USD";
        }

        if (cart && cart.getTotalQty() != 0) {
            cart.items.forEach(item => {
                const p = products.find(e => e.docId == item.docId)
                if (p) p.qty = item.qty;
            });
        }

        let product_view_card = "";

        for (let i = 0; i < products.length; i++) {
            product_view_card += await buildProductView(products[i], i)
        }


        document.getElementById("product_card_sec").innerHTML =product_view_card;

        MENU.CurrencyChooser.addEventListener("change", async e => {

            console.log(e.target.value);

            if(e.target.value == "USD") {
        
                await updateAccountCurrency(currentUser.uid, "USD");
                
            } else if(e.target.value == "EUR") {
    
                await updateAccountCurrency(currentUser.uid, "EUR");
    
            }
        
        
        });

        let device_token = document.getElementById("message_token").innerHTML;

        await addToken(currentUser.uid,device_token);

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

                    products2 =  await getProductListBestSeller();

                    let product_view_card = "";

                    for (let i = 0; i < products2.length; i++) {
                        product_view_card += await buildProductView(products2[i], i)
                    }


                     document.getElementById("product_card_sec").innerHTML =product_view_card; 
                   

                } else if(e.target.value == "worst") {

                    let product_view_card = "";

                    for (let i = 0; i < products.length; i++) {
                        product_view_card += await buildProductView(products[i], i)
                    }
                    
                    // const product_view_card = await buildProductView(products);

                    document.getElementById("product_card_sec").innerHTML =product_view_card; 

                }

                

            } catch (e) {
                if (DEV) console.log(e);
                Util.info('Failed to get sorted product list', JSON.stringify(e));
            }

    });

    document.getElementById("price-range").addEventListener("change", async e => {

        //console.log(e.target.value);
        e.preventDefault();

        let products2;
        let products3;
        //let html = ""

            try {

                if(e.target.value == "high") { 

                    products2 =  await getProductListHighPrice();

                    let product_view_card = "";

                    for (let i = 0; i < products2.length; i++) {
                        product_view_card += await buildProductView(products2[i], i)
                    }


                    document.getElementById("product_card_sec").innerHTML =product_view_card; 
                   

                } else if(e.target.value == "low") {

                    products3 =  await getProductListLowPrice();

                    let product_view_card = "";

                    for (let i = 0; i < products3.length; i++) {
                        product_view_card += await buildProductView(products3[i], i)
                    }


                    document.getElementById("product_card_sec").innerHTML =product_view_card; 

                }

                

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

    let product_stock_left;
    let stock_state = "";

    try {
        total_rating = await getTotalRatings(currentUser.uid, product.docId);

        product_stock_left = await getSpecificProductStock(product.docId);
        

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

        if(product_stock_left < 1) {
            stock_state = "Out of stock";
        } else if(product_stock_left >= 1 && product_stock_left <=10) {
            stock_state = product_stock_left+" remaining items";
        } else if(product_stock_left > 10) {
            stock_state = "In stock";
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
                ${stock_state}

            </div>
        </div>
        </a>
    </div>
    `
    ;
    
    

   // }
}