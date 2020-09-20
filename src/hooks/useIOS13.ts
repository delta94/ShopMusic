import { Platform } from 'react-native';
import { useMemo } from 'react';

const majorVersionIOS = parseInt(String(Platform.Version), 10);

export const useIOS13 = () => {
    const isIOS13 = useMemo(() => Platform.OS === 'ios' && majorVersionIOS >= 13, []);

    return isIOS13;
};
