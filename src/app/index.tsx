import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, useColorScheme } from 'react-native';
import { ThemeProvider, colors, Theme } from 'react-native-elements';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import { useNetInfo } from '@react-native-community/netinfo';

import store, { persistor } from 'store';
import NavigationApp from 'navigation';
import { setCustomFlatList } from 'utils/customs/setCustomFlatList';
import { setCustomSectionList } from 'utils/customs/setCustomSectionList';
import { setCustomScrollView } from 'utils/customs/setCustomScrollView';
import { actions as actionsAuth } from 'modules/auth/store';
import NotInternet from './NotInternet';
import { actions as actionsList } from 'modules/list/store';

const theme: Theme = {
    colors: {
        ...Platform.select({
            default: colors.platform.android,
            ios: colors.platform.ios,
        }),
    },
};

setCustomFlatList({
    keyExtractor: (item: any, index: number) => (item.id ? item.id.toString() : index.toString()),
    showsHorizontalScrollIndicator: false,
});
setCustomSectionList({
    keyExtractor: (item: any, index: number) => (item.id ? item.id.toString() : index.toString()),
    stickySectionHeadersEnabled: true,
    showsHorizontalScrollIndicator: false,
});
setCustomScrollView({ showsHorizontalScrollIndicator: false });
setCustomText({ style: { fontFamily: 'Poppins' } });
setCustomTextInput({ style: { fontFamily: 'Poppins' } });

const AppSource = () => {
    const colorScheme = useColorScheme();
    const { isConnected } = useNetInfo();

    const onBeforeLift = useCallback(() => {
        store.dispatch(actionsAuth.checkLoginAccount());
        store.dispatch(actionsList.fetchSongsDemo(0));
    }, []);

    return (
        <Provider store={store}>
            <PersistGate onBeforeLift={onBeforeLift} loading={null} persistor={persistor}>
                <ThemeProvider theme={theme} useDark={colorScheme === 'dark'}>
                    <SafeAreaProvider>{isConnected ? <NavigationApp /> : <NotInternet />}</SafeAreaProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
};

export default AppSource;
