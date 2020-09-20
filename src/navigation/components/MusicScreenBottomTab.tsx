import React, { Fragment, memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useSelector } from 'react-redux';
import { Track } from 'react-native-track-player';

import { screenOptionsNative } from 'navigation/ShareStack';
import MusicScreen from 'modules/music/components';
import ListScreen from 'modules/list/components';
import MusicComponent from 'modules/music/components/MusicComponent';
import { RootState } from 'store';
import ProfileScreen from 'modules/profile/screens/ProfileScreen';
import EditProfileScreen from 'modules/profile/screens/EditProfileScreen';
import { Colors } from 'styles/global.style';

enableScreens();
const Stack = createNativeStackNavigator();

const MusicScreenBottomTab = () => {
    const track = useSelector<RootState, Track>(state => state.home.track);

    return (
        <Fragment>
            <Stack.Navigator screenOptions={{ ...screenOptionsNative }} initialRouteName="MusicScreen">
                <Stack.Screen
                    options={{ title: 'Settings', headerLargeTitle: true, headerLargeTitleHideShadow: true }}
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
