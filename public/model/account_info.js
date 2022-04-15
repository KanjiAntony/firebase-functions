export class AccountInfo {
    constructor(data) {
        this.name = data.name;
        this.address = data.address;
        this.city = data.city;
        this.state = data.state;
        this.zip = data.zip;
        this.creditNo = data.creditNo;
        this.photoURL = data.photoURL;
        this.currency = data.currency;
        this.promos = data.promos;
    }

    serialize(){
        return {
            name: this.name,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            creditNo: this.creditNo,
            photoURL: this.photoURL,
            currency: this.currency,
            promos: this.promos,
        }
    }

    static instance(){

        const prom = new Map();
        const prom_obj = Object.fromEntries(prom);
        return new AccountInfo({
            name: '', address: '', city: '',
            state: '',zip: '', creditNo: '',
            photoURL: 'images/default_profile.jpg',
            currency: "USD",
            promos: prom_obj,
        })
    }
}