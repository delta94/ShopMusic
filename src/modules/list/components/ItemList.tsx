import React, { FC, Fragment, memo, MutableRefObject, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import debounce from 'lodash/debounce';
import ActionSheet from 'react-native-actionsheet';
import { useDispatch, useSelector } from 'react-redux';

import ImageCustom from 'components/ImageCustom';
import { Song } from 'types/Songs/SongResponse';
import { fancyTimeFormat } from 'utils/customs/fancyTimeFormat';
import ModalSelectPrice from 'components/ModalSelectPrice';
import { RootState } from 'store';
import NavigationService from 'navigation/NavigationService';
import { actions as actionsList } from '../store';
import { Colors } from 'styles/global.style';

interface IProsp {
    onPress?: () => void;
    item: Song;
    type: 'songs' | 'song_demos';
    checked: boolean;
}

const ItemList: FC<IProsp> = ({ item, type, checked }) => {
    const dispatch = useDispatch();
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const selectMultiBuy = useSelector<RootState, boolean>(state => state.list.selectMultiBuy);

    const refActionSheet = useRef<ActionSheet>();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handlePressItem = useCallback(async () => {
        await TrackPlayer.skip(item.uuid);
        debounce(() => TrackPlayer.play(), 500)();
    }, [item.uuid]);

    const onSelectAction = useCallback(
        (index: number) => {
            if (index === 0) {
                handlePressItem();
            }

            if (index === 1 && Number(item.type) === 2) {
                if (!isLogin) {
                    NavigationService.navigate('LoginScreen');
                    return;
                }
                setIsVisible(true);
            }
        },
        [handlePressItem, isLogin, item.type],
    );

    const showActionSheet = useCallback(() => {
        refActionSheet.current?.show();
    }, []);

    const handleChangeSelectItem = useCallback(() => {
        dispatch(actionsList.setListSongSelect(item));
    }, [dispatch, item]);

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

                    {selectMultiBuy && Number(item.type) === 2 ? (
                        <CheckBox
                            iconType="material"
                            checkedColor={Colors.primary}
                            checkedIcon="check-circle"
                            uncheckedIcon="radio-button-unchecked"
                            checked={checked}
                            onPress={handleChangeSelectItem}
                        />
                    ) : (
                        <TouchableOpacity style={styles.iconDot} onPress={showActionSheet}>
                            <Icon type="entypo" name="dots-three-vertical" color="#757575" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableHighlight>
            <ActionSheet
                ref={refActionSheet as MutableRefObject<ActionSheet>}
                title="Lựa chọn"
                options={[
                    type !== 'songs' ? 'Nghe thử' : 'Nghe nhạc',
                    Number(item.type) === 2 ? (type !== 'songs' ? 'Full bản nhạc' : 'Full thêm giờ') : '',
                    'Đóng',
                ].filter(Boolean)}
                cancelButtonIndex={type !== 'songs' ? 2 : 1}
                onPress={onSelectAction}
            />
            <ModalSelectPrice uuid={item.uuid} isVisible={isVisible} setIsVisible={setIsVisible} />
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
