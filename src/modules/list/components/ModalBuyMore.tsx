import React, { FC, Fragment, memo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import sumBy from 'lodash/sumBy';
import { unwrapResult } from '@reduxjs/toolkit';
import Clipboard from '@react-native-community/clipboard';
import debounce from 'lodash/debounce';

import { Colors } from 'styles/global.style';
import { RootState } from 'store';
import { Song } from 'types/Songs/SongResponse';
import ItemBoyMore from './ItemBoyMore';
import { actions as listActions } from '../store';
import { formatPrice } from 'utils/customs/formatPrice';

const { width, height } = Dimensions.get('window');

interface IProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    type: 'songs' | 'song_demos';
}

interface ItemBuy {
    uuid: string;
    cost: number;
    time: number;
}

const ModalBuyMore: FC<IProps> = ({ isVisible, setIsVisible, type }) => {
    const dispatch = useDispatch();
    const [listBuy, setListBuy] = useState<ItemBuy[]>([]);
    const [codePayment, setCodePayment] = useState<string>('');
    const [total, setTotal] = useState<number>(0);

    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, Song[]>(state => state.list.songsDemo);

    const renderItem = useCallback(
        ({ item }) => <ItemBoyMore setListBuy={setListBuy} listBuy={listBuy} item={item} />,
        [listBuy],
    );

    const itemSeparatorComponent = useCallback(() => <View style={styles.itemSeparatorComponent} />, []);

    const closeModal = useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    useEffect(() => {
        if (type === 'song_demos') {
            setListBuy(songsDemo.map(item => ({ uuid: item.uuid, cost: item.cost, time: 0 })));
        } else {
            setListBuy(songs.map(item => ({ uuid: item.uuid, cost: item.cost, time: 0 })));
        }
    }, [songs, songsDemo, type]);

    const handleBuy = useCallback(async () => {
        try {
            const listBuyFilter = listBuy.filter(item => !!item.time);

            if (listBuyFilter.length > 0) {
                const totalCost = sumBy(listBuyFilter, o => o.cost * o.time);
                setTotal(totalCost);
                const res = await dispatch<any>(
                    listActions.buyList({
                        totalCost,
                        items: listBuyFilter.map(item => ({ uuid: item.uuid, cost: item.cost, time: item.time * 60 })),
                    }),
                ).then(unwrapResult);
                setCodePayment(res);
            } else {
                Alert.alert('Thông báo', 'Phải chọn thời gian của 1 bài hát');
            }
        } catch (error) {}
    }, [dispatch, listBuy]);

    const copyText = useCallback(async (text: string) => {
        await Clipboard.setString(text);
        Alert.alert('Thông báo', 'Sao chép thành công!');
    }, []);

    const closePayment = useCallback(() => {
        setIsVisible(false);
        debounce(
            () => Alert.alert('Thông báo', 'Vui lòng đợi xác nhân thanh toán thành công của Admin. Xin cảm ơn!'),
            500,
        )();
    }, [setIsVisible]);

    return (
        <Modal
            backdropColor="rgba(0,0,0,.5)"
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={styles.styleModal}
            isVisible={isVisible}>
            <View style={styles.viewContent}>
                {codePayment ? (
                    <Fragment>
                        <Text>Nội dung chuyển khoản: (bấm copy)</Text>
                        <TouchableOpacity onPress={() => copyText(codePayment)}>
                            <Text style={styles.codePayment}>{codePayment}</Text>
                        </TouchableOpacity>

                        <Text style={styles.textInfoPayment}>Thông tin chuyển khoản</Text>
                        <Text onPress={() => copyText('0011004289063')}>
                            <Text style={styles.textTitlePayment}>STK:</Text> 0011004289063
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Ngân hàng:</Text> Vietcombank
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Chủ thẻ:</Text> Nguyễn Văn Long
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Số tiền:</Text> {formatPrice(total)}
                        </Text>

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closePayment} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                ) : (
                    <Fragment>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={itemSeparatorComponent}
                            automaticallyAdjustContentInsets
                            data={type === 'song_demos' ? songsDemo : songs}
                            renderItem={renderItem}
                        />

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closeModal} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBuy} style={[styles.buttonActions, styles.buttonSuccess]}>
                                <Text style={styles.textButtonActions}>Thanh toán</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    styleModal: { margin: 0, alignItems: 'center' },
    viewContent: {
        width: width / 1.2,
        backgroundColor: Colors.white,
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
        maxHeight: height / 2,
    },
    itemSeparatorComponent: { height: 10 },
    viewActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 },
    buttonActions: { backgroundColor: Colors.danger, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5 },
    textButtonActions: { fontSize: 14, fontWeight: '600', color: Colors.white },
    buttonSuccess: { backgroundColor: '#28a745' },
    codePayment: { fontWeight: '500', color: Colors.primary },
    textInfoPayment: { marginTop: 10, fontSize: 17 },
    textTitlePayment: { fontWeight: '500', color: Colors.darkorange },
});

export default memo(ModalBuyMore);
