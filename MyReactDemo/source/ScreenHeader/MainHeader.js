import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconMore from 'react-native-vector-icons/FontAwesome5';
import IconSeed from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScreenTypeEnum, MainColor, AppEvent } from '../MainUtils/AppUtils'

import { EventRegister } from 'react-native-event-listeners'
import ScreenManager from '../MainApp/AppController/ScreenManager';
import AuthManager from '../ScreenAuth/AuthManager';

import FastImage from 'react-native-fast-image'

export default class MainHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            screenType: ScreenTypeEnum.NewScreen,
        }

        this.authManager = AuthManager.getInstance();
    }

    doRender() {
        switch (this.state.screenType) {
            case ScreenTypeEnum.NewScreen:
                return (this.doRenderNewScreenHeader());

            case ScreenTypeEnum.OrderScreen:
                return (this.doRenderOderScreenHeader());

            case ScreenTypeEnum.StoreScreen:
                return (this.doRenderStoreScreenHeader());

            case ScreenTypeEnum.AccountScreen:
                return (this.doRenderAccountScreenHeader());
        }
    }

    doRenderNewScreenHeader() {
        let userInfo = this.authManager.getUserInfo();
        let { displayName, photoURL } = userInfo;
        return (
            <View style={styles.mainLayout}>
                <FastImage
                    style={styles.image}
                    source={photoURL ? { uri: photoURL } : require('../../assets/image/avatar-placeholder.png')}>
                </FastImage>
                <View style={styles.textLayout}>
                    <Text style={styles.bigText}>{displayName ? displayName : 'Unknown'} </Text>
                    <Text style={styles.smallText}>
                        Thành viên thường
                        <Text style={{ fontSize: 17 }}>  |  </Text>
                        <Text>0 </Text>
                        <IconSeed style={styles.rightIcon} name="seed" size={17} />
                    </Text>
                </View>

                <View style={styles.rightLayout}>
                    <Icon style={styles.rightIcon} name="bell" size={23} />
                </View>
            </View>
        )
    }

    doRenderOderScreenHeader() {
        return (
            <View style={styles.mainLayout}>
                <View style={styles.leftIconLayout}>
                    <IconMore color={MainColor.activeColor} name="shipping-fast" size={20} />
                </View>

                <View style={styles.textLayout}>
                    <View style={styles.textLayout}>
                        <Text style={styles.smallText}> Giao hàng đến </Text>
                        <Text style={styles.bigText}> Tân Bình </Text>
                    </View>
                </View>

                <View style={styles.rightLayoutText}>
                    <Text style={styles.rightText}> THAY ĐỔI </Text>
                </View>
            </View>
        )
    }

    doRenderStoreScreenHeader() {
        return (
            <View style={styles.mainStoreLayout}>
                <Text style={styles.middleText}> Store </Text>
            </View>
        )
    }

    doRenderAccountScreenHeader() {
        let userInfo = this.authManager.getUserInfo();
        let { displayName, photoURL } = userInfo;

        return (
            <View style={styles.mainLayout}>
                <FastImage
                    style={styles.accountScreenImage}
                    source={photoURL ? { uri: photoURL } : require('../../assets/image/avatar-placeholder.png')}>
                </FastImage>
                <View style={styles.textLayout}>
                    <Text style={styles.accountScreenBigText}>{displayName ? displayName : 'Unknown'} </Text>
                    <Text style={styles.accountScreenSmallText}>Thành viên thường</Text>
                </View>

                <View style={styles.accountScreenRightLayout}>
                    <Text style={styles.accountScreenBigText}> 0 </Text>
                    <IconSeed style={styles.rightIcon} name="seed" size={24} />
                </View>
            </View>
        )
    }

    doUpdateScreen(type) {
        this.setState({ screenType: type })
    }

    componentDidMount() {
        this.updateHeaderListener = EventRegister.addEventListener(AppEvent.updateHeader, (screenType) => {
            if (ScreenManager.getInstance() != null) {
                type = ScreenManager.getInstance().getScreenType();
            } else {
                type = screenType;
            }

            this.doUpdateScreen(type);
        })
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.updateHeaderListener)
    }

    render() {
        return (
            <SafeAreaView backgroundColor="white">
                {this.doRender()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    borderBottom: {
        borderBottomWidth: 0.25,
        borderColor: 'gray'
    },
    image: {
        marginLeft: 10,
        marginRight: 5,
        width: 40,
        height: 40,
        borderRadius: Platform.OS === 'android' ? 100 : 30,
    },
    leftIconLayout: {
        marginLeft: 10,
        width: Platform.OS === 'android' ? 47 : 42,
        height: Platform.OS === 'android' ? 47 : 42,
        justifyContent: 'center'
    },
    textLayout: {
        flexDirection: 'column',
    },
    bigText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    smallText: {
        fontSize: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightLayout: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 10,
    },
    rightLayoutText: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 10,
        alignSelf: 'flex-end',
    },
    rightIcon: {
        color: MainColor.activeColor
    },
    rightText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: MainColor.activeColor
    },
    mainStoreLayout: {
        height: Platform.OS === 'android' ? 57 : 52,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        marginBottom: 10
    },
    middleText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    accountScreenImage: {
        margin: 10,
        width: 50,
        height: 50,
        borderRadius: Platform.OS === 'android' ? 100 : 30,
    },
    accountScreenBigText: {
        fontSize: 20,
    },
    accountScreenSmallText: {
        fontSize: 15,
    },
    accountScreenRightLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
});