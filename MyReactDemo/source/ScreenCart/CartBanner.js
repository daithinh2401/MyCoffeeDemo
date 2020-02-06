import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { EventRegister } from 'react-native-event-listeners';
import { AppEvent, MainColor, toLocaleString, Screen } from '../MainUtils/AppUtils';

import Cart from 'react-native-vector-icons/FontAwesome';
import CartManager from '../ScreenCart/CartManager';

import ScreenManager from '../MainApp/AppController/ScreenManager'

export class CartBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showCartBanner: false
        }
    }

    componentDidMount() {
        this.registerObserver();
    }

    componentWillUnmount() {
        this.removeObserver();
    }

    registerObserver() {
        this.cartListener = EventRegister.addEventListener(AppEvent.newItemInCart, (showCartBanner) => {
            this.setState({
                showCartBanner
            })
        })
    }

    removeObserver() {
        EventRegister.removeEventListener(this.cartListener);
    }

    handleOpenCart() {
        ScreenManager.getInstance().openScreen(Screen.CartScreen);
    }

    renderCartLayout() {
        this.cartManager = CartManager.getInstance();
        let numberItemsInCart = this.cartManager.getNumberItemsInCart();
        let totalPrice = this.cartManager.getTotalPrice();

        if(numberItemsInCart == 0 || totalPrice == 0){
            return null;
        }

        return(
            <TouchableOpacity 
                activeOpacity = {1}
                onPress = {() => this.handleOpenCart()}
                style = {styles.cartBanner}>
                <View style = {{padding: 12}}>
                    <View style = {styles.cartNumberCircleView}>
                        <Text style = {styles.cartNumberText}>{numberItemsInCart > 10 ? '10+' : numberItemsInCart}</Text>
                    </View>
                    <Cart name = "shopping-cart" size = {25} color = "white"/>
                </View>
                <View style = {{flex: 1, alignItems: 'center'}}>
                    <Text style = {styles.cartTextStyle}>Xem giỏ hàng</Text>
                </View>
                <Text style = {styles.cartTextStyle}>{toLocaleString(totalPrice)} đ</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return(
            this.renderCartLayout()
        )
    }

}

const styles = StyleSheet.create({
    cartBanner: {
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MainColor.orange
    },
    cartTextStyle: {
        fontSize: 16,
        color: 'white', 
        fontWeight: 'bold'
    },
    cartNumberCircleView: {
        alignSelf: 'baseline',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', left: 0, top: 0,
        width: 23, height: 23,
        borderRadius: Platform.OS === 'android' ? 100 : 30,
        backgroundColor: 'white',
    },
    cartNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: MainColor.orange,
    }
});