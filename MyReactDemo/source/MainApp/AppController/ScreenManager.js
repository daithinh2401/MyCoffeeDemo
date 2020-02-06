import { EventRegister } from 'react-native-event-listeners'
import { ScreenTypeEnum, AppEvent, Screen } from '../../MainUtils/AppUtils'

import { Alert } from 'react-native';

import NavigationService from '../../MainUtils/NavigationService';

export default class ScreenManager {

    static myInstance = null;
    mScreenType = ScreenTypeEnum.UnknownScreen;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new ScreenManager();
        }
        return this.myInstance;
    }

    getScreenType() {
        return this.mScreenType;
    }

    setScreenType(screenType) {
        this.mScreenType = screenType;
    }

    registerObserver() {
        this.updateScreenListener = EventRegister.addEventListener(AppEvent.changeScreen, (screenType) => {
            this.doUpdateScreen(screenType);
        })
    }

    removeObserver() {
        EventRegister.removeEventListener(this.updateScreenListener);
    }

    openAuthScreen() {
        this.openScreen(Screen.AuthStackNavigation);
    }

    openAppMainScreen() {
        this.openScreen(Screen.AppStackNavigation);
    }

    openScreen(screen /* Screen in AppUtils */, params /* object */) {
        NavigationService.navigate(screen.name, params);
        this.doUpdateScreen(screen.type)
    }

    goBack() {
        NavigationService.goBack();
    }

    doUpdateScreen(screenType) {
        if(this.mScreenType != screenType) {
            this.setScreenType(screenType);
            this.notifyUpdateMainHeader(screenType);
        }
    }

    notifyUpdateMainHeader(screenType) {
        switch (screenType) {
            case ScreenTypeEnum.NewScreen:
            case ScreenTypeEnum.OrderScreen:
            case ScreenTypeEnum.StoreScreen:
            case ScreenTypeEnum.AccountScreen:
                EventRegister.emit(AppEvent.updateHeader, screenType);
                break;
        }
    }

    showProgressDialog(visible) {
        EventRegister.emit(AppEvent.showProgressDialog, visible);
    }

    showAlertDialog(title, message, handleArray) {
        Alert.alert(
            title,
            message,
            handleArray,
            { cancelable: false },
        );
    }
}