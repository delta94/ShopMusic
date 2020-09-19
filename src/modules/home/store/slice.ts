import { createSlice } from '@reduxjs/toolkit';

import { HomeResponse } from 'types/Home/HomeResponse';
import * as operations from './operations';

interface State extends Omit<HomeResponse, 'status'> {}

const initialState: State = {
    birthdayStaffs: [],
    estimatedContractStaffs: [],
    increaseSalaryContractStaffs: [],
    staffs: [],
};

const home = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(operations.fetchStatistic.pending, () => {});
        builder.addCase(operations.fetchStatistic.rejected, () => {});
        builder.addCase(operations.fetchStatistic.fulfilled, (state, { payload }) => {
            state.birthdayStaffs = payload.birthdayStaffs;
            state.estimatedContractStaffs = payload.estimatedContractStaffs;
            state.increaseSalaryContractStaffs = payload.increaseSalaryContractStaffs;
            state.staffs = payload.staffs;
        });
    },
});

export default home;
