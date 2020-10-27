import { useCallback, useEffect, useMemo } from 'react';
import TrackPlayer, { Track, usePlaybackState } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import differenceBy from 'lodash/differenceBy';

import { RootState } from 'store';
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsHome } from 'modules/home/store';
import { apiAxios } from 'store/axios';

export interface SongResponse {
    code: number;
    message: string;
    data: string;
}

const getFileMp3Songs = (uuid: string): Promise<string> =>
    apiAxios.get<SongResponse>(`music/getResource/${uuid}`).then(res => res.data.data);

export const usePlay = () => {
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, Song[]>(state => state.list.songsDemo);
    const token = useSelector<RootState, string>(state => state.auth.token);

    const checkPlay = useMemo<boolean>(() => {
        if (playbackState === TrackPlayer.STATE_PLAYING || playbackState === TrackPlayer.STATE_BUFFERING) {
            return true;
        }

        return false;
    }, [playbackState]);

    const togglePlayback = useCallback(async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
            await TrackPlayer.play();
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
            } else {
                await Promise.all([TrackPlayer.pause(), dispatch(actionsHome.stopMusic(currentTrack))]);
            }
        }
    }, [dispatch, playbackState]);

    const addPlay = useCallback(async () => {
        const listPlays = await TrackPlayer.getQueue();

        if (songs.length > 0) {
            const allSongsMp3 = await Promise.all(songs.map(item => getFileMp3Songs(item.uuid)));

            const listNewSongs: Track[] = songs.map((item, index) => ({
                id: `${item.uuid}`,
                url: allSongsMp3[index],
                type: 'default',
                title: item.title,
                artist: item.description,
                artwork: item.thumb,
                duration: item.time,
            }));

            const listDiff = differenceBy(listNewSongs, listPlays, 'id');

            listDiff.length > 0 && (await TrackPlayer.add(listDiff));
        }

        if (songsDemo.length > 0) {
            const allSongsDemoMp3 = await Promise.all(songsDemo.map(item => getFileMp3Songs(item.uuid)));

            const listNewSongsDemo: Track[] = songsDemo.map((item, index) => ({
                id: `${item.uuid}`,
                url: allSongsDemoMp3[index],
                type: 'default',
                title: item.title,
                artist: item.description,
                artwork: item.thumb,
                duration: item.time,
            }));

            const listDiff = differenceBy(listNewSongsDemo, listPlays, 'id');

            listDiff.length > 0 && (await TrackPlayer.add(listDiff));
        }
    }, [songs, songsDemo]);

    useEffect(() => {
        addPlay();
    }, [addPlay]);

    const addTrack = useCallback(async () => {
        await dispatch(actionsHome.getQueue());
    }, [dispatch]);

    useEffect(() => {
        addTrack();
    }, [addTrack]);

    return { checkPlay, playbackState, togglePlayback };
};
