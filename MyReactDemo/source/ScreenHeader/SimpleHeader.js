import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScreenManager from '../MainApp/AppController/ScreenManager';

import Share from 'react-native-share';
import { ScreenTypeEnum } from '../MainUtils/AppUtils';
import CartManager from '../ScreenCart/CartManager';

export default class SimpleHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    handleButtonClick(leftButton) {
        let screenType = ScreenManager.getInstance().getScreenType();

        if (screenType == ScreenTypeEnum.WebScreen) {
            if (leftButton) {
                this.handleBackButtonClick();
            } else {
                this.handleShareButtonClick();
            }
        }

        else if (
            screenType == ScreenTypeEnum.OrderGridDetail ||
            screenType == ScreenTypeEnum.UserRankScreen  ||
            screenType == ScreenTypeEnum.StoreDetailScreen ) {
            if (leftButton) {
                this.handleBackButtonClick();
            }
        }

        else if (screenType == ScreenTypeEnum.CartScreen) {
            if (leftButton) {
                this.handleBackButtonClick();
            } else {
                this.handleRemoveAllCartItem();
            }
        }
    }

    handleBackButtonClick() {
        ScreenManager.getInstance().goBack()
    }

    handleShareButtonClick() {
        const title = this.props.localHeaderTitle;
        const sourceURL = this.props.localHeaderSourceURL;

        Share.open({
            message: title,
            subject: title,
            title: title,
            url: sourceURL.uri,
            failOnCancel: false,
            
        })
        .then((res) => { console.log(res) })
        .catch((err) => { err && console.log(err); });
    }

    handleRemoveAllCartItem() {
        ScreenManager.getInstance().showAlertDialog(
            'Xóa giỏ hàng',
            'Bạn muốn xóa hết món trong giỏ hàng?',
            [
                {
                    text: 'Hủy bỏ',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Đồng ý', onPress: () => CartManager.getInstance().clearAllCartItem()},
            ]
        );
    }

    /* --- Render left and right icon for header ---*/
    renderIconByScreenType = (leftIcon) => {
        let screenType = ScreenManager.getInstance().getScreenType();
        let name;

        switch(screenType) {
            case ScreenTypeEnum.WebScreen:
                name = leftIcon ? "arrow-left" : "share";
                break;
            case ScreenTypeEnum.OrderGridDetail:
                name = leftIcon ? "arrow-left" : "";
                break;
            case ScreenTypeEnum.CartScreen:
                name = leftIcon ? "close" : "trash";
                break;
            case ScreenTypeEnum.UserRankScreen:
            case ScreenTypeEnum.StoreDetailScreen:
                name = leftIcon ? "close" : "";
                break;
        }

        return this.renderIcon(name, leftIcon);
    }

    renderIcon = (iconName, leftButton) => {
        if (iconName == "") {
            return (
                <View style={styles.localHeaderButton} />
            )
        } else {
            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.localHeaderButton}
                    onPress={() => { this.handleButtonClick(leftButton) }}>
                    <Icon name={iconName} size={20} />
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <View style={styles.localHeaderMainLayout}>
                    {this.renderIconByScreenType(true)}

                    <View style={styles.localHeaderTitleView}>
                        <Text numberOfLines={1} style={styles.localHeaderTitle} >{this.props.localHeaderTitle}</Text>
                    </View>

                    {this.renderIconByScreenType(false)}
                </View>
                <View style={{ width: 1000, height: 0.5, backgroundColor: 'gray' }} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
    },
    localHeaderMainLayout: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    localHeaderTitleView: {
        flex: 1,
        alignItems: 'center'
    },
    localHeaderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    localHeaderButton: {
        margin: 15
    },
});