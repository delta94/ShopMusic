import { DeviceEventEmitter } from 'react-native';
import { useCallback, useEffect } from 'react';
import { ShortcutItem } from 'react-native-quick-actions';

import NavigationService from 'navigation/NavigationService';

export const useQuickActions = () => {
    const quickActionShortcut = useCallback((data: ShortcutItem) => {
        NavigationService.navigate(data.userInfo.url);
    }, []);

    useEffect(() => {
        DeviceEventEmitter.addListener('quickActionShortcut', quickActionShortcut);

        return () => {
            DeviceEventEmitter.removeListener('quickActionShortcut', quickActionShortcut);
        };
    }, [quickActionShortcut]);
};
