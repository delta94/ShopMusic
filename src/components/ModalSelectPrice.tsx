import React, { FC, memo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from 'styles/global.style';
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsHome } from 'modules/home/store';
import { RootState } from 'store';

const { width } = Dimensions.get('window');

interface IProps {
    uuid: string;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSelectPrice: FC<IProps> = ({ uuid, isVisible, setIsVisible }) => {
    const dispatch = useDispatch();
    const detailSong = useSelector<RootState, Song>(state => state.home.detailSong);

    const getDetailSong = useCallback(() => {
        !!isVisible && dispatch(actionsHome.getDetailSong(uuid));
    }, [dispatch, isVisible, uuid]);

    useEffect(() => {
        getDetailSong();
    }, [getDetailSong]);

    const closeModal = useCallback(() => {
        setIsVisible(false);
    }, [setIsVisible]);

    return (
        <Modal
            useNativeDriver
            backdropColor="rgba(0,0,0,.5)"
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={styles.styleModal}
            isVisible={isVisible}>
            <View style={styles.viewContent}>
                <Text style={styles.textHeader}>Chọn thời lượng mua nhạc:</Text>

                <DropDownPicker
                    items={[
                        { label: '1 phút', value: '1' },
                        { label: '2 phút', value: '2' },
                        { label: '3 phút', value: '3' },
                        { label: '4 phút', value: '4' },
                        { label: '5 phút', value: '5' },
                        { label: '6 phút', value: '6' },
                    ]}
                    defaultValue="1"
                    autoScrollToDefaultValue
                    containerStyle={styles.containerStyleSlect}
                    itemStyle={styles.itemStyle}
                    // style={styles.dropDownPicker}
                />

                <View style={styles.viewActions}>
                    <TouchableOpacity onPress={closeModal} style={styles.buttonActions}>
                        <Text style={styles.textButtonActions}>Đóng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonActions, styles.buttonSuccess]}>
                        <Text style={styles.textButtonActions}>Thanh toán</Text>
                    </TouchableOpacity>
                </View>
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
});

export default memo(ModalSelectPrice);
