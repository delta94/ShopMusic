import { useCallback, useEffect } from 'react';
import TrackPlayer, { Track, usePlaybackState, useTrackPlayerProgress } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import differenceBy from 'lodash/differenceBy';
import debounce from 'lodash/debounce';
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
    const playbackState = usePlaybackState();
    const { duration, position } = useTrackPlayerProgress();

    const songs = useSelector<RootState, Song[]>(state => state.list.songs);
    const songsDemo = useSelector<RootState, Song[]>(state => state.list.songsDemo);
    const isLogin = useSelector<RootState, boolean>(state => state.auth.isLogin);
    const token = useSelector<RootState, string>(state => state.auth.token);

    const updateTrack = useCallback(async () => {
        const [currentTrack, duration, position] = await Promise.all([
            TrackPlayer.getCurrentTrack(),
            TrackPlayer.getDuration(),
            TrackPlayer.getPosition(),
        ]);

        const numberCheck = Math.floor(duration - position);

        const checkPlay = numberCheck === 0 || numberCheck === Math.floor(duration);

        if (playbackState === TrackPlayer.STATE_PAUSED && checkPlay && !!currentTrack) {
            const trackCurrent = await TrackPlayer.getTrack(currentTrack);

            if (!!trackCurrent && !!trackCurrent.rating) {
                try {
                    await TrackPlayer.stop();
                    await TrackPlayer.remove(currentTrack);
                    const url = await getFileMp3Songs(currentTrack);
                    await TrackPlayer.add([{ ...trackCurrent, url }]);
                    await TrackPlayer.skip(currentTrack);
                    debounce(() => TrackPlayer.play(), 500)();
                } catch (error) {
                    console.log('error', error);
                }
            }
        }
    }, [playbackState]);

    // useEffect(() => {
    //     updateTrack();
    // }, [updateTrack]);

    const addPlayDemo = useCallback(async () => {
        const listPlays = await TrackPlayer.getQueue();

        if (songsDemo.length > 0) {
            const allSongsDemoMp3 = await Promise.all(songsDemo.map(item => getFileMp3Songs(item.uuid)));

            const listNewSongsDemo: Track[] = songsDemo.map((item, index) => ({
                id: `${item.uuid}`,
                url: allSongsDemoMp3[index],
                type: 'default',
                title: item.title,
                artist: item.description || item.title,
                artwork: item.thumb,
                duration: item.time,
                rating: 0,
            }));

            const listDiff = differenceBy(listNewSongsDemo, listPlays, 'id');

            listDiff.length > 0 && (await TrackPlayer.add(listDiff));
        }
    }, [songsDemo]);

    const addPlaySongs = useCallback(async () => {
        const listPlays = await TrackPlayer.getQueue();

        const allSongsMp3 = await Promise.all(songs.map(item => getFileMp3Songs(item.uuid)));

        if (songs.length > 0 && isLogin) {
            const listNewSongs: Track[] = songs
                .map((item, index) => ({
                    id: `${item.uuid}`,
                    url: allSongsMp3[index],
                    type: 'default',
                    title: item.title,
                    artist: item.description || item.title,
                    artwork: item.thumb,
                    duration: item.time,
                    rating: item.expire - item.usedTime,
                }))
                .filter(item => !!item.rating);

            const listDiff = differenceBy(listNewSongs, listPlays, 'id');

            listDiff.length > 0 && (await TrackPlayer.add(listDiff.map(i => ({ ...i, headers: { token } }))));
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
