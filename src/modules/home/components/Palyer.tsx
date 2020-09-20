/* eslint-disable no-bitwise */
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, Slider, Button } from 'react-native-elements';
import TrackPlayer, { useTrackPlayerProgress, usePlaybackState, Track } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import last from 'lodash/last';
import head from 'lodash/head';

import { Colors } from 'styles/global.style';
import { actions as actionsHome } from '../store';
import { RootState } from 'store';

const fancyTimeFormat = (duration: number) => {
    // Hours, minutes and seconds
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
};

const Palyer = () => {
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const { duration, position } = useTrackPlayerProgress();

    const track = useSelector<RootState, Track>(state => state.home.track);
    const queue = useSelector<RootState, Track[]>(state => state.home.queue);

    const addTrack = useCallback(async () => {
        await TrackPlayer.add([
            {
                id: '1111',
                url: 'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
                title: 'Longing',
                artist: 'David Chavez',
                artwork: 'https://i.picsum.photos/id/100/200/200.jpg',
                duration: 143,
            },
            {
                id: '2222',
                url: 'https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E',
                title: 'Soul Searching (Demo)',
                artist: 'David Chavez',
                artwork: 'https://i.picsum.photos/id/200/200/200.jpg',
                duration: 77,
            },
            {
                id: '3333',
                url: 'https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI',
                title: 'Lullaby (Demo)',
                artist: 'David Chavez',
                artwork: 'https://i.picsum.photos/id/300/200/200.jpg',
                duration: 71,
            },
            {
                id: '4444',
                url: 'https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC',
                title: 'Rhythm City (Demo)',
                artist: 'David Chavez',
                artwork: 'https://i.picsum.photos/id/400/200/200.jpg',
                duration: 106,
            },
        ]);
        await dispatch(actionsHome.getQueue());
    }, [dispatch]);

    useEffect(() => {
        addTrack();
    }, [addTrack]);

    const togglePlayback = useCallback(async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
            await TrackPlayer.reset();

            await TrackPlayer.play();
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    }, [playbackState]);

    const checkPlay = useMemo<boolean>(() => {
        if (playbackState === TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_BUFFERING) {
            return false;
        }

        return true;
    }, [playbackState]);

    const skipToNext = useCallback(async () => {
        try {
            await TrackPlayer.skipToNext();
        } catch (_) {}
    }, []);

    const skipToPrevious = useCallback(async () => {
        try {
            await TrackPlayer.skipToPrevious();
        } catch (_) {}
    }, []);

    const onValueChange = useCallback((value: number) => {
        TrackPlayer.seekTo(value);
    }, []);

    return (
        <View>
            <View style={styles.viewSlider}>
                <Slider
                    value={position}
                    minimumValue={0}
                    onValueChange={onValueChange}
                    maximumValue={duration}
                    minimumTrackTintColor={Colors.primary}
                    thumbStyle={styles.thumbStyle}
                />
                <View style={styles.viewTime}>
                    <Text style={styles.textTime}>{fancyTimeFormat(position)}</Text>
                    <Text style={styles.textTime}>-{fancyTimeFormat(duration - position)}</Text>
                </View>
            </View>

            <View style={styles.viewActions}>
                <View style={styles.actions}>
                    <Button
                        disabled={String(track.id) === String(head(queue)?.id)}
                        onPress={skipToPrevious}
                        icon={
                            <Icon
                                type="ionicon"
                                name="play-back-sharp"
                                color={String(track.id) === String(head(queue)?.id) ? '#757575' : Colors.white}
                                size={35}
                            />
                        }
                        type="clear"
                    />
                    <Button
                        onPress={togglePlayback}
                        icon={
                            <Icon
                                type="ionicon"
                                name={checkPlay ? 'play-circle' : 'pause-circle'}
                                color={Colors.white}
                                size={70}
                            />
                        }
                        type="clear"
                    />
                    <Button
                        disabled={String(track.id) === String(last(queue)?.id)}
                        onPress={skipToNext}
                        icon={
                            <Icon
                                type="ionicon"
                                color={String(track.id) === String(last(queue)?.id) ? '#757575' : Colors.white}
                                name="play-forward-sharp"
                                size={35}
                            />
                        }
                        type="clear"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 10 },
    progress: {
        height: 20,
        marginTop: 10,
        flexDirection: 'row',
    },
    actions: { marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 200 },
    viewActions: { alignItems: 'center' },
    thumbStyle: { height: 15, width: 15, backgroundColor: Colors.primary },
    viewSlider: { paddingHorizontal: 15 },
    viewTime: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    textTime: { fontSize: 12, color: Colors.white },
});

export default memo(Palyer);
