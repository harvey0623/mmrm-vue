import axios from 'axios';

const instance = axios.create({
   baseURL: process.env.VUE_APP_API_BASEURL,
   withCredentials: true,
});

//request interceptor
instance.interceptors.request.use(function (config) {
   return config;
}, function (error) {
   return Promise.reject(error);
});

//response interceptor
instance.interceptors.response.use(function (response) {
   return response;
}, function (error) {
   return Promise.reject(error);
});

export function httpConfig(option) {
   return instance(option);
}