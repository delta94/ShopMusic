import { createSlice } from '@reduxjs/toolkit';
import { State as StateTrack, Track } from 'react-native-track-player';
import { Song } from 'types/Songs/SongResponse';

import * as operations from './operations';

interface State {
    playing: boolean;
    state: StateTrack;
    track: Track;
    duration: number;
    shuffle: boolean;
    position: number;
    lastIdTrack: number | string;
    queue: Track[];
    detailSong: Song;
}

const initialState: State = {
    playing: false,
    state: 'loading',
    track: {} as Track,
    duration: 0,
    shuffle: false,
    position: 0,
    lastIdTrack: 0,
    queue: [],
    detailSong: {} as Song,
};

const home = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setUserPlaying: (state, { payload }) => {
            state.playing = payload;
        },
        setLastIdTrack: (state, { payload }) => {
            state.lastIdTrack = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(operations.playbackState.pending, () => {});
        builder.addCase(operations.playbackState.rejected, () => {});
        builder.addCase(operations.playbackState.fulfilled, (state, { payload }) => {
            state.state = payload;
        });
        //
        builder.addCase(operations.playbackTrack.pending, () => {});
        builder.addCase(operations.playbackTrack.rejected, () => {});
        builder.addCase(operations.playbackTrack.fulfilled, (state, { payload }) => {
            state.track = payload;
        });
        //
        builder.addCase(operations.getDuration.pending, () => {});
        builder.addCase(operations.getDuration.rejected, () => {});
        builder.addCase(operations.getDuration.fulfilled, (state, { payload }) => {
            state.duration = payload;
        });
        //
        builder.addCase(operations.getPosition.pending, () => {});
        builder.addCase(operations.getPosition.rejected, () => {});
        builder.addCase(operations.getPosition.fulfilled, (state, { payload }) => {
            state.position = payload;
        });
        //
        builder.addCase(operations.getQueue.pending, () => {});
        builder.addCase(operations.getQueue.rejected, () => {});
        builder.addCase(operations.getQueue.fulfilled, (state, { payload }) => {
            state.queue = payload;
        });
        //
        builder.addCase(operations.getDetailSong.pending, () => {});
        builder.addCase(operations.getDetailSong.rejected, () => {});
        builder.addCase(operations.getDetailSong.fulfilled, (state, { payload }) => {
            state.detailSong = payload;
        });
    },
});

export default home;
