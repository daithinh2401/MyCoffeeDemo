import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, FlatList } from 'react-native';

import LocationIcon from 'react-native-vector-icons/MaterialIcons';
import LocationManager from './LocationManager';
import StoresManager from './StoresManager';

import { AppEvent, Screen } from '../MainUtils/AppUtils';
import { EventRegister } from 'react-native-event-listeners';

import ScreenManager from '../MainApp/AppController/ScreenManager';
import FastImage from 'react-native-fast-image';

export default class BottomFloatView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            updateUI: false,
        }

        this.locationManager = LocationManager.getInstance();
        this.storesManager = StoresManager.getInstance();
    }

    componentDidMount() {
        this.storesListener = EventRegister.addEventListener(AppEvent.storeSortedByDistance,() => this.refreshUI());
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.storesListener);
    }

    refreshUI() {
        this.setState({ updateUI: !this.state.updateUI })
    }

    handleLocationPress() {
        this.storesManager.filterAllStores();
        this.locationManager.reloadLocation();
    }

    renderLocationButton(stores) {
        if (stores && stores.length > 0) {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.locationButton}
                    onPress={() => this.handleLocationPress()}>
                    <LocationIcon name="my-location" size={25} color="white" />
                </TouchableOpacity>
            )
        }
        return null;
    }

    renderListStores(stores) {
        if (stores && stores.length > 0) {
            return (
                <FlatList
                    keyExtractor={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={stores}
                    renderItem={({item}) =>
                        <StoreItem item = {item} />
                    } />
            )
        }
        return null;
    }

    get5StoresInList(stores) {
        let result = [];
        if (stores) {
            for(i = 0; i <= 4; i++) {
                if(stores[i]) {
                    result.push(stores[i]);
                }
            }
        }

        return result;
    }

    render() {
        let stores = this.storesManager.getFilterStores();
        let filter5Stores = this.get5StoresInList(stores);

        return (
            <View style={styles.mainLayout}>
                {this.renderLocationButton(filter5Stores)}
                {this.renderListStores(filter5Stores)}
            </View>
        )
    }
}

class StoreItem extends React.Component {

    constructor(props) {
        super(props);
    }

    splitDistrictFromAddress(address) {
        let district = "";
        if(address) {
            let splitArray = address.split(",");
            if(splitArray.length > 2) {
                district = splitArray[1].trim();
            }
        }
    
        return district;
    }

    splitStreetFromAddress(address) {
        let street = "";
        if(address) {
            let splitArray = address.split(",");
            if(splitArray.length > 0) {
                street = splitArray[0].trim();
            }
        }
    
        return street;
    }

    openStoreDetail() {
        let {item} = this.props;
        
        if(item) {
            let {storeAddress} = item;
            let street = this.splitStreetFromAddress(storeAddress);

            ScreenManager.getInstance().openScreen( Screen.StoreDetailScreen, 
            {
                title: street,
                item: item
            });
        }
    }

    render() {
        let {item} = this.props;
        let {storeAddress, storeImageAddress} = item;
        
        let district = this.splitDistrictFromAddress(storeAddress);
        
        return (
            <TouchableOpacity
                onPress = {() => this.openStoreDetail()}
                style={styles.shadowLayout}
                activeOpacity={0.9}>
                <View style={styles.itemLayout}>
                    {<FastImage
                        style={styles.itemImage}
                        source={
                            {
                                uri: storeImageAddress
                            }
                        }>
                    </FastImage>}
                    {<View style={styles.middleTextView}>
                        <Text numberOfLines={1} style={styles.middleTextTitle}>{district}</Text>
                        <Text numberOfLines={1} style={styles.middleTextTitle}>{storeAddress}</Text>
                    </View>}
                </View>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    mainLayout: {
        position: 'absolute', bottom: 0,
    },
    locationButton: {
        shadowColor: '#000',
        shadowOffset: { width: -3, height: 3 },
        shadowOpacity: 0.3,
        elevation: 1,
        borderRadius: Platform.OS === 'android' ? 100 : 30,
        padding: 7, margin: 15,
        backgroundColor: 'black',
        alignSelf: 'flex-end',
    },
    shadowLayout: {
        shadowColor: '#000',
        shadowOffset: { width: -3, height: 3 },
        shadowOpacity: 0.3,
        marginBottom: 15,
        elevation: 1,
    },
    itemLayout: {
        width: 150,
        borderRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'white',
        marginLeft: 10,
    },
    itemImage: {
        height: 110
    },
    middleTextView: {
        padding: 10, flexDirection: 'column',
    },
    middleTextTitle: {
        fontSize: 16, marginBottom: 5
    },
});