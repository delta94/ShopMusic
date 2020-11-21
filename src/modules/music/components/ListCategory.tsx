import React, { memo, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import { Category } from 'types/Music/MusicResponse';
import ItemCategory from './ItemCategory';
import { actions as actionsMusic } from '../store';

const ListCategory = () => {
    const dispatch = useDispatch();
    const categories = useSelector<RootState, Category[]>(state => state.music.categories);

    const renderItem = useCallback(({ item }) => <ItemCategory item={item} />, []);
    const itemSeparatorComponent = useCallback(() => <View style={styles.itemSeparatorComponent} />, []);

    const fetchCategories = useCallback(async () => {
        dispatch(actionsMusic.fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <View style={styles.container}>
            <Text style={styles.textName}>Danh mục</Text>
            <FlatList
                data={categories}
                horizontal
                ItemSeparatorComponent={itemSeparatorComponent}
                renderItem={renderItem}
                style={styles.flatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 20, marginBottom: 10 },
    textName: { fontSize: 18, fontFamily: 'System', fontWeight: '700', paddingHorizontal: 10 },
    itemSeparatorComponent: { width: 10 },
    flatList: { paddingLeft: 10, paddingTop: 10 },
});

export default memo(ListCategory);
