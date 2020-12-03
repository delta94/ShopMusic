import React, { Fragment, memo, useCallback } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useSelector } from 'react-redux';
import { Track } from 'react-native-track-player';
import { Icon } from 'react-native-elements';
import { Platform } from 'react-native';

import { screenOptionsNative } from 'navigation/ShareStack';
import MusicScreen from 'modules/music/components';
import ListScreen from 'modules/list/components';
import MusicComponent from 'modules/music/components/MusicComponent';
import { RootState } from 'store';
import { Colors } from 'styles/global.style';
import NavigationService from 'navigation/NavigationService';

enableScreens();
const Stack = createNativeStackNavigator();

const MusicScreenBottomTab = () => {
    const track = useSelector<RootState, Track>(state => state.home.track);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const goToChat = useCallback(() => {
        NavigationService.navigate('ChatScreen');
    }, []);

    return (
        <Fragment>
            <Stack.Navigator
                screenOptions={{
                    ...screenOptionsNative,
                    ...(isLogin && {
                        headerRight: ({ tintColor }) => (
                            <Icon type="ant-design" onPress={goToChat} name="wechat" size={30} color={tintColor} />
                        ),
                    }),
                }}
                initialRouteName="MusicScreen">
                <Stack.Screen
                    options={{
                        title: 'Settings',
                        headerLargeTitle: true,
                        headerLargeTitleHideShadow: true,
                        headerTintColor: Platform.OS === 'android' ? Colors.white : '#000000',
                        headerLargeStyle: { backgroundColor: Colors.white },
                        headerShown: false,
                    }}
                    name="MusicScreen"
                    component={MusicScreen}
                />
                <Stack.Screen options={{ headerShown: false }} name="ListScreen" component={ListScreen} />
            </Stack.Navigator>

            {Object.keys(track).length > 0 && <MusicComponent />}
        </Fragment>
    );
};

export default memo(MusicScreenBottomTab);
