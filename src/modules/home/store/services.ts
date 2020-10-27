import { apiAxios } from 'store/axios';

import { HomeResponse, ResponesDetailSong } from 'types/Home/HomeResponse';
import { Song } from 'types/Songs/SongResponse';

export const fetchStatistic = (): Promise<HomeResponse> =>
    apiAxios.get<HomeResponse>('https://hrm-api.megaads.vn/statistic').then(res => res.data);

export const stopMusic = (uuid: string) => apiAxios.get(`music/stop/${uuid}`);

export const getDetailSong = (uuid: string): Promise<Song> =>
    apiAxios.get<ResponesDetailSong>(`music/detail/${uuid}`).then(res => res.data.data);
