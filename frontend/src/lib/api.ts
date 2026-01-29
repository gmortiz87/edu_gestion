import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el token JWT
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar expiración de tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const res = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                    refresh: refreshToken,
                });
                if (res.status === 200) {
                    localStorage.setItem("access_token", res.data.access);
                    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
