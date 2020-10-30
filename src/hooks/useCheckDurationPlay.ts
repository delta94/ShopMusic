import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { Track, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { RootState } from 'store';
import { actions as actionsHome } from 'modules/home/store';

export const useCheckDurationPlay = () => {
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();

    const track = useSelector<RootState, Track>(state => state.home.track);
    const [time, setTime] = useState<number>(0);
    const [timer, setTimer] = useState<number>(track.rating ? (track.rating as number) : 0);

    useEffect(() => {
        if (track.rating) {
            setTime(track.rating as number);
            setTimer(track.rating as number);
        }
    }, [track.rating]);

    useEffect(() => {
        if (!track.rating) {
            setTime(0);
            setTimer(0);
        }
    }, [track.rating]);

    const decrementClock = useCallback(() => {
        setTimer(prevstate => prevstate - 1);
    }, []);

    useEffect(() => {
        let interval: any;

        if (time) {
            if (playbackState === TrackPlayer.STATE_PLAYING) {
                interval = setInterval(() => {
                    decrementClock();
                }, 1000);
            }

            if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === TrackPlayer.STATE_NONE) {
                clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }

        return () => {
            !!interval && clearInterval(interval);
        };
    }, [decrementClock, playbackState, time]);

    const addTrack = useCallback(() => {
        dispatch(actionsHome.getQueue());
    }, [dispatch]);

    useEffect(() => {
        addTrack();
    }, [addTrack]);

    useFocusEffect(addTrack);

    useTrackPlayerEvents(['playback-track-changed', 'playback-state'], async (event: any) => {
        if (event.type === 'playback-track-changed') {
            dispatch(actionsHome.stopMusic(event.track));
        }

        if (event.type === 'playback-state') {
            if (event.state === TrackPlayer.STATE_PAUSED) {
                const currentTrack = await TrackPlayer.getCurrentTrack();
                dispatch(actionsHome.stopMusic(currentTrack));
            }
        }
    });

    const checkTrack = useCallback(async () => {
        try {
            const currentTrack = await TrackPlayer.getCurrentTrack();
            const trackCurrent = await TrackPlayer.getTrack(currentTrack);

            if (!!trackCurrent && trackCurrent.rating && !timer) {
                TrackPlayer.stop;
            }
        } catch (error) {}
    }, [timer]);

    useEffect(() => {
        checkTrack();
    }, [checkTrack, playbackState]);

    return timer;
};
