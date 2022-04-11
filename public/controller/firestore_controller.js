import {
    getFirestore, query, collection, orderBy, getDocs, addDoc, where, doc, getDoc, setDoc, updateDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
import { AccountInfo } from "../model/account_info.js";

import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
import { Comment } from "../model/comments.js";
import { ShoppingCart } from "../model/shopping_cart.js";

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

    return product;
}

export async function checkout(cart) {
    const data = cart.serialize(Date.now());
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
