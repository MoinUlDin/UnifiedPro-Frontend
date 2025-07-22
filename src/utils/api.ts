import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const api: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

async function refreshToken(): Promise<string> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
        throw new Error('No refresh token');
    }
    const response = await axios.post(`${baseURL}/Auth/token/refresh/`, { refresh });
    const { access, refresh: newRefresh } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', newRefresh);
    return access;
}
function onRefreshed(token: string) {
    // invoke every queued callback, passing in the new token
    pendingRequests.forEach((cb) => cb(token));
    // clear the queue so future refreshes start fresh
    pendingRequests = [];
}
api.interceptors.response.use(
    // Pass through any successful response
    (response) => response,

    // Handle errors
    async (error: AxiosError) => {
        const originalRequest = error.config!;
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            // mark this request so we don’t loop
            (originalRequest as any)._retry = true;
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const newToken = await refreshToken();
                    onRefreshed(newToken);
                } catch (refreshError) {
                    // Refresh has failed: force logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Queue this request until the token refresh completes
            return new Promise((resolve) => {
                pendingRequests.push((token: string) => {
                    originalRequest.headers!['Authorization'] = `Bearer ${token}`;
                    resolve(api(originalRequest));
                });
            });
        }

        // Any other error, just pass it on
        return Promise.reject(error);
    }
);

export default api;
