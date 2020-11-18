import { useCallback, useEffect } from 'react';
import TrackPlayer, { Track, useTrackPlayerProgress } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import differenceBy from 'lodash/differenceBy';
import last from 'lodash/last';

import { RootState } from 'store';
import { apiAxios } from 'store/axios';
import { Song } from 'types/Songs/SongResponse';

export interface SongResponse {
    code: number;
    message: string;
    data: string;
}

const getFileMp3Songs = (uuid: string): Promise<string> =>
    apiAxios.get<SongResponse>(`music/getResource/${uuid}`).then(res => res.data.data);

export const useAddTrack = () => {
    const { duration, position } = useTrackPlayerProgress();

    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, Song[]>(state => state.list.songsDemo);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const token = useSelector<RootState, string>(state => state.auth.token);

    const addPlayDemo = useCallback(async () => {
        const listPlays = await TrackPlayer.getQueue();

        if (songsDemo.length > 0) {
            const songsCompare: Track[] = songsDemo.map(item => ({
                id: `${item.uuid}`,
                url: '',
                type: 'default',
                title: item.title,
                artist: item.description || item.title,
                artwork: item.thumb,
                duration: item.time,
            }));

            const listDiff = differenceBy(songsCompare, listPlays, 'id');

            if (listDiff.length > 0) {
                const allSongsDemoMp3 = await Promise.all(listDiff.map(item => getFileMp3Songs(item.id)));

                const listNewSongsDemo: Track[] = listDiff.map((item, index) => ({
                    ...item,
                    url: allSongsDemoMp3[index],
                }));

                await TrackPlayer.add(listNewSongsDemo);
            }
        }
    }, [songsDemo]);

    const addPlaySongs = useCallback(async () => {
        const listPlays = await TrackPlayer.getQueue();

        if (songs.length > 0 && isLogin) {
            const songsCompare: Track[] = songs.map(item => ({
                id: `${item.uuid}`,
                url: '',
                type: 'default',
                title: item.title,
                artist: item.description || item.title,
                artwork: item.thumb,
                duration: item.time,
            }));

            const listDiff = differenceBy(songsCompare, listPlays, 'id');

            if (listDiff.length > 0) {
                const allSongsDemoMp3 = await Promise.all(listDiff.map(item => getFileMp3Songs(item.id)));

                const listNewSongsDemo: Track[] = listDiff.map((item, index) => ({
                    ...item,
                    url: allSongsDemoMp3[index],
                }));

                await TrackPlayer.add(listNewSongsDemo.map(i => ({ ...i, headers: { token } })));
            }
        }
    }, [isLogin, songs, token]);

    useEffect(() => {
        addPlaySongs();
    }, [addPlaySongs]);

    useEffect(() => {
        addPlayDemo();
    }, [addPlayDemo]);

    const checkTime = useCallback(async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();

        if (currentTrack) {
            const [queue, track] = await Promise.all([TrackPlayer.getQueue(), TrackPlayer.getTrack(currentTrack)]);

            if (position > duration) {
                if (last(queue)?.id === track.id) {
                    await TrackPlayer.stop();
                } else {
                    await TrackPlayer.skipToNext();
                }
            }
        }
    }, [duration, position]);

    useEffect(() => {
        checkTime();
    }, [checkTime]);
};
