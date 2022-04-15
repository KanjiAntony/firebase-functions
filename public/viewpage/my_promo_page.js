import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getMyPromos, createUpdatePromo } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { product_page } from "./product_page.js"


export function addEventListeners() {
    MENU.MyPromo.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.MY_PROMO);
        const label = Util.disableButton(MENU.MyPromo);
        await my_promo_page();
        Util.enableButton(MENU.MyPromo, label);
    });
}
export async function my_promo_page() {
    let html = '<h1>My promo codes</h1>';
    let promos;
    try {
        promos = await getMyPromos(currentUser.uid);

        console.log(promos);

        if(promos.size == 0) {

            html += '<h1>No promo codes</h1>';
    
        }

        html += `
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Promo code</th>
                    <th scope="col">% off</th>
                    </tr>
                </thead>
                <tbody>
                    `;

        promos.forEach((value,key) => {
            html += buildPromoView(key, value);
        })            


        html += '<tbody></table>';

    } catch (e) {
        if (DEV) console.log(e);
        //Util.info('Failed to get the product list', JSON.stringify(e));
    }

    
    html += uploadPromoForm();
    
    root.innerHTML = html;
    

    document.getElementById('form-create-promo').addEventListener('submit', async e => {
        e.preventDefault();

        let promo_code;

        let promo_value;

             promo_code = e.target.promo_code.value.trim();
             promo_value = e.target.promo_value.value.trim();
            

                try {
                    await createUpdatePromo(currentUser.uid, promo_code, promo_value)
                    Util.info('Success', 'Promo code created / updated!');
                    await my_promo_page();
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Create Promo Error', JSON.stringify(e));
                }
                
            


    });

}

function uploadPromoForm() {

    return `
    <h2> Upload promo code </h2>
    <form id="form-create-promo" method="POST" >
                    
        <p><input class="form-control" type="text" name="promo_code" id="promo_code" placeholder="eg. ABC" required></p>

        <br/>
        <h5>% off</h5>
        <p><input class="form-control" type="number" name="promo_value" id="promo_value" placeholder="e.g 10" required></p>
        
        
        <p><input type="submit" value="Upload Product" name="submit_product" class="btn btn-primary" ></p>

    </form>

        `;

}

function buildPromoView(promo_code,promo_value) {
    return `
        <tr>
            
            <td>${promo_code}</td>
            <td>${promo_value}</td>
        </tr> 
    `;
}