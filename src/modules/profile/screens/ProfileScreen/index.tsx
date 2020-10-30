import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import React, { FC, Fragment, memo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

import { Colors } from 'styles/global.style';
import ImageCustom from 'components/ImageCustom';
import { actions as actionsAuth } from 'modules/auth/store';
import { RootState } from 'store';
import { User } from 'types/Auth/AuthResponse';

interface IProps {
    navigation: NavigationProp<any>;
}

const ProfileScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector<RootState, User>(state => state.auth.user);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const goToEditProfilel = useCallback(() => {
        navigation.navigate('EditProfileScreen');
    }, [navigation]);

    const handleLogout = useCallback(() => {
        dispatch(actionsAuth.setLogin(false));
        navigation.goBack();
    }, [dispatch, navigation]);

    return (
        <FastImage
            style={styles.container}
            source={{
                uri: isLogin
                    ? user.info.avatar
                    : 'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
            }}>
            <Fragment>
                <View style={styles.viewOverley} />

                <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                    <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogout} style={styles.viewLogout}>
                    <Icon type="material-icon" name="logout" color={Colors.white} size={35} />
                </TouchableOpacity>

                <ScrollView style={styles.scrollView} automaticallyAdjustContentInsets>
                    <View style={styles.viewImage}>
                        <ImageCustom
                            source={{
                                uri: isLogin
                                    ? user.info.avatar
                                    : 'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/2/c/a/a/2caa245f831832e8c1a2bcbc9f7673ba.jpg',
                            }}
                            resizeMode="cover"
                            style={styles.image}
                        />

                        <Text style={styles.textName}>{user.info.fullname}</Text>

                        <TouchableOpacity onPress={goToEditProfilel} style={styles.viewEditProfile}>
                            <Text style={styles.textEditProfile}>EDIT PROFILE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Fragment>
        </FastImage>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', height: '100%' },
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
    viewLogout: {
        position: 'absolute',
        right: 15,
        top: 50,
        zIndex: 2,
    },
    viewOverley: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.7)' },
});

export default memo(ProfileScreen);
