import React, { FC, Fragment, memo, MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import debounce from 'lodash/debounce';
import ActionSheet from 'react-native-actionsheet';
import { useSelector } from 'react-redux';

import ImageCustom from 'components/ImageCustom';
import { Song } from 'types/Songs/SongResponse';
import { fancyTimeFormat } from 'utils/customs/fancyTimeFormat';
import ModalSelectPrice from 'components/ModalSelectPrice';
import { RootState } from 'store';
import NavigationService from 'navigation/NavigationService';

interface IProsp {
    onPress?: () => void;
    item: Song;
    type: 'songs' | 'song_demos';
}

const ItemList: FC<IProsp> = ({ item, type }) => {
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const refActionSheet = useRef<ActionSheet>();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handlePressItem = useCallback(async () => {
        await TrackPlayer.skip(item.uuid);
        debounce(() => TrackPlayer.play(), 500)();
    }, [item.uuid]);

    const onSelectAction = useCallback(
        (index: number) => {
            if (index === 0) {
                if (type === 'song_demos') {
                    handlePressItem();
                }

                if (type === 'songs') {
                    if (!isLogin) {
                        NavigationService.navigate('LoginScreen');
                        return;
                    }
                    setIsVisible(true);
                }
            }

            if (index === 1) {
                if (type === 'song_demos') {
                    if (!isLogin) {
                        NavigationService.navigate('LoginScreen');
                        return;
                    }
                    setIsVisible(true);
                }
            }
        },
        [handlePressItem, isLogin, type],
    );

    const showActionSheet = useCallback(() => {
        refActionSheet.current?.show();
    }, []);

    const disabled = useMemo(() => type === 'songs' && item.expire - item.usedTime === 0, [item, type]);

    return (
        <Fragment>
            <TouchableHighlight disabled={disabled} underlayColor="#d6d6d6" onPress={handlePressItem}>
                <View style={styles.container}>
                    <ImageCustom source={{ uri: item.thumb }} resizeMode="cover" style={styles.viewImage} />

                    <View style={styles.viewContent}>
                        <Text style={styles.nameMusic} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.textMins}>
                            {fancyTimeFormat(item.time)} mins {!!disabled && '(Bài hát hết hạn)'}
                        </Text>
                    </View>

                    <TouchableOpacity disabled={disabled} style={styles.iconDot} onPress={showActionSheet}>
                        <Icon type="entypo" name="dots-three-vertical" color="#757575" size={20} />
                    </TouchableOpacity>
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
            <ModalSelectPrice
                uuid={type === 'song_demos' ? item.uuid : item.parent}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
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
    iconDot: { width: 50, alignItems: 'flex-end' },
});

export default memo(ItemList);
