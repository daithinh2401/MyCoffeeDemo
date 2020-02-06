import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenManager from '../MainApp/AppController/ScreenManager';
import { Screen } from '../MainUtils/AppUtils';

class AccountItem extends Component {

    constructor(props) {
        super(props);
    }

    handleOpenRewardScreen() {
        ScreenManager.getInstance().openScreen(Screen.UserRankScreen);
    }

    handleItemPress(title) {
        switch(title) {
            case "The Coffee House Rewards":
                this.handleOpenRewardScreen();
                break;
        }
    }

    render() {
        return (
            <TouchableOpacity 
                onPress = {() => this.handleItemPress(this.props.title)}
                activeOpacity={0.8}>
                <View style={styles.itemLayout}>
                    <Icon style={styles.icon} name={this.props.iconName} size={24} />
                    <Text style={styles.title}> {this.props.title} </Text>
                </View>
            </TouchableOpacity >
        )
    }
}

export default class MainAccountItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.mainLayout}>
                {
                    accountScreenListItem.map((item, index) => {
                        return <AccountItem key = {index} iconName = {item.iconName} title = {item.title} />
                    })
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        marginTop: 10,
        paddingBottom: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    itemLayout: {
        flexDirection: 'row',
        padding: 14
    },
    icon: {
        alignSelf: 'center',
    },
    title: {
        marginLeft: 10,
        fontSize: 15,
        alignSelf: 'center',
    }

});

const accountScreenListItem = [
    {
        iconName: "stars",
        title: "The Coffee House Rewards"
    },
    {
        iconName: "person-outline",
        title: "Thông tin tài khoản"
    },
    {
        iconName: "queue-music",
        title: "Nhạc đang phát"
    },
    {
        iconName: "history",
        title: "Lịch sử"
    },
    {
        iconName: "payment",
        title: "Thanh toán"
    },
    {
        iconName: "help",
        title: "Giúp đỡ"
    },
    {
        iconName: "settings",
        title: "Cài đặt"
    }
]