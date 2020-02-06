import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import NewScreen from '../../ScreenNews/NewScreen';
import OrderScreen from '../../ScreenOrder/OrderScreen';
import StoreScreen from '../../ScreenStore/StoreScreen';
import AccountScreen from '../../ScreenAccount/AccountScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import IconOther from 'react-native-vector-icons/Fontisto';
import { MainColor } from '../../MainUtils/AppUtils';

export default createBottomTabNavigator({
    Home: NewScreen,
    Order: OrderScreen,
    Store: StoreScreen,
    Account: AccountScreen
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Home') {
                iconName = 'new-box';
            }
            else if (routeName === 'Order') {
                iconName = 'coffeescript';
                return <IconOther name={iconName} size={21} color={tintColor} />;
            }
            else if (routeName === 'Store') {
                iconName = 'store';
            }
            else if (routeName === 'Account') {
                iconName = 'account-circle';
            }

            return <Icon name={iconName} size={27} color={tintColor} />;
        },
    }),
    tabBarOptions: {
        activeTintColor: MainColor.activeColor,
        inactiveTintColor: MainColor.gray,
        labelStyle: {
            fontSize: 12,
        },
        style: {
            height: 60,
            paddingTop: 10,
        },
    },
    initialRouteName: 'Home'
});