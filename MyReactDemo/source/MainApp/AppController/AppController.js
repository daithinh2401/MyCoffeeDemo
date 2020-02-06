import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { EventRegister } from 'react-native-event-listeners'
import { ScreenTypeEnum, AppEvent, MapScreenType } from '../../MainUtils/AppUtils';

import ScreenManager from './ScreenManager';
import AppNavigation from './AppNavigation';

import NavigationService from '../../MainUtils/NavigationService';
import OrderPopup from '../../ScreenOrder/OrderPopup';
import StoresManager from '../../ScreenStore/StoresManager';
import LocationManager from '../../ScreenStore/LocationManager';
import AuthManager from '../../ScreenAuth/AuthManager';

import Modal from "react-native-modal";

export default class AppController extends React.Component {

    constructor(props) {
        super(props);

        // Bind the this context to the visibleProgressDialog function
        this.visibleProgressDialog = this.visibleProgressDialog.bind(this);

        this.state = {
            showOrderPopup: {
                item: {},
                isShow: false,
                openFromCart: false,
                indexInCart: -1,
            },
            showProgressDialog: false,
        }
    }

    componentDidMount() {
        ScreenManager.getInstance().registerObserver();
        AuthManager.getInstance().initializeAuthManager();

        this.openDetailPopupListener = EventRegister.addEventListener(
            AppEvent.orderItemDetailPopupVisible, (showOrderPopup) => {
                this.setState({
                    showOrderPopup
                })
            })

        this.dialogListener = EventRegister.addEventListener(
            AppEvent.showProgressDialog, (isVisible) => {
                this.setState({
                    showProgressDialog: isVisible
                })
            })

        LocationManager.getInstance().getFirstLocation();
        StoresManager.getInstance().fetchData();
    }

    componentWillUnmount() {
        ScreenManager.getInstance().removeObserver();
        AuthManager.getInstance().removeFirebaseAuthListener();

        EventRegister.removeEventListener(this.openDetailPopupListener);
        EventRegister.removeEventListener(this.dialogListener);
    }

    visibleProgressDialog(isVisible) {
        this.setState({ showProgressDialog: isVisible });
    }

    renderProgressDialog() {
        if (this.state.showProgressDialog) {
            return (
                <Modal visible={true}>
                    <ActivityIndicator size="large" />
                </Modal>
            );
        }
        return null;
    }

    renderModal() {
        if (this.state.showOrderPopup.isShow) {
            return (
                <OrderPopup
                    isVisible={true}
                    openFromCart={this.state.showOrderPopup.openFromCart}
                    indexInCart={this.state.showOrderPopup.indexInCart}
                    item={this.state.showOrderPopup.item} />
            );
        }
        return null;
    }

    render() {
        return (
            <View style={styles.mainLayout}>
                <AppNavigation
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                    visibleProgressDialog={this.visibleProgressDialog}
                    onNavigationStateChange={handleNavigationStateChange}
                />
                {this.renderModal()}
                {this.renderProgressDialog()}
            </View>
        );
    }
}

handleNavigationStateChange = (prevState, currentState, action) => {
    const currentRouteName = getActiveRouteName(currentState);
    let eventMessage = AppEvent.changeScreen;
    let screenType = ScreenTypeEnum.UnknownScreen;

    if (currentRouteName == 'Home') {
        screenType = ScreenTypeEnum.NewScreen;
    }
    else if (currentRouteName == 'Order') {
        screenType = ScreenTypeEnum.OrderScreen;
    }
    else if (currentRouteName == 'Store') {
        screenType = ScreenTypeEnum.StoreScreen;
    }
    else if (currentRouteName == 'Account') {
        screenType = ScreenTypeEnum.AccountScreen;
    }

    else {
        screenType = MapScreenType.get(currentRouteName);
    }

    EventRegister.emit(eventMessage, screenType);
}

function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];

    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
    },
});