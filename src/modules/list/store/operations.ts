import { createAsyncThunk } from '@reduxjs/toolkit';
import { SongResult } from 'types/Songs/SongResponse';

import * as services from './services';

export const fetchSongs = createAsyncThunk<SongResult, number>('list/fetchSongs', services.fetchSongs);
export const fetchSongsDemo = createAsyncThunk<SongResult, number>('list/fetchSongsDemo', services.fetchSongsDemo);
