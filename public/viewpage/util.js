import { currentUser } from "../controller/firebase_auth.js";
import { getAccountCurrency } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";
import * as Elements from "./elements.js";



export function currency(value){
    let the_curr;
    let curr = Elements.MENU.CurrencyChooser.value;
    let format;
    if(curr == "USD") {
        the_curr = "USD";
        format = "en-US";
    } else if(curr == "EUR") {
        the_curr = "EUR";
        format = "de-DE";
    } else if(curr == "") {
        the_curr = "USD";
        format = "en-US";
    }
    //return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value);
    return Intl.NumberFormat(format, {style: 'currency', currency: the_curr}).format(value);
}

export function info(title, body, closeModal) {
    if(closeModal) closeModal.hide();
    Elements.modalInfobox.title.innerHTML = title;
    Elements.modalInfobox.body.innerHTML = body;
    Elements.modalInfobox.modal.show();
}

export function disableButton(button) {
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.innerHTML='Wait...';
    return originalLabel;
}

export function enableButton(button, label){
    if(label)button.innerHTML=label;
    button.disabled = false;
}

export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}