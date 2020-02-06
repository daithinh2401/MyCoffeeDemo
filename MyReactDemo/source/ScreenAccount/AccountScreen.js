import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import MainAccountItem from './AccountItem'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainColor } from '../MainUtils/AppUtils';
import AuthManager from '../ScreenAuth/AuthManager';

export default class AccountScreen extends React.Component {
    handleLogout() {
        AuthManager.getInstance().doLogout();
    }

    render() {
        return (
            <View style={styles.mainLayout}>
                <MainAccountItem />

                <View style={[{flex: 1}, styles.logoutButton]}>
                    <TouchableOpacity
                        style = {styles.logoutButton}
                        activeOpacity={0.8}
                        onPress={() => this.handleLogout()}>
                        <Icon name="logout" size={30} />
                        <Text style={styles.logoutButtonTitleStyle}> Đăng xuất </Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({

    mainLayout: {
        flex: 1,
        backgroundColor: MainColor.whiteSmoke
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutButtonTitleStyle: {
        fontSize: 15,
        marginLeft: 5
    }
});