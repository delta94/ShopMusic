import { apiAxios } from 'store/axios';

import { ResponesDetailSong } from 'types/Home/HomeResponse';
import { Song, BuyMusicRequest } from 'types/Songs/SongResponse';
import { ChangeAvatarResponse } from 'types/Profile/ProfileResponse';

export const stopMusic = (uuid: string) => apiAxios.get(`music/stop/${uuid}`);

export const getDetailSong = (uuid: string): Promise<Song> =>
    apiAxios.get<ResponesDetailSong>(`music/detail/${uuid}`).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });

export const buySong = (body: BuyMusicRequest): Promise<string> =>
    apiAxios.post<ChangeAvatarResponse>('music/buy', body).then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
