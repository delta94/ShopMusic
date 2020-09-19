import React, { memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { Colors } from 'styles/global.style';
import HomeScreenBottomTab from './components/HomeScreenBottomTab';

enableScreens();
const Stack = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Stack.Navigator
            tabBarOptions={{
                activeTintColor: Colors.primary,
                inactiveTintColor: '#888888',
                labelStyle: {
                    fontSize: Dimensions.get('window').width < 375 ? 11 : 12,
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                },

                // style: { borderTopColor: Colors.primary, borderTopWidth: 0.3 },
            }}
            screenOptions={{ tabBarButton: props => <TouchableOpacity {...props} /> }}
            initialRouteName="HomeScreen">
            <Stack.Screen
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon type="ant-design" size={25} color={focused ? Colors.primary : color} name="playcircleo" />
                    ),
                    title: 'Play',
                }}
                name="HomeScreen"
                component={HomeScreenBottomTab}
            />
        </Stack.Navigator>
    );
};

export default memo(BottomTab);
