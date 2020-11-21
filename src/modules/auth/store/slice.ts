import { createSlice } from '@reduxjs/toolkit';

import * as operations from './operations';
import { User } from 'types/Auth/AuthResponse';

interface State {
    isLogin: boolean;
    user: User;
    token: string;
}

const initialState: State = {
    isLogin: false,
    user: {} as User,
    token: '',
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, { payload }) => {
            state.isLogin = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(operations.register.pending, () => {});
        builder.addCase(operations.register.rejected, state => {
            state.user = {} as User;
        });
        builder.addCase(operations.register.fulfilled, (state, { payload }) => {
            state.user = payload;
        });
        //
        builder.addCase(operations.login.pending, () => {});
        builder.addCase(operations.login.rejected, state => {
            state.isLogin = false;
            state.user = {} as User;
            state.token = '';
        });
        builder.addCase(operations.login.fulfilled, (state, { payload }) => {
            state.isLogin = true;
            state.user = payload.user;
            state.token = payload.jwttoken;
        });
        //
        builder.addCase(operations.checkLoginAccount.pending, () => {});
        builder.addCase(operations.checkLoginAccount.rejected, () => {});
        builder.addCase(operations.checkLoginAccount.fulfilled, () => {});
        //
        builder.addCase(operations.updateAvatar.pending, () => {});
        builder.addCase(operations.updateAvatar.rejected, () => {});
        builder.addCase(operations.updateAvatar.fulfilled, (state, { payload }) => {
            state.user.info = payload;
        });
        //
        builder.addCase(operations.updateProfile.pending, () => {});
        builder.addCase(operations.updateProfile.rejected, () => {});
        builder.addCase(operations.updateProfile.fulfilled, (state, { payload }) => {
            state.user.info = payload;
        });
        //
        builder.addCase(operations.logout.pending, () => {});
        builder.addCase(operations.logout.rejected, () => {});
        builder.addCase(operations.logout.fulfilled, (state, { payload }) => {
            state.isLogin = false;
        });
        //
    },
});

export default auth;
