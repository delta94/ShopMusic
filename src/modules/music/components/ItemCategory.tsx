import ImageCustom from 'components/ImageCustom';
import NavigationService from 'navigation/NavigationService';
import React, { FC, memo, useCallback } from 'react';
import { Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { Category } from 'types/Music/MusicResponse';

const { width } = Dimensions.get('window');

interface IProps {
    item: Category;
}

const ItemCategory: FC<IProps> = ({ item }) => {
    const handlePress = useCallback(() => {
        NavigationService.navigate('ListScreen', { category_id: item.uuid });
    }, [item.uuid]);

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <ImageCustom source={{ uri: item.thumb }} resizeMode="cover" style={styles.image} />
            <Text style={styles.nameCategory}>{item.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: { width: width / 3.5, height: width / 3.5, borderRadius: 5 },
    container: { alignItems: 'center', width: width / 3.5 },
    nameCategory: { marginTop: 3, fontSize: 15, fontWeight: '500', textAlign: 'center' },
});

export default memo(ItemCategory);
