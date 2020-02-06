/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler'
import App from './App';
import {name as appName} from './app.json';
import AppController from './source/MainApp/AppController/AppController'

AppRegistry.registerComponent(appName, () => AppController);
