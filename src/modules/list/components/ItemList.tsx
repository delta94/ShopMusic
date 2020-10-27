import React, { FC, Fragment, memo, MutableRefObject, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import debounce from 'lodash/debounce';
import ActionSheet from 'react-native-actionsheet';

import ImageCustom from 'components/ImageCustom';
import { Song } from 'types/Songs/SongResponse';
import { fancyTimeFormat } from 'utils/customs/fancyTimeFormat';

interface IProsp {
    onPress?: () => void;
    item: Song;
    type: 'songs' | 'song_demos';
}

const ItemList: FC<IProsp> = ({ item, type }) => {
    const refActionSheet = useRef<ActionSheet>();

    const handlePressItem = useCallback(async () => {
        await TrackPlayer.skip(type === 'songs' ? `${item.uuid}` : `${item.uuid}`);
        debounce(() => TrackPlayer.play(), 500)();
    }, [item.uuid, type]);

    const onSelectAction = useCallback(
        (index: number) => {
            if (index === 0) {
                if (type === 'song_demos') {
                    handlePressItem();
                }
            }
        },
        [handlePressItem, type],
    );

    const showActionSheet = useCallback(() => {
        refActionSheet.current?.show();
    }, []);

    return (
        <Fragment>
            <TouchableHighlight underlayColor="#d6d6d6" onPress={handlePressItem}>
                <View style={styles.container}>
                    <ImageCustom source={{ uri: item.thumb }} resizeMode="cover" style={styles.viewImage} />

                    <View style={styles.viewContent}>
                        <Text style={styles.nameMusic} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.textMins}>{fancyTimeFormat(item.time)} mins</Text>
                    </View>

                    <Icon
                        onPress={showActionSheet}
                        type="entypo"
                        name="dots-three-vertical"
                        color="#757575"
                        size={20}
                    />
                </View>
            </TouchableHighlight>
            <ActionSheet
                ref={refActionSheet as MutableRefObject<ActionSheet>}
                title="Lựa chọn"
                options={[
                    type === 'song_demos' ? 'Nghe thử' : '',
                    type === 'song_demos' ? 'Mua bản nhạc' : 'Mua thêm giờ',
                    'Đóng',
                ].filter(Boolean)}
                cancelButtonIndex={type === 'song_demos' ? 2 : 1}
                onPress={onSelectAction}
            />
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewImage: { width: 60, height: 60, borderRadius: 5 },
    viewContent: { flex: 1, paddingLeft: 10 },
    nameMusic: { fontSize: 16, fontWeight: '600' },
    textMins: { fontSize: 12, marginTop: 3, color: '#757575', fontWeight: '500' },
});

export default memo(ItemList);
