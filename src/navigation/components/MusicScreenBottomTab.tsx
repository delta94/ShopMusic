import React, { Fragment, memo, useCallback } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useSelector } from 'react-redux';
import { Track } from 'react-native-track-player';
import { Icon } from 'react-native-elements';

import { screenOptionsNative } from 'navigation/ShareStack';
import MusicScreen from 'modules/music/components';
import ListScreen from 'modules/list/components';
import MusicComponent from 'modules/music/components/MusicComponent';
import { RootState } from 'store';
import ProfileScreen from 'modules/profile/screens/ProfileScreen';
import EditProfileScreen from 'modules/profile/screens/EditProfileScreen';
import { Colors } from 'styles/global.style';
import NavigationService from 'navigation/NavigationService';
import { Platform } from 'react-native';

enableScreens();
const Stack = createNativeStackNavigator();

const MusicScreenBottomTab = () => {
    const track = useSelector<RootState, Track>(state => state.home.track);

    const goToChat = useCallback(() => {
        NavigationService.navigate('ChatScreen');
    }, []);

    return (
        <Fragment>
            <Stack.Navigator
                screenOptions={{
                    ...screenOptionsNative,
                    headerRight: ({ tintColor }) => (
                        <Icon type="ant-design" onPress={goToChat} name="wechat" size={30} color={tintColor} />
                    ),
                }}
                initialRouteName="MusicScreen">
                <Stack.Screen
                    options={{
                        title: 'Settings',
                        headerLargeTitle: true,
                        headerLargeTitleHideShadow: true,
                        headerTintColor: Platform.OS === 'android' ? Colors.white : '#000000',
                    }}
                    name="MusicScreen"
                    component={MusicScreen}
                />
                <Stack.Screen options={{ headerShown: false }} name="ListScreen" component={ListScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />

                <Stack.Screen
                    options={{
                        title: 'Edit Profile',
                        headerStyle: { backgroundColor: Colors.white },
                        headerTintColor: Colors.subtle,
                        stackPresentation: 'modal',
                    }}
                    name="EditProfileScreen"
                    component={EditProfileScreen}
                />
            </Stack.Navigator>

            {Object.keys(track).length > 0 && <MusicComponent />}
        </Fragment>
    );
};

export default memo(MusicScreenBottomTab);
