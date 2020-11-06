import { LoginInReponse } from './../../../types/Auth/AuthResponse';
import AsyncStorage from '@react-native-community/async-storage';

import { apiAxios, setHeaders } from 'store/axios';
import { LoginRequest, RegisterRequest } from 'types/Auth/AuthRequest';
import { RegisterResult, User, LoginResult, Info } from 'types/Auth/AuthResponse';
import { UpdateProfileRequest } from 'types/Profile/ProfileRequest';
import { ChangeAvatarResponse, ChangePasswordResponse, UserInfoResponse } from 'types/Profile/ProfileResponse';

export const register = (body: RegisterRequest): Promise<User> =>
    apiAxios.post<RegisterResult>('user/register', body).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });

export const login = (body: LoginRequest): Promise<LoginInReponse> =>
    apiAxios.post<LoginResult>('user/authenticate', body).then(res => {
        if (res.data.message === 'success') {
            AsyncStorage.setItem('token', res.data.data.jwttoken);
            setHeaders({ token: res.data.data.jwttoken });
            return res.data.data;
        }

        return Promise.reject();
    });

export const checkLoginAccount = () =>
    AsyncStorage.getItem('token').then(token => {
        token && setHeaders({ token: token });
        return token;
    });

export const updateProfile = (body: UpdateProfileRequest): Promise<Info> =>
    apiAxios.post<ChangeAvatarResponse>('user/update-info', body).then(res => {
        if (res.data.message === 'success') {
            return getUserInfo();
        }

        return Promise.reject();
    });

export const updateAvatar = (file: any): Promise<string> => {
    let formData = new FormData();
    formData.append('file', file);

    return apiAxios
        .post<ChangeAvatarResponse>('util/avatar/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
            if (res.data.message === 'success') {
                return res.data.data;
            }

            return Promise.reject();
        });
};

export const getUserInfo = (): Promise<Info> =>
    apiAxios.get<UserInfoResponse>('user/info').then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });

export const forgetPassword = (email: string) =>
    apiAxios.get<ChangeAvatarResponse>(`user/forget/sendemail/${email}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });

export const changePassword = (body: { password: string; oldPassword: string }): Promise<User> =>
    apiAxios.post<ChangePasswordResponse>('user/update-password', body).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
