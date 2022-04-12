import { Product } from "./product.js";

export class Wishlist {
    constructor(items) {
        this.items = items;
    }

    serialize(){
        return {
            items: this.items,
        }
    }

    getTotalWishlist() {
        return this.items.length;
    }

    static instance(){
        return new Wishlist({
            items: []
        })
    }


    /*addItem(product) {
        const index = this.items.findIndex(e => product.docId == e.docId);
        if (index < 0) {
            const newItem = product.docId;
            this.items.push(newItem);
        } 
    }

    removeItem(product) {
        const index = this.items.findIndex(e => product.docId == e.docId);
        if (index >= 0) {
                this.items.splice(index, 1);
        }
    }

    getTotalWishlist() {
        return this.items.length;
    }

    clear() {
        this.items.length = 0;
    }

    serialize(timestamp) {
        const serializedItems = this.items.map(e => e.serialize());
        return { uid: this.uid, items: serializedItems, timestamp };
    }

    static deserialize(data) {
        const sc = new Wishlist(data.uid);
        if (data.items && Array.isArray(data.items)) {
            sc.items = data.items.map(e => new Product(e));
        }
        sc.timestamp = data.timestamp;
        return sc;
    }*/

}