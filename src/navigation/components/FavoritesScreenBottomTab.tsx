import React, { memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { screenOptionsNative, useShareStack } from 'navigation/ShareStack';
import FavoritesScreen from 'modules/favorites/components';

enableScreens();
const Stack = createNativeStackNavigator();

const FavoritesScreenBottomTab = () => {
    const { STACK_SHARE } = useShareStack();

    return (
        <Stack.Navigator
            screenOptions={{ ...screenOptionsNative, headerLeft: undefined }}
            initialRouteName="CartScreen">
            <Stack.Screen options={{ title: 'Favorites' }} name="FavoritesScreen" component={FavoritesScreen} />
            {STACK_SHARE}
        </Stack.Navigator>
    );
};

export default memo(FavoritesScreenBottomTab);
