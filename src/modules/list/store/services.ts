import { apiAxios } from 'store/axios';
import { ChangeAvatarResponse } from 'types/Profile/ProfileResponse';
import { BuyListRequest } from 'types/Songs/SongRequest';
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

export const buyList = (body: BuyListRequest): Promise<string> =>
    apiAxios.post<ChangeAvatarResponse>('music/buylist', body).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
