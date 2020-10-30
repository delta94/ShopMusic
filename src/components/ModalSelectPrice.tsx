import React, { FC, Fragment, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import range from 'lodash/range';
import { unwrapResult } from '@reduxjs/toolkit';
import Clipboard from '@react-native-community/clipboard';
import debounce from 'lodash/debounce';
import RNPickerSelect, { Item } from 'react-native-picker-select';

import { Colors } from 'styles/global.style';
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsHome } from 'modules/home/store';
import { RootState } from 'store';
import { formatPrice } from 'utils/customs/formatPrice';

const { width } = Dimensions.get('window');

interface IProps {
    uuid: string;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSelectPrice: FC<IProps> = ({ uuid, isVisible, setIsVisible }) => {
    const refPicker = useRef<RNPickerSelect>();
    const dispatch = useDispatch();
    const detailSong = useSelector<RootState, Song>(state => state.home.detailSong);

    const [time, setTime] = useState<number>(0);
    const [codePayment, setCodePayment] = useState<string>('');

    const getDetailSong = useCallback(() => {
        !!isVisible && dispatch(actionsHome.getDetailSong(uuid));
    }, [dispatch, isVisible, uuid]);

    useEffect(() => {
        getDetailSong();
    }, [getDetailSong]);

    useEffect(() => {
        if (!isVisible) {
            setTime(0);
            setCodePayment('');
        }
    }, [isVisible]);

    const closeModal = useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    const times = useMemo<Item[]>(
        () =>
            (Object.keys(detailSong).length > 0 ? range(Math.ceil(detailSong.time / 60)) : []).map(item => ({
                label: `${item + 1} phút (${formatPrice((item + 1) * detailSong.cost)})`,
                value: item + 1,
            })),
        [detailSong],
    );

    const onValueChange = useCallback((value: number) => {
        setTime(Number(value));
    }, []);

    const handleBuy = useCallback(async () => {
        try {
            const res = await dispatch<any>(
                actionsHome.buySong({
                    time: time * 60,
                    cost: detailSong.cost,
                    uuid: detailSong.parent ? detailSong.parent : detailSong.uuid,
                }),
            ).then(unwrapResult);

            setCodePayment(res);
        } catch (error) {
            Alert.alert('Thông báo', 'Cõ lỗi xảy ra!');
        }
    }, [detailSong, dispatch, time]);

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

    const toggePicker = useCallback(() => {
        refPicker.current?.togglePicker();
    }, []);

    return (
        <Modal
            useNativeDriver
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
                        <Text>
                            <Text style={styles.textTitlePayment}>STK:</Text> 01234567890
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Ngân hàng:</Text> Techcombank
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Chủ thẻ:</Text> Nguyễn Văn A
                        </Text>
                        <Text>
                            <Text style={styles.textTitlePayment}>Số tiền:</Text> {formatPrice(time * detailSong.cost)}
                        </Text>

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closePayment} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Text style={styles.textHeader}>Chọn thời lượng mua nhạc:</Text>

                        <TouchableOpacity activeOpacity={1} onPress={toggePicker} style={styles.dropdown}>
                            <RNPickerSelect
                                ref={refPicker as MutableRefObject<RNPickerSelect>}
                                placeholder={{ label: 'Chọn thời gian mua' }}
                                useNativeAndroidPickerStyle
                                style={{ inputAndroid: { color: Colors.black } }}
                                value={time}
                                onValueChange={onValueChange}
                                items={times}
                            />
                        </TouchableOpacity>

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closeModal} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleBuy}
                                disabled={!time}
                                style={[styles.buttonActions, styles.buttonSuccess]}>
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
    },
    itemStyle: { justifyContent: 'flex-start' },
    containerStyleSlect: { height: 40, marginTop: 10 },
    textHeader: { fontSize: 14, fontWeight: '500' },
    viewActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 },
    buttonActions: { backgroundColor: Colors.danger, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5 },
    textButtonActions: { fontSize: 14, fontWeight: '600', color: Colors.white },
    buttonSuccess: { backgroundColor: '#28a745' },
    codePayment: { fontWeight: '500', color: Colors.primary },
    textInfoPayment: { marginTop: 10, fontSize: 17 },
    textTitlePayment: { fontWeight: '500', color: Colors.darkorange },
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

export default memo(ModalSelectPrice);
