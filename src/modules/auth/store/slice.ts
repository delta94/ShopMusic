import { createSlice } from '@reduxjs/toolkit';

interface State {
    isLogin: boolean;
}

const initialState: State = {
    isLogin: false,
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    // extraReducers: builder => {},
});

export default auth;
