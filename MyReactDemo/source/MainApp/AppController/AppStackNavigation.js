import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import WebScreen from '../../SubScreen/WebScreen'
import MainHeader from '../../ScreenHeader/\bMainHeader';
import BottomNavigation from './BottomNavigation';
import OrderGridDetail from '../../ScreenOrder/OrderGridDetail'
import CartScreen from '../../ScreenCart/CartScreen'
import UserRankScreen from '../../UsersRank/UserRewardsScreen'
import StoreDetailScreen from '../../ScreenStore/StoreDetailScreen'

const AppStackNavigation = createStackNavigator(
    {
        MainDashboard: {
            screen: BottomNavigation,
            navigationOptions: {
                header: () => <MainHeader />,
            }
        },
        WebScreen,
        OrderGridDetail,
        CartScreen,
        UserRankScreen,
        StoreDetailScreen,
    },
    {
        initialRouteName: 'MainDashboard',
        headerMode: 'screen'
    },
);

export default createAppContainer(AppStackNavigation);