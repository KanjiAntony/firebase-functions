export class Report {
    constructor(data) {
        if (data) {
            this.name = data.name.toLowerCase().trim();
            this.report = data.report.trim();
            this.productId = data.productId;
            this.date = data.date;
        }
    }

    clone() {
        const copyData = this.serialize();
        const p = new Report(copyData);
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
            report: this.report,
            productId: this.productId,
            date: this.date,
        }
    }
}