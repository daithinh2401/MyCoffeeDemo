import { AppEvent, copyObject, DefaultRegionDelta } from '../MainUtils/AppUtils';
import { EventRegister } from 'react-native-event-listeners';
import LocationManager from './LocationManager';
import { doSendRequest } from '../MainUtils/HttpClient'
import { SERVER_URL } from '../MainUtils/HttpClient'

export default class StoresManager {

    static myInstance = null;

    API_URL = SERVER_URL + '/CoffeeData?type=stores_data';

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new StoresManager();
        }
        return this.myInstance;
    }

    mainDataList = [];
    filterStores = [];
    allStores = [];
    sectionAreaList = [];

    getDataList() {
        return this.mainDataList;
    }

    getFilterStores() {
        return this.filterStores;
    }

    getSectionAreaList() {
        return this.sectionAreaList;
    }

    async fetchData() {
        let response = await doSendRequest(this.API_URL);

        if(response != null) {
            this.mainDataList = copyObject(response);
            this.parseSectionAreaList();
            this.filterAllStores();
            let {region} = LocationManager.getInstance().getCurrentPosition();
            if(region) {
                this.filterStoresByDistance(region);
            }
        }
    }

    getStoreLocation(store) {
        let region;
        if(store) {
            region = {
                latitude: store.coordinate.latitude,
                longitude: store.coordinate.longitude,
                latitudeDelta: DefaultRegionDelta.latitudeDelta,
                longitudeDelta: DefaultRegionDelta.longitudeDelta
            }
        }

        return region;
    }

    getFirstStoreInDicstrict() {
        let store;
        let cloneObject = copyObject(this.filterStores);

        if(cloneObject && cloneObject.length > 0) {
            store = cloneObject[0];
        }

        return store;
    }

    compareDistance = (store1, store2) => {
        let locationManager = LocationManager.getInstance();

        
        let store1Latitude = store1.coordinate.latitude;
        let store1Longitude = store1.coordinate.longitude;
        let store1Distance = locationManager.getDistanceFromCurrentPosition(store1Latitude, store1Longitude);

        let store2Latitude = store2.coordinate.latitude;
        let store2Longitude = store2.coordinate.longitude;
        let store2Distance = locationManager.getDistanceFromCurrentPosition(store2Latitude, store2Longitude);

        return store1Distance - store2Distance;
    }

    filterStoresByDistance(region) {
        let locationManager = LocationManager.getInstance();
        locationManager.setMakerPosition(region);

        this.filterStores.sort(this.compareDistance);

        EventRegister.emit(AppEvent.storeSortedByDistance);
    }

    filterAllStores() {
        let allStores = [];
        let cloneDataList = copyObject(this.mainDataList);

        if(cloneDataList) {
            for(i = 0; i <= cloneDataList.length - 1; i++) {
                let { districts } = cloneDataList[i];
                if(districts) {
                    for(j = 0; j <= districts.length - 1; j++) {
                        let { stores } = districts[j];
                        allStores = allStores.concat(stores);
                    }
                }
            }
        }

        this.allStores = copyObject(allStores);
        this.filterStores = copyObject(allStores);

        EventRegister.emit(AppEvent.filterAllStores);
    }

    filterStoresByDistrictName(filterDistrictName) {
        let result = [];
        let cloneDataList = copyObject(this.mainDataList);

        if(cloneDataList) {
            for(i = 0; i <= cloneDataList.length - 1; i++) {
                let { districts } = cloneDataList[i];
                if(districts) {
                    for(j = 0; j <= districts.length - 1; j++) {
                        if(districts[j].districtName == filterDistrictName) {
                            let { stores } = districts[j];
                            result = stores;
                        }
                    }
                }
            }
        }

        this.filterStores = copyObject(result);

        EventRegister.emit(AppEvent.updateStoreUI);
    }

    createSectionObject(title, data) {
        return ({
            title: title,
            data: data
        });
    }

    parseSectionAreaList() {
        let result = [];

        let cloneDataList = copyObject(this.mainDataList);
        if(cloneDataList) {
            for(i = 0; i <= cloneDataList.length - 1; i++){
                let { city, districts } = cloneDataList[i]
                if(city && districts) {
                    let data = [];
                    for(j = 0; j <= districts.length - 1; j++) {
                        data.push(districts[j].districtName);
                    }
                    let object = this.createSectionObject(city, data);
                    result.push(object);
                }
            }
        }

        this.sectionAreaList = copyObject(result);
    }
}