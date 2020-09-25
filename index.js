/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
    'Non-serializable values were found in the navigation state',
]);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
