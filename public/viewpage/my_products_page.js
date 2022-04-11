import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getMyProductsList,createProduct } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { product_page } from "./product_page.js"


export function addEventListeners() {
    MENU.MyProducts.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.MY_PRODUCTS);
        const label = Util.disableButton(MENU.MyProducts);
        await my_products_page();
        Util.enableButton(MENU.MyProducts, label);
    });
}
export async function my_products_page() {
    let html = '<h1>My products</h1>';
    let products;
    try {
        products = await getMyProductsList(currentUser.uid);

        if(products.length == 0) {

            html += '<h1>No products</h1>';
    
        }

        for (let i = 0; i < products.length; i++) {
            html += buildProductView(products[i], i)
        }

    } catch (e) {
        if (DEV) console.log(e);
        //Util.info('Failed to get the product list', JSON.stringify(e));
    }

    
    html += uploadProductForm();
    
    root.innerHTML = html;
    

    document.getElementById('form-create-product').addEventListener('submit', async e => {
        e.preventDefault();
      
            const product = {};

            product.uid = currentUser.uid;
            product.category = e.target.product_category.value.trim();
            product.name = e.target.product_name.value.trim();
            product.price = e.target.product_price.value.trim();
            product.summary = e.target.product_desc.value.trim();
            product.imageURL = e.target.product_image.value.trim();
            product.qty = e.target.product_stock.value.trim();

            //console.log(comment);
            

            if (Object.keys(product).length > 0) {

                try {
                    await createProduct(product);
                    Util.info('Success', 'Product created!');
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Create Product Error', JSON.stringify(e));
                }
                
            }


    });

}

function uploadProductForm() {

    return `
    <h2> Upload product </h2>
    <form id="form-create-product" method="POST" >
                      
    <p><select name="product_category" id="product_category" class="form-control">
      <option value="fruits">Fruits</option>
      <option value="vegetables">Vegetables</option>
     
     
    </select></p>
    
    <br/>
    <p><input class="form-control" type="text" name="product_name" id="product_name" placeholder="Product Name" required></p>

    <br/>
    <h5>Image url</h5>
    <p><input class="form-control" type="text" name="product_image" id="product_image" placeholder="Enter image url of product" required></p>
        
    <br/>
    <h5>Price</h5>
    <p><input class="form-control" type="number" name="product_price" id="product_price" placeholder="Enter price of product" required></p>
    
    <br/>
    <h5>Price</h5>
    <p><input class="form-control" type="number" name="product_stock" id="product_stock" placeholder="Enter current stock of product" required></p>
    
    <p>
        <h5>Description</h5>
        
        <div class="form-group">

            <textarea name="product_desc" placeholder="Your  description*"></textarea>
      
        </div>
        
        
    </p>
    
    <p><input type="submit" value="Upload Product" name="submit_product" class="btn btn-primary" ></p>

</form>

    `;

}

function buildProductView(product, index) {
    return `
    <div id="card-${product.docId}" class="card d-inline-flex product_card" style="width: 18rem; display: inline-block;">
        <a href="product.html?id=${product.docId}">
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
                        ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
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