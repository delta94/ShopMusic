import React, { memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createCollapsibleStackSub } from 'react-navigation-collapsible';

import { screenOptionsNative } from 'navigation/ShareStack';
import StaffScreen from 'modules/staff/components';

enableScreens();
const Stack = createNativeStackNavigator();

const StaffScreenBottomTab = () => {
    return (
        <Stack.Navigator screenOptions={{ ...screenOptionsNative }} initialRouteName="StaffScreen">
            {createCollapsibleStackSub(
                <Stack.Screen options={{ title: 'Nhân viên' }} name="StaffScreen" component={StaffScreen} />,
            )}
        </Stack.Navigator>
    );
};

export default memo(StaffScreenBottomTab);
