import { useCallback, useEffect } from 'react';
import TrackPlayer, { Track } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import differenceBy from 'lodash/differenceBy';

import { RootState } from 'store';
import { apiAxios } from 'store/axios';
import { Song } from 'types/Songs/SongResponse';
import { actions as actionsHome } from 'modules/home/store';

export interface SongResponse {
    code: number;
    message: string;
    data: string;
}

const getFileMp3Songs = (uuid: string): Promise<string> =>
    apiAxios.get<SongResponse>(`music/getResource/${uuid}`).then(res => res.data.data);

export const useAddTrack = () => {
    const dispatch = useDispatch();

    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, Song[]>(state => state.list.songsDemo);
    const songsCategory = useSelector<RootState, Song[]>(state => state.list.songsCategory);

    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const token = useSelector<RootState, string>(state => state.auth.token);

    const addTrack = useCallback(
        async (listSongs: Song[] = []) => {
            const listPlays = await TrackPlayer.getQueue();

            if (listSongs.length > 0) {
                const songsCompare: Track[] = listSongs.map(item => ({
                    id: `${item.uuid}`,
                    url: '',
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

                    await TrackPlayer.add(
                        listNewSongsDemo.map(i => ({ ...i, ...(isLogin && { headers: { token } }) })),
                    );

                    dispatch(actionsHome.getQueue());
                }
            }
        },
        [dispatch, isLogin, token],
    );

    const addPlayDemo = useCallback(async () => {
        addTrack(songsDemo);
    }, [addTrack, songsDemo]);

    const addPlaySongCategory = useCallback(async () => {
        addTrack(songsCategory);
    }, [addTrack, songsCategory]);

    const addPlaySongs = useCallback(async () => {
        if (isLogin) {
            addTrack(songs);
        }
    }, [addTrack, isLogin, songs]);

    useEffect(() => {
        addPlaySongs();
    }, [addPlaySongs]);

    useEffect(() => {
        addPlaySongCategory();
    }, [addPlaySongCategory]);

    useEffect(() => {
        addPlayDemo();
    }, [addPlayDemo]);
};
