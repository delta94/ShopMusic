import React, { memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import HomeScreen from 'modules/home/components';
import { screenOptionsNative } from 'navigation/ShareStack';

enableScreens();
const Stack = createNativeStackNavigator();

const HomeScreenBottomTab = () => {
    return (
        <Stack.Navigator
            headerMode="float"
            screenOptions={{ ...screenOptionsNative, stackAnimation: 'fade' }}
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default memo(HomeScreenBottomTab);
