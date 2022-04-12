import {
    getFirestore, query, collection, orderBy, getDocs, addDoc, where, doc, getDoc, setDoc, updateDoc, deleteDoc,onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
import { AccountInfo } from "../model/account_info.js";

import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
import { Comment } from "../model/comments.js";
import { ShoppingCart } from "../model/shopping_cart.js";
import { Wishlist } from "../model/wishlist.js";
import * as Util from '../viewpage/util.js';

const db = getFirestore();

export async function getProductList() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('name'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);

    });
    return products;
}

/*export async function realtimeProductUpdate() {

    
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('name'));

    const realtime_products = onSnapshot(q, (querySnapshop) => {
        const products = [];
        querySnapshop.forEach(doc => {
            const p = new Product(doc.data());
            p.set_docId(doc.id);
            products.push(p);
            console.log(products);
        });

        

    });

    return products;

}*/

export async function updateProduct(product, prod_id) {
    const docRef = doc(db, COLLECTION_NAMES.PRODUCT, prod_id);
    await updateDoc(docRef, product);
}

export async function deleteProduct(prod_id) {
    const docRef = doc(db, COLLECTION_NAMES.PRODUCT, prod_id);
    await deleteDoc(docRef);
}

export async function createProduct(product) {
    const raw_product = new Product(product);
    const data = raw_product.serialize();
    await addDoc(collection(db, COLLECTION_NAMES.PRODUCT), data);
}

export async function getMyProductsList(uid) {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), 
                where('uid', '==', uid));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function getSpecificProduct(prod_id) { 

    const q = doc(db, COLLECTION_NAMES.PRODUCT,prod_id);
    const snapShot = await getDoc(q);

    const product = new Product(snapShot.data());
    product.set_docId(prod_id);
    return product;
}

export async function checkout(cart) {
    const data = cart.serialize(Date.now());
    //console.log(data);
    await addDoc(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), data);
}

export async function checkout_wishlist(uid,wishlist) {

    const items = [];
    wishlist.forEach(prod => {

        const raw_product = new Product(prod);
        const prod_data = raw_product.serialize();
        items.push(prod_data);
    });
    

    //console.log(items);

    const timestamp = Date.now();
    const data = { uid, items, timestamp}

    await addDoc(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), data);
}

export async function getPurchaseHistory(uid) {
    const q = query(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);

    const carts = [];
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data());
        carts.push(sc);
    });
    return carts;
}

export async function getAccountInfo(uid) {
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return new AccountInfo(docSnap.data());
    } else {
        const defaultInfo = AccountInfo.instance();
        const accountDocRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
        await setDoc(accountDocRef, defaultInfo.serialize());
        return defaultInfo;
    }
}

export async function updateAccountInfo(uid, updateInfo) {
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    await updateDoc(docRef, updateInfo);
}

export async function getWishlist(uid) {
    const docRef = doc(db, COLLECTION_NAMES.WISHLIST, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return new Wishlist(docSnap.data().items);
    } 
}

export async function addToWishlist(uid, product_id) {


    const docRef = doc(db, COLLECTION_NAMES.WISHLIST, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

            const user_wishlist_items = docSnap.data().items;
            const is_available = user_wishlist_items.includes(product_id);

            if(is_available) {
                //console.log("Available")
                const index = user_wishlist_items.indexOf(product_id);
                if (index >= 0) {
                        user_wishlist_items.splice(index, 1);
                }
                const updateInfo = {"items": user_wishlist_items};
                await updateDoc(docRef, updateInfo);
                Util.info('Success', 'Removed from wishlist!');
            } else {
                //console.log("Not Available")
                const updateInfo = {"items": [...user_wishlist_items, product_id]};
                await updateDoc(docRef, updateInfo);
                Util.info('Success', 'Added to wishlist!');
            }

    } else {

        const items = [];
        items.push(product_id);

        const raw_wishlist = new Wishlist(items);
        const data = raw_wishlist.serialize();
        const wishlistDocRef = doc(db, COLLECTION_NAMES.WISHLIST, uid);
        await setDoc(wishlistDocRef, data);
        Util.info('Success', 'Added to wishlist!');
    }

    /*const q = query(docRef, where("items", "array-contains", product_id))

    //console.log(q);

    let querySnapshot = q.get();

    if(querySnapshot.empty()) {
        console.log("Available pace")
    } else {
        console.log("Not Available")
    }

    /*const items = [];
    items.push(product_id);

    const raw_wishlist = new Wishlist(items);
    const data = raw_wishlist.serialize();
    const wishlistDocRef = doc(db, COLLECTION_NAMES.WISHLIST, uid);
    await setDoc(wishlistDocRef, data);*/
}

export async function createComment(comment) {
    const raw_comment = new Comment(comment);
    const data = raw_comment.serialize();
    await addDoc(collection(db, COLLECTION_NAMES.COMMENTS), data);
}

export async function getAllComments(productId) {
    const q = query(collection(db, COLLECTION_NAMES.COMMENTS),
        where('productId', '==', productId),
        orderBy('date', 'desc'));
    const snapShot = await getDocs(q);

    const productComments = [];
    snapShot.forEach(doc => {
        const sc = new Comment(doc.data());
        productComments.push(sc);
    });
    return productComments;
}
