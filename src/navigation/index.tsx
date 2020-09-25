import React, { memo, useCallback, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import analytic from '@react-native-firebase/analytics';

import { screenOptionsNative } from './ShareStack';

import BottomTab from './BottomTab';
import NavigationService from './NavigationService';
import LoginScreen from 'modules/auth/screens/LoginScreen';
import RegisterScreen from 'modules/auth/screens/RegisterScreen';
import ChatScreen from 'modules/chat/components';
import { useMessaging } from 'hooks/useMessaging';

enableScreens();
const Stack = createNativeStackNavigator();

const getActiveRouteName = (state: any): string => {
    const route = state.routes[state.index];

    if (route.state) {
        // Dive into nested navigators
        return getActiveRouteName(route.state);
    }

    return route.name;
};

const NavigationApp = () => {
    useMessaging();
    const navigationRef = useRef<NavigationContainerRef>();
    const routeNameRef = useRef<string>();

    const ref = useCallback(refNavigaiton => {
        navigationRef.current = refNavigaiton;
        NavigationService.setTopLevelNavigator(refNavigaiton);
    }, []);

    const onStateChange = useCallback((state: NavigationState | undefined) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);
        // const currentRouteNameConvert = currentRouteName.toLowerCase().replace('screen', '_screen');
        // const params = state.routes[state.index].params;

        if (previousRouteName !== currentRouteName) {
            analytic().logScreenView({ screen_name: currentRouteName });
        }

        routeNameRef.current = currentRouteName;
    }, []);

    return (
        <NavigationContainer ref={ref} onStateChange={onStateChange}>
            <Stack.Navigator screenOptions={screenOptionsNative} initialRouteName="BottomTab">
                <Stack.Screen options={{ headerShown: false }} name="BottomTab" component={BottomTab} />
                <Stack.Screen
                    options={{ title: 'Đăng nhập', headerHideShadow: true }}
                    name="LoginScreen"
                    component={LoginScreen}
                />
                <Stack.Screen
                    options={{ title: 'Đăng ký', headerHideShadow: true }}
                    name="RegisterScreen"
                    component={RegisterScreen}
                />
                <Stack.Screen
                    options={{ title: 'Chat với Admin', headerRight: undefined }}
                    name="ChatScreen"
                    component={ChatScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default memo(NavigationApp);
