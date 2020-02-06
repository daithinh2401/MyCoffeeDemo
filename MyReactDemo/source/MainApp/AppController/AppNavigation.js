import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppStackNavigation from './AppStackNavigation'
import AuthStackNavigation from './AuthStackNavigation'
import AuthLoadingScreen from '../../ScreenAuth/AuthLoadingScreen'


const AppNavigation = createSwitchNavigator(
    {
        AuthLoadingScreen,
        AppStackNavigation,
        AuthStackNavigation,
    },
    {
        initialRouteName: 'AuthLoadingScreen',
    },
);

export default createAppContainer(AppNavigation);