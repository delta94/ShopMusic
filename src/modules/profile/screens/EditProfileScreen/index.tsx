/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, memo, useCallback, useState } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePicker, { ImagePickerOptions } from 'react-native-image-picker';

import { useIOS13 } from 'hooks/useIOS13';
import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';

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
    const [name, setName] = useState<string>('Ngô Ngọc Đạt');
    const [sourceImage, setSourceImage] = useState<ImageSourcePropType>();
    const { top } = useSafeAreaInsets();
    const isIOS13 = useIOS13();

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('dark-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const showImagePicker = useCallback(() => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setSourceImage(source);
            }
        });
    }, []);

    return (
        <Fragment>
            {isIOS13 && (
                <View style={styles.viewHeader}>
                    <Button
                        onPress={navigation.goBack}
                        type="clear"
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.titleStyle}
                        title="Cancel"
                    />
                    <Text style={styles.textEdit}>Edit Profile</Text>
                    <Button
                        disabled={!name}
                        type="clear"
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.titleStyle}
                        title="Save"
                    />
                </View>
            )}

            <View style={[styles.viewContent, { paddingTop: isIOS13 ? 0 : top }]}>
                <TouchableOpacity activeOpacity={1} onPress={showImagePicker}>
                    <ImageCustom
                        source={
                            sourceImage
                                ? sourceImage
                                : {
                                      uri:
                                          'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
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
    titleStyle: { fontSize: 12, color: Colors.subtle },
    buttonStyle: { paddingHorizontal: 0, paddingVertical: 0 },
    textEdit: { fontSize: 15, fontWeight: '500' },
    viewContent: { flex: 1, marginTop: 20, alignItems: 'center' },
    image: { width: 200, height: 200, borderRadius: 200 / 2 },
    textChangePhoto: { textTransform: 'uppercase', fontSize: 13, fontWeight: '500' },
    viewChangePhoto: { marginTop: 10 },
    styleInput: { marginTop: 50, textAlign: 'center', fontSize: 40, fontWeight: '700', fontFamily: 'System' },
});

export default memo(EditProfileScreen);
