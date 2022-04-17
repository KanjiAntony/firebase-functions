export class DeviceTokens {
    constructor(items) {
        this.items = items;
    }

    serialize(){
        return {
            items: this.items
        }
    }

    getTotalRating() {
        return this.items.length;
    }

    static instance(){
        return new Rating({
            items: new Map()
        })
    }


}