import ImageCustom from 'components/ImageCustom';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from 'styles/global.style';
import ItemList from './ItemList';
import { Icon } from 'react-native-elements';
import { ListScreenRouteProp } from 'types/NavigationRoute';
import { RootState } from 'store';
import { Song, SongDemo } from 'types/Songs/SongResponse';
import { actions as actionsList } from '../store';
import LoadingOverley from 'components/LoadingOverley';

const { width } = Dimensions.get('window');

interface IProps {
    navigation: NavigationProp<any>;
    route: ListScreenRouteProp;
}

const ListScreen: FC<IProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, SongDemo[]>(state => state.list.songsDemo);
    const hasNextSongs = useSelector<RootState, boolean>(state => state.list.hasNextSongs);
    const hasNextSongsDemo = useSelector<RootState, boolean>(state => state.list.hasNextSongsDemo);

    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const { params } = route;
    const { type } = params;

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const renderItem = useCallback(({ item }) => <ItemList item={item} type={type} />, [type]);
    const listHeaderComponent = useCallback(
        () => <Text style={styles.textHeaderList}>Danh sách nhạc {type === 'song_demos' ? 'nghe thử' : 'đã mua'}</Text>,
        [type],
    );
    const itemSeparatorComponent = useCallback(() => <View style={styles.itemSeparatorComponent} />, []);

    const checkLoadMore = useMemo(() => (type === 'songs' ? hasNextSongs : hasNextSongsDemo), [
        hasNextSongs,
        hasNextSongsDemo,
        type,
    ]);

    const listFooterComponent = useCallback(
        () => <View style={styles.listFooterComponent}>{checkLoadMore && <ActivityIndicator size="small" />}</View>,
        [checkLoadMore],
    );

    const fetchSongs = useCallback(
        (reFresh?: boolean) => {
            try {
                reFresh ? setRefreshing(true) : setLoading(true);
                type === 'songs' ? dispatch(actionsList.fetchSongs(0)) : dispatch(actionsList.fetchSongsDemo(0));
            } finally {
                reFresh ? setRefreshing(false) : setLoading(false);
            }
        },
        [dispatch, type],
    );

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const data = useMemo(() => (type === 'songs' ? songs : songsDemo), [songs, songsDemo, type]);

    const onRefresh = useCallback(() => {
        fetchSongs(true);
        setPage(1);
    }, [fetchSongs]);

    const onEndReached = useCallback(() => {
        if (checkLoadMore) {
            setPage(page + 1);
            type === 'songs'
                ? dispatch(actionsList.fetchSongs(page + 1))
                : dispatch(actionsList.fetchSongsDemo(page + 1));
        }
    }, [checkLoadMore, dispatch, page, type]);

    return (
        <Fragment>
            <LoadingOverley visible={loading} />

            <View>
                <ImageCustom
                    source={{
                        uri:
                            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/d/8/9/9/d8996a26339f7b7a5d596666f03edac0.jpg',
                    }}
                    resizeMode="cover"
                    style={styles.imageView}
                />

                <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                    <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
                </TouchableOpacity>
            </View>

            <FlatList
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                data={data}
                style={styles.flatList}
                ItemSeparatorComponent={itemSeparatorComponent}
                ListHeaderComponent={listHeaderComponent}
                renderItem={renderItem}
                ListFooterComponent={listFooterComponent}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
            />
        </Fragment>
    );
};

const styles = StyleSheet.create({
    imageView: { width, height: 360 },
    viewIconPlay: { position: 'absolute', top: 335, right: 10, zIndex: 199 },
    textHeaderList: { fontSize: 20, fontWeight: '600', paddingLeft: 10, marginBottom: 20 },
    flatList: { paddingTop: 20 },
    itemSeparatorComponent: { height: 10 },
    listFooterComponent: { height: 100, alignItems: 'center', justifyContent: 'center' },
    iconBack: { position: 'absolute', left: 15, top: 50 },
});

export default ListScreen;
