import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, memo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';

interface IProps {
    navigation: NavigationProp<any>;
}

const ProfileScreen: FC<IProps> = ({ navigation }) => {
    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const goToEditProfilel = useCallback(() => {
        navigation.navigate('EditProfileScreen');
    }, [navigation]);

    return (
        <Fragment>
            <ImageBackground
                style={styles.container}
                blurRadius={100}
                source={{
                    uri:
                        'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
                }}>
                <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                    <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
                </TouchableOpacity>

                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets>
                    <View style={styles.viewImage}>
                        <ImageCustom
                            source={{
                                uri:
                                    'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
                            }}
                            resizeMode="cover"
                            style={styles.image}
                        />

                        <Text style={styles.textName}>Ngô Ngọc Đạt</Text>

                        <TouchableOpacity onPress={goToEditProfilel} style={styles.viewEditProfile}>
                            <Text style={styles.textEditProfile}>EDIT PROFILE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { width: 100, height: 100, borderRadius: 100 / 2 },
    viewImage: { alignItems: 'center' },
    textName: { fontSize: 22, fontWeight: '800', fontFamily: 'System', marginTop: 15, color: Colors.white },
    scrollView: { paddingTop: 100 },
    iconBack: { position: 'absolute', left: 15, top: 50, zIndex: 2 },
    viewEditProfile: {
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,.08)',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    textEditProfile: { color: Colors.white, textTransform: 'uppercase', fontSize: 12, fontWeight: '700' },
});

export default memo(ProfileScreen);
