import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { getSpecificProduct,updateProduct } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { my_products_page } from "./my_products_page.js"


export async function addEventListeners() {

        await edit_my_products_page();

}
export async function edit_my_products_page() {
    
    let url_string = window.location.href;
    let url = new URL(url_string);
    let c = url.searchParams.get('id');

    let html = '<h1>Edit product</h1>';
    let products;
    try {
        products = await getSpecificProduct(c);

    } catch (e) {
        if (DEV) console.log(e);
        //Util.info('Failed to get the product list', JSON.stringify(e));
    }

    
    html += editProductForm(products);
    
    root.innerHTML = html;
    

    document.getElementById('form-edit-product').addEventListener('submit', async e => {
        e.preventDefault();
      
            const product = {};

            product.category = e.target.product_category.value.trim();
            product.name = e.target.product_name.value.trim();
            product.price = e.target.product_price.value.trim();
            product.summary = e.target.product_desc.value.trim();
            product.imageURL = e.target.product_image.value.trim();
            product.qty = e.target.product_stock.value.trim();
            

            if (Object.keys(product).length > 0) {

                try {
                    await updateProduct(product, c);
                    Util.info('Success', 'Product updated!');
                    history.pushState(null,null,ROUTE_PATHNAMES.MY_PRODUCTS);
                    await my_products_page();
                } catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Update Product Error', JSON.stringify(e));
                }
                
            }


    });

}

function editProductForm(product) {

    return `

    <form id="form-edit-product" method="POST" >
                      
    <p><select name="product_category" id="product_category" class="form-control">
      <option value="fruits" ${product.category == "fruits" ? "selected" : ""}>Fruits</option>
      <option value="vegetables" ${product.category == "vegetables" ? "selected" : ""}>Vegetables</option>
     
     
    </select></p>
    
    <br/>
    <p><input class="form-control" type="text" name="product_name" id="product_name" placeholder="Product Name" value=${product.name} required></p>

    <br/>
    <h5>Image url</h5>
    <p><input class="form-control" type="text" name="product_image" id="product_image" placeholder="Enter image url of product" value=${product.imageURL} required></p>
        
    <br/>
    <h5>Price</h5>
    <p><input class="form-control" type="number" name="product_price" id="product_price" placeholder="Enter price of product" value=${product.price} required></p>
    
    <br/>
    <h5>Stock</h5>
    <p><input class="form-control" type="number" name="product_stock" id="product_stock" placeholder="Enter current stock of product" value=${product.qty} required></p>
    
    <p>
        <h5>Description</h5>
        
        <div class="form-group">

            <textarea name="product_desc" placeholder="Your  description*">${product.summary}</textarea>
      
        </div>
        
        
    </p>
    
    <p><input type="submit" value="Update Product" name="submit_product" class="btn btn-primary" ></p>

</form>

    `;

}
