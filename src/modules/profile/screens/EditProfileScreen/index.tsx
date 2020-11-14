/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, memo, useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    ImageSourcePropType,
    Platform,
    Alert,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePicker, { ImagePickerOptions } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';

import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';
import { RootState } from 'store';
import { User } from 'types/Auth/AuthResponse';
import { actions as actionsAuth } from 'modules/auth/store';
import LoadingOverley from 'components/LoadingOverley';

interface IProps {
    navigation: NavigationProp<any>;
}

const options: ImagePickerOptions = {
    title: 'Change profile photo',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take photo',
    chooseFromLibraryButtonTitle: 'Choose from library',
    mediaType: 'photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const EditProfileScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector<RootState, User>(state => state.auth.user);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const [name, setName] = useState<string>(user.info.fullname);
    const [sourceImage, setSourceImage] = useState<ImageSourcePropType>();
    const [loading, setLoading] = useState<boolean>(false);

    const { top } = useSafeAreaInsets();

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('dark-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const showImagePicker = useCallback(() => {
        ImagePicker.showImagePicker(options, async response => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setSourceImage(source);
                setLoading(true);
                try {
                    await dispatch<any>(
                        actionsAuth.updateAvatar({
                            uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri,
                            size: response.fileSize,
                            height: response.height,
                            width: response.width,
                            type: response.type,
                            name: response.fileName ? response.fileName : `${user.info.uuid}.png`,
                        }),
                    ).then(unwrapResult);
                    debounce(() => Alert.alert('Thông báo', 'Chỉnh sửa ảnh thành công'), 500)();
                } catch {
                    debounce(() => Alert.alert('Thông báo', 'Chỉnh sửa ảnh lỗi'), 500)();
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [dispatch, user]);

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

    return (
        <Fragment>
            <LoadingOverley visible={loading} />

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
