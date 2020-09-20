import { NativeStackNavigationOptions } from 'react-native-screens/native-stack';
import { Colors } from 'styles/global.style';

export const screenOptionsNative: Partial<NativeStackNavigationOptions> = {
    contentStyle: { backgroundColor: '#FFFFFF' },
    stackAnimation: 'default',
    headerTintColor: Colors.white,
    headerStyle: { backgroundColor: Colors.primary },
    headerTitleStyle: { fontFamily: 'Poppins-Bold' },
    headerBackTitleStyle: { fontFamily: 'Poppins' },
    headerLargeStyle: { backgroundColor: Colors.white },
    headerLargeTitleStyle: { color: Colors.subtle },
};
