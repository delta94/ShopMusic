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
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsList } from '../store';
import LoadingOverley from 'components/LoadingOverley';
import ModalBuyMore from './ModalBuyMore';

const { width, height } = Dimensions.get('window');

interface IProps {
    navigation: NavigationProp<any>;
    route: ListScreenRouteProp;
}

const ListScreen: FC<IProps> = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsCategory = useSelector<RootState, Song[]>(state => state.list.songsCategory);
    const hasNextSongs = useSelector<RootState, boolean>(state => state.list.hasNextSongs);
    const hasNextSongsDemo = useSelector<RootState, boolean>(state => state.list.hasNextSongsDemo);
    const listSongSelect = useSelector<RootState, Song[]>(state => state.list.listSongSelect);
    const selectMultiBuy = useSelector<RootState, boolean>(state => state.list.selectMultiBuy);

    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const { params } = route;
    const { type, category_id, title } = params;

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const renderItem = useCallback(
        ({ item }) => <ItemList checked={listSongSelect.some(i => i.uuid === item.uuid)} item={item} type={type} />,
        [listSongSelect, type],
    );
    const listHeaderComponent = useCallback(
        () => (
            <Text style={styles.textHeaderList}>
                Danh sách nhạc {type === 'songs' ? 'đã mua' : `nghe thử ${title}`}
            </Text>
        ),
        [title, type],
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
                type === 'songs'
                    ? dispatch(actionsList.fetchSongs(0))
                    : dispatch(actionsList.fetchSongsByCategoryId({ category_id, page: 0 }));
            } finally {
                reFresh ? setRefreshing(false) : setLoading(false);
            }
        },
        [category_id, dispatch, type],
    );

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const data = useMemo(() => (type === 'songs' ? songs : songsCategory), [songs, songsCategory, type]);

    const onRefresh = useCallback(() => {
        fetchSongs(true);
        setPage(1);
    }, [fetchSongs]);

    const onEndReached = useCallback(() => {
        if (checkLoadMore) {
            setPage(page + 1);
            type === 'songs'
                ? dispatch(actionsList.fetchMoreSongs(page + 1))
                : dispatch(actionsList.fetchMoreSongsByCategoryId({ category_id, page: page + 1 }));
        }
    }, [category_id, checkLoadMore, dispatch, page, type]);

    useEffect(() => {
        if (!isVisible) {
            dispatch(actionsList.setSelectBuyMulti(false));
            dispatch(actionsList.setListSelect([]));
        }
    }, [dispatch, isVisible]);

    const openModalBuyMore = useCallback(() => {
        if (!isLogin) {
            navigation.navigate('LoginScreen');
            return;
        }

        if (!selectMultiBuy) {
            dispatch(actionsList.setSelectBuyMulti(true));
        } else if (listSongSelect.length > 0) {
            setIsVisible(true);
        } else {
            dispatch(actionsList.setSelectBuyMulti(false));
        }
    }, [dispatch, isLogin, listSongSelect.length, navigation, selectMultiBuy]);

    return (
        <Fragment>
            <LoadingOverley visible={loading} />

            <View>
                <ImageCustom
                    source={require('assets/images/background.jpg')}
                    resizeMode="cover"
                    style={styles.imageView}
                />

                <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                    <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
                </TouchableOpacity>

                <TouchableOpacity onPress={openModalBuyMore} style={styles.buttonBuyMore}>
                    <Text style={styles.textBuyMore}>
                        {!selectMultiBuy ? 'Mua nhiều' : listSongSelect.length > 0 ? 'Mua' : 'Huỷ'}
                    </Text>
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

            <ModalBuyMore type={type} setIsVisible={setIsVisible} isVisible={isVisible} />
        </Fragment>
    );
};

const styles = StyleSheet.create({
    imageView: { width, height: height / 3 },
    viewIconPlay: { position: 'absolute', top: 335, right: 10, zIndex: 199 },
    textHeaderList: { fontSize: 20, fontWeight: '600', paddingLeft: 10, marginBottom: 20 },
    flatList: { paddingTop: 20 },
    itemSeparatorComponent: { height: 10 },
    listFooterComponent: { height: 100, alignItems: 'center', justifyContent: 'center' },
    iconBack: { position: 'absolute', left: 15, top: 50 },
    buttonBuyMore: {
        position: 'absolute',
        top: 55,
        right: 15,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    textBuyMore: { color: Colors.white, fontWeight: '500' },
});

export default ListScreen;
