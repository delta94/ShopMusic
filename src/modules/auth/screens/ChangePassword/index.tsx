import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { FC, Fragment, memo, MutableRefObject, useCallback, useRef, useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { unwrapResult } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Colors } from 'styles/global.style';
import { actions as authActions } from '../../store';
import ImageCustom from 'components/ImageCustom';

const validationSchema = Yup.object({
    password: Yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải lớn hơn 6 ký tự'),
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải lớn hơn 6 ký tự'),
});

const initialValues = { oldPassword: '', password: '' };

interface IProps {
    navigation: NavigationProp<any>;
}

const ChangePasswordScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const refInputPassword = useRef<Input>();
    const { top } = useSafeAreaInsets();

    const [secureTextPasswordNew, setSecureTextPasswordNew] = useState<boolean>(true);
    const [secureTextPassword, setSecureTextPassword] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    const onSubmitForm = useCallback(
        async valuesForm => {
            try {
                setLoading(true);
                await dispatch<any>(authActions.changePassword(valuesForm)).then(unwrapResult);
                navigation.goBack();
                debounce(() => Alert.alert('Thông báo', 'Cập nhập mật khẩu thành công!'), 500)();
            } catch (error) {
                debounce(() => Alert.alert('Thông báo', 'Cập nhập mật khẩu không thành công!'), 500)();
            } finally {
                setLoading(false);
            }
        },
        [dispatch, navigation],
    );

    const { submitForm, handleBlur, handleChange, errors, values } = useFormik<typeof initialValues>({
        initialValues,
        validationSchema,
        onSubmit: onSubmitForm,
    });

    const toggleSecureEntry = useCallback(() => {
        setSecureTextPasswordNew(!secureTextPasswordNew);
    }, [secureTextPasswordNew]);

    const toggleSecurePasswordNew = useCallback(() => {
        setSecureTextPassword(!secureTextPassword);
    }, [secureTextPassword]);

    return (
        <Fragment>
            <ImageCustom source={require('assets/images/background.jpg')} resizeMode="cover" style={styles.imageView} />
            <TouchableOpacity onPress={navigation.goBack} style={styles.iconBack}>
                <Icon type="ant-design" name="leftcircle" color={Colors.white} size={35} />
            </TouchableOpacity>
            <Text style={styles.textTitle}>Đổi mật khẩu</Text>

            <KeyboardAwareScrollView style={[styles.container]}>
                <Input
                    autoFocus
                    returnKeyType="next"
                    autoCapitalize="none"
                    value={values.oldPassword}
                    onChangeText={handleChange('oldPassword')}
                    onBlur={handleBlur('oldPassword')}
                    selectionColor={Colors.subtle}
                    secureTextEntry={secureTextPassword}
                    style={styles.viewInput}
                    label="Mật khẩu cũ"
                    errorStyle={styles.errorStyle}
                    labelStyle={styles.labelStyle}
                    errorMessage={errors.oldPassword ? errors.oldPassword : undefined}
                    rightIcon={
                        <TouchableOpacity onPress={toggleSecurePasswordNew}>
                            <Icon
                                type="ionicon"
                                size={20}
                                color={Colors.subtle}
                                name={secureTextPassword ? 'eye-off' : 'eye'}
                            />
                        </TouchableOpacity>
                    }
                />

                <Input
                    ref={refInputPassword as MutableRefObject<Input>}
                    value={values.password}
                    secureTextEntry={secureTextPasswordNew}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    selectionColor={Colors.subtle}
                    style={styles.viewInput}
                    label="Mật khẩu mới"
                    rightIcon={
                        <TouchableOpacity onPress={toggleSecureEntry}>
                            <Icon
                                type="ionicon"
                                size={20}
                                color={Colors.subtle}
                                name={secureTextPasswordNew ? 'eye-off' : 'eye'}
                            />
                        </TouchableOpacity>
                    }
                    labelStyle={styles.labelStyle}
                    errorStyle={styles.errorStyle}
                    onSubmitEditing={submitForm}
                    errorMessage={errors.password ? errors.password : undefined}
                />

                <Button
                    TouchableComponent={TouchableOpacity}
                    loading={loading}
                    title="Đổi mật khẩu"
                    containerStyle={styles.buttonLogin}
                    disabled={!values.oldPassword || Object.keys(errors).length > 0}
                    onPress={submitForm}
                    titleStyle={styles.titleStyleButton}
                />
            </KeyboardAwareScrollView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, backgroundColor: Colors.white, paddingTop: 20 },
    buttonLogin: { width: '100%', marginTop: 17 },
    viewInput: { fontSize: 15, color: Colors.subtle },
    viewForgetPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textForgetPassword: { color: Colors.subtle, fontSize: 15 },
    errorStyle: { color: Colors.danger, fontSize: 13 },
    labelStyle: { color: Colors.subtle, fontSize: 14, fontWeight: '500' },
    titleStyleButton: { fontSize: 15, fontWeight: '600' },
    viewFaceId: { marginTop: 20, alignItems: 'center' },
    viewPassword: { width: '100%', alignItems: 'flex-end', marginTop: 0 },
    imageView: { height: 200 },
    textTitle: { position: 'absolute', color: Colors.white, top: 50, right: 10, fontSize: 20, fontWeight: 'bold' },
    iconBack: { position: 'absolute', left: 15, top: 50 },
});
export default memo(ChangePasswordScreen);
