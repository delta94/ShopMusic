import pickBy from 'lodash/pickBy';
import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

export const instance = (baseURL: string): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        timeout: 10000,
    });

    axiosInstance.interceptors.request.use(
        function (config) {
            return config;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    return axiosInstance;
};

export const apiAxios = instance('http://103.124.94.189:9333/');

export function setHeaders(params: any): void {
    const newHeaders = {
        ...apiAxios.defaults.headers.common,
        ...params,
    };
    apiAxios.defaults.headers.common = pickBy(newHeaders, val => !!val);
}
