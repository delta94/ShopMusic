/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
    'Non-serializable values were found in the navigation state',
]);

AppRegistry.registerComponent(appName, () => App);
