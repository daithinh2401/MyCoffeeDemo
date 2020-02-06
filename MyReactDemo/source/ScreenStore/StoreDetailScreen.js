import React from 'react';
import { View, StyleSheet, Image, Text, Linking, } from 'react-native';

import SimpleHeader from '../ScreenHeader/SimpleHeader'
import { MainColor, DefaultMiniMapRegionDelta } from '../MainUtils/AppUtils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import LocationIcon from 'react-native-vector-icons/EvilIcons';
import TimeIcon from 'react-native-vector-icons/Ionicons';
import PhoneIcon from 'react-native-vector-icons/Fontisto';

import MapView from 'react-native-maps'
import FastImage from 'react-native-fast-image';

export default class StoreDetailScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const title = navigation.getParam('title');

        return {
            header: () =>
                <SimpleHeader 
                    localHeaderTitle={title} />
        };
    };

    constructor(props) {
        super(props);
    }

    renderStoreImage(item) {
        return(
            <FastImage 
                style= {styles.itemImage}
                source= {{ uri: item.storeImageAddress }}
            />
        )
    }

    renderMiniMap(item) {
        return(
            <MapView
                initialRegion = {
                    {
                        latitude: item.coordinate.latitude,
                        longitude: item.coordinate.longitude,
                        latitudeDelta: DefaultMiniMapRegionDelta.latitudeDelta,
                        longitudeDelta: DefaultMiniMapRegionDelta.longitudeDelta
                    }
                }
                zoomEnabled = {false}
                pitchEnabled = {false}
                rotateEnabled = {false}
                scrollEnabled = {false}
                followsUserLocation = {false}
                showsUserLocation = {false}
                style = {styles.miniMap}>
                    { this.renderAllMarkers(item) }
            </MapView>
        )
    }

    renderAllMarkers(item) {
        return(
            <MapView.Marker
                coordinate = {item.coordinate}
                anchor = {{x: 0.5, y: 0.5}}>
                    <FastImage 
                        style = {styles.markerImage} 
                        source = {{uri: item.storeImageAddress}} />
            </MapView.Marker>
        )
    }

    renderMapView(item) {
        return(
            <View style = {styles.mapViewLayout}>
                {this.renderMiniMap(item)}

                <View style = {styles.addressView}>
                    <LocationIcon name = "location" size = {32} color = {MainColor.orange} />
                    <Text style = {{flex: 1, fontSize: 16}} numberOfLines = {1}>{item.storeAddress}</Text>
                </View>
            </View>
        )
    }

    handleDirectionPress(item) {
        let {coordinate} = item;

        if(coordinate) {
            let {latitude, longitude} = coordinate;

            Platform.select({
                ios: () => {
                    Linking.openURL('http://maps.apple.com/maps?daddr=' + latitude + ',' + longitude);
                },
                android: () => {
                    Linking.openURL('http://maps.google.com/maps?daddr=' + latitude + ',' + longitude);
                }
            })();
        }
    }

    renderDirectionView(item) {
        return(
            <View style = {styles.directionView}>
                <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress = {() => this.handleDirectionPress(item)}>
                    <Text style = {[styles.directionText, styles.colorGreen]}>Grab đến đây</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress = {() => this.handleDirectionPress(item)}>
                    <Text style = {[styles.directionText, styles.colorOrange]}>Chỉ đường đến đây</Text>
                </TouchableOpacity>
            </View>
        )
    }

    callNumber() {
        Linking.openURL('tel:${02871087088}')
    }

    renderDetailView(item) {
        return(
            <View>
                <Text style = {styles.detailTitle}>Chi tiết</Text>
                <View style = {styles.detailView}>
                    <TimeIcon name = "md-time" size = {25} />
                    <View style = {{marginLeft: 10}}>
                        <Text style = {styles.detailContextText}>Giờ mở cửa</Text>
                        <Text style = {styles.detailContextText}>7:00 - 22:00</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    onPress = {() => this.callNumber()}
                    activeOpacity = {0.9}
                    style = {styles.detailView}>
                    <PhoneIcon name = "phone" size = {20} />
                    <View style = {{marginLeft: 10}}>
                        <Text style = {styles.detailContextText}>Liên hệ</Text>
                        <Text style = {styles.detailContextText}>02871087088</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const item = this.props.navigation.getParam('item');

        return (
            <ScrollView style = {styles.mainLayout}>
                {item && this.renderStoreImage(item)}
                {item && this.renderMapView(item)}
                {item && this.renderDirectionView(item)}
                {item && this.renderDetailView(item)}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        backgroundColor: MainColor.whiteSmoke
    },
    itemImage: {
        flex: 1,
        height: 230
    },
    mapViewLayout: {
        backgroundColor: 'white', padding: 15
    },
    miniMap: {
        borderRadius: 8, flex: 1, height: 130
    },
    addressView: {
        flexDirection: 'row', marginTop: 15,
        alignItems: 'center', justifyContent: 'center'
    },
    directionView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
        padding: 15, backgroundColor: 'white',
        borderTopWidth: 0.3, borderBottomWidth: 0.3, borderColor: MainColor.gray
    },
    directionText: {
        padding: 8, paddingLeft: 12, paddingRight: 12, marginLeft: 15,
        borderRadius: 15, borderWidth: 1.2,
        fontSize: 13, fontWeight: 'bold'
    },
    colorGreen: {
        color: MainColor.green, borderColor: MainColor.green
    },
    colorOrange: {
        color: MainColor.orange, borderColor: MainColor.orange
    },
    markerImage: {
        borderRadius: Platform.OS === 'android' ? 100 : 30,
        width: 25, height: 25
    },
    detailView: {
        padding: 15, flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.3, borderColor: MainColor.whiteSmoke
    },
    detailTitle: {
        padding: 15, fontSize: 16, fontWeight: 'bold'
    },
    detailContextText: {
        flex: 1, fontSize: 15
    }
});