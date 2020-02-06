import { EventRegister } from 'react-native-event-listeners'
import { AppEvent } from '../MainUtils/AppUtils';
import CartManager from '../ScreenCart/CartManager';

export default class OrderPopupManager {
    static myInstance = null;
    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new OrderPopupManager();
        }
        return this.myInstance;
    }

    constructor() {
        this.waiting = {
            /* 
                this object need sync with order item that response from server 
                Ex: 
                mainItem: {
                    id: '0',
                    name: '',
                    imageURL: '',
                    price: 0,
                    type: '',
                    size: [],
                    topping: [],
                    description: ''
                }
            */
            mainItem: {}, 
            count: 1,
            sizeIsChecking: {
                title: '',
                value: 0
            },
            toppingList: [],
            totalPrice: 0
        };
    }

    clearItemData() {
        this.waiting = {
            mainItem: {},
            count: 1,
            sizeIsChecking: {
                title: '',
                value: 0
            },
            toppingList: [],
            totalPrice: 0
        };
    }

    initialWaitingItem(waitingItem){
        this.waiting = waitingItem;
        this.calculateTotalPrice();
    }

    initialMainItem(mainItem) {
        this.clearItemData();

        if(this.waiting) {
            this.waiting.mainItem = mainItem;

            this.calculateTotalPrice();
        }
    }

    removeInstance() {
        this.clearItemData();
        this.myInstance = null;
    }

    getwaiting(){
        return this.waiting;
    }

    getMainItem() {
        return this.waiting.mainItem;
    }

    getSizeChecking() {
        return this.waiting.sizeIsChecking;
    }

    getTotalPrice() {
        return this.waiting.totalPrice;
    }

    getItemCount() {
        return this.waiting.count;
    }

    isCheckingSize(sizeTitle) {
        if(this.waiting.sizeIsChecking.title == sizeTitle) {
            return true;
        }

        return false;
    }

    isToppingListHaveItem(toppingName, toppingFee) {
        let { toppingList } = this.waiting;
        let toppingLength = toppingList.length;

        if(toppingLength > 0) {
            for(i = 0; i <= toppingLength - 1; i++){
                if(toppingList[i].title == toppingName && toppingList[i].value == toppingFee) {
                    return i;
                }
            }
        }

        return -1;
    }

    calculateTotalPrice() {
        let totalPrice = this.waiting.mainItem.price;
        let { toppingList, sizeIsChecking } = this.waiting;

        let toppingLength = toppingList.length;
        if(toppingLength > 0) {
            for(i = 0; i <= toppingLength - 1; i++){
                let toppingPrice = toppingList[i].value;
                if(toppingPrice && toppingPrice > 0) {
                    totalPrice += toppingPrice;
                }
            }
        }

        if(sizeIsChecking.value > 0) {
            totalPrice += sizeIsChecking.value;
        }

        this.waiting.totalPrice = totalPrice * this.waiting.count;
    }

    updateSizeCheck(title, value) {
        if(this.waiting) {
            this.waiting.sizeIsChecking.title = title;
            this.waiting.sizeIsChecking.value = value;
            
            this.notifyOrderPopup();
        }
    }

    addOrRemoveTopping(title, value, index) {
        if(this.waiting) {
            if(index == -1) {
                // Don't have item yet, add item
                this.waiting.toppingList.push({
                    title: title,
                    value: value
                });
            } else {
                this.waiting.toppingList.splice(index, 1);
            }
            
            this.notifyOrderPopup();
        }
    }

    updateItemCountPlus() {
        if(this.waiting) {
            this.waiting.count += 1;

            this.notifyOrderPopup();
        }
    }

    updateItemCountMinus(isOpenFromCart) {
        if(this.waiting) {
            if(isOpenFromCart) {
                if(this.waiting.count > 0) {
                    this.waiting.count -= 1;
                }
            } else {
                if(this.waiting.count > 1) {
                    this.waiting.count -= 1;
                }
            }
            

            this.notifyOrderPopup();
        }
    }

    notifyOrderPopup() {
        this.calculateTotalPrice();
        EventRegister.emit(AppEvent.updatePopupUI, true);
    }

    updateItemToCart(isOpenFromCart) {
        this.cartManager = CartManager.getInstance();

        if(isOpenFromCart) {
            if(this.waiting.count == 0) {
                this.cartManager.removeFromCart(this.waiting);
            } else {
                this.cartManager.editCartItem(this.waiting);
            }
        } else {
            this.cartManager.addToCart(this.waiting);
        }
    }
}