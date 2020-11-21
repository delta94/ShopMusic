import { apiAxios } from 'store/axios';
import { ResponseCommon } from 'types/Common';
import { ChangeAvatarResponse } from 'types/Profile/ProfileResponse';
import { BuyListRequest } from 'types/Songs/SongRequest';
import { SongResponse, SongResult, Song, SongsCategory } from 'types/Songs/SongResponse';

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

export const fetchSongsByCategoryId = ({
    category_id,
    page,
}: {
    category_id: string;
    page: number;
}): Promise<SongResult> =>
    apiAxios.get<ResponseCommon<SongsCategory>>(`music/category/${category_id}/${page}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data.content;
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

export const addCode = (code: string): Promise<Song> =>
    apiAxios.get<ResponseCommon<Song>>(`user/voucher/${code}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
