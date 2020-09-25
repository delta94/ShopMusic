import { apiAxios } from 'store/axios';

import { HomeResponse } from 'types/Home/HomeResponse';

export const fetchStatistic = (): Promise<HomeResponse> =>
    apiAxios.get<HomeResponse>('https://hrm-api.megaads.vn/statistic').then(res => res.data);
