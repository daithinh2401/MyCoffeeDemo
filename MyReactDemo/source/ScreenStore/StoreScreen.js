import React from 'react';
import { View, StyleSheet, Image, } from 'react-native';
import { MainColor, AppEvent, DefaultRegionDelta } from '../MainUtils/AppUtils';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import LocationManager from './LocationManager';
import { EventRegister } from 'react-native-event-listeners';
import BottomFloatView from './BottomFloatView';

import MainMarker from 'react-native-vector-icons/MaterialIcons';
import StoresManager from './StoresManager';
import TopAreaPicker from './TopAreaPicker';
import FastImage from 'react-native-fast-image';

export default class StoreScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 10.784677, 
                longitude: 106.668868,
                latitudeDelta: DefaultRegionDelta.latitudeDelta,
                longitudeDelta: DefaultRegionDelta.longitudeDelta
            },
            updateUI: false,
        }
        this.locationManager = LocationManager.getInstance();
        this.storesManager = StoresManager.getInstance();
    }

    componentDidMount() {
        this.locationListener = EventRegister.addEventListener(AppEvent.locationInit,() => this.handleUpdateLocation());
        this.locationListener = EventRegister.addEventListener(AppEvent.locationReload,() => this.moveToCurrentPosition());
        this.locationListener = EventRegister.addEventListener(AppEvent.updateStoreUI,() => this.handleStoresUpdate());
        this.locationListener = EventRegister.addEventListener(AppEvent.filterAllStores,() => this.handleAllStoresFilter());
        this.getFirstLocation();
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.locationListener);
    }

    handleAllStoresFilter() {
        this.setState({ updateUI: !this.state.updateUI })
    }

    handleUpdateLocation() {
        let position = this.locationManager.getCurrentPosition();
        this.setState({ region: position.region });
    }

    getFirstLocation() {
        this.locationManager.getFirstLocation();
    }

    moveToPosition(region) {
        this.mapView.animateToRegion(region, 400);
    }

    moveToCurrentPosition() {
        let position = this.locationManager.getCurrentPosition();
        this.moveToPosition(position.region);
    }

    handleStoresUpdate() {
        let firstStoreInDistrict = this.storesManager.getFirstStoreInDicstrict();
        let location = this.storesManager.getStoreLocation(firstStoreInDistrict);

        if(location) {
            this.moveToPosition(location);
        }

        this.setState({ updateUI: !this.state.updateUI })
    }

    renderAllMarkers() {
        let allMarkers = this.storesManager.getFilterStores();

        return(
            allMarkers.map((marker, index) => (
                <MapView.Marker
                    key = {index}
                    coordinate = {marker.coordinate}
                    anchor = {{x: 0.5, y: 0.5}}>
                        <FastImage 
                            style = {styles.markerImage} 
                            source = {{uri: marker.storeImageAddress}} />
                </MapView.Marker>
            ))
        )
    }

    handleRegionChangeComplete(region) {
        this.storesManager.filterStoresByDistance(region);
    }

    render() {
        let position = this.locationManager.getCurrentPosition();

        return (
            <View style={styles.mainLayout}>
                <MapView
                    ref = {ref => (this.mapView = ref)}
                    initialRegion = {position.region}
                    zoomEnabled = {true}
                    followsUserLocation = {false}
                    showsUserLocation = {true}
                    onRegionChangeComplete = {(region) => this.handleRegionChangeComplete(region)}
                    style = {styles.mapLayout}>
                        { this.renderAllMarkers() }
                </MapView>

                <MainMarker 
                    style = {styles.mainMaker} 
                    name = "location-on" 
                    size = {45}
                    color = {MainColor.orange}/>

                <TopAreaPicker />

                <BottomFloatView />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        backgroundColor: MainColor.lightGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainMaker: {
        marginBottom: 40
    },
    mapLayout: {
        left: 0, right: 0, top: 0, bottom: 0,
        position: 'absolute'
    },
    markerImage: {
        borderRadius: Platform.OS === 'android' ? 100 : 30,
        width: 40, height: 40
    }
});