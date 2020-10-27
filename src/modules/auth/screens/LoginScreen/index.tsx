import { useFormik } from 'formik';
import React, { FC, memo, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { unwrapResult } from '@reduxjs/toolkit';

import { Colors } from 'styles/global.style';
import { actions as actionsAuth } from '../../store';
import { RootState } from 'store';

const validationSchema = Yup.object({
    username: Yup.string().required('Vui lòng nhập email hoặc username'),
    password: Yup.string().required('Vui lòng nhập mật khẩu ').min(6, 'Mật khẩu phải lớn hơn 6 ký tự'),
});

const initialValues = { username: '', password: '' };

interface IProps {
    navigation: NavigationProp<any>;
}

const LoginScreen: FC<IProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);

    const [loading, setLoading] = useState<boolean>(false);

    const refInputPassword = useRef<Input>();
    const { top } = useSafeAreaInsets();
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    useEffect(() => {
        !!isLogin && navigation.navigate('BottomTab');
    }, [isLogin, navigation]);

    const onSubmitForm = useCallback(
        async valuesForm => {
            setLoading(true);
            try {
                await dispatch<any>(actionsAuth.login(valuesForm)).then(unwrapResult);
                navigation.goBack();
            } catch {
                debounce(() => Alert.alert('Thông báo', 'Đăng nhập lỗi!'), 500)();
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

    const goToForgetPassword = useCallback(() => {
        navigation.navigate('RegisterScreen');
    }, [navigation]);

    const onSubmitEditingEmail = useCallback(() => {
        refInputPassword.current?.focus();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <Input
                autoFocus
                returnKeyType="next"
                autoCapitalize="none"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                selectionColor={Colors.subtle}
                style={styles.viewInput}
                label="Username"
                errorStyle={styles.errorStyle}
                labelStyle={styles.labelStyle}
                errorMessage={errors.username ? errors.username : undefined}
                onSubmitEditing={onSubmitEditingEmail}
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
                onSubmitEditing={submitForm}
                errorMessage={errors.password ? errors.password : undefined}
            />

            <Button
                loading={loading}
                title="Đăng nhập"
                containerStyle={styles.buttonLogin}
                disabled={!values.username || Object.keys(errors).length > 0}
                onPress={submitForm}
                titleStyle={styles.titleStyleButton}
            />

            <View style={styles.viewForgetPassword}>
                <Button
                    type="clear"
                    title="Đăng ký tài khoản"
                    onPress={goToForgetPassword}
                    titleStyle={styles.textForgetPassword}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, backgroundColor: Colors.white },
    buttonLogin: { width: '100%', marginTop: 17 },
    viewInput: { fontSize: 15, color: Colors.subtle },
    viewForgetPassword: { width: '100%', alignItems: 'flex-end', marginTop: 20 },
    textForgetPassword: { color: Colors.subtle, fontSize: 15 },
    errorStyle: { color: Colors.danger, fontSize: 13 },
    labelStyle: { color: Colors.subtle, fontSize: 14, fontWeight: '500' },
    titleStyleButton: { fontSize: 15, fontWeight: '600' },
    viewFaceId: { marginTop: 20, alignItems: 'center' },
});

export default memo(LoginScreen);
