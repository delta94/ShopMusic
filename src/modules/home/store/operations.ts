import { createAsyncThunk } from '@reduxjs/toolkit';
import TrackPlayer from 'react-native-track-player';

import * as services from './services';
import { HomeResponse } from 'types/Home/HomeResponse';

export const fetchStatistic = createAsyncThunk<HomeResponse>('home/fetchStatistic', () => services.fetchStatistic());

export const playbackState = createAsyncThunk('home/playbackState', () => TrackPlayer.getState());

export const playbackTrack = createAsyncThunk('home/playbackTrack', async () => {
    const trackId = await TrackPlayer.getCurrentTrack();
    const res = await TrackPlayer.getTrack(trackId);
    if (res) return res;
    return Promise.reject();
});

export const getDuration = createAsyncThunk('home/getDuration', () => TrackPlayer.getDuration());

export const getPosition = createAsyncThunk('home/getPosition', () => TrackPlayer.getPosition());

export const getQueue = createAsyncThunk('home/getQueue', () => TrackPlayer.getQueue());

export const stopMusic = createAsyncThunk('home/stopMusic', services.stopMusic);

export const getDetailSong = createAsyncThunk('home/getDetailSong', services.getDetailSong);
