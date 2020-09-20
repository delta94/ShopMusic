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
            </Stack.Navigator>

            {Object.keys(track).length > 0 && <MusicComponent />}
        </Fragment>
    );
};

export default memo(MusicScreenBottomTab);
