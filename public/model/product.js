export class Product {
    constructor(data) {
        if (data) {
            this.category = data.category ? data.category.toLowerCase().trim() : null;
            this.uid = data.uid ? data.uid : null;
            this.name = data.name.toLowerCase().trim();
            this.price = typeof data.price == 'number' ? data.price : Number(data.price);
            this.summary = data.summary.trim();
            this.imageURL = data.imageURL;
            this.qty = data.qty ? data.qty : null;
        }
    }

    clone() {
        const copyData = this.serialize();
        const p = new Product(copyData);
        p.set_docId(this.docId);
        return p;
    }

    set_docId(id) {
        this.docId = id;
    }

    //toFireStore data format
    serialize() {
        return {
            category: this.category,
            uid: this.uid,
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageURL: this.imageURL,
            qty: this.qty,
        }
    }
}