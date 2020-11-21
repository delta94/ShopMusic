import debounce from 'lodash/debounce';
import pickBy from 'lodash/pickBy';
import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { Alert } from 'react-native';

import store from 'store';
import { actions as actionsAuth } from 'modules/auth/store';
import NavigationService from 'navigation/NavigationService';

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
            if (error && error.response && error.response.status && error.response.status === 401) {
                store.dispatch(actionsAuth.logout()).then(() =>
                    debounce(() => {
                        Alert.alert(
                            'Thông báo',
                            'Token đã hết hạn hoặc bạn đã đăng nhập tài khoản ở thiết bị khác. Vui lòng đăng nhập lại.',
                        );
                        NavigationService.navigate('HomeScreen');
                    }, 1000)(),
                );
            }

            return Promise.reject(error);
        },
    );

    return axiosInstance;
};

export const apiAxios = instance('http://45.117.81.184:8080/');

export function setHeaders(params: any): void {
    const newHeaders = {
        ...apiAxios.defaults.headers.common,
        ...params,
    };
    apiAxios.defaults.headers.common = pickBy(newHeaders, val => !!val);
}
