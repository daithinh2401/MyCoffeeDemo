import { EventRegister } from 'react-native-event-listeners'
import { AppEvent } from '../MainUtils/AppUtils';

export default class CartManager {
    static myInstance = null;
    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new CartManager();
        }
        return this.myInstance;
    }

    constructor() {
        this.cart = [];
        this.numberItemsInCart = 0;
        this.totalPriceInCart = 0;
        this.isCheckingIndex = -1;
    }

    getCart() {
        return this.cart;
    }

    clearCheckingItemIndex() {
        this.isCheckingIndex = -1;
    }

    setCheckingItemIndex(value) {
        this.isCheckingIndex = value; 
    }

    getNumberItemsInCart() {
        return this.numberItemsInCart;
    }

    getTotalPrice() {
        return this.totalPriceInCart;
    }

    summarizeNumberItems() {
        let count = 0;

        if(this.cart) {
            let cartLength = this.cart.length;
            if(cartLength > 0) {
                for(i = 0; i <= cartLength - 1; i++) {
                    count += this.cart[i].count;
                }
            }
        }

        return count;
    }

    summarizePrice() {
        let price = 0;

        if(this.cart) {
            let cartLength = this.cart.length;
            if(cartLength > 0) {
                for(i = 0; i <= cartLength - 1; i++) {
                    price += this.cart[i].totalPrice;
                }
            }
        }

        return price;
    }

    summarizeCartItem() {
        this.numberItemsInCart = this.summarizeNumberItems();
        this.totalPriceInCart = this.summarizePrice();

        if(this.numberItemsInCart > 0 && this.totalPriceInCart > 0) {
            EventRegister.emit(AppEvent.newItemInCart, true);
        } else {
            EventRegister.emit(AppEvent.newItemInCart, false);
        }
    }

    findItemInCart(item) {
        let cloneCart = [...this.cart];

        let cartLength = cloneCart.length;
        for(i = 0; i <= cartLength - 1; i++) {
            if(cloneCart[i] === item) {
                return i;
            }
        }

        return -1;
    }

    addToCart(item) {
        this.cart.push(item);

        this.summarizeCartItem();
    }

    removeFromCart(item) {
        // let itemIndex = this.findItemInCart(item);
        // if(itemIndex != -1) {
        //     this.cart.splice(itemIndex, 1);

        //     this.summarizeCartItem();
        // }

        if(this.isCheckingIndex != -1) {
            this.cart.splice(this.isCheckingIndex, 1);
            this.isCheckingIndex = -1;

            this.summarizeCartItem();
        }
    }

    editCartItem(newItem) {
        if(this.isCheckingIndex != -1) {
            this.cart[this.isCheckingIndex] = newItem;

            this.summarizeCartItem();
        }
    }

    clearAllCartItem() {
        this.cart = [];

        this.summarizeCartItem();
    }
}