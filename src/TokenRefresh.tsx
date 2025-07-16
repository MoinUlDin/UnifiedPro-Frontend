import axios from 'axios';
import { useEffect } from 'react';

const API_BASE_URL = 'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me';
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log(refreshToken);
        if (!refreshToken) return null;

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);

        return access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
    }
};

const useTokenRefresher = () => {};

export default useTokenRefresher;
