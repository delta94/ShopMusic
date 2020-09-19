import React, { memo } from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { screenOptionsNative } from 'navigation/ShareStack';
import YouScreen from 'modules/you/components';
import ProfileScreen from 'modules/you/screens/ProfileScreen';
import EditProfileScreen from 'modules/you/screens/EditProfile';
import SearchAddressProfileScreen from 'modules/you/screens/SearchAddressProfile';
import EditYourBioScreen from 'modules/you/screens/EditYourBio';
import PurchasesScreen from 'modules/you/screens/Purchases';
import SettingsScreen from 'modules/you/screens/Settings';
import PushNotificationsScreen from 'modules/you/screens/PushNotifications';
import PrivacyScreen from 'modules/you/screens/Privacy';
import LanguageScreen from 'modules/you/screens/Language';
import AboutThisAppScreen from 'modules/you/screens/AboutThisApp';
import HelpScreen from 'modules/you/screens/Help';

enableScreens();
const Stack = createNativeStackNavigator();

const YouScreenBottomTab = () => {
    return (
        <Stack.Navigator screenOptions={{ ...screenOptionsNative, headerLeft: undefined }} initialRouteName="YouScreen">
            <Stack.Screen options={{ title: 'You' }} name="YouScreen" component={YouScreen} />
            <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }} component={ProfileScreen} />
            <Stack.Screen
                name="EditProfileScreen"
                options={{ title: 'Edit Profile', stackPresentation: 'modal', stackAnimation: 'default' }}
                component={EditProfileScreen}
            />
            <Stack.Screen
                name="SearchAddressProfileScreen"
                options={{
                    title: 'Edit Profile',
                    stackPresentation: 'modal',
                    stackAnimation: 'default',
                    headerShown: false,
                }}
                component={SearchAddressProfileScreen}
            />
            <Stack.Screen
                name="EditYourBioScreen"
                options={{ title: 'Edit Your Bio', stackPresentation: 'modal', stackAnimation: 'default' }}
                component={EditYourBioScreen}
            />
            <Stack.Screen name="PurchasesScreen" options={{ title: 'Purchases' }} component={PurchasesScreen} />
            <Stack.Screen name="SettingsScreen" options={{ title: 'Settings' }} component={SettingsScreen} />
            <Stack.Screen
                name="PushNotificationsScreen"
                options={{ title: 'Push notifications' }}
                component={PushNotificationsScreen}
            />
            <Stack.Screen name="PrivacyScreen" options={{ title: 'Privacy' }} component={PrivacyScreen} />
            <Stack.Screen name="LanguageScreen" options={{ title: 'Language' }} component={LanguageScreen} />
            <Stack.Screen
                name="AboutThisAppScreen"
                options={{ title: 'About this app' }}
                component={AboutThisAppScreen}
            />
            <Stack.Screen name="HelpScreen" options={{ title: 'Help' }} component={HelpScreen} />
        </Stack.Navigator>
    );
};

export default memo(YouScreenBottomTab);
