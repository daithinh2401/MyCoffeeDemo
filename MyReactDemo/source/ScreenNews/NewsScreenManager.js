import { EventRegister } from 'react-native-event-listeners'
import { AppEvent } from '../MainUtils/AppUtils';
import { doSendRequest } from '../MainUtils/HttpClient'
import { SERVER_URL } from '../MainUtils/HttpClient'

export default class NewsScreenManager {
    static myInstance = null;

    API_LINK = SERVER_URL + '/CoffeeData?type=';

    API_URL = {
        first: 'https://raw.githubusercontent.com/daithinh2401/MyCoffeeDemo/master/TestAPI/new_screen_1.json',
        second: 'https://raw.githubusercontent.com/daithinh2401/MyCoffeeDemo/master/TestAPI/new_screen_2.json',
        third: 'https://raw.githubusercontent.com/daithinh2401/MyCoffeeDemo/master/TestAPI/new_screen_3.json'
    }

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new NewsScreenManager();
        }
        return this.myInstance;
    }

    async fetchNewsData() {
        this.fetchFirst();
        this.fetchSecond();
        this.fetchThird();
    }

    async fetchFirst() {
        let response = await doSendRequest(this.API_LINK + 'new_screen_1');
        // let response = await this.sendRequest(this.API_URL.first);
        if(response != null) {
            let requestType = AppEvent.updateNewsScreenItem;
            this.onRequestSuccess(requestType, 
                {
                    type: 1,
                    data: response.first
                }
            );
        }
    }

    async fetchSecond() {
        let response = await doSendRequest(this.API_LINK + 'new_screen_2');
        // let response = await this.sendRequest(this.API_URL.second);
        if(response != null) {
            let requestType = AppEvent.updateNewsScreenItem;
            this.onRequestSuccess(requestType, 
                {
                    type: 2,
                    data: response.second
                }
            );
        }
    }

    async fetchThird() {
        let response = await doSendRequest(this.API_LINK + 'new_screen_3');
        // let response = await this.sendRequest(this.API_URL.third);
        if(response != null) {
            let requestType = AppEvent.updateNewsScreenItem;
            this.onRequestSuccess(requestType, 
                {
                    type: 3,
                    data: response.third
                }
            );
        }
    }


    onRequestSuccess(requestType, data) {
        this.notifyNewsScreen(requestType, data);
    }
    notifyNewsScreen(requestType, data) {
        EventRegister.emit(requestType, data);
    }
}