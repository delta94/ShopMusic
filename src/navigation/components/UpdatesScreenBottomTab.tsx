import React, { memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { screenOptionsNative, useShareStack } from 'navigation/ShareStack';
import UpdatesScreen from 'modules/updates/components';

enableScreens();
const Stack = createNativeStackNavigator();

const UpdatesScreenBottomTab = () => {
    const { STACK_SHARE } = useShareStack();

    return (
        <Stack.Navigator
            screenOptions={{ ...screenOptionsNative, headerLeft: undefined }}
            initialRouteName="CartScreen">
            <Stack.Screen options={{ title: 'Updates' }} name="UpdatesScreen" component={UpdatesScreen} />
            {STACK_SHARE}
        </Stack.Navigator>
    );
};

export default memo(UpdatesScreenBottomTab);
