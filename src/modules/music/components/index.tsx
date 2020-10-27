import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import ViewProfile from './ViewProfile';
import { RootState } from 'store';
import ItemMusic from './ItemMusic';
interface IProps {
    navigation: NavigationProp<any>;
}

const MusicScreen: FC<IProps> = ({ navigation }) => {
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('dark-content', true);
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

    return (
        <View style={styles.scrollView}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: { paddingTop: 10, flex: 1 },
    viewListMusic: { marginTop: 35 },
    itemSeparatorComponent: { height: 10 },
});

export default MusicScreen;
