import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

import ViewProfile from './ViewProfile';
import { RootState } from 'store';
import ItemMusic from './ItemMusic';
import ImageCustom from 'components/ImageCustom';
import { Colors } from 'styles/global.style';
import { User } from 'types/Auth/AuthResponse';

const { height } = Dimensions.get('window');
interface IProps {
    navigation: NavigationProp<any>;
}

const MusicScreen: FC<IProps> = ({ navigation }) => {
    const [badge, setBadge] = useState<number>(0);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const user = useSelector<RootState, User>(state => state.auth.user);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const renderItem = useCallback(({ item }) => item, []);
    const itemSeparatorComponent = useCallback(() => <View style={styles.itemSeparatorComponent} />, []);

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

            <ScrollView automaticallyAdjustContentInsets style={styles.scrollView}>
                <ViewProfile />

                <FlatList
                    data={[
                        <ItemMusic
                            onPress={() => goToListScreen('song_demos')}
                            image_url="https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/4/7/0/1/4701706bd14d9023e200cfa18977e651.jpg"
                            title="Danh sách nhạc nghe thử"
                        />,
                        isLogin && (
                            <ItemMusic
                                onPress={() => goToListScreen('songs')}
                                image_url="https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg"
                                title="Danh sách nhạc đã mua"
                            />
                        ),
                    ]}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    ItemSeparatorComponent={itemSeparatorComponent}
                    style={styles.viewListMusic}
                />
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
});

export default MusicScreen;
