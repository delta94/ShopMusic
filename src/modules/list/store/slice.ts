import { createSlice } from '@reduxjs/toolkit';

import * as operations from './operations';
import { Song } from 'types/Songs/SongResponse';

interface State {
    songs: Song[];
    songsDemo: Song[];
    hasNextSongs: boolean;
    hasNextSongsDemo: boolean;
}

const initialState: State = {
    songs: [],
    songsDemo: [],
    hasNextSongs: false,
    hasNextSongsDemo: false,
};

const list = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(operations.fetchSongs.pending, () => {});
        builder.addCase(operations.fetchSongs.rejected, () => {});
        builder.addCase(operations.fetchSongs.fulfilled, (state, { payload }) => {
            state.songs = payload.content;
            state.hasNextSongs = !payload.last;
        });
        //
        builder.addCase(operations.fetchSongsDemo.pending, () => {});
        builder.addCase(operations.fetchSongsDemo.rejected, () => {});
        builder.addCase(operations.fetchSongsDemo.fulfilled, (state, { payload }) => {
            state.songsDemo = payload.content;
            state.hasNextSongsDemo = !payload.last;
        });
        //
    },
});

export default list;
