import React from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Dimensions, SafeAreaView } from 'react-native';

import SimpleHeader from '../ScreenHeader/SimpleHeader'

import { EventRegister } from 'react-native-event-listeners';
import { MainColor, toLocaleString, AppEvent, copyObject } from '../MainUtils/AppUtils';

import Notes from 'react-native-vector-icons/SimpleLineIcons';
import CartManager from './CartManager';
import { TouchableOpacity } from 'react-native-gesture-handler';

import OrderScreenManager from '../ScreenOrder/OrderScreenManager';
import ScreenManager from '../MainApp/AppController/ScreenManager';

export default class CartScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: () =>
                <SimpleHeader localHeaderTitle='Giỏ hàng của bạn' />
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            updateUI: false
        }
    }

    UNSAFE_componentWillMount() {
        this.cartManager = CartManager.getInstance();
    }

    handleBackToPreviousScreen() {
        ScreenManager.getInstance().goBack();
    }

    componentDidMount() {
        this.cartListener = EventRegister.addEventListener(AppEvent.newItemInCart, (updateUI) => {
            if (!updateUI) {
                this.handleBackToPreviousScreen()
            } else {
                this.setState({ updateUI })
            }
        })
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.cartListener);
    }

    renderTextInputView() {
        return (
            <View style={styles.textViewVertical}>
                <Notes name="note" size={25} />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder="Bạn muốn dặn dò gì không?"
                    placeholderTextColor={MainColor.gray}
                    multiline={true}
                />
            </View>
        )
    }

    renderItemsInCart() {
        let data = this.cartManager.getCart();

        return (
            data.map((item, index) => {
                return (
                    <ItemInCart key={index} itemIndexInCart={index} item={item} />
                )
            })
        )
    }

    renderTotalTextView() {
        let totalPrice = this.cartManager.getTotalPrice();

        return (
            <View style={styles.textViewVertical}>
                <Text style={[{ flex: 1 }, styles.itemTextStyle]}>Tổng cộng</Text>
                <Text style={styles.itemTextStyle}>{toLocaleString(totalPrice)} đ</Text>
            </View>
        )
    }

    renderFloatBottomOrderView() {
        let totalPrice = this.cartManager.getTotalPrice();

        return (
            <SafeAreaView style={{ flexDirection: 'row' }}>
                <View style={styles.bottomFloatView}>
                    <View style={{ flex: 1 }} />
                    <Text style={[{ flex: 1 }, styles.bottomFloatTextStyle]}>Đặt hàng</Text>
                    <Text style={styles.bottomFloatTextStyle}>{toLocaleString(totalPrice)} đ</Text>
                </View>
            </SafeAreaView>
        )
    }

    render() {
        return (
            <View style={styles.mainLayout}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.titleTextStyle}>Chi tiết đơn hàng</Text>

                    {this.renderItemsInCart()}

                    <View style={[styles.itemLayout, { padding: 10 }]}>
                        {this.renderTextInputView()}
                    </View>
                    <View style={styles.dividerStyle} />

                    <View style={[styles.itemLayout, { padding: 15 }]}>
                        {this.renderTotalTextView()}
                    </View>
                    <View style={styles.dividerStyle} />
                </ScrollView>

                {this.renderFloatBottomOrderView()}
            </View>
        )
    }
}

class ItemInCart extends React.Component {

    constructor(props) {
        super(props);
    }

    renderToppingList(toppingList) {
        return (
            toppingList.map((item, index) => {
                return (
                    <Text key={index} style={[styles.normalTextStyle, { color: MainColor.gray }]}>{item.title}</Text>
                )
            })
        )
    }

    handleOpenOrderPopup() {
        let { item, itemIndexInCart } = this.props;
        let cloneItem = copyObject(item);
        OrderScreenManager.getInstance().openOrderItemDetail(cloneItem, true, itemIndexInCart);
    }

    render() {
        let { item } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.handleOpenOrderPopup()}
            >
                <View style={[styles.itemLayout, { padding: 15, flexDirection: 'row' }]}>
                    <Text style={styles.itemCountTextStyle}>{item.count}</Text>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={styles.itemTextStyle}>{item.mainItem.name}</Text>
                        <Text style={[styles.normalTextStyle, { color: MainColor.gray }]}>{item.sizeIsChecking.title}</Text>
                        {this.renderToppingList(item.toppingList)}
                    </View>
                    <Text style={styles.normalTextStyle}>{toLocaleString(item.totalPrice)} đ</Text>
                </View>
                <View style={[styles.dividerStyle, { marginLeft: 40, marginRight: 20 }]} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        backgroundColor: MainColor.whiteSmoke
    },
    itemLayout: {
        backgroundColor: 'white', paddingLeft: 15, paddingRight: 15
    },
    titleTextStyle: {
        flex: 1, fontSize: 16, fontWeight: 'bold', padding: 15
    },
    textViewVertical: {
        flexDirection: 'row', alignItems: 'center',
    },
    textInputStyle: {
        fontSize: 15, marginLeft: 10
    },
    itemTextStyle: {
        fontSize: 17, fontWeight: 'bold',
    },
    itemCountTextStyle: {
        fontSize: 15, color: MainColor.orange, padding: 2, paddingRight: 7, paddingLeft: 7,
        borderWidth: 1, borderColor: 'black',
        alignSelf: 'center'
    },
    normalTextStyle: {
        fontSize: 15, fontWeight: 'bold'
    },
    dividerStyle: {
        flex: 1, height: 0.5,
        backgroundColor: MainColor.gray,
    },
    bottomFloatView: {
        flex: 1, flexDirection: 'row', backgroundColor: MainColor.orange, bottom: 0,
        padding: 20, alignItems: 'center', justifyContent: 'center'
    },
    bottomFloatTextStyle: {
        justifyContent: 'center', alignItems: 'center',
        fontSize: 16, fontWeight: 'bold',
        color: 'white'
    }
});