import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TrackPlayer, { Track, useTrackPlayerProgress } from 'react-native-track-player';
import last from 'lodash/last';

import { RootState } from 'store';

export const useAutoNext = () => {
    const { duration, position } = useTrackPlayerProgress();
    const track = useSelector<RootState, Track>(state => state.home.track);
    const queue = useSelector<RootState, Track[]>(state => state.home.queue);

    const checkTime = useCallback(async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();

        if (currentTrack) {
            if (position > duration) {
                if (last(queue)?.id === track.id) {
                    await TrackPlayer.stop();
                } else {
                    await TrackPlayer.skipToNext();
                }
            }
        }
    }, [duration, position, queue, track]);

    useEffect(() => {
        checkTime();
    }, [checkTime]);
};
