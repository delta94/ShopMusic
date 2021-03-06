/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, memo, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';
import ImagePicker, { Options, Image } from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';
import { RootState } from 'store';
import { User } from 'types/Auth/AuthResponse';
import { actions as actionsAuth } from 'modules/auth/store';
import LoadingOverley from 'components/LoadingOverley';

interface IProps {
    navigation: NavigationProp<any>;
}

const EditProfileScreen: FC<IProps> = ({ navigation }) => {
    const refActionSheet = useRef<ActionSheet>();
    const dispatch = useDispatch();
    const user = useSelector<RootState, User>(state => state.auth.user);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const [name, setName] = useState<string>('');
    const [sourceImage, setSourceImage] = useState<ImageSourcePropType>();
    const [loading, setLoading] = useState<boolean>(false);

    const { top } = useSafeAreaInsets();

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('dark-content', true);
    }, []);

    useEffect(() => {
        setName(user.info.fullname);
    }, [user]);

    useFocusEffect(changeStatusBar);

    const updateAvatar = useCallback(
        async (response: Image) => {
            setLoading(true);
            try {
                const res = await dispatch<any>(
                    actionsAuth.updateAvatar({
                        uri: response.path,
                        height: response.height,
                        width: response.width,
                        size: response.size,
                        type: response.mime,
                        name: response.filename ? response.filename : `${user.info.uuid}.png`,
                    }),
                ).then(unwrapResult);
                setSourceImage({ uri: res.avatar });
            } catch {
                debounce(() => Alert.alert('Thông báo', 'Chỉnh sửa ảnh lỗi'), 500)();
            } finally {
                setLoading(false);
            }
        },
        [dispatch, user],
    );

    const handlePress = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch<any>(actionsAuth.updateProfile({ ...user.info, fullname: name })).then(unwrapResult);
            debounce(() => Alert.alert('Thông báo', 'Cập nhật profile thành công'), 500)();
        } catch {
            debounce(() => Alert.alert('Thông báo', 'Cập nhật profile lỗi'), 500)();
        } finally {
            setLoading(false);
        }
    }, [dispatch, name, user.info]);

    const headerRight = useCallback(
        () => (
            <Button
                TouchableComponent={TouchableOpacity}
                disabled={!name}
                type="clear"
                onPress={handlePress}
                buttonStyle={styles.buttonStyle}
                titleStyle={styles.titleStyle}
                title="Save"
            />
        ),
        [handlePress, name],
    );

    useEffect(() => {
        navigation.setOptions({ headerRight });
    }, [headerRight, navigation]);

    const onSelectAction = useCallback(
        (index: number) => {
            const options: Options = {
                mediaType: 'photo',
                useFrontCamera: true,
                cropperCircleOverlay: true,
                cropping: true,
                avoidEmptySpaceAroundImage: true,
                cropperToolbarTitle: 'Thay đổi avatar',
                loadingLabelText: 'Loading...',
                cropperCancelText: 'Đóng',
                cropperChooseText: 'Chọn',
                compressImageQuality: 0.7,
            };

            if (index === 0) {
                ImagePicker.openCamera(options).then(async response => {
                    updateAvatar(response);
                });
            } else if (index === 1) {
                ImagePicker.openPicker(options).then(async response => {
                    updateAvatar(response);
                });
            }
        },
        [updateAvatar],
    );

    const showImagePicker = useCallback(() => {
        refActionSheet.current?.show();
    }, []);

    return (
        <Fragment>
            <LoadingOverley visible={loading} />

            <ActionSheet
                ref={refActionSheet as MutableRefObject<ActionSheet>}
                title="Đỏi avatar"
                options={['Chụp ảnh', 'Lấy ảnh từ thư viện', 'Cancel']}
                cancelButtonIndex={2}
                onPress={onSelectAction}
            />

            <View style={[styles.viewContent, { paddingTop: top }]}>
                <TouchableOpacity activeOpacity={1} onPress={showImagePicker}>
                    <ImageCustom
                        source={
                            sourceImage
                                ? sourceImage
                                : {
                                      uri: isLogin
                                          ? user.info.avatar
                                          : 'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
                                  }
                        }
                        resizeMode="cover"
                        style={styles.image}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={showImagePicker} style={styles.viewChangePhoto}>
                    <Text style={styles.textChangePhoto}>Change photo</Text>
                </TouchableOpacity>

                <Input
                    style={styles.styleInput}
                    selectionColor={Colors.subtle}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    viewHeader: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#d6d6d6',
        borderBottomWidth: 0.5,
    },
    titleStyle: { fontSize: 14, color: Colors.subtle },
    buttonStyle: { paddingHorizontal: 0, paddingVertical: 0 },
    textEdit: { fontSize: 15, fontWeight: '500' },
    viewContent: { flex: 1, marginTop: 20, alignItems: 'center' },
    image: { width: 200, height: 200, borderRadius: 200 / 2 },
    textChangePhoto: { textTransform: 'uppercase', fontSize: 13, fontWeight: '500' },
    viewChangePhoto: { marginTop: 10 },
    styleInput: { marginTop: 50, textAlign: 'center', fontSize: 40, fontWeight: '700', fontFamily: 'System' },
});

export default memo(EditProfileScreen);
