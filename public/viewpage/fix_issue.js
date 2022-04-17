import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import {getProductList, createComment, getAllComments, 
    getSpecificProduct, addToWishlist, addToRatings,getUserRatings,
    getTotalRatings,updateProductRating, getAccountCurrency, getAllReports } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { home_page } from "./home_page.js"

export function addEventListeners() {
    MENU.Home.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home, label);
    });
} 

export async function fix_issue_page() {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get('id');

    let html = '<h1>Product reports page</h1>';
    let products;
    let user_rating;
    let user_rating_1 = "";
    let user_rating_2 = "";
    let user_rating_3 = "";
    let user_rating_4 = "";
    let user_rating_5 = "";
    let total_rating;
    try {
        

        //products = await getProductList();
        products = await getSpecificProduct(c);
        user_rating = await getUserRatings(currentUser.uid, c);
        total_rating = await getTotalRatings(currentUser.uid, c);

        await updateProductRating(total_rating, c);

        if(user_rating == 0) {

            user_rating_1 = "";
            user_rating_2 = "";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";

        } else if(user_rating == 1) {

            user_rating_1 = "star-rating-checked";
            user_rating_2 = "";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";

        } else if(user_rating == 2) {

            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "";
            user_rating_4 = "";
            user_rating_5 = "";

        } else if(user_rating == 3) {

            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "";
            user_rating_5 = "";

        } else if(user_rating == 4) {

            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "star-rating-checked";
            user_rating_5 = "";

        } else if(user_rating == 5) {

            user_rating_1 = "star-rating-checked";
            user_rating_2 = "star-rating-checked";
            user_rating_3 = "star-rating-checked";
            user_rating_4 = "star-rating-checked";
            user_rating_5 = "star-rating-checked";

        }



        if (cart && cart.getTotalQty() != 0) {
            cart.items.forEach(item => {
                const p = products.find(e => e.docId == item.docId)
                if (p) p.qty = item.qty;
            });
        }

        html += buildRichProdView(products, c, user_rating_1,user_rating_2,
            user_rating_3,user_rating_4,user_rating_5,total_rating,c);

            root.innerHTML = html;

            await buildCommentView(c);    

    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Failed to get the product list', JSON.stringify(e));
    }


    



}

async function buildCommentView(c) {

    let productComments;
    let html_comments = '<h1>Reports</h1>';
    let comments_table_container = document.getElementsByClassName("comments_table_container")[0];
    try {
        productComments = await getAllReports(c);
        if (productComments.length == 0) {
            html_comments += `<h3>No Reports Found!</h3>`;
            comments_table_container.innerHTML = html_comments;
            return;
        }
    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Error in reports', JSON.stringify(e));
        return;
    }

    html_comments += `
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Report</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    `;

    for (let i = 0; i < productComments.length; i++) {
        html_comments += `
        <tr>

            <td>${productComments[i].report} <p><strong>by ${productComments[i].name}</strong></p></td>
            <td>${productComments[i].date}</td>
        </tr>    
        `
    }

    html_comments += '<tbody></table>';

    comments_table_container.innerHTML = html_comments;

}

function buildRichProdView(product, index, 
    user_rating_1,user_rating_2,user_rating_3,
    user_rating_4,user_rating_5,total_rating,c) {

    return  `

            <section class="product-details-area mtb-60px">
                <div class="container">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-12">
                            <div class="product-details-img product-details-tab">
                                <div class="zoompro-wrap zoompro-2">
                                    <div class="zoompro-border zoompro-span">
                                        <img class="" src="${product.imageURL}" style="max-height: 450px;" data-zoom-image="${product.imageURL}" alt="" />
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-12">
                            <div class="product-details-content">
                                <h2>${product.name}</h2>
                                
                                <div class="pricing-meta">
                                    <ul>
                                        <li class="old-price not-cut">${Util.currency(product.price)}</li>
                                    </ul>
                                </div>
                                

                                
                                <div class="pro-details-quality">
                                   <!-- <div class="cart-plus-minus">
                                        <input class="cart-plus-minus-box" type="text" name="qtybutton" value="1" />
                                    </div>
                                    <div class="pro-details-cart btn-hover">
                                        <a href="#deleteDialog" id="mydel" data-delid="<?php echo $drink_id; ?>" class="openDeleteDialog btn btn-danger" data-toggle="modal"> + Add To Cart</a>
                                    </div> -->


                                
                                    

                                </div>

                                <br/>

                                
                                <br/>
                                    
                                                <div class="pro-details-rating-wrap">
                                                    <div class="rating-product">
                                                        <span class="heading">User Rating</span>
                                                        <span 
                                                            class="fa fa-star star-rating ${user_rating_1}" 
                                                            id="rating-1"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_2}" id="rating-2"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_3}" id="rating-3"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_4}" id="rating-4"></span>
                                                        <span class="fa fa-star star-rating ${user_rating_5}" id="rating-5"></span>
                                                    </div> 
                                                    (${total_rating} ratings)
                                                </div>
                              
                                <br/>

                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Shop details Area End -->
            <!-- product details description area start -->
            <div class="description-review-area mb-60px">
                <div class="container">
                    <div class="description-review-wrapper">
                        <div class="description-review-topbar nav">
                            <a class="active" data-toggle="tab" href="#des-details1">Reports</a>
                        </div>
                        <div id="des-details1">


                            <div id="product_comments_table">
                                

                                <div class="comments_table_container">
                                    
                                </div>

                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

`;

}