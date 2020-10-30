import { useFormik } from 'formik';
import React, { FC, memo, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { unwrapResult } from '@reduxjs/toolkit';

import { Colors } from 'styles/global.style';
import { actions as actionsAuth } from '../../store';
import { RootState } from 'store';

const validationSchema = Yup.object({
    email: Yup.string().required('Vui lòng nhập email'),
    password: Yup.string().required('Vui lòng nhập mật khẩu ').min(6, 'Mật khẩu phải lớn hơn 6 ký tự'),
    password_confirm: Yup.string()
        .required('Vui lòng nhập mật khẩu xác nhận')
        .min(6, 'Mật khẩu xác nhận phải lớn hơn 6 ký tự')
        .oneOf([Yup.ref('password'), ''], 'Mật khẩu phải trùng nhau'),
    name: Yup.string().required('Vui lòng nhập họ và tên'),
});

const initialValues = { email: '', password: '', password_confirm: '', name: '' };

interface IProps {
    navigation: NavigationProp<any>;
}

const RegisterScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { top } = useSafeAreaInsets();
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const refInputPassword = useRef<Input>();
    const refInputName = useRef<Input>();
    const refInputConfirmPass = useRef<Input>();

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    const changeStatusBar = useCallback(() => {
        StatusBar.setBarStyle('light-content', true);
    }, []);

    useFocusEffect(changeStatusBar);

    useEffect(() => {
        !!isLogin && navigation.navigate('BottomTab');
    }, [isLogin, navigation]);

    const onSubmitForm = useCallback(
        async (valuesForm: typeof initialValues) => {
            setLoading(true);
            try {
                await dispatch<any>(
                    actionsAuth.register({
                        account: valuesForm.email,
                        password: valuesForm.password,
                        info: { fullname: valuesForm.name },
                    }),
                ).then(unwrapResult);
                debounce(() => Alert.alert('Thông báo', 'Đăng ký thành công!'), 500)();
                navigation.goBack();
            } catch {
                debounce(() => Alert.alert('Thông báo', 'Đăng ký lỗi!'), 500)();
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
        setSecureTextEntry(!secureTextEntry);
    }, [secureTextEntry]);

    const toggleSecureEntryConfirm = useCallback(() => {
        setSecureTextEntryConfirm(!secureTextEntryConfirm);
    }, [secureTextEntryConfirm]);

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <Input
                autoFocus
                returnKeyType="next"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                selectionColor={Colors.subtle}
                style={styles.viewInput}
                label="Username"
                errorStyle={styles.errorStyle}
                labelStyle={styles.labelStyle}
                errorMessage={errors.email ? errors.email : undefined}
                onSubmitEditing={() => refInputName.current?.focus()}
            />

            <Input
                ref={refInputName as MutableRefObject<Input>}
                returnKeyType="next"
                autoCapitalize="none"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                selectionColor={Colors.subtle}
                style={styles.viewInput}
                label="Họ và tên"
                errorStyle={styles.errorStyle}
                labelStyle={styles.labelStyle}
                errorMessage={errors.name ? errors.name : undefined}
                onSubmitEditing={() => refInputPassword.current?.focus()}
            />

            <Input
                ref={refInputPassword as MutableRefObject<Input>}
                value={values.password}
                secureTextEntry={secureTextEntry}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                selectionColor={Colors.subtle}
                style={styles.viewInput}
                label="Password"
                rightIcon={
                    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
                        <Icon
                            type="ionicon"
                            size={20}
                            color={Colors.subtle}
                            name={secureTextEntry ? 'eye-off' : 'eye'}
                        />
                    </TouchableWithoutFeedback>
                }
                labelStyle={styles.labelStyle}
                errorStyle={styles.errorStyle}
                onSubmitEditing={() => refInputConfirmPass.current?.focus()}
                errorMessage={errors.password ? errors.password : undefined}
            />

            <Input
                ref={refInputConfirmPass as MutableRefObject<Input>}
                value={values.password_confirm}
                secureTextEntry={secureTextEntryConfirm}
                onChangeText={handleChange('password_confirm')}
                onBlur={handleBlur('password_confirm')}
                selectionColor={Colors.subtle}
                style={styles.viewInput}
                label="Xác nhận lại mật khẩu"
                rightIcon={
                    <TouchableWithoutFeedback onPress={toggleSecureEntryConfirm}>
                        <Icon
                            type="ionicon"
                            size={20}
                            color={Colors.subtle}
                            name={secureTextEntryConfirm ? 'eye-off' : 'eye'}
                        />
                    </TouchableWithoutFeedback>
                }
                labelStyle={styles.labelStyle}
                errorStyle={styles.errorStyle}
                onSubmitEditing={submitForm}
                errorMessage={errors.password_confirm ? errors.password_confirm : undefined}
            />

            <Button
                loading={loading}
                title="Đăng ký"
                containerStyle={styles.buttonLogin}
                disabled={!values.email || Object.keys(errors).length > 0}
                onPress={submitForm}
                titleStyle={styles.titleStyleButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: Colors.white },
    buttonLogin: { width: '100%', marginTop: 17 },
    viewInput: { fontSize: 15, color: Colors.subtle },
    errorStyle: { color: Colors.danger, fontSize: 13 },
    labelStyle: { color: Colors.subtle, fontSize: 14, fontWeight: '500' },
    titleStyleButton: { fontSize: 15, fontWeight: '600' },
    viewFaceId: { marginTop: 20, alignItems: 'center' },
});

export default memo(RegisterScreen);
