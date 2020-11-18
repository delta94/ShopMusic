import React, { FC, memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import update from 'immer';

import { Song } from 'types/Songs/SongResponse';
import { Colors } from 'styles/global.style';
import { formatPrice } from 'utils/customs/formatPrice';
import { Input } from 'react-native-elements';

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
    const onValueChange = useCallback(
        (value: string) => {
            const newListBuy = update(listBuy, darf => {
                const findIndex = darf.findIndex(i => i.uuid === item.uuid);
                if (findIndex !== -1) {
                    darf[findIndex].time = Number(value);
                }
            });

            setListBuy(newListBuy);
        },
        [item.uuid, listBuy, setListBuy],
    );

    return (
        <Input
            labelStyle={styles.labelStyle}
            label={`${item.title} - ${formatPrice(item.cost)}/phút`}
            returnKeyType="done"
            autoCapitalize="none"
            keyboardType="number-pad"
            selectionColor={Colors.subtle}
            value={String(listBuy.find(i => i.uuid === item.uuid)?.time || '')}
            onChangeText={onValueChange}
            style={styles.viewInput}
            placeholder="Nhập thời gian mua (phút)"
        />
    );
};

const styles = StyleSheet.create({
    viewInput: { fontSize: 15, color: Colors.subtle },
    labelStyle: { color: Colors.subtle, fontSize: 14, fontWeight: '500' },
});

export default memo(ItemBoyMore);
