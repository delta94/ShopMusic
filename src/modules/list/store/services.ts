import { apiAxios } from 'store/axios';
import { SongResponse, SongResult } from 'types/Songs/SongResponse';

export const fetchSongs = (page: number): Promise<SongResult> =>
    apiAxios.get<SongResponse>(`music/storage/${page}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });

export const fetchSongsDemo = (page: number): Promise<SongResult> =>
    apiAxios.get<SongResponse>(`music/demo/${page}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
