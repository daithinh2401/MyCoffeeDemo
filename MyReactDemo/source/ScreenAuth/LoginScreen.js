import React from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import Button from "react-native-button";
import AuthManager from './AuthManager';
import ScreenManager from '../MainApp/AppController/ScreenManager';
import { AppStyles } from "./AppStyles";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Screen } from '../MainUtils/AppUtils';

import SocialIcon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
        this.screenManager = ScreenManager.getInstance();
        this.authManager = AuthManager.getInstance();
    }

    handleLogin() {
        let { email, password } = this.state;
        if (!email || !password) {
            this.screenManager.showAlertDialog(
                'Đăng nhập thất bại',
                'Vui lòng nhập đầy đủ thông tin',
                [
                    {
                        text: 'OK',
                        style: 'cancel',
                    },
                ]
            );
            return;
        }

        this.authManager.doLogin(email, password);
    }

    handleLoginFacebook() {
        this.authManager.doLoginFacebook();
    }

    handleLoginGoogle() {
        this.authManager.doLoginGoogle();
    }

    handleSignUp() {
        ScreenManager.getInstance().openScreen(Screen.SignUpScreen);
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <FastImage
                    style={{ width: 200, height: 200 }}
                    source={require('../../assets/image/login-logo.png')}
                />
                <View style={styles.InputContainer}>
                    <TextInput
                        style={styles.body}
                        placeholder="Tên đăng nhập / Email"
                        onChangeText={text => this.setState({ email: text })}
                        value={this.state.email}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput
                        style={styles.body}
                        secureTextEntry={true}
                        autoCorrect={false}
                        placeholder="Mật khẩu"
                        onChangeText={text => this.setState({ password: text })}
                        value={this.state.password}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Button
                    containerStyle={styles.loginContainer}
                    style={styles.loginText}
                    onPress={() => this.handleLogin()}
                >
                    Đăng nhập
                </Button>
                <Text style={styles.or}>Hoặc</Text>
                <TouchableOpacity
                    style={styles.facebookContainer}
                    onPress={() => this.handleLoginFacebook()}>
                    <SocialIcon
                        color="white"
                        style={styles.fbIcon}
                        name="facebook-official"
                        size={23} />
                    <View style={styles.socialTextContainer}>
                        <Text style={styles.socialText}>
                            Login with Facebook
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.googleContainer}
                    onPress={() => this.handleLoginGoogle()}>
                    <SocialIcon
                        color="white"
                        style={styles.fbIcon}
                        name="google"
                        size={23} />
                    <View style={styles.socialTextContainer}>
                        <Text style={styles.socialText}>
                            Login with Google
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        onPress={() => this.handleSignUp()}
                        activeOpacity={0.9}>
                        <Text style={styles.signUpText}>Chưa có tài khoản? Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    },
    or: {
        fontFamily: AppStyles.fontName.main,
        fontSize: AppStyles.fontSize.normal,
        fontWeight: 'bold',
        color: "black",
        marginTop: 40,
        marginBottom: 10
    },
    loginContainer: {
        width: AppStyles.textInputWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    loginText: {
        color: AppStyles.color.white,
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text
    },
    facebookContainer: {
        flexDirection: 'row',
        width: AppStyles.textInputWidth.main,
        backgroundColor: AppStyles.color.facebook,
        borderRadius: AppStyles.borderRadius.smaller,
        padding: 10, margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialTextContainer: {
        flex: 1,
        alignItems: 'center', justifyContent: 'center',
    },
    socialText: {
        color: AppStyles.color.white,
        fontSize: 16, fontWeight: 'bold'
    },
    googleContainer: {
        flexDirection: 'row',
        width: AppStyles.textInputWidth.main,
        backgroundColor: '#FF0000',
        borderRadius: AppStyles.borderRadius.smaller,
        padding: 10, marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fbIcon: {
        position: 'absolute',
        left: 10,
    },
    bottomView: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signUpText: {
        fontFamily: AppStyles.fontName.main,
        fontSize: AppStyles.fontSize.normal,
        fontWeight: 'bold',
        color: AppStyles.color.facebook,
    }
});