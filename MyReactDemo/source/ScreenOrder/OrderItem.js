import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { MainColor, toLocaleString } from '../MainUtils/AppUtils';

import Icon from 'react-native-vector-icons/Ionicons';

import OrderScreenManager from './OrderScreenManager';
import FastImage from 'react-native-fast-image';

export default class OrderItem extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIcon(item) {
        if(parseInt(item.id) >= 0) {
            return <Icon name="ios-add-circle-outline" color = {MainColor.activeColor} size={25} />;
        }
        return null;
    }

    handleItemPress(item) {
        if(parseInt(item.id) >= 0) {
            OrderScreenManager.getInstance().openOrderItemDetail(item, false, -1)
        }
    }
    
    render() {
        let {price} = this.props.item;
        
        return(
            <TouchableOpacity 
                onPress = {() => this.handleItemPress(this.props.item)}
                style = {styles.shadowLayout}
                activeOpacity={0.85}>
                <View style = { this.props.lastItem ? [styles.itemLayout, styles.itemLayoutMarginRight] : styles.itemLayout}>
                    <FastImage
                        style={styles.itemImage}
                        source={
                            {
                                uri: this.props.item.imageURL
                            }
                        }>
                    </FastImage>
                    <View style = {styles.middleTextView}>
                        <Text numberOfLines = {1} style = {styles.middleTextTitle}>{this.props.item.name}</Text>
                    </View>
                    <View style = {styles.bottomView}>
                        <Text style = {styles.bottomPriceText}> {price > 0 ? toLocaleString(price) + ' đ' : ''} </Text>
                        {this.renderIcon(this.props.item)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    shadowLayout: {
        shadowColor: '#000',
        shadowOffset: { width: -3, height: 3 },
        shadowOpacity: 0.3,
        marginBottom: 10,
        elevation: 1,
    },
    itemLayout: {
        width: 200,
        borderRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'white',
        marginLeft: 20,
        borderWidth: 1,
        borderColor: MainColor.lightGray,
    },
    itemLayoutMarginRight: {
        marginRight: 20
    },
    itemImage: {
        height: 170
    },
    middleTextView: {
        padding: 10,
        flexDirection: 'column',
        paddingBottom: 30,
        borderBottomWidth: 0.5,
        borderColor: MainColor.lightGray
    },
    middleTextTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 20
    },
    bottomPriceText: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
    },
});