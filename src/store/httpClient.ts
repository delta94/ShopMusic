import { apiAxios } from 'store/axios';
import { Method, AxiosRequestConfig } from 'axios';
import { ObjectAny } from 'types/Common';
import { Headers } from 'types/Axios';

export const httpRequest = <T>(endpoint: string, method?: Method, data?: Object, header?: Partial<Headers>) => {
    let options: Partial<AxiosRequestConfig> = {
        url: endpoint,
        method: method,
    };

    if (data) {
        if (method === 'get' || method === 'GET') {
            options.params = buildRequestParams(data);
        } else {
            options.data = data;
        }
    }

    if (typeof header !== 'undefined') {
        options.headers = buildCustomeHeaders(header);
    }

    return apiAxios(options).then<T>(res => res.data);
};

const buildCustomeHeaders = (headers: ObjectAny) => {
    let retval: ObjectAny = {};
    for (var key in headers) {
        retval[key] = headers[key];
    }
    return retval;
};

const buildRequestParams = (params: ObjectAny) => {
    let retval: ObjectAny = {};
    const operators = ['<=', '>=', '<', '>', '!=', '~', '!~', '={', '!={', '=[', '!=['];
    if (typeof params.page_size === 'undefined') {
        params.page_size = 20;
    }
    if (typeof params.page_id === 'undefined') {
        params.page_id = 0;
    }
    for (var key in params) {
        if (key === 'fields') {
            retval[key] = params[key].join(',');
        } else if (key === 'filters') {
            const filters = params[key];
            let strFilter = '';
            let keys = Object.keys(filters);
            for (let i = 0; i < keys.length; i++) {
                let itemK = keys[i];
                let operator = '=';
                let index = false;
                if (filters[itemK] && isNaN(filters[itemK])) {
                    for (let opt of operators) {
                        if (filters[itemK].indexOf(opt) >= 0) {
                            index = true;
                            break;
                        }
                    }
                }
                if (index) {
                    operator = '';
                }
                strFilter += `${itemK}${operator}${filters[itemK]},`;
            }
            strFilter = strFilter.slice(0, -1);
            retval[key] = strFilter;
        } else {
            retval[key] = params[key];
        }
    }
    return retval;
};
