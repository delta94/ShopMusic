import { useFocusEffect } from '@react-navigation/native';
import ImageCustom from 'components/ImageCustom';
import React, { memo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { Track } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import { RootState } from 'store';
import { Colors } from 'styles/global.style';
import Palyer from './Palyer';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const { top } = useSafeAreaInsets();

    const track = useSelector<RootState, Track>(state => state.home.track);

    const setup = useCallback(async () => {
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
        });
        RNBootSplash.hide();
    }, []);

    useEffect(() => {
        setup();
    }, [setup]);

    return (
        <ImageBackground
            blurRadius={100}
            source={{
                uri:
                    'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
            }}
            style={[styles.container, { paddingTop: top }]}>
            <Text style={styles.textNowPlaying}>NOW PLAYING</Text>

            <View style={styles.viewImage}>
                <ImageCustom
                    source={{
                        uri:
                            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View>
                <Text style={styles.songTitle}>{track.title}</Text>
                <Text style={styles.nameProducer}>{track.artist}</Text>
            </View>
            <Palyer />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'space-evenly' },
    textNowPlaying: { fontSize: 18, textAlign: 'center', fontWeight: '700', color: Colors.white },
    image: {
        width: width / 1.2,
        height: width / 1.2,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    viewImage: { alignItems: 'center' },
    songTitle: { fontSize: 20, textAlign: 'center', color: Colors.white, fontWeight: '800' },
    nameProducer: { marginTop: 10, fontSize: 18, textAlign: 'center', color: Colors.white, fontWeight: '700' },
});

export default memo(HomeScreen);
