import { useCallback, useMemo } from 'react';
import TrackPlayer, { Track, usePlaybackState } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import last from 'lodash/last';
import debounce from 'lodash/debounce';

import { RootState } from 'store';
import { useCheckDurationPlay } from './useCheckDurationPlay';

export const usePlay = () => {
    const playbackState = usePlaybackState();
    const queue = useSelector<RootState, Track[]>(state => state.home.queue);
    const timer = useCheckDurationPlay();

    const checkPlay = useMemo<boolean>(() => {
        if (playbackState === TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_BUFFERING) {
            return true;
        }

        return false;
    }, [playbackState]);

    const togglePlayback = useCallback(async () => {
        const [currentTrack, duration, position] = await Promise.all([
            TrackPlayer.getCurrentTrack(),
            TrackPlayer.getDuration(),
            TrackPlayer.getPosition(),
        ]);

        const numberCheck = Math.floor(duration - position);

        if (currentTrack == null) {
            await TrackPlayer.play();
        } else {
            const track = await TrackPlayer.getTrack(currentTrack);

            if (!!track && !!track.rating && !timer) {
                await TrackPlayer.stop();
                return;
            }

            if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === TrackPlayer.STATE_NONE) {
                const lastMusic = last(queue);

                if (numberCheck <= 0 && currentTrack === lastMusic?.id) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add(queue);
                    await TrackPlayer.skip(currentTrack);
                    debounce(() => TrackPlayer.play(), 500)();
                } else {
                    await TrackPlayer.play();
                }
            } else {
                await TrackPlayer.pause();
            }
        }
    }, [playbackState, queue, timer]);

    return { checkPlay, playbackState, togglePlayback };
};
