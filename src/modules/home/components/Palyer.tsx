/* eslint-disable no-bitwise */
import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Slider, Button } from 'react-native-elements';
import TrackPlayer, { useTrackPlayerProgress, Track } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import last from 'lodash/last';
import head from 'lodash/head';

import { Colors } from 'styles/global.style';
import { RootState } from 'store';
import { fancyTimeFormat } from 'utils/customs/fancyTimeFormat';
import { usePlay } from 'hooks/usePlay';

const Palyer = () => {
    const { checkPlay, togglePlayback } = usePlay();
    const { duration, position } = useTrackPlayerProgress();

    const track = useSelector<RootState, Track>(state => state.home.track);
    const queue = useSelector<RootState, Track[]>(state => state.home.queue);

    const skipToNext = useCallback(async () => {
        await TrackPlayer.skipToNext();
    }, []);

    const skipToPrevious = useCallback(async () => {
        await TrackPlayer.skipToPrevious();
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
                        TouchableComponent={TouchableOpacity}
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
                        TouchableComponent={TouchableOpacity}
                        onPress={togglePlayback}
                        icon={
                            <Icon
                                type="ionicon"
                                name={!checkPlay ? 'play-circle' : 'pause-circle'}
                                color={Colors.white}
                                size={70}
                            />
                        }
                        type="clear"
                    />
                    <Button
                        TouchableComponent={TouchableOpacity}
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
