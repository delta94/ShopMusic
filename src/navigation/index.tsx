import React, { memo, useCallback, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';

import { screenOptionsNative } from './ShareStack';
import { useQuickActions } from './hooks/useQuickActions';

import BottomTab from './BottomTab';
import NavigationService from './NavigationService';

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
    useQuickActions();
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
        }

        routeNameRef.current = currentRouteName;
    }, []);

    return (
        <NavigationContainer ref={ref} onStateChange={onStateChange}>
            <Stack.Navigator screenOptions={screenOptionsNative} initialRouteName="LoginScreen">
                <Stack.Screen options={{ headerShown: false }} name="BottomTab" component={BottomTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default memo(NavigationApp);
