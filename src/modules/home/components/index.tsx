import { useFocusEffect } from '@react-navigation/native';
import ImageCustom from 'components/ImageCustom';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { Track } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import { BlurView } from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';

import { RootState } from 'store';
import { Colors } from 'styles/global.style';
import Palyer from './Palyer';
import { actions as actionsList } from 'modules/list/store';
import ModalSelectPrice from 'components/ModalSelectPrice';
import NavigationService from 'navigation/NavigationService';
import { useCheckDurationPlay } from 'hooks/useCheckDurationPlay';
import { fancyTimeFormat } from 'utils/customs/fancyTimeFormat';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const dispatch = useDispatch();
    const timer = useCheckDurationPlay();
    const track = useSelector<RootState, Track>(state => state.home.track);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const { top } = useSafeAreaInsets();

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const setup = useCallback(async () => {
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.updateOptions({ stopWithApp: true });
        await NetInfo.fetch();
        RNBootSplash.hide();
    }, []);

    useEffect(() => {
        setup();
    }, [setup]);

    useEffect(() => {
        dispatch(actionsList.fetchSongsDemo(0));
    }, [dispatch]);

    const openModal = useCallback(() => {
        if (!isLogin) {
            NavigationService.navigate('LoginScreen');
            return;
        }

        setIsVisible(true);
    }, [isLogin]);

    return (
        <FastImage source={{ uri: track.artwork }} style={[styles.container, { paddingTop: top }]}>
            <Fragment>
                <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />

                <Text style={styles.textNowPlaying}> {timer ? fancyTimeFormat(timer) : 'NOW PLAYING'}</Text>

                <View style={styles.viewImage}>
                    <ImageCustom source={{ uri: track.artwork }} style={styles.image} resizeMode="cover" />
                </View>

                <View>
                    <Text style={styles.songTitle}>{track.title}</Text>
                    <Text numberOfLines={1} style={styles.nameProducer}>
                        {track.artist}
                    </Text>
                </View>
                <Palyer />

                <TouchableOpacity onPress={openModal} style={styles.buttonBought}>
                    <Text style={styles.textBought}>Mua</Text>
                </TouchableOpacity>

                <ModalSelectPrice uuid={track.id} isVisible={isVisible} setIsVisible={setIsVisible} />
            </Fragment>
        </FastImage>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        justifyContent: 'space-evenly',
        width: '100%',
        height: '100%',
    },
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
    nameProducer: {
        marginTop: 10,
        fontSize: 18,
        textAlign: 'center',
        color: Colors.white,
        fontWeight: '700',
        paddingHorizontal: 15,
    },
    buttonBought: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        right: 15,
    },
    textBought: { fontWeight: '500', color: Colors.white, fontSize: 15 },
});

export default memo(HomeScreen);
