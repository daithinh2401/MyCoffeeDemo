import React from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, Image } from 'react-native';
import { MainColor, AppEvent, toLocaleString } from '../MainUtils/AppUtils';

import { EventRegister } from 'react-native-event-listeners'

import Modal from "react-native-modal";
import OrderScreenManager from './OrderScreenManager';

import Icon from 'react-native-vector-icons/Entypo';
import BottomIcon from 'react-native-vector-icons/AntDesign'
import OrderItemsOptionList from './OrderItemsOptionList';
import OrderPopupManager from './OrderPopupManager';
import CartManager from '../ScreenCart/CartManager';
import FastImage from 'react-native-fast-image';

export default class OrderPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            updateItem: false,
        }
    }

    hideModal() {
        OrderScreenManager.getInstance().hideOrderItemDetail();
    }

    clearChecking() {
        this.cartManager = CartManager.getInstance();
        this.cartManager.clearCheckingItemIndex();
    }

    UNSAFE_componentWillMount() {
        this.popupManager = OrderPopupManager.getInstance();
        this.cartManager = CartManager.getInstance();

        let { openFromCart, indexInCart } = this.props;
        if (openFromCart) {
            this.popupManager.initialWaitingItem(this.props.item);
            this.cartManager.setCheckingItemIndex(indexInCart);
        } else {
            this.popupManager.initialMainItem(this.props.item);
            if(this.props.item.size) {
                this.popupManager.updateSizeCheck(this.props.item.size[0].sizeTitle, this.props.item.size[0].sizeFee);
            }
        }
    }

    componentDidMount() {
        this.itemCheckListener = EventRegister.addEventListener(AppEvent.updatePopupUI, (updateItem) => {
            this.setState({
                updateItem
            });
        })
    }

    componentWillUnmount() {
        this.popupManager.removeInstance();

        EventRegister.removeEventListener(this.itemCheckListener);

        this.clearChecking();
    }

    renderPopupHeader() {
        let mainItem = this.popupManager.getMainItem();

        return (
            <View style={styles.headerView}>
                <FastImage
                    style={styles.headerImage}
                    source={{ uri: mainItem.imageURL }}
                />
                <View style={styles.headerTextView}>
                    <View style={[styles.headerTextLayout, styles.styleCenter]}>
                        <Text
                            style={[styles.headerTextStyle, styles.headerTextStyleBold]}>
                            {mainItem.name}
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.hideModal()}>
                            <Icon name="cross" color={MainColor.activeColor} size={22} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerTextLayout}>
                        <Text
                            style={[styles.headerTextStyle, styles.headerTextStyleBold]}>
                            {toLocaleString(mainItem.price)} đ
                        </Text>
                    </View>
                    <View style={[styles.headerTextLayout, styles.styleCenter]}>
                        <Icon name="heart-outlined" size={23} />
                        <Text
                            style={[styles.headerTextStyle, styles.headerTextStyleMargin]}>
                            Yêu thích
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    handleCartButtonPress() {
        let { openFromCart } = this.props;
        this.popupManager = OrderPopupManager.getInstance();

        if (openFromCart) {
            this.popupManager.updateItemToCart(true);
        } else {
            this.popupManager.updateItemToCart(false);
        }

        this.hideModal();
    }

    renderBottomCountIcon(leftIcon) {
        let name;
        let onButtonPress;
        let color = MainColor.orange;
        let { openFromCart } = this.props;

        if (leftIcon) {
            name = "minuscircle";
            if(openFromCart) {
                color = this.popupManager.getItemCount() == 0 ? MainColor.lightGray : MainColor.red;
            }
            else color = this.popupManager.getItemCount() == 1 ? MainColor.lightGray : MainColor.red;

            onButtonPress = this.handleMinusButtonPress;
        } else {
            name = "pluscircle";
            onButtonPress = this.handlePlusButtonPress;
        }

        return <BottomIcon onPress={onButtonPress} name={name} color={color} size={27} />
    }

    handleMinusButtonPress = () => {
        let { openFromCart } = this.props;
        this.popupManager.updateItemCountMinus(openFromCart);
    }

    handlePlusButtonPress = () => {
        this.popupManager.updateItemCountPlus();
    }

    renderPopupFooter() {
        let price = this.popupManager.getTotalPrice();

        return (
            <View style={styles.footerView}>
                <View style={styles.countItemView}>
                    {this.renderBottomCountIcon(true)}
                    <Text style={styles.countItemTextStyle}> {this.popupManager.getItemCount()} </Text>
                    {this.renderBottomCountIcon(false)}
                </View>
                <View style={styles.totalPriceView}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.handleCartButtonPress()}>
                        <Text style={styles.totalPriceText}>{price > 0 ? toLocaleString(price) + ' đ' : 'Bỏ chọn món'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderPopupOptionsList() {
        return (
            <OrderItemsOptionList />
        )
    }

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}>
                <View style={styles.mainLayout}>
                    {this.renderPopupHeader()}
                    {this.renderPopupOptionsList()}
                    {this.renderPopupFooter()}
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({

    mainLayout: {
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        flexDirection: 'column',
        width: Dimensions.get('window').width - 40,
        maxHeight: Dimensions.get('window').height - 100,
    },
    headerView: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white'
    },
    footerView: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    headerImage: {
        width: 80,
        height: 80,
        borderRadius: 7,
        marginRight: 10
    },
    headerTextView: {
        flex: 1
    },
    headerTextLayout: {
        flex: 1,
        flexDirection: 'row',
    },
    styleCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTextStyle: {
        flex: 1,
        fontSize: 15
    },
    headerTextStyleBold: {
        fontWeight: 'bold'
    },
    headerTextStyleMargin: {
        marginLeft: 5,
        marginBottom: 5
    },
    countItemView: {
        flexDirection: 'row',
        alignSelf: 'baseline',
        alignItems: 'center',
        marginTop: 5
    },
    countItemTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 2,
        marginRight: 2,
        marginBottom: 2,
    },
    totalPriceView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    totalPriceText: {
        borderRadius: 10,
        overflow: 'hidden',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: MainColor.orange,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    }
});