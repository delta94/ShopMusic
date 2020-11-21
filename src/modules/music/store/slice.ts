import { createSlice } from '@reduxjs/toolkit';

import { Category } from 'types/Music/MusicResponse';
import * as operations from './operations';

interface State {
    categories: Category[];
}

const initialState: State = {
    categories: [],
};

const music = createSlice({
    name: 'music',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(operations.fetchCategories.pending, () => {});
        builder.addCase(operations.fetchCategories.rejected, () => {});
        builder.addCase(operations.fetchCategories.fulfilled, (state, { payload }) => {
            state.categories = payload;
        });
        //
    },
});

export default music;
