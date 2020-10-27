import ImageCustom from 'components/ImageCustom';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { Track } from 'react-native-track-player';

import { RootState } from 'store';
import { Colors } from 'styles/global.style';
import { usePlay } from 'hooks/usePlay';
import NavigationService from 'navigation/NavigationService';

const MusicComponent = () => {
    const track = useSelector<RootState, Track>(state => state.home.track);
    const { checkPlay, togglePlayback } = usePlay();

    const goToHome = useCallback(() => {
        NavigationService.navigate('HomeScreen');
    }, []);

    return (
        <TouchableOpacity onPress={goToHome} style={styles.container}>
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
                <Text numberOfLines={1} style={styles.textViewProfile}>
                    {track.artist}
                </Text>
            </View>

            <TouchableOpacity onPress={togglePlayback}>
                <Icon type="ionicon" name={!checkPlay ? 'play' : 'pause'} color={Colors.black} size={30} />
            </TouchableOpacity>
        </TouchableOpacity>
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
