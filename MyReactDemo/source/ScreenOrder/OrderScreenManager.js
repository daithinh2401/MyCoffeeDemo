import { EventRegister } from 'react-native-event-listeners'
import { AppEvent } from '../MainUtils/AppUtils';
import { doSendRequest } from '../MainUtils/HttpClient'
import { SERVER_URL } from '../MainUtils/HttpClient'

export default class OrderScreenManager {
    static myInstance = null;

    API_URL =  SERVER_URL + '/CoffeeData?type=test_drinks_data';

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new OrderScreenManager();
        }
        return this.myInstance;
    }

    mDatalist = [];

    getDataList() {
        return this.mDatalist;
    }

    setDataList(dataList) {
        this.mDatalist = dataList;
    }

    async fetchData() {
        let response = await doSendRequest(this.API_URL);

        if(response != null) {
            this.mDatalist = response;
            let requestType = AppEvent.updateOrderScreenItem;
            this.onRequestSuccess(requestType, this.mDatalist);
        }
    }

    onRequestSuccess(requestType, data) {
        this.notifyOrderScreen(requestType, data);
    }

    notifyOrderScreen(requestType, data) {
        EventRegister.emit(requestType, data);
    }

    openOrderItemDetail(item, openFromCart, index) {
        EventRegister.emit(AppEvent.orderItemDetailPopupVisible, {
            item: item,
            isShow: true,
            openFromCart: openFromCart,
            indexInCart: index,
        });
    }

    hideOrderItemDetail() {
        EventRegister.emit(AppEvent.orderItemDetailPopupVisible, {
            item: {},
            isShow: false,
            openFromCart: false,
            indexInCart: -1,
        });
    }
}

/*

    mDatalist will be use for update Order Screen
    the data info below:
    id:                 id of group item
    category:           group name
    item:               list of item
        id:             item id
        name:           item name
        imageURL:       item url for image
        price:          item price
        type:           item type ("drink", "food" ...)
        size:           list of size item have
        toping:         list of toping item have
        description:    item description

*/