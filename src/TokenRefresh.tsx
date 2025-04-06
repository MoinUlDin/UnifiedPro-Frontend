import axios from "axios";
import { useEffect } from "react";

const API_BASE_URL = "https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me";
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(refreshToken)
        if (!refreshToken) return null;

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        localStorage.setItem("token", access);
        localStorage.setItem("refreshToken", refresh);

        return access;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
    }
};

const useTokenRefresher = () => {
    useEffect(() => {
        // Refresh every 3 minutes
        const interval = setInterval(refreshAccessToken, 1000 * 60 * 3);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const axiosInstance = axios.create();

        axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response?.status === 401) {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosInstance(error.config);
                    }
                }
                return Promise.reject(error);
            }
        );
    }, []);
};

export default useTokenRefresher;
