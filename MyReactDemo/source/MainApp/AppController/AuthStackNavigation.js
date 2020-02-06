import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../../ScreenAuth/LoginScreen'
import SignUpScreen from "../../ScreenAuth/SignUpScreen";
// import ForgotPassword from "../../ScreenAuth/ForgotPassword";

const AuthStack = createStackNavigator(
  {
    LoginScreen,
    SignUpScreen,
    // ForgotPassword
  },
  {
    headerMode: "none",
    initialRouteName: 'LoginScreen',
  }
);

export default createAppContainer(AuthStack);