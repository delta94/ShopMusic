import { createAsyncThunk } from '@reduxjs/toolkit';

import * as services from './services';
import { LoginInReponse, User } from 'types/Auth/AuthResponse';
import { RegisterRequest, LoginRequest } from 'types/Auth/AuthRequest';
import { RootState } from 'store';

export const register = createAsyncThunk<User, RegisterRequest>('auth/register', (body: RegisterRequest) =>
    services.register(body),
);

export const login = createAsyncThunk<LoginInReponse, LoginRequest>('auth/login', services.login);

export const checkLoginAccount = createAsyncThunk('auth/checkLoginAccount', services.checkLoginAccount);

export const updateAvatar = createAsyncThunk('profile/updateAvatar', async (file: any, thunkApi) => {
    const state: RootState = thunkApi.getState();

    try {
        const urlAvatar = await services.updateAvatar(file);
        const { fullname, bod, gender } = state.auth.user.info;
        return services.updateProfile({ fullname, bod, gender, avatar: urlAvatar });
    } catch (error) {
        return Promise.reject(error);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', services.updateProfile);
export const forgetPassword = createAsyncThunk('auth/forgetPassword', services.forgetPassword);
export const changePassword = createAsyncThunk('auth/changePassword', services.changePassword);
export const logout = createAsyncThunk('auth/logout', services.logout);
