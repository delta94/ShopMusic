import { apiAxios } from 'store/axios';
import { ResponseCommon } from 'types/Common';

import { Category } from 'types/Music/MusicResponse';

export const fetchCategories = (): Promise<Category[]> =>
    apiAxios.get<ResponseCommon<Category[]>>('music/categories').then(res => {
        if (res.data.message === 'success') {
            return res.data.data;
        }

        return Promise.reject();
    });
