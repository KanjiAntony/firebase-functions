export class Comment {
    constructor(data) {
        if (data) {
            this.name = data.name.toLowerCase().trim();
            this.comment = data.comment.trim();
            this.productId = data.productId;
            this.date = data.date;
        }
    }

    clone() {
        const copyData = this.serialize();
        const p = new Comment(copyData);
        p.set_docId(this.docId);
        return p;
    }

    set_docId(id) {
        this.docId = id;
    }

    //toFireStore data format
    serialize() {
        return {
            name: this.name,
            comment: this.comment,
            productId: this.productId,
            date: this.date,
        }
    }
}