import AppSource from 'app';
import React, { useCallback, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import RNBootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
    const setup = useCallback(async () => {
        await TrackPlayer.setupPlayer({
            maxCacheSize: 1024 * 5,
            backBuffer: 1000,
            maxBuffer: 1000,
        });
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SEEK_TO,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            ],
            compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
        });
        await NetInfo.fetch();
        RNBootSplash.hide();
    }, []);

    useEffect(() => {
        setup();
    }, [setup]);

    return <AppSource />;
};

export default App;
