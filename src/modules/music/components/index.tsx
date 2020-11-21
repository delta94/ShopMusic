import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import prompt from 'react-native-prompt-android';
import { unwrapResult } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';

import ViewProfile from './ViewProfile';
import { RootState } from 'store';
import ItemMusic from './ItemMusic';
import ImageCustom from 'components/ImageCustom';
import { Colors } from 'styles/global.style';
import { User } from 'types/Auth/AuthResponse';
import { actions as listActions } from 'modules/list/store';
import ListCategory from './ListCategory';

const { height } = Dimensions.get('window');
interface IProps {
    navigation: NavigationProp<any>;
}

const MusicScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [badge, setBadge] = useState<number>(0);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const user = useSelector<RootState, User>(state => state.auth.user);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const goToListScreen = useCallback(
        (type: 'songs' | 'song_demos') => {
            navigation.navigate('ListScreen', { type });
        },
        [navigation],
    );

    const goToChat = useCallback(() => {
        navigation.navigate('ChatScreen');
    }, [navigation]);

    useEffect(() => {
        if (isLogin) {
            firestore()
                .collection('inboxs')
                .doc(user.uuid)
                .onSnapshot(querySnapshot => {
                    const res: any = querySnapshot.data();
                    !!res && setBadge(res.unread_client);
                });
        }
    }, [isLogin, user]);

    const enterCode = useCallback(() => {
        prompt(
            'Nhập code',
            'Nếu bạn có code dùng để lấy một bài hát từ hệ thống thì bạn hãy nhập vào đây nhé',
            [
                { text: 'Đóng', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Gửi',
                    onPress: async code => {
                        try {
                            await dispatch<any>(listActions.addCode(code)).then(unwrapResult);
                            goToListScreen('songs');
                            debounce(() => Alert.alert('Thông báo', 'Thêm bài hát thành công'), 1000)();
                        } catch (error) {
                            debounce(
                                () =>
                                    Alert.alert('Thông báo', 'Thêm bài hát lỗi do code không tồn tại hoặc đã sử dụng'),
                                500,
                            )();
                        }
                    },
                },
            ],
            {
                cancelable: false,
                placeholder: 'CODE',
            },
        );
    }, [dispatch, goToListScreen]);

    return (
        <Fragment>
            <ImageCustom source={require('assets/images/background.jpg')} resizeMode="cover" style={styles.viewImage} />

            {isLogin && (
                <View style={styles.viewChat}>
                    <Icon type="ant-design" onPress={goToChat} name="wechat" size={30} color={Colors.white} />

                    {!!badge && (
                        <View style={styles.viewBadge}>
                            <Text style={styles.textBadge}>{badge}</Text>
                        </View>
                    )}
                </View>
            )}

            {isLogin && (
                <TouchableOpacity onPress={enterCode} style={styles.viewEnterCode}>
                    <Text style={styles.textCode}>Nhập code</Text>
                </TouchableOpacity>
            )}

            <ScrollView automaticallyAdjustContentInsets style={styles.scrollView}>
                <ViewProfile />
                <ListCategory />

                {isLogin && (
                    <ItemMusic
                        onPress={() => goToListScreen('songs')}
                        image_url="https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg"
                        title="Danh sách nhạc đã mua"
                    />
                )}
            </ScrollView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    scrollView: { paddingTop: 10, flex: 1 },
    viewListMusic: { marginTop: 35 },
    itemSeparatorComponent: { height: 10 },
    viewImage: { height: height / 4 },
    viewChat: { position: 'absolute', right: 10, top: 50 },
    viewBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: Colors.primary,
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBadge: { color: Colors.white, fontWeight: '700', fontSize: 12 },
    viewEnterCode: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors.primary,
        position: 'absolute',
        left: 10,
        top: 50,
        borderRadius: 10,
    },
    flexRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    textCode: { color: Colors.white, fontWeight: '700' },
});

export default MusicScreen;
