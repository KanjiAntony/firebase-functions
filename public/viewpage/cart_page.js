import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import { ShoppingCart } from '../model/shopping_cart.js';
import { currentUser } from '../controller/firebase_auth.js';
import { currency,disableButton,enableButton, info } from './util.js';
import { home_page } from './home_page.js';
import { DEV } from '../model/constants.js';
import { checkout,getUserPromoValue } from '../controller/firestore_controller.js';

export function addEventListeners() {
    MENU.Cart.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.CART);
        await cart_page();

    });


}
export let cart;
export async function cart_page() {
    if (!currentUser) {
        root.innerHTML = '<h1>Protected Page</h1>';
        return;
    }
    let html = '<h1>Shopping Cart</h1>'
    if (!cart || cart.getTotalQty() == 0) {
        html += '<h3>Empty! Buy More!</h3>';
        root.innerHTML = html;
        return;
    }



    html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Unit Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="30%">Summary</th>
        <th scope="col" >Promo code</th>
      </tr>
    </thead>
    <tbody>
    `;

    const productForms = document.getElementsByClassName('form-apply-promo');

    let item_index = 0;

    cart.items.forEach(item => {

        let is_promo_applied = "promo_code" in item;

        html+=`
        <tr>
            <td><img src="${item.imageURL}" width="150px"</td>
            <td>${item.name}</td>
            <td>${currency(item.price)}</td>
            <td>${item.qty}</td>
            <td>${currency(item.price * item.qty)}</td>
            <td>${item.summary}</td>
            <td>
                <form class="form-apply-promo" method="POST" >
                        
                    <p><input class="form-control" type="hidden" name="item_index" value='${item_index}' required></p>

                    <p><input class="form-control" type="hidden" name="item_owner" value='${item.uid}' required></p>
                    
                    <p><input class="form-control" type="text" name="promo_code" placeholder="eg. ABC" ${is_promo_applied ? 'readonly' : 'required'} ></p>
                    
                    <p><input type="submit" value="${is_promo_applied ? 'Promo code applied' : 'Apply promo'}" name="apply_promo"
                     class="btn btn-primary" ${is_promo_applied ? 'disabled' : ''}></p>
            
                </form>
    
            </td>
        </tr>
        `;

        item_index ++;
    });


    html += '</tbody></table>';
    html += `
    <div class="fs-3"> TOTAL: ${currency(cart.getTotalPrice())}</div>
    `;
    html+=`
    <button id="button-checkout" class="btn btn-outline-primary">Check Out</button>
    <button id="button-continue-shopping" class="btn btn-outline-secondary">Continue Shopping</button>
    `;
    root.innerHTML = html;

    for (let i = 0; i < productForms.length; i++) {
        productForms[i].addEventListener('submit', async e => {
            e.preventDefault();
            

            let promo_code;

            let promo_value;

            let product_owner;

            let new_price;

            let item_i;


             promo_code = e.target.promo_code.value.trim();
             product_owner = e.target.item_owner.value.trim();
             item_i = e.target.item_index.value.trim();
            

                try {
                    promo_value = await getUserPromoValue(product_owner, promo_code);

                    new_price = cart.items[item_i].price * (promo_value/100);

                   
                                    
                    //  console.log("Old price",cart.items[item_i].price);
                    //  console.log("Expected price",new_price);
                    //  console.log("Old object", cart.items[item_i]);

                    //  if("promo_code" in cart.items[item_i]) {
                    //      console.log("Promo code applied");
                    //  } else {
                    //     console.log("Promo code NoT applied");
                    //  }

                    cart.items[item_i]["price"]= new_price;

                    cart.items[item_i].promo_code = promo_code;

                    await cart_page();

                    

                    // console.log("New object", cart.items[0]);

                    // if("promo_code" in cart.items[0]) {
                    //     console.log("Promo code applied");
                    // } else {
                    //     console.log("Promo code NOT applied");
                    // }
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Apply Promo Error', JSON.stringify(e));
                }

        })
    }


    const continueButton = document.getElementById('button-continue-shopping');
    continueButton.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.HOME);
        const label = disableButton(continueButton);
        await home_page();
        enableButton(continueButton,label);
    })

    const checkoutButton = document.getElementById('button-checkout');
    checkoutButton.addEventListener('click',async()=>{
        const label = disableButton(checkoutButton);
        try{
            await checkout(cart);
            info('Success!','Checkout Complete!');
            cart.clear();
            MENU.CartItemCount.innerHTML = 0;
            history.pushState(null,null,ROUTE_PATHNAMES.HOME);
            await home_page();
        } catch(e){
            if(DEV) console.log(e);
            info('Checkout Failed', JSON.stringify(e));
        }
        enableButton(checkoutButton,label);
    });
}

export function initShoppingCart() {
    cart = new ShoppingCart(currentUser.uid);
    MENU.CartItemCount.innerHTML = 0;
}