import { createAsyncThunk } from '@reduxjs/toolkit';

import * as services from './services';

export const fetchCategories = createAsyncThunk('music/fetchCategories', services.fetchCategories);
