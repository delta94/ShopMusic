import { createAsyncThunk } from '@reduxjs/toolkit';
import { SongResult } from 'types/Songs/SongResponse';

import * as services from './services';

export const fetchSongs = createAsyncThunk<SongResult, number>('list/fetchSongs', services.fetchSongs);
export const fetchSongsDemo = createAsyncThunk<SongResult, number>('list/fetchSongsDemo', services.fetchSongsDemo);
export const fetchSongsByCategoryId = createAsyncThunk('list/fetchSongsByCategoryId', services.fetchSongsByCategoryId);

export const fetchMoreSongs = createAsyncThunk<SongResult, number>('list/fetchMoreSongs', services.fetchSongs);
export const fetchMoreSongsDemo = createAsyncThunk<SongResult, number>(
    'list/fetchMoreSongsDemo',
    services.fetchSongsDemo,
);
export const fetchMoreSongsByCategoryId = createAsyncThunk(
    'list/fetchMoreSongsByCategoryId',
    services.fetchSongsByCategoryId,
);

export const buyList = createAsyncThunk('list/buyList', services.buyList);
export const addCode = createAsyncThunk('list/addCode', services.addCode);
