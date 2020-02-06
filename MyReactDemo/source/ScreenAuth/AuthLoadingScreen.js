import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet
} from 'react-native';
import AuthManager from './AuthManager';
import ScreenManager from '../MainApp/AppController/ScreenManager';
import { MainColor } from '../MainUtils/AppUtils';
import FastImage from 'react-native-fast-image';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.screenManager = ScreenManager.getInstance();
        this.authManager = AuthManager.getInstance();
    }

    componentDidMount() {
        setTimeout(this.navigateToApp, 3000);
    }

    navigateToApp = async () => {
        let user_info = await this.authManager.retrieveUserInfo();
        if (user_info) {
            this.screenManager.openAppMainScreen();
        } else {
            this.screenManager.openAuthScreen();
        }
    }

    render() {
        return (
            <FastImage
                style={styles.mainLayout}
                source={require('../../assets/image/splash-background.jpg')}>

                <ActivityIndicator size = "large" />
                <StatusBar barStyle="default" />
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MainColor.whiteSmoke
    }
});