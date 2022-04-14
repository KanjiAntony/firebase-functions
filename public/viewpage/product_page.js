import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import {getProductList, createComment, getAllComments, 
    getSpecificProduct, addToWishlist, addToRatings,getUserRatings } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { home_page } from "../viewpage/home_page.js"

export function addEventListeners() {
    MENU.Home.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home, label);
    });
} 

export async function product_page() {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get('id');

    let html = '<h1>Product page</h1>';
    let products;
    let user_rating;
    let user_rating_1 = "";
    let user_rating_2 = "";
    let user_rating_3 = "";
    let user_rating_4 = "";
    let user_rating_5 = "";
    try {
        //products = await getProductList();
        products = await getSpecificProduct(c);
        user_rating = await getUserRatings(currentUser.uid, c);

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
            user_rating_3,user_rating_4,user_rating_5);

            root.innerHTML = html;

            await buildCommentView(c);    

    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Failed to get the product list', JSON.stringify(e));
    }


    

    

    

    const productForms = document.getElementsByClassName('form-product-qty');
    for (let i = 0; i < productForms.length; i++) {
        productForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const p = products[e.target.index.value];
            const submitter = e.target.submitter;
            if (submitter == 'DEC') {
                cart.removeItem(p);
                if (p.qty > 0) --p.qty;
            } else if (submitter == 'INC') {
                cart.addItem(p);
                p.qty = p.qty == null ? 1 : p.qty + 1;
            } else {
                if (DEV) console.log(e);
                return;
            }
            const updateQty = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
            document.getElementById(`item-count-${p.docId}`).innerHTML = updateQty;
            MENU.CartItemCount.innerHTML = `${cart.getTotalQty()}`;
        })
    }

    document.getElementById('form-create-comment').addEventListener('submit', async e => {
        e.preventDefault();
      
            const comment = {};

            comment.productId = c;
            const date = new Date();
            comment.date = date.getDate() + ' / ' + date.getMonth() + ' / ' + date.getFullYear() + '   at ' + date.getHours() + ' : ' + date.getMinutes(),

            comment.name = e.target.name.value.trim();
            comment.comment = e.target.comment.value.trim();

            //console.log(comment);
            

            if (Object.keys(comment).length > 0) {

                try {
                    await createComment(comment);
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Create Comment Error', JSON.stringify(e));
                }
                
            }

            await buildCommentView(c);

    });

    document.getElementById('add_to_wishlist').addEventListener('click', async e => {
          

                try {
                    await addToWishlist(currentUser.uid, c);
                    
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Add To Wishlist Error', JSON.stringify(e));
                }
                
            

    });

    document.getElementById('rating-1').addEventListener('click', async e => {
          
        const rating_value = 1;


        try {
            await addToRatings(currentUser.uid, c, rating_value);
            await product_page();
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('Add To Ratings Error', JSON.stringify(e));
        }
        
    });

    document.getElementById('rating-2').addEventListener('click', async e => {
          
        const rating_value = 2;


        try {
            await addToRatings(currentUser.uid, c, rating_value);
            await product_page();
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('Add To Ratings Error', JSON.stringify(e));
        }
        
    });

    document.getElementById('rating-3').addEventListener('click', async e => {
          
        const rating_value = 3;


        try {
            await addToRatings(currentUser.uid, c, rating_value);
            await product_page();
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('Add To Ratings Error', JSON.stringify(e));
        }
        
    });

    document.getElementById('rating-4').addEventListener('click', async e => {
          
        const rating_value = 4;


        try {
            await addToRatings(currentUser.uid, c, rating_value);
            await product_page();
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('Add To Ratings Error', JSON.stringify(e));
        }
        
    });

    document.getElementById('rating-5').addEventListener('click', async e => {
          
        const rating_value = 5;


        try {
            await addToRatings(currentUser.uid, c, rating_value);
            await product_page();
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('Add To Ratings Error', JSON.stringify(e));
        }
        
    });


}

async function buildCommentView(c) {

    let productComments;
    let html_comments = '<h1>Comments</h1>';
    let comments_table_container = document.getElementsByClassName("comments_table_container")[0];
    try {
        productComments = await getAllComments(c);
        if (productComments.length == 0) {
            html_comments += `<h3>No Comments Found!</h3>`;
            comments_table_container.innerHTML = html_comments;
            return;
        }
    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Error in getComments', JSON.stringify(e));
        return;
    }

    html_comments += `
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Comment</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
    `;

    for (let i = 0; i < productComments.length; i++) {
        html_comments += `
        <tr>

            <td>${productComments[i].comment}</td>
            <td>${productComments[i].date}</td>
        </tr>    
        `
    }

    html_comments += '<tbody></table>';

    comments_table_container.innerHTML = html_comments;

}

function buildRichProdView(product, index, user_rating_1,user_rating_2,user_rating_3,user_rating_4,user_rating_5) {

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

                                    <form method="post" class="form-product-qty" >
                                        <input type="hidden" name="index" value="${index}">
                                        <button class="btn btn-outline-danger" type="submit"
                                            onclick="this.form.submitter='DEC'">&minus;</button>
                                        <div id="item-count-${product.docId}"
                                            class="container round text-center text-white bg-primary d-inline-block w-50">
                                            ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                                        </div>
                                        <button class="btn btn-outline-danger" type="submit"
                                            onclick="this.form.submitter='INC'">&plus;</button>
                                    </form>

                                
                                    

                                </div>

                                <br/>

                                    <button class="btn btn-primary" id="add_to_wishlist">Add to wishlist</button>

                                
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
                                                </div>
                              

                                
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
                            <a class="active" data-toggle="tab" href="#des-details1">Description</a>
                        </div>
                        <div id="des-details1">
                            ${product.summary}

                            <div id="product_comments_table">
                                <div class="comments_table_container">
                                    
                                </div>

                                <div class="col-lg-12 col-md-12">
                                    <div class="contact-form">
                                        <div class="contact-title mb-30">
                                            <h2>Leave a comment</h2>
                                        </div>
                                        <form class="contact-form-style" id="form-create-comment" method="post">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <input name="name" placeholder="Name*" type="text" />
                                                </div>

                                                <div class="col-lg-12">
                                                    <textarea name="comment" placeholder="Your  Comment*"></textarea>
                                                    <button class="submit" type="submit">Comment</button>
                                                </div>
                                            </div>
                                        </form>
                                        <p class="form-messege"></p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

`;

}