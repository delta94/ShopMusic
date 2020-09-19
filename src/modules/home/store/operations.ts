import { createAsyncThunk } from '@reduxjs/toolkit';

import * as services from './services';
import { HomeResponse } from 'types/Home/HomeResponse';

export const fetchStatistic = createAsyncThunk<HomeResponse>('home/fetchStatistic', () => services.fetchStatistic());
