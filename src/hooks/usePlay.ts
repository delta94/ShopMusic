import { useCallback, useMemo } from 'react';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

export const usePlay = () => {
    const playbackState = usePlaybackState();

    const checkPlay = useMemo<boolean>(() => {
        if (playbackState === TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_BUFFERING) {
            return true;
        }

        return false;
    }, [playbackState]);

    const togglePlayback = useCallback(async () => {
        if (playbackState === TrackPlayer.STATE_PAUSED) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }, [playbackState]);

    return { checkPlay, playbackState, togglePlayback };
};
