import axios from 'axios';

// Defaults to localhost:5000 if not specified, can be overridden by env var
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 5000);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: Number.isFinite(TIMEOUT_MS) ? TIMEOUT_MS : 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            // Note: We'll handle the redirect in the component/context level or rely on protected routes
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
            // Avoid hard reload, let AuthContext handle state change if possible, 
            // but for global generic handling this is a fallback.
        }
        return Promise.reject(error);
    }
);

export default api;
