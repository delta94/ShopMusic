import ImageCustom from 'components/ImageCustom';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import TrackPlayer, { usePlaybackState, Track } from 'react-native-track-player';

import { RootState } from 'store';
import { Colors } from 'styles/global.style';

const MusicComponent = () => {
    const track = useSelector<RootState, Track>(state => state.home.track);
    const playbackState = usePlaybackState();

    const checkPlay = useMemo<boolean>(() => {
        if (playbackState === TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_BUFFERING) {
            return false;
        }

        return true;
    }, [playbackState]);

    const togglePlayback = useCallback(async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
            await TrackPlayer.play();
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    }, [playbackState]);

    return (
        <View style={styles.container}>
            <ImageCustom
                source={{
                    uri:
                        'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
                }}
                resizeMode="cover"
                style={styles.image}
            />

            <View style={styles.viewContainer}>
                <Text numberOfLines={1} style={styles.textName}>
                    {track.title}
                </Text>
                <Text style={styles.textViewProfile}>{track.artist}</Text>
            </View>

            <TouchableOpacity onPress={togglePlayback}>
                <Icon type="ionicon" name={checkPlay ? 'play' : 'pause'} color={Colors.black} size={30} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,.05)',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    image: { width: 60, height: 60, borderRadius: 5 },
    viewContainer: { flex: 1, paddingLeft: 10 },
    textName: { fontSize: 20, fontFamily: 'System', fontWeight: '700' },
    textViewProfile: { marginTop: 5, fontSize: 11, color: '#757575', fontWeight: '500' },
});

export default MusicComponent;
