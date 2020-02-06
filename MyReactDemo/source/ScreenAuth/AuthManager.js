import { AppEvent, Screen, ScreenTypeEnum } from '../MainUtils/AppUtils';
import { EventRegister } from 'react-native-event-listeners';

import AsyncStorage from '@react-native-community/async-storage';
import ScreenManager from '../MainApp/AppController/ScreenManager';

import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin'
import firebase from "react-native-firebase";

export default class AuthManager {

    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance = new AuthManager();
        }
        return this.myInstance;
    }

    m_user_info = {};

    getUserInfo() {
        return this.m_user_info;
    }
    cacheUserInfo(user_info) {
        this.m_user_info = user_info;
    }

    doUpdateUserInfo(user) {
        this.storeUserInfo(user);
        this.cacheUserInfo(user);
    }

    initializeAuthManager() {
        this.fetchUserFromStorage();
        this.registerFirebaseAuthListener();
    }

    async fetchUserFromStorage() {
        this.m_user_info = await this.retrieveUserInfo();
    }

    registerFirebaseAuthListener() {
        this.authSubscription = firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged(): " + JSON.stringify(user));

            this.doUpdateUserInfo(user);
            if(user === null) {
                setTimeout(this.showLogoutPopup, 3000);
            }
        });
    }

    removeFirebaseAuthListener() {
        this.authSubscription();
    }

    goBack() {
        ScreenManager.getInstance().goBack();
    }

    doLogin(email, password) {
        ScreenManager.getInstance().showProgressDialog(true);

        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                ScreenManager.getInstance().showProgressDialog(false);
                if (response.user) {
                    setTimeout(() => { ScreenManager.getInstance().openAppMainScreen() }, 100);
                }
            })
            .catch(error => {
                ScreenManager.getInstance().showProgressDialog(false);
                setTimeout(() => { this.showErrorPopup(error) }, 100);
            })
    }

    async doLoginFacebook() {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) return;

            // get the access token
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                console.log('Something went wrong obtaining the users access token');
                return;
            }

            ScreenManager.getInstance().showProgressDialog(true);

            // create a new firebase credential with the token
            const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

            // login with credential
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
            if (firebaseUserCredential.user) {
                setTimeout(() => { ScreenManager.getInstance().openAppMainScreen() }, 100);
            }
            ScreenManager.getInstance().showProgressDialog(false);

        } catch (e) {
            this.showErrorPopup(e);
            console.log(e);
        }
    }

    doLoginGoogle() {
        // add any configuration settings here:
        GoogleSignin.configure();

        GoogleSignin.signIn()
        .then(async (data) => {
            ScreenManager.getInstance().showProgressDialog(true);

            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);

            // login with credential
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
            if (firebaseUserCredential.user) {
                setTimeout(() => { ScreenManager.getInstance().openAppMainScreen() }, 100);
            }
            ScreenManager.getInstance().showProgressDialog(false);
        })
        .catch(error => {
            console.log(error);
        });
    }

    doSignUp(email, password, displayName, imageUrl) {
        ScreenManager.getInstance().showProgressDialog(true);

        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                this.updateUserProfile(displayName, imageUrl);
            })
            .catch(error => {
                ScreenManager.getInstance().showProgressDialog(false);
                setTimeout(() => { this.showErrorPopup(error) }, 100);
            })
    }

    doLogout() {
        this.removeUserInfo();

        firebase.auth().signOut();
        ScreenManager.getInstance().openAuthScreen();
    }

    cancleSignUp() {
        this.doLogout();
        this.goBack();
    }

    updateUserProfile = async (displayName, imageUrl) => {
        try {
            if (imageUrl) {
                const imageRef = firebase.storage().ref().child('avatars/' + this.m_user_info.uid + '.jpeg');
                imageRef.put(imageUrl, { contentType: 'image/jpeg', })
                        .then(image => {
                            firebase.auth().currentUser.updateProfile({ 
                                        displayName,
                                        photoURL: image.downloadURL 
                                    })
                                    .then(() => {
                                        this.doUpdateUserInfo(firebase.auth().currentUser);
                                        ScreenManager.getInstance().showProgressDialog(false);
                                        setTimeout(() => { this.alertSignUpSuccess() }, 100);
                                    })
                        })
                        .catch(error => {}); 
            } else {
                firebase.auth().currentUser.updateProfile({ displayName })
                .then(() => {
                    this.doUpdateUserInfo(firebase.auth().currentUser);
                    ScreenManager.getInstance().showProgressDialog(false);
                    setTimeout(() => { this.alertSignUpSuccess() }, 100);
                })
            }
        } 
        catch(error) {
            console.log(error);
        }
    };

    storeUserInfo = async (user_info) => {
        try {
            await AsyncStorage.setItem('user_info', JSON.stringify(user_info));
            return true;
        } catch (error) { }

        return false;
    };

    removeUserInfo = async () => {
        try {
            await AsyncStorage.removeItem('user_info');
        } catch (error) { }
    }

    retrieveUserInfo = async () => {
        try {
            let tokenString = await AsyncStorage.getItem('user_info');
            let tokenObject = JSON.parse(tokenString);
            if (tokenObject != null) {
                return tokenObject;
            }
        } catch (error) { }

        return null;
    };

    alertSignUpSuccess() {
        ScreenManager.getInstance().showAlertDialog(
            'Đăng ký thành công',
            'Chuyển thẳng vào ứng dụng',
            [
                {
                    text: 'Hủy bỏ',
                    onPress: () => this.cancleSignUp(),
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => ScreenManager.getInstance().openAppMainScreen()
                },
            ]
        );
    }

    showLogoutPopup = () => {
        let screenType = ScreenManager.getInstance().getScreenType();
        if( screenType != ScreenTypeEnum.LoginScreen &&
            screenType != ScreenTypeEnum.SignUpScreen && 
            screenType != ScreenTypeEnum.AuthStackNavigation) {
            ScreenManager.getInstance().showAlertDialog(
                'Hết phiên đăng nhập',
                'Phiên đăng nhập của bạn đã kết thúc, vui lòng đăng nhập để tiếp tục.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            ScreenManager.getInstance().openAuthScreen();
                        }
                    },
                ]
            );
        }
    }

    showErrorPopup(error) {
        ScreenManager.getInstance().showAlertDialog(
            error.code,
            error.message,
            [
                {
                    text: 'OK',
                    style: 'cancel',
                },
            ]
        );
    }
} 