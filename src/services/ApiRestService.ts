import axios, { AxiosInstance } from 'axios';
import { CacheService } from './CacheService';

export interface IApiRestService {
  getInstance: (baseApiUrl: string) => AxiosInstance;
}

export const ApiRestService: IApiRestService = {
  getInstance: (baseApiUrl: string): AxiosInstance => {
    const ApiServiceInstance = axios.create({
      baseURL: baseApiUrl,
    });

    const refreshAccessToken = async () => {
      // Update/refresh with a server call
      return CacheService.GetUserToken();
    };

    ApiServiceInstance.interceptors.request.use(
      (request) => {
        request.headers = {
          Authorization: `${CacheService.GetUserToken()}`,
        };
        return request;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    ApiServiceInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          const access_token = await refreshAccessToken();
          axios.defaults.headers.common['authorization'] = access_token;
          return ApiServiceInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return ApiServiceInstance;
  },
};
