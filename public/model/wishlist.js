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


}