import Geolocation from 'react-native-geolocation-service'
import { AppEvent, DefaultRegionDelta } from '../MainUtils/AppUtils';
import { EventRegister } from 'react-native-event-listeners';
import {PermissionsAndroid, Platform} from 'react-native';

export default class LocationManager {

    static myInstance = null;
    currentPosition = {};
    markerPosition = {};

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new LocationManager();
        }
        return this.myInstance;
    }

    isHaveMarkerPosition() {
        let {region} = this.markerPosition;
        if(region) {
            return true;
        }

        return false;
    }

    getCurrentPosition() {
        return this.currentPosition;
    }

    setMakerPosition(region) {
        this.markerPosition.region = region;
    }

    updateCurrentPosition(latitude, longitude) {
        this.currentPosition.region = {
            latitude: latitude, 
            longitude: longitude,
            latitudeDelta: DefaultRegionDelta.latitudeDelta,
            longitudeDelta: DefaultRegionDelta.longitudeDelta
        };
    }

    async requestLocationPermission() {
        if(Platform.OS === 'ios') {
            return true;
        }

        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
            return false;
        }
      }

    async getFirstLocation() {
        let locationRequest = await this.requestLocationPermission();
        if(locationRequest) {
            Geolocation.getCurrentPosition(
                (position) => {
                    let { latitude , longitude } = position.coords;
                    this.updateCurrentPosition(latitude, longitude);
                    EventRegister.emit(AppEvent.locationInit);
                },
                (error) => {
                    this.updateCurrentPosition(10.784677, 106.668868);
                    EventRegister.emit(AppEvent.locationInit)
                },
                {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
            );
        }
    }

    async reloadLocation() {
        let locationRequest = await this.requestLocationPermission();
        if(locationRequest) {
            Geolocation.getCurrentPosition(
                (position) => {
                    let { latitude , longitude } = position.coords;
                    this.updateCurrentPosition(latitude, longitude);
                    EventRegister.emit(AppEvent.locationReload);
                },
                (error) => {EventRegister.emit(AppEvent.locationUpdateFailed)},
                {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
            );
        }
    }

    rad(x) {
        return x * Math.PI / 180;
    };

    getDistanceFromCurrentPosition(latitude, longitude) {
        let d = -1;
        if(this.isHaveMarkerPosition()) {
            let currentLatitude = this.markerPosition.region.latitude;
            let currentLongitude = this.markerPosition.region.longitude;

            let R = 6378137; // Earth’s mean radius in meter     
            let dLat = this.rad(latitude - currentLatitude);
            let dLong = this.rad(longitude - currentLongitude);
            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.rad(currentLatitude)) * Math.cos(this.rad(latitude)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
        }

        return d; // returns the distance in meter
    };
}