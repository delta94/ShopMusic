import React, { FC, memo, MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import range from 'lodash/range';
import update from 'immer';

import { Song } from 'types/Songs/SongResponse';
import { Colors } from 'styles/global.style';
import { formatPrice } from 'utils/customs/formatPrice';

interface IProps {
    item: Song;
    listBuy: ItemBuy[];
    setListBuy: React.Dispatch<React.SetStateAction<ItemBuy[]>>;
}

interface ItemBuy {
    uuid: string;
    cost: number;
    time: number;
}

const ItemBoyMore: FC<IProps> = ({ item, listBuy, setListBuy }) => {
    const refPicker = useRef<RNPickerSelect>();

    const times = useMemo<Item[]>(
        () =>
            (Object.keys(item).length > 0 ? range(Math.ceil(item.time / 60)) : []).map(i => ({
                label: `${i + 1} phút (${formatPrice((i + 1) * item.cost)})`,
                value: i + 1,
            })),
        [item],
    );

    const toggePicker = useCallback(() => {
        refPicker.current?.togglePicker();
    }, []);

    const onValueChange = useCallback(
        (value: number) => {
            const newListBuy = update(listBuy, darf => {
                const findIndex = darf.findIndex(i => i.uuid === item.uuid);
                if (findIndex !== -1) {
                    darf[findIndex].time = value;
                }
            });

            setListBuy(newListBuy);
        },
        [item.uuid, listBuy, setListBuy],
    );

    return (
        <View>
            <Text>{item.title}</Text>

            <TouchableOpacity activeOpacity={1} onPress={toggePicker} style={styles.dropdown}>
                <RNPickerSelect
                    ref={refPicker as MutableRefObject<RNPickerSelect>}
                    placeholder={{ label: 'Chọn thời gian mua' }}
                    useNativeAndroidPickerStyle
                    style={{ inputAndroid: { color: Colors.black } }}
                    value={listBuy.find(i => i.uuid === item.uuid)?.time}
                    onValueChange={onValueChange}
                    items={times}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        marginTop: 10,
        borderColor: '#757575',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        ...Platform.select({
            android: { paddingVertical: 0 },
            ios: { paddingVertical: 10 },
        }),
    },
});

export default memo(ItemBoyMore);
