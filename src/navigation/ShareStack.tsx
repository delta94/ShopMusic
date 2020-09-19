import { NativeStackNavigationOptions } from 'react-native-screens/native-stack';
import { Colors } from 'styles/global.style';

export const screenOptionsNative: Partial<NativeStackNavigationOptions> = {
    contentStyle: { backgroundColor: '#FFFFFF' },
    stackAnimation: 'default',
    headerTintColor: '#FFFFFF',
    headerStyle: { backgroundColor: Colors.primary },
    headerTitleStyle: { fontFamily: 'Poppins' },
    headerBackTitleStyle: { fontFamily: 'Poppins' },
};
