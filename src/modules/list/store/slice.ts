import { createSlice } from '@reduxjs/toolkit';

import * as operations from './operations';
import { Song } from 'types/Songs/SongResponse';

interface State {
    songs: Song[];
    songsDemo: Song[];
    hasNextSongs: boolean;
    hasNextSongsDemo: boolean;
    selectMultiBuy: boolean;
    listSongSelect: Song[];
    songsCategory: Song[];
}

const initialState: State = {
    songs: [],
    songsDemo: [],
    hasNextSongs: false,
    hasNextSongsDemo: false,
    selectMultiBuy: false,
    listSongSelect: [],
    songsCategory: [],
};

const list = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setSelectBuyMulti: (state, { payload }) => {
            state.selectMultiBuy = payload;
        },
        setListSongSelect: (state, { payload }) => {
            if (state.listSongSelect.some(i => i.uuid === payload.uuid)) {
                state.listSongSelect = state.listSongSelect.filter(i => i.uuid !== payload.uuid);
            } else {
                state.listSongSelect = [...state.listSongSelect, payload];
            }
        },
        setListSelect: (state, { payload }) => {
            state.listSongSelect = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(operations.fetchSongs.pending, () => {});
        builder.addCase(operations.fetchSongs.rejected, () => {});
        builder.addCase(operations.fetchSongs.fulfilled, (state, { payload }) => {
            state.songs = payload.content;
            state.hasNextSongs = !payload.last;
        });
        //
        builder.addCase(operations.fetchMoreSongs.pending, () => {});
        builder.addCase(operations.fetchMoreSongs.rejected, () => {});
        builder.addCase(operations.fetchMoreSongs.fulfilled, (state, { payload }) => {
            state.songs = [...state.songs, ...payload.content];
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
        builder.addCase(operations.addCode.pending, () => {});
        builder.addCase(operations.addCode.rejected, () => {});
        builder.addCase(operations.addCode.fulfilled, (state, { payload }) => {
            state.songs = [payload, ...state.songs];
        });
        //
        builder.addCase(operations.fetchSongsByCategoryId.pending, () => {});
        builder.addCase(operations.fetchSongsByCategoryId.rejected, () => {});
        builder.addCase(operations.fetchSongsByCategoryId.fulfilled, (state, { payload }) => {
            state.songsCategory = payload.content;
            state.hasNextSongsDemo = !payload.last;
        });
        //
        builder.addCase(operations.fetchMoreSongsByCategoryId.pending, () => {});
        builder.addCase(operations.fetchMoreSongsByCategoryId.rejected, () => {});
        builder.addCase(operations.fetchMoreSongsByCategoryId.fulfilled, (state, { payload }) => {
            state.songsCategory = [...state.songsCategory, ...payload.content];
            state.hasNextSongsDemo = !payload.last;
        });
        //
    },
});

export default list;
