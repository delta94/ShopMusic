import React, { FC, Fragment, memo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import Clipboard from '@react-native-community/clipboard';
import debounce from 'lodash/debounce';

import { Colors } from 'styles/global.style';
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsHome } from 'modules/home/store';
import { RootState } from 'store';
import { formatPrice } from 'utils/customs/formatPrice';
import { Input } from 'react-native-elements';

const { width } = Dimensions.get('window');

interface IProps {
    uuid: string;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSelectPrice: FC<IProps> = ({ uuid, isVisible, setIsVisible }) => {
    const dispatch = useDispatch();
    const detailSong = useSelector<RootState, Song>(state => state.home.detailSong);

    const [time, setTime] = useState<string>('');
    const [codePayment, setCodePayment] = useState<string>('');

    const getDetailSong = useCallback(() => {
        !!isVisible && dispatch(actionsHome.getDetailSong(uuid));
    }, [dispatch, isVisible, uuid]);

    useEffect(() => {
        getDetailSong();
    }, [getDetailSong]);

    useEffect(() => {
        if (!isVisible) {
            setTime('');
            setCodePayment('');
        }
    }, [isVisible]);

    const closeModal = useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    const handleBuy = useCallback(async () => {
        try {
            const res = await dispatch<any>(
                actionsHome.buySong({
                    time: Number(time) * 60,
                    cost: detailSong.cost * Number(time),
                    uuid: detailSong.uuid,
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

    return (
        <Modal
            backdropColor="rgba(0,0,0,.5)"
            animationIn="fadeIn"
            animationOut="fadeOut"
            avoidKeyboard
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
                            <Text style={styles.textTitlePayment}>Số tiền:</Text>{' '}
                            {formatPrice(Number(time) * detailSong.cost)}
                        </Text>

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closePayment} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Input
                            labelStyle={styles.labelStyle}
                            label={`${detailSong.title} - ${formatPrice(detailSong.cost)}/phút`}
                            returnKeyType="done"
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            selectionColor={Colors.subtle}
                            value={time}
                            onChangeText={setTime}
                            style={styles.viewInput}
                            placeholder="Nhập thời gian mua (phút)"
                        />

                        <View style={styles.viewActions}>
                            <TouchableOpacity onPress={closeModal} style={styles.buttonActions}>
                                <Text style={styles.textButtonActions}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleBuy}
                                disabled={!time}
                                style={[styles.buttonActions, styles.buttonSuccess]}>
                                <Text style={styles.textButtonActions}>
                                    Thanh toán {!!time && formatPrice(Number(time) * detailSong.cost)}
                                </Text>
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
        width: width / 1.1,
        backgroundColor: Colors.white,
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    itemStyle: { justifyContent: 'flex-start' },
    containerStyleSlect: { height: 40, marginTop: 10 },
    textHeader: { fontSize: 14, fontWeight: '500' },
    viewActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 },
    buttonActions: { backgroundColor: Colors.danger, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5 },
    textButtonActions: { fontSize: 14, fontWeight: '600', color: Colors.white },
    buttonSuccess: { backgroundColor: '#28a745' },
    codePayment: { fontWeight: '500', color: Colors.primary },
    textInfoPayment: { marginTop: 10, fontSize: 17 },
    textTitlePayment: { fontWeight: '500', color: Colors.darkorange },
    viewInput: { fontSize: 15, color: Colors.subtle },
    labelStyle: { color: Colors.subtle, fontSize: 14, fontWeight: '500' },
});

export default memo(ModalSelectPrice);
